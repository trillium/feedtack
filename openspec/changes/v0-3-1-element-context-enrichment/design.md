## Context

v0-3-0 introduced `AncestorNode` with semantic attributes (aria-label, role, type, name, title, alt, data-testid, data-feedtack-component, nth positions, componentName). All tasks are complete. The capture layer is correct; this change fills two gaps it left open.

Relevant code before this change:

- `src/capture/target.ts` — `serializeNode()` does not read `classList` or `textContent`; `deriveElementPath()` at line 134 reads `classList` for the string path but does not persist it
- `site-docs/src/app/api/feedtack/helpers.ts` — `formatIssueBody()` ancestor loop (lines 100–107) renders only `tag`, `id`, `componentName`; `ariaLabel`, `role`, `type`, `name`, `dataTestId` are present in the payload but not displayed
- `design.md` of v0-3-0 explicitly listed "Text content enrichment" as a non-goal — this change revisits that decision

## Goals / Non-Goals

**Goals:**
- Add `classes`, `textContent`, `placeholder` to `AncestorNode` — populated at click time from the live DOM
- Fix `formatIssueBody()` to render all `AncestorNode` fields — ariaLabel, role, type, name, dataTestId, classes, textContent, placeholder
- Keep changes additive (no breaking schema changes, no adapter changes)
- No new npm dependencies on client or server

**Non-Goals:**
- `outerHTML` capture — the structured approach is superior; raw HTML requires server-side parsing, introduces truncation ambiguity, and adds a new dependency
- Source map lookup or React component name de-minification — separate problem
- Shadow DOM or iframe support
- Sensitive data scrubbing — out of scope (same stance as v0-3-0)

## Decisions

### 1. `classes: string[]` not `className: string`

Store as `string[]` (from `Array.from(el.classList)`), not the raw `className` string. An array is directly queryable by LLMs and adapters without string splitting. Matches how `ancestors` is structured as an array rather than a CSS selector string.

Alternative: store raw `className` string. Rejected — a space-separated string requires downstream parsing; the array is the right semantic unit.

### 2. `textContent` truncated at 120 characters, trimmed

`el.textContent?.trim().slice(0, 120) ?? null`. Buttons, links, and labels have short text; 120 chars is sufficient for any readable label. Prevents large text nodes (e.g. a `<p>` ancestor) from bloating the payload.

Trim before truncation to avoid leading/trailing whitespace eating into the useful budget.

### 3. `placeholder` as a separate field, not part of `textContent`

`placeholder` is semantically distinct from text content — it's the hint for an empty input, not the element's current label. Keeping it separate lets LLMs reason about it correctly (placeholder ≠ value ≠ label).

### 4. Fix the display layer without a new spec capability

The `formatIssueBody()` fix is a presentation bug in the existing webhook handler — not a new capability. It's covered under a new `issue-format` spec that formalizes what an issue body MUST render.

### 5. `textContent` is the element's own text, not recursive inner text

For deeply nested elements (a `<nav>` ancestor with many child links), `textContent` would aggregate all descendant text — noisy and potentially large. We apply the 120-char truncation as a hard ceiling. For interactive leaf elements (buttons, links, labels), `textContent` is exactly the visible label.

Alternative considered: use `innerText` (layout-aware, respects `display:none`). Rejected — `innerText` triggers layout and is slower. `textContent` is synchronous and sufficient for click-time capture.

### 6. Breakpoint resolved via `matchMedia` at submission time

`window.matchMedia(`(min-width: ${px}px)`)` walks configured breakpoints from largest to smallest and returns the first matching name. Resolved at submission time so it reflects the viewport when the user actually submits, not when the provider mounted.

Alternative considered: snapshot at mount and track via `ResizeObserver`. Rejected — adds ongoing overhead for a value only needed at submission. A single synchronous `matchMedia` battery at submit time is sufficient.

### 7. Tailwind v3 as the default breakpoint preset

Tailwind is the most widely used CSS framework in the React ecosystem. Defaulting to its breakpoints gives the majority of feedtack users a correct answer with zero config. The default is exported as `TAILWIND_BREAKPOINTS` so host apps can extend or reference it.

Alternative considered: no default (require explicit config). Rejected — `null` for every user without a configured preset is a worse default than a correct Tailwind value for most users.

Alternative considered: auto-detect framework from CSS custom properties (`--breakpoint-sm` etc.). Rejected — Tailwind v4 exposes these, but v3 does not, and Bootstrap, MUI, and custom setups vary widely. The explicit `breakpoints` prop is more reliable.

### 8. `breakpoints` threads through engine, not captured at mount

`breakpoints` flows: `FeedtackProvider` → `FeedtackEngineOpts` → `ActionContext` → `getViewportMeta(ctx.breakpoints)`. This keeps the capture layer stateless — `getViewportMeta` remains a pure function that takes config and returns metadata. No singleton, no module-level state.

## Risks / Trade-offs

- **Text content of layout wrappers is noisy** → Mitigation: 120-char truncation and trim; LLMs can ignore the field when irrelevant
- **Payload size growth** → ~50–200 bytes per pin; acceptable given the targeting value
- **`classList` is live** → `Array.from()` copies at call time, so no stale reference risk
- **Tailwind default may be wrong for non-Tailwind users** → `breakpoint` will be present but may not match their framework's names. Mitigated by the `breakpoints` prop override and clear documentation.
