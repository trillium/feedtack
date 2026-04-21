## MODIFIED Requirements

### Requirement: Versioned stable payload schema
The system SHALL emit a JSON payload conforming to a semver-versioned schema. The schema version SHALL be included in every payload as `schemaVersion`. Breaking changes to the schema SHALL require a major version bump. The current schema version is `2.0.0`.

#### Scenario: Schema version present in every payload
- **WHEN** a feedback submission is emitted
- **THEN** the payload includes `schemaVersion: "2.0.0"`

#### Scenario: Breaking change requires major bump
- **WHEN** a field is removed or renamed in the payload schema
- **THEN** `schemaVersion` major version is incremented

### Requirement: Payload structure
The system SHALL emit a payload with the following top-level fields. All fields are required unless marked optional.

```
{
  "schemaVersion": string,         // "2.0.0"
  "id": string,                    // unique feedback ID
  "timestamp": string,             // ISO 8601 UTC
  "scope": "site" | "page" | "element",  // NEW — feedback scope level
  "submittedBy": {
    "id": string,
    "name": string,
    "role": string
  },
  "comment": string,               // required, min 1 char
  "sentiment": "good" | "bad" | null,  // CHANGED from satisfied/dissatisfied
  "pins": [                        // CHANGED — may be empty for site/page scope
    {
      "index": number,
      "color": string,
      "x": number,
      "y": number,
      "xPct": number,
      "yPct": number,
      "target": {
        "selector": string,
        "best_effort": boolean,
        "dataTestId": string | null,
        "elementPath": string | null,
        "tagName": string,
        "ancestors": AncestorNode[],
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
- **THEN** the payload includes all required fields including `scope` with correct types

#### Scenario: Site-scoped payload has empty pins
- **WHEN** site-scoped feedback is submitted
- **THEN** the payload `pins` array is empty and `scope` is `"site"`

#### Scenario: Element-scoped payload has pins
- **WHEN** element-scoped feedback is submitted with two pins
- **THEN** the payload `pins` array contains two entries and `scope` is `"element"`

#### Scenario: Null sentiment preserved
- **WHEN** the user does not select a sentiment
- **THEN** the payload includes `sentiment: null` (field is present, not omitted)

#### Scenario: Sentiment uses new values
- **WHEN** the user selects a positive sentiment
- **THEN** the payload includes `sentiment: "good"` (not `"satisfied"`)
