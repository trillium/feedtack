## ADDED Requirements

### Requirement: useContentEdit hook
The system SHALL provide a `useContentEdit(adapter, userId)` React hook that manages the full content editing session. It returns:
- `active: boolean` — whether edit mode is currently on
- `activate()` — hydrate DOM from adapter then enable editing
- `deactivate()` — disable editing and clean up DOM
- `changes: FieldChange[]` — session edits (path, from, to, timestamp)
- `revert(fieldPath: string)` — revert a field to its pre-session value
- `saving: string | null` — field path currently being saved, or null
- `focusedField: FocusedFieldInfo | null` — currently focused field info for toolbar
- approval state passthrough from `useContentApproval` (fields, approve, revoke, checkDeploy)

#### Scenario: activate hydrates DOM then enables editing
- **WHEN** `activate()` is called
- **THEN** `loadFields()` is called on the adapter, live values are swapped into `[data-feedtack-field]` elements, and `contenteditable="true"` is set on all annotated fields

#### Scenario: deactivate removes contenteditable and cleans up
- **WHEN** `deactivate()` is called
- **THEN** `contenteditable` is removed from all fields, event listeners are detached, and MutationObserver is disconnected

#### Scenario: blur-to-save triggers on changed value
- **WHEN** a user edits a field and blurs it with a changed value
- **THEN** `saveField()` is called on the adapter and the change is added to the session `changes` array

#### Scenario: blur with unchanged value does not save
- **WHEN** a user focuses and blurs a field without changing it
- **THEN** `saveField()` is NOT called

### Requirement: MutationObserver for dynamic fields
The system SHALL use a `MutationObserver` to detect new `[data-feedtack-field]` elements added to the DOM after edit mode activates, and SHALL apply `contenteditable` and listeners to them.

#### Scenario: Dynamically added field becomes editable
- **WHEN** edit mode is active and a new `[data-feedtack-field]` element is inserted into the DOM
- **THEN** `contenteditable="true"` and blur listeners are attached to it

### Requirement: Hydration indicator
During the period between `activate()` being called and `loadFields()` resolving, the system SHALL set `data-feedtack-hydrating="true"` on `document.body` and remove it once hydration completes.

#### Scenario: Hydrating attribute present during load
- **WHEN** `activate()` is called and `loadFields()` has not yet resolved
- **THEN** `document.body` has `data-feedtack-hydrating="true"`

#### Scenario: Hydrating attribute removed after load
- **WHEN** `loadFields()` resolves
- **THEN** `document.body` no longer has `data-feedtack-hydrating`

### Requirement: FieldChange session tracking
The system SHALL define a `FieldChange` type tracking each edit made in the current session:

```ts
interface FieldChange {
  fieldPath: string
  from: string       // value at session start (pre-first-edit for this field)
  to: string         // most recent saved value
  savedAt: number    // unix ms timestamp
}
```

Only the most recent change per field is tracked — subsequent edits to the same field update the existing `FieldChange` in place (preserving the original `from`).

#### Scenario: Multiple edits to same field record single FieldChange
- **WHEN** a field is edited twice in one session
- **THEN** `changes` contains one entry for that field with the original `from` and the latest `to`

### Requirement: Revert
`revert(fieldPath)` SHALL call `saveField(fieldPath, change.from)` and remove the entry from `changes`.

#### Scenario: Revert restores original value
- **WHEN** `revert("hero.heading")` is called
- **THEN** `saveField("hero.heading", originalValue)` is called and the change is removed from `changes`

### Requirement: Stored value hash source
`useContentEdit` SHALL pass the internal `storedValues` map to `useContentApproval` so that approval hashes are computed from stored values rather than DOM `textContent`.

#### Scenario: Approval hash uses stored value not DOM
- **WHEN** the DOM contains a stale statically-built value that differs from the stored value
- **THEN** the approval staleness check uses the stored value for hash computation
