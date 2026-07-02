/**
 * Feedtack content script — runs in the isolated world.
 *
 * Responsibilities:
 *  1. Inject FAB widget (feedtack.inject.js) when fabEnabled is true
 *  2. Activate element picker on demand from the side panel
 *  3. Respond to setFab messages to toggle the FAB at runtime
 */

interface FeedtackStoredConfig {
  webhookUrl?: string
  userName?: string
  userEmail?: string
  userId?: string
  fabEnabled?: boolean
}

// --- FAB injection ---
// Delegated to background SW via chrome.scripting to bypass page CSP.

chrome.storage.sync.get(
  ['webhookUrl', 'userName', 'userEmail', 'userId', 'fabEnabled'],
  (data: FeedtackStoredConfig) => {
    if (data.fabEnabled === true) {
      chrome.runtime.sendMessage({ type: 'injectFab', config: data })
    }
  },
)

// --- Element picker ---

type PickerCleanup = () => void
let cleanup: PickerCleanup | null = null

function activatePicker(sendResponse: (data: unknown) => void) {
  // Highlight overlay
  const overlay = document.createElement('div')
  overlay.style.cssText = [
    'position:fixed',
    'pointer-events:none',
    'z-index:2147483646',
    'outline:2px solid #2563eb',
    'background:rgba(37,99,235,0.08)',
    'border-radius:2px',
    'transition:top 0.05s,left 0.05s,width 0.05s,height 0.05s',
  ].join(';')
  document.body.appendChild(overlay)
  document.body.style.cursor = 'crosshair'

  function onMouseover(e: MouseEvent) {
    const el = e.target as HTMLElement
    const r = el.getBoundingClientRect()
    overlay.style.top = `${r.top}px`
    overlay.style.left = `${r.left}px`
    overlay.style.width = `${r.width}px`
    overlay.style.height = `${r.height}px`
  }

  function onClick(e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    const el = e.target as HTMLElement
    cleanup?.()
    sendResponse(captureElement(el))
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      cleanup?.()
      sendResponse(null)
    }
  }

  document.addEventListener('mouseover', onMouseover, true)
  document.addEventListener('click', onClick, true)
  document.addEventListener('keydown', onKeydown, true)

  cleanup = () => {
    document.removeEventListener('mouseover', onMouseover, true)
    document.removeEventListener('click', onClick, true)
    document.removeEventListener('keydown', onKeydown, true)
    overlay.remove()
    document.body.style.cursor = ''
    cleanup = null
  }
}

function captureElement(el: HTMLElement) {
  return {
    selector: getSelector(el),
    dataTestId: el.dataset.testid ?? null,
    tagName: el.tagName.toLowerCase(),
    textContent: el.textContent?.trim().slice(0, 120) ?? '',
    rect: el.getBoundingClientRect().toJSON(),
    ancestors: getAncestors(el),
    pageUrl: location.href,
    pagePathname: location.pathname,
    pageTitle: document.title,
    scrollX: window.scrollX,
    scrollY: window.scrollY,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
  }
}

function getSelector(el: HTMLElement): string {
  if (el.id) return `#${CSS.escape(el.id)}`
  if (el.dataset.testid) return `[data-testid="${el.dataset.testid}"]`

  const parts: string[] = []
  let cur: HTMLElement | null = el
  while (cur && cur !== document.body && parts.length < 5) {
    let part = cur.tagName.toLowerCase()
    if (cur.id) {
      parts.unshift(`#${CSS.escape(cur.id)}`)
      break
    }
    const siblings = cur.parentElement?.children
    if (siblings && siblings.length > 1) {
      const idx = Array.from(siblings).indexOf(cur) + 1
      part += `:nth-child(${idx})`
    }
    parts.unshift(part)
    cur = cur.parentElement
  }
  return parts.join(' > ')
}

function getAncestors(el: HTMLElement) {
  const ancestors = []
  let cur: HTMLElement | null = el.parentElement
  for (let i = 0; i < 5 && cur && cur !== document.body; i++) {
    ancestors.push({
      tag: cur.tagName.toLowerCase(),
      id: cur.id || null,
      ariaLabel: cur.getAttribute('aria-label'),
      role: cur.getAttribute('role'),
      type: cur.getAttribute('type'),
      name: cur.getAttribute('name'),
      title: cur.getAttribute('title'),
      alt: cur.getAttribute('alt'),
      dataTestId: cur.dataset.testid ?? null,
      dataFeedtackComponent: cur.dataset.feedtackComponent ?? null,
      nthChild: null,
      nthOfType: null,
      componentName: null,
      classes: Array.from(cur.classList),
      textContent: cur.textContent?.trim().slice(0, 120) ?? null,
      placeholder: cur.getAttribute('placeholder'),
    })
    cur = cur.parentElement
  }
  return ancestors
}

// --- Message listener ---

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'startPicker') {
    activatePicker(sendResponse)
    return true // keep channel open for async response
  }

  if (message.type === 'stopPicker') {
    cleanup?.()
    return false
  }

  if (message.type === 'setFab') {
    if (message.enabled) {
      chrome.storage.sync.get(
        ['webhookUrl', 'userName', 'userEmail', 'userId'],
        (data) =>
          chrome.runtime.sendMessage({ type: 'injectFab', config: data }),
      )
    }
    // FAB cannot be uninjected without a full page reload — that's fine
    return false
  }

  return false
})
