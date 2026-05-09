## Context

Feedtack's existing adapter interface handles feedback submission, threading, resolution, and archiving. The `FeedtackAdapter` interface in `src/types/adapter.ts` is the single extension point for storage backends.

Mel's site (issue #24) pioneered a hash-based field approval system backed by Supabase. The goal here is to extract the concept from any specific storage technology and build it as a first-class feedtack primitive — annotation on the DOM, hashing in the client, persistence via adapter.

## Goals / Non-Goals

**Goals:**
- `data-feedtack-field` as a stable DOM annotation convention for content nodes
- SHA-256 content hashing in the browser (no server round-trip to detect staleness)
- `ContentAdapter` as an optional extension interface — adapters opt in, nothing breaks if they don't
- `onDeployCheck` hook as a data surface — feedtack tells you what's pending, you decide what to do
- `DiskAdapter` and `WebhookAdapter` get reference `ContentAdapter` implementations

**Non-Goals:**
- Enforcing deployment gates — feedtack does not block or redirect
- Inline editing UI — feedtack does not render editors or contenteditable elements
- Change diffing — we store the current hash, not history
- Multi-page scanning — feedtack only sees the current DOM

## Decisions

### D1: `ContentAdapter` as extension interface, not base interface

The existing `FeedtackAdapter` stays unchanged. `ContentAdapter` is a separate interface that adapters may optionally implement:

```ts
export interface ContentAdapter {
  approve(fieldPath: string, approval: Omit<FieldApproval, 'hash'> & { hash: string }): Promise<void>
  revokeApproval(fieldPath: string, userId: string): Promise<void>
  loadApprovals(filter?: FieldFilter): Promise<FieldApprovalState[]>
}
```

Consumers check `adapter instanceof ContentAdapter` or use a type guard. This avoids a breaking change to the adapter contract.

**Alternative considered:** Add optional methods directly to `FeedtackAdapter`. Rejected — pollutes the core interface and forces all existing adapter implementations to be audited for the new methods.

### D2: Web Crypto API for hashing (no dependency)

`crypto.subtle.digest('SHA-256', ...)` is available in all modern browsers and Node 18+. No `crypto-js` or similar dependency needed. Hash is truncated to 12 hex chars (48 bits of entropy) — sufficient for change detection, not a security primitive.

**Alternative considered:** Simple string length + charCode checksum. Rejected — too many collisions on minor edits.

### D3: `data-feedtack-field` is a dot-path string

Format: `<page>.<section>.<field>` — e.g. `coaching.hero.heading`. The dot-path is opaque to feedtack; it's a key for the approval store. Consumers define their own namespace.

**Alternative considered:** Structured `data-feedtack-page` + `data-feedtack-section` + `data-feedtack-field` triple. Rejected — more verbose, harder to scan, harder to type.

### D4: Approval state is a parallel track, not FeedbackItem

`FieldApprovalState` is independent of `FeedbackItem`. Approvals are keyed by field path, not feedback ID. This keeps the approval ledger clean and avoids coupling content sign-off to user-submitted feedback.

**Alternative considered:** Model approval as a special resolution on a FeedbackItem. Rejected — different semantics (approval is proactive, resolution is reactive), different actors, different lifecycle.

### D5: `onDeployCheck` is a consumer-provided hook, not a feedtack emitter

`FeedtackProvider` accepts an optional `onDeployCheck` prop. When called (by the consumer, e.g. on a "Deploy" button click), feedtack computes pending fields by comparing live hashes to stored approvals and returns `{ approved: boolean, pending: string[] }`. The consumer decides what to do.

## Risks / Trade-offs

[DOM scanning timing] → Fields must be present in the DOM when `scanFields()` is called. SPAs that render fields after hydration may miss them. Mitigation: expose `scanFields()` as a callable utility so consumers can re-scan after navigation.

[SHA-256 is async] → `crypto.subtle.digest` returns a Promise. The hash comparison in `onDeployCheck` is async. Mitigation: `onDeployCheck` returns a Promise — consumers must await it.

[Field path collisions] → Two elements with the same `data-feedtack-field` value on the same page produce a last-write-wins hash. Mitigation: document that field paths must be unique per page; add a dev-mode warning when duplicates are detected.

[ContentAdapter not implemented] → If the adapter doesn't implement `ContentAdapter`, calling approval methods silently does nothing. Mitigation: type guard + console.warn in dev mode.

## Open Questions

- Should `scanFields()` be called automatically on mount, or always manual? Auto-scan is convenient but surprises SPA teams. Lean toward manual with a convenience hook (`useContentApproval`).
- Should the `pending` list in `onDeployCheck` include fields with no stored approval at all, or only fields with a stale (hash-mismatched) approval? Probably both — unannotated = unreviewed.
