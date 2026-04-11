## 1. Types

- [x] 1.1 Add `AncestorNode` interface to `src/types/payload.ts` with fields: `tag`, `id`, `ariaLabel`, `role`, `type`, `name`, `title`, `alt`, `dataTestId`, `dataFeedtackComponent`, `nthChild`, `nthOfType`, `componentName`
- [x] 1.2 Update `FeedtackPinTarget` in `src/types/payload.ts` — add `ancestors: AncestorNode[]`, remove `attributes: Record<string,string>`, retain `elementPath` as derived field

## 2. Fiber Extraction

- [x] 2.1 Create `src/capture/fiber.ts` — runtime discovery of `__reactFiber$` key via `Object.keys` scan, cached after first discovery
- [x] 2.2 Implement `getComponentName(element: Element): string | null` in `fiber.ts` — walks `fiber.return` until a named component type is found, full try/catch, returns null on any failure

## 3. Target Capture

- [x] 3.1 Implement `resolveTarget(element: Element): Element` in `target.ts` — applies `element.closest('button,a,input,select,textarea,label')` promotion
- [x] 3.2 Implement `serializeNode(element: Element): AncestorNode` in `target.ts` — captures tag, id, semantic attrs, nth-child/nth-of-type (when no stable id), componentName via fiber
- [x] 3.3 Implement `getAncestorChain(element: Element): AncestorNode[]` in `target.ts` — walks `parentElement` up to 5 levels, serializes each via `serializeNode`, stops before body
- [x] 3.4 Update `getTargetMeta(element: Element)` — apply `resolveTarget`, serialize resolved target via `serializeNode`, attach ancestor chain, derive `elementPath` from chain for backward compat, remove raw `attributes` dump

## 4. Selector Update

- [x] 4.1 Update `getCSSSelector` — add `data-feedtack-component` to the priority fallback chain (after data-testid, before nth-of-type fallback)

## 5. Tests

- [x] 5.1 Test: click on SVG inside button resolves to button
- [x] 5.2 Test: click on span inside anchor resolves to anchor
- [x] 5.3 Test: click on button directly is unchanged
- [x] 5.4 Test: ancestor chain depth capped at 5
- [x] 5.5 Test: nth-child and nth-of-type computed correctly for unlabeled node
- [x] 5.6 Test: nth-child omitted when node has id
- [x] 5.7 Test: data-feedtack-component captured on target and ancestor
- [x] 5.8 Test: fiber unavailable returns componentName null without throwing
- [x] 5.9 Test: elementPath retained in output for backward compat
