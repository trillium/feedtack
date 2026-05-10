## NEW Requirements

### Requirement: FeedtackProvider accepts a custom user type via generic

`FeedtackProvider` SHALL be generic over a user type `TUser`, defaulting to `FeedtackUser`. Host apps MAY pass any user type as `currentUser` and provide a `mapUser` function to normalize it to `FeedtackUser` before the engine receives it.

- **Default behavior (`TUser = FeedtackUser`):** `mapUser` may be omitted. `currentUser` is passed directly to the engine.
- **Custom type behavior:** Host app provides `mapUser: (user: TUser) => FeedtackUser`. The provider calls `mapUser(currentUser)` once per render and passes the result to the engine.

#### Scenario: Host app passes FeedtackUser directly
- **WHEN** the host app passes a `FeedtackUser`-shaped object as `currentUser` without `mapUser`
- **THEN** the provider uses the object as-is — no mapping, no change from current behavior

#### Scenario: Host app passes a Clerk user
- **WHEN** the host app passes a Clerk `User` object as `currentUser` and provides `mapUser`
- **THEN** the provider calls `mapUser(clerkUser)` and passes the result as `submittedBy` in all payloads

#### Scenario: Host app passes a NextAuth session user
- **WHEN** the host app passes `session.user` (NextAuth shape) with `mapUser`
- **THEN** the provider normalizes to `FeedtackUser` before any engine operation

---

### Requirement: Normalization occurs at the provider boundary

The engine, adapters, and action context SHALL always receive a fully resolved `FeedtackUser`. No generic type parameter SHALL propagate below the provider component.

#### Scenario: Engine receives resolved user
- **WHEN** `mapUser` is provided
- **THEN** the engine's `currentUser` is the return value of `mapUser(currentUser)`, not the raw `TUser`

---

### Requirement: Resolved user must have id and role

When `mapUser` is omitted and `TUser` is not structurally compatible with `FeedtackUser`, behavior is undefined. In development mode, the system SHOULD emit a console warning when the resolved user has no `id` field, to help host apps detect misconfiguration.

#### Scenario: Missing id in development
- **WHEN** the resolved user object has no `id` field and `NODE_ENV` is `"development"`
- **THEN** a console warning is emitted: `"[feedtack] currentUser has no id — provide mapUser to normalize your user type"`
- **AND** the submission proceeds with `id: undefined` (not blocked)

---

### Requirement: mapUser is called once per render, not per submission

`mapUser` is called during render to derive the resolved user, not at submission time. This means:
- `mapUser` must be a stable function (host app should not define it inline without `useCallback` in React)
- The resolved user reflects the user at render time, not at click time

This is consistent with how `currentUser` is already handled — it is passed as a prop and read from engine opts at submission time.
