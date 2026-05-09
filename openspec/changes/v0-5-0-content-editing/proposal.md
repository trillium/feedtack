## Why

The content approval system (v0-4-0) lets teams verify that copy has been signed off, but provides no way to actually edit it — teams still need to build their own editing UI and wire it to whatever storage they use. This change closes that gap by adding an optional editing layer that turns annotated fields into inline-editable content, persists changes through the adapter, and integrates directly with the approval flow.

## What Changes

- New `ContentEditAdapter` interface — extends `ContentAdapter` with `loadFields()` (fetch live values for hydration) and `saveField()` (persist an edit and clear its approval)
- `saveField()` clears the stored approval for the edited field — edit invalidates sign-off, matching Mel's behavior
- Hash for approval is computed from the **stored value** returned by `saveField()` / `loadFields()`, not DOM `textContent`, to avoid static-build mismatch
- New `useContentEdit(adapter, userId)` React hook — activates edit mode: hydrates DOM from adapter, sets `contenteditable` on all `[data-feedtack-field]` elements, attaches blur-to-save, MutationObserver for dynamic fields
- New `ContentEditToolbar` React component — contextual per-field toolbar (approve, unaccept) that appears on field focus, plus a changes panel (session edits + revert) and a deploy gate button
- `DiskAdapter` and `WebhookAdapter` updated to optionally implement `ContentEditAdapter`
- React scope only — vanilla JS extraction is future scope
- All DOM manipulation lives in `feedtack/react`; only types live in core
- `ContentEditAdapter` is optional — adapters implementing only `ContentAdapter` continue to work for verification-only use cases

## Capabilities

### New Capabilities
- `content-edit-adapter`: `ContentEditAdapter` interface, `loadFields()` + `saveField()` contract, type guard, dev-mode warning
- `content-edit-mode`: React hook (`useContentEdit`) — hydration, contenteditable activation, blur-to-save, MutationObserver, session change tracking
- `content-edit-toolbar`: `ContentEditToolbar` React component — per-field approve/unaccept, changes panel with revert, deploy gate

### Modified Capabilities
- `content-approval`: Hash computation changes — hash is derived from stored value (via `loadFields` / `saveField` response), not DOM `textContent`

## Impact

- `src/types/adapter.ts` — new `ContentEditAdapter` interface, `isContentEditAdapter` type guard
- `src/react/useContentEdit.ts` — new hook
- `src/react/ContentEditToolbar.tsx` — new component
- `src/react/index.ts` — export new hook and component
- `src/adapters/DiskAdapter.ts` — implement `ContentEditAdapter`
- `src/adapters/WebhookAdapter.ts` — implement `ContentEditAdapter`
- `src/capture/content.ts` — `hashField` used with stored values, not DOM; no signature change
- No breaking changes to existing `FeedtackAdapter` or `ContentAdapter` interfaces
