# Vercel Toolbar Feedback — Element Targeting Research

**Script URL:** `https://vercel.live/_next-live/feedback/feedback.js`
**Research date:** 2026-04-16
**Purpose:** Understand Vercel's approach to DOM element anchoring for feedtack's open-source implementation.

---

## Script Structure

The toolbar is split across three files:

| File | Size | Role |
|------|------|------|
| `feedback.js` | 73 KB, 1 line (minified) | Shadow DOM host injected into the page; toolbar button drag logic |
| `feedback.html` | 112 KB inline JS | Menu/auth iframe; all UI menus, authentication, event routing |
| `instrument.aee26ce0af61f74b3541.js` | **2.6 MB**, 1 line (minified) | The main app: comment placement, element targeting, React fiber walking, LiveBlocks integration |

All three are webpack bundles (IIFE, `(()=>{var e={...}})()` pattern). No external source maps are available — the `.js.map` URL 404s; the files contain only inline sourceMappingURLs for CSS-in-JS style blocks, not for the JS itself.

**Bundler:** webpack (module IDs are integers, standard webpack runtime with `n.d`, `n.e`, `n.r` helpers).
**Minification:** Terser-style — single-char variable names, no comments except license headers. Function and variable names are unreadable but structure is recoverable.
**Obfuscation level:** Standard minification only. No intentional obfuscation (no string encoding, no control-flow flattening). A beautifier alone is sufficient to make it readable.

---

## Tooling Assessment

### What you need

1. **`js-beautify`** (or `prettier --parser babel`) — converts 1-line IIFE to indented code. Took 2.6 MB → ~80K lines. Sufficient.
2. **No deobfuscator required.** This is plain minification.
3. **Source maps** — not available. Don't bother looking.

### Recommended workflow

```bash
# Download
curl -L "https://vercel.live/_next-live/feedback/feedback.js" -o feedback.js
curl -L "https://vercel.live/_next-live/feedback/feedback.html" -o feedback.html
# Extract the inline script from feedback.html, then:
# Find the instrument URL inside the showToolbar function (search: instrument.)
curl -L "https://vercel.live/_next-live/feedback/instrument.<hash>.js" -o instrument.js

# Beautify
js-beautify instrument.js -o instrument_pretty.js
```

The `instrument.js` hash changes on each deploy. The current hash at time of research is `aee26ce0af61f74b3541`. To find the current one, search for `instrument.` inside `feedback.js` after beautifying.

---

## Architecture Overview

The three files communicate as follows:

```
Page DOM
  └── <vercel-live-feedback> (shadow DOM host, injected by feedback.js)
        ├── Toolbar button (drag, click to open menu)
        └── Hidden iframe (srcdoc loads instrument.js)
              └── initLiveFeedback({ data, root, rootElement, liveOrigin, ... })
                    ↑ Called directly on the iframe's contentWindow
                    ↑ Receives: topImport (for lazy chunks), frame (canvas), resetToolbar
```

The toolbar shell (`feedback.js`) communicates with the instrument iframe via direct function call (`initLiveFeedback`), not postMessage. The menu UI is a separate iframe (`feedback.html`) that communicates with the toolbar via postMessage.

---

## Element Anchoring — Full Technical Breakdown

### 1. nodeId Generation (module 71975)

**nodeId is a comma-separated list of CSS selectors**, not a hash or XPath.

The generator function (`r` in module 71975, called as `ul.b(element, window)`) produces **four variants** of the same element's CSS path and joins them with `,`:

```
variant 1: tag > tag > tag:nth-of-type(N)    (no id, no class)
variant 2: #id > tag > tag                   (stops at id, no class)
variant 3: tag.class > tag.class > tag        (first class included)
variant 4: #id > tag.class                   (stops at id, first class)
```

Each variant is validated with `document.querySelector(selector)` — invalid selectors are dropped before joining.

**The inner path-builder** (`i(element, window, options)`):
- Walks `parentNode` up the DOM tree until it hits `<html>` or an element with an `id`
- For each element: uses `nodeName.toLowerCase()` as the tag
- Adds `:nth-of-type(N)` when `N > 1` (disambiguates siblings of the same tag)
- Optionally includes `classList.item(0)` (the first class only)
- Optionally stops at an `id` attribute (uses `#id` or `[id="..."]` for ids starting with a digit)
- Special characters are escaped with `e.replace(/([^a-zA-Z0-9-_])/g, "\\$1")`

**Exact module 71975 code (beautified):**

```js
function r(e, t) {  // e = element, t = window
    var n = [
        i(e, t, {proceedAfterId: false, includeClasses: false}),
        i(e, t, {proceedAfterId: true,  includeClasses: false}),
        i(e, t, {proceedAfterId: false, includeClasses: true}),
        i(e, t, {proceedAfterId: true,  includeClasses: true})
    ];
    var r = new Set;
    return n.filter(function(e) {
        if (r.has(e)) return false;
        r.add(e);
        try { document.querySelector(e) }
        catch (t) { console.error("Faulty nodeId selector", e, String(t)); return false; }
        return true;
    }).join(",");
}
```

### 2. Re-anchoring Across Deploys (module 54838)

**There is no similarity scoring.** Re-anchoring is purely CSS selector truncation.

The `Kq(nodeId, document)` function:
1. Tries `querySelector` on the full nodeId (comma-separated selector list, tries each variant)
2. If that fails, calls `c(nodeId)` which strips the last `> segment` from each selector variant
3. Repeats until either a match is found or no segments remain
4. If an ancestor is returned (`isAncestor: true`), the bubble renders at the parent element

Additionally, if the resolved element is inside a `<details>` or `[hidden=until-found]`, it auto-opens those containers (module 95039).

**The `c()` stripping function:**
```js
function c(e) {
    var t = e.split(",")
        .map(function(e) { return e.replace(/[\s>]\s*\S+\s*$/, "").trim(); })
        .filter(function(e) { return e.length > 0; })
        .join(",");
    return e !== t && t ? t : null;
}
```

A `Map` cache is maintained so repeated lookups within a session don't re-query the DOM.

### 3. Comment Placement Click Handler

When the user clicks on the overlay in comment mode (`instrument.js` ~line 1921000):

```js
// Step 1: find the element under the click
var elements = t.document.elementsFromPoint(o.clientX, o.clientY);
var l = elements.find(function(e) {
    return e.getRootNode() === t.document && "VERCEL-LIVE-FEEDBACK" !== e.tagName;
});

// Step 2: generate frameworkContext from React fiber tree
var c = lc(l, {
    includeProps: true,
    includeDomElements: true,
    maxDepth: 10,
    maxPropsToShow: 20,
    maxPropsLength: 100,
    skipFrameworkComponents: true
});

// Step 3: record position relative to element bounding box
var u = l.getBoundingClientRect();
var x = (o.clientX - u.left) / u.width;   // 0–1 relative position within element
var y = (o.clientY - u.top) / u.height;

// Step 4: build comment thread object
S({
    id: generateId(12),
    nodeId: ul.b(l, t),              // CSS selector (4 variants, comma-joined)
    x: x,
    y: y,
    page: r || "/",
    contentId: i,
    pageTitle: t.document.title,
    userAgent: t.navigator.userAgent,
    screenWidth: t.innerWidth,
    screenHeight: t.innerHeight,
    devicePixelRatio: t.devicePixelRatio,
    deploymentUrl: y.deploymentUrl,
    draftMode: b,
    snapshotKey: f,
    frameworkContext: c.formatted      // formatted string from React fiber walk
});
```

**Key insight:** `x` and `y` are fractional positions within the element's bounding box (0–1), not absolute page coordinates. This means the pin re-renders correctly even if the element moves on the page.

### 4. frameworkContext — React Fiber Tree Walk (`lc()` function)

The `lc(element, options)` function generates a human-readable React component tree string:

**Step 1: Find fiber root on element**
```js
for (var o in element) {
    if (o.startsWith("__reactFiber$") || o.startsWith("__reactInternalInstance$")) {
        // found it
    }
}
// Also handles: element._reactRootContainer, element.__reactContainer$*
```

**Step 2: Walk ancestors via `fiber.return`**, collecting up to `maxDepth` nodes that pass the filter `ic()`.

**Step 3: Filter (`ic()`):**
- Includes: user-defined React components (`rc(fiber)` checks `fiber.type` is a function/class)
- Skips: built-in DOM elements (unless `includeDomElements: true`)
- Skips these always: `Fragment`, `Suspense`, `Profiler`, `StrictMode`, `Routes`, `Route`, `Outlet`
- Skips these when `skipFrameworkComponents: true`:
  - `/Router$/`, `/^(?:Inner|Outer)/`, `/^Client(?:Page|Segment)/`, `/^Server/`, `/^RSC/`
  - `/Context$/`, `/^(?:Hot|Dev|React)/`, `/Handler$/`, `/^With[A-Z]/`
  - `PagesDevOverlayBridge`, `PathnameContextProviderAdapter`

**Step 4: Extract component name** via `fiber.type.displayName || fiber.type.name || null`

**Step 5: Extract source location** from `fiber._debugSource` (fileName, lineNumber) or `fiber._debugStack.stack` (parsed with regex)

**Step 6: Extract props** — truncated to `maxPropsToShow` entries and `maxPropsLength` total chars, excluding `children` and `ref`.

**Output format** (stored as a string in `frameworkContext`):
```
React Component Tree (root to selected element):

Selected: <div#main-content.container>

... [3 more] ...
  <App>
    <Layout>
      <Page>
        <Button variant="primary">  // src/components/Button.tsx:42
```

This is stored as a plain string, not a structured object, so it's display-only — not used for re-anchoring.

### 5. Text Selection Anchoring (`selectionRange`)

When the user places a comment on selected text (the `$u(range, window)` function):

```js
{
    startContainerNodeId: ul.b(range.startContainer.parentElement, window),
    startContainerTextNodeIndex: textNodeIndex(range.startContainer),
    startOffset: range.startOffset,
    endContainerNodeId: ul.b(range.endContainer.parentElement, window),
    endContainerTextNodeIndex: textNodeIndex(range.endContainer),
    endOffset: range.endOffset,
    text: "the selected text content"  // extracted from cloned fragment
}
```

Where `textNodeIndex` counts how many text node siblings precede the container (skipping COMMENT_NODEs and SCRIPT elements).

**Re-rendering selections:** The `Yc.AV(nodeId, document)` resolves each container nodeId to an element, then `r(element, textNodeIndex)` walks to the correct text node, and a `Range` is reconstructed. If the selector fails, the selection highlight is not rendered (no graceful fallback beyond the CSS selector truncation in `Kq`).

### 6. Full CommentThread Data Schema

From the LiveBlocks schema definition (module containing `CommentThread`):

**Required fields:** `id`, `nodeId`, `x`, `y`, `resolved`, `comments[]`, `shortId`, `followingUsers[]`

**Optional fields:** `hasReadUserMap`, `page`, `contentId`, `deploymentUrl`, `branch`, `userAgent`, `pageTitle`, `screenWidth`, `screenHeight`, `devicePixelRatio`, `selectionRange`, `lastScreenshotNumber`, `route` (regex + name), `deletedComments[]`, `subject`, `emailMessageIdMap`, `convertedToIssue`, `resolvedBy`, `resolvedStatusAt`, `draftMode`, `snapshotKey`, `mutedUsers[]`, `metadata`, `frameworkContext`

---

## Re-anchoring Summary

Vercel's strategy is **CSS selector stability with progressive truncation**:

1. **Prefer id-based selectors** — if an element has an `id`, the path terminates there (shorter = more stable across deploys)
2. **Store 4 selector variants** — different class/id combinations, all queryable, comma-joined so `querySelector` tries each
3. **Fallback to ancestor** — strip last path segment and retry; mark `isAncestor: true` so the bubble renders at a parent
4. **No semantic matching** — no text content hashing, no similarity scoring, no XPath
5. **Position within element** — `x/y` are fractional (0–1) within the element bbox, so the pin moves with the element if page layout shifts

**This means:** a comment can "survive" a deploy where the exact element was replaced, as long as a parent element with the same id or tag path exists. If the entire subtree changes, the comment goes orphaned (not shown).

---

## What We'd Need to Replicate

| Feature | Vercel's Approach | Feedtack Equivalent |
|---------|-------------------|---------------------|
| nodeId | 4 CSS selector variants, comma-joined | Same — module 71975 is ~60 lines, easily portable |
| Re-anchoring | Strip last `>` segment, retry | Same — ~15 lines |
| Click placement | `elementsFromPoint`, bbox-relative x/y | Same pattern |
| frameworkContext | React fiber walk, formatted string | Already implemented in feedtack's capture module |
| selectionRange | startNode/endNode CSS selectors + text offsets | Straightforward DOM Range serialization |
| Bubble positioning | `Kq()` → element → `getBoundingClientRect` → absolute position | Same |

The only area where feedtack's existing implementation may diverge: feedtack uses ancestor chain + component name arrays (structured), while Vercel stores `frameworkContext` as a formatted display string only. Feedtack's approach is richer for re-anchoring purposes.

---

## Effort Level

- **Reading the code:** 1–2 hours with a beautifier. No deobfuscator needed.
- **The nodeId selector logic:** ~60 lines, fully readable, immediately portable.
- **The re-anchoring logic:** ~30 lines, fully readable.
- **The React fiber walker:** ~200 lines, directly readable — nearly identical to what feedtack already has.
- **Reverse-engineering the schema:** done above; it's all visible in the LiveBlocks schema definition.

The hardest part is finding which of the 300+ webpack modules contains the relevant code. Key module numbers for this deploy:

| Module | Content |
|--------|---------|
| 71975 | `b()` — CSS selector generator (nodeId builder) |
| 54838 | `AV()` — nodeId → element resolver; `Kq()` — with ancestor fallback |
| 95039 | `I()` — opens hidden `<details>` ancestors |
| `lc()` function (inline in 72309) | React fiber tree walker → frameworkContext string |
| `$u()` function (inline in 72309) | DOM Range → selectionRange serializer |
