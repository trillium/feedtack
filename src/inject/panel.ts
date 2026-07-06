import { createElementHighlight } from '../capture/highlight.js'
import { resolveTarget } from '../capture/target.js'
import type { FeedtackSentiment } from '../types/payload.js'
import type { PinMarker } from './pin-marker.js'
import { removePinMarkers } from './pin-marker.js'
import type { InjectUI } from './ui.js'

function updatePinCount(ui: InjectUI, count: number): void {
  ui.pinCount.textContent =
    count === 0
      ? 'Click on an element to place a pin.'
      : 'Pin placed. Add your comment and submit.'
}

export interface PanelState {
  pinMode: boolean
  panelOpen: boolean
  sentiment: FeedtackSentiment
}

export interface PanelController {
  state: PanelState
  setPinMode: (active: boolean) => void
  resetForm: () => void
  openPanel: () => void
  closePanel: () => void
  setSentiment: (value: FeedtackSentiment) => void
}

export function createPanelController(
  ui: InjectUI,
  markers: PinMarker[],
): PanelController {
  const state: PanelState = {
    pinMode: false,
    panelOpen: false,
    sentiment: null,
  }

  const highlight = createElementHighlight({
    isExcluded: (el) => el.closest('#feedtack-inject') !== null,
    resolveTarget,
  })

  function setPinMode(active: boolean): void {
    state.pinMode = active
    ui.fab.classList.toggle('active', active)
    document.documentElement.style.cursor = active ? 'crosshair' : ''
    if (active) highlight.attach()
    else highlight.detach()
  }

  function resetForm(): void {
    removePinMarkers(markers)
    ui.textarea.value = ''
    state.sentiment = null
    ui.sentimentGood.classList.remove('selected')
    ui.sentimentBad.classList.remove('selected')
    ui.errorMsg.style.display = 'none'
    ui.status.style.display = 'none'
    updatePinCount(ui, 0)
  }

  function openPanel(): void {
    state.panelOpen = true
    ui.panel.classList.add('open')
    setPinMode(true)
  }

  function closePanel(): void {
    state.panelOpen = false
    ui.panel.classList.remove('open')
    setPinMode(false)
    resetForm()
  }

  function setSentiment(value: FeedtackSentiment): void {
    state.sentiment = value
    ui.sentimentGood.classList.toggle('selected', value === 'good')
    ui.sentimentBad.classList.toggle('selected', value === 'bad')
  }

  return { state, setPinMode, resetForm, openPanel, closePanel, setSentiment }
}
