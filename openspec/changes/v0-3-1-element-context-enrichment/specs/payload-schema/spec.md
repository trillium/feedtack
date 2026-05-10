## MODIFIED Requirements

### Requirement: AncestorNode includes class list

The `AncestorNode` interface SHALL include a `classes` field containing an array of the element's CSS class names at the time of capture.

- **Type:** `string[]`
- **Source:** `Array.from(el.classList)` at click time
- **When empty:** empty array `[]`, never `null`

#### Scenario: Element with classes captured
- **WHEN** the resolved target has `class="btn btn-primary active"`
- **THEN** the node includes `classes: ["btn", "btn-primary", "active"]`

#### Scenario: Element with no classes
- **WHEN** the resolved target has no class attribute
- **THEN** the node includes `classes: []`

#### Scenario: Classes captured for ancestor nodes
- **WHEN** an ancestor element has CSS classes
- **THEN** that ancestor node includes the class array, same as the target

---

### Requirement: AncestorNode includes text content

The `AncestorNode` interface SHALL include a `textContent` field with the element's trimmed text content, truncated to 120 characters.

- **Type:** `string | null`
- **Source:** `el.textContent?.trim().slice(0, 120) ?? null`
- **When blank after trim:** `null`

#### Scenario: Button with visible label
- **WHEN** the resolved target is `<button>Submit feedback</button>`
- **THEN** the node includes `textContent: "Submit feedback"`

#### Scenario: Text content truncated
- **WHEN** an element's text content exceeds 120 characters
- **THEN** `textContent` contains the first 120 characters of the trimmed string

#### Scenario: Element with no text content
- **WHEN** an element has no text content (e.g. an `<img>`)
- **THEN** `textContent` is `null`

#### Scenario: Whitespace-only content
- **WHEN** an element's text content is whitespace only
- **THEN** `textContent` is `null` (trimming collapses it to empty, treated as null)

---

### Requirement: AncestorNode includes placeholder for form inputs

The `AncestorNode` interface SHALL include a `placeholder` field with the element's `placeholder` attribute value.

- **Type:** `string | null`
- **Source:** `el.getAttribute('placeholder') ?? null`
- **When absent:** `null`

#### Scenario: Input with placeholder
- **WHEN** the resolved target is `<input placeholder="Search...">`
- **THEN** the node includes `placeholder: "Search..."`

#### Scenario: Non-input element
- **WHEN** the resolved target is a `<button>`
- **THEN** `placeholder` is `null`
