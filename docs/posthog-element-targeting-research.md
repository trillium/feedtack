# PostHog Element Targeting Research

**Bead:** fe-jjd
**Date:** 2026-04-11
**Codebase:** `~/code/posthog-js/` (monorepo)

---

## 1. Key Files and Functions

### Browser SDK (`packages/browser/src/`)

| File | Purpose |
|------|---------|
| `autocapture.ts` | Main autocapture orchestrator. `getPropertiesFromElement()` is the core property-extraction function. `autocapturePropertiesForElement()` builds the full element chain with augmented properties. |
| `autocapture-utils.ts` | Utility belt: `shouldCaptureElement()`, `shouldCaptureValue()`, `isSensitiveElement()`, `getSafeText()`, `getClassNames()`, `isAngularStyleAttr()`, `getElementsChainString()`. Also contains shadow DOM handling in `getEventTarget()` and the `PHElement` interface. |
| `utils/element-utils.ts` | Low-level DOM checks: `isElementNode()`, `isTextNode()`, `isDocumentFragment()`, `isTag()`, `isElementInToolbar()`. |
| `utils/elements-chain-utils.ts` | Parsing helpers for the serialized elements_chain string format (`extractHref`, `extractTexts`, `matchString`). |
| `extensions/rageclick.ts` | Rage click detector: proximity + timing heuristic (30px, 1000ms, 3 clicks). |
| `entrypoints/dead-clicks-autocapture.ts` | Dead click detector: MutationObserver + scroll/selection/visibility watchers to determine if a click had no effect. |
| `extensions/product-tours/element-inference.ts` | Sophisticated element-finding via voting across multiple CSS selector groups with cardinality ranking. Uses `query-selector-shadow-dom` for shadow DOM traversal. |

### React Native (`packages/react-native/src/`)

| File | Purpose |
|------|---------|
| `autocapture.tsx` | React fiber traversal via `e._targetInst`. Walks `element.return` chain to get component `displayName`/`name` and `memoizedProps`. |

---

## 2. Properties PostHog Captures That We Don't

### Per-element properties (`getPropertiesFromElement`)

| Property | How PostHog captures it | We capture it? |
|----------|------------------------|----------------|
| `tag_name` | `elem.tagName.toLowerCase()` | Yes (`tagName`, but uppercase) |
| `$el_text` | `getSafeText()` / `getDirectAndNestedSpanText()` with sensitive-data scrubbing | Partially (we use raw `textContent`, no scrubbing) |
| `classes` | `getClassNames()` as array, handles SVGAnimatedString edge case | No (we capture `className` in attributes, but not as structured array) |
| `nth_child` | Counts `previousElementSibling` iterations | No |
| `nth_of_type` | Counts same-tag previous siblings | Yes (in `getCSSSelector` for selector building, but not as a standalone property) |
| `attr__*` (all attributes) | Prefixed with `attr__`, truncated to 1024 chars, with filtering | Yes (we capture all attributes, but without the prefix convention or truncation) |
| `href` | Special handling: found on any ancestor `<a>` tag, checked for external domain | No (only in raw attributes of the clicked element) |
| `$external_click_url` | Captured when href host differs from window.location.host | No |
| `$el_text` (nested spans) | `getDirectAndNestedSpanText()` recursively collects span children text | No |
| `aria-label` | Used in rageclick filtering; on sensitive elements only `name`, `id`, `class`, `aria-label` are captured | Only if present in attributes blob |

### Element chain properties

| Property | Description |
|----------|-------------|
| `$elements` | Full array of element properties from target up to `<body>`, including all ancestors |
| `$elements_chain` | Serialized string format: `tag.class1.class2:attr1="val1"attr2="val2";parent_tag...` |
| `$element_selectors` | Pre-computed CSS selectors that match the element (from server-configured selector set) |

### Augmentation properties

| Property | Description |
|----------|-------------|
| `data-ph-capture-attribute-*` | Any attribute starting with `data-ph-capture-attribute-` is extracted as a top-level event property (key = attribute name minus prefix, value = attribute value). Scanned on the target AND all ancestors. |

### Event-level properties

| Property | Description |
|----------|-------------|
| `$event_type` | e.g. "click", "change", "submit" |
| `$ce_version` | Autocapture version (currently 1) |
| `$selected_content` | Window selection text on copy/cut events |
| `$copy_type` | "copy" or "cut" |

---

## 3. Techniques Ranked by Implementation Value

### HIGH value

**a. Sensitive data scrubbing (`shouldCaptureValue`, `shouldCaptureElement`, `isSensitiveElement`)**

PostHog has layered defenses:
1. **Field name regex** — skips elements whose `name` or `id` matches `/^cc|cardnum|ccnum|creditcard|csc|cvc|cvv|exp|pass|pwd|routing|seccode|securitycode|securitynum|socialsec|socsec|ssn/i`
2. **Value regex** — detects credit card numbers (Visa, MC, Amex, Discover, Diners, JCB) and SSNs in text content
3. **Input type filtering** — skips `type="hidden"` and `type="password"` entirely
4. **Sensitive element detection** — for `<input>` (non-button types), `<select>`, `<textarea>`, `contenteditable`, only `name`, `id`, `class`, `aria-label` attributes are captured
5. **Class-based opt-out** — `ph-no-capture`, `ph-sensitive` classes suppress capture for the element and descendants; `ph-include` overrides

*Why high:* feedtack captures ALL attributes including potentially sensitive form data. A single password field or credit card input in the pin target could leak PII into feedback payloads. This is table-stakes for any production deployment.

**b. `nth_child` and `nth_of_type` as explicit properties**

PostHog computes both by walking `previousElementSibling`. These are stored as first-class properties on every element in the chain, independent of CSS selector generation.

*Why high:* These make element re-identification much more robust. Our `getCSSSelector` uses `nth-of-type` internally but doesn't expose it. Exposing both enables downstream consumers to build their own selectors or do fuzzy matching.

**c. Element chain / ancestor walk**

PostHog captures properties for EVERY element from the target up to `<body>`, not just the clicked element. The full chain is serialized as `$elements_chain` (semicolon-delimited string).

*Why high:* Our `elementPath` gives a readable path but doesn't include attributes or text for ancestors. A full chain would let consumers identify elements even when the immediate target changes (e.g., icon inside a button).

**d. Safe text extraction (`getSafeText` — direct text nodes only)**

PostHog only reads direct text node children of the element, NOT `element.textContent` which includes all descendant text. For `<a>` and `<button>`, it also recurses into `<span>` children specifically.

*Why high:* Our `element.textContent` approach can pull in massive amounts of irrelevant descendant text and potentially sensitive content from child inputs. Direct-text-node-only extraction is both safer and more useful.

### MEDIUM value

**e. Shadow DOM support**

Two techniques:
1. **Event targeting** (`getEventTarget`): When `e.target.shadowRoot` exists, use `e.composedPath()[0]` to get the actual target inside the shadow tree
2. **Ancestor walking** (`getElementAndParentsForElement`): When `parentNode` is a `DocumentFragment` (nodeType 11), jump to `.host` to cross the shadow boundary
3. **Element finding** (`element-inference.ts`): Uses `query-selector-shadow-dom` npm package for `querySelectorAllDeep()` that pierces shadow boundaries

*Why medium:* Shadow DOM is increasingly common (web components, Shoelace, Lit, etc.) but not yet ubiquitous in typical feedtack target apps. Worth supporting but not blocking.

**f. SVG className handling (`getClassNames`)**

SVG elements have `className` as an `SVGAnimatedString` object, not a plain string. PostHog checks `typeof el.className` and falls back to `el.className.baseVal` or `el.getAttribute('class')`.

*Why medium:* Will cause silent failures if someone pins an SVG element. Easy fix, low effort.

**g. `data-ph-capture-attribute-*` pattern (custom attribute extraction)**

PostHog allows developers to add `data-ph-capture-attribute-<key>="<value>"` to any element. These become top-level event properties. The scan walks all ancestors, not just the target.

*Why medium:* For feedtack, a `data-feedtack-*` convention would let teams annotate elements with context that auto-enriches pin metadata (e.g., `data-feedtack-feature="checkout"`, `data-feedtack-component="PriceCard"`). Low implementation cost but requires user adoption.

**h. Angular style attribute filtering (`isAngularStyleAttr`)**

PostHog skips attributes starting with `_ngcontent` or `_nghost` because they change on every build and add noise.

*Why medium:* These attributes pollute our current `attributes` blob. Easy to filter. Should also consider filtering React's `data-reactid` and similar framework noise.

**i. Href extraction from ancestor `<a>` tags**

PostHog walks up the DOM to find the nearest `<a>` ancestor and captures its `href`. Also flags external links via `$external_click_url`.

*Why medium:* Useful for feedtack — if someone pins a link, knowing where it goes is valuable context. Currently we only get `href` if the `<a>` itself is the pin target, not if they click on an icon/span inside it.

### LOW value

**j. React fiber traversal for component names (React Native only)**

PostHog's React Native SDK accesses `e._targetInst` to get the React fiber, then walks the `return` chain reading `elementType.displayName` and `memoizedProps`.

*Why low:* This only works in React Native (where `_targetInst` is on the synthetic event). In browser React, the fiber is accessible via `element.__reactFiber$*` keys but this is fragile, undocumented, and version-specific. PostHog notably does NOT do this in their browser SDK. Worth prototyping but risky for production.

**k. Element selector voting system (`element-inference.ts`)**

PostHog's product tours use a sophisticated system: multiple CSS selector groups with different specificity levels, a voting mechanism to find the best match, visibility checks with caching, and precision controls.

*Why low:* This is for *finding* elements later, not for *capturing* metadata about them. Feedtack's use case is capture-time enrichment, not replay-time element location. However, if we ever need to re-highlight pinned elements, this pattern is excellent reference material.

**l. Dead click / rage click detection**

PostHog uses MutationObserver to detect clicks that produce no DOM changes, scroll, or selection change within a timeout window. Rage clicks use proximity + timing (30px Manhattan distance, 1000ms, 3 clicks).

*Why low:* Interesting behavioral signals but outside feedtack's current scope. Users intentionally place pins; there's no concept of a "dead" pin drop.

---

## 4. Concrete Suggestions for Improving `getTargetMeta()`

### Must-do (security)

1. **Add sensitive data filtering.** Port PostHog's approach:
   - Skip `type="password"` and `type="hidden"` inputs when capturing text/attributes
   - Regex-check field names for CC/SSN patterns
   - Scrub text content that matches CC/SSN value patterns
   - Filter attributes on sensitive elements to only `name`, `id`, `class`, `aria-label`

2. **Use direct text node extraction instead of `element.textContent`.** Only read `childNodes` with `nodeType === 3` (text nodes). For buttons/anchors, also recurse into `<span>` children.

### Should-do (enrichment)

3. **Add `nth_child` and `nth_of_type` as first-class properties.** Compute via `previousElementSibling` walk (PostHog's approach). Store alongside `selector`.

4. **Build an ancestor chain array.** Capture at minimum `tagName`, `id`, `classes`, `textContent` for each ancestor up to body (or up to 10 levels). Serialize compactly.

5. **Extract `href` from ancestor `<a>` tags.** Walk up the DOM and capture the nearest anchor's href, even if the pinned element is a child of the anchor.

6. **Handle SVG `className`.** Check `typeof el.className` and use `baseVal` fallback. Our `Array.from(current.classList)` may also fail on SVGs without a classList.

7. **Filter framework noise attributes.** Skip `_ngcontent-*`, `_nghost-*`, `data-reactid`, `data-v-*` (Vue scoped CSS) from the attributes blob.

### Nice-to-have (extensibility)

8. **Support `data-feedtack-*` custom attributes.** Scan the target and ancestors for `data-feedtack-*` attributes and promote them to top-level pin metadata.

9. **Add shadow DOM support.** Use `e.composedPath()[0]` for event targeting and handle `DocumentFragment` parent nodes in ancestor walks.

10. **Add `aria-label` and `role` as explicit properties.** These are increasingly important for accessibility-first apps and provide good human-readable element identification.

---

## 5. Gotchas and Tradeoffs

### Payload size
PostHog's full element chain can be verbose. Their `$elements_chain` string serialization is a compact format but still grows with deep DOM trees. For feedtack, consider capping ancestor depth (e.g., 10 levels) and truncating attribute values aggressively (PostHog uses 1024 chars).

### Performance
PostHog's `previousElementSibling` walk for `nth_child`/`nth_of_type` is O(n) in the number of siblings. In large lists (e.g., a table with 1000 rows), this could be slow. PostHog accepts this cost since autocapture fires on user interaction (not in a hot loop). Same applies to feedtack pin drops.

### SVG edge cases
`classList` is not available on SVG elements in older browsers. PostHog's `getClassNames()` handles this by checking `typeof el.className` and falling back to `getAttribute('class')`. Our code uses `Array.from(current.classList)` which will throw on SVG elements without classList support.

### Text content safety
PostHog's `getSafeText` is intentionally conservative: it only reads direct text nodes, skips sensitive elements entirely, and scrubs values matching CC/SSN patterns. The tradeoff is losing some potentially useful text. For feedtack, this is the right tradeoff since feedback pins could be placed on any element, including forms with sensitive data.

### The `data-ph-capture-attribute` pattern requires user buy-in
PostHog's custom attribute extraction is powerful but requires developers to annotate their DOM. For feedtack, a similar `data-feedtack-*` pattern would be opt-in enrichment. Don't make it required; treat it as bonus context when present.

### Shadow DOM is all-or-nothing
PostHog's `composedPath()[0]` approach gives you the deepest target inside a shadow tree, but you then can't easily CSS-select it from outside the shadow boundary. Any selector generated for a shadow DOM element is only valid within that shadow root. PostHog works around this by serializing the full element chain (which crosses boundaries). For feedtack, if we need to re-highlight a pinned element inside a shadow DOM, we'd need to store the shadow host path separately.

### Angular attribute filtering is framework-specific
PostHog only filters Angular-specific attributes (`_ngcontent`, `_nghost`). There are similar noise attributes for Vue (`data-v-*`), React (`data-reactid`, though no longer used in modern React), Svelte (class hashes), etc. A more generic approach would be to filter attributes matching common framework patterns rather than special-casing each one.

---

## 6. Architecture Notes

PostHog's autocapture is designed around a **serialized element chain** model: every click captures not just the target but the full DOM ancestry as a flat string. This enables powerful server-side filtering, funnel analysis, and element matching without requiring unique selectors. The chain format is: `tag.classes:key="val"key2="val2";parent_tag.classes:...` (semicolon-separated elements, colon-separated tag/attrs).

Feedtack's model is different: we care about **pin placement** (coordinates + selector for re-highlighting) and **element context** (what did the user click on, for developer understanding). We don't need the full chain format but would benefit from richer metadata on both the target and its immediate context.

The recommended approach is to selectively adopt PostHog's techniques rather than replicate their architecture:
- Adopt their safety/scrubbing layer wholesale (it's battle-tested)
- Add `nth_child`/`nth_of_type` and ancestor context for selector robustness
- Skip the serialized chain format; keep our structured JSON approach
- Consider shadow DOM support as a future enhancement
