## Why

Feedtack captures feedback about UI elements, but has no mechanism for tracking whether *content* (copywriting, headings, labels) has been reviewed and approved. Teams that manage copy across pages have no way to know what's changed, what's been signed off, and whether it's safe to deploy — forcing them to build this logic themselves or bolt on Supabase-specific solutions.

## What Changes

- New `data-feedtack-field` DOM attribute for annotating editable content nodes with a dot-path identifier (e.g. `hero.heading`)
- New `FieldApproval` payload type — `{ hash: string, by: string[], at: string }` — hash is SHA-256 of the field's current text content
- New `ContentAdapter` optional extension interface: `approve()`, `revokeApproval()`, `loadApprovals()`
- Hash mismatch between stored approval and current content = stale (unapproved)
- Optional `onDeployCheck` hook that returns `{ approved: boolean, pending: string[] }` — feedtack surfaces the data, consumer enforces the gate
- No storage requirement — any adapter (Webhook, Disk, custom) can implement `ContentAdapter`; adapters that don't implement it are unaffected

## Capabilities

### New Capabilities
- `content-field-annotation`: DOM attribute convention (`data-feedtack-field`) and utilities for scanning, reading, and hashing annotated fields on a page
- `content-approval`: `ContentAdapter` interface, `FieldApproval` type, hash-based stale detection, and `onDeployCheck` hook contract

### Modified Capabilities
- `payload-schema`: New `FieldApproval` and `ContentAdapter` types added to the public type surface — additive, non-breaking

## Impact

- `src/types/payload.ts` — new `FieldApproval`, `FieldApprovalState`, `FieldFilter` types
- `src/types/adapter.ts` — new `ContentAdapter` optional extension interface
- `src/capture/` — new `content.ts` module for field scanning and hashing
- `src/adapters/` — `DiskAdapter` and `WebhookAdapter` updated to optionally implement `ContentAdapter`
- No breaking changes — existing adapter implementations continue to work unchanged
- Bundle size impact: SHA-256 hashing via Web Crypto API (zero additional dependencies)
