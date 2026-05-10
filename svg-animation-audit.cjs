/**
 * SVG Animation Sync Audit — plain Node.js, no test framework.
 * Uses globally installed playwright to scrub the SVG animation
 * and report dot/segment/label sync at each step boundary.
 *
 * Run: node svg-animation-audit.cjs
 */
const { chromium } = require('/Users/trilliumsmith/.local/state/fnm_multishells/23057_1778251991048/lib/node_modules/@playwright/test');
const path = require('path');

const SVG_PATH = `file://${path.resolve(__dirname, 'workflow-animation.svg')}`;
const DURATION_MS = 12000;

const STEPS = [
  { name: 'Browse active (start)',        pct:  0  },
  { name: 'Browse→Click line at 50%',    pct:  9  },
  { name: 'Click activates',             pct: 18  },
  { name: 'Click→Describe at 50%',       pct: 26  },
  { name: 'Describe activates',          pct: 34  },
  { name: 'Describe→Submit at 50%',      pct: 44  },
  { name: 'Submit activates',            pct: 54  },
  { name: 'Submit→Catalogue at 50%',     pct: 61  },
  { name: 'Catalogue activates',         pct: 68  },
  { name: 'Catalogue fully shown',       pct: 80  },
  { name: 'Reset sweep begins',          pct: 91  },
  { name: 'Reset complete',              pct: 95  },
];

async function scrubTo(page, pct) {
  const ms = (pct / 100) * DURATION_MS;
  await page.evaluate((ms) => {
    document.getAnimations().forEach(a => {
      a.pause();
      a.currentTime = ms;
    });
  }, ms);
  await page.waitForTimeout(80);
}

async function captureState(page) {
  return page.evaluate(() => {
    // Segment fills — get width of each animated rect
    const segs = [...document.querySelectorAll('[class^="wfa-seg-"]')];
    const segWidths = segs.map(el => parseFloat(getComputedStyle(el).width) || 0);

    // Dot fills
    const dots = [...document.querySelectorAll('[class^="wfa-prog-dot-"]')];
    const dotFills = dots.map(el => getComputedStyle(el).fill);

    // Label fill + opacity
    const labels = [...document.querySelectorAll('[class^="wfa-label-"]')];
    const labelStates = labels.map(el => ({
      fill: getComputedStyle(el).fill,
      opacity: parseFloat(getComputedStyle(el).opacity),
    }));

    return { segWidths, dotFills, labelStates };
  });
}

function colorName(fill) {
  if (!fill || fill === 'none') return 'none';
  // rgb(37, 99, 235) = #2563eb (blue)
  if (/37,\s*99,\s*235/.test(fill)) return '\x1b[34mBLUE\x1b[0m';
  // rgb(255,255,255) = white
  if (/255,\s*255,\s*255/.test(fill)) return 'white';
  // rgb(229,231,235) = #e5e7eb grey border
  if (/229,\s*231,\s*235/.test(fill)) return 'grey';
  // rgb(55,65,81) = #374151 muted dark
  if (/55,\s*65,\s*81/.test(fill)) return 'muted';
  // rgb(156,163,175) = #9ca3af dimmed
  if (/156,\s*163,\s*175/.test(fill)) return 'dim';
  return fill;
}

function isBlue(fill) { return /37,\s*99,\s*235/.test(fill); }

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(SVG_PATH);
  await page.waitForSelector('svg');

  const issues = [];
  console.log('\n══════════════════════════════════════════');
  console.log('   SVG ANIMATION SYNC AUDIT');
  console.log('══════════════════════════════════════════');

  for (const step of STEPS) {
    await scrubTo(page, step.pct);
    const { segWidths, dotFills, labelStates } = await captureState(page);

    const blueDots    = dotFills.map((f,i) => isBlue(f) ? i : -1).filter(i => i >= 0);
    const filledSegs  = segWidths.map((w,i) => w > 5 ? i : -1).filter(i => i >= 0);
    const fullSegs    = segWidths.map((w,i) => w > 110 ? i : -1).filter(i => i >= 0);
    const activeLabel = labelStates.reduce((best, l, i) =>
      l.opacity > labelStates[best].opacity ? i : best, 0);

    console.log(`\n┌─ ${step.pct}% — ${step.name}`);
    console.log(`│  Dots:     ${dotFills.map((f,i) => `[${i}]${colorName(f)}`).join(' ')}`);
    console.log(`│  Segments: ${segWidths.map((w,i) => `[${i}]${w.toFixed(0)}px`).join(' ')}`);
    console.log(`│  Labels:   ${labelStates.map((l,i) => `[${i}]${colorName(l.fill)}(op:${l.opacity.toFixed(2)})`).join(' ')}`);
    console.log(`│  Active label: [${activeLabel}], Blue dots: [${blueDots.join(',')}], Full segs: [${fullSegs.join(',')}]`);

    // Sync checks
    const stepIssues = [];

    // Rule 1: A full segment should have both endpoint dots blue
    for (const si of fullSegs) {
      if (!blueDots.includes(si))     stepIssues.push(`seg[${si}] full but dot[${si}] (start) not blue`);
      if (!blueDots.includes(si + 1)) stepIssues.push(`seg[${si}] full but dot[${si+1}] (end) not blue`);
    }

    // Rule 2: The active label should match the highest blue dot (current step)
    const highestBlueDot = blueDots.length ? Math.max(...blueDots) : 0;
    if (step.pct > 0 && step.pct < 90 && activeLabel !== highestBlueDot) {
      stepIssues.push(`active label [${activeLabel}] doesn't match current step dot [${highestBlueDot}]`);
    }

    // Rule 3: A filling (partial) segment's source dot should be blue
    // (exempt during reset sweep 90-93% where all elements rewind simultaneously)
    const inReset = step.pct >= 90 && step.pct <= 93;
    if (!inReset) {
      const partialSegs = filledSegs.filter(i => !fullSegs.includes(i));
      for (const si of partialSegs) {
        if (!blueDots.includes(si)) stepIssues.push(`seg[${si}] is filling but source dot[${si}] not blue`);
      }
    }

    if (stepIssues.length) {
      stepIssues.forEach(msg => {
        console.log(`│  ⚠️  ${msg}`);
        issues.push(`${step.pct}% (${step.name}): ${msg}`);
      });
    } else {
      console.log(`│  ✓ in sync`);
    }
  }

  console.log('\n══════════════════════════════════════════');
  if (issues.length) {
    console.log(`\n⚠️  ${issues.length} SYNC ISSUE(S) FOUND:\n`);
    issues.forEach(i => console.log(`  • ${i}`));
  } else {
    console.log('\n✓ All sync checks passed');
  }
  console.log('══════════════════════════════════════════\n');

  await browser.close();
})();
