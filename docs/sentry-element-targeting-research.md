# Sentry JavaScript Element Targeting Research

**Bead:** fe-aw3
**Date:** 2026-04-11
**Companion investigation:** fe-jjd (PostHog)

## Overview

This report documents how the Sentry JavaScript SDK identifies, describes, and enriches DOM elements during interaction capture. The goal is to identify techniques we can adopt in feedtack's `getTargetMeta()` to produce richer, more actionable pin payloads for developers.

---

## 1. Key Files and Functions in Sentry

### Core element descriptor: `htmlTreeAsString`

**File:** `packages/core/src/utils/browser.ts`

This is Sentry's primary element-to-string function, used across breadcrumbs, INP, CLS, LCP, and replay. It walks up the DOM tree (max 5 ancestors) and builds a query-selector-like string:

```
body > div#main > ul.nav > li.active > button#submit.btn[type="submit"]
```

Key design choices:
- **Max traverse height:** 5 levels (hardcoded)
- **Max string length:** 80 chars default, configurable up to 1024
- **Early exit on `data-sentry-component` / `data-sentry-element`:** If an element has either data attribute, the function returns that value immediately instead of building a selector string. Component annotation takes absolute priority.
- **`keyAttrs` option:** Users can specify custom attributes (e.g., `data-testid`) that replace id/class in the output. When keyAttrs are present and match, id and className are skipped entirely.
- **Default attribute enrichment:** Always appends `[aria-label]`, `[type]`, `[name]`, `[title]`, `[alt]` when present on each element in the tree.

### Component name resolution: `getComponentName`

**File:** `packages/core/src/utils/browser.ts`

Walks up the DOM tree (max 5 ancestors) looking for `data-sentry-component` or `data-sentry-element` dataset attributes. Returns the first match or null. This is used in breadcrumbs to populate `ui.component_name` in the breadcrumb data.

### Component annotation at build time

**File:** `packages/nextjs/src/config/loaders/componentAnnotationLoader.ts`

Sentry provides a **build-time loader/plugin** that automatically injects `data-sentry-component`, `data-sentry-element`, and `data-sentry-source-file` attributes onto React JSX elements. This is powered by `@sentry/bundler-plugin-core`'s `createComponentNameAnnotateHooks`. It works at the AST level during transpilation -- no runtime React fiber walking required.

### DOM breadcrumb handler

**File:** `packages/browser/src/integrations/breadcrumbs.ts` (function `_getDomBreadcrumbHandler`)

For each click/keypress:
1. Calls `htmlTreeAsString(element, { keyAttrs, maxStringLength })` to build the message
2. Calls `getComponentName(element)` to find the nearest annotated component
3. Breadcrumb shape: `{ category: "ui.click", message: "body > button#save.btn", data: { "ui.component_name": "SaveButton" } }`

### DOM event instrumentation

**File:** `packages/browser-utils/src/instrument/dom.ts`

Notable techniques:
- **UUID stamping:** Each event target gets a non-enumerable `_sentryId` (UUID) to deduplicate breadcrumbs for repeated events on the same element
- **1-second debounce:** Prevents duplicate breadcrumbs within a 1s window for the same element
- **`addEventListener` monkey-patching:** Wraps both `EventTarget.prototype` and `Node.prototype` `addEventListener`/`removeEventListener` to capture clicks even if `stopPropagation` is called
- **Keypress filtering:** Only captures keypresses on `INPUT`, `TEXTAREA`, or `contentEditable` elements

### Replay DOM handler

**File:** `packages/replay-internal/src/coreHandlers/handleDom.ts`

For replay breadcrumbs, captures a richer payload per element:
- `nodeId` (rrweb mirror ID for DOM replay correlation)
- `tagName`
- `textContent` (from serialized child text nodes, joined)
- `attributes` (filtered via allowlist, see below)

### Replay attribute allowlist

**File:** `packages/replay-internal/src/coreHandlers/util/getAttributesToRecord.ts`

```
ATTRIBUTES_TO_RECORD = [
  'id', 'class', 'aria-label', 'role', 'name', 'alt', 'title',
  'data-test-id', 'data-testid', 'disabled', 'aria-disabled',
  'data-sentry-component'
]
```

Key behavior:
- `data-testid` and `data-test-id` are both normalized to `testId`
- `data-sentry-element` is used as fallback for `data-sentry-component`
- Only these specific attributes are forwarded -- everything else is stripped

### Click target resolution: "closest interactive"

**File:** `packages/replay-internal/src/coreHandlers/util/domUtils.ts`

For click events, Sentry resolves the target to the **closest interactive ancestor** using `element.closest('button,a')`. This means clicking an `<img>` inside a `<button>` reports the button, not the image.

### Slow click / rage click detection

**File:** `packages/replay-internal/src/coreHandlers/handleClick.ts`

Sentry's ClickDetector tracks:
- Time between click and next DOM mutation or scroll
- Multi-click counting on the same element
- Produces `ui.slowClickDetected` or `ui.multiClick` breadcrumbs
- Only monitors `A`, `BUTTON`, `INPUT[type=submit|button]`
- Ignores links with `download` or non-`_self` targets

### Web Vitals element enrichment

**Files:**
- `packages/browser-utils/src/metrics/inp.ts` -- INP uses `htmlTreeAsString(entry.target)` to name the interaction span
- `packages/browser-utils/src/metrics/cls.ts` -- CLS captures `htmlTreeAsString(source.node)` for each layout shift source
- `packages/browser-utils/src/metrics/lcp.ts` -- LCP captures `htmlTreeAsString(entry.element)` plus `lcp.id`, `lcp.url`, `lcp.size`

---

## 2. Properties Sentry Captures That We Don't

| Property | Sentry Captures | feedtack Captures | Gap |
|----------|----------------|-------------------|-----|
| `aria-label` | Yes (in tree string + attribute allowlist) | Only via raw `attributes` bag | Not surfaced prominently |
| `role` | Yes (replay attribute allowlist) | Only via raw `attributes` bag | Not surfaced prominently |
| `type` (input type) | Yes (in tree string) | Only via raw `attributes` bag | Not surfaced prominently |
| `name` (form field name) | Yes (in tree string + allowlist) | Only via raw `attributes` bag | Not surfaced prominently |
| `alt` | Yes (in tree string + allowlist) | Only via raw `attributes` bag | Not surfaced prominently |
| `title` | Yes (in tree string + allowlist) | Only via raw `attributes` bag | Not surfaced prominently |
| `disabled` / `aria-disabled` | Yes (replay allowlist) | Only via raw `attributes` bag | Not surfaced prominently |
| Component name (`data-sentry-component`) | Yes (first-class, short-circuits tree walk) | No | **Missing** |
| Source file (`data-sentry-source-file`) | Yes (via build plugin) | No | **Missing** |
| Closest interactive ancestor | Yes (`element.closest('button,a')`) | No | **Missing** |
| `data-test-id` (hyphenated variant) | No special handling | Only `data-testid` | Minor gap |
| Element UUID for dedup | Yes (`_sentryId`) | No | N/A for our use case |

### What feedtack already does well
- Full `attributes` bag capture (Sentry only captures an allowlist)
- `boundingRect` capture (Sentry doesn't do this for breadcrumbs)
- `data-testid` anchored element path with early termination
- Percentage-based coordinates for responsive replay

---

## 3. Techniques Ranked by Implementation Value

### HIGH value

#### 3a. Closest interactive ancestor resolution
**What:** When a user clicks an `<svg>` or `<span>` inside a `<button>`, resolve the target to the button.
**Why for feedtack:** Pins on icon elements inside buttons are extremely common. Developers want to know "they clicked the Save button", not "they clicked the SVG path inside the button".
**Effort:** ~5 lines. `element.closest('button,a,input[type="submit"],input[type="button"],[role="button"]')` with fallback to original element.
**Sentry ref:** `packages/replay-internal/src/coreHandlers/util/domUtils.ts` -- `getClosestInteractive()`

#### 3b. Semantic attributes in element path
**What:** Include `[aria-label]`, `[type]`, `[name]`, `[title]`, `[alt]`, `[role]` in the `elementPath` string.
**Why for feedtack:** `button[aria-label="Close dialog"]` is far more useful than just `button` in a path. These attributes make paths human-readable and disambiguate sibling elements.
**Effort:** Small change to `getElementPath()` -- append attribute brackets like Sentry's `_htmlElementAsString`.
**Sentry ref:** `packages/core/src/utils/browser.ts` lines 120-125

#### 3c. `data-sentry-component` / generic component annotation support
**What:** Recognize `data-sentry-component`, `data-sentry-element`, and a feedtack-specific `data-feedtack-component` attribute. When found on the element or an ancestor, include it as a top-level `componentName` field.
**Why for feedtack:** This is the single highest-signal piece of metadata Sentry captures. If a feedtack user also uses Sentry's annotation plugin, we get component names for free. We can also define our own attribute convention.
**Effort:** ~15 lines. Walk up (max 5-10 ancestors), check `dataset.sentryComponent`, `dataset.sentryElement`, `dataset.feedtackComponent`.
**Sentry ref:** `packages/core/src/utils/browser.ts` -- `getComponentName()`

### MEDIUM value

#### 3d. Attribute allowlist with prominent surfacing
**What:** Add a dedicated `semantics` object to the pin target with specifically extracted attributes: `ariaLabel`, `role`, `inputType`, `name`, `alt`, `title`, `disabled`.
**Why for feedtack:** The raw `attributes` bag exists but is noisy. A curated `semantics` object makes downstream consumption (dashboard display, search, filtering) much cleaner.
**Effort:** ~10 lines of extraction from the existing attributes bag.
**Sentry ref:** `packages/replay-internal/src/coreHandlers/util/getAttributesToRecord.ts`

#### 3e. Normalize `data-test-id` alongside `data-testid`
**What:** Check for both `data-testid` and `data-test-id` (the hyphenated variant used by some testing libraries).
**Why for feedtack:** Minor but eliminates a "why doesn't my testid show up" support issue.
**Effort:** 2 lines.
**Sentry ref:** `getAttributesToRecord` normalizes both to `testId`

#### 3f. Element path string length cap
**What:** Add a configurable max string length for `elementPath` (default 200-300 chars) to prevent oversized payloads from deeply nested DOMs.
**Why for feedtack:** Prevents payload bloat. Sentry defaults to 80 chars and caps at 1024.
**Effort:** ~5 lines.
**Sentry ref:** `htmlTreeAsString` options `{ maxStringLength }`

### LOW value

#### 3g. Build-time component annotation plugin
**What:** Provide a Babel/SWC plugin that injects `data-feedtack-component` and `data-feedtack-source-file` at build time.
**Why for feedtack:** Maximum signal, but high effort and already available via Sentry's plugin ecosystem.
**Effort:** High -- AST transform plugin. Could instead document how to reuse Sentry's existing plugin.
**Sentry ref:** `packages/nextjs/src/config/loaders/componentAnnotationLoader.ts`

#### 3h. Event deduplication / debouncing
**What:** UUID-stamp targets and debounce within a window.
**Why for feedtack:** Less relevant since feedtack is explicit pin-drop, not automatic event stream. Users click once to place a pin.
**Sentry ref:** `packages/browser-utils/src/instrument/dom.ts` -- `_sentryId`, `DEBOUNCE_DURATION`

#### 3i. Slow/rage click detection
**What:** Track time-to-mutation and click count on the same element.
**Why for feedtack:** Interesting for a future "auto-capture frustration" feature but out of scope for manual pin feedback.
**Sentry ref:** `packages/replay-internal/src/coreHandlers/handleClick.ts`

---

## 4. Concrete Suggestions for `getTargetMeta()`

### Immediate (next PR)

1. **Add closest-interactive resolution** before all other logic:
   ```ts
   const interactiveElement = element.closest(
     'button,a,input[type="submit"],input[type="button"],[role="button"],[role="link"]'
   );
   const resolvedElement = interactiveElement || element;
   // Use resolvedElement for selector + metadata, but keep original element for coordinates
   ```

2. **Add `componentName` field** to `FeedtackPinTarget`:
   Walk up max 5-8 ancestors checking for `data-sentry-component`, `data-sentry-element`, `data-feedtack-component`, or `data-component`. Return first match.

3. **Enrich `elementPath` with semantic attributes:**
   When building path segments, append `[aria-label="..."]`, `[role="..."]`, `[type="..."]`, `[name="..."]` when present. Cap total path length at ~300 chars.

4. **Normalize testId extraction** to check both `data-testid` and `data-test-id`.

### Follow-up (separate PR)

5. **Add `semantics` sub-object** to target:
   ```ts
   semantics: {
     ariaLabel: string | null,
     role: string | null,
     inputType: string | null,
     inputName: string | null,
     isDisabled: boolean,
   }
   ```

6. **Add `interactiveAncestor` field** -- when the resolved element differs from the clicked element, include the tag + key attributes of the interactive ancestor so consumers know the resolution happened.

7. **Document Sentry plugin compatibility** -- note in README that if users have `@sentry/bundler-plugin-core` component annotation enabled, feedtack will automatically pick up `data-sentry-component` values.

---

## 5. Comparison Notes vs PostHog (fe-jjd)

*These are preliminary observations to be reconciled with the PostHog investigation.*

| Aspect | Sentry | PostHog (expected) |
|--------|--------|--------------------|
| Primary approach | Build-time annotation + tree string | Runtime autocapture with `$el_text`, `$elements` chain |
| CSS selector strategy | Not a primary concern; tree string is descriptor, not selector | Generates full CSS selectors for action matching |
| Component names | Build-time `data-sentry-*` attributes | Likely runtime fiber walking |
| Sensitive data | Replay-level masking (rrweb maskAllText, maskAllInputs, attribute masking) | Likely property-level redaction |
| Element chain depth | Max 5 ancestors | Typically captures full chain to body |

Key difference: Sentry treats the element descriptor as a **human-readable label** for debugging (breadcrumb message), while PostHog likely treats it as a **machine-matchable path** for action definition. feedtack needs both: human-readable for the developer viewing feedback, and machine-stable for re-highlighting the element.

---

## 6. Gotchas and Tradeoffs

### Performance
- **Sentry's tree walk is capped at 5 ancestors** to avoid performance issues on deeply nested DOMs. We should adopt a similar cap (our current `getElementPath` walks to `body` which could be 20+ levels deep in complex apps).
- **`element.closest()` is O(depth)** but is a native browser method and very fast. Safe for single-shot use at pin time.
- **Attribute reads are cheap** individually but iterating all attributes (as we currently do) on complex SVG elements can produce large payloads. Consider capping `attributes` bag size or switching to an allowlist.

### Privacy
- Sentry's replay masks `title`, `placeholder`, `aria-label` by default when `maskAllText: true`.
- `textContent` capture is a privacy vector -- Sentry's replay masks all visible text by default.
- feedtack currently captures full `textContent` (truncated to 200 chars) and all attributes. We should consider:
  - Never capturing `value` attributes on input/textarea elements
  - Masking or skipping `textContent` on elements inside `[data-sentry-mask]`, `[data-feedtack-mask]`, or form fields
  - Adding a `sensitiveFields` option that automatically redacts content from `input[type="password"]`, `input[type="email"]`, `[autocomplete="cc-number"]`, etc.

### Bundle size
- `htmlTreeAsString` + `getComponentName` is ~120 lines of simple DOM traversal. All the techniques described above are lightweight.
- The build-time annotation plugin is a separate concern (build tooling, not runtime bundle).
- Adding a `semantics` sub-object adds ~50 bytes per pin payload. Negligible.

### Stability
- Sentry wraps all DOM access in try/catch because `event.target` can throw in rare edge cases (referenced as getsentry/raven-js#838). Our `getTargetMeta` should do the same -- currently it does not wrap the `element.getBoundingClientRect()` call or attribute iteration.
- `element.closest()` returns null if no match and if called on a detached element. Always null-check.

---

## 7. Summary of Files Referenced

| File | What it contains |
|------|-----------------|
| `packages/core/src/utils/browser.ts` | `htmlTreeAsString`, `_htmlElementAsString`, `getComponentName` |
| `packages/browser/src/integrations/breadcrumbs.ts` | DOM breadcrumb handler, component name extraction |
| `packages/browser-utils/src/instrument/dom.ts` | Click/keypress instrumentation, deduplication, debouncing |
| `packages/replay-internal/src/coreHandlers/handleDom.ts` | Replay DOM breadcrumb with nodeId + serialized attributes |
| `packages/replay-internal/src/coreHandlers/util/getAttributesToRecord.ts` | Attribute allowlist for replay |
| `packages/replay-internal/src/coreHandlers/util/domUtils.ts` | `getClosestInteractive()`, click target resolution |
| `packages/replay-internal/src/coreHandlers/handleClick.ts` | Slow click / rage click detection |
| `packages/replay-internal/src/util/getPrivacyOptions.ts` | Privacy selectors (`data-sentry-mask`, `data-sentry-block`, `data-sentry-ignore`) |
| `packages/replay-internal/src/util/maskAttribute.ts` | Attribute-level masking logic |
| `packages/replay-internal/src/integration.ts` | Replay config defaults (`maskAllText`, `maskAllInputs`, `maskAttributes`) |
| `packages/nextjs/src/config/loaders/componentAnnotationLoader.ts` | Build-time `data-sentry-component` injection |
| `packages/browser-utils/src/metrics/inp.ts` | INP element name capture via `htmlTreeAsString` |
| `packages/browser-utils/src/metrics/cls.ts` | CLS source element capture |
| `packages/browser-utils/src/metrics/lcp.ts` | LCP element + id + url + size capture |
