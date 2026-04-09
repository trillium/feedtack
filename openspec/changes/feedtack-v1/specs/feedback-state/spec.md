## ADDED Requirements

### Requirement: Feedback persisted across navigation
The system SHALL persist submitted feedback items so they survive page reloads and navigation within the host app. Persistence SHALL use the configured backend adapter as the source of truth.

#### Scenario: Submitted feedback visible after reload
- **WHEN** a user submits feedback and then reloads the page
- **THEN** the feedback item is visible on the page at its original pin location(s)

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
