## 1. Capture Isolation

- [x] 1.1 Create `src/inject/target-shim.ts` — re-export all of `target.ts` but replace `getComponentName` import with `() => null` stub
- [x] 1.2 Create `src/inject/capture.ts` — re-export meta functions, import `getTargetMeta` from target-shim

## 2. Inject Config & Types

- [x] 2.1 Create `src/inject/types.ts` — `FeedtackInjectConfig` interface with `webhookUrl?`, `user?`, `version` fields
- [x] 2.2 Create `src/inject/config.ts` — config parser with defaults (anon user, clipboard mode), webhook URL validation

## 3. Egress

- [x] 3.1 Create `src/inject/egress.ts` — `sendPayload(payload, config)` with clipboard (default) and webhook (sendBeacon + Blob) modes

## 4. Inject UI

- [x] 4.1 Create `src/inject/styles.ts` — Shadow DOM CSS (direction:ltr, 44px touch targets, 80vh panel)
- [x] 4.2 Create `src/inject/ui.ts` — Shadow DOM panel rendering (fab, panel, textarea, sentiment, submit/cancel)
- [x] 4.3 Wire touch/mobile support (touchend handler, 44px min targets)

## 5. Main Entry

- [x] 5.1 Create `src/inject/main.ts` — IIFE entry: idempotency guard, config parse from `window.__feedtack`, Shadow DOM mount, pin mode, submit flow

## 6. Build

- [x] 6.1 Update `tsup.config.ts` — add `inject` entry with IIFE format, no external, minified
- [x] 6.2 Verify build output — `dist/feedtack.inject.js` exists, is self-contained, no React refs

## 7. Tests

- [x] 7.1 Test: target-shim serializeNode returns componentName null
- [x] 7.2 Test: config parser applies defaults for missing fields
- [x] 7.3 Test: config parser validates webhook URL (https required)
- [x] 7.4 Test: egress clipboard mode writes to clipboard
- [x] 7.5 Test: egress webhook mode calls sendBeacon with Blob
- [x] 7.6 Test: idempotency guard prevents double injection

## 8. Docs

- [ ] 8.1 Create `site-docs/content/docs/guides/injectable-snippet.mdx` — usage guide with snippet builder instructions
- [ ] 8.2 Create `site-docs/src/app/(home)/snippet-builder/page.tsx` — interactive snippet builder component
