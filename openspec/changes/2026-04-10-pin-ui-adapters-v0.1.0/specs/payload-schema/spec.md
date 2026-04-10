## ADDED Requirements

### Requirement: currentUser type
The host app SHALL supply a `currentUser` object to `FeedtackProvider`. feedtack uses this to populate `submittedBy` in payloads and to attribute replies, resolutions, and archives.

```ts
interface FeedtackUser {
  id: string;          // unique identifier — used for attribution
  name: string;        // display name shown in threads
  role: string;        // e.g. 'admin' | 'designer' | 'stakeholder' | 'partner'
  avatarUrl?: string;  // shown in reply threads next to name
  email?: string;      // reserved for future notification use
}
```

#### Scenario: currentUser populates submittedBy
- **WHEN** a user submits feedback
- **THEN** the payload `submittedBy` field is populated from `currentUser.id`, `currentUser.name`, and `currentUser.role`

---

### Requirement: FeedbackItem type
`loadFeedback` returns an array of `FeedbackItem` — the full state of a feedback submission including its thread.

```ts
interface FeedbackItem {
  payload: FeedtackPayload;
  replies: FeedtackReply[];
  resolutions: FeedtackResolution[];
  archives: FeedtackArchive[];
}

interface FeedtackReply {
  id: string;
  feedbackId: string;
  author: FeedtackUser;
  body: string;
  timestamp: string;  // ISO 8601 UTC
}

interface FeedtackResolution {
  feedbackId: string;
  resolvedBy: FeedtackUser;
  timestamp: string;
}

interface FeedtackArchive {
  feedbackId: string;
  archivedBy: FeedtackUser;
  timestamp: string;
}
```

#### Scenario: loadFeedback returns full item state
- **WHEN** feedtack calls `loadFeedback()`
- **THEN** each returned item includes its payload, replies array, resolutions array, and archives array

---

### Requirement: Versioned stable payload schema
The system SHALL emit a JSON payload conforming to a semver-versioned schema. The schema version SHALL be included in every payload as `schemaVersion`. Breaking changes to the schema SHALL require a major version bump. The current schema version is `1.0.0`.

#### Scenario: Schema version present in every payload
- **WHEN** a feedback submission is emitted
- **THEN** the payload includes `schemaVersion: "1.0.0"`

#### Scenario: Breaking change requires major bump
- **WHEN** a field is removed or renamed in the payload schema
- **THEN** `schemaVersion` major version is incremented (e.g., `1.x.x` → `2.0.0`)

---

### Requirement: Payload structure
The system SHALL emit a payload with the following top-level fields. All fields are required unless marked optional.

```
{
  "schemaVersion": string,         // semver, e.g. "1.0.0"
  "id": string,                    // unique feedback ID, e.g. "ft_01j..."
  "timestamp": string,             // ISO 8601 UTC
  "submittedBy": {
    "id": string,
    "name": string,
    "role": string                 // e.g. "designer", "stakeholder", "partner"
  },
  "comment": string,               // required, min 1 char
  "sentiment": "satisfied" | "dissatisfied" | null,
  "pins": [                        // min 1 pin
    {
      "index": number,             // 1-based
      "color": string,             // hex color from palette
      "x": number,
      "y": number,
      "xPct": number,
      "yPct": number,
      "target": {
        "selector": string,
        "best_effort": boolean,
        "testId": string | null,   // data-testid value if present, always shipped
        "elementPath": string | null, // "div.hero > button.btn" ancestry, null if testId present
        "tagName": string,
        "textContent": string,     // trimmed, max 200 chars
        "attributes": object,
        "boundingRect": { "x": number, "y": number, "width": number, "height": number }
      }
    }
  ],
  "page": {
    "url": string,
    "pathname": string,
    "title": string
  },
  "viewport": {
    "width": number,
    "height": number,
    "scrollX": number,
    "scrollY": number,
    "devicePixelRatio": number
  },
  "device": {
    "userAgent": string,
    "platform": string,
    "touchEnabled": boolean
  }
}
```

#### Scenario: Payload contains all required fields
- **WHEN** a feedback submission is emitted
- **THEN** the payload includes all required fields with correct types

#### Scenario: Multiple pins included in payload
- **WHEN** the user places three pins before submitting
- **THEN** the payload `pins` array contains three entries, each with their own target metadata

#### Scenario: Null sentiment preserved
- **WHEN** the user does not select a sentiment
- **THEN** the payload includes `sentiment: null` (field is present, not omitted)
