## MODIFIED Requirements

### Requirement: IIFE capture path excludes React fiber walker
The IIFE entry SHALL use a target shim that replaces `getComponentName` (from `fiber.ts`) with a no-op returning `null`. The existing `target.ts` import of `fiber.ts` SHALL remain unchanged for React users — only the IIFE build path is shimmed.

#### Scenario: Target shim excludes fiber.ts
- **WHEN** `src/inject/target-shim.ts` is analyzed for imports
- **THEN** it does NOT import from `fiber.ts` or any module containing `__reactFiber`

#### Scenario: IIFE bundle contains no React artifacts
- **WHEN** `dist/feedtack.inject.js` is built and its contents are searched
- **THEN** no references to `react`, `React`, `createElement`, `jsx`, `__reactFiber`, or `'use client'` are found in the output

#### Scenario: React users unaffected
- **WHEN** the React version of feedtack imports from `src/capture/target.ts`
- **THEN** `getComponentName` from `fiber.ts` is still called and populates `componentName` in the payload

### Requirement: Payload componentName is null in snippet
The IIFE-produced payloads SHALL set `target.componentName` to `null` for all captured elements (since no React fiber is available).

#### Scenario: componentName in snippet payload
- **WHEN** a pin is placed via the injectable snippet
- **THEN** the `target` object in the payload has `componentName: null`
