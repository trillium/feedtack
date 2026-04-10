## 1. Types

- [x] 1.1 Add `disabled?: boolean` to `FeedtackProviderProps` (default `false`)
- [x] 1.2 Add `disabled?: boolean` to `UseFeedtackStateOpts`
- [x] 1.3 Add `disabled?: boolean` to `UsePinModeOpts`

## 2. Hook Implementation

- [x] 2.1 Guard DOM side effects in `useFeedtackDom` — skip style/root injection when disabled
- [x] 2.2 Guard event listeners in `usePinMode` — skip hotkey, arrow key, and click listeners when disabled
- [x] 2.3 Pass `disabled` through `useFeedtackState` to `useFeedtackDom` and `usePinMode`

## 3. Provider

- [x] 3.1 Short-circuit feedtack UI rendering in `FeedtackProvider` when disabled
- [x] 3.2 Provide no-op context value (`isPinModeActive: false`, no-op actions) when disabled

## 4. Tests

- [x] 4.1 Test: disabled renders only children, no feedtack UI elements present
- [x] 4.2 Test: Drop Pin button absent when disabled
- [x] 4.3 Test: `useFeedtack()` does not throw when disabled
