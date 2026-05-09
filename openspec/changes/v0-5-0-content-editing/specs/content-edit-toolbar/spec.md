## ADDED Requirements

### Requirement: ContentEditToolbar component
The system SHALL provide a `ContentEditToolbar` React component that renders a contextual editing toolbar. It is opt-in — the consumer renders it wherever appropriate. `useContentEdit` returns the props object needed to render it via a `toolbarProps` value.

```ts
interface ContentEditToolbarProps {
  focusedField: FocusedFieldInfo | null
  approvalState: FieldApprovalState | null   // for focused field
  changes: FieldChange[]
  saving: string | null
  onApprove: (fieldPath: string) => Promise<void>
  onRevoke: (fieldPath: string) => Promise<void>
  onRevert: (fieldPath: string) => Promise<void>
  onCheckDeploy: () => Promise<DeployCheckResult>
}
```

#### Scenario: Toolbar renders approve button for focused unapproved field
- **WHEN** a field is focused and its `approvalState.stale` is `true`
- **THEN** the toolbar renders an approve button for that field

#### Scenario: Toolbar renders unaccept button for focused approved field
- **WHEN** a field is focused and its `approvalState.stale` is `false`
- **THEN** the toolbar renders an unaccept button for that field

#### Scenario: Toolbar renders nothing when no field is focused
- **WHEN** `focusedField` is `null`
- **THEN** the toolbar renders no field-level actions

### Requirement: Changes panel
`ContentEditToolbar` SHALL include a collapsible changes panel listing all `FieldChange` entries for the current session, each with a revert button.

#### Scenario: Changes panel lists session edits
- **WHEN** two fields have been edited in the session
- **THEN** the changes panel shows two entries with their field paths and new values

#### Scenario: Revert button calls onRevert
- **WHEN** the user clicks the revert button on a change entry
- **THEN** `onRevert(fieldPath)` is called

### Requirement: Deploy gate button
`ContentEditToolbar` SHALL include a deploy gate button that calls `onCheckDeploy()` and renders the result — either a success state or a list of pending field paths.

#### Scenario: Deploy gate shows pending fields when not all approved
- **WHEN** the deploy gate button is clicked and `checkDeploy()` returns `{ approved: false, pending: ["hero.heading"] }`
- **THEN** the toolbar displays `"hero.heading"` as a pending field

#### Scenario: Deploy gate shows success when all approved
- **WHEN** the deploy gate button is clicked and `checkDeploy()` returns `{ approved: true, pending: [] }`
- **THEN** the toolbar displays an all-approved confirmation

### Requirement: Saving indicator
`ContentEditToolbar` SHALL visually indicate which field is currently being saved using the `saving` prop.

#### Scenario: Saving indicator shown during save
- **WHEN** `saving` is `"hero.heading"`
- **THEN** the toolbar displays a saving indicator associated with that field path
