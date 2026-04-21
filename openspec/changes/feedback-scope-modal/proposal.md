## Why

Feedtack only supports element-level feedback via pin placement, which requires a keyboard shortcut (Shift+P) to activate. Users need to give general feedback about a whole site ("change brand colors") or a specific page ("too much whitespace here") but have no way to do so. Mobile users cannot activate pin mode at all without a keyboard. Consolidating all feedback entry into a single modal solves both problems — scope selection and mobile accessibility — in one change.

## What Changes

- **Replace the pin-mode toggle button with a "Feedback" button** that opens a modal dialog instead of directly entering crosshair mode
- **Add a feedback modal** with Site and Page tabs, each showing existing threads and a compose form (comment + sentiment + submit)
- **Add a "Place a pin" button inside the modal** that closes the modal and activates crosshair/pin mode — makes pin placement accessible on touch devices
- **Shift+P hotkey opens the modal** instead of directly toggling pin mode
- **Add `scope` field to the payload** — `'site' | 'page' | 'element'` — so consumers can distinguish feedback intent
- **`pins` array becomes empty** for site/page scoped feedback (no pins required)
- **BREAKING**: `loadFeedback` filter gains a `scope` field; adapters should support filtering by scope
- **Change sentiment labels** from emoji (👍/👎) to text ("Good" / "Bad")

## Capabilities

### New Capabilities
- `feedback-scope`: Scope discriminator on payloads (`site`, `page`, `element`) and the rules for what metadata each scope requires
- `feedback-modal`: Modal dialog UI — scope tabs, thread list, compose form, and "Place a pin" action button

### Modified Capabilities
- `pin-ui`: Activation flow changes — button opens modal instead of toggling pin mode; pin mode activated from inside modal; hotkey opens modal
- `payload-schema`: `scope` field added to `FeedtackPayload`; `pins` no longer required to be non-empty; sentiment labels change from emoji to "Good"/"Bad"
- `feedback-state`: `loadFeedback` filter gains `scope` field; site-scoped items have no pathname; display logic must handle pinless feedback

## Impact

- **Types**: `FeedtackPayload` gains `scope` field; `FeedtackFilter` gains optional `scope`; `FeedtackSentiment` values may change
- **Adapters**: All adapters need to handle `scope` in payloads and filters; existing persisted data needs graceful fallback (missing scope treated as `'element'`)
- **React components**: `FeedtackProvider` button/modal rewrite; new `FeedbackModal` component; `CommentForm` sentiment labels change
- **Public API**: `useFeedtack()` context may expose modal open/close; `FeedtackProviderProps` may gain new props for modal customization
- **Schema version**: Bump to `2.0.0` (breaking: scope field, relaxed pins constraint)
