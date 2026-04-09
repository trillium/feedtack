## ADDED Requirements

### Requirement: Feedback persisted across navigation
The system SHALL persist submitted feedback items so they survive page reloads and navigation within the host app. Persistence SHALL use the configured backend adapter as the source of truth.

#### Scenario: Submitted feedback visible after reload
- **WHEN** a user submits feedback and then reloads the page
- **THEN** the feedback item is visible on the page at its original pin location(s)

---

### Requirement: Persisted pin notification badge
The system SHALL display an unread notification badge on any persisted pin marker that has activity the current user has not yet viewed (new replies, new resolutions). The badge SHALL be visually distinct from the pin marker itself.

#### Scenario: Unread pin shows notification badge
- **WHEN** a persisted pin has a reply the current user has not viewed
- **THEN** the pin marker displays a notification badge

#### Scenario: Badge clears after viewing
- **WHEN** the current user opens the pin thread
- **THEN** the notification badge is removed for that user

---

### Requirement: Click pin to open thread panel
The system SHALL open an anchored modal/popover attached to the pin marker when the user clicks an existing (persisted) pin. The panel SHALL display the original comment, all replies in chronological order, and action buttons for Reply, Mark Resolved, and Archive. The panel SHALL remain fully on-screen using the same edge detection as the comment form.

#### Scenario: Click existing pin opens panel
- **WHEN** the user clicks a persisted pin marker
- **THEN** an anchored panel opens showing the feedback thread

#### Scenario: Panel stays on-screen near edges
- **WHEN** the pin is within 300px of a screen edge
- **THEN** the panel flips to the opposite side to remain fully visible

#### Scenario: Panel closes on outside click or Escape
- **WHEN** the user clicks outside the panel or presses Escape
- **THEN** the panel closes

---

### Requirement: Reply threads on feedback items
Each feedback item SHALL support a reply thread. Any team member or LLM integration may post a reply. Replies SHALL be ordered chronologically and include the author's identity and timestamp.

#### Scenario: Reply posted to feedback
- **WHEN** a team member posts a reply to a feedback item
- **THEN** the reply appears in the thread with the author's name and timestamp

#### Scenario: Multiple replies ordered chronologically
- **WHEN** three replies exist on a feedback item
- **THEN** they are displayed oldest-first

---

### Requirement: Resolved status with attribution
Any team member SHALL be able to mark a feedback item as resolved. The resolved status SHALL record who marked it resolved and when. Multiple users may independently mark the same item resolved; all resolutions SHALL be recorded.

#### Scenario: Feedback marked resolved
- **WHEN** a user marks a feedback item as resolved
- **THEN** the item's state shows `resolved: true`, the resolver's name, and the resolution timestamp

#### Scenario: Second user also marks resolved
- **WHEN** a second user marks the same item resolved
- **THEN** both resolutions are recorded and attributed separately

---

### Requirement: Per-user independent archive
Any team member SHALL be able to archive a feedback item for themselves, independently of other users. Archiving hides the item from that user's view but does not affect other users. The archive action SHALL be attributed (who archived, when).

#### Scenario: User archives feedback item
- **WHEN** a user archives a feedback item
- **THEN** the item is hidden from that user's view and the archive is attributed to them

#### Scenario: Other user still sees item
- **WHEN** User A archives a feedback item
- **THEN** User B (who has not archived it) still sees the item in their view

#### Scenario: Archive attribution visible
- **WHEN** a user views their archived items
- **THEN** each shows who archived it and when
