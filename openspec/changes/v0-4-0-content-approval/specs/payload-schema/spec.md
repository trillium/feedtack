## ADDED Requirements

### Requirement: FieldApproval and related types in public type surface
The system SHALL export `FieldApproval`, `FieldApprovalState`, `FieldFilter`, and `ContentAdapter` from the `feedtack` package's public type surface. These SHALL be available via `import type { FieldApproval } from 'feedtack'`.

#### Scenario: FieldApproval importable from feedtack
- **WHEN** a consumer imports `FieldApproval` from `'feedtack'`
- **THEN** the import resolves without error and the type is correct

#### Scenario: ContentAdapter importable from feedtack
- **WHEN** a consumer imports `ContentAdapter` from `'feedtack'`
- **THEN** the import resolves and can be used to type-guard an adapter instance
