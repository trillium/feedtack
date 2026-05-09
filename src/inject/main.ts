import type { FeedtackPin } from '../types/payload.js'
import { getPinCoords, getTargetMeta } from './capture.js'
import { parseConfig } from './config.js'
import { createPanelController } from './panel.js'
import type { PinMarker } from './pin-marker.js'
import { createPinMarker, PIN_COLOR, removePinMarkers } from './pin-marker.js'
import { handleSubmit } from './submit.js'
import type { FeedtackInjectRawConfig } from './types.js'
import { createInjectUI } from './ui.js'

declare global {
  interface Window {
    __feedtack?: FeedtackInjectRawConfig
    __feedtack_injected?: boolean
  }
}

;(function feedtackInject() {
  if (window.__feedtack_injected) {
    console.warn('[feedtack] Already injected — skipping.')
    return
  }
  window.__feedtack_injected = true

  const config = parseConfig(window.__feedtack)
  const ui = createInjectUI()
  const markers: PinMarker[] = []
  const panel = createPanelController(ui, markers)

  // FAB toggle
  ui.fab.addEventListener('click', () => {
    if (panel.state.panelOpen) panel.closePanel()
    else panel.openPanel()
  })

  ui.panel
    .querySelector('.ft-panel-close')
    ?.addEventListener('click', () => panel.closePanel())

  // Sentiment
  ui.sentimentGood.addEventListener('click', () => {
    const next = panel.state.sentiment === 'good' ? null : 'good'
    panel.setSentiment(next)
  })
  ui.sentimentBad.addEventListener('click', () => {
    const next = panel.state.sentiment === 'bad' ? null : 'bad'
    panel.setSentiment(next)
  })

  // Cancel
  ui.cancelBtn.addEventListener('click', () => panel.closePanel())

  // Pin placement
  function placePin(clientX: number, clientY: number, target: Element): void {
    removePinMarkers(markers)
    const coords = getPinCoords({ clientX, clientY })
    const pin: Omit<FeedtackPin, 'index'> = {
      color: PIN_COLOR,
      ...coords,
      target: getTargetMeta(target),
    }
    markers.push({ el: createPinMarker(coords.x, coords.y, 1), pin })
    ui.pinCount.textContent = 'Pin placed. Add your comment and submit.'
    panel.setPinMode(false)
    ui.textarea.focus()
  }

  document.addEventListener(
    'click',
    (e: MouseEvent) => {
      if (!panel.state.pinMode || !panel.state.panelOpen) return
      const target = e.target as Element
      if (target.closest('#feedtack-inject')) return
      e.preventDefault()
      e.stopPropagation()
      placePin(e.clientX, e.clientY, target)
    },
    true,
  )

  document.addEventListener(
    'touchend',
    (e: TouchEvent) => {
      if (!panel.state.pinMode || !panel.state.panelOpen) return
      const t = e.changedTouches[0]
      if (!t) return
      const el = document.elementFromPoint(t.clientX, t.clientY)
      if (!el || el.closest('#feedtack-inject')) return
      e.preventDefault()
      placePin(t.clientX, t.clientY, el)
    },
    true,
  )

  // Escape to close
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.state.panelOpen) panel.closePanel()
  })

  // Submit
  ui.submitBtn.addEventListener(
    'click',
    handleSubmit(ui, config, markers, panel),
  )

  // Clear error on input
  ui.textarea.addEventListener('input', () => {
    ui.errorMsg.style.display = 'none'
    ui.textarea.classList.remove('error')
  })

  console.log(
    `[feedtack] Injectable snippet loaded (v${config.version}, ${config.webhookUrl ? 'webhook' : 'clipboard'} mode)`,
  )
})()
