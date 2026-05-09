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

**Webhook mode**: If a URL is provided at init time (`feedtack.inject({ url: '...' })`), payloads are sent via `navigator.sendBeacon(url, JSON.stringify(payload))`. sendBeacon is fire-and-forget, survives page unload, and doesn't block UI. Falls back to `fetch()` if sendBeacon is unavailable.

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

The console paste version IS the full IIFE — no loader needed.

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

### 6. Reuse capture code via build-time bundling

The IIFE bundles `src/capture/target.ts` and `src/capture/meta.ts` at build time. These modules are already React-free. tsup bundles them into the IIFE alongside the inject-specific UI code.

Verify: `src/capture/index.ts` barrel must not re-export anything that pulls in React. Currently exports `scanFields` and `hashField` from `content.ts` which uses Web Crypto — fine, but not needed for the snippet. The IIFE entry point imports directly from `target.ts` and `meta.ts`.

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

Package.json export:
```json
"./inject": { "default": "./dist/feedtack.inject.js" }
```

### 8. Snippet builder docs page

React component at `site-docs/content/docs/guides/snippet.mdx` with an interactive client component:

- Text input for webhook URL (optional)
- Toggle for clipboard vs webhook mode
- Generated bookmarklet: renders as a draggable `<a href="javascript:...">` link
- Generated console snippet: copyable code block with the full IIFE
- Preview of what the snippet does (static screenshot or description)

The component is a client-side React component in the docs site — it generates the bookmarklet/snippet strings dynamically based on user input.

## Risks / Trade-offs

- **[Bundle size]** → Monitor with `ls -la dist/feedtack.inject.js` after build. If over 20KB, audit what's being included. The capture logic is small; the UI DOM construction is the bulk.
- **[CSP restrictions]** → Some sites block inline scripts or eval. The bookmarklet loader may be blocked by strict CSP. Mitigation: document this limitation, suggest the console paste method as fallback (which also won't work under strict CSP, but that's a known browser security boundary).
- **[Clipboard API permissions]** → Modern browsers require HTTPS + user gesture for clipboard access. The submit button click provides the gesture. Non-HTTPS sites fall back to `document.execCommand('copy')`.
- **[Shadow DOM browser support]** → Supported in all modern browsers. No IE11 support, which is acceptable.
- **[sendBeacon payload limits]** → Browsers typically allow 64KB for sendBeacon. Feedtack payloads are well under this (~2-3KB).
