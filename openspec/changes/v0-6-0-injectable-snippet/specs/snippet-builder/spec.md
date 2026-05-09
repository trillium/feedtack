## ADDED Requirements

### Requirement: Interactive snippet builder page
The docs site SHALL include a guide page at `/docs/guides/snippet` with an interactive client component that generates configured feedtack snippets.

#### Scenario: Page exists in docs navigation
- **WHEN** a user navigates to the Guides section of the docs
- **THEN** a "Snippet / Bookmarklet" page is listed and accessible

### Requirement: Webhook URL input
The builder component SHALL accept an optional webhook URL input.

#### Scenario: No URL entered
- **WHEN** the user leaves the webhook URL field empty
- **THEN** the generated snippet uses clipboard mode (default)

#### Scenario: URL entered
- **WHEN** the user enters `https://hooks.example.com/feedtack` in the URL field
- **THEN** the generated bookmarklet and console snippet include the webhook URL in the configuration

### Requirement: Bookmarklet output
The builder SHALL generate a draggable bookmarklet link.

#### Scenario: Bookmarklet link rendered
- **WHEN** the builder component renders (with or without a webhook URL)
- **THEN** a styled `<a href="javascript:...">` link is displayed that the user can drag to their bookmarks bar

#### Scenario: Bookmarklet includes config
- **WHEN** the user has entered a webhook URL
- **THEN** the bookmarklet `href` sets `window.__feedtack_config` with the URL before loading the script

### Requirement: Console snippet output
The builder SHALL generate a copyable console snippet.

#### Scenario: Copy console snippet
- **WHEN** the user clicks the copy button next to the console snippet
- **THEN** the full IIFE source (or loader script with config) is copied to the clipboard

#### Scenario: Snippet reflects configuration
- **WHEN** the user changes the webhook URL input
- **THEN** the console snippet updates in real time to reflect the new configuration

### Requirement: Playwright route verification
The snippet builder page SHALL be covered by the existing doc route verification tests.

#### Scenario: Route resolves
- **WHEN** the Playwright doc route tests run
- **THEN** `/docs/guides/snippet` resolves with a 200 status (covered by meta.json + existing test infrastructure)
