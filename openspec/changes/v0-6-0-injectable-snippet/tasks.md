## 1. Verify capture modules are React-free

- [ ] 1.1 Audit `src/capture/target.ts` and `src/capture/meta.ts` import trees — confirm no React dependencies
- [ ] 1.2 Audit `src/capture/index.ts` barrel — ensure IIFE entry can import `target` and `meta` without pulling in `content.ts` React-adjacent code

## 2. Inject module structure

- [ ] 2.1 Create `src/inject/index.ts` — IIFE entry point that reads `window.__feedtack_config`, calls `init(config)`, exposes `feedtack.inject()` and `feedtack.destroy()` on the global
- [ ] 2.2 Create `src/inject/config.ts` — type definitions for inject config (`{ url?: string }`) and config resolution (global vs argument)
- [ ] 2.3 Create `src/inject/egress.ts` — clipboard egress (clipboard API + execCommand fallback) and webhook egress (sendBeacon + fetch fallback)

## 3. Inject UI (vanilla JS, Shadow DOM)

- [ ] 3.1 Create `src/inject/ui.ts` — Shadow DOM host creation, style injection, trigger button rendering
- [ ] 3.2 Create `src/inject/panel.ts` — feedback panel: scope tabs (site/page/element), comment textarea, sentiment buttons, submit button, pin mode button
- [ ] 3.3 Create `src/inject/pin.ts` — crosshair cursor mode, element click handler, pin indicator placement, target capture using `src/capture/target.ts`
- [ ] 3.4 Create `src/inject/toast.ts` — transient confirmation toast ("Copied to clipboard" / "Sent")
- [ ] 3.5 Create `src/inject/styles.ts` — all CSS as a string constant, injected into Shadow DOM via `<style>` element

## 4. Payload assembly

- [ ] 4.1 Create `src/inject/payload.ts` — assembles `FeedtackPayload` (schemaVersion 2.0.0) from captured data (scope, comment, sentiment, pins, page meta, viewport, device)
- [ ] 4.2 Wire submit flow: panel submit → payload assembly → egress → toast → reset

## 5. Teardown

- [ ] 5.1 Implement `feedtack.destroy()` — remove Shadow DOM host, detach all event listeners (pin mode, keyboard shortcuts), delete global references

## 6. Build configuration

- [ ] 6.1 Add IIFE entry to `tsup.config.ts` — entry `src/inject/index.ts`, format `iife`, globalName `feedtack`, minify, noExternal
- [ ] 6.2 Add `"./inject"` export path to `package.json` pointing to `dist/feedtack.inject.js`
- [ ] 6.3 Verify built bundle is under 20KB minified
- [ ] 6.4 Verify built bundle contains no React references (`react`, `createElement`, `jsx`)

## 7. Tests

- [ ] 7.1 Unit tests for `src/inject/egress.ts` — clipboard write, sendBeacon call, fallbacks
- [ ] 7.2 Unit tests for `src/inject/config.ts` — global config, argument config, merge behavior
- [ ] 7.3 Unit tests for `src/inject/payload.ts` — payload structure matches schemaVersion 2.0.0
- [ ] 7.4 Integration test: inject → submit → verify payload structure
- [ ] 7.5 Build verification test: bundle size < 20KB, no React in output

## 8. Snippet builder docs page

- [ ] 8.1 Create `site-docs/content/docs/guides/snippet.mdx` — guide page with description and embedded interactive component
- [ ] 8.2 Create `site-docs/src/components/SnippetBuilder.tsx` — client component: webhook URL input, mode toggle, generated bookmarklet `<a>` link, copyable console snippet code block
- [ ] 8.3 Add `snippet` to `site-docs/content/docs/guides/meta.json` pages array
- [ ] 8.4 Verify Playwright doc route test covers `/docs/guides/snippet`

## 9. README

- [ ] 9.1 Add "Injectable snippet" section to README — brief description, console paste example, bookmarklet example, link to docs guide
