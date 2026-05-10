## MODIFIED Requirements

### Requirement: DOM target capture at click point
The system SHALL capture the resolved interactive target's DOM identity at the moment of pin placement. Resolution SHALL first apply interactive ancestor promotion (see element-chain spec). Capture SHALL use a priority fallback chain: `id` → `data-testid` → `data-feedtack-component` → semantic selector built from tag + semantic attributes + nth-child. If no stable selector is found, the capture SHALL succeed with `best_effort: true` in the payload — submission SHALL NOT be blocked.

#### Scenario: Element with id captured
- **WHEN** user clicks an element with an `id` attribute
- **THEN** the payload target includes `selector: "#<id>"` and `best_effort: false`

#### Scenario: Element with data-testid captured
- **WHEN** user clicks an element with `data-testid` but no `id`
- **THEN** the payload target includes `selector: "[data-testid=\"<value>\"]"`, `best_effort: false`, and `dataTestId: "<value>"`

#### Scenario: Element with data-feedtack-component captured
- **WHEN** user clicks an element with `data-feedtack-component` but no id or data-testid
- **THEN** the payload target uses `data-feedtack-component` value in selector and `best_effort: false`

#### Scenario: Fallback to semantic selector with nth-child
- **WHEN** user clicks an element with no id, data-testid, or data-feedtack-component
- **THEN** the payload target includes a selector built from tag + semantic attrs + nth-child/nth-of-type, and `best_effort: true`

#### Scenario: Interactive ancestor promoted before capture
- **WHEN** user clicks a non-interactive child of a button
- **THEN** all metadata is captured from the button, not the child element
