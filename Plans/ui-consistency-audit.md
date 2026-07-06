# UI Consistency Audit — Extension as the Gold Standard

> 2026-07-06. Compares every user-facing interaction across the three entry points.
> Reference implementation: `src/extension/content.ts` (crosshair picker + hover element highlight).
> Canonical UX is documented in `SPEC.md` § UX Reference.

## The mental model we're converging on

The Chrome extension got the targeting experience right: enter a picking mode, **see the element you're about to tack light up as you hover**, click to capture it, then annotate. The highlight is what makes Feedtack feel precise — the user knows exactly what the payload will describe before they commit. The React provider and IIFE inject had the capture machinery but not the visual feedback: a bare crosshair cursor with no indication of what a click would grab.

## Interaction-by-interaction comparison

| Interaction | Extension | React provider | IIFE inject |
|---|---|---|---|
| Entry point | Toolbar icon → side panel → Pick button | FAB widget or Shift+hotkey (admin-gated) | FAB → panel (pin mode auto-on) |
| Targeting mode indicator | Crosshair cursor | Crosshair cursor | Crosshair cursor |
| **Hover element highlight** | ✅ outline + tint overlay | ❌ → ✅ **closed this pass** | ❌ → ✅ **closed this pass** |
| What gets highlighted | Raw hovered element | Resolved capture target | Resolved capture target |
| Capture on click | Element card in panel | Colored pin marker + form | Blue pin marker + form |
| Multiple pins per tack | ❌ single element | ✅ multi-pin | ❌ single pin (replaced on re-click) |
| Pin color choice | n/a | ✅ 6-color palette + arrow-key cycle | ❌ hardcoded blue |
| Escape key | Cancels picker only | Exits pin mode | Closes entire panel (loses draft) |
| Sentiment | Good/Bad | Good/Bad (i18n labels) | Good/Bad (fixed labels) |
| Two-way (threads/resolve/archive) | ❌ | ✅ | ❌ |
| Fiber component names in payload | ❌ (hand-rolled capture) | ✅ | ❌ (by design — no React dependency) |

## What was closed in this pass

**Hover element highlight in React and IIFE.** New shared module `src/capture/highlight.ts` — framework-free, same visual language as the extension picker (blue outline, translucent tint, `pointer-events:none`, 50ms position transitions). Wired into:

- React: `setCrosshair()` in `src/core/dom.ts` now toggles both picking-mode affordances (crosshair cursor class + highlight) — the engine's activate/deactivate/destroy call sites needed no changes. Feedtack's own UI is excluded via `FEEDTACK_UI_SELECTOR`.
- IIFE: `createPanelController.setPinMode()` in `src/inject/panel.ts` attaches/detaches. `#feedtack-inject` excluded.

One deliberate improvement over the extension: React and IIFE highlight the **resolved capture target** (`resolveTarget()` — the nearest interactive ancestor that `getTargetMeta()` will actually serialize), not the raw hovered node. The highlight now previews exactly what the payload will describe. The extension highlights and captures the raw element because its picker duplicates capture logic (already tracked as fe-3i7); when fe-3i7 lands, the extension inherits the same resolution behavior for free.

Unit coverage: `src/capture/highlight.test.ts` (attach/idempotence/positioning/exclusion/target-resolution/detach).

## Gaps filed as issues (not closed this pass)

| Gap | Why deferred | Issue |
|---|---|---|
| IIFE hardcoded blue pin — no color palette | Needs palette UI in the vanilla panel; touches styles/ui/panel/state | fe-gj5 |
| IIFE single-pin — `placePin` removes prior markers | Multi-pin changes submit payload shape assembly and panel copy | fe-963 |
| Escape semantics diverge (cancel-picker vs exit-pin-mode vs close-panel-losing-draft) | Cross-path behavior decision; IIFE draft loss is the real bug | fe-i7m |
| Extension captures raw element, no interactive-ancestor promotion, no fiber names | Pre-existing: extension picker should reuse `src/capture/` | fe-3i7 (existing) |

## Inherent scope differences (documented, no action)

- The extension is element-card-based (side panel), not pin-marker-based — a consequence of working on arbitrary sites without page injection. Not a divergence to fix.
- Two-way features (threads, resolve, archive, content editing) are React-only by design; the IIFE is one-way submission. Broadening that is fe-4qy / fe-10j territory.
