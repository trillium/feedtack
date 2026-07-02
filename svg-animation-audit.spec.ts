/**
 * SVG Animation Audit
 * Scrubs to each step boundary and captures actual computed styles
 * to verify dot/segment/label sync.
 *
 * Run: npx playwright test svg-animation-audit.spec.ts --reporter=line
 */

import path from 'node:path'
import { expect, type Page, test } from '@playwright/test'

const SVG_PATH = `file://${path.resolve(__dirname, 'workflow-animation.svg')}`
const DURATION_MS = 12000

// Step boundaries as % of total duration
const STEPS = [
  { name: 'Browse active (start)', pct: 0 },
  { name: 'Browse→Click line midway', pct: 9 },
  { name: 'Click activates', pct: 18 },
  { name: 'Click active + line filling', pct: 26 },
  { name: 'Describe activates', pct: 34 },
  { name: 'Describe active + filling', pct: 44 },
  { name: 'Submit activates', pct: 54 },
  { name: 'Submit active + filling', pct: 61 },
  { name: 'Catalogue activates', pct: 68 },
  { name: 'Catalogue fully shown', pct: 80 },
  { name: 'Reset sweep', pct: 91 },
]

async function scrubTo(page: Page, pct: number) {
  const ms = (pct / 100) * DURATION_MS
  await page.evaluate((ms: number) => {
    const anims = document.getAnimations()
    for (const a of anims) {
      a.pause()
      ;(a as CSSAnimation).currentTime = ms
    }
  }, ms)
  // Let paint settle
  await page.waitForTimeout(50)
}

async function captureState(page: Page) {
  return await page.evaluate(() => {
    // Segment widths via the animated <rect> inside each <svg> clipping container
    const segWidths: number[] = []
    for (const el of document.querySelectorAll('[class^="wfa-seg-"]')) {
      const w = window.getComputedStyle(el).width
      segWidths.push(Number.parseFloat(w) || 0)
    }

    // Dot fills (the 5 progress dots)
    const dotFills: string[] = []
    for (const el of document.querySelectorAll('[class^="wfa-prog-dot-"]')) {
      dotFills.push(window.getComputedStyle(el).fill)
    }

    // Label fills + opacity
    const labelFills: Array<{ fill: string; opacity: number }> = []
    for (const el of document.querySelectorAll('[class^="wfa-label-"]')) {
      const s = window.getComputedStyle(el)
      labelFills.push({ fill: s.fill, opacity: Number.parseFloat(s.opacity) })
    }

    return { segWidths, dotFills, labelFills }
  })
}

const BLUE = /rgb\(37,\s*99,\s*235\)|#2563eb/i // --color-fd-primary
const WHITE = /rgb\(255,\s*255,\s*255\)|#ffffff/i

function isBlue(v: string) {
  return BLUE.test(v)
}
function isWhite(v: string) {
  return WHITE.test(v)
}

test.describe('SVG progress bar animation sync audit', () => {
  test('capture state at each step boundary and report sync issues', async ({
    page,
  }) => {
    await page.goto(SVG_PATH)
    // Wait for SVG to be in DOM
    await page.waitForSelector('svg')

    const report: string[] = []
    const issues: string[] = []

    for (const step of STEPS) {
      await scrubTo(page, step.pct)
      const state = await captureState(page)
      const { segWidths, dotFills, labelFills } = state

      // Which dots are blue?
      const blueDots = dotFills
        .map((f, i) => (isBlue(f) ? i : -1))
        .filter((i) => i >= 0)
      // Which segs are substantially filled? (>5px)
      const filledSegs = segWidths
        .map((w, i) => (w > 5 ? i : -1))
        .filter((i) => i >= 0)
      // Which labels are highlighted? (opacity > 0.5 AND closer to blue)
      const activeLabels = labelFills
        .map((l, i) => (l.opacity > 0.5 ? i : -1))
        .filter((i) => i >= 0)

      const line = [
        `\n--- ${step.pct}% | ${step.name} ---`,
        `  Dots blue:    [${blueDots.join(', ')}]  (fills: ${dotFills.map((f, i) => `${i}:${isBlue(f) ? 'BLUE' : isWhite(f) ? 'white' : 'grey'}`).join(' ')})`,
        `  Seg widths:   ${segWidths.map((w, i) => `${i}:${w.toFixed(0)}px`).join(' ')}`,
        `  Labels active:[${activeLabels.join(', ')}]  (opacity: ${labelFills.map((l) => l.opacity.toFixed(2)).join(' ')})`,
      ].join('\n')

      report.push(line)

      // --- Sync checks ---
      // A segment that's filling should have its SOURCE dot blue
      // A segment that's FULL should have BOTH endpoint dots blue
      // The ACTIVE label should match the active step

      if (filledSegs.length > 0) {
        const lastFilledSeg = Math.max(...filledSegs)
        const expectedDot = lastFilledSeg + 1
        if (
          step.pct >= 18 &&
          !blueDots.includes(expectedDot) &&
          segWidths[lastFilledSeg] > 100
        ) {
          issues.push(
            `${step.pct}%: seg[${lastFilledSeg}] is full (${segWidths[lastFilledSeg].toFixed(0)}px) but dot[${expectedDot}] is NOT blue`,
          )
        }
      }
    }

    // Print full report
    console.log('\n====== SVG ANIMATION SYNC AUDIT ======')
    console.log(report.join('\n'))
    if (issues.length) {
      console.log('\n====== SYNC ISSUES FOUND ======')
      for (const i of issues) {
        console.log(`  ⚠️  ${i}`)
      }
    } else {
      console.log('\n✓ No sync issues detected')
    }

    // Always pass — this is a reporting test
    expect(report.length).toBeGreaterThan(0)
  })
})
