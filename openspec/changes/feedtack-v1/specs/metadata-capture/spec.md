## ADDED Requirements

### Requirement: DOM target capture at click point
The system SHALL capture the clicked DOM element's identity and position at the moment of pin placement. Capture SHALL use a priority fallback chain: `id` → `data-testid` → CSS selector. If no stable selector is found, the capture SHALL succeed with `best_effort: true` in the payload — submission SHALL NOT be blocked.

#### Scenario: Element with id captured
- **WHEN** user clicks an element with an `id` attribute
- **THEN** the payload target includes `selector: "#<id>"` and `best_effort: false`

#### Scenario: Element with data-testid captured
- **WHEN** user clicks an element with `data-testid` but no `id`
- **THEN** the payload target includes `selector: "[data-testid=\"<value>\"]"`, `best_effort: false`, and `testId: "<value>"`

#### Scenario: testId always shipped when present
- **WHEN** user clicks an element that has both `id` and `data-testid`
- **THEN** the payload target uses `selector: "#<id>"` but still includes `testId: "<data-testid value>"` as a separate field

#### Scenario: testId null when absent
- **WHEN** user clicks an element with no `data-testid` attribute
- **THEN** the payload target includes `testId: null`

#### Scenario: Fallback to CSS selector
- **WHEN** user clicks an element with neither `id` nor `data-testid`
- **THEN** the payload target includes a CSS selector path and `best_effort: true`

---

### Requirement: Element path capture
The system SHALL capture a human-readable DOM ancestry path for each pinned element, showing tag names and CSS classes from the element up to the document body or the nearest ancestor with a `data-testid`. This path is designed for downstream LLM consumers to map pins back to source code components. When the clicked element itself has a `data-testid`, the `elementPath` SHALL be `null` (the `testId` is sufficient).

#### Scenario: elementPath shows tag.class ancestry
- **WHEN** user clicks an element without `data-testid` nested inside `<div class="page"><section class="hero"><button class="btn btn-primary">`
- **THEN** the payload target includes `elementPath: "div.page > section.hero > button.btn.btn-primary"`

#### Scenario: elementPath stops at data-testid ancestor
- **WHEN** user clicks an `<em>` inside a `<span class="label">` inside a `<div data-testid="card">`
- **THEN** the payload target includes `elementPath: "[data-testid=\"card\"] > span.label > em"`

#### Scenario: elementPath null when element has testId
- **WHEN** user clicks an element that has a `data-testid` attribute
- **THEN** the payload target includes `elementPath: null`

#### Scenario: Bounding rect captured
- **WHEN** any pin is placed
- **THEN** the payload target includes `boundingRect: { x, y, width, height }`

---

### Requirement: Viewport and scroll state capture
The system SHALL capture the viewport dimensions, scroll position, and device pixel ratio at the moment of pin placement.

#### Scenario: Viewport captured
- **WHEN** a pin is placed
- **THEN** the payload viewport includes `width`, `height`, `scrollX`, `scrollY`, `devicePixelRatio`

---

### Requirement: Page context capture
The system SHALL capture the current page's URL, pathname, and document title at the moment of pin placement.

#### Scenario: Page context captured
- **WHEN** a pin is placed
- **THEN** the payload page includes `url`, `pathname`, and `title`

---

### Requirement: Device info capture
The system SHALL capture `userAgent`, `platform`, and `touchEnabled` at the moment of pin placement.

#### Scenario: Device info captured
- **WHEN** a pin is placed
- **THEN** the payload device includes `userAgent`, `platform`, and `touchEnabled`

---

### Requirement: Pin coordinates captured
The system SHALL capture each pin's click position as document-relative coordinates (pageX, pageY — accounting for scroll) and as a percentage of the full document dimensions. Document-relative coordinates ensure pins render at the correct position after scroll or layout shifts.

#### Scenario: Pin coordinates captured
- **WHEN** a pin is placed at viewport position (clientX, clientY) with scroll offset (scrollX, scrollY)
- **THEN** the payload pin includes `x` (clientX + scrollX), `y` (clientY + scrollY), `xPct`, `yPct`

#### Scenario: Pin renders at correct position after scroll
- **WHEN** a persisted pin is loaded on a page that has been scrolled
- **THEN** the pin marker renders at the correct document position, not the viewport position
