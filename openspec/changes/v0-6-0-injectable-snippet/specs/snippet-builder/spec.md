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

### Requirement: URL sanitization
The builder SHALL validate webhook URLs before embedding them in generated snippets.

#### Scenario: Valid HTTPS URL
- **WHEN** the user enters `https://hooks.example.com/feedtack`
- **THEN** the URL is accepted and embedded in the generated bookmarklet/snippet

#### Scenario: Invalid URL rejected
- **WHEN** the user enters a string that is not a valid URL (e.g., `'};alert(1);//`)
- **THEN** the builder shows a validation error and does not generate a bookmarklet with the invalid input

#### Scenario: Non-HTTPS URL rejected
- **WHEN** the user enters an HTTP URL (e.g., `http://example.com/hook`)
- **THEN** the builder shows a warning that HTTPS is required for webhook mode

### Requirement: Version pinning
The builder SHALL pin the CDN source URL to the current feedtack version by default.

#### Scenario: Default version pinning
- **WHEN** the builder generates a bookmarklet
- **THEN** the CDN URL uses a pinned version (e.g., `feedtack@1.2.0`), not `@latest`

#### Scenario: Latest version option
- **WHEN** the user toggles a "use latest" option
- **THEN** the CDN URL switches to `feedtack@latest`

### Requirement: User identity input
The builder SHALL include an optional user name input.

#### Scenario: Name provided
- **WHEN** the user enters a name in the identity input
- **THEN** the generated snippet includes `user: { id: 'custom', name: '<entered name>', role: 'reviewer' }` in the config

#### Scenario: Name omitted
- **WHEN** the user leaves the identity input empty
- **THEN** the generated snippet omits the `user` field (anonymous default)

### Requirement: Console snippet as loader
The builder SHALL generate a short CDN loader as the default console snippet.

#### Scenario: Default console snippet is a loader
- **WHEN** the builder generates a console snippet
- **THEN** the snippet is a short loader that fetches from CDN (not the full minified IIFE)

#### Scenario: Offline option
- **WHEN** the user toggles an "offline / raw IIFE" option
- **THEN** the console snippet shows the full IIFE source for paste-without-network use

### Requirement: Playwright route verification
The snippet builder page SHALL be covered by the existing doc route verification tests.

#### Scenario: Route resolves
- **WHEN** the Playwright doc route tests run
- **THEN** `/docs/guides/snippet` resolves with a 200 status (covered by meta.json + existing test infrastructure)
