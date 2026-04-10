## Context

`FeedtackProvider` currently always mounts DOM nodes, attaches keyboard and click listeners, and renders pin UI. In CI environments running visual regression tests, this produces noise in screenshots. The host app has no way to opt out without removing the provider entirely — which breaks any component that calls `useFeedtack()`.

## Goals / Non-Goals

**Goals:**
- Single prop to suppress all feedtack UI and side effects
- `useFeedtack()` remains safe to call when disabled (no throw)
- Zero behavior change when `disabled` is omitted

**Non-Goals:**
- Auto-detecting CI environments — the host app owns that decision
- Partially disabling feedtack (e.g. disable pins but keep threads)

## Decisions

### 1. disabled threads through to sub-hooks, not via conditional hook calls
React's rules of hooks prohibit calling hooks conditionally. `disabled` is passed as a parameter to `useFeedtackDom` and `usePinMode`, which guard their `useEffect` bodies with an early return. This keeps hook call order stable.

**Alternatives considered:** Conditional rendering of a stripped provider — rejected because it would require duplicating the context provision and the `useFeedtack()` safety guarantee.

### 2. No-op context value when disabled
When `disabled`, the context is still provided with `isPinModeActive: false` and no-op `activate`/`deactivate` functions. This means child components using `useFeedtack()` work correctly without knowing the provider is disabled.

### 3. Host app owns CI detection
`disabled` is a plain boolean — the host passes `disabled={!!process.env.NEXT_PUBLIC_CI}` or equivalent. The library does not inspect env vars.

## Risks / Trade-offs

- [Risk] A future hook added to the provider must remember to respect `disabled` → Mitigation: the pattern is established in `useFeedtackDom` and `usePinMode` as the convention to follow.
