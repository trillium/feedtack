## ADDED Requirements

### Requirement: Interactive ancestor resolution
When a click lands on a non-interactive element (span, svg, path, img, div, etc.) that is a descendant of an interactive element (button, a, input, select, textarea, label), the system SHALL resolve the capture target to the nearest interactive ancestor before any metadata is captured.

#### Scenario: Click on icon inside button resolves to button
- **WHEN** user clicks an SVG icon that is a child of a `<button>`
- **THEN** the captured target element is the `<button>`, not the SVG

#### Scenario: Click on span inside anchor resolves to anchor
- **WHEN** user clicks a `<span>` nested inside an `<a>` tag
- **THEN** the captured target element is the `<a>`, not the span

#### Scenario: Click on directly interactive element is unchanged
- **WHEN** user clicks a `<button>` directly
- **THEN** the captured target element is that `<button>`

#### Scenario: Click on non-interactive element with no interactive ancestor is unchanged
- **WHEN** user clicks a `<div>` with no interactive ancestor
- **THEN** the captured target element is the `<div>`

---

### Requirement: Ancestor chain capture
The system SHALL capture a chain of ancestor elements from the resolved target up to a maximum of 5 levels. Each node in the chain SHALL include the element's semantic identity sufficient for an LLM to locate the element in source code.

#### Scenario: Ancestor chain depth limited to 5
- **WHEN** user clicks an element with more than 5 ancestors
- **THEN** the ancestor chain includes at most 5 entries, starting from the resolved target's parent

#### Scenario: Ancestor chain terminates at body
- **WHEN** user clicks an element with fewer than 5 ancestors before body
- **THEN** the ancestor chain stops before including body

#### Scenario: Each ancestor node includes tag and semantic attributes
- **WHEN** an ancestor chain is captured
- **THEN** each node includes: `tag`, `id`, `ariaLabel`, `role`, `type`, `name`, `title`, `alt`, `dataTestId`, `dataFeedtackComponent`, `nthChild`, `nthOfType`, `componentName`

---

### Requirement: nth-child and nth-of-type capture
For each node in the chain (including the resolved target), the system SHALL compute and include `nthChild` (1-indexed position among all sibling elements) and `nthOfType` (1-indexed position among siblings of the same tag). These SHALL be omitted only when the node has a stable unique identifier (`id` or `data-testid`).

#### Scenario: nth-child computed for unlabeled element
- **WHEN** user clicks a `<div>` with no id or data-testid, and it is the 3rd child of its parent
- **THEN** the node includes `nthChild: 3`

#### Scenario: nth-of-type computed for unlabeled element
- **WHEN** user clicks the 2nd `<button>` among siblings
- **THEN** the node includes `nthOfType: 2`

---

### Requirement: React component name extraction
The system SHALL attempt to extract the React component display name for the resolved target and each ancestor by traversing React fiber internals. If fiber access is unavailable or throws, the system SHALL silently fall back to `null` for `componentName`.

#### Scenario: Component name extracted via fiber
- **WHEN** user clicks an element rendered by a React component named `ProductCard`
- **THEN** the target node includes `componentName: "ProductCard"`

#### Scenario: Fiber unavailable falls back gracefully
- **WHEN** fiber internals are not accessible (non-React page or production minification without displayName)
- **THEN** `componentName` is `null` and capture succeeds normally

---

### Requirement: data-feedtack-component annotation
The system SHALL recognize `data-feedtack-component` as a first-class annotation attribute. When present on an element or any of its ancestors in the chain, its value SHALL be captured as `dataFeedtackComponent` on that node. This attribute takes precedence over fiber-derived component names when both are present.

#### Scenario: data-feedtack-component captured on target
- **WHEN** the resolved target element has `data-feedtack-component="CheckoutForm"`
- **THEN** the target node includes `dataFeedtackComponent: "CheckoutForm"`

#### Scenario: data-feedtack-component on ancestor captured
- **WHEN** an ancestor element has `data-feedtack-component="Sidebar"`
- **THEN** that ancestor node includes `dataFeedtackComponent: "Sidebar"`
