/**
 * playwright-reporter — Playwright reporter that injects Feedtack into the HTML report
 *
 * Add as a second reporter entry in playwright.config.ts AFTER the html reporter:
 *
 *   reporter: [
 *     ['html', { outputFolder: 'tests/visual/__report__' }],
 *     ['../../feedtack/examples/tack-server/playwright-reporter.ts', {
 *       outputFolder: 'tests/visual/__report__',
 *       // webhookUrl: 'https://my-server.com/tack'  // optional override
 *     }]
 *   ]
 *
 * Webhook URL resolution (first match wins):
 *   1. options.webhookUrl
 *   2. FEEDTACK_URL env var
 *   3. http://localhost:2727/tack  (tack-server default)
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { FullResult, Reporter } from '@playwright/test/reporter'

const __dirname = dirname(fileURLToPath(import.meta.url))

const DEFAULT_WEBHOOK = 'http://localhost:2727/tack'

interface FeedtackReporterOptions {
  /** Directory where the HTML reporter wrote its output. Must match html reporter's outputFolder. */
  outputFolder: string
  /** Webhook URL for Feedtack to POST tacks to. Overrides FEEDTACK_URL env var. */
  webhookUrl?: string
}

class FeedtackReporter implements Reporter {
  private outputFolder: string
  private webhookUrl: string

  constructor(options: FeedtackReporterOptions) {
    this.outputFolder = options.outputFolder
    this.webhookUrl =
      options.webhookUrl ?? process.env.FEEDTACK_URL ?? DEFAULT_WEBHOOK
  }

  onEnd(_result: FullResult): void {
    const indexPath = resolve(join(this.outputFolder, 'index.html'))

    if (!existsSync(indexPath)) {
      console.warn(`[feedtack-reporter] Report not found at: ${indexPath}`)
      console.warn(
        '[feedtack-reporter] Ensure the html reporter runs before this one.',
      )
      return
    }

    const html = readFileSync(indexPath, 'utf-8')

    if (html.includes('__feedtack_injected')) {
      console.log('[feedtack-reporter] Already injected — skipping.')
      return
    }

    const injectScriptPath = join(__dirname, '../../dist/feedtack.inject.js')
    if (!existsSync(injectScriptPath)) {
      console.warn(
        '[feedtack-reporter] feedtack.inject.js not found at:',
        injectScriptPath,
      )
      console.warn(
        '[feedtack-reporter] Run `pnpm build` in the feedtack root first.',
      )
      return
    }

    const injectScript = readFileSync(injectScriptPath, 'utf-8')

    const injection = `
<script>
  window.__feedtack = {
    webhookUrl: '${this.webhookUrl}',
    user: { id: 'playwright', name: 'Playwright', role: 'dev' }
  };
</script>
<script>
${injectScript}
</script>`

    const patched = html.replace('</body>', `${injection}\n</body>`)

    if (patched === html) {
      console.warn(
        '[feedtack-reporter] Could not find </body> in report HTML — injection skipped.',
      )
      return
    }

    writeFileSync(indexPath, patched, 'utf-8')
    console.log(`[feedtack-reporter] Injected Feedtack → ${this.webhookUrl}`)
  }
}

export default FeedtackReporter
