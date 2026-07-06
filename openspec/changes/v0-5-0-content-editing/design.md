## Context

v0-4-0 added the content approval layer: `ContentAdapter`, `FieldApproval`, `useContentApproval`, and hash-based staleness detection. However, it computed hashes from DOM `textContent` — which is wrong when the page was statically built and the live content in the store differs. It also had no editing surface at all.

This change adds the editing layer on top: inline `contenteditable` fields, blur-to-save, adapter-backed hydration, and a contextual toolbar. React scope only; vanilla JS extraction is future scope.

The Mel site (`code/mel/site`) is the reference implementation. Key patterns borrowed: hydrate-on-activate, blur-to-save, session change tracking with revert, per-field accept/unaccept toolbar, deploy gate.

## Goals / Non-Goals

**Goals:**
- `ContentEditAdapter` as an optional extension of `ContentAdapter` — two new methods only
- Hydration: fetch live values from adapter on activate, swap into DOM before enabling editing
- Hash correctness: compute from stored value (returned by `saveField`), not DOM
- `useContentEdit` hook managing the full edit session lifecycle in React
- `ContentEditToolbar` — minimal contextual UI: approve/unaccept on focused field, session changes panel, deploy gate
- `DiskAdapter` and `WebhookAdapter` reference implementations

**Non-Goals:**
- Vanilla JS extraction (future scope)
- Rich text editing — `contenteditable` plaintext only
- Multi-user conflict resolution
- Change history persistence across sessions — session changes are in-memory only
- Undo/redo beyond simple revert-to-original

## Decisions

### D1: ContentEditAdapter extends ContentAdapter, not FeedtackAdapter

```ts
interface ContentEditAdapter extends ContentAdapter {
  loadFields(): Promise<Record<string, string>>
  saveField(fieldPath: string, value: string): Promise<void>
}
```

`saveField` is responsible for clearing the stored approval — the adapter knows how to do this atomically (e.g. Supabase upsert that deletes the approval in the same transaction). Feedtack doesn't need to call `revokeApproval` separately.

**Alternative considered:** Keep `ContentEditAdapter` independent of `ContentAdapter`. Rejected — edit without approval tracking is not useful; the inheritance makes the dependency explicit and prevents partial implementations.

### D2: Hash computed from stored value, not DOM

`useContentEdit` tracks `storedValues: Map<string, string>` — populated from `loadFields()` on activate, updated on each successful `saveField()`. `useContentApproval` receives this map and uses it for hash computation instead of reading `element.textContent`.

This requires `useContentApproval` to accept an optional `storedValues` parameter. When not provided (verification-only use case), it falls back to DOM `textContent` as before.

**Alternative considered:** Always read from DOM. Rejected — breaks when static build diverges from live store, which is the common case for any server-rendered site.

### D3: useContentEdit manages its own field state, delegates approval to useContentApproval

`useContentEdit` owns:
- `active: boolean`
- `storedValues: Map<string, string>`
- `changes: FieldChange[]` (session edits)
- DOM setup / teardown (contenteditable, listeners, MutationObserver)

It calls `useContentApproval` internally, passing `storedValues`. The returned hook surface combines both.

**Alternative considered:** Merge everything into one hook. Rejected — `useContentApproval` is a valid standalone use case (verification without editing); merging would make it impossible to use approval-only without the edit machinery.

### D4: ContentEditToolbar is a controlled, portal-rendered component

The toolbar renders near the focused field via absolute positioning (same approach as Mel's `FieldToolbar`). It receives `focusedField`, `approvalState`, `changes`, and callbacks — no internal state. `useContentEdit` owns all state; the toolbar is pure display.

No portal needed for the toolbar itself; the changes panel uses a fixed-position panel (same pattern as existing `ThreadPanel`).

### D5: saveField clears approval in the adapter, not in feedtack

The adapter is responsible for the atomic "save + clear approval" operation. This keeps feedtack from needing to know about approval storage internals. `DiskAdapter` deletes the approval file; `WebhookAdapter` includes `clearApproval: true` in the POST body.

### D6: Blur-to-save with originalValue tracking

On field focus: store `element.dataset.feedtackOriginal = currentStoredValue`.
On blur: if `getFieldValue(el) !== element.dataset.feedtackOriginal`, call `saveField()`.
On successful save: update `storedValues`, clear `data-feedtack-original`, push to `changes`.

This matches Mel's pattern exactly and avoids unnecessary saves.

## Risks / Trade-offs

[Static-build values in DOM during hydration gap] → Between page load and `loadFields()` completing, DOM shows stale built values. Mitigation: add `data-feedtack-hydrating` attribute to root during hydration; CSS can dim fields.

[contenteditable and React reconciliation] → If React re-renders a field while the user is editing, the DOM value is overwritten. Mitigation: `useContentEdit` does NOT use React state to track field values — all editing state lives in DOM data attributes and the `storedValues` Map. React re-renders only affect the toolbar.

[MutationObserver + React StrictMode double-invoke] → `useEffect` fires twice in StrictMode. Mitigation: cleanup function must fully disconnect the observer and remove all listeners; the setup is idempotent via `data-feedtack-bound` guard.

[DiskAdapter approval file naming with dots] → Field paths like `hero.heading` contain dots. Mitigation: already handled in v0-4-0 (sanitize to `hero_heading.json`); `saveField` uses same sanitization.

## Open Questions — RESOLVED 2026-07-06

- ~~Should `loadFields()` return ALL fields across all pages, or just the current page?~~ **DECIDED: all fields, no page parameter in the contract.** Field paths embed the page namespace by convention (v0-4-0 D3: `{page}.{section}.{field}`), so consumers who need scoping filter the returned map by prefix — no DOM- or route-awareness leaks into adapters. Both reference implementations already return full maps, and realistic field counts (a site's editable copy) make hydration cost a non-issue. Revisit only if a real deployment's field volume measurably slows `activate()`; the escape hatch then is an optional prefix filter argument, which is additive.
- ~~Should `ContentEditToolbar` be opt-in (consumer renders it) or auto-rendered by `useContentEdit`?~~ **DECIDED: opt-in, permanently.** A hook that renders UI as a side effect breaks the hooks contract (hooks return state; components render) and would force portal/z-index/SSR assumptions onto every consumer. The shipped shape — `useContentEdit` returns `toolbarProps`, consumer renders `<ContentEditToolbar />` where their layout wants it — keeps the hook usable headless (custom toolbars, no toolbar) and matches D4's "toolbar is pure display" principle. The v0-4-0 → v0-5-0 opt-in shipping behavior is now the documented contract, not a provisional lean.
