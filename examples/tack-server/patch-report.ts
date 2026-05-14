/**
 * patch-report — inject Feedtack into a Playwright HTML report
 *
 * Reads the generated index.html, inlines feedtack.inject.js, and
 * adds the window.__feedtack config so pins are POSTed to tack-server.
 *
 * Usage:
 *   bun run patch-report <report-dir> [--port 2727]
 *
 * Example:
 *   bun run patch-report ./tests/visual/__report__
 *   bun run patch-report ./tests/visual/__report__ --port 3333
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// --- Args ---

const args = process.argv.slice(2)
const reportDir = args[0]

if (!reportDir) {
  console.error('Usage: bun run patch-report <report-dir> [--port 2727]')
  process.exit(1)
}

const portFlag = args.indexOf('--port')
const port = portFlag !== -1 ? parseInt(args[portFlag + 1], 10) : 2727

const reportPath = resolve(reportDir)
const indexPath = join(reportPath, 'index.html')

// --- Load files ---

let html: string
try {
  html = readFileSync(indexPath, 'utf-8')
} catch {
  console.error(`[patch-report] Could not read: ${indexPath}`)
  process.exit(1)
}

if (html.includes('__feedtack_injected')) {
  console.log('[patch-report] Already patched — skipping.')
  process.exit(0)
}

const injectScriptPath = join(__dirname, '../../dist/feedtack.inject.js')
let injectScript: string
try {
  injectScript = readFileSync(injectScriptPath, 'utf-8')
} catch {
  console.error(
    `[patch-report] Could not read feedtack.inject.js at: ${injectScriptPath}`,
  )
  console.error('[patch-report] Run `pnpm build` in the feedtack root first.')
  process.exit(1)
}

// --- Inject ---

const injection = `
<script>
  window.__feedtack = {
    webhookUrl: 'http://localhost:${port}/tack',
    user: { id: 'playwright', name: 'Playwright', role: 'dev' }
  };
</script>
<script>
${injectScript}
</script>`

const patched = html.replace('</body>', `${injection}\n</body>`)

if (patched === html) {
  console.error('[patch-report] Could not find </body> tag in report HTML.')
  process.exit(1)
}

writeFileSync(indexPath, patched, 'utf-8')

console.log(`[patch-report] Patched: ${indexPath}`)
console.log(`[patch-report] Feedtack → http://localhost:${port}/tack`)
