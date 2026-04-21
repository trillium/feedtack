## ADDED Requirements

### Requirement: Feedback scope discriminator
Every feedback payload SHALL include a `scope` field with one of three values: `'site'`, `'page'`, or `'element'`. The scope determines what level of the application the feedback applies to.

#### Scenario: Site-scoped feedback has no pathname or pins
- **WHEN** a user submits feedback with scope `'site'`
- **THEN** the payload has `scope: 'site'`, an empty `pins` array, and page metadata is captured but pathname is not used for scoping

#### Scenario: Page-scoped feedback has pathname but no pins
- **WHEN** a user submits feedback with scope `'page'`
- **THEN** the payload has `scope: 'page'`, the current pathname in `page.pathname`, and an empty `pins` array

#### Scenario: Element-scoped feedback has pins
- **WHEN** a user submits feedback via pin placement
- **THEN** the payload has `scope: 'element'`, at least one pin in the `pins` array, and the current pathname in `page.pathname`

### Requirement: Backward-compatible scope inference
Payloads loaded from storage that lack a `scope` field SHALL be treated as `scope: 'element'`. This ensures existing v1 data renders correctly without migration.

#### Scenario: Legacy payload without scope field
- **WHEN** `loadFeedback` returns a payload without a `scope` field
- **THEN** the system treats it as `scope: 'element'` and renders its pins normally

### Requirement: Scope-aware filtering
The `loadFeedback` filter SHALL accept an optional `scope` field. When provided, adapters SHALL return only feedback items matching that scope. When omitted, all scopes are returned.

#### Scenario: Filter by site scope
- **WHEN** `loadFeedback({ scope: 'site' })` is called
- **THEN** only feedback items with `scope: 'site'` are returned

#### Scenario: Filter by page scope with pathname
- **WHEN** `loadFeedback({ scope: 'page', pathname: '/about' })` is called
- **THEN** only page-scoped feedback for `/about` is returned

#### Scenario: No scope filter returns all
- **WHEN** `loadFeedback({ pathname: '/about' })` is called without a `scope` filter
- **THEN** feedback of all scopes matching the pathname is returned
