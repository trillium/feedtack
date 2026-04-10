# v0.0.0 Learnings — From Mel Content Review to feedtack

## Origin Story

feedtack grew out of the **Mel Content Review & Comments System** — a bespoke React overlay built for a specific client site. That system let admins leave field-level comments, accept/reject content changes, and track an audit log, all wired to Supabase via Next.js API routes.

The insight: the *feedback capture* part of that system was the most reusable piece, but it was buried inside a monolith with CMS-specific concerns (field acceptance, content editing, deploy triggers). feedtack extracts and generalizes the pin-and-comment interaction into a standalone library.

---

## What Carried Forward

### 1. Overlay-on-page architecture
Mel rendered its edit mode UI as a React overlay on top of the live site — toolbars, panels, and floating dialogs all positioned over existing content. feedtack kept this exact pattern: a `<div id="feedtack-root">` injected at body level with all UI rendered inside it.

### 2. Field-level comment dialogs → Pin-anchored forms
Mel's `FieldComments` floated next to a focused field. feedtack's comment form floats next to the first placed pin. Same interaction pattern (anchored popover with edge detection), but generalized from "content fields" to "anywhere on the page."

### 3. Resolve/unresolve with attribution
Mel tracked `resolved_by` and `resolved_at` on comments. feedtack kept this as `FeedtackResolution` with `resolvedBy: FeedtackUser` and `timestamp`. The data shape matured but the concept is identical.

### 4. Comment threading
Mel had reply threads on field comments. feedtack has `FeedtackReply[]` on each `FeedbackItem`. Same structure, decoupled from the CMS field model.

### 5. State loaded from server on mount
Mel's `useEditMode` called `fetchComments()` and `fetchStatus()` on init. feedtack calls `adapter.loadFeedback()` on mount. Both assume the server is the source of truth and the client hydrates from it.

### 6. Escape key to cancel
Both systems use Escape to close active dialogs and deactivate the current mode.

### 7. Error boundary via callback
Mel used try-catch with toast notifications. feedtack exposes `onError` — same pattern, but the host app owns the notification UI.

---

## What Changed

### 1. Fixed fields → Freeform pins
**Mel:** Comments were anchored to known content fields (`hero.heading`, `about.body`). The system knew every field path in advance.
**feedtack:** Users click *anywhere* on the page. The system discovers what's there at click time via DOM introspection. This was the biggest conceptual shift — from a closed field model to an open spatial model.

### 2. Supabase-coupled → Adapter interface
**Mel:** Hard-wired to Supabase tables (`page_comments`) and Next.js API routes (`/api/content/comments`).
**feedtack:** Defines `FeedtackAdapter` — a five-method interface (`submit`, `reply`, `resolve`, `archive`, `loadFeedback`). Ships with `WebhookAdapter` and `ConsoleAdapter`. Any backend can implement the contract.

### 3. Field acceptance/review → Removed entirely
**Mel:** Had a full acceptance workflow — fields could be accepted/unaccepted, with visual indicators (yellow outlines) and a ReviewPanel tracking status per page.
**feedtack:** Dropped this. It's a CMS concern, not a feedback concern. feedtack captures feedback; the host system decides what to do with it.

### 4. Visual field indicators → No host DOM mutation
**Mel:** Applied `data-unaccepted` and `data-has-comments` attributes to host page elements, adding colored borders.
**feedtack:** Never mutates the host DOM. All visual state (pins, forms, panels) lives inside `feedtack-root`. This was a deliberate isolation decision to avoid CSS conflicts and side effects.

### 5. Edit-in-place → Read-only capture
**Mel:** Supported `contenteditable` fields, placeholder editing, and a ChangesPanel tracking pending edits.
**feedtack:** Purely observational. It captures what's on the page but never modifies it. The "edit" side is a downstream concern for whoever consumes the payload.

### 6. Activity/audit log → Removed
**Mel:** Maintained a full `ActivityPanel` with undo buttons and action history.
**feedtack:** No client-side audit log. The adapter backend can log whatever it wants — feedtack just emits events.

### 7. Auth-coupled → Auth-agnostic
**Mel:** Required `requireAdmin()` on every API route, tied to Supabase magic link auth.
**feedtack:** Accepts a `currentUser` prop. The host app handles auth however it wants. feedtack stamps the user on payloads but never verifies identity.

### 8. Single comment per field → Multiple pins per submission
**Mel:** One comment dialog per field, independent threads.
**feedtack:** Multiple color-coded pins can be placed in a single session, all linked to one comment. This models "here, here, and here — all part of the same issue."

---

## What Was Learned

### The payload is the product
Mel's value was in the UI workflow. feedtack's value is in the *data it emits*. The versioned JSON payload with full DOM context (selector, bounding rect, viewport, scroll, device) is designed so an LLM can act on it without a human developer triaging first. This reframing — from "review tool" to "structured signal emitter" — shaped every design decision.

### DOM context capture didn't exist in Mel
Mel knew its fields because they were hardcoded. feedtack had to invent the selector priority chain (`id → data-testid → CSS path`) and the `best_effort` flag to handle the open world. The `getTargetMeta()` function has no analog in the original system.

### CSS isolation matters more in a library
Mel could get away with direct `data-*` attribute styles because it controlled the host app. feedtack uses namespaced `.feedtack-*` classes with a full CSS reset inside its root div, plus `!important` overrides to survive Tailwind v4 preflight. This was learned the hard way (see commit `c74ae4a`).

### The adapter interface emerged from pain
Mel's Supabase coupling meant every deployment required the same database schema. The adapter interface was born from wanting to let people use feedtack with *any* backend — or no backend at all (`ConsoleAdapter` for local dev). The five-method surface (`submit`, `reply`, `resolve`, `archive`, `loadFeedback`) maps 1:1 to the actions that existed in Mel's `editActions.ts`, just behind an abstraction boundary.

### Multi-user state is the adapter's problem
Mel tried to manage state client-side with ref-based maps (`commentsMapRef`, `unacceptedSetRef`). feedtack punts state management to the adapter entirely. The client holds a `feedbackItems` array loaded at mount time and appended optimistically — but the adapter backend is always the source of truth. This simplified the React code dramatically.

---

## Summary

| Concern | Mel (v0) | feedtack (v1) |
|---------|----------|---------------|
| Targeting | Known field paths | Freeform DOM click |
| Backend | Supabase + Next.js routes | Adapter interface |
| Auth | Supabase magic link | Host-provided `currentUser` |
| DOM mutation | Yes (indicators on fields) | No (isolated root div) |
| Editing | contenteditable + changes panel | Read-only capture |
| Acceptance workflow | Full (accept/unaccept/review) | None |
| Audit log | ActivityPanel with undo | None (adapter's concern) |
| Payload | Comments table row | Versioned JSON with full DOM context |
| Distribution | Embedded in one site | npm package |
| Pins per submission | One comment per field | Multiple spatial pins, one thread |
