## 1. Types

- [x] 1.1 Add `FieldApproval`, `FieldApprovalState`, and `FieldFilter` types to `src/types/payload.ts`
- [x] 1.2 Add `ContentAdapter` interface to `src/types/adapter.ts`
- [x] 1.3 Export new types from `src/types/index.ts` and the `feedtack` package root

## 2. Field Annotation Utilities

- [x] 2.1 Create `src/capture/content.ts` with `scanFields(root?: Element): ScannedField[]`
- [x] 2.2 Implement `hashField(content: string): Promise<string>` using `crypto.subtle.digest` — 12-char hex truncation
- [x] 2.3 Add duplicate field path detection with `console.warn` in dev mode
- [x] 2.4 Export `scanFields` and `hashField` from `src/capture/index.ts`

## 3. ContentAdapter Reference Implementations

- [x] 3.1 Implement `ContentAdapter` on `DiskAdapter` — store approvals as `<feedtack-dir>/approvals/<fieldPath>.json`
- [x] 3.2 Implement `ContentAdapter` on `WebhookAdapter` — POST approvals to `updateUrl` with `type: 'approve'` / `type: 'revoke'`; `loadApprovals` delegates to a new `loadApprovals` config function

## 4. Dev-Mode Warnings

- [x] 4.1 Add type guard `isContentAdapter(adapter): adapter is ContentAdapter`
- [x] 4.2 Add `console.warn` in dev mode when approval methods are called on a non-`ContentAdapter`

## 5. React Integration

- [x] 5.1 Create `src/react/hooks/useContentApproval.ts` — returns `{ fields, approve, revoke, rescan, checkDeploy }`
- [x] 5.2 Add optional `onDeployCheck` prop to `FeedtackProvider`; wire through context
- [x] 5.3 Export `useContentApproval` from `feedtack/react`

## 6. Tests

- [x] 6.1 Unit tests for `scanFields` — detects annotated elements, respects root, warns on duplicates
- [x] 6.2 Unit tests for `hashField` — deterministic, distinct outputs for distinct inputs
- [x] 6.3 Unit tests for `FieldApprovalState` staleness logic
- [x] 6.4 Tests for `DiskAdapter` `ContentAdapter` methods (approve, revoke, loadApprovals)

## 7. Documentation

- [x] 7.1 Create `site-docs/content/docs/concepts/content-approval.mdx` — covers `data-feedtack-field`, hashing, approval flow, `useContentApproval`, `onDeployCheck`
- [x] 7.2 Add `content-approval` to `site-docs/content/docs/concepts/meta.json` pages array
- [x] 7.3 Update `dom-targeting.mdx` to mention `data-feedtack-field` alongside `data-feedtack-component`
