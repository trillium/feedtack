## 1. Types

- [x] 1.1 Add `classes: string[]` to `AncestorNode` in `src/types/payload.ts`
- [x] 1.2 Add `textContent: string | null` to `AncestorNode` in `src/types/payload.ts`
- [x] 1.3 Add `placeholder: string | null` to `AncestorNode` in `src/types/payload.ts`

## 2. Capture

- [x] 2.1 Update `serializeNode()` in `src/capture/target.ts` — populate `classes` via `Array.from(el.classList)`
- [x] 2.2 Update `serializeNode()` — populate `textContent` via `el.textContent?.trim().slice(0, 120) ?? null`; treat empty-after-trim as `null`
- [x] 2.3 Update `serializeNode()` — populate `placeholder` via `attr(el, 'placeholder')`
- [x] 2.4 Remove the duplicate `Array.from(target.classList)` call in `deriveElementPath()` — it can now read from the serialized node (or leave as-is if simpler; it's a local variable only)

## 3. Display

- [x] 3.1 Update `formatIssueBody()` in `site-docs/src/app/api/feedtack/helpers.ts` — replace the target section with a full **Element Context** block rendering all non-null fields (classes, textContent, placeholder, ariaLabel, role, type, name, dataTestId, dataFeedtackComponent)
- [x] 3.2 Update the ancestor chain loop — render classes and ariaLabel per ancestor node in addition to the existing tag/id/componentName

## 4. Breakpoint

- [x] 4.1 Add `breakpoint: string | null` to `FeedtackViewportMeta` in `src/types/payload.ts`
- [x] 4.2 Add `TAILWIND_BREAKPOINTS` constant to `src/capture/meta.ts`: `{ sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 }`
- [x] 4.3 Update `getViewportMeta(breakpoints?: Record<string, number>)` in `src/capture/meta.ts` — resolve breakpoint by walking entries descending via `window.matchMedia`; return `null` when no match or no breakpoints provided
- [x] 4.4 Add `breakpoints?: Record<string, number>` to `FeedtackProviderProps` in `src/react/providerTypes.ts`; default to `TAILWIND_BREAKPOINTS`
- [x] 4.5 Add `breakpoints?: Record<string, number>` to `FeedtackEngineOpts` in `src/core/types.ts`
- [x] 4.6 Add `breakpoints?: Record<string, number>` to `ActionContext` in `src/core/actions.ts`
- [x] 4.7 Pass `breakpoints` from `FeedtackProvider` → `useFeedtackState` → engine opts
- [x] 4.8 Pass `ctx.breakpoints` to `getViewportMeta(ctx.breakpoints)` in `handleSubmit` and `handleModalSubmit` in `src/core/actions.ts`
- [x] 4.9 Update `formatIssueBody()` viewport line — append `(${breakpoint})` when non-null

## 5. Tests

- [x] 5.1 `serializeNode()` includes `classes` as array for element with classes
- [x] 5.2 `serializeNode()` includes `classes: []` for element with no classes
- [x] 5.3 `serializeNode()` includes `textContent` trimmed and truncated at 120 chars
- [x] 5.4 `serializeNode()` sets `textContent: null` for whitespace-only or absent content
- [x] 5.5 `serializeNode()` captures `placeholder` for input elements
- [x] 5.6 `serializeNode()` sets `placeholder: null` for non-input elements
- [x] 5.7 `formatIssueBody()` renders classes, textContent, ariaLabel in Element Context block
- [x] 5.8 `formatIssueBody()` omits null fields entirely (no "n/a" rendered)
- [x] 5.9 `getViewportMeta()` returns `breakpoint: "xl"` for 1440px viewport with Tailwind defaults
- [x] 5.10 `getViewportMeta()` returns `breakpoint: null` when viewport is below all breakpoints
- [x] 5.11 `getViewportMeta()` returns `breakpoint: null` when no breakpoints provided
- [x] 5.12 `formatIssueBody()` renders `1440x900 @ 2x DPR (xl)` when breakpoint is present
- [x] 5.13 `formatIssueBody()` renders `1440x900 @ 2x DPR` with no suffix when breakpoint is null
