## Why

When a user drops a pin, feedtack captures basic element metadata (tagName, id, className, textContent, xpath) — enough to log an event, but not enough for an LLM to reliably identify which element or component to modify in source code. Clicks on icons inside buttons, unlabeled divs, and deeply nested React components all produce ambiguous payloads. This change makes pin payloads LLM-navigable.

## What Changes

- `getTargetMeta()` resolves to the nearest interactive ancestor (button, a, input, select, textarea, label) when the clicked element is a non-interactive child (e.g. SVG icon inside a button)
- Element metadata expands to include semantic attributes: `aria-label`, `type`, `name`, `title`, `alt`, `data-testid`, `data-test-id`, `data-feedtack-component`
- Ancestor chain is captured up to 5 levels, each node serialized with the same semantic attribute set + `nth-child`/`nth-of-type` for nodes lacking stable identifiers
- React fiber traversal extracts component display names up the ancestor chain
- Introduces `data-feedtack-component` as a first-class annotation attribute users can add to any element for explicit component labeling
- XPath retained but deprioritized; the ancestor chain + semantic selector becomes the primary locator

## Capabilities

### New Capabilities
- `element-chain`: Ancestor chain capture — walk up to 5 levels from resolved target, serialize each node with tag, semantic attrs, nth-child, component name

### Modified Capabilities
- `metadata-capture`: Requirements change — resolved target (not raw click target), semantic attributes, ancestor chain, React component names now required fields in captured metadata

## Impact

- `src/capture/index.ts` — primary change surface (`getTargetMeta`, `getPinCoords`)
- `src/types/payload.ts` — `FeedtackTargetMeta` type expands to include `ancestors`, `componentName`, `nthChild`, `nthOfType`
- Payload schema version bump (additive, not breaking — new fields optional in existing consumers)
- No adapter changes required
- Bundle size impact: fiber traversal code adds ~0.5–1kb gzipped
