## MODIFIED Requirements

### Requirement: useContentApproval hook
The system SHALL provide a `useContentApproval(adapter, userId, options?)` React hook that returns:
- `fields`: current `FieldApprovalState[]` for all scanned fields
- `approve(fieldPath: string)`: approve the field as the current user
- `revoke(fieldPath: string)`: revoke approval for the field
- `rescan()`: re-run `scanFields()` and refresh state
- `checkDeploy()`: call `onDeployCheck` and return the result

The hook SHALL accept an optional `options.storedValues?: Map<string, string>` parameter. When provided, hash computation for staleness checks SHALL use the value from this map for a given field path instead of reading `element.textContent` from the DOM.

#### Scenario: useContentApproval returns field states after scan
- **WHEN** the hook mounts and fields are present in the DOM
- **THEN** `fields` contains a `FieldApprovalState` for each annotated field

#### Scenario: approve updates field state
- **WHEN** `approve("hero.heading")` is called
- **THEN** the corresponding `FieldApprovalState` is updated with a non-null approval and `stale: false`

#### Scenario: storedValues used for hash when provided
- **WHEN** `options.storedValues` contains `"hero.heading" → "Live value"` and the DOM element shows `"Stale built value"`
- **THEN** the hash is computed from `"Live value"`, not `"Stale built value"`

#### Scenario: DOM textContent used when storedValues not provided
- **WHEN** `options.storedValues` is not provided
- **THEN** hash computation reads `element.textContent` as before
