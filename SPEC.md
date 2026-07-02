# Feedtack — Spec

## What It Does

Feedtack is an npm package that adds a click-to-pin feedback widget to any web app. A user clicks anywhere on the page, drops a pin on an element, adds a comment, and submits — generating a structured `FeedtackPayload` with full element metadata (selector, ancestor chain, bounding rect, viewport, device). Payloads are delivered via configurable adapters (webhook, disk, localStorage, console).

Three integration paths:
1. **React provider** (`feedtack/react`) — wraps the app, renders the FAB widget natively
2. **Script inject** (`feedtack.inject.js`) — IIFE dropped into any page via `<script>` or `page.addInitScript()`
3. **Chrome extension** — side panel tacking UI with element picker, works on any site without code changes

## Architecture

```
src/
  types/payload.ts        FeedtackPayload v2.0.0 schema (canonical)
  core/                   FeedtackEngine, actions, DOM helpers, flush
  capture/                Element metadata capture (target, ancestors, fiber, meta)
  inject/                 IIFE widget: config, FAB UI, pin markers, egress, submit
  react/                  React provider, hooks (useFeedtack, useContentApproval, etc.)
  adapters/               WebhookAdapter, DiskAdapter, LocalStorageAdapter, ConsoleAdapter
  node/                   Node.js-only exports (DiskAdapter)
  extension/              Chrome MV3 extension (background, content, panel, popup)

examples/
  tack-server/
    server.ts             Bun HTTP+WS server — POST /tack, GET /tacks, WS /reload
    playwright-reporter.ts Playwright Reporter — patches HTML report with inject.js after run
    patch-report.ts       One-off script to inject Feedtack into an existing report dir

scripts/
  build-extension.ts      Assembles dist/extension/ — copies files, rasterizes SVG icons
  ping-reload.ts          Post-build hook — pings WS /reload to hot-reload the extension

dist/
  index.js + index.d.ts   Main package (ESM)
  node/                   Node.js exports
  react/                  React exports
  feedtack.inject.js      Self-contained IIFE (~14KB minified)
  extension/              Loadable Chrome extension directory
```

## Chrome Extension

| File | Role |
|------|------|
| `background.ts` | SW: opens side panel on icon click; injects FAB via `chrome.scripting` (CSP-safe); hot-reload WS client |
| `content.ts` | Element picker (crosshair, overlay, ancestor capture); message listener for startPicker/stopPicker/setFab |
| `panel.ts` + `panel.html` | Side panel tacking UI: pick element, note, sentiment, submit, settings |
| `popup.ts` + `popup.html` | Legacy settings popup (retained) |
| `manifest.json` | MV3; permissions: storage, sidePanel, tabs, scripting |

**FAB** is injected via `chrome.scripting.executeScript` with `world: 'MAIN'` — bypasses page CSP. Disabled by default; toggled in panel Settings.

## Hot-Reload Pipeline

```
pnpm dev (tsup --watch)
  └─ onSuccess → scripts/ping-reload.ts
       └─ ws://localhost:2727/reload  →  server broadcasts  →  background SW  →  chrome.runtime.reload()
```

Extension reloads in-place in the real browser. No separate profile. Background SW reconnects every 2s if disconnected.

## Playwright Integration

Add to `playwright.config.ts`:
```ts
reporter: [
  ['html', { outputFolder: 'tests/visual/__report__' }],
  ['../../feedtack/examples/tack-server/playwright-reporter.ts',
   { outputFolder: 'tests/visual/__report__' }],
]
```

The reporter patches `index.html` with `feedtack.inject.js` inline after every test run. Tacks reference test rows via `data-testid="test:{id}"`.

## Tack Storage

The tack-server walks up from `process.cwd()` to the nearest `.git` ancestor and writes tacks to `{gitRoot}/.feedtack/{id}.json` as `FeedbackItem` (payload + replies + resolutions + archives).

**Known issue:** storage location depends on where the server is launched. URL-pattern routing config is a planned improvement.

## External Dependencies

| Dep | Purpose |
|-----|---------|
| `rsvg-convert` (brew) | Rasterize SVG logo to PNG icons at build time |
| Bun | Runtime for tack-server, build scripts, tests |
| tsup | Bundler (3 configs: ESM lib, IIFE inject, IIFE extension) |
| vitest | Test runner (145 tests) |
| Biome | Linter/formatter |
| release-it | Versioning + changelog generation |

## Open Issues

- [#47](https://github.com/trillium/feedtack/issues/47) — `onSubmit` callback in `window.__feedtack` config (client-side payload enrichment)
- [#48](https://github.com/trillium/feedtack/issues/48) — Persist element highlight overlay after pick until submit/cancel

## Gotchas

- `chrome.scripting.executeScript` with `world: 'MAIN'` is required for FAB injection — inline `<script>` tags are blocked by strict CSP sites (e.g. claude.ai)
- Chrome popup closes on outside click — side panel stays open; this is why picker lives in the panel, not the popup
- Background SW is killed by Chrome after ~5 minutes idle — breaks hot-reload WS until manually triggered
- `import.meta.dir` is Bun-only; Playwright (Node.js) requires `dirname(fileURLToPath(import.meta.url))`
- tsup `clean: false` on extension build — prevents wiping shared `dist/` outputs across configs

## Last Updated

2026-05-14
