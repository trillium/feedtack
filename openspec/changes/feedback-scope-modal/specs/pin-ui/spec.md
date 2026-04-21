## MODIFIED Requirements

### Requirement: Activation button with visible hotkey
The system SHALL render a floating "Feedback" button. Clicking the button SHALL open the feedback modal. The `⇧P` hotkey (or configured hotkey) SHALL also open the modal. The button no longer directly toggles pin mode — pin mode is activated from within the modal via a "Place a pin" button. The host app SHALL control whether the button is visible based on user role (admin/stakeholder).

#### Scenario: Button opens modal instead of pin mode
- **WHEN** the user clicks the "Feedback" button
- **THEN** the feedback modal opens (pin mode is NOT directly activated)

#### Scenario: Hotkey opens modal
- **WHEN** the user presses the configured hotkey (default `⇧P`)
- **THEN** the feedback modal opens

#### Scenario: Button label shows "Feedback"
- **WHEN** feedtack is initialized
- **THEN** the activation button label shows "Feedback" (not "Drop Pin [Shift+P]")

#### Scenario: Button hidden for non-admin users
- **WHEN** feedtack is initialized with `adminOnly: true` and the current user is not an admin
- **THEN** the activation button is not rendered

### Requirement: Comment form required before submission
The system SHALL display a comment form after the first pin is placed. The form SHALL be required — the user cannot submit without entering at least one character. The form SHALL include a sentiment toggle labeled "Good" / "Bad" as a non-blocking sentiment field.

#### Scenario: Form appears after pin placement
- **WHEN** a pin is placed
- **THEN** a comment form appears anchored near the pin

#### Scenario: Submit blocked on empty comment
- **WHEN** the user attempts to submit with an empty comment field
- **THEN** submission is blocked and an inline validation message is shown

#### Scenario: Sentiment toggle shows Good and Bad labels
- **WHEN** the comment form is displayed
- **THEN** the sentiment options are labeled "Good" and "Bad" as text (no emoji)

#### Scenario: Satisfaction toggle is optional
- **WHEN** the user submits without selecting Good/Bad
- **THEN** the payload is emitted with `sentiment: null`

#### Scenario: Sentiment value captured
- **WHEN** the user selects "Good" or "Bad"
- **THEN** the payload includes `sentiment: "good"` or `sentiment: "bad"`
