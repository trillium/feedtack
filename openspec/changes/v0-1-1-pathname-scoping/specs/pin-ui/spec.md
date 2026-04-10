## ADDED Requirements

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
