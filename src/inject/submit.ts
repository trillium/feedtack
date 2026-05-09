import type { FeedtackPayload } from '../types/payload.js'
import { SCHEMA_VERSION } from '../types/payload.js'
import { getDeviceMeta, getPageMeta, getViewportMeta } from './capture.js'
import { sendPayload } from './egress.js'
import type { PanelController } from './panel.js'
import type { PinMarker } from './pin-marker.js'
import type { FeedtackInjectConfig } from './types.js'
import type { InjectUI } from './ui.js'

export function handleSubmit(
  ui: InjectUI,
  config: FeedtackInjectConfig,
  markers: PinMarker[],
  panel: PanelController,
): () => Promise<void> {
  return async () => {
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
      sentiment: panel.state.sentiment,
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
      panel.resetForm()
      panel.setPinMode(true)
      setTimeout(() => {
        ui.status.style.display = 'none'
      }, 1500)
    } catch (err) {
      ui.errorMsg.textContent = (err as Error).message
      ui.errorMsg.style.display = 'block'
    } finally {
      ui.submitBtn.disabled = false
    }
  }
}
