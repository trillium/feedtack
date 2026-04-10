## Context

feedtack is a greenfield OSS library. There is no existing code to migrate. The target environment is React apps (Next.js and plain React). The primary delivery mechanism is an npm package imported as a React provider. The payload is the product — the design centers on making the emitted JSON maximally useful to a downstream LLM or developer.

## Goals / Non-Goals

**Goals:**
- Drop-in React provider with zero required SaaS dependency
- Versioned, stable JSON payload schema
- Pluggable backend adapter interface with a bundled webhook adapter
- Persistent feedback state (survives navigation)
- Reply threads and multi-user resolution/archive tracking
- Plain div + CSS reset DOM isolation (portable, low complexity)

**Non-Goals:**
- LLM triage, routing, or summarization (Tool 2, separate repo)
- Developer inbox or dashboard UI
- Screenshot or video annotation
- Canvas/SVG/iframe deep targeting in v1
- Script tag CDN distribution in v1

## Decisions

### 1. DOM isolation: plain div + CSS reset
A single `<div id="feedtack-root">` injected at the document body level, with all feedtack styles namespaced under `.feedtack-*` and a full CSS reset applied within that scope. Shadow DOM is not used — it complicates event handling and DOM traversal needed for metadata capture. An iframe is not used — it would prevent direct DOM access across the boundary.

**Alternatives considered:** Shadow DOM (rejected — event and selector complexity), iframe (rejected — cross-frame DOM access impossible without postMessage).

### 2. Adapter interface: plugin contract with bundled webhook
feedtack defines `interface FeedtackAdapter { submit(payload): Promise<void> }`. Users may supply any object implementing this interface. The bundled adapters are:
- `WebhookAdapter(url)` — POSTs JSONL to a URL
- `ConsoleAdapter()` — logs to console for local dev

This keeps feedtack backend-agnostic. Supabase, Linear, Slack, or custom adapters can be written without forking.

**Alternatives considered:** Fixed adapter list (rejected — too opinionated, locks out custom infra).

### 3. Selector strategy: id → data-testid → CSS, best_effort flag
Priority chain at click time:
1. Element `id` attribute
2. `data-testid` attribute (common in React test setups)
3. Shortest unique CSS selector path

If no stable path found, `best_effort: true` is set in the payload. Submission is never blocked. XPath is not used — it is fragile and less readable.

### 4. State persistence: adapter-backed, not localStorage
Feedback state (submitted items, replies, resolutions, archives) is stored via the adapter — not in localStorage or sessionStorage. This ensures state is shared across users and sessions. For the webhook adapter, the host app's backend is responsible for persisting and serving state back to feedtack on init via a `loadFeedback` config option.

**Alternatives considered:** localStorage (rejected — per-device only, not multi-user), sessionStorage (rejected — lost on tab close).

### 5. Distribution: npm ESM + React provider only (v1)
`import { FeedtackProvider } from 'feedtack'` is the only supported integration in v1. A `<FeedtackProvider>` wraps the app and accepts config props. Script tag CDN and framework-specific plugins (Next.js) are ICEBOX for post-v1.

### 7. Pin coordinates: document-relative
Pins are stored as `pageX = clientX + scrollX`, `pageY = clientY + scrollY`. This ensures pins render at the correct document position regardless of scroll state on re-render. Viewport-relative coordinates were rejected because they break when the page is scrolled between capture and re-render.

### 8. Color selection: user-driven, free choice
The palette has 6 fixed colors. The user selects any color before placing each pin. Color carries no semantic meaning — it exists for the user's personal convention (e.g. "red = critical, blue = copy"). No cycling logic needed; user always chooses.

### 9. Default hotkey: Shift+P
`Shift+P` is the default activation hotkey. It avoids conflicts with screen reader conventions (which use Alt+key on Windows). Host apps may override via config.

### 10. Existing pin interaction: click → anchored panel
Persisted pins show an unread notification badge when there is activity the current user hasn't seen. Clicking a pin opens an anchored modal/popover using the same edge-detection logic as the comment form. The panel shows the thread (original comment + replies) and action buttons (Reply, Mark Resolved, Archive).

### 11. Adapter interface: full write surface
All write and read operations go through the adapter: `submit`, `reply`, `resolve`, `archive`, `loadFeedback`. `loadFeedback` accepts an optional filter (`{ url?, pathname?, userId? }`); called with no filter it returns all items. The host app owns state management of returned items.

### 6. Multi-user resolution and archive: server-authoritative
Resolved and archive states are per-user records stored in the adapter backend. The payload schema for state updates mirrors the feedback payload shape. feedtack does not attempt to merge or reconcile state client-side — the adapter is the source of truth.

### 12. Pin marker anchor point: bottom tip
The pin marker's pointy tip (the teardrop corner) SHALL align with the exact click coordinate. The CSS `transform` uses `translate(-50%, -100%)` with `transform-origin: bottom center` so the visual pin "sticks into" the page at the click point, not offset above or beside it.

### 13. testId always shipped as first-class field
The `data-testid` attribute value is always shipped as `target.testId` (string | null) in the payload, regardless of which selector strategy wins. This ensures downstream LLM consumers and dogfooding systems can reliably find test IDs without parsing the `attributes` bag.

### 14. elementPath for DOM ancestry context
When an element has no `data-testid`, the system captures a readable `tag.class` ancestry path (e.g. `div.hero > button.btn.btn-primary`). The walk stops at body or at the nearest ancestor with a `data-testid` (which becomes an anchor like `[data-testid="card"] > span.label > em`). When the element itself has a `testId`, `elementPath` is null — the testId is sufficient context.

### 15. Arrow key color cycling
In pin mode, left/right arrow keys cycle through the color palette. This avoids requiring the user to click the color picker for every color change — particularly useful when placing multiple pins rapidly.

### 16. LocalStorageAdapter for zero-infrastructure use
A `LocalStorageAdapter` implements the full adapter interface using only the browser's `localStorage`. It is single-user, single-device, and handles corrupted data gracefully (returns empty array). Intended for local dev, demos, and dogfooding. Custom storage keys are supported to avoid collisions.

### 17. 250-line file limit enforced via pre-commit hook
Source `.ts`/`.tsx` files (excluding tests and configs) must be under 250 lines. This is enforced by a husky pre-commit hook. The limit drives architectural decomposition along natural responsibility boundaries rather than line-gaming (e.g. cramming multiple declarations per line).

## Risks / Trade-offs

- [CSS bleed] Host app styles may conflict with feedtack UI despite CSS reset → Mitigation: use highly specific class names (`.feedtack-pin-marker`) and audit against common CSS frameworks (Tailwind, Bootstrap)
- [State latency] If the adapter is slow, pins may not reappear immediately on reload → Mitigation: show a loading state while feedback is fetched on init
- [Selector instability] CSS selectors may break if the host app refactors DOM structure → Mitigation: `best_effort: true` signals downstream consumers not to rely on the selector for automated targeting
- [Broad DOM access] feedtack reads full page state — security scope is intentionally wide in v1 → Mitigation: document clearly; provide an `allowedCaptures` config option in v2 to scope what is collected

## Open Questions

~~Should `loadFeedback` be a required config option for the webhook adapter, or optional?~~
**Decision:** Required. The webhook adapter must be initialized with a `loadFeedback` function.

~~Pin color palette: fixed set of 6–8 colors, or user-configurable?~~
**Decision:** Fixed set of 6 colors in v1.

~~Should the comment form be positioned relative to the first pin or centered in the viewport?~~
**Decision:** Anchored near the first pin, with edge detection to flip sides when near a screen edge.
