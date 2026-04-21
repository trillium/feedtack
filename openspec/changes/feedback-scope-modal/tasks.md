## 1. Payload & Type Changes

- [x] 1.1 Add `scope: 'site' | 'page' | 'element'` to `FeedtackPayload` interface and make it required
- [x] 1.2 Change `FeedtackSentiment` from `'satisfied' | 'dissatisfied' | null` to `'good' | 'bad' | null`
- [x] 1.3 Add optional `scope` field to `FeedtackFilter` interface
- [x] 1.4 Bump `SCHEMA_VERSION` to `'2.0.0'`
- [x] 1.5 Update payload validation tests for new scope field, sentiment values, and empty pins

## 2. Adapter Updates

- [x] 2.1 Update ConsoleAdapter to log scope in output
- [x] 2.2 Update LocalStorageAdapter to filter by scope when provided in filter
- [x] 2.3 Update WebhookAdapter to pass scope through
- [x] 2.4 Update adapter tests for scope filtering

## 3. State & Context Wiring

- [x] 3.1 Add `isModalOpen`, `openModal`, `closeModal` state to `useFeedtackState`
- [x] 3.2 Add `composeScope` state (`'site' | 'page'`) for modal compose form
- [x] 3.3 Expose `openModal`, `closeModal`, `isModalOpen` in `FeedtackContextValue` and `useFeedtack()`
- [x] 3.4 Change `⇧P` hotkey handler to call `openModal` instead of toggling pin mode
- [x] 3.5 Add scope-aware `loadFeedback` calls: site-scoped (global) + page-scoped (pathname) + element-scoped (pathname)

## 4. Feedback Modal Component

- [x] 4.1 Create `FeedbackModal` component with overlay, close button, and Escape key handler
- [x] 4.2 Add Site/Page scope tabs with tab state management
- [x] 4.3 Add thread list rendering within each tab (reuse thread display patterns)
- [x] 4.4 Add inline compose form per tab (comment + sentiment + submit)
- [x] 4.5 Add "Place a pin" button that closes modal and activates pin mode
- [x] 4.6 Add thread interaction: expand thread, reply, resolve, archive within modal

## 5. Button & Pin Mode Changes

- [x] 5.1 Change button label from "Drop Pin [Shift+P]" to "Feedback" and wire onClick to `openModal`
- [x] 5.2 Ensure pin mode activated from modal sets `scope: 'element'` on resulting payload
- [x] 5.3 Update CommentForm sentiment labels from emoji to "Good" / "Bad" text

## 6. Display & Filtering

- [x] 6.1 Site/page feedback displays only in modal (not as pin markers on page)
- [x] 6.2 Element feedback continues to display as pin markers on page (existing behavior)
- [x] 6.3 Modal Site tab loads feedback with `{ scope: 'site' }` filter
- [x] 6.4 Modal Page tab loads feedback with `{ scope: 'page', pathname }` filter

## 7. Styling

- [x] 7.1 Add modal styles (overlay, dialog, tabs, close button) using feedtack CSS variable system
- [x] 7.2 Add responsive styles for mobile modal (full-screen or bottom sheet)
- [x] 7.3 Update button styles for new "Feedback" label

## 8. Tests

- [x] 8.1 Test modal opens on button click and ⇧P hotkey
- [x] 8.2 Test scope tabs switch and load correct feedback
- [x] 8.3 Test site/page compose form submits with correct scope and empty pins
- [x] 8.4 Test "Place a pin" closes modal and activates pin mode
- [x] 8.5 Test sentiment values are "good"/"bad" (not "satisfied"/"dissatisfied")
- [x] 8.6 Test `useFeedtack()` exposes openModal/closeModal/isModalOpen

## 9. Exports & Documentation

- [x] 9.1 Export new types from react barrel (`FeedtackScope` or scope type)
- [x] 9.2 Update FeedtackProviderProps if any new props are needed for modal customization
