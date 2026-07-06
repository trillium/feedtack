import { afterEach, describe, expect, it } from 'vitest'
import { createElementHighlight, HIGHLIGHT_OVERLAY_ID } from './highlight.js'

function getOverlay(): HTMLElement {
  const el = document.getElementById(HIGHLIGHT_OVERLAY_ID)
  if (!el) throw new Error('highlight overlay not found in DOM')
  return el
}

function hover(el: Element): void {
  el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
}

describe('createElementHighlight', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    document.getElementById(HIGHLIGHT_OVERLAY_ID)?.remove()
  })

  it('attach() appends a pointer-events:none overlay, hidden until hover', () => {
    const highlight = createElementHighlight()
    highlight.attach()
    const overlay = getOverlay()
    expect(overlay.style.pointerEvents).toBe('none')
    expect(overlay.style.display).toBe('none')
    highlight.detach()
  })

  it('attach() is idempotent — a second call creates no duplicate overlay', () => {
    const highlight = createElementHighlight()
    highlight.attach()
    highlight.attach()
    const overlays = document.querySelectorAll(`#${HIGHLIGHT_OVERLAY_ID}`)
    expect(overlays.length).toBe(1)
    highlight.detach()
  })

  it('shows and positions the overlay over the hovered element', () => {
    document.body.innerHTML = '<div id="target">hello</div>'
    const target = document.getElementById('target')
    if (!target) throw new Error('target missing')
    const highlight = createElementHighlight()
    highlight.attach()
    hover(target)
    const overlay = getOverlay()
    expect(overlay.style.display).toBe('block')
    expect(overlay.style.top).toBe('0px')
    expect(overlay.style.left).toBe('0px')
    highlight.detach()
  })

  it('hides the overlay when hovering an excluded element', () => {
    document.body.innerHTML =
      '<div id="target">hello</div><div id="feedtack-ui"><button type="button">ui</button></div>'
    const target = document.getElementById('target')
    const uiButton = document.querySelector('#feedtack-ui button')
    if (!target || !uiButton) throw new Error('fixture missing')
    const highlight = createElementHighlight({
      isExcluded: (el) => el.closest('#feedtack-ui') !== null,
    })
    highlight.attach()
    hover(target)
    expect(getOverlay().style.display).toBe('block')
    hover(uiButton)
    expect(getOverlay().style.display).toBe('none')
    highlight.detach()
  })

  it('highlights the resolved capture target, not the raw hovered element', () => {
    document.body.innerHTML =
      '<button type="button" id="btn"><span id="inner">x</span></button>'
    const inner = document.getElementById('inner')
    const btn = document.getElementById('btn')
    if (!inner || !btn) throw new Error('fixture missing')
    let resolvedFrom: Element | null = null
    const highlight = createElementHighlight({
      resolveTarget: (el) => {
        resolvedFrom = el
        return btn
      },
    })
    highlight.attach()
    hover(inner)
    expect(resolvedFrom).toBe(inner)
    expect(getOverlay().style.display).toBe('block')
    highlight.detach()
  })

  it('detach() removes the overlay and stops listening', () => {
    document.body.innerHTML = '<div id="target">hello</div>'
    const target = document.getElementById('target')
    if (!target) throw new Error('target missing')
    const highlight = createElementHighlight()
    highlight.attach()
    highlight.detach()
    expect(document.getElementById(HIGHLIGHT_OVERLAY_ID)).toBeNull()
    hover(target)
    expect(document.getElementById(HIGHLIGHT_OVERLAY_ID)).toBeNull()
  })
})
