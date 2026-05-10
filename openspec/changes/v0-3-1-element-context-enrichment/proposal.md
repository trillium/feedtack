## Why

v0-3-0 gave feedtack a structured ancestor chain — the right abstraction for LLM-readable element context. But two fields are missing from `AncestorNode` that are trivially available at click time: **class list** and **text content**. Without them, an LLM reading a feedback issue sees tag name, position, and aria-label but not the element's visual label or utility class fingerprint.

There is also a presentation bug: `formatIssueBody()` renders the ancestor chain but ignores the already-captured `ariaLabel`, `role`, `type`, `name`, `dataTestId` fields — silently dropping data that's already in the payload.

Additionally, the viewport payload captures raw pixel dimensions but not what **CSS breakpoint** those dimensions correspond to. A 1440px viewport is meaningless without knowing whether the app calls that `lg`, `xl`, or `desktop`. The browser can resolve this at click time via `matchMedia` — no config needed for Tailwind users.

## What Changes

- `AncestorNode` gains three new fields: `classes`, `textContent`, `placeholder`
- `serializeNode()` populates them from the live DOM at click time — no new dependencies, no config required
- `FeedtackViewportMeta` gains `breakpoint?: string | null` — resolved via `matchMedia` against configured breakpoints
- `FeedtackProvider` gains an optional `breakpoints` prop; defaults to Tailwind v3 preset
- `formatIssueBody()` is updated to render all `AncestorNode` fields and show the breakpoint name alongside viewport dimensions

## Capabilities

### Modified Capabilities

- `payload-schema`: `AncestorNode` gains `classes: string[]`, `textContent: string | null`, `placeholder: string | null`; `FeedtackViewportMeta` gains `breakpoint: string | null`
- `issue-format`: Formalizes full field rendering — all `AncestorNode` fields, breakpoint in viewport line

### New Capabilities

- `viewport-breakpoint`: Breakpoint resolution via `matchMedia` at capture time, configurable preset, Tailwind v3 default

## Impact

- `src/types/payload.ts` — additive fields on `AncestorNode` and `FeedtackViewportMeta`
- `src/capture/target.ts` — `serializeNode()` reads `classList`, `textContent`, `placeholder`
- `src/capture/meta.ts` — `getViewportMeta(breakpoints?)` resolves breakpoint via `matchMedia`; exports `TAILWIND_BREAKPOINTS`
- `src/react/FeedtackProvider.tsx` — `breakpoints?` prop, threads through to engine
- `src/core/types.ts` — `breakpoints?` on `FeedtackEngineOpts`
- `src/core/actions.ts` — passes `breakpoints` to `getViewportMeta()`
- `site-docs/src/app/api/feedtack/helpers.ts` — full field rendering in `formatIssueBody()`
- No adapter contract changes
- No new npm dependencies
