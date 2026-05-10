/**
 * Generates workflow-animation-dark.svg from the light version.
 * Single-pass color substitution so replaced values aren't re-replaced.
 */
const fs = require('fs');

const src  = fs.readFileSync('workflow-animation.svg', 'utf8');

// Light → Dark color map (order matters for regex alternation, longer first)
const MAP = {
  '#f3f4f6': '#0f172a',   // chrome/muted bg → near-black
  '#f9fafb': '#0f172a',   // page bg
  '#e5e7eb': '#334155',   // border/track → dark slate
  '#ffffff': '#1e293b',   // white fills → dark card
  '#9ca3af': '#64748b',   // grey text/lines
  '#374151': '#94a3b8',   // muted dark text → light slate
  '#111827': '#f1f5f9',   // near-black text → near-white
  '#2563eb': '#3b82f6',   // primary blue → lighter blue
  '#3b82f6': '#60a5fa',   // medium blue → even lighter
};

// Build single alternation regex (longer strings first to avoid partial matches)
const pattern = new RegExp(
  Object.keys(MAP).sort((a,b) => b.length - a.length).join('|'),
  'gi'
);

let dark = src.replace(pattern, m => MAP[m.toLowerCase()] ?? m);

// Bump opacity of dim labels (0.35 is too faint on dark bg)
dark = dark.replace(/opacity:0\.35/g, 'opacity:0.55');
dark = dark.replace(/opacity: 0\.35/g, 'opacity: 0.55');

// Shimmer slightly less intense on dark
dark = dark.replace(/rgba\(255,255,255,0\.18\)/g, 'rgba(255,255,255,0.10)');

// Update aria-label
dark = dark.replace(
  /aria-label="Feedtack workflow: browse, click, describe, submit, catalogue"/,
  'aria-label="Feedtack workflow (dark): browse, click, describe, submit, catalogue"'
);

fs.writeFileSync('workflow-animation-dark.svg', dark);
console.log('✓ workflow-animation-dark.svg written');
