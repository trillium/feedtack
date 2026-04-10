## 1. Project Scaffold

- [x] 1.1 Initialize npm package with TypeScript, ESM output, and React peer dependency
- [x] 1.2 Configure tsconfig for ESM + React JSX
- [x] 1.3 Set up Vitest for unit tests
- [x] 1.4 Add eslint config
- [x] 1.5 Create package exports: `feedtack` (main), `feedtack/react` (React provider)

## 2. Payload Schema

- [x] 2.1 Define `FeedtackPayload` TypeScript types (all fields from payload-schema spec)
- [x] 2.2 Define `FeedtackPin` type (per-pin metadata)
- [x] 2.3 Export schema version constant `SCHEMA_VERSION = "1.0.0"`
- [x] 2.4 Write unit tests: payload shape validation, schema version present

## 3. Adapter Interface

- [x] 3.1 Define `FeedtackAdapter` interface: `submit(payload): Promise<void>`
- [x] 3.2 Implement `ConsoleAdapter` — logs payload to console.log
- [x] 3.3 Implement `WebhookAdapter(url)` — POST with Content-Type: application/json
- [x] 3.4 Handle non-2xx responses in WebhookAdapter (reject with status code error)
- [x] 3.5 Handle network failures in WebhookAdapter (reject with underlying error)
- [x] 3.6 Write unit tests for both adapters

## 4. Metadata Capture

- [x] 4.1 Implement `getTargetMeta(element)` — selector priority chain (id → data-testid → CSS)
- [x] 4.2 Implement `getCSSSelector(element)` — shortest unique path fallback
- [x] 4.3 Set `best_effort: true` when no stable selector found
- [x] 4.4 Implement `getViewportMeta()` — width, height, scrollX, scrollY, devicePixelRatio
- [x] 4.5 Implement `getPageMeta()` — url, pathname, title
- [x] 4.6 Implement `getDeviceMeta()` — userAgent, platform, touchEnabled
- [x] 4.7 Implement `getPinCoords(event)` — x, y, xPct, yPct
- [x] 4.8 Write unit tests for selector fallback chain and best_effort flag

## 5. Pin UI — Overlay and Cursor

- [x] 5.1 Inject `<div id="feedtack-root">` at document body on provider mount
- [x] 5.2 Apply namespaced CSS reset to feedtack-root scope
- [x] 5.3 Implement activation button component with hotkey label (e.g., "Drop Pin [P]")
- [x] 5.4 Implement hotkey listener — activate/deactivate pin mode on keypress
- [x] 5.5 Toggle crosshair cursor on document when pin mode is active
- [x] 5.6 Restore cursor on deactivation or Escape key
- [x] 5.7 Implement `adminOnly` config — hide activation button for non-admin users

## 6. Pin UI — Pin Placement

- [x] 6.1 Implement click handler in pin mode — place a pin marker at click coordinates
- [x] 6.2 Define color palette (6–8 colors); assign colors to pins in order
- [x] 6.3 Render pin marker component (colored dot/pin icon) at click position
- [x] 6.4 Support multiple pins per session — each click adds a new pin marker
- [x] 6.5 Show comment form anchored near first pin after first placement

## 7. Pin UI — Comment Form

- [x] 7.1 Implement comment textarea — required, min 1 char validation
- [x] 7.2 Block submission and show inline error when comment is empty
- [x] 7.3 Implement satisfied/dissatisfied sentiment toggle (optional — defaults to null)
- [x] 7.4 Implement Submit action — assembles payload and calls adapter.submit()
- [x] 7.5 Implement Cancel action — removes all pin markers, closes form, emits nothing
- [x] 7.6 Escape key cancels pin session when form is open
- [x] 7.7 Surface adapter errors via `onError` callback prop if configured

## 8. Feedback State

- [x] 8.1 Define `FeedbackItem` type — payload + replies + resolutions + per-user archives
- [x] 8.2 Implement `loadFeedback` config option — accepts async function returning FeedbackItem[]
- [x] 8.3 Render persisted pins on page load (re-place markers at stored coordinates)
- [x] 8.4 Show loading state while feedback is being fetched on init
- [x] 8.5 Implement reply thread UI on existing feedback items (ordered chronologically)
- [x] 8.6 Implement "Mark Resolved" action — records resolver identity + timestamp
- [x] 8.7 Support multiple resolutions on same item — append, do not overwrite
- [x] 8.8 Implement per-user "Archive" action — hides item for current user only, attributed
- [x] 8.9 Write unit tests for state merge logic (multi-user resolve, independent archive)

## 9. React Provider

- [x] 9.1 Implement `<FeedtackProvider>` component accepting config props
- [x] 9.2 Config props: `adapter`, `hotkey`, `adminOnly`, `currentUser`, `loadFeedback`, `onError`
- [x] 9.3 Expose `useFeedtack()` hook for host app to programmatically trigger pin mode
- [x] 9.4 Write integration test: provider mounts, button renders, pin mode activates

## 10. Documentation

- [x] 10.1 Update README with accurate install and usage examples (script tag marked ICEBOX)
- [x] 10.2 Add JSDoc to all public types and the adapter interface
- [x] 10.3 Add a `CONTRIBUTING.md` with adapter authoring guide

## 11. Payload Enhancements (v0.0.4)

- [x] 11.1 Add `testId` field to `FeedtackPinTarget` — always shipped, null when absent
- [x] 11.2 Add `elementPath` field — readable `tag.class` DOM ancestry, stops at data-testid ancestor
- [x] 11.3 Write tests: testId present/absent, elementPath ancestry, elementPath stops at testid ancestor

## 12. LocalStorage Adapter

- [x] 12.1 Implement `LocalStorageAdapter` with full adapter interface
- [x] 12.2 Support custom storage key via config
- [x] 12.3 Handle corrupted localStorage gracefully
- [x] 12.4 Write tests: persist/load, filtering, reply, resolve, archive, custom key, corruption

## 13. Pin UX Improvements

- [x] 13.1 Fix pin marker anchor — bottom tip at click point, not top-left
- [x] 13.2 Add arrow key (left/right) color cycling in pin mode

## 14. Code Quality Tooling

- [x] 14.1 Add husky with pre-commit and commit-msg hooks
- [x] 14.2 Add commitlint with conventional commit enforcement
- [x] 14.3 Add biome for linting and formatting (replacing eslint)
- [x] 14.4 Add lint-staged to run biome on staged files
- [x] 14.5 Add 250-line file limit pre-commit check (tests/configs exempt)

## 15. Provider Refactor

- [x] 15.1 Extract `usePinMode` hook — activation, cursor, hotkey, color cycling, click-to-place
- [x] 15.2 Extract `useFeedtackDom` hook — style injection, root div, theme tokens
- [x] 15.3 Extract `ThreadPanel` component — reply list, actions, reply input
- [x] 15.4 Extract `utils.ts` — ID generation, anchored positioning, cx()
- [x] 15.5 Slim `useFeedtackState` to data/actions layer composing usePinMode + useFeedtackDom
- [x] 15.6 Slim `FeedtackProvider` to composition shell under 250 lines
- [x] 15.7 Verify all source files under 250 lines post-biome formatting
