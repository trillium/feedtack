## 1. Project Scaffold

- [ ] 1.1 Initialize npm package with TypeScript, ESM output, and React peer dependency
- [ ] 1.2 Configure tsconfig for ESM + React JSX
- [ ] 1.3 Set up Vitest for unit tests
- [ ] 1.4 Add eslint config
- [ ] 1.5 Create package exports: `feedtack` (main), `feedtack/react` (React provider)

## 2. Payload Schema

- [ ] 2.1 Define `FeedtackPayload` TypeScript types (all fields from payload-schema spec)
- [ ] 2.2 Define `FeedtackPin` type (per-pin metadata)
- [ ] 2.3 Export schema version constant `SCHEMA_VERSION = "1.0.0"`
- [ ] 2.4 Write unit tests: payload shape validation, schema version present

## 3. Adapter Interface

- [ ] 3.1 Define `FeedtackAdapter` interface: `submit(payload): Promise<void>`
- [ ] 3.2 Implement `ConsoleAdapter` — logs payload to console.log
- [ ] 3.3 Implement `WebhookAdapter(url)` — POST with Content-Type: application/json
- [ ] 3.4 Handle non-2xx responses in WebhookAdapter (reject with status code error)
- [ ] 3.5 Handle network failures in WebhookAdapter (reject with underlying error)
- [ ] 3.6 Write unit tests for both adapters

## 4. Metadata Capture

- [ ] 4.1 Implement `getTargetMeta(element)` — selector priority chain (id → data-testid → CSS)
- [ ] 4.2 Implement `getCSSSelector(element)` — shortest unique path fallback
- [ ] 4.3 Set `best_effort: true` when no stable selector found
- [ ] 4.4 Implement `getViewportMeta()` — width, height, scrollX, scrollY, devicePixelRatio
- [ ] 4.5 Implement `getPageMeta()` — url, pathname, title
- [ ] 4.6 Implement `getDeviceMeta()` — userAgent, platform, touchEnabled
- [ ] 4.7 Implement `getPinCoords(event)` — x, y, xPct, yPct
- [ ] 4.8 Write unit tests for selector fallback chain and best_effort flag

## 5. Pin UI — Overlay and Cursor

- [ ] 5.1 Inject `<div id="feedtack-root">` at document body on provider mount
- [ ] 5.2 Apply namespaced CSS reset to feedtack-root scope
- [ ] 5.3 Implement activation button component with hotkey label (e.g., "Drop Pin [P]")
- [ ] 5.4 Implement hotkey listener — activate/deactivate pin mode on keypress
- [ ] 5.5 Toggle crosshair cursor on document when pin mode is active
- [ ] 5.6 Restore cursor on deactivation or Escape key
- [ ] 5.7 Implement `adminOnly` config — hide activation button for non-admin users

## 6. Pin UI — Pin Placement

- [ ] 6.1 Implement click handler in pin mode — place a pin marker at click coordinates
- [ ] 6.2 Define color palette (6–8 colors); assign colors to pins in order
- [ ] 6.3 Render pin marker component (colored dot/pin icon) at click position
- [ ] 6.4 Support multiple pins per session — each click adds a new pin marker
- [ ] 6.5 Show comment form anchored near first pin after first placement

## 7. Pin UI — Comment Form

- [ ] 7.1 Implement comment textarea — required, min 1 char validation
- [ ] 7.2 Block submission and show inline error when comment is empty
- [ ] 7.3 Implement satisfied/dissatisfied sentiment toggle (optional — defaults to null)
- [ ] 7.4 Implement Submit action — assembles payload and calls adapter.submit()
- [ ] 7.5 Implement Cancel action — removes all pin markers, closes form, emits nothing
- [ ] 7.6 Escape key cancels pin session when form is open
- [ ] 7.7 Surface adapter errors via `onError` callback prop if configured

## 8. Feedback State

- [ ] 8.1 Define `FeedbackItem` type — payload + replies + resolutions + per-user archives
- [ ] 8.2 Implement `loadFeedback` config option — accepts async function returning FeedbackItem[]
- [ ] 8.3 Render persisted pins on page load (re-place markers at stored coordinates)
- [ ] 8.4 Show loading state while feedback is being fetched on init
- [ ] 8.5 Implement reply thread UI on existing feedback items (ordered chronologically)
- [ ] 8.6 Implement "Mark Resolved" action — records resolver identity + timestamp
- [ ] 8.7 Support multiple resolutions on same item — append, do not overwrite
- [ ] 8.8 Implement per-user "Archive" action — hides item for current user only, attributed
- [ ] 8.9 Write unit tests for state merge logic (multi-user resolve, independent archive)

## 9. React Provider

- [ ] 9.1 Implement `<FeedtackProvider>` component accepting config props
- [ ] 9.2 Config props: `adapter`, `hotkey`, `adminOnly`, `currentUser`, `loadFeedback`, `onError`
- [ ] 9.3 Expose `useFeedtack()` hook for host app to programmatically trigger pin mode
- [ ] 9.4 Write integration test: provider mounts, button renders, pin mode activates

## 10. Documentation

- [ ] 10.1 Update README with accurate install and usage examples (script tag marked ICEBOX)
- [ ] 10.2 Add JSDoc to all public types and the adapter interface
- [ ] 10.3 Add a `CONTRIBUTING.md` with adapter authoring guide
