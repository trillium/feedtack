## ADDED Requirements

### Requirement: Activation button with visible hotkey
The system SHALL render a floating activation button in the host app's admin nav. The button text SHALL display the configured hotkey (e.g., "Drop Pin [P]"). The host app SHALL control whether the button is visible based on user role (admin/stakeholder).

#### Scenario: Button shows hotkey in label
- **WHEN** feedtack is initialized with a hotkey config
- **THEN** the activation button label includes the hotkey in brackets (e.g., "[P]")

#### Scenario: Hotkey activates pin mode
- **WHEN** the user presses the configured hotkey
- **THEN** pin mode activates as if the button was clicked

#### Scenario: Button hidden for non-admin users
- **WHEN** feedtack is initialized with `adminOnly: true` and the current user is not an admin
- **THEN** the activation button is not rendered

---

### Requirement: Crosshair cursor mode
The system SHALL change the cursor to a crosshair when pin mode is active, indicating the user may click anywhere to place a pin.

#### Scenario: Cursor changes on activation
- **WHEN** pin mode is activated
- **THEN** the cursor changes to a crosshair across the entire page

#### Scenario: Cursor restores on deactivation
- **WHEN** pin mode is deactivated without placing a pin
- **THEN** the cursor returns to its default state

---

### Requirement: Multiple color-coded pins per session
The system SHALL allow the user to place multiple pins before submitting. Each pin SHALL be assigned a distinct color from a predefined palette. Pins placed in a single feedback session SHALL share one comment thread.

#### Scenario: First pin placed
- **WHEN** the user clicks in pin mode
- **THEN** a pin marker is rendered at the click location with the first available color

#### Scenario: Second pin placed in same session
- **WHEN** the user clicks a second location while pin mode is still active
- **THEN** a second pin marker is rendered with a different color

#### Scenario: Pins are visually distinct
- **WHEN** multiple pins exist on the page
- **THEN** each pin marker has a unique color from the palette

---

### Requirement: Comment form required before submission
The system SHALL display a comment form after the first pin is placed. The form SHALL be required — the user cannot submit without entering at least one character. The form SHALL include a satisfaction toggle ("satisfied" / "dissatisfied") as a non-blocking sentiment field.

#### Scenario: Form appears after pin placement
- **WHEN** a pin is placed
- **THEN** a comment form appears anchored near the pin

#### Scenario: Submit blocked on empty comment
- **WHEN** the user attempts to submit with an empty comment field
- **THEN** submission is blocked and an inline validation message is shown

#### Scenario: Satisfaction toggle is optional
- **WHEN** the user submits without selecting satisfied/dissatisfied
- **THEN** the payload is emitted with `sentiment: null`

#### Scenario: Satisfaction toggle captured
- **WHEN** the user selects "satisfied" or "dissatisfied"
- **THEN** the payload includes `sentiment: "satisfied"` or `sentiment: "dissatisfied"`

---

### Requirement: Cancel clears in-progress pins
The system SHALL provide a cancel action that removes all in-progress pins and closes the comment form without emitting a payload.

#### Scenario: Cancel discards pins
- **WHEN** the user cancels a pin session
- **THEN** all pin markers are removed and no payload is emitted

#### Scenario: Escape key cancels
- **WHEN** pin mode is active and the user presses Escape
- **THEN** pin mode is deactivated and any placed pins are removed
