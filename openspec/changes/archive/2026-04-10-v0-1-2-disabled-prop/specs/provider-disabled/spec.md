## ADDED Requirements

### Requirement: disabled prop suppresses all feedtack UI
`FeedtackProvider` SHALL accept a `disabled` boolean prop (default `false`). When `disabled={true}`, the system SHALL render only the provider's children — no activation button, no pin markers, no comment form, no thread panels, no DOM injection, and no event listeners.

#### Scenario: disabled renders only children
- **WHEN** `<FeedtackProvider disabled>` is mounted
- **THEN** no feedtack UI elements are rendered and no DOM side effects occur

#### Scenario: activation button absent when disabled
- **WHEN** `disabled={true}` is set
- **THEN** the Drop Pin button is not rendered

#### Scenario: hotkey has no effect when disabled
- **WHEN** `disabled={true}` is set and the user presses the configured hotkey
- **THEN** pin mode does not activate

#### Scenario: disabled defaults to false
- **WHEN** the `disabled` prop is omitted
- **THEN** feedtack behaves normally

### Requirement: useFeedtack does not throw when provider is disabled
The context SHALL still be provided when `disabled={true}` so that `useFeedtack()` calls anywhere in the tree do not throw. All returned actions SHALL be no-ops.

#### Scenario: useFeedtack safe when disabled
- **WHEN** `disabled={true}` is set and a child component calls `useFeedtack()`
- **THEN** the hook returns without throwing and `isPinModeActive` is `false`
