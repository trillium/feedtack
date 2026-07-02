# README-to-Source Sync: Tooling Research

**Bead:** fe-t6v
**Date:** 2026-04-11
**Problem:** The README payload example and API docs go stale after type changes. After v0-3-0, the README still shows `textContent`, `attributes` in the payload example instead of the current `ancestors[]`, `AncestorNode`, `dataTestId`. Even `payload.test.ts` has the same drift. We want automated guardrails.

---

## Summary Table

| Approach | Setup | Maintenance | Handles JSON examples? | Fits toolchain? | Verdict |
|---|---|---|---|---|---|
| **1. Vitest snapshot test for README JSON** | Low | Low | Excellent | Native | **Recommended** |
| **2. embedme (file embedding)** | Low | Low | Good (indirect) | Good | **Runner-up** |
| **3. markdown-magic (tagged sections)** | Medium | Low | Good | Good | Viable |
| **4. ts-json-schema-generator + json-schema-faker** | High | Medium | Excellent (auto-gen) | Needs glue | Over-engineered |
| **5. TypeDoc + typedoc-plugin-markdown** | Medium-High | Medium | Poor (API docs, not examples) | Standalone | Wrong tool for this job |
| **6. tsdoc-markdown / ts-readme** | Medium | Medium | Poor | Standalone | Wrong tool for this job |
| **7. API Extractor (Microsoft)** | High | High | Poor | Overkill for single-pkg | No |
| **8. LLM hook (Claude in release-it)** | Medium | High | Decent | Fragile | Not yet reliable enough |
| **9. release-it hook + custom script** | Low | Low | Good (with approach 1 or 2) | Native | Good glue layer |

---

## Detailed Analysis

### 1. Vitest snapshot/fixture test for README JSON (RECOMMENDED)

**Concept:** Write a vitest test that:
1. Imports `FeedtackPinTarget`, `FeedtackPayload`, etc. from source
2. Constructs a canonical example payload (the "golden" example)
3. Reads `README.md`, extracts the JSON block under `## The payload`
4. Parses it and asserts structural equivalence with the golden example

When types change, the golden example in the test must be updated (it's TypeScript, so the compiler catches missing/extra fields). If the README JSON diverges from the golden example, the test fails.

**Why this wins:**
- Zero new dependencies (vitest already in place)
- The TypeScript compiler enforces that the golden example matches `FeedtackPayload` at compile time
- The test enforces that the README matches the golden example at test time
- Catches drift in CI, not after release
- The golden example lives in one place and serves double duty: test fixture + README content source
- Note: `payload.test.ts` already has a `mockPayload` that is ALSO stale -- this approach consolidates the problem

**Setup complexity:** Low. One new test file, ~50 lines.

**Tradeoffs:**
- Updating the README is still manual, but the test tells you exactly when/what to update
- If you want fully automatic README rewriting, pair with approach 2 or 3

**Sample implementation:**

```ts
// src/test/readme-payload.test.ts
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { FeedtackPayload } from '../types/payload.js'
import { SCHEMA_VERSION } from '../types/payload.js'

/**
 * Canonical payload example. TypeScript enforces this matches FeedtackPayload.
 * This is the source of truth for the README example.
 */
const CANONICAL_PAYLOAD: FeedtackPayload = {
  schemaVersion: SCHEMA_VERSION,
  id: 'ft_01j...',
  timestamp: '2026-04-09T13:42:00.000Z',
  submittedBy: { id: 'u1', name: 'Alice', role: 'designer' },
  comment: "This button doesn't do anything",
  sentiment: 'dissatisfied',
  pins: [{
    index: 1,
    color: '#ef4444',
    x: 420, y: 812,
    xPct: 29.2, yPct: 78.4,
    target: {
      selector: '#submit-btn',
      best_effort: false,
      dataTestId: 'submit-button',
      elementPath: 'main > form > button#submit-btn',
      tagName: 'BUTTON',
      ancestors: [
        {
          tag: 'BUTTON', id: 'submit-btn', ariaLabel: 'Place order',
          role: 'button', type: 'submit', name: null, title: null,
          alt: null, dataTestId: 'submit-button',
          dataFeedtackComponent: null, nthChild: null, nthOfType: null,
          componentName: 'SubmitButton',
        },
        {
          tag: 'FORM', id: 'checkout-form', ariaLabel: null,
          role: null, type: null, name: null, title: null,
          alt: null, dataTestId: 'checkout-form',
          dataFeedtackComponent: null, nthChild: null, nthOfType: null,
          componentName: 'CheckoutForm',
        },
      ],
      boundingRect: { x: 420, y: 812, width: 200, height: 44 },
    },
  }],
  page: { url: 'https://app.example.com/checkout', pathname: '/checkout', title: 'Checkout' },
  viewport: { width: 1440, height: 900, scrollX: 0, scrollY: 812, devicePixelRatio: 2 },
  device: { userAgent: 'Mozilla/5.0...', platform: 'MacIntel', touchEnabled: false },
}

describe('README payload example', () => {
  it('matches the canonical payload shape', () => {
    const readme = readFileSync(resolve(__dirname, '../../README.md'), 'utf-8')
    // Extract the JSON block after "## The payload"
    const payloadSection = readme.split('## The payload')[1]
    const jsonMatch = payloadSection?.match(/```json\n([\s\S]*?)```/)
    expect(jsonMatch).not.toBeNull()

    const readmePayload = JSON.parse(jsonMatch![1])

    // Deep-compare keys at each level (values are illustrative, keys are structural)
    expect(Object.keys(readmePayload).sort())
      .toEqual(Object.keys(CANONICAL_PAYLOAD).sort())
    expect(Object.keys(readmePayload.pins[0].target).sort())
      .toEqual(Object.keys(CANONICAL_PAYLOAD.pins[0].target).sort())
    // Verify ancestors array exists and has correct shape
    expect(readmePayload.pins[0].target.ancestors).toBeDefined()
    expect(Array.isArray(readmePayload.pins[0].target.ancestors)).toBe(true)
    if (readmePayload.pins[0].target.ancestors.length > 0) {
      expect(Object.keys(readmePayload.pins[0].target.ancestors[0]).sort())
        .toEqual(Object.keys(CANONICAL_PAYLOAD.pins[0].target.ancestors[0]).sort())
    }
  })
})
```

This gives you:
- **Compile-time safety:** If `FeedtackPinTarget` changes, `CANONICAL_PAYLOAD` won't compile
- **Runtime safety:** If README diverges from canonical, test fails
- **CI integration:** Already runs via `pnpm test`

---

### 2. embedme (Runner-up / Complement)

**Concept:** embedme replaces code blocks in markdown with content from source files. You place a comment like `<!-- embedme path/to/file.json -->` before a fenced block, and running `embedme README.md` fills it in.

**How it would work for feedtack:**
1. Create a `docs/examples/payload.json` file (generated from the canonical TS object)
2. Add `<!-- embedme docs/examples/payload.json -->` before the JSON block in README
3. Add `"docs:sync": "embedme README.md"` to package.json scripts
4. Optionally add `"after:bump": "pnpm docs:sync"` to release-it hooks
5. Use `embedme --verify README.md` in CI to catch drift

**Package:** [embedme on npm](https://www.npmjs.com/package/embedme) (~300k downloads, actively maintained)

**Strengths:**
- Simple mental model: file is the source of truth, README is the consumer
- `--verify` flag makes CI integration trivial
- Works for any code block language, not just JSON

**Weaknesses:**
- The JSON file itself can still go stale unless something generates it
- Best paired with approach 1 (vitest test generates/validates the JSON file)
- Adds one devDependency

**Setup:**
```bash
pnpm add -D embedme
```

```json
// package.json scripts
"docs:sync": "embedme README.md",
"docs:verify": "embedme --verify README.md"
```

```json
// .release-it.json hooks
"hooks": {
  "after:bump": "pnpm docs:sync"
}
```

---

### 3. markdown-magic (Tagged sections)

**Concept:** [markdown-magic](https://github.com/DavidWells/markdown-magic) uses `<!-- AUTO-GENERATED-CONTENT:START -->` / `<!-- AUTO-GENERATED-CONTENT:END -->` comment pairs. You write custom "transforms" that generate content. A transform could read the canonical JSON and inject it.

**How it differs from embedme:**
- More powerful (custom transforms, remote content, TOC generation)
- More setup (config file, transform functions)
- Better if you have MULTIPLE generated sections (e.g., props table, payload example, adapter API)

**Verdict:** If the only generated section is the payload JSON, embedme is simpler. If you later want to auto-generate a props table or adapter interface docs, markdown-magic scales better.

---

### 4. Type-to-Example Generation (ts-json-schema-generator + json-schema-faker)

**Concept:** Automatically generate a JSON example from the `FeedtackPayload` TypeScript interface.

**Pipeline:**
1. `ts-json-schema-generator --path src/types/payload.ts --type FeedtackPayload` produces a JSON Schema
2. `json-schema-faker` generates a sample JSON object from that schema

**Why it's not recommended:**
- The generated examples are ugly (random strings, meaningless numbers)
- A good README example needs *curated* values that tell a story ("Alice", "checkout", "Place Order")
- You'd need extensive overrides/fixtures to make the output readable, defeating the purpose
- Two new dependencies plus glue code

**When it WOULD make sense:** If feedtack had a large, frequently-changing schema and the example didn't need to be human-curated. Not the case here.

---

### 5. TypeDoc / typedoc-plugin-markdown

**Concept:** Generate API reference docs from TSDoc comments in source.

**Assessment:**
- Good at generating interface/function/class docs
- Poor at generating curated JSON payload examples (it documents the *type*, not an *instance*)
- Significant setup: typedoc.json config, plugin config, output directory
- The feedtack README is a quick-start guide, not an API reference
- Could be useful later for a `/docs/api/` site, but wrong tool for the payload example problem

---

### 6. LLM-Assisted README Hook

**Concept:** A release-it hook that runs Claude (via API or CLI) to rewrite stale README sections.

**Assessment:**
- Technically feasible: `"after:bump": "claude -p 'Update README.md payload example to match src/types/payload.ts'"`
- Non-deterministic output: same input could produce different formatting each time
- Requires API key in CI environment
- Hard to review: diffs could be noisy
- No compile-time or type-safety guarantees
- Better as a developer aid (manual invocation) than an automated pipeline step

**Verdict:** Too flaky for automated use. Fine as a one-off developer convenience.

---

## Recommendation

**Primary: Approach 1 (Vitest canonical payload test)**

This is the highest-value, lowest-cost option:

1. Create a single canonical `FeedtackPayload` object in a test file, typed against the real interface
2. TypeScript compiler catches type drift at build time
3. Vitest test catches README drift at test time
4. Zero new dependencies
5. Runs in existing CI via `pnpm test`

**Secondary (optional, add later if needed): Approach 2 (embedme) + release-it hook**

If you want the README to be *automatically rewritten* rather than just *flagged as stale*:

1. Have the vitest test write the canonical payload to `docs/examples/payload.json`
2. Use embedme to sync that file into README.md
3. Wire it into release-it via `"after:bump": "pnpm docs:sync"`

This gives you a fully automated pipeline: type change -> test fails -> fix canonical object -> test writes JSON -> embedme syncs README -> release-it commits it.

**What to do right now:**

1. Fix the immediate drift: update README.md payload example and `payload.test.ts` mockPayload to match current `FeedtackPinTarget` (ancestors, dataTestId, elementPath -- no more textContent/attributes)
2. Add the canonical payload test (~50 lines, sample above)
3. Defer embedme until you've had at least one more release where the test catches drift

---

## Observations

- **`payload.test.ts` is also stale.** Its `mockPayload` still has `textContent`, `attributes`, and `testId` which are no longer on `FeedtackPinTarget`. This means `pnpm test` might already be failing or the types are looser than intended. Worth investigating as part of the fix.
- The release-it config already has conventional-changelog. Adding `"hooks": { "after:bump": "..." }` is trivial.
- The project uses biome for linting, not eslint for markdown -- so markdown linting of code blocks isn't available out of the box (biome doesn't lint markdown).

## Sources

- [embedme (GitHub)](https://github.com/zakhenry/embedme)
- [embedme (npm)](https://www.npmjs.com/package/embedme)
- [Ensuring accuracy of README code snippets (DEV Community)](https://dev.to/zakhenry/ensuring-accuracy-of-readme-code-snippets-525p)
- [markdown-magic (GitHub)](https://github.com/DavidWells/markdown-magic)
- [ts-json-schema-generator (GitHub)](https://github.com/vega/ts-json-schema-generator)
- [json-schema-faker (GitHub)](https://github.com/json-schema-faker/json-schema-faker)
- [typedoc-plugin-markdown (npm)](https://www.npmjs.com/package/typedoc-plugin-markdown)
- [tsdoc-markdown (GitHub)](https://github.com/peterpeterparker/tsdoc-markdown)
- [ts-readme (GitHub)](https://github.com/intuit/ts-readme)
- [API Extractor (Microsoft)](https://api-extractor.com/pages/setup/generating_docs/)
- [release-it hooks docs (GitHub)](https://github.com/release-it/release-it/blob/main/docs/plugins.md)
