# Changelog

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
