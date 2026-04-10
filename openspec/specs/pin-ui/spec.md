# pin-ui Specification

## Purpose
TBD - created by archiving change v0-1-1-pathname-scoping. Update Purpose after archive.
## Requirements
### Requirement: Pins scoped to the page they were created on
Persisted pin markers SHALL only render on the page (pathname) where they were originally placed. When the user navigates to a different route, pins from other pages SHALL NOT be visible. The system SHALL reload feedback for the new pathname on each SPA navigation.

#### Scenario: Pin from /page does not appear on /dashboard
- **WHEN** a pin is created on `/page` and the user navigates to `/dashboard`
- **THEN** the pin marker is not rendered on `/dashboard`

#### Scenario: Pins for current page load on navigation
- **WHEN** the user navigates to a new route
- **THEN** `loadFeedback` is called with the new pathname and only matching pins are rendered

#### Scenario: Pins reappear on return to original page
- **WHEN** the user navigates back to the page where a pin was created
- **THEN** the pin marker is visible again

### Requirement: Activation button with visible hotkey
The system SHALL render a floating activation button in the host app's admin nav. The button text SHALL display the configured hotkey (e.g., "Drop Pin [Shift+P]"). The default hotkey SHALL be `Shift+P`. The host app may override the hotkey via config. The host app SHALL control whether the button is visible based on user role (admin/stakeholder).

#### Scenario: Button shows default hotkey in label
- **WHEN** feedtack is initialized without a hotkey config
- **THEN** the activation button label shows "[Shift+P]"

#### Scenario: Button shows custom hotkey in label
- **WHEN** feedtack is initialized with a custom hotkey config
- **THEN** the activation button label includes the custom hotkey in brackets

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

### Requirement: Multiple color-selectable pins per session
The system SHALL allow the user to place multiple pins before submitting. Pins placed in a single feedback session SHALL share one comment thread. The user SHALL be able to select any color for each pin from a fixed palette of 6 colors — color is for the user's own convention and has no semantic meaning to the system.

#### Scenario: First pin placed with default color
- **WHEN** the user clicks in pin mode without selecting a color
- **THEN** a pin marker is rendered at the click location with the first palette color

#### Scenario: User selects a color before placing pin
- **WHEN** the user selects a color from the palette and then clicks
- **THEN** the pin marker renders in the selected color

#### Scenario: Multiple pins with different colors
- **WHEN** the user places multiple pins with different colors selected
- **THEN** each pin marker renders in its selected color

#### Scenario: Arrow keys cycle color in pin mode
- **WHEN** pin mode is active and the user presses ArrowRight
- **THEN** the selected color advances to the next color in the palette (wrapping around)

#### Scenario: Arrow left cycles color backward
- **WHEN** pin mode is active and the user presses ArrowLeft
- **THEN** the selected color moves to the previous color in the palette (wrapping around)

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

