## Why

Feedtack currently requires React integration and a build step. Users who want to quickly audit a live site — QA testers, designers reviewing staging, stakeholders on a call — can't use feedtack without developer setup. A self-contained injectable snippet would let anyone paste a script into the browser console or click a bookmarklet to start leaving feedback on any page, with zero app integration.

## What Changes

- New standalone IIFE bundle (`feedtack.inject.js`) that self-initializes a minimal feedback UI on any page
- Two egress modes: clipboard (default, zero-config) and webhook (user provides a URL, uses `navigator.sendBeacon`)
- Minimal vanilla JS UI: floating trigger button, pin mode with crosshair, scope selector, comment input, sentiment picker, submit
- Same payload schema (`schemaVersion: "2.0.0"`) as the React version — payloads are interchangeable
- Reuses existing capture logic (`src/capture/target.ts`, `src/capture/meta.ts`) bundled into the IIFE — with `fiber.ts` (React fiber walker) excluded, hardcoding `componentName: null`
- Bookmarklet format: `javascript:void(...)` loader URL with version-pinned CDN source
- Console paste format: short CDN loader script (with raw IIFE as secondary offline option)
- User identity via config (`user: { id, name, role }`) or optional name input in the UI, defaulting to anonymous
- New interactive docs page (`/docs/guides/snippet`) where users configure their webhook URL and get a generated bookmarklet link + copyable console snippet
- New build target in `tsup.config.ts` producing `dist/feedtack.inject.js` (minified, self-contained)

## Capabilities

### New Capabilities
- `injectable-snippet`: Self-contained IIFE bundle with vanilla JS UI, capture logic, and egress (clipboard/webhook). No React, no build step, no app integration.
- `snippet-builder`: Interactive docs page component that generates a configured bookmarklet URL and console snippet based on user inputs (webhook URL, options).

### Modified Capabilities
- `payload-schema`: No schema changes — the injectable snippet produces the same v2.0.0 payload. But the capture code paths need to be importable without React dependencies.

## Impact

- **New files**: `src/inject/` directory for standalone bundle source, `site-docs/` page + component for snippet builder
- **Build**: New tsup entry point producing `dist/feedtack.inject.js`
- **Capture code**: `src/capture/target.ts` and `src/capture/meta.ts` must be importable without pulling in React — verify no React imports leak into capture modules
- **Package exports**: `dist/feedtack.inject.js` published in the package but NOT added to `package.json` exports map (IIFE self-executes on import — unsafe for ESM/SSR contexts)
- **Bundle size target**: Under 20KB minified for the IIFE
- **No breaking changes**: Existing React API and adapters are unchanged
