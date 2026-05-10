## MODIFIED Requirements

### Requirement: FeedtackUser includes username handle

The `FeedtackUser` interface SHALL include an optional `username` field for short handles used in attribution and @mention contexts.

- **Type:** `string | undefined`
- **Semantics:** A short handle or slug — GitHub username, Slack @-name, email prefix, or any app-specific identifier. Feedtack does not validate or namespace this value.
- **Usage:** Adapters and webhook handlers MAY use this field to render @mentions in issue bodies or notification targets.

#### Scenario: User with GitHub username
- **WHEN** the host app maps a GitHub-authenticated user with `username: "trillium"`
- **THEN** the payload `submittedBy.username` is `"trillium"` and the formatted issue body renders `@trillium`

#### Scenario: User without username
- **WHEN** the host app does not provide a username
- **THEN** `submittedBy.username` is `undefined` and attribution falls back to `submittedBy.name`

#### Scenario: Existing payloads without username field
- **WHEN** a consumer reads a payload created before this change
- **THEN** `submittedBy.username` is `undefined` — no parse error, backward-compatible

---

### Requirement: FeedtackUser email is first-class optional

The `FeedtackUser.email` field SHALL be documented as a standard optional field, not as reserved or future-use. No behavior change — the field was already present and optional.
