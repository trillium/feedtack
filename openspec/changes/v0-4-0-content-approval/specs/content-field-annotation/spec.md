## ADDED Requirements

### Requirement: data-feedtack-field annotation attribute
The system SHALL recognize `data-feedtack-field` as a first-class DOM attribute for marking content nodes. Its value SHALL be a dot-path string (e.g. `hero.heading`, `coaching.cta.label`) that uniquely identifies the field within a page. The dot-path is opaque to feedtack — it is used as a key in the approval store.

#### Scenario: Element with data-feedtack-field is recognized as a content field
- **WHEN** an element has `data-feedtack-field="hero.heading"` in the DOM
- **THEN** `scanFields()` includes it in the returned field list with its path and current text content

#### Scenario: Element without data-feedtack-field is not included
- **WHEN** an element has no `data-feedtack-field` attribute
- **THEN** `scanFields()` does not include it in the returned field list

### Requirement: Field scanning utility
The system SHALL provide a `scanFields(root?: Element)` utility that queries the DOM for all `[data-feedtack-field]` elements and returns their path, element reference, and current text content. If `root` is omitted, scanning begins from `document.body`.

#### Scenario: scanFields returns all annotated fields
- **WHEN** the DOM contains three elements with `data-feedtack-field` attributes
- **THEN** `scanFields()` returns an array of three `ScannedField` objects

#### Scenario: scanFields respects a root element
- **WHEN** called with a specific root element
- **THEN** only fields within that subtree are returned

### Requirement: Duplicate field path warning in development
The system SHALL emit a `console.warn` when `scanFields()` finds two or more elements sharing the same `data-feedtack-field` value on the same page, in development mode only.

#### Scenario: Duplicate field path triggers warning
- **WHEN** two elements share the same `data-feedtack-field` value and `NODE_ENV !== 'production'`
- **THEN** `console.warn` is called with a message identifying the duplicate path

### Requirement: Field content hashing
The system SHALL provide a `hashField(content: string): Promise<string>` utility that computes a truncated SHA-256 hash of the field's text content using the Web Crypto API. The hash SHALL be a 12-character lowercase hex string.

#### Scenario: Same content produces same hash
- **WHEN** `hashField` is called twice with identical strings
- **THEN** both calls return the same hash value

#### Scenario: Different content produces different hash
- **WHEN** `hashField` is called with two distinct strings
- **THEN** the two hashes differ
