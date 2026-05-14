/**
 * Feedtack content script — runs in the isolated world.
 *
 * Reads config from chrome.storage.sync, then injects two script tags
 * into the page's main world (where window.__feedtack and feedtack.inject.js
 * must both live). Order matters: config first, inject second.
 */

interface FeedtackStoredConfig {
  webhookUrl?: string
  userName?: string
  userEmail?: string
  userId?: string
  enabled?: boolean
}

chrome.storage.sync.get(
  ['webhookUrl', 'userName', 'userEmail', 'userId', 'enabled'],
  (data: FeedtackStoredConfig) => {
    // Default to enabled if never set
    if (data.enabled === false) return

    const user = {
      id: data.userId ?? crypto.randomUUID(),
      name: data.userName ?? 'Anonymous',
      role: 'reviewer',
      ...(data.userEmail ? { email: data.userEmail } : {}),
    }

    // Step 1 — set window.__feedtack in the page world via inline script
    const configScript = document.createElement('script')
    configScript.textContent = `window.__feedtack = ${JSON.stringify({
      webhookUrl: data.webhookUrl ?? undefined,
      user,
    })};`
    document.documentElement.appendChild(configScript)
    configScript.remove()

    // Step 2 — load feedtack.inject.js in the page world
    const injectScript = document.createElement('script')
    injectScript.src = chrome.runtime.getURL('feedtack.inject.js')
    injectScript.onload = () => injectScript.remove()
    document.documentElement.appendChild(injectScript)
  },
)
