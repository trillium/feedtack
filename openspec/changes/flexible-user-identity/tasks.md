## 1. Types

- [x] 1.1 Add `username?: string` to `FeedtackUser` in `src/types/payload.ts`
- [x] 1.2 Update `email` field comment in `FeedtackUser` — remove "reserved for future use" language

## 2. Provider

- [x] 2.1 Make `FeedtackProviderProps` generic: `FeedtackProviderProps<TUser = FeedtackUser>`
- [x] 2.2 Change `currentUser: FeedtackUser` to `currentUser: TUser` in `FeedtackProviderProps`
- [x] 2.3 Add `mapUser?: (user: TUser) => FeedtackUser` to `FeedtackProviderProps`
- [x] 2.4 In `FeedtackProvider` function signature, add trailing comma to generic: `<TUser = FeedtackUser,>`
- [x] 2.5 Derive `resolvedUser` before passing to engine: `const resolvedUser = mapUser ? mapUser(currentUser) : (currentUser as unknown as FeedtackUser)`
- [x] 2.6 Add dev-mode warning when `resolvedUser.id` is falsy

## 3. Engine / Core

- [x] 3.1 `FeedtackEngineOpts.currentUser` stays `FeedtackUser` — verify no changes needed
- [x] 3.2 Confirm `useFeedtackState` passes `resolvedUser` (not `currentUser`) to engine opts

## 4. Validation

- [x] 4.1 Update `PayloadSchema.submittedBy` in `site-docs/src/app/api/feedtack/helpers.ts` — add optional `username` field
- [x] 4.2 Update `formatIssueBody()` — render `@username` in submitted-by line when `username` is present

## 5. Tests

- [x] 5.1 `FeedtackProvider` with `FeedtackUser` prop and no `mapUser` — resolvedUser equals currentUser
- [x] 5.2 `FeedtackProvider` with custom user type and `mapUser` — resolvedUser is mapped value
- [x] 5.3 `submittedBy.username` appears in formatted issue body as `@username`
- [x] 5.4 Missing `username` — formatted issue body falls back to name only, no `@` rendered
- [x] 5.5 Dev warning emitted when resolved user has no `id`
- [x] 5.6 No warning in production mode for missing `id`
