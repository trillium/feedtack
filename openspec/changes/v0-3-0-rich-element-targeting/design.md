## Context

`src/capture/target.ts` is the sole change surface. Current shape:
- `getTargetMeta(element)` — captures id, testId, CSS selector, elementPath, tagName, textContent, raw attributes, boundingRect
- `getCSSSelector(element)` — walks to body building nth-of-type selector
- `getElementPath(element)` — walks to body or nearest data-testid ancestor

The payload is used by downstream LLMs to locate elements in source code. Current weaknesses: clicks on SVG icons inside buttons capture the wrong element; no component names; elementPath is tag.class only (not semantic); textContent adds noise without adding locatability.

## Goals / Non-Goals

**Goals:**
- Resolve click target to nearest interactive ancestor before any metadata capture
- Add semantic attribute set to target and ancestor nodes (aria-label, type, name, title, alt, data-testid, data-feedtack-component)
- Walk up to 5 ancestors and serialize each with the same semantic set + nth-child/nth-of-type
- Extract React component display names from fiber for target and each ancestor
- Keep bundle impact minimal (~1kb gzipped budget for fiber code)

**Non-Goals:**
- Text content enrichment (not a priority for LLM targeting)
- Sensitive data scrubbing (out of scope)
- Shadow DOM or iframe support
- Non-React framework component name extraction
- Breaking changes to existing adapter contracts

## Decisions

### 1. Interactive ancestor resolution via `element.closest()`
Use `element.closest('button,a,input,select,textarea,label')` before any metadata capture. If a match is found and it's not the clicked element itself, promote it as the target. This is ~2 lines and handles the SVG-in-button case cleanly.

Alternative considered: walk `parentElement` manually. Rejected — `closest()` is simpler, well-supported, and handles the same cases.

### 2. Ancestor chain: array of `AncestorNode`, depth 5
Replace `elementPath` (a string) with `ancestors: AncestorNode[]` (an array of structured objects). Each `AncestorNode` has: `tag`, `id`, `ariaLabel`, `role`, `type`, `name`, `title`, `alt`, `dataTestId`, `dataFeedtackComponent`, `nthChild`, `nthOfType`, `componentName`.

Alternative considered: keep the string `elementPath` and extend it. Rejected — a string is opaque to LLMs and hard to extend; structured array is directly queryable and composable.

Depth capped at 5 (Sentry convention). Walking to body risks including irrelevant layout wrappers.

### 3. nth-child / nth-of-type via sibling walks
For each node, compute `nthChild` by counting `previousElementSibling` until null, and `nthOfType` by counting same-tag siblings. Only populate when the node has no `id` or `data-testid` — stable identifiers make position unnecessary.

### 4. React fiber component names
Access fiber via `element.__reactFiber$<key>` (React 18+) or `element._reactFiber` fallback. Walk `fiber.return` until a node with a non-null, non-host `type.displayName` or `type.name` is found. Wrap entirely in try/catch — fiber internals are not a public API and can throw in any minified build.

The fiber key suffix (`__reactFiber$<hash>`) must be discovered at runtime by scanning `Object.keys(element)` for a key starting with `__reactFiber$`. Cache the key name once discovered to avoid repeated scans.

Alternative considered: require users to annotate all components with `data-feedtack-component`. Rejected as primary strategy — too much burden. fiber traversal is automatic; `data-feedtack-component` is the opt-in escape hatch for explicit labeling.

### 5. data-feedtack-component as first-class field
Recognized on target and every ancestor node. Takes precedence in `componentName` resolution: `data-feedtack-component` value → fiber display name → null.

### 6. Type changes are additive
`FeedtackPinTarget` gains `ancestors: AncestorNode[]` and replaces `elementPath: string | null` with `elementPath: string | null` (retained for backward compat, but now derived from ancestors on write). `textContent` retained but moved to a separate optional field. `attributes: Record<string,string>` removed — replaced by the structured semantic fields.

### 7. File split: `target.ts` → `target.ts` + `fiber.ts`
Fiber traversal code goes in `src/capture/fiber.ts` to keep it isolated and tree-shakeable. `target.ts` imports from it. Both stay under the 250-line file limit.

## Risks / Trade-offs

- **Fiber key instability** → Mitigation: scan `Object.keys` at runtime, full try/catch, silent null fallback
- **nth-child walk is O(n) per ancestor** → Mitigation: capped at 5 ancestors × worst case ~100 siblings = negligible
- **Payload size growth** → Ancestors array adds ~200–400 bytes per pin. Acceptable for the targeting value delivered.
- **`closest()` promotion changes captured element** → By design, but may surprise users who explicitly clicked a child. Non-issue for LLM targeting use case.

## Open Questions

- Should `elementPath` (string) be deprecated now or kept indefinitely for backward compat? Lean toward keeping it derived from the ancestor chain to avoid breaking existing consumers.
- Should `attributes: Record<string,string>` (raw dump) be fully removed or moved to an opt-in field? Raw attribute dump is noisy and potentially sensitive. Remove in this change.
