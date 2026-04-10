## Why

In CI environments, automated screenshot and visual regression tests capture feedtack UI (pins, buttons, overlays) as unintended noise. The host app needs a way to suppress all feedtack rendering without removing the provider from the component tree.

## What Changes

- Add `disabled?: boolean` prop to `FeedtackProvider` (default `false`)
- When `disabled`, render only children — no DOM injection, no event listeners, no pin UI
- Context still provided with no-op values so `useFeedtack()` in the tree does not throw

## Capabilities

### New Capabilities
- `provider-disabled`: Controls whether FeedtackProvider renders any UI or attaches any side effects

### Modified Capabilities

## Impact

- `FeedtackProvider` props interface — additive, non-breaking
- `useFeedtackDom` — must skip DOM side effects when disabled
- `usePinMode` — must skip event listeners when disabled
- `useFeedtackState` — must pass disabled flag through to sub-hooks
