## Context

`FeedtackProvider` currently requires `currentUser: FeedtackUser` (required, not partial). The engine reads two specific fields from the user at runtime:

- `currentUser.id` — used in `isArchivedForUser()` to deduplicate archives per user
- `currentUser.role` — used in rescope logic (`role !== 'agent'`)

These two reads mean the engine cannot accept an arbitrary user type — it must always receive a shape with at least `id` and `role`. Normalization is therefore required before the engine sees the user.

The inject path (`src/inject/types.ts`) already accepts `Partial<FeedtackUser>` with a fallback to `ANON_USER`. That pattern is correct and stays unchanged.

## Goals / Non-Goals

**Goals:**
- Allow host apps to pass their own user type to `FeedtackProvider` via a `mapUser` prop
- Keep `FeedtackUser` as the suggested type — no change required for existing integrations
- Add `username?: string` to `FeedtackUser` for @mention support in issue bodies
- Normalization happens once at the provider boundary; engine remains non-generic

**Non-Goals:**
- Making `id` or `role` optional on the normalized `FeedtackUser` — engine reads these fields; they must be present after normalization
- Threading generics through the engine, adapters, or action context
- Auto-detecting field aliases (e.g. mapping `displayName` → `name` without explicit instruction) — too implicit, silent failures
- Changing the inject path — it uses a different entry point and already handles partial users

## Decisions

### 1. Generic at the Provider, not the engine

`FeedtackProviderProps<TUser = FeedtackUser>` with `mapUser?: (user: TUser) => FeedtackUser`. The engine receives a resolved `FeedtackUser` — generics stay at the surface. This avoids threading `TUser` through `ActionContext`, `FeedtackEngineOpts`, and all action handlers.

Alternative considered: make the engine generic. Rejected — the engine reads `.id` and `.role` directly; making it generic would require either constraint bounds on `TUser` or accessor functions everywhere, adding complexity with no benefit since normalization at the boundary is equivalent.

### 2. `mapUser` is optional, not required when `TUser = FeedtackUser`

TypeScript infers `TUser` from `currentUser`. When the inferred type is compatible with `FeedtackUser`, `mapUser` can be omitted and the value is used directly. When the inferred type is incompatible, the host app must provide `mapUser` — TypeScript will surface an error at the call site.

The internal fallback when `mapUser` is absent: `currentUser as unknown as FeedtackUser`. This is safe when `TUser extends FeedtackUser` (TypeScript ensures compatibility) and a documented host-app responsibility otherwise.

### 3. `username?: string` is a flat field, not a namespaced record

A single `username` field rather than `{ github?: string, slack?: string, ... }`. The host app decides what handle is relevant and maps it in. Feedtack doesn't need to know the namespace — it just renders the value. Keeping it flat avoids premature complexity.

Alternative considered: `handles?: Record<string, string>`. Rejected — overcomplicated for the current use case (GitHub @mentions in issue bodies). If multiple handle namespaces are needed in the future, this can be extended additively.

### 4. `email` is promoted from "reserved" to first-class optional

The comment "reserved for future notification use" is removed. `email` is a standard field that auth systems universally provide. It's optional, additive, and the host app should feel free to pass it.

### 5. No runtime normalization or field alias detection

Feedtack does not try to guess field names (`displayName` → `name`, `sub` → `id`, etc.). The `mapUser` function is the explicit, debuggable contract. Silent remapping would create confusion when host app user shapes change.

## Risks / Trade-offs

- **TypeScript doesn't enforce `mapUser` as required when `TUser` is incompatible** — this is a known limitation of optional generics without conditional types. Mitigated by clear documentation and a console warning in development when the resolved user has no `id`.
- **TSX generic syntax ambiguity** — `<TUser = FeedtackUser,>` requires a trailing comma in `.tsx` files to disambiguate from JSX. Standard pattern; handled at implementation time.
- **No breaking changes** — existing host apps passing `FeedtackUser`-shaped objects need no changes.
