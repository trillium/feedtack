## 1. Capture code isolation

- [ ] 1.1 Audit `src/capture/target.ts` import tree — confirm `fiber.ts` is the only React-adjacent dependency
- [ ] 1.2 Create `src/inject/target-shim.ts` — re-exports `serializeNode` from `target.ts` but replaces `getComponentName` with a no-op returning `null`
- [ ] 1.3 Verify `src/capture/meta.ts` has no React dependencies

## 2. Inject module structure

- [ ] 2.1 Create `src/inject/index.ts` — IIFE entry point: checks for existing instance (idempotency guard via `#feedtack-inject`), reads `window.__feedtack_config`, calls `init(config)`, exposes `feedtack.inject()` and `feedtack.destroy()` on the global
- [ ] 2.2 Create `src/inject/config.ts` — config type (`{ url?: string, user?: { id: string, name: string, role: string } }`), config resolution (global → argument merge), default anonymous user (`{ id: 'anon', name: 'Anonymous', role: 'reviewer' }`)
- [ ] 2.3 Create `src/inject/egress.ts` — clipboard egress (clipboard API + execCommand fallback), webhook egress (sendBeacon with `new Blob([json], { type: 'application/json' })` + fetch fallback with status reporting)

## 3. Inject UI (vanilla JS, Shadow DOM)

- [ ] 3.1 Create `src/inject/ui.ts` — Shadow DOM host creation (`id="feedtack-inject"`), style injection, trigger button (44x44px min for touch targets), `direction: ltr` on shadow root
- [ ] 3.2 Create `src/inject/panel.ts` — feedback panel: scope tabs (site/page/element), optional name input, comment textarea, sentiment buttons, submit button (with debounce), pin mode button; `max-height: 80vh; overflow-y: auto` for mobile
- [ ] 3.3 Create `src/inject/pin.ts` — crosshair cursor mode (desktop), `click` + `touchend` event handlers, element click handler, pin indicator placement, target capture using `target-shim.ts`
- [ ] 3.4 Create `src/inject/toast.ts` — transient confirmation toast ("Copied to clipboard" / "Sent" / error message for fetch fallback failures)
- [ ] 3.5 Create `src/inject/styles.ts` — all CSS as a string constant, injected into Shadow DOM via `<style>` element

## 4. Payload assembly

- [ ] 4.1 Create `src/inject/payload.ts` — assembles `FeedtackPayload` (schemaVersion 2.0.0) from captured data: scope, comment, sentiment, pins (with `componentName: null`), page meta, viewport, device. ID via `'ft_' + crypto.randomUUID()`. `submittedBy` from config user or name input override.
- [ ] 4.2 Wire submit flow: panel submit → payload assembly → egress → toast → reset

## 5. Teardown

- [ ] 5.1 Implement `feedtack.destroy()` — remove Shadow DOM host, detach all event listeners (pin mode, keyboard, touch), delete `window.feedtack` global, clear `window.__feedtack_config`

## 6. Build configuration

- [ ] 6.1 Add IIFE entry to `tsup.config.ts` — entry `src/inject/index.ts`, format `iife`, globalName `feedtack`, minify, noExternal (bundle everything)
- [ ] 6.2 Verify `dist/feedtack.inject.js` is published in the package but NOT added to `package.json` exports map (IIFE self-executes — unsafe for ESM/SSR import)
- [ ] 6.3 Verify built bundle is under 20KB minified
- [ ] 6.4 Verify built bundle contains no React references (`react`, `createElement`, `jsx`, `__reactFiber`, `use client`)

## 7. Tests

- [ ] 7.1 Unit tests for `src/inject/egress.ts` — clipboard write, sendBeacon with Blob Content-Type, fetch fallback with status, execCommand fallback
- [ ] 7.2 Unit tests for `src/inject/config.ts` — global config, argument config, merge behavior, default anonymous user
- [ ] 7.3 Unit tests for `src/inject/payload.ts` — payload structure matches schemaVersion 2.0.0, `submittedBy` from config, `componentName: null`, ID format `ft_<uuid>`
- [ ] 7.4 Unit test for idempotency — second `inject()` call is a no-op when host exists, works after `destroy()`
- [ ] 7.5 Unit test for `src/inject/target-shim.ts` — `componentName` is always `null`
- [ ] 7.6 Build verification test: bundle size < 20KB, no React artifacts in output
- [ ] 7.7 Integration test: inject → submit → verify payload structure and egress call

## 8. Snippet builder docs page

- [ ] 8.1 Create `site-docs/content/docs/guides/snippet.mdx` — guide page with description, limitations (CSP, pointer-events overlays, iframes), and embedded interactive component
- [ ] 8.2 Create `site-docs/src/components/SnippetBuilder.tsx` — client component: webhook URL input (validated as HTTPS URL, XSS-safe), optional user name input, version pin toggle (default: pinned), loader/offline toggle for console snippet, generated bookmarklet `<a>` link, copyable console snippet code block
- [ ] 8.3 Add URL sanitization — validate with `new URL()`, require `https:` protocol, show error on invalid input, never embed unsanitized input in `javascript:` href
- [ ] 8.4 Add `snippet` to `site-docs/content/docs/guides/meta.json` pages array
- [ ] 8.5 Verify Playwright doc route test covers `/docs/guides/snippet`
- [ ] 8.6 Unit/integration test for SnippetBuilder — valid URL accepted, invalid URL rejected, XSS payload rejected, version pinning in output

## 9. README

- [ ] 9.1 Add "Injectable snippet" section to README — brief description, console loader example, bookmarklet example, link to docs guide
