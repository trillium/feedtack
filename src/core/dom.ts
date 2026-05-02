import type { FeedtackTheme } from '../types/theme.js'
import { themeToCSS } from '../types/theme.js'
import { FEEDTACK_DEFAULT_TOKENS, FEEDTACK_STYLES } from '../ui/styles.js'

/** Inject feedtack styles into <head>, returns the <style> element */
export function injectStyles(): HTMLStyleElement | null {
  if (document.getElementById('feedtack-styles')) return null
  const style = document.createElement('style')
  style.id = 'feedtack-styles'
  style.textContent = FEEDTACK_DEFAULT_TOKENS + FEEDTACK_STYLES
  document.head.appendChild(style)
  return style
}

/** Inject feedtack root container into <body> */
export function injectRoot(): HTMLDivElement {
  const root = document.createElement('div')
  root.id = 'feedtack-root'
  document.body.appendChild(root)
  return root
}

/** Apply theme custom properties to the feedtack root */
export function applyTheme(theme: FeedtackTheme): void {
  const root = document.getElementById('feedtack-root')
  if (!root) return
  const tokens = themeToCSS(theme)
  for (const [k, v] of Object.entries(tokens)) {
    root.style.setProperty(k, v)
  }
}

/** Toggle crosshair cursor class on <html> */
export function setCrosshair(active: boolean): void {
  if (active) {
    document.documentElement.classList.add('feedtack-crosshair')
  } else {
    document.documentElement.classList.remove('feedtack-crosshair')
  }
}

export interface SpaNavigationHandles {
  origPush: typeof history.pushState
  origReplace: typeof history.replaceState
  detach: () => void
}

/** Monkey-patch pushState/replaceState and listen for popstate */
export function attachSpaNavigation(
  onUpdate: () => void,
): SpaNavigationHandles {
  const origPush = history.pushState.bind(history)
  const origReplace = history.replaceState.bind(history)

  history.pushState = (...args: Parameters<typeof history.pushState>) => {
    origPush(...args)
    queueMicrotask(onUpdate)
  }
  history.replaceState = (...args: Parameters<typeof history.replaceState>) => {
    origReplace(...args)
    queueMicrotask(onUpdate)
  }

  window.addEventListener('popstate', onUpdate)

  return {
    origPush,
    origReplace,
    detach() {
      window.removeEventListener('popstate', onUpdate)
      history.pushState = origPush
      history.replaceState = origReplace
    },
  }
}

export const FEEDTACK_UI_SELECTOR =
  '#feedtack-root, .feedtack-form, .feedtack-color-picker'
