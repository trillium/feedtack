# Mel Content Review & Comments System Architecture

## Overview
The content review system allows users to leave field-level comments, offer page-level feedback, and track acceptance status of content changes. It's built as a React overlay (edit mode) that integrates with Supabase for persistence.

---

## 1. STATE MANAGEMENT LAYER
**File:** `site/app/components/useEditMode.ts:14-94`

Central hook that manages all edit mode state:

### State Variables
- `active` — whether edit mode is enabled
- `comments` — all unresolved comments across all pages
- `status` — review status (which fields are unaccepted)
- `changes` — pending edits in current session
- `focusedField` — currently focused content element
- `activity` — audit log of all user actions
- `showComments` — which field's comment dialog is open
- `showCommentsPanel`, `showChanges`, `showReview`, `showFeedback`, `showActivity` — panel toggle states

### Reference Maps (for performance)
```typescript
commentsMapRef        // Map<fieldPath, Comment[]>
unacceptedSetRef      // Set<fieldPath>
changesRef            // Change[]
activityRef           // ActivityEntry[]
```

### Key Methods
- `fetchStatus()` — polls `/api/content/status` for acceptance state
- `fetchComments()` — loads comments from `/api/content/comments?page=X` for all pages
- `logActivity()` — creates audit trail entries with timestamps and undo data

---

## 2. UI ORCHESTRATION LAYER
**File:** `site/app/components/EditModeProvider.tsx:32-129`

Composition layer that orchestrates all UI components based on state:

### Component Tree
```
EditModeProvider
│
├── EditToolbar (top bar)
│   └── Shows: change count, unaccepted count, comment count, activity count
│
├── EditPanel (left side) — toggleable panels
│   ├── ReviewPanel          (acceptance status by page)
│   ├── CommentsOverview     (all field-level comments with scroll-to)
│   └── FeedbackPanel        (page-level feedback)
│
├── EditPanel (right side) — toggleable panels
│   ├── ChangesPanel         (pending edits in session)
│   └── ActivityPanel        (audit log with undo buttons)
│
└── Field-level UI — always visible over content
    ├── FieldComments       (floating dialog for active field)
    └── FieldToolbar        (Accept/Unaccept, Comment, Edit buttons)
```

### How Panels are Toggled
- Only one left/right panel open at a time
- `closeAllPanels()` is called before opening a new one
- State stored in `useEditMode()`, visual managed by `EditModeProvider`

---

## 3. VISUAL INDICATORS
**File:** `site/app/components/editFieldButtons.ts`

CSS classes applied to DOM elements to show status:

### Indicator Classes
```css
[data-unaccepted="true"]        → yellow dashed outline (#f59e0b)
[data-has-comments="true"]      → purple left border (#8b5cf6)
[contenteditable="true"]:hover  → tan outline (#c4a882)
[contenteditable="true"]:focus  → tan solid outline + background tint
```

### Functions
- `applyFieldIndicators(unacceptedSet)` — updates unaccepted outlines based on set
- `applyCommentIndicators(commentMap)` — adds purple borders where comments exist

These are called after state updates from the server.

---

## 4. INTERACTION HANDLERS
**File:** `site/app/components/editActions.ts`

Discrete action functions that:
1. Make API calls to the backend
2. Update local state
3. Trigger UI re-renders
4. Log activity

### Key Actions
```typescript
addComment(fieldPath: string)          // POST /api/content/comments
resolveComment(commentId: string)      // POST /api/content/comments/resolve
acceptField(fieldPath: string)         // POST /api/content/accept
unacceptField(fieldPath: string)       // POST /api/content/unaccept
addFeedback(body: string)              // creates comment with field_path='_feedback'
revert(change: Change)                 // undoes an edit
toggleComment(fieldPath: string)       // opens/closes FieldComments dialog
savePlaceholder(path, value, original) // saves placeholder text to content
scrollToField(page, fieldPath)         // scrolls DOM to field and highlights it
```

---

## 5. DATABASE PERSISTENCE
**Files:** `site/app/api/content/comments/*.ts`, `site/app/api/content/accept/route.ts`

### Supabase Table: `page_comments`
```typescript
interface Comment {
  id: string
  page: string              // 'home', 'coaching', etc.
  field_path: string        // 'hero.heading', or '_feedback' for page-level
  author: string            // user email
  body: string              // comment text
  resolved: boolean
  resolved_by?: string
  resolved_at?: string
  created_at: string
}
```

### API Routes

#### GET `/api/content/comments?page=home`
- Fetches unresolved comments for a page
- Used by `fetchComments()` in `useEditMode`
- Requires authentication (checked by `requireAdmin()`)

#### POST `/api/content/comments`
- Creates a new comment
- Body: `{ path: string; body: string }`
- Path format: `"page.section.field"` or `"page._feedback"`
- Returns inserted comment object
- Requires authentication

#### POST `/api/content/comments/resolve`
- Marks comment as resolved
- Body: `{ id: string }`
- Sets `resolved=true`, `resolved_by`, `resolved_at`
- Requires authentication

#### POST `/api/content/comments/unresolve`
- Reverses a resolve action
- Sets `resolved=false`, clears `resolved_by`/`resolved_at`

#### POST `/api/content/accept`
- Marks a field as accepted (reviewed and approved)
- Sets `accepted_at` timestamp on `page_content` table
- Called by `ReviewPanel` "Accept All" or `FieldToolbar` "Accept" button

#### GET `/api/content/status`
- Returns review status across all pages
- Shows which fields are unaccepted
- Used by `fetchStatus()` to update UI indicators

---

## 6. COMPONENT DETAILS

### FieldComments.tsx (lines 17-70)
Floating dialog that appears next to a focused field.

**Features:**
- Shows all comments on the field
- Text input to add new comment
- Resolve button per comment
- Closes on Escape or outside click
- Positions itself relative to the field element

**Props:**
```typescript
fieldPath: string           // e.g., "home.hero.heading"
comments: Comment[]         // comments for this field
input: string              // text being typed
onInputChange: (value: string) => void
onSubmit: () => void       // POST to /api/content/comments
onResolve: (id: string) => void
onClose: () => void
submitting?: boolean
```

### ReviewPanel.tsx (lines 8-37)
Shows acceptance status broken down by page.

**Display:**
- Green dot + "N accepted" if all fields accepted
- Yellow dot + "N / M needs review" if some unaccepted
- Lists which fields need review
- "Accept All" button per page

**Props:**
```typescript
status: StatusData         // from fetchStatus()
onAcceptAll: (page: string) => void
```

### FeedbackPanel.tsx (lines 12-72)
Shows page-level feedback (comments with field_path='_feedback').

**Features:**
- Groups feedback by page
- Shows multiple items in one feedback entry
- Resolve button per feedback
- Input to add new feedback

### CommentsOverview.tsx (lines 9-35)
List of all open comments with scrolling.

**Features:**
- Clickable field paths that scroll to element
- Shows author and date
- Resolve button
- Useful for cross-page review

### FieldToolbar.tsx (lines 42-105)
Buttons that appear above a focused field.

**Buttons:**
1. Comment (💬) — opens FieldComments
2. Accept/Unaccept — toggles acceptance state
3. Edit (✏️) — opens inline editor for form field placeholders

**Features:**
- Follows the field on scroll
- Disables buttons during async operations
- Shows comment count

### ActivityPanel.tsx (lines 18-55)
Audit log showing all actions (edits, comments, accepts, resolves).

**Display:**
- Colored icon + label per action type
- Timestamp
- Path affected
- Detail text (truncated)
- Undo button for reversible actions

---

## How They Work Together

### FULL FLOW: Adding a Comment

```
1. User clicks comment button on field
   └─ FieldToolbar.onToggleComment(fieldPath)

2. toggleComment() called in useEditMode
   └─ setShowComments(fieldPath)

3. EditModeProvider detects showComments !== null
   └─ renders <FieldComments> for that fieldPath

4. FieldComments displays:
   - All comments from commentsMapRef.get(fieldPath)
   - Text input
   - "Post" button

5. User types comment and hits "Post"
   └─ FieldComments.onSubmit()
   └─ editActions.addComment(fieldPath)

6. addComment() POSTs to /api/content/comments
   └─ Server inserts into page_comments table
   └─ Returns new Comment object

7. editActions updates state:
   └─ setComments([...comments, newComment])
   └─ commentsMapRef.set(fieldPath, [...])
   └─ logActivity('comment', fieldPath, body)

8. EditModeProvider re-renders:
   └─ FieldComments updates to show new comment
   └─ CommentsOverview count increases
   └─ EditToolbar comment count badge updates

9. editFieldButtons.applyCommentIndicators() called
   └─ Adds [data-has-comments="true"] to field element
   └─ Purple left border appears on page

10. ActivityPanel updates to show the action
```

### FULL FLOW: Accepting a Field

```
1. User clicks "Accept" button on field
   └─ FieldToolbar.onAccept()

2. acceptField(fieldPath, value) called
   └─ POSTs to /api/content/accept
   └─ Server sets accepted_at timestamp

3. Activity logged:
   └─ logActivity('accept', fieldPath, oldValue → newValue)

4. fetchStatus() is triggered
   └─ GETs /api/content/status
   └─ Rebuilds unacceptedSet

5. State updates:
   └─ unacceptedSetRef.delete(fieldPath)
   └─ applyFieldIndicators() called
   └─ Removes yellow dashed outline from field

6. ReviewPanel re-renders:
   └─ Updates count for that page
   └─ Removes field from unaccepted_fields list

7. If all fields accepted:
   └─ Page shows green dot + "N accepted"
   └─ "Accept All" button disappears
```

### FULL FLOW: Resolving a Comment

```
1. User clicks "Resolve" on a comment
   └─ Any of: FieldComments, CommentsOverview, FeedbackPanel
   └─ onResolve(commentId)

2. resolveComment(commentId) called
   └─ POSTs to /api/content/comments/resolve
   └─ Server sets resolved=true, resolved_by, resolved_at

3. State updates:
   └─ setComments(comments.filter(c => c.id !== commentId))
   └─ commentsMapRef updated
   └─ logActivity('resolve', fieldPath, commentId)

4. UI updates:
   └─ FieldComments removes the comment from list
   └─ CommentsOverview removes the entry
   └─ applyCommentIndicators() re-runs
   └─ If no more comments on field: purple border removed

5. ActivityPanel shows resolve action
   └─ Can undo: unresolves the comment
```

---

## Key Coupling Points

| Component | Reads From | Writes To | Triggers |
|-----------|-----------|----------|----------|
| EditModeProvider | useEditMode() state | Panel toggles | Re-renders children |
| FieldComments | commentsMapRef | POST /api/comments | fetchComments() refetch |
| ReviewPanel | status object | POST /api/accept | fetchStatus() refetch |
| FieldToolbar | focusedField, unacceptedSet | POST accept/unaccept | applyFieldIndicators() |
| ActivityPanel | activity array | POST actions | logActivity() entries |
| EditToolbar | All counts | Calls em.deploy() | GitHub commit push |

---

## Error Handling

All API calls are wrapped in try-catch. On error:
- User is shown toast message (EditToolbar)
- State is NOT updated
- Activity is NOT logged
- User can retry the action

---

## Authentication

All routes require `requireAdmin()` check:
- Validates Supabase session token
- Extracts user email
- Stores email as `author` or `resolved_by` in comments

Edit mode is only activated if:
1. User has valid Supabase session
2. User navigated through `/admin/callback` (magic link auth)

---

## Performance Optimizations

1. **Ref-based maps** instead of state searches
   - `commentsMapRef` for O(1) field→comments lookup
   - `unacceptedSetRef` for O(1) unaccepted checks

2. **Deduplication** of comments during fetch
   - `deduplicateComments()` in `feedbackCounting.ts`
   - Prevents duplicate comments in UI

3. **Lazy loading** of comments
   - Only fetched when CommentsPanel is opened
   - `commentsLoaded` flag prevents re-fetch

4. **Caching** with `cache: 'no-store'`
   - Ensures fresh data from server on every fetch

---

## Testing Points

- Comment creation with field path parsing
- Comment resolution with user attribution
- Field acceptance/unacceptance state transitions
- Status aggregation across pages
- Activity undo/redo for reversible actions
- DOM indicator application (visual regression tests)
- Permission checks (requireAdmin)
