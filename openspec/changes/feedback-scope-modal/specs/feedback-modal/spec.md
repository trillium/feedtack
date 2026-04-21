## ADDED Requirements

### Requirement: Feedback modal as single entry point
The system SHALL render a "Feedback" button that opens a modal dialog when clicked. The `⇧P` hotkey SHALL also open the modal. The modal is the single entry point for all feedback types (site, page, and element).

#### Scenario: Button click opens modal
- **WHEN** the user clicks the "Feedback" button
- **THEN** a modal dialog opens showing feedback scope tabs

#### Scenario: Hotkey opens modal
- **WHEN** the user presses `⇧P` (or configured hotkey)
- **THEN** the modal opens (instead of directly entering pin mode)

#### Scenario: Modal closes on escape or close button
- **WHEN** the modal is open and the user presses Escape or clicks the close button
- **THEN** the modal closes

### Requirement: Site and Page scope tabs
The modal SHALL display tabs for "Site" and "Page" scopes. Each tab shows existing feedback threads for that scope and a compose form at the bottom.

#### Scenario: Site tab shows site-scoped threads
- **WHEN** the user selects the "Site" tab
- **THEN** the modal displays all site-scoped feedback threads

#### Scenario: Page tab shows page-scoped threads for current pathname
- **WHEN** the user selects the "Page" tab
- **THEN** the modal displays page-scoped feedback threads matching the current pathname

#### Scenario: Empty state when no threads exist
- **WHEN** a scope tab has no existing feedback
- **THEN** the tab shows the compose form with no thread list

### Requirement: Compose form within modal
Each scope tab SHALL include a compose form with a comment text field, a sentiment toggle ("Good" / "Bad"), and a submit button. Submission creates a payload with the selected scope.

#### Scenario: Submit site feedback from modal
- **WHEN** the user types a comment on the Site tab and clicks submit
- **THEN** a payload is created with `scope: 'site'`, the comment, and an empty `pins` array

#### Scenario: Submit page feedback from modal
- **WHEN** the user types a comment on the Page tab and clicks submit
- **THEN** a payload is created with `scope: 'page'`, the current pathname, the comment, and an empty `pins` array

#### Scenario: Comment required for submission
- **WHEN** the user attempts to submit with an empty comment
- **THEN** submission is blocked and validation feedback is shown

#### Scenario: Sentiment is optional
- **WHEN** the user submits without selecting Good or Bad
- **THEN** the payload includes `sentiment: null`

### Requirement: Place a pin button in modal
The modal SHALL include a "Place a pin" button that closes the modal and activates crosshair pin mode. This makes pin placement accessible on touch devices without a keyboard.

#### Scenario: Place a pin activates pin mode
- **WHEN** the user clicks "Place a pin" in the modal
- **THEN** the modal closes and crosshair pin mode activates

#### Scenario: Pin flow proceeds normally after modal
- **WHEN** pin mode is activated from the modal and the user clicks an element
- **THEN** the existing pin placement and comment form flow proceeds as before with `scope: 'element'`

### Requirement: Thread interaction within modal
Existing feedback threads displayed in the modal SHALL support the same interactions as pin threads: viewing replies, posting replies, marking resolved, and archiving.

#### Scenario: Reply to site feedback in modal
- **WHEN** the user clicks a site-scoped thread and posts a reply
- **THEN** the reply is submitted via the adapter and appears in the thread

#### Scenario: Resolve page feedback in modal
- **WHEN** the user clicks resolve on a page-scoped thread
- **THEN** the feedback item is marked as resolved with attribution

### Requirement: Modal exposed via useFeedtack context
The `useFeedtack()` hook SHALL expose `openModal`, `closeModal`, and `isModalOpen` so consumers can programmatically control the feedback modal.

#### Scenario: Consumer opens modal programmatically
- **WHEN** a consumer calls `openModal()` from `useFeedtack()`
- **THEN** the feedback modal opens

#### Scenario: isModalOpen reflects state
- **WHEN** the modal is open
- **THEN** `isModalOpen` returns `true`
