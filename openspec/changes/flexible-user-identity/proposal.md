## Why

`FeedtackProvider` requires `currentUser: FeedtackUser` — a specific shape the host app must construct. In practice, every host app already has a user object from their auth system (Clerk, Auth0, NextAuth, Supabase, a custom session, etc.). Requiring them to manually map to `FeedtackUser` at every call site is friction that scales with the number of integrations.

Additionally, `FeedtackUser` is missing `username` — the field most auth systems provide as a short handle or slug. Without it, there is no way to @mention a feedback submitter in a GitHub issue body without guessing at their handle.

## What Changes

- `FeedtackUser` gains `username?: string` — a short handle used for @mentions in issue bodies and attribution displays. Generic enough to hold a GitHub username, Slack handle, email prefix, or any app-specific slug.
- `FeedtackProvider` becomes generic over `TUser`, defaulting to `FeedtackUser`. A `mapUser` prop converts `TUser → FeedtackUser` at the provider boundary. When `TUser` is compatible with `FeedtackUser`, `mapUser` can be omitted.
- Normalization happens once at the provider boundary. The engine and all internal code continue to operate on `FeedtackUser` — no generics thread through the internals.
- `FeedtackUser` remains the **suggested** type. Host apps that already pass a compatible object need no changes.

## Capabilities

### Modified Capabilities

- `payload-schema`: `FeedtackUser` interface gains `username?: string`. All existing fields unchanged.
- `provider-user-contract`: New capability. Defines the generic provider contract — `TUser` type parameter, `mapUser` prop, normalization boundary, and the rule that the engine always receives a resolved `FeedtackUser`.

## Impact

- `src/types/payload.ts` — additive field on `FeedtackUser`
- `src/react/FeedtackProvider.tsx` — generic props, `mapUser` prop, normalization call
- `src/core/types.ts` — `FeedtackEngineOpts.currentUser` stays `FeedtackUser` (engine unchanged)
- Payload schema: additive (existing consumers ignore `username`)
- No adapter contract changes
- No inject path changes — inject already accepts `Partial<FeedtackUser>` at config time
- No breaking changes for existing host apps
