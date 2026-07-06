import {
  createElementHighlight,
  type HighlightController,
} from '../capture/highlight.js'
import { resolveTarget } from '../capture/target.js'
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

/** Apply theme custom properties.
 *
 * Sets the vars on BOTH `#feedtack-root` (legacy target) and
 * `document.documentElement` (`:root`). The documentElement write is
 * load-bearing for the modal: native `<dialog>` elements opened via
 * `showModal()` are promoted to the top-layer, escaping CSS-var
 * inheritance from `#feedtack-root`. Setting on `:root` ensures the
 * modal still picks up the theme (CSS custom properties cascade
 * independently of layout, including into the top-layer).
 */
export function applyTheme(theme: FeedtackTheme): void {
  const tokens = themeToCSS(theme)
  const root = document.getElementById('feedtack-root')
  for (const [k, v] of Object.entries(tokens)) {
    if (root) root.style.setProperty(k, v)
    document.documentElement.style.setProperty(k, v)
  }
}

let pickingHighlight: HighlightController | null = null

/** Toggle pin-mode visual affordances on <html>: crosshair cursor + hover
 *  element highlight (the canonical picker UX — see SPEC.md § UX Reference) */
export function setCrosshair(active: boolean): void {
  if (active) {
    document.documentElement.classList.add('feedtack-crosshair')
    if (!pickingHighlight) {
      pickingHighlight = createElementHighlight({
        isExcluded: (el) => el.closest(FEEDTACK_UI_SELECTOR) !== null,
        resolveTarget,
      })
    }
    pickingHighlight.attach()
  } else {
    document.documentElement.classList.remove('feedtack-crosshair')
    pickingHighlight?.detach()
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
