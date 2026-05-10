## NEW Requirements

### Requirement: Viewport metadata includes resolved breakpoint name

`FeedtackViewportMeta` SHALL include an optional `breakpoint` field containing the name of the active CSS breakpoint at capture time.

- **Type:** `string | null`
- **Source:** resolved via `window.matchMedia` against configured breakpoints at submission time
- **When no breakpoints configured:** `null`
- **Resolution:** walk configured breakpoints from largest to smallest; return the name of the first whose `min-width` matches the current viewport

#### Scenario: Viewport matches a configured breakpoint
- **WHEN** the viewport width is 1440px and breakpoints include `{ lg: 1024, xl: 1280, '2xl': 1536 }`
- **THEN** `viewport.breakpoint` is `"xl"` (largest min-width that matches)

#### Scenario: Viewport below all configured breakpoints
- **WHEN** the viewport width is 400px and the smallest breakpoint is `sm: 640`
- **THEN** `viewport.breakpoint` is `null`

#### Scenario: No breakpoints configured
- **WHEN** no `breakpoints` prop is provided to `FeedtackProvider`
- **THEN** `viewport.breakpoint` is `null`

#### Scenario: Exact boundary match
- **WHEN** the viewport width is exactly 1024px and breakpoints include `lg: 1024`
- **THEN** `viewport.breakpoint` is `"lg"` (`min-width: 1024px` matches at exactly 1024px)

---

### Requirement: Default breakpoint preset is Tailwind v3

When a host app does not provide a `breakpoints` prop, feedtack SHALL default to Tailwind v3 breakpoints:

```
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px
```

This default SHALL be exported as `TAILWIND_BREAKPOINTS` for host apps that want to extend or reference it.

#### Scenario: Tailwind default resolves correctly for common viewport
- **WHEN** no `breakpoints` prop is provided and viewport width is 1440px
- **THEN** `viewport.breakpoint` is `"xl"`

#### Scenario: Host app overrides with Bootstrap breakpoints
- **WHEN** `breakpoints={{ sm: 576, md: 768, lg: 992, xl: 1200, xxl: 1400 }}` is provided
- **THEN** breakpoint resolution uses Bootstrap values exclusively

---

### Requirement: Breakpoints flow from Provider to capture

The `breakpoints` configuration SHALL flow from `FeedtackProvider` → `FeedtackEngineOpts` → `ActionContext` → `getViewportMeta()` at submission time. The resolved breakpoint name SHALL be computed at submission time (not at mount time), reflecting the viewport at the moment the user submits.

#### Scenario: Viewport resized between mount and submit
- **WHEN** the provider mounts at `lg` width and the user resizes to `md` before submitting
- **THEN** `viewport.breakpoint` reflects the width at submission time, not mount time

---

### Requirement: Issue body renders breakpoint alongside viewport dimensions

When `viewport.breakpoint` is non-null, `formatIssueBody()` SHALL include it in the viewport line.

#### Scenario: Breakpoint shown in issue
- **WHEN** `viewport` is `{ width: 1440, height: 900, breakpoint: "xl", ... }`
- **THEN** the issue body renders: `1440x900 @ 2x DPR (xl)`

#### Scenario: No breakpoint in issue when null
- **WHEN** `viewport.breakpoint` is `null`
- **THEN** the issue body renders: `1440x900 @ 2x DPR` with no breakpoint suffix
