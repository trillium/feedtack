## ADDED Requirements

### Requirement: Plugin adapter interface
The system SHALL define a TypeScript adapter interface that any backend implementation must satisfy. The interface SHALL be:

```ts
interface FeedtackAdapter {
  submit(payload: FeedtackPayload): Promise<void>;
}
```

#### Scenario: Custom adapter accepted
- **WHEN** a user supplies an object implementing `FeedtackAdapter` at init time
- **THEN** feedtack uses that adapter to submit all payloads

#### Scenario: Adapter submit failure is surfaced
- **WHEN** the adapter's `submit()` method throws or rejects
- **THEN** feedtack surfaces the error to the host app via an `onError` callback (if configured) and does not silently swallow it

---

### Requirement: Bundled JSONL webhook adapter
The system SHALL ship a built-in webhook adapter that POSTs the payload as newline-delimited JSON (JSONL) to a user-configured URL.

#### Scenario: Payload posted to webhook URL
- **WHEN** a feedback submission is triggered and the webhook adapter is configured
- **THEN** an HTTP POST is made to the configured URL with the JSON payload as the body and `Content-Type: application/json`

#### Scenario: Non-2xx response treated as error
- **WHEN** the webhook endpoint responds with a non-2xx status code
- **THEN** the adapter rejects with an error including the status code

#### Scenario: Network failure treated as error
- **WHEN** the network request fails (timeout, DNS failure, etc.)
- **THEN** the adapter rejects with the underlying network error

---

### Requirement: No-op / local adapter for development
The system SHALL ship a local development adapter that logs the payload to the browser console instead of sending it over the network.

#### Scenario: Console adapter logs payload
- **WHEN** the console adapter is active and a submission is made
- **THEN** the full payload is logged to `console.log` and `submit()` resolves successfully
