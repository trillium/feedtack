## ADDED Requirements

### Requirement: ContentEditAdapter interface
The system SHALL define a `ContentEditAdapter` interface that extends `ContentAdapter`:

```ts
interface ContentEditAdapter extends ContentAdapter {
  loadFields(): Promise<Record<string, string>>
  saveField(fieldPath: string, value: string): Promise<void>
}
```

`loadFields()` returns a map of all known field paths to their current stored values. `saveField()` persists a new value and MUST atomically clear the stored approval for that field.

#### Scenario: loadFields returns stored values
- **WHEN** `loadFields()` is called on an adapter with stored field data
- **THEN** it returns a `Record<string, string>` mapping field paths to their current values

#### Scenario: saveField persists value and clears approval
- **WHEN** `saveField("hero.heading", "New headline")` is called
- **THEN** the new value is persisted and the stored approval for `"hero.heading"` is cleared

#### Scenario: Adapter without ContentEditAdapter still works
- **WHEN** an adapter implements only `FeedtackAdapter` or `ContentAdapter`
- **THEN** feedtack initializes and operates normally; editing features are unavailable

### Requirement: isContentEditAdapter type guard
The system SHALL provide an `isContentEditAdapter(adapter): adapter is ContentEditAdapter` type guard that returns true only when the adapter implements all methods of `ContentEditAdapter`.

#### Scenario: Type guard identifies ContentEditAdapter
- **WHEN** `isContentEditAdapter` is called with an adapter that implements `loadFields` and `saveField`
- **THEN** it returns `true`

#### Scenario: Type guard rejects partial implementations
- **WHEN** `isContentEditAdapter` is called with an adapter missing `saveField`
- **THEN** it returns `false`

### Requirement: ContentEditAdapter dev-mode warning
The system SHALL emit a `console.warn` in development mode when edit methods are called on an adapter that does not implement `ContentEditAdapter`.

#### Scenario: Edit method called on non-ContentEditAdapter emits warning
- **WHEN** `saveField()` is invoked and the adapter does not implement `ContentEditAdapter` and `NODE_ENV !== 'production'`
- **THEN** `console.warn` is called describing the missing implementation

### Requirement: DiskAdapter ContentEditAdapter implementation
`DiskAdapter` SHALL implement `ContentEditAdapter`. `loadFields()` reads all approval JSON files to reconstruct the field map. `saveField()` writes the new value to `<dir>/fields/<fieldPath>.json` and deletes `<dir>/approvals/<fieldPath>.json`.

#### Scenario: DiskAdapter saveField persists and clears approval
- **WHEN** `saveField("hero.heading", "Updated text")` is called on a DiskAdapter
- **THEN** `fields/hero_heading.json` contains the new value and `approvals/hero_heading.json` is deleted

#### Scenario: DiskAdapter loadFields returns all stored fields
- **WHEN** `loadFields()` is called after two fields have been saved
- **THEN** the returned map contains both field paths with their current values

### Requirement: WebhookAdapter ContentEditAdapter implementation
`WebhookAdapter` SHALL implement `ContentEditAdapter`. `loadFields()` delegates to an optional `loadFields` config function. `saveField()` POSTs `{ type: 'save-field', fieldPath, value, clearApproval: true }` to `updateUrl`.

#### Scenario: WebhookAdapter saveField POSTs correct payload
- **WHEN** `saveField("hero.heading", "Updated text")` is called on a WebhookAdapter
- **THEN** a POST is made to `updateUrl` with body `{ type: 'save-field', fieldPath: 'hero.heading', value: 'Updated text', clearApproval: true }`
