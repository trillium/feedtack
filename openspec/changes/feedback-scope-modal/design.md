## Context

Feedtack currently operates as a pin-only feedback tool. The activation button toggles crosshair mode, the user clicks an element, and a comment form appears anchored to the pin. All feedback requires at least one pin, meaning all feedback is element-scoped. The `⇧P` hotkey is the only way to enter pin mode, making it inaccessible on mobile/touch devices.

The `useFeedtack()` context was recently expanded (v0.5.1) to expose `selectedColor`, `setSelectedColor`, and `pinPalette`, and pin positioning was fixed to use document-relative coordinates for `boundingRect`.

## Goals / Non-Goals

**Goals:**
- Single entry point (button click or `⇧P`) opens a feedback modal for all scope levels
- Site and page feedback composable and browsable inside the modal
- Pin mode accessible from within the modal via a "Place a pin" button (touch-friendly)
- Payload carries a `scope` discriminator so consumers can filter/triage by scope
- Sentiment labels use "Good" / "Bad" text instead of emoji

**Non-Goals:**
- Dashboard or admin panel for triaging feedback (adapter consumers handle this)
- Real-time updates / live thread sync (polling or push is out of scope)
- Custom scope levels beyond site/page/element
- Drag-to-reposition existing pins
- Inline display of site/page feedback outside the modal (pins stay on page, general feedback lives in the modal)

## Decisions

### 1. Modal as single entry point

The "Feedback" button and `⇧P` both open a modal dialog. The modal replaces the current pin-mode toggle button behavior.

**Rationale:** A modal provides room for scope tabs, thread lists, and compose forms. It solves mobile accessibility (no keyboard needed) and creates a natural home for non-pin feedback.

**Alternative considered:** Separate buttons per scope. Rejected — more UI surface area, harder to discover, fragments the experience.

### 2. Scope as a payload field, not a type union

Add `scope: 'site' | 'page' | 'element'` to `FeedtackPayload`. Keep `pins` as an array that may be empty for site/page scope.

```typescript
interface FeedtackPayload {
  scope: 'site' | 'page' | 'element'
  pins: FeedtackPin[]  // empty for site/page
  // ...rest unchanged
}
```

**Rationale:** Additive change — existing code that reads `pins` still works. Adapters that don't understand `scope` degrade gracefully. A discriminated union (`{ scope: 'element'; pins: FeedtackPin[] } | { scope: 'site' }`) would be cleaner but forces all consumers to narrow before accessing any field.

**Alternative considered:** Discriminated union type. Rejected — breaking change to every consumer with no real benefit since `pins.length === 0` already signals "no element target."

### 3. Sentiment relabel: "Good" / "Bad"

Change `FeedtackSentiment` from `'satisfied' | 'dissatisfied' | null` to `'good' | 'bad' | null`. Update CommentForm labels to display "Good" and "Bad" as text, no emoji.

**Rationale:** Simpler, more direct language. Emoji rendering varies across platforms and can look unprofessional.

**Migration:** This is a breaking schema change. Existing payloads with `'satisfied'`/`'dissatisfied'` will need migration or dual-read support in adapters.

### 4. Modal component architecture

```
FeedtackProvider
  └─ FeedbackModal (new)
       ├─ ScopeTab: "Site" | "Page"
       │    ├─ ThreadList (existing threads for scope)
       │    └─ ComposeForm (comment + sentiment + submit)
       └─ PlacePinButton → closes modal, activates pin mode
```

The modal reuses `CommentForm` internals (comment field, sentiment toggle, submit) but renders them inline within each scope tab rather than as a floating anchored form.

**State flow:**
- `isModalOpen` — new boolean in useFeedtackState
- Selecting Site/Page tab sets a `composeScope` state
- Submit from modal creates a payload with `scope: composeScope`, empty `pins`
- "Place a pin" closes modal, sets `isPinModeActive` (existing flow takes over)

### 5. loadFeedback filter extension

Add optional `scope` to `FeedtackFilter`:

```typescript
interface FeedtackFilter {
  url?: string
  pathname?: string
  userId?: string
  scope?: 'site' | 'page' | 'element'
}
```

The modal loads site-scoped items with `{ scope: 'site' }` and page-scoped items with `{ scope: 'page', pathname }`. Existing pin-scoped loading adds `{ scope: 'element', pathname }`.

**Backward compatibility:** Adapters that don't handle `scope` in their filter logic will return all items. The UI filters client-side as a fallback.

### 6. Schema version bump to 2.0.0

Breaking changes: new required `scope` field, sentiment value changes, relaxed pins constraint.

Adapters should treat payloads without a `scope` field as `scope: 'element'` for backward compatibility with v1 data.

### 7. useFeedtack context additions

Expose modal control in the public API:

```typescript
interface FeedtackContextValue {
  // existing
  activatePinMode: () => void
  deactivatePinMode: () => void
  isPinModeActive: boolean
  selectedColor: string
  setSelectedColor: (color: string) => void
  pinPalette: readonly string[]
  // new
  openModal: () => void
  closeModal: () => void
  isModalOpen: boolean
}
```

## Risks / Trade-offs

- **[Breaking schema change]** → Mitigated by treating missing `scope` as `'element'` and bumping to v2.0.0. Adapters need updating.
- **[Sentiment value change]** → Mitigated by schema version bump. Adapters that read sentiment values need to handle both old and new values during migration.
- **[Modal complexity]** → The modal manages tabs, thread lists, compose forms, and pin-mode activation. Mitigated by decomposing into focused sub-components (ScopeTab, ThreadList, ComposeForm).
- **[Two loading patterns]** → Element feedback loads via pathname filter (existing). Site/page feedback loads via scope filter (new). Both happen on mount. Mitigated by parallel fetches.
- **[Mobile pin flow]** → After tapping "Place a pin" in modal, user must tap an element. The modal closing → crosshair appearing transition needs to feel smooth. May need a brief delay or animation.
