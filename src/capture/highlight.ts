/**
 * Shared hover element-highlight overlay.
 *
 * Brings the Chrome extension picker's hover UX (src/extension/content.ts —
 * the canonical Feedtack element-targeting experience, see SPEC.md "UX
 * Reference") to the React and IIFE paths. Framework-free: plain DOM only,
 * safe to bundle into the inject snippet.
 */

export interface HighlightOptions {
  /** Return true for elements that must never be highlighted (feedtack's own UI) */
  isExcluded?: (el: Element) => boolean
  /** Map the hovered element to the element that will actually be captured */
  resolveTarget?: (el: Element) => Element
}

export interface HighlightController {
  attach: () => void
  detach: () => void
}

export const HIGHLIGHT_OVERLAY_ID = 'feedtack-highlight-overlay'

function createOverlay(): HTMLDivElement {
  const overlay = document.createElement('div')
  overlay.id = HIGHLIGHT_OVERLAY_ID
  overlay.style.cssText = [
    'position:fixed',
    'pointer-events:none',
    'z-index:2147483646',
    'outline:2px solid #2563eb',
    'background:rgba(37,99,235,0.08)',
    'border-radius:2px',
    'transition:top 0.05s,left 0.05s,width 0.05s,height 0.05s',
    'display:none',
  ].join(';')
  return overlay
}

/** Create a highlight controller. Touches the DOM only on attach() — SSR-safe. */
export function createElementHighlight(
  options: HighlightOptions = {},
): HighlightController {
  const { isExcluded, resolveTarget } = options
  let overlay: HTMLDivElement | null = null

  function onMouseover(e: MouseEvent): void {
    if (!overlay) return
    const hovered = e.target
    if (!(hovered instanceof Element)) return
    if (isExcluded?.(hovered)) {
      overlay.style.display = 'none'
      return
    }
    const el = resolveTarget ? resolveTarget(hovered) : hovered
    const r = el.getBoundingClientRect()
    overlay.style.display = 'block'
    overlay.style.top = `${r.top}px`
    overlay.style.left = `${r.left}px`
    overlay.style.width = `${r.width}px`
    overlay.style.height = `${r.height}px`
  }

  function attach(): void {
    if (overlay) return
    overlay = createOverlay()
    document.body.appendChild(overlay)
    document.addEventListener('mouseover', onMouseover, true)
  }

  function detach(): void {
    if (!overlay) return
    document.removeEventListener('mouseover', onMouseover, true)
    overlay.remove()
    overlay = null
  }

  return { attach, detach }
}
