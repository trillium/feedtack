/**
 * Assembles dist/extension/ into a loadable Chrome extension.
 * Run after `tsup` — copies feedtack.inject.js, manifest.json,
 * popup.html, and generates placeholder icons.
 *
 * Usage: bun run scripts/build-extension.ts
 */

import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const out = join(root, 'dist/extension')

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

// Generate minimal placeholder PNG icons (solid #3b82f6 blue)
// Replace with real assets before publishing to the Chrome Web Store.
function minimalPNG(size: number): Buffer {
  // Minimal valid PNG: IHDR + IDAT (single solid-color pixel scaled via CSS) + IEND
  // We generate a proper flat-color PNG using raw bytes.
  const width = size
  const height = size
  const r = 0x3b,
    g = 0x82,
    b = 0xf6 // Feedtack blue

  // Build raw image data: each row is filter-byte(0) + RGBA pixels
  const rowSize = 1 + width * 4
  const raw = Buffer.alloc(height * rowSize)
  for (let y = 0; y < height; y++) {
    const rowStart = y * rowSize
    raw[rowStart] = 0 // filter type: None
    for (let x = 0; x < width; x++) {
      const offset = rowStart + 1 + x * 4
      raw[offset] = r
      raw[offset + 1] = g
      raw[offset + 2] = b
      raw[offset + 3] = 255
    }
  }

  // zlib compress raw data (deflate)
  const { deflateSync } = require('node:zlib')
  const compressed = deflateSync(raw)

  function crc32(buf: Buffer): number {
    const table = Array.from({ length: 256 }, (_, i) => {
      let c = i
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
      return c >>> 0
    })
    let crc = 0xffffffff
    for (const byte of buf)
      crc = (table[(crc ^ byte) & 0xff] ^ (crc >>> 8)) >>> 0
    return (crc ^ 0xffffffff) >>> 0
  }

  function chunk(type: string, data: Buffer): Buffer {
    const typeBuf = Buffer.from(type, 'ascii')
    const len = Buffer.alloc(4)
    len.writeUInt32BE(data.length)
    const crcInput = Buffer.concat([typeBuf, data])
    const crcBuf = Buffer.alloc(4)
    crcBuf.writeUInt32BE(crc32(crcInput))
    return Buffer.concat([len, typeBuf, data, crcBuf])
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  const ihdrData = Buffer.alloc(13)
  ihdrData.writeUInt32BE(width, 0)
  ihdrData.writeUInt32BE(height, 4)
  ihdrData[8] = 8 // bit depth
  ihdrData[9] = 2 // color type: RGB (we'll use RGBA via 6=RGBA)
  ihdrData[9] = 6 // color type: RGBA
  ihdrData[10] = 0 // compression
  ihdrData[11] = 0 // filter
  ihdrData[12] = 0 // interlace

  const png = Buffer.concat([
    signature,
    chunk('IHDR', ihdrData),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0)),
  ])

  return png
}

for (const size of [16, 48, 128]) {
  writeFileSync(join(out, `icons/${size}.png`), minimalPNG(size))
}

console.log('[build-extension] dist/extension/ assembled:')
console.log('  manifest.json, content.js, popup.html, popup.js')
console.log('  feedtack.inject.js, icons/16.png, icons/48.png, icons/128.png')
console.log(
  '[build-extension] Load dist/extension/ in chrome://extensions to install.',
)
