#!/usr/bin/env node
/**
 * SVG bounds calculator — computes actual coordinate ranges from parsed SVG geometry.
 * Uses conservative text width estimates based on system-ui metrics at common sizes.
 */

const fs = require('fs');

// Average character widths for system-ui/sans-serif (em units per px of font-size)
// Based on measured values for macOS system-ui bold/semibold
const CHAR_WIDTHS = {
  // char: width-ratio (width / fontSize)
  default: 0.58,  // conservative default
  ' ': 0.28,
  'i': 0.28, 'l': 0.28, '|': 0.28, '1': 0.38, 'r': 0.38,
  'f': 0.35, 't': 0.38, 'j': 0.28,
  'm': 0.88, 'w': 0.82, 'W': 0.88, 'M': 0.88,
  'C': 0.72, 'G': 0.75, 'O': 0.75, 'Q': 0.75, 'D': 0.72,
  'A': 0.68, 'B': 0.66, 'E': 0.62, 'F': 0.58, 'H': 0.72,
  'I': 0.32, 'J': 0.45, 'K': 0.68, 'L': 0.58, 'N': 0.72,
  'P': 0.62, 'R': 0.68, 'S': 0.60, 'T': 0.58, 'U': 0.70,
  'V': 0.68, 'X': 0.65, 'Y': 0.62, 'Z': 0.62,
};

function estimateTextWidth(text, fontSize, fontWeight) {
  const boldMult = (fontWeight >= 600) ? 1.08 : 1.0;
  let width = 0;
  for (const ch of text) {
    const ratio = CHAR_WIDTHS[ch] ?? CHAR_WIDTHS.default;
    width += ratio * fontSize;
  }
  return width * boldMult;
}

// Parse transform="translate(x,y)" or transform="translate(x y)"
function parseTranslate(transform) {
  if (!transform) return [0, 0];
  const m = transform.match(/translate\(\s*([-\d.]+)[,\s]+([-\d.]+)\s*\)/);
  if (m) return [parseFloat(m[1]), parseFloat(m[2])];
  const m2 = transform.match(/translate\(\s*([-\d.]+)\s*\)/);
  if (m2) return [parseFloat(m2[1]), 0];
  return [0, 0];
}

const svgText = fs.readFileSync('workflow-animation.svg', 'utf8');

// Extract SVG root attributes
const viewBoxMatch = svgText.match(/viewBox="([^"]+)"/);
const widthMatch = svgText.match(/^<svg[^>]*\s+width="(\d+)"/m);
const heightMatch = svgText.match(/^<svg[^>]*\s+height="(\d+)"/m);

console.log('\n=== SVG Document ===');
console.log('viewBox:', viewBoxMatch?.[1]);
console.log('width:', widthMatch?.[1]);
console.log('height:', heightMatch?.[1]);

// Get wfa-root transform
const rootTransformMatch = svgText.match(/class="wfa-root"\s+transform="([^"]+)"/);
const [tx, ty] = parseTranslate(rootTransformMatch?.[1]);
console.log(`\n=== wfa-root transform: translate(${tx}, ${ty}) ===`);

// Extract and measure ONLY the 5 progress bar labels (y=22 in wfa-root, text-anchor=middle)
// Exclude text inside the inner <svg> stage (those are in a different coordinate system)
console.log('\n=== Progress Bar Label Bounds (after transform) ===');
const textRegex = /<text\s+x="([\d.]+)"\s+y="22"\s+font-size="13"\s+font-weight="600"[^>]*text-anchor="middle"[^>]*>([^<]+)<\/text>/g;
let match;
let maxRight = 0;
let minLeft = Infinity;

while ((match = textRegex.exec(svgText)) !== null) {
  const x = parseFloat(match[1]) + tx;
  const fontSize = 13;
  const fontWeight = 600;
  const text = match[2];
  const textWidth = estimateTextWidth(text, fontSize, fontWeight);
  const left = x - textWidth / 2;  // text-anchor=middle
  const right = x + textWidth / 2;
  maxRight = Math.max(maxRight, right);
  minLeft = Math.min(minLeft, left);
  console.log(`  "${text}": center=${x}, width≈${textWidth.toFixed(1)}px → left=${left.toFixed(1)}, right=${right.toFixed(1)}`);
}

// Extract dot positions
console.log('\n=== Progress Dot Bounds (after transform) ===');
const dotRegex = /cx="(\d+)"\s+cy="(\d+)"\s+r="(\d+)"/g;
let dotCount = 0;
while ((match = dotRegex.exec(svgText)) !== null && dotCount < 5) {
  const cx = parseFloat(match[1]) + tx;
  const cy = parseFloat(match[2]);
  const r = parseFloat(match[3]);
  maxRight = Math.max(maxRight, cx + r);
  minLeft = Math.min(minLeft, cx - r);
  console.log(`  dot: cx=${cx}, right edge=${cx + r}`);
  dotCount++;
}

// Segment tracks
console.log('\n=== Segment Track Right Edges ===');
const segRegex = /<rect x="(\d+)" y="32" width="(\d+)" height="6"/g;
while ((match = segRegex.exec(svgText)) !== null) {
  const x = parseFloat(match[1]) + tx;
  const w = parseFloat(match[2]);
  maxRight = Math.max(maxRight, x + w);
  console.log(`  track: x=${x}, right=${x + w}`);
}

console.log('\n=== Summary ===');
console.log(`Content left edge:  ${minLeft.toFixed(1)}px`);
console.log(`Content right edge: ${maxRight.toFixed(1)}px`);
console.log(`Content width:      ${(maxRight - minLeft).toFixed(1)}px`);
console.log(`Current SVG width:  ${widthMatch?.[1]}px`);
const svgWidth = parseFloat(widthMatch?.[1] || 560);
const overflow = maxRight - svgWidth;
if (overflow > 0) {
  console.log(`\n⚠️  OVERFLOW: content extends ${overflow.toFixed(1)}px past right edge`);
  console.log(`   Suggested width: ${Math.ceil(maxRight + 20)}px (+ 20px padding)`);
} else {
  console.log(`\n✓  Right margin: ${(svgWidth - maxRight).toFixed(1)}px`);
}

const idealWidth = maxRight - minLeft;
const currentOffset = tx;
const neededOffset = (svgWidth - idealWidth) / 2 - (minLeft - tx);
console.log(`\nFor perfect centering at width ${svgWidth}:`);
console.log(`  Current translate-x: ${tx}`);
console.log(`  Ideal translate-x:   ${neededOffset.toFixed(1)}`);
