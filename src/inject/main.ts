import type {
  FeedtackPayload,
  FeedtackPin,
  FeedtackSentiment,
} from '../types/payload.js'
import { SCHEMA_VERSION } from '../types/payload.js'
import {
  getDeviceMeta,
  getPageMeta,
  getPinCoords,
  getTargetMeta,
  getViewportMeta,
} from './capture.js'
import { parseConfig } from './config.js'
import { sendPayload } from './egress.js'
import type { FeedtackInjectRawConfig } from './types.js'
import type { InjectUI } from './ui.js'
import { createInjectUI } from './ui.js'

declare global {
  interface Window {
    __feedtack?: FeedtackInjectRawConfig
    __feedtack_injected?: boolean
  }
}

/** Pin marker placed on the host page (outside Shadow DOM) */
interface PinMarker {
  el: HTMLDivElement
  pin: Omit<FeedtackPin, 'index'>
}

const PIN_COLOR = '#2563eb'

function createPinMarker(x: number, y: number, index: number): HTMLDivElement {
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

function removePinMarkers(markers: PinMarker[]): void {
  for (const m of markers) m.el.remove()
  markers.length = 0
}

function updatePinCount(ui: InjectUI, count: number): void {
  ui.pinCount.textContent =
    count === 0
      ? 'Click on elements to place pins, then submit.'
      : `${count} pin${count > 1 ? 's' : ''} placed. Click more or submit.`
}

;(function feedtackInject() {
  // Idempotency guard
  if (window.__feedtack_injected) {
    console.warn('[feedtack] Already injected — skipping.')
    return
  }
  window.__feedtack_injected = true

  const config = parseConfig(window.__feedtack)
  const ui = createInjectUI()
  const markers: PinMarker[] = []
  let pinMode = false
  let sentiment: FeedtackSentiment = null
  let panelOpen = false

  function setPinMode(active: boolean): void {
    pinMode = active
    ui.fab.classList.toggle('active', active)
    if (active) {
      document.documentElement.style.cursor = 'crosshair'
    } else {
      document.documentElement.style.cursor = ''
    }
  }

  function openPanel(): void {
    panelOpen = true
    ui.panel.classList.add('open')
    setPinMode(true)
  }

  function closePanel(): void {
    panelOpen = false
    ui.panel.classList.remove('open')
    setPinMode(false)
    removePinMarkers(markers)
    ui.textarea.value = ''
    sentiment = null
    ui.sentimentGood.classList.remove('selected')
    ui.sentimentBad.classList.remove('selected')
    ui.errorMsg.style.display = 'none'
    ui.status.style.display = 'none'
    updatePinCount(ui, 0)
  }

  // FAB toggle
  ui.fab.addEventListener('click', () => {
    if (panelOpen) closePanel()
    else openPanel()
  })

  ui.panel
    .querySelector('.ft-panel-close')
    ?.addEventListener('click', closePanel)

  // Sentiment
  ui.sentimentGood.addEventListener('click', () => {
    sentiment = sentiment === 'good' ? null : 'good'
    ui.sentimentGood.classList.toggle('selected', sentiment === 'good')
    ui.sentimentBad.classList.remove('selected')
  })
  ui.sentimentBad.addEventListener('click', () => {
    sentiment = sentiment === 'bad' ? null : 'bad'
    ui.sentimentBad.classList.toggle('selected', sentiment === 'bad')
    ui.sentimentGood.classList.remove('selected')
  })

  // Cancel
  ui.cancelBtn.addEventListener('click', closePanel)

  // Pin placement via click
  function handlePinClick(e: MouseEvent): void {
    if (!pinMode || !panelOpen) return
    const target = e.target as Element
    if (target.closest('#feedtack-inject')) return
    e.preventDefault()
    e.stopPropagation()
    placePin(e.clientX, e.clientY, target)
  }

  // Pin placement via touch
  function handlePinTouch(e: TouchEvent): void {
    if (!pinMode || !panelOpen) return
    const t = e.changedTouches[0]
    if (!t) return
    const el = document.elementFromPoint(t.clientX, t.clientY)
    if (!el || el.closest('#feedtack-inject')) return
    e.preventDefault()
    placePin(t.clientX, t.clientY, el)
  }

  function placePin(clientX: number, clientY: number, target: Element): void {
    const coords = getPinCoords({ clientX, clientY })
    const pin: Omit<FeedtackPin, 'index'> = {
      color: PIN_COLOR,
      ...coords,
      target: getTargetMeta(target),
    }
    const markerEl = createPinMarker(coords.x, coords.y, markers.length + 1)
    markers.push({ el: markerEl, pin })
    updatePinCount(ui, markers.length)
  }

  document.addEventListener('click', handlePinClick, true)
  document.addEventListener('touchend', handlePinTouch, true)

  // Escape to close
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panelOpen) closePanel()
  })

  // Submit
  ui.submitBtn.addEventListener('click', async () => {
    const comment = ui.textarea.value.trim()
    if (!comment) {
      ui.errorMsg.style.display = 'block'
      ui.textarea.classList.add('error')
      return
    }
    ui.errorMsg.style.display = 'none'
    ui.textarea.classList.remove('error')
    ui.submitBtn.disabled = true

    const payload: FeedtackPayload = {
      schemaVersion: SCHEMA_VERSION,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      scope: markers.length > 0 ? 'element' : 'page',
      submittedBy: config.user!,
      comment,
      sentiment,
      pins: markers.map((m, i) => ({ ...m.pin, index: i + 1 })),
      page: getPageMeta(),
      viewport: getViewportMeta(),
      device: getDeviceMeta(),
    }

    try {
      const mode = await sendPayload(payload, config)
      ui.status.textContent =
        mode === 'clipboard' ? 'Copied to clipboard!' : 'Sent to webhook!'
      ui.status.style.display = 'block'
      setTimeout(closePanel, 1500)
    } catch (err) {
      ui.errorMsg.textContent = (err as Error).message
      ui.errorMsg.style.display = 'block'
    } finally {
      ui.submitBtn.disabled = false
    }
  })

  // Clear error on input
  ui.textarea.addEventListener('input', () => {
    ui.errorMsg.style.display = 'none'
    ui.textarea.classList.remove('error')
  })

  console.log(
    `[feedtack] Injectable snippet loaded (v${config.version}, ${config.webhookUrl ? 'webhook' : 'clipboard'} mode)`,
  )
})()
