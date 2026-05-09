## 1. Types

- [x] 1.1 Add `ContentEditAdapter` interface to `src/types/adapter.ts` (extends `ContentAdapter` with `loadFields` + `saveField`)
- [x] 1.2 Add `isContentEditAdapter` type guard and `warnIfNotContentEditAdapter` to `src/types/adapter.ts`
- [x] 1.3 Add `FieldChange` and `FocusedFieldInfo` types to `src/types/payload.ts`
- [x] 1.4 Export new types from `src/types/index.ts` and package root

## 2. Adapter Implementations

- [x] 2.1 Implement `ContentEditAdapter` on `DiskAdapter` — `saveField` writes to `<dir>/fields/<path>.json` and deletes `<dir>/approvals/<path>.json`; `loadFields` reads all `<dir>/fields/` JSON files
- [x] 2.2 Implement `ContentEditAdapter` on `WebhookAdapter` — `saveField` POSTs `{ type: 'save-field', fieldPath, value, clearApproval: true }` to `updateUrl`; `loadFields` delegates to new `loadFields` config function

## 3. useContentApproval — storedValues option

- [x] 3.1 Update `useContentApproval` signature to accept optional `options?: { storedValues?: Map<string, string> }`
- [x] 3.2 Update hash computation in `useContentApproval` to use `storedValues.get(fieldPath) ?? element.textContent` when `storedValues` is provided

## 4. useContentEdit Hook

- [x] 4.1 Create `src/react/useContentEdit.ts` — manages `active`, `storedValues`, `changes`, `saving`, `focusedField`
- [x] 4.2 Implement `activate()` — sets `data-feedtack-hydrating`, calls `loadFields()`, hydrates DOM, removes hydrating attr, sets `contenteditable` + listeners on all `[data-feedtack-field]` elements
- [x] 4.3 Implement `deactivate()` — removes `contenteditable`, detaches listeners, disconnects MutationObserver
- [x] 4.4 Implement blur-to-save — on blur, compare `getFieldValue(el)` to `el.dataset.feedtackOriginal`; if changed, call `saveField()`, update `storedValues`, push/update `FieldChange`
- [x] 4.5 Implement MutationObserver — detect new `[data-feedtack-field]` nodes and apply contenteditable + listeners
- [x] 4.6 Implement `revert(fieldPath)` — call `saveField(fieldPath, change.from)`, remove from `changes`
- [x] 4.7 Wire `useContentApproval` internally with `storedValues` map; expose approval passthrough on returned object
- [x] 4.8 Return `toolbarProps` object from hook containing all props needed for `ContentEditToolbar`

## 5. ContentEditToolbar Component

- [x] 5.1 Create `src/react/ContentEditToolbar.tsx` — accepts `ContentEditToolbarProps`, renders per-field actions (approve/unaccept), saving indicator
- [x] 5.2 Add collapsible changes panel — lists `FieldChange[]` with field path, new value preview, and revert button
- [x] 5.3 Add deploy gate button — calls `onCheckDeploy()`, renders pending field list or all-approved state

## 6. Exports

- [x] 6.1 Export `useContentEdit` from `feedtack/react`
- [x] 6.2 Export `ContentEditToolbar` and `ContentEditToolbarProps` from `feedtack/react`

## 7. Tests

- [x] 7.1 Unit tests for `isContentEditAdapter` type guard
- [x] 7.2 Tests for `DiskAdapter` `ContentEditAdapter` methods — `saveField` persists and clears approval, `loadFields` returns stored fields
- [x] 7.3 Tests for `useContentApproval` `storedValues` option — hash uses stored value when provided, falls back to DOM when not
- [x] 7.4 Tests for `useContentEdit` — activate hydrates DOM, blur-to-save triggers on change, no save on unchanged blur, revert calls saveField with original value

## 8. Documentation

- [x] 8.1 Create `site-docs/content/docs/concepts/content-editing.mdx` — covers activation, hydration, blur-to-save, `ContentEditToolbar`, `useContentEdit`, adapter requirements
- [x] 8.2 Add `content-editing` to `site-docs/content/docs/concepts/meta.json` pages array
- [x] 8.3 Update `content-approval.mdx` — note that `useContentApproval` accepts optional `storedValues` when used with `useContentEdit`
