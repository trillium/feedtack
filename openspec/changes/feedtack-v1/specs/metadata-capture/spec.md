## ADDED Requirements

### Requirement: DOM target capture at click point
The system SHALL capture the clicked DOM element's identity and position at the moment of pin placement. Capture SHALL use a priority fallback chain: `id` → `data-testid` → CSS selector. If no stable selector is found, the capture SHALL succeed with `best_effort: true` in the payload — submission SHALL NOT be blocked.

#### Scenario: Element with id captured
- **WHEN** user clicks an element with an `id` attribute
- **THEN** the payload target includes `selector: "#<id>"` and `best_effort: false`

#### Scenario: Element with data-testid captured
- **WHEN** user clicks an element with `data-testid` but no `id`
- **THEN** the payload target includes `selector: "[data-testid=\"<value>\"]"` and `best_effort: false`

#### Scenario: Fallback to CSS selector
- **WHEN** user clicks an element with neither `id` nor `data-testid`
- **THEN** the payload target includes a CSS selector path and `best_effort: true`

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
