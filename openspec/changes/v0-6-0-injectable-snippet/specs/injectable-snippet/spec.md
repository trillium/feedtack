## ADDED Requirements

### Requirement: Self-initializing IIFE bundle
The system SHALL produce a single `dist/feedtack.inject.js` file that, when executed in a browser context, initializes a feedback UI without any external dependencies or framework requirements.

#### Scenario: Console paste initialization
- **WHEN** a user pastes the IIFE source into a browser console and presses Enter
- **THEN** a floating feedback trigger button appears in the bottom-right corner of the page

#### Scenario: Script tag initialization
- **WHEN** a `<script>` tag loads `feedtack.inject.js`
- **THEN** the snippet self-initializes and the feedback UI appears

#### Scenario: No conflict with host page
- **WHEN** the snippet initializes on a page with existing CSS and JavaScript
- **THEN** the snippet UI renders inside a Shadow DOM host element, preventing style leakage in either direction

### Requirement: Clipboard egress mode (default)
When no webhook URL is configured, the system SHALL copy the feedback payload JSON to the clipboard on submit.

#### Scenario: Submit with clipboard mode
- **WHEN** a user submits feedback without a webhook URL configured
- **THEN** the payload JSON is copied to the clipboard via `navigator.clipboard.writeText()`
- **AND** a toast message confirms "Copied to clipboard"

#### Scenario: Clipboard fallback on non-HTTPS
- **WHEN** the page is served over HTTP (not HTTPS) and `navigator.clipboard` is unavailable
- **THEN** the system SHALL fall back to `document.execCommand('copy')`

### Requirement: Webhook egress mode
When a webhook URL is provided, the system SHALL send the payload to that URL on submit.

#### Scenario: Submit with webhook URL
- **WHEN** a user submits feedback with a webhook URL configured via `feedtack.inject({ url: 'https://...' })`
- **THEN** the payload is sent via `navigator.sendBeacon(url, JSON.stringify(payload))`

#### Scenario: sendBeacon fallback
- **WHEN** `navigator.sendBeacon` is unavailable
- **THEN** the system SHALL fall back to `fetch(url, { method: 'POST', body: JSON.stringify(payload), keepalive: true })`

### Requirement: Configuration via global or argument
The system SHALL accept configuration either as a function argument or via a global variable.

#### Scenario: Configuration via function call
- **WHEN** the IIFE exposes `feedtack.inject(config)` and the user calls it with `{ url: '...' }`
- **THEN** the snippet uses the provided webhook URL for egress

#### Scenario: Configuration via global variable
- **WHEN** `window.__feedtack_config` is set before the script loads
- **THEN** the snippet reads configuration from that global on initialization

### Requirement: Feedback UI
The snippet SHALL provide a minimal UI for submitting feedback with scope selection, pin placement, comment, and sentiment.

#### Scenario: Open and close panel
- **WHEN** the user clicks the floating trigger button
- **THEN** a feedback panel opens with scope tabs (Site / Page / Element) and a comment textarea

#### Scenario: Pin mode
- **WHEN** the user clicks "Place a pin" in the panel
- **THEN** the cursor changes to a crosshair and clicking an element captures its target data and places a visual pin indicator

#### Scenario: Sentiment selection
- **WHEN** the user selects a sentiment (good / bad / none)
- **THEN** the payload includes the selected sentiment value

#### Scenario: Submit and reset
- **WHEN** the user clicks Submit with a comment entered
- **THEN** the payload is emitted via the configured egress mode, the panel resets, and a confirmation toast appears

### Requirement: Teardown
The system SHALL provide a way to remove the injected UI and clean up event listeners.

#### Scenario: Manual teardown
- **WHEN** the user calls `feedtack.destroy()`
- **THEN** the Shadow DOM host element is removed, all event listeners are detached, and no feedtack artifacts remain on the page

### Requirement: Bundle size
The IIFE bundle SHALL be under 20KB minified.

#### Scenario: Size check
- **WHEN** `dist/feedtack.inject.js` is built with minification enabled
- **THEN** the file size is under 20KB

### Requirement: Bookmarklet loader
The system SHALL support loading via a bookmarklet URL.

#### Scenario: Bookmarklet loads snippet from CDN
- **WHEN** a user clicks a bookmarklet with `javascript:void(...)` that injects a script tag pointing to a CDN-hosted `feedtack.inject.js`
- **THEN** the snippet loads and initializes on the current page

#### Scenario: Bookmarklet with webhook config
- **WHEN** the bookmarklet sets `window.__feedtack_config = { url: '...' }` before loading the script
- **THEN** the snippet initializes in webhook mode with the configured URL
