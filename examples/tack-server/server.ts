/**
 * tack-server — dev server for Feedtack payloads
 *
 * Accepts POST /tack, finds the nearest .git ancestor from CWD,
 * and writes each payload to {gitRoot}/.feedtack/{id}.json.
 *
 * Usage:
 *   bun run examples/tack-server/server.ts
 *   bun run examples/tack-server/server.ts --port 3333
 *
 * Then configure Feedtack:
 *   window.__feedtack = { webhookUrl: 'http://localhost:2727/tack' }
 */

import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { DiskAdapter } from '../../src/node/index.js'
import type { FeedtackPayload } from '../../src/types/payload.js'

// --- Config ---

const args = process.argv.slice(2)
const portFlag = args.indexOf('--port')
const PORT = portFlag !== -1 ? parseInt(args[portFlag + 1], 10) : 2727

// --- Git root resolution ---

function findGitRoot(startDir: string): string | null {
  let dir = startDir
  while (true) {
    if (existsSync(join(dir, '.git'))) return dir
    const parent = dirname(dir)
    if (parent === dir) return null
    dir = parent
  }
}

const gitRoot = findGitRoot(process.cwd())

if (!gitRoot) {
  console.error(`[tack-server] No .git directory found from: ${process.cwd()}`)
  console.error('[tack-server] Run from inside a git repository.')
  process.exit(1)
}

const tackDir = join(gitRoot, '.feedtack')
const adapter = new DiskAdapter({ directory: tackDir })

console.log(`[tack-server] Git root : ${gitRoot}`)
console.log(`[tack-server] Tacks    → ${tackDir}`)
console.log(`[tack-server] Endpoint : http://localhost:${PORT}/tack`)
console.log()

// --- CORS headers ---

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

// --- Server ---

Bun.serve({
  port: PORT,

  async fetch(req) {
    const url = new URL(req.url)

    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS })
    }

    // POST /tack — receive and persist a payload
    if (req.method === 'POST' && url.pathname === '/tack') {
      let payload: FeedtackPayload
      try {
        payload = (await req.json()) as FeedtackPayload
      } catch {
        return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...CORS },
        })
      }

      await adapter.submit(payload)

      const pin = payload.pins[0]
      const target = pin
        ? ` pin=${pin.target.dataTestId ?? pin.target.selector}`
        : ''
      console.log(`[tack] ${payload.id}  ${payload.page.pathname}${target}`)

      return new Response(JSON.stringify({ ok: true, id: payload.id }), {
        status: 201,
        headers: { 'Content-Type': 'application/json', ...CORS },
      })
    }

    // GET /tacks — list all stored tacks
    if (req.method === 'GET' && url.pathname === '/tacks') {
      const items = await adapter.loadFeedback()
      return new Response(JSON.stringify(items, null, 2), {
        headers: { 'Content-Type': 'application/json', ...CORS },
      })
    }

    return new Response('Not found', { status: 404, headers: CORS })
  },
})
