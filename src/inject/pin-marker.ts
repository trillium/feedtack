import type { FeedtackPin } from '../types/payload.js'

const PIN_COLOR = '#2563eb'

export { PIN_COLOR }

/** Pin marker placed on the host page (outside Shadow DOM) */
export interface PinMarker {
  el: HTMLDivElement
  pin: Omit<FeedtackPin, 'index'>
}

export function createPinMarker(
  x: number,
  y: number,
  index: number,
): HTMLDivElement {
  const el = document.createElement('div')
  el.style.cssText = [
    'position:absolute',
    `left:${x}px`,
    `top:${y}px`,
    'z-index:2147483641',
    'width:24px',
    'height:24px',
    'border-radius:50% 50% 50% 0',
    'transform:translate(-50%,-100%) rotate(-45deg)',
    `background:${PIN_COLOR}`,
    'border:2px solid rgba(255,255,255,0.8)',
    'box-shadow:0 2px 6px rgba(0,0,0,0.3)',
    'pointer-events:none',
  ].join(';')
  const icon = document.createElement('span')
  icon.style.cssText = [
    'position:absolute',
    'inset:0',
    'display:flex',
    'align-items:center',
    'justify-content:center',
    'transform:rotate(45deg)',
    'font-size:12px',
    'font-weight:700',
    'color:#fff',
    'line-height:1',
  ].join(';')
  icon.textContent = String(index)
  el.appendChild(icon)
  document.body.appendChild(el)
  return el
}

export function removePinMarkers(markers: PinMarker[]): void {
  for (const m of markers) m.el.remove()
  markers.length = 0
}
