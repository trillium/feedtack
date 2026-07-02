/**
 * ping-reload — signal the tack-server to reload all connected extension SWs.
 * Run by tsup's onSuccess hook after every successful build.
 *
 * Usage: bun run scripts/ping-reload.ts [--port 2727]
 */

const args = process.argv.slice(2)
const portFlag = args.indexOf('--port')
const PORT = portFlag !== -1 ? parseInt(args[portFlag + 1], 10) : 2727

const ws = new WebSocket(`ws://localhost:${PORT}/reload`)

ws.onopen = () => {
  ws.send('reload')
  ws.close()
}

ws.onerror = () => {
  // tack-server not running — skip silently, reload is best-effort
  process.exit(0)
}
