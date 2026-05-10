## NEW Requirements

### Requirement: Issue body renders full element context

When a feedback submission contains a pin with element target metadata, the formatted issue body SHALL render an **Element Context** block that includes all non-null fields from the resolved target's `AncestorNode`-equivalent data.

The block SHALL render:
- `Tag` — the element's tag name
- `Classes` — space-joined class list (omitted when empty)
- `Text` — textContent value (omitted when null)
- `Placeholder` — placeholder value (omitted when null)
- `ARIA` — ariaLabel value (omitted when null)
- `Role` — role attribute (omitted when null)
- `Type` — type attribute (omitted when null, e.g. for `input[type="submit"]`)
- `Name` — name attribute (omitted when null)
- `data-testid` — dataTestId value (omitted when null)
- `data-feedtack-component` — dataFeedtackComponent value (omitted when null)
- `Component` — componentName value (omitted when null)

Fields that are null or empty SHALL be omitted entirely (not rendered as "n/a").

#### Scenario: Button with classes and text
- **WHEN** the pin target is a button with classes `["btn", "active"]`, text `"Submit"`, and aria-label `"Submit feedback"`
- **THEN** the issue body contains:
  ```
  **Element Context**
  - Tag: BUTTON
  - Classes: btn active
  - Text: "Submit"
  - ARIA: Submit feedback
  ```

#### Scenario: Input with placeholder, no text
- **WHEN** the pin target is an input with `placeholder="Search..."` and `type="search"`
- **THEN** the issue body contains:
  ```
  **Element Context**
  - Tag: INPUT
  - Type: search
  - Placeholder: Search...
  ```

#### Scenario: Element with no enrichment fields
- **WHEN** the pin target has no classes, no text, no semantic attributes
- **THEN** the Element Context block renders only `Tag`

---

### Requirement: Ancestor chain renders full field set

The ancestor chain section in the issue body SHALL render all non-null fields for each ancestor node, not just `tag`, `id`, and `componentName`.

Fields rendered per ancestor node (omit when null/empty):
- tag + id (combined: `div#sidebar`)
- classes (space-joined)
- ariaLabel, role
- componentName or dataFeedtackComponent

#### Scenario: Ancestor with component name and classes
- **WHEN** an ancestor node has `tag: "nav"`, `componentName: "Sidebar"`, `classes: ["nav", "sidebar"]`
- **THEN** the ancestor is rendered as: `` `nav (Sidebar)` — Classes: nav sidebar ``

#### Scenario: Ancestor with only tag and position
- **WHEN** an ancestor node has only `tag` and `nthChild` set
- **THEN** the ancestor renders the tag alone without extra fields
