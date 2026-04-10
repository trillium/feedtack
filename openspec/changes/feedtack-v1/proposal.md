## Why

Non-technical stakeholders — designers, copywriters, partners — have feedback about live UI that never reaches developers in a form they can act on. feedtack closes that gap by letting any user click anywhere on a page, drop a pin, leave a comment, and emit a structured JSON payload rich enough for an LLM to attempt a first-pass fix before consuming developer hours.

## What Changes

- Introduce a drop-in React overlay that activates via admin nav button or configurable hotkey
- Support multiple color-coded pins per feedback session, each linked to a single comment thread
- Capture full DOM context at the point of click (element path, viewport, scroll, device, page state)
- Emit a versioned, stable JSON payload to a user-configured webhook endpoint
- Persist feedback state across page reloads; support per-feedback reply threads and resolution tracking
- Allow multiple users to independently mark feedback as resolved or archived, with attribution

## Capabilities

### New Capabilities

- `pin-ui`: Floating activation button (with visible hotkey) and crosshair cursor mode; supports multiple color-coded pins per session
- `metadata-capture`: On-click DOM context capture — element selector path, bounding rect, attributes, viewport, scroll, device info, page URL/title
- `payload-schema`: Versioned (semver) structured JSON schema emitted per feedback submission; LLM-ready, self-describing
- `webhook-adapter`: Plugin-contract adapter interface with a bundled JSONL webhook implementation; adapter interface is open for extension
- `feedback-state`: Persistent feedback store — pins survive navigation; each feedback item supports reply threads, resolved status (with attribution), and per-user archive

### Modified Capabilities

<!-- None — this is a greenfield repo -->

## Impact

- New npm package: `feedtack` (ESM, React provider)
- No required SaaS dependency — webhook endpoint is user-supplied
- Payload schema is versioned and public; breaking changes require a major version bump
- Full DOM read access at click time; security scope is intentionally broad in v1 (scoped down in future)
- Target: React apps; canvas/SVG/iframe edge cases are best-effort in v1

## ICEBOX

The following are explicitly out of scope for v1 and will not be specced:

- **LLM triage layer** — downstream consumer of the payload; separate tool
- **Developer inbox / dashboard** — separate concern
- **Screenshot annotation** — not needed; payload captures context instead
