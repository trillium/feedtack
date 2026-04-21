## MODIFIED Requirements

### Requirement: Feedback persisted across navigation
The system SHALL persist submitted feedback items so they survive page reloads and navigation within the host app. Persistence SHALL use the configured backend adapter as the source of truth. Site-scoped feedback SHALL be loaded globally (not filtered by pathname). Page-scoped feedback SHALL be loaded per pathname. Element-scoped feedback SHALL be loaded per pathname (existing behavior).

#### Scenario: Submitted feedback visible after reload
- **WHEN** a user submits feedback and then reloads the page
- **THEN** the feedback item is visible (pin on page for element scope, in modal for site/page scope)

#### Scenario: Site-scoped feedback visible on any page
- **WHEN** a user submits site-scoped feedback on `/about`
- **THEN** the feedback is visible in the modal's Site tab on any page

#### Scenario: Page-scoped feedback only visible on its page
- **WHEN** a user submits page-scoped feedback on `/pricing`
- **THEN** the feedback is visible in the modal's Page tab only on `/pricing`

### Requirement: Click pin to open thread panel
The system SHALL open an anchored modal/popover attached to the pin marker when the user clicks an existing (persisted) pin. The panel SHALL display the original comment, all replies in chronological order, and action buttons for Reply, Mark Resolved, and Archive. The panel SHALL remain fully on-screen using the same edge detection as the comment form. Site-scoped and page-scoped threads are viewed within the feedback modal, not as pin-anchored panels.

#### Scenario: Click existing pin opens panel
- **WHEN** the user clicks a persisted pin marker
- **THEN** an anchored panel opens showing the feedback thread

#### Scenario: Site/page threads viewed in modal
- **WHEN** the user clicks a site or page feedback thread in the modal
- **THEN** the thread expands inline within the modal (no pin-anchored panel)

#### Scenario: Panel stays on-screen near edges
- **WHEN** the pin is within 300px of a screen edge
- **THEN** the panel flips to the opposite side to remain fully visible

#### Scenario: Panel closes on outside click or Escape
- **WHEN** the user clicks outside the panel or presses Escape
- **THEN** the panel closes
