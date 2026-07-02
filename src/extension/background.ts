/**
 * Feedtack background service worker.
 *
 * Production: opens the side panel when the toolbar icon is clicked.
 * Dev: also connects to tack-server WS for hot-reload.
 */

// Open side panel on icon click
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId })
})

// Inject FAB into page world via chrome.scripting — bypasses page CSP
chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type !== 'injectFab') return
  const tabId = sender.tab?.id
  if (!tabId) return

  const { config } = message
  const user = {
    id: config.userId ?? crypto.randomUUID(),
    name: config.userName ?? 'Anonymous',
    role: 'reviewer',
    ...(config.userEmail ? { email: config.userEmail } : {}),
  }
  const feedtackConfig = { webhookUrl: config.webhookUrl ?? undefined, user }

  // Step 1: set window.__feedtack in the page's main world
  chrome.scripting
    .executeScript({
      target: { tabId },
      world: 'MAIN',
      func: (cfg: typeof feedtackConfig) => {
        if (
          (window as Window & { __feedtack_injected?: boolean })
            .__feedtack_injected
        )
          return
        ;(window as Window & { __feedtack?: typeof cfg }).__feedtack = cfg
      },
      args: [feedtackConfig],
    })
    .then(() =>
      // Step 2: inject feedtack.inject.js in the page's main world
      chrome.scripting.executeScript({
        target: { tabId },
        world: 'MAIN',
        files: ['feedtack.inject.js'],
      }),
    )
    .then(() => {
      // Mark injected so we don't double-inject
      chrome.scripting.executeScript({
        target: { tabId },
        world: 'MAIN',
        func: () => {
          ;(
            window as Window & { __feedtack_injected?: boolean }
          ).__feedtack_injected = true
        },
      })
    })
    .catch(() => {})
})

// Dev hot-reload — connect to tack-server WS, reload on signal
const PORT = 2727

function connect() {
  const ws = new WebSocket(`ws://localhost:${PORT}/reload`)
  ws.onmessage = (event) => {
    if (event.data === 'reload') {
      console.log('[feedtack-dev] reloading extension...')
      chrome.runtime.reload()
    }
  }
  ws.onclose = () => setTimeout(connect, 2000)
}

connect()
