# Changelog

## 2026-06-30 — session 601b3363

Files: src/ui/modalStyles.ts, src/react/providerTypes.ts, src/react/FeedtackProvider.tsx, src/react/FeedbackModal.tsx, src/core/dom.ts

> AI summary pending — check ProjectDocs Handover in next session.
## 2026-05-19 — session 5843b625

Files: src/core/input.ts

> AI summary pending — check ProjectDocs Handover in next session.
## 2026-05-14 — session bea57165

Files: examples/tack-server/server.ts, examples/tack-server/README.md, package.json, examples/tack-server/patch-report.ts, examples/tack-server/playwright-reporter.ts, src/test/setup.ts, src/extension/manifest.json, src/extension/content.ts, src/extension/popup.html, src/extension/popup.ts

> AI summary pending — check ProjectDocs Handover in next session.
## 2026-05-14 — Chrome extension + hot-reload pipeline

- **Chrome extension (MV3):** side panel replaces FAB as primary tacking UI — pick element with crosshair, add note + sentiment, submit directly from panel
- **Element picker:** crosshair cursor + blue highlight overlay on hover; captures full metadata (selector, dataTestId, tagName, textContent, 5-level ancestor chain, boundingRect, scroll/viewport)
- **FAB retained but off by default:** toggled via Settings in the side panel; injection now routes through `chrome.scripting.executeScript` with `world: MAIN` to bypass strict page CSP
- **Hot-reload pipeline:** tack-server WS `/reload` channel + `scripts/ping-reload.ts` post-build hook — extension reloads in-place in real Chrome after every `pnpm dev` rebuild; no separate browser profile needed
- **Real icons:** `build-extension.ts` rasterizes `site-docs/src/app/icon.svg` via `rsvg-convert` at 16/48/128px, replacing placeholder solid-blue PNGs
- **Issues filed:** [#47](https://github.com/trillium/feedtack/issues/47) onSubmit callback, [#48](https://github.com/trillium/feedtack/issues/48) persist element highlight after pick

## [1.4.0](https://github.com/trillium/feedtack/compare/v1.3.2...v1.4.0) (2026-05-14)

### Features

* add animated workflow SVG to README with dark/light mode support ([18ea800](https://github.com/trillium/feedtack/commit/18ea8009f580e6383d0e5fbc49f0e4ec9d761265))
* add tack-server example with Playwright reporter ([9dc26bb](https://github.com/trillium/feedtack/commit/9dc26bb5d325e605952db9ccca66d6a31b192245))
* **capture:** element context enrichment + viewport breakpoint ([06aeaae](https://github.com/trillium/feedtack/commit/06aeaaeb3cbfacc3bd2ae9b5a6bb779754a24fda))
* **provider:** generic user type + username field ([#45](https://github.com/trillium/feedtack/issues/45)) ([74b0768](https://github.com/trillium/feedtack/commit/74b076880d1a77c87cd1469ad22150a1f5452ace))
* **ux:** shift+P toggles pin mode; mobile tap-to-dismiss ([027e874](https://github.com/trillium/feedtack/commit/027e874d5f50c027c356e74069a5d766e9e9bfcc))

### Bug Fixes

* add slate-900 background to dark mode workflow SVG ([f12ab69](https://github.com/trillium/feedtack/commit/f12ab69136323d1ab3a40167936bd7a46543becb)), closes [#0f172a](https://github.com/trillium/feedtack/issues/0f172a)
* **build:** align pnpm to v10, add build:docs script, fix site-docs vercel output dir ([786a9a6](https://github.com/trillium/feedtack/commit/786a9a6707ac58a8da4cae27ae53edd724aab09f))
* **ci:** move helpers tests to site-docs, add site-docs vitest ([3f12651](https://github.com/trillium/feedtack/commit/3f1265157077f6fd12a3c566be70fbcc3a8388c5))
* **ci:** remove redundant pnpm version — packageManager field in package.json takes precedence ([428f337](https://github.com/trillium/feedtack/commit/428f3375c08e45fd05f3d41bc4b3c2c393505e9c))
* **ci:** resolve vitest failures from missing deps and stray spec file ([12f14a3](https://github.com/trillium/feedtack/commit/12f14a35f5af29d40e8240459c23c5bef8e2dcb8))
* prevent pinning feedtack UI element on click and touch ([adf899a](https://github.com/trillium/feedtack/commit/adf899a064613ee743b0b51ee977cec955a485f5))
* **site-docs:** add favicon icon.svg via App Router file convention ([#28](https://github.com/trillium/feedtack/issues/28)) ([2eb02d7](https://github.com/trillium/feedtack/commit/2eb02d70f7be85713ae78625b8d6dd3a61c3a70d))
* **site-docs:** constrain theme toggle width in sidebar footer ([#29](https://github.com/trillium/feedtack/issues/29)) ([7288892](https://github.com/trillium/feedtack/commit/72888927a6bf17e2cea92779ce98b1a7ad5485e9))
* **site-docs:** declare favicon and apple-touch-icon in metadata ([#28](https://github.com/trillium/feedtack/issues/28)) ([3ed14a0](https://github.com/trillium/feedtack/commit/3ed14a0b1e167585319c1da8fd1456e21c290707))
* **site-docs:** hide duplicate Fumadocs subnav logo on /docs ([#27](https://github.com/trillium/feedtack/issues/27)) ([a18ba6c](https://github.com/trillium/feedtack/commit/a18ba6cb1c2c271dd5bb79d2218286fed02832a0))
* **site-docs:** remove duplicate search/sidebar buttons from docs subnav header ([#43](https://github.com/trillium/feedtack/issues/43)) ([d32956b](https://github.com/trillium/feedtack/commit/d32956b4f3bdfa6e611a4d884bd7a438265f4ef2))
* **test:** exclude .claude worktrees from vitest, remove unused import ([fa5fa58](https://github.com/trillium/feedtack/commit/fa5fa588d2ebd43d8dc50d6e8dc2c63f9bcd88b0))
* **test:** polyfill localStorage for Bun+vitest environments ([800afd1](https://github.com/trillium/feedtack/commit/800afd19d4ec44be037636bee35bd9e97ffaa7a0))
* **ui:** sentiment buttons use explicit class for reliable selected state; modal closes on submit ([ffed613](https://github.com/trillium/feedtack/commit/ffed6138ef1814cce658da8275aa443323ecf343))
* **ui:** set explicit text color on thread/modal/form panels ([5cb9daa](https://github.com/trillium/feedtack/commit/5cb9daa2c18754b451ae2362eecde135d8110dbb))
* **vercel:** set outputDirectory to dist for library build ([2ab242e](https://github.com/trillium/feedtack/commit/2ab242e9e8230531e447b9a2d9ca29ade7627a1b))

## [1.3.2](https://github.com/trillium/feedtack/compare/v1.3.1...v1.3.2) (2026-05-09)

### Bug Fixes

* **site-docs:** update broken tier-card imports to use @/data/pricing-tiers ([87f618f](https://github.com/trillium/feedtack/commit/87f618f5f935b4d161c1f88cd7845c115c96d587))
* **site-docs:** use production server for Playwright tests ([247c13d](https://github.com/trillium/feedtack/commit/247c13d8cf86b8f01082eb549c242ddab5f04acd))

## [1.3.1](https://github.com/trillium/feedtack/compare/v1.3.0...v1.3.1) (2026-05-09)

### Bug Fixes

* **inject:** one pin per tack and persist FAB after submit ([5394eb0](https://github.com/trillium/feedtack/commit/5394eb0793df3c8b439be7a3eebf70626d0c2f94))

## [1.3.0](https://github.com/trillium/feedtack/compare/v1.2.0...v1.3.0) (2026-05-09)

### Features

* **inject:** add self-contained injectable snippet with Shadow DOM UI ([e8a4af9](https://github.com/trillium/feedtack/commit/e8a4af9086b3874d7fde2bf49ebfd12f2b892f3a))

## [1.2.0](https://github.com/trillium/feedtack/compare/v1.1.0...v1.2.0) (2026-05-09)

### Features

* add content approval and content editing system ([8ba7978](https://github.com/trillium/feedtack/commit/8ba7978563b098ee6e3d617da63f944a613e2ed5))

### Bug Fixes

* move DiskAdapter to separate entrypoint to avoid bundling node:fs in browsers ([17467f2](https://github.com/trillium/feedtack/commit/17467f2c1695f373093d5db16d10217f154bed00)), closes [#25](https://github.com/trillium/feedtack/issues/25)
* use native dialog element for modal backdrop click-to-close ([3865720](https://github.com/trillium/feedtack/commit/3865720ad7270a887b3bcec752b392a867a62029)), closes [#22](https://github.com/trillium/feedtack/issues/22)

## [](https://github.com/trillium/feedtack/compare/v1.0.1...vnull) (2026-05-02)

### Features

* export DiskAdapter from adapters barrel ([8c0cf52](https://github.com/trillium/feedtack/commit/8c0cf52bc6b43c3b484b51d426155123a4d4e301))
* **site-docs:** add animated workflow visualization to landing page ([5ac7eae](https://github.com/trillium/feedtack/commit/5ac7eae848ac4e820845c2e382ab99154fd4f31e))
* **site-docs:** add expanding pulse ring to submit step animation ([25e5b4f](https://github.com/trillium/feedtack/commit/25e5b4f1379c9c320497c096bc2ce24ca05b0959))
* **site-docs:** add joke pricing page with sponsor links ([07227dd](https://github.com/trillium/feedtack/commit/07227dd46dc018da4613a368f8692f8960dc83d4))
* **site-docs:** add pin teardrop icon to Feedtack wordmark logo ([b4d2e8a](https://github.com/trillium/feedtack/commit/b4d2e8a3ec3573760eb29080a2e4a64603f419d3))
* **site-docs:** add skeleton shimmer bar component for loading effect ([1d9797a](https://github.com/trillium/feedtack/commit/1d9797a4b7e40dc6aac8726ded96b81644692a9e))
* **site-docs:** add Tailwind CSS v4 with PostCSS integration ([f5af3dc](https://github.com/trillium/feedtack/commit/f5af3dc13ca7bf7244be8d6e8609e04c0f621895))
* **site-docs:** fix animation cursor design and step layout ([1188dea](https://github.com/trillium/feedtack/commit/1188dea4071ad5c854950f0242dd515573859ea4))
* **site-docs:** flexbox step progress bar and seamless browse-click transition ([b7052e4](https://github.com/trillium/feedtack/commit/b7052e48967dba4258180a2c6ce5972170aa1520))
* **site-docs:** modern Figma-style cursor with smooth glide animation ([ce254c5](https://github.com/trillium/feedtack/commit/ce254c52c190e1d764607e566416225a54809848))
* **site-docs:** pricing page, nav, and search ([#23](https://github.com/trillium/feedtack/issues/23)) ([b5c62a6](https://github.com/trillium/feedtack/commit/b5c62a6c7cc461b8cbbf05d1729a0cf1a35aeac3))
* **site-docs:** redesign hero spacing and features grid layout ([5f3c27c](https://github.com/trillium/feedtack/commit/5f3c27c18a8dcbcc52d8ecbc8a64cf7cbba3caf4))
* **site-docs:** redesign pricing page with premium visual treatment ([69cf218](https://github.com/trillium/feedtack/commit/69cf2180dd2c2008dabce0eb2b1d4e0db380b70b))
* **site-docs:** write feedback to filesystem on localhost ([ac80369](https://github.com/trillium/feedtack/commit/ac80369d7d8ad655c502e0b036a1761d06b5ed4b))

### Bug Fixes

* **site-docs:** improve step progress bar visual design ([348d2da](https://github.com/trillium/feedtack/commit/348d2dabbe85caf43708c3551f7235760f7fb01a))
* **site-docs:** replace solid typing bars with word-dash animation ([5fb9695](https://github.com/trillium/feedtack/commit/5fb9695c39b20ebde45d2bb2322d441c84eb16c2))
* **site-docs:** restructure animation steps with centered stage layout ([18c4333](https://github.com/trillium/feedtack/commit/18c43337d9151d1b396a722581ed358a4f50225a))
* **site-docs:** upgrade pricing page visual design ([d1f561a](https://github.com/trillium/feedtack/commit/d1f561a9f9df87cae96a77509f97832750e8e6d8))
* **site-docs:** use shared PinSvg component in wordmark logo ([5943b76](https://github.com/trillium/feedtack/commit/5943b76036c2434e9ec4db14eb28e5c9c359b543))

## [1.0.1](https://github.com/trillium/feedtack/compare/v1.0.0...v1.0.1) (2026-04-21)

### Bug Fixes

* modal as anchored panel above feedback button, not screen overlay ([c2a175c](https://github.com/trillium/feedtack/commit/c2a175ce32bb403bba454573c31a561a1da77844))

## [1.0.0](https://github.com/trillium/feedtack/compare/v0.5.1...v1.0.0) (2026-04-21)

### ⚠ BREAKING CHANGES

* feedback scope modal with site/page/element levels

### Features

* feedback scope modal with site/page/element levels ([bcce2c2](https://github.com/trillium/feedtack/commit/bcce2c27faa5dacdf83fdf256d78c9d9a43ef8db))

## [0.5.1](https://github.com/trillium/feedtack/compare/v0.5.0...v0.5.1) (2026-04-21)

### Bug Fixes

* store boundingRect as document-relative and expose color API ([#19](https://github.com/trillium/feedtack/issues/19), [#20](https://github.com/trillium/feedtack/issues/20)) ([5dd10a4](https://github.com/trillium/feedtack/commit/5dd10a455c9520498ab3c35a2c3ad54b2731d4c4))

## [0.5.0](https://github.com/trillium/feedtack/compare/v0.4.0...v0.5.0) (2026-04-21)

### Features

* anchor pin markers to DOM nodes via selector resolution ([#18](https://github.com/trillium/feedtack/issues/18)) ([358c667](https://github.com/trillium/feedtack/commit/358c6677dd69f6f6f4218cc63640efecfad562bb))

## [0.4.0](https://github.com/trillium/feedtack/compare/v0.3.1...v0.4.0) (2026-04-20)

### Features

* onFlush callback, re-scope on reply, and touch pin placement ([#14](https://github.com/trillium/feedtack/issues/14), [#16](https://github.com/trillium/feedtack/issues/16), [#17](https://github.com/trillium/feedtack/issues/17)) ([c510efb](https://github.com/trillium/feedtack/commit/c510efb0ea6f54e68f1afeb4f4c2dbaee7653b94))

### Bug Fixes

* ssr guard for window access and theme vars on fixed-position elements ([#13](https://github.com/trillium/feedtack/issues/13), [#15](https://github.com/trillium/feedtack/issues/15)) ([56efd54](https://github.com/trillium/feedtack/commit/56efd54c462b2df1e9def02e9f30ae10f43c56a6))

## [0.3.1](https://github.com/trillium/feedtack/compare/v0.3.0...v0.3.1) (2026-04-19)

### Bug Fixes

* suppress arrow-key color cycling when modal open, use theme vars in thread panel ([#11](https://github.com/trillium/feedtack/issues/11), [#12](https://github.com/trillium/feedtack/issues/12)) ([add797f](https://github.com/trillium/feedtack/commit/add797f04a0e52ccd1a8d0853b0d2fccec35145a))

## [0.3.0](https://github.com/trillium/feedtack/compare/v0.2.1...v0.3.0) (2026-04-18)

### Features

* ctrl+enter submit and accessibility improvements ([#7](https://github.com/trillium/feedtack/issues/7), [#8](https://github.com/trillium/feedtack/issues/8)) ([56acfee](https://github.com/trillium/feedtack/commit/56acfeea35384437950c8f0f16bc6b8e8e07dffb))
* **react:** add renderPinIcon prop and default resolved checkmark ([#6](https://github.com/trillium/feedtack/issues/6)) ([43e1d19](https://github.com/trillium/feedtack/commit/43e1d19d52c98b8ab9655105693c5b7f9bb2fead))

## [0.2.1](https://github.com/trillium/feedtack/compare/v0.2.0...v0.2.1) (2026-04-14)

### Features

* **capture:** rich element targeting — ancestor chain, interactive resolution, fiber names ([da908ba](https://github.com/trillium/feedtack/commit/da908ba05d353a1c7e1bd32097479a8fcf71a9f9))

### Bug Fixes

* **react:** defer history state updates and guard malformed pins ([#4](https://github.com/trillium/feedtack/issues/4), [#5](https://github.com/trillium/feedtack/issues/5)) ([697d901](https://github.com/trillium/feedtack/commit/697d901c80a2d16eb4e0dff4da88cfb929e69597))

## [0.2.0](https://github.com/trillium/feedtack/compare/v0.1.1...v0.2.0) (2026-04-10)

### Features

* **provider:** add disabled prop to suppress all UI in CI environments ([c416afe](https://github.com/trillium/feedtack/commit/c416afea5b7bd0cda8f97c4d41788369e12c56d0))

## [0.1.1](https://github.com/trillium/feedtack/compare/v0.1.0...v0.1.1) (2026-04-10)

### Bug Fixes

* **ui:** filter pins by current pathname, reload on SPA navigation ([c95bd5f](https://github.com/trillium/feedtack/commit/c95bd5ff8d51af4ccedd6b8fe109db2485b90e42))

### Reverts

* Revert "docs(spec): rename change dir to date-brief-version format (v0.0.3)" ([2bd2412](https://github.com/trillium/feedtack/commit/2bd2412ccf087896c43b543e481f100ab9e54db0))
* Revert "docs(spec): bump change dir to v0.1.0" ([b429f2e](https://github.com/trillium/feedtack/commit/b429f2eb146b9fd083106147b115d5951830354f))

## 0.1.0 (2026-04-10)

### Features

* **adapter:** add LocalStorageAdapter for zero-infrastructure persistence ([44cff46](https://github.com/trillium/feedtack/commit/44cff460702330cd9c38d4b67d66b1aeb45b232f))
* **capture:** add testId and elementPath fields to pin target ([6dfaefb](https://github.com/trillium/feedtack/commit/6dfaefbb5ab0df64cf7d96169ad63b4a6945b8bd))
* **feedtack:** implement v1 — pin UI, metadata capture, adapters, feedback state, 25 tests ([4ca0039](https://github.com/trillium/feedtack/commit/4ca0039b742c65acc05ca19ae23f624b044c48a9))
* **theme:** add theme prop (CSS tokens) and classes prop (element overrides), bump 0.0.2 ([278d4a2](https://github.com/trillium/feedtack/commit/278d4a283d4bb7dd91babd6a89c1c473c7de8b70))

### Bug Fixes

* **#2:** Tailwind v4 preflight — add !important to panel backgrounds ([c74ae4a](https://github.com/trillium/feedtack/commit/c74ae4a508b7b460de1ecd2927d6391fc976d89c)), closes [#2](https://github.com/trillium/feedtack/issues/2) [#3](https://github.com/trillium/feedtack/issues/3)
* **ui:** anchor pin marker at bottom tip and format styles ([918bd05](https://github.com/trillium/feedtack/commit/918bd054dec7dcecba6335755fd8e9a670ac7654))
