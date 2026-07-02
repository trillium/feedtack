/**
 * Assembles dist/extension/ into a loadable Chrome extension.
 * Run after `tsup` — copies feedtack.inject.js, manifest.json,
 * popup.html, and rasterizes the SVG logo into PNG icons.
 *
 * Usage: bun run scripts/build-extension.ts
 */

import { spawnSync } from 'node:child_process'
import { copyFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const out = join(root, 'dist/extension')
const svgSrc = join(root, 'site-docs/src/app/icon.svg')

mkdirSync(join(out, 'icons'), { recursive: true })

// feedtack.inject.js — the widget the content script loads into the page
copyFileSync(
  join(root, 'dist/feedtack.inject.js'),
  join(out, 'feedtack.inject.js'),
)

// manifest + popup HTML
copyFileSync(
  join(root, 'src/extension/manifest.json'),
  join(out, 'manifest.json'),
)
copyFileSync(join(root, 'src/extension/popup.html'), join(out, 'popup.html'))
copyFileSync(join(root, 'src/extension/panel.html'), join(out, 'panel.html'))

// Rasterize SVG logo into PNG icons via rsvg-convert
for (const size of [16, 48, 128]) {
  const dest = join(out, `icons/${size}.png`)
  const result = spawnSync(
    'rsvg-convert',
    [
      svgSrc,
      '--width',
      String(size),
      '--height',
      String(size),
      '--output',
      dest,
    ],
    { stdio: 'inherit' },
  )
  if (result.status !== 0) {
    console.error(`[build-extension] rsvg-convert failed for ${size}px`)
    process.exit(1)
  }
}

console.log('[build-extension] dist/extension/ assembled:')
console.log('  manifest.json, content.js, popup.html, popup.js')
console.log('  feedtack.inject.js, icons/16.png, icons/48.png, icons/128.png')
console.log(
  '[build-extension] Load dist/extension/ in chrome://extensions to install.',
)
