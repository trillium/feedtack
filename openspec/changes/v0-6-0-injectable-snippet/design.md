## Context

Feedtack's capture logic (`src/capture/target.ts`, `src/capture/meta.ts`) is already framework-agnostic — it reads DOM attributes, computes selectors, and collects viewport/device metadata. The React layer (`src/react/`) wraps this in hooks and components. The injectable snippet needs to reuse the capture layer but provide its own UI and egress, independent of React.

The existing build produces ESM/CJS modules via tsup. The snippet needs a single IIFE file that can be pasted raw or loaded via a bookmarklet.

## Goals / Non-Goals

**Goals:**
- A single JS file that works when pasted into any browser console or loaded as a bookmarklet
- Same payload schema as the React version (full interop)
- Zero-config clipboard mode and optional webhook mode
- Interactive docs page where users generate their configured snippet
- Under 20KB minified

**Non-Goals:**
- Content approval/editing — feedback-only
- Persistent feedback list / inbox UI — submit and forget
- Server-side rendering or SSR compatibility
- Thread/reply support — single submissions only
- Screenshot capture

## Decisions

### 1. IIFE with inline styles, no external assets

The snippet must be fully self-contained. All CSS is injected as inline styles or a single `<style>` element. No external fonts, icons, or stylesheets.

**Alternative considered:** Loading a hosted CSS file. Rejected because it adds a network dependency and CORS issues on arbitrary sites.

### 2. Two-mode egress: clipboard (default) vs webhook

**Clipboard mode** (default): On submit, the payload JSON is copied to the clipboard via `navigator.clipboard.writeText()`. A toast confirms "Copied to clipboard." No server, no URL, no config. Falls back to `document.execCommand('copy')` if clipboard API is unavailable (non-HTTPS).

**Webhook mode**: If a URL is provided at init time (`feedtack.inject({ url: '...' })`), payloads are sent via `navigator.sendBeacon(url, blob)` where `blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })`. The Blob ensures the correct `Content-Type: application/json` header — without it, sendBeacon sends `text/plain` and most webhook receivers reject the payload. sendBeacon is fire-and-forget, survives page unload, and doesn't block UI. Falls back to `fetch()` with `keepalive: true` if sendBeacon is unavailable; the fetch fallback reports success/error based on response status.

**Alternative considered:** LocalStorage queue with export. Rejected — data would live on someone else's domain and requires a separate export step.

### 3. Bookmarklet as a loader, not the full script

The bookmarklet URL can't contain the full IIFE (URL length limits vary by browser, ~2KB is safe). Instead, the bookmarklet injects a `<script>` tag that loads the snippet from a CDN (unpkg/jsdelivr) or a user-provided URL:

```
javascript:void((function(){var s=document.createElement('script');s.src='https://unpkg.com/feedtack@latest/dist/feedtack.inject.js';document.head.appendChild(s)})())
```

For webhook mode, the bookmarklet sets a global config before loading:

```
javascript:void((function(){window.__feedtack_config={url:'https://...'};var s=document.createElement('script');s.src='...';document.head.appendChild(s)})())
```

The console paste version is a short loader script (same pattern as the bookmarklet but without the `javascript:` wrapper). The raw IIFE source is available as a secondary "offline" option for users who need to work without network access, but the default console snippet is the loader — pasting a 15-20KB minified blob is impractical in most browser consoles.

### 4. UI structure

Minimal floating UI in bottom-right corner, matching existing feedtack visual language:

- **Trigger button**: Small floating button, `position: fixed`, bottom-right. Click toggles the panel.
- **Panel**: Scope selector (site/page/element tabs), comment textarea, sentiment buttons (good/bad/none), submit button.
- **Pin mode**: "Place a pin" button switches to crosshair cursor. Click on any element captures target. Pin indicator appears on element.
- **Toast**: Confirmation message after submit (copied / sent).

All UI lives inside a Shadow DOM host element to avoid CSS conflicts with the host page.

### 5. Shadow DOM isolation

The snippet creates a `<div id="feedtack-inject">` with an attached shadow root. All UI renders inside the shadow DOM. This prevents:
- Host page CSS from affecting feedtack UI
- Feedtack styles from leaking into the host page
- ID/class collisions

### 6. Reuse capture code via build-time bundling — excluding fiber.ts

The IIFE bundles `src/capture/target.ts` and `src/capture/meta.ts` at build time. However, `target.ts` imports `getComponentName` from `fiber.ts`, which walks React fiber internals (`__reactFiber$`) and has a `'use client'` directive. This must be excluded from the IIFE.

**Approach:** Create `src/inject/target-shim.ts` that re-exports everything from `target.ts` but replaces the `getComponentName` import with a no-op that returns `null`. This keeps the capture code untouched for React users while giving the IIFE a clean dependency tree. The IIFE entry imports from the shim, not from `target.ts` directly.

The IIFE entry point imports directly from `target-shim.ts` and `meta.ts` — never through `capture/index.ts` barrel.

### 7. Build configuration

New tsup entry point:

```ts
// tsup.config.ts — add entry
{
  entry: { 'feedtack.inject': 'src/inject/index.ts' },
  format: ['iife'],
  globalName: 'feedtack',
  minify: true,
  noExternal: [/.*/],  // bundle everything
}
```

Output: `dist/feedtack.inject.js`

**No `package.json` export path.** The IIFE self-executes on load — adding it to the exports map would cause `import ... from 'feedtack/inject'` to immediately self-execute, which is dangerous in Node.js/SSR. The file is published in `dist/` and accessed via CDN URL or direct file reference only.

### 8. Snippet builder docs page

React component at `site-docs/content/docs/guides/snippet.mdx` with an interactive client component:

- Text input for webhook URL (optional)
- Toggle for clipboard vs webhook mode
- Generated bookmarklet: renders as a draggable `<a href="javascript:...">` link
- Generated console snippet: copyable code block with the full IIFE
- Preview of what the snippet does (static screenshot or description)

The component is a client-side React component in the docs site — it generates the bookmarklet/snippet strings dynamically based on user input.

**URL sanitization:** The webhook URL input must be validated as a well-formed HTTPS URL before embedding in the bookmarklet `javascript:` href. Raw user input in a `javascript:` URL is an XSS vector (e.g., `'};alert(1);//` breaks out of the config string). Validate with `new URL()` and require `https:` protocol. Reject any URL that fails validation.

**Version pinning:** The bookmarklet source URL defaults to the current feedtack version (e.g., `feedtack@1.2.0`), not `@latest`. This prevents saved bookmarklets from breaking when a new version ships. The builder shows the pinned version with an option to switch to `@latest`.

### 9. User identity

The snippet config accepts an optional `user` field: `feedtack.inject({ user: { id: 'u1', name: 'Alice', role: 'designer' } })`. If not provided, the payload uses `{ id: 'anon', name: 'Anonymous', role: 'reviewer' }`. The snippet UI includes an optional name input — if the user types a name, it overrides the config/default for `submittedBy.name`.

The snippet builder docs page includes a user name input alongside the webhook URL.

### 10. Payload ID generation

The IIFE uses `crypto.randomUUID()` for payload IDs (prefixed with `ft_`). This is available in all modern browsers without additional dependencies. No nanoid dependency needed.

### 11. Idempotency — double-injection guard

On initialization, the IIFE checks for an existing `document.getElementById('feedtack-inject')` Shadow DOM host. If found, the second injection is a no-op (returns the existing instance). `feedtack.destroy()` removes the host, allowing re-injection.

### 12. Touch / mobile support

Pin mode listens for both `click` and `touchend` events. The trigger button uses `min-width: 44px; min-height: 44px` for touch targets. The panel uses `max-height: 80vh; overflow-y: auto` to fit small screens. No cursor change on touch devices (no cursor to change).

## Risks / Trade-offs

- **[Bundle size]** → Monitor with `ls -la dist/feedtack.inject.js` after build. If over 20KB, audit what's being included. The capture logic is small; the UI DOM construction is the bulk.
- **[CSP restrictions]** → Some sites block inline scripts or eval. The bookmarklet loader may be blocked by strict CSP. Mitigation: document this limitation, suggest the console paste method as fallback (which also won't work under strict CSP, but that's a known browser security boundary).
- **[Clipboard API permissions]** → Modern browsers require HTTPS + user gesture for clipboard access. The submit button click provides the gesture. Non-HTTPS sites fall back to `document.execCommand('copy')`.
- **[Shadow DOM browser support]** → Supported in all modern browsers. No IE11 support, which is acceptable.
- **[sendBeacon payload limits]** → Browsers typically allow 64KB for sendBeacon. Feedtack payloads are well under this (~2-3KB).
- **[CSP `style-src`]** → Shadow DOM `<style>` elements are still subject to the page's CSP `style-src` directive. Sites with `style-src 'self'` (no `'unsafe-inline'`) will block the injected styles, rendering the UI unstyled. Document this limitation — there is no workaround short of loading styles from an allowed origin.
- **[sendBeacon delivery]** → sendBeacon returns a boolean (queued, not delivered). The toast shows "Sent" for sendBeacon (acknowledging fire-and-forget) and shows success/error for the fetch fallback which has a response status. Document that sendBeacon provides no delivery confirmation.
- **[Pointer-events overlays]** → Cookie banners, modals, and loading overlays with `pointer-events: none` or full-screen z-index can intercept pin mode clicks. Document this limitation — the snippet captures whatever `e.target` resolves to.
- **[RTL pages]** → The snippet UI forces `direction: ltr` inside the Shadow DOM to avoid inheriting RTL layout from the host page.
