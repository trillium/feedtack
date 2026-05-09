## ADDED Requirements

### Requirement: ContentAdapter extension interface
The system SHALL define a `ContentAdapter` interface that adapters may optionally implement alongside `FeedtackAdapter`. Implementing `ContentAdapter` is not required — adapters that omit it continue to work without modification.

```ts
interface ContentAdapter {
  approve(fieldPath: string, approval: FieldApproval): Promise<void>
  revokeApproval(fieldPath: string, userId: string): Promise<void>
  loadApprovals(filter?: FieldFilter): Promise<FieldApprovalState[]>
}
```

#### Scenario: Adapter that implements ContentAdapter can be used for approvals
- **WHEN** an adapter implements both `FeedtackAdapter` and `ContentAdapter`
- **THEN** calling `approve()`, `revokeApproval()`, and `loadApprovals()` resolves without error

#### Scenario: Adapter without ContentAdapter does not break
- **WHEN** an adapter implements only `FeedtackAdapter`
- **THEN** feedtack initializes and operates normally; content approval features are unavailable

### Requirement: ContentAdapter dev-mode warning when not implemented
The system SHALL emit a `console.warn` in development mode when a content approval method is called on an adapter that does not implement `ContentAdapter`.

#### Scenario: Approval called on non-ContentAdapter emits warning
- **WHEN** `approve()` is invoked and the adapter does not implement `ContentAdapter` and `NODE_ENV !== 'production'`
- **THEN** `console.warn` is called describing the missing implementation

### Requirement: FieldApproval type
The system SHALL define a `FieldApproval` type representing a recorded approval for a content field:

```ts
interface FieldApproval {
  hash: string      // 12-char hex SHA-256 of approved content
  by: string[]      // array of user IDs who approved
  at: string        // ISO 8601 UTC timestamp of most recent approval
}
```

#### Scenario: FieldApproval records hash and approver
- **WHEN** a field is approved by user "u1"
- **THEN** the stored `FieldApproval` contains the current field hash and `by: ["u1"]`

### Requirement: FieldApprovalState type
The system SHALL define a `FieldApprovalState` type that combines field identity with its approval record and staleness flag:

```ts
interface FieldApprovalState {
  fieldPath: string
  approval: FieldApproval | null   // null = never approved
  stale: boolean                    // true if current hash != approval.hash
}
```

#### Scenario: Stale approval detected when content changes
- **WHEN** a field's current hash differs from the stored approval hash
- **THEN** `FieldApprovalState.stale` is `true`

#### Scenario: Approval is current when hash matches
- **WHEN** a field's current hash equals the stored approval hash
- **THEN** `FieldApprovalState.stale` is `false`

#### Scenario: Never-approved field has null approval
- **WHEN** a field has no stored approval
- **THEN** `FieldApprovalState.approval` is `null`

### Requirement: onDeployCheck hook
`FeedtackProvider` SHALL accept an optional `onDeployCheck` prop — an async function that, when called by the consumer, computes and returns `{ approved: boolean, pending: string[] }`. `approved` is `true` only when all scanned fields have a current (non-stale) approval. `pending` contains the field paths of all unapproved or stale fields.

#### Scenario: All fields approved returns approved true
- **WHEN** `onDeployCheck` is called and all scanned fields have current approvals
- **THEN** the result is `{ approved: true, pending: [] }`

#### Scenario: Stale or missing approvals surface as pending
- **WHEN** `onDeployCheck` is called and two fields are stale or unapproved
- **THEN** the result is `{ approved: false, pending: ["<path1>", "<path2>"] }`

### Requirement: useContentApproval hook
The system SHALL provide a `useContentApproval()` React hook that returns:
- `fields`: current `FieldApprovalState[]` for all scanned fields
- `approve(fieldPath: string)`: approve the field as the current user
- `revoke(fieldPath: string)`: revoke approval for the field
- `rescan()`: re-run `scanFields()` and refresh state
- `checkDeploy()`: call `onDeployCheck` and return the result

#### Scenario: useContentApproval returns field states after scan
- **WHEN** the hook mounts and fields are present in the DOM
- **THEN** `fields` contains a `FieldApprovalState` for each annotated field

#### Scenario: approve updates field state
- **WHEN** `approve("hero.heading")` is called
- **THEN** the corresponding `FieldApprovalState` is updated with a non-null approval and `stale: false`
