import type { FeedtackPayload } from '../types/payload.js'
import type { FeedtackInjectConfig } from './types.js'

/** Send payload via clipboard (default) or webhook (sendBeacon) */
export async function sendPayload(
  payload: FeedtackPayload,
  config: FeedtackInjectConfig,
): Promise<'clipboard' | 'webhook'> {
  const json = JSON.stringify(payload, null, 2)

  if (config.webhookUrl) {
    const blob = new Blob([json], { type: 'application/json' })
    const sent = navigator.sendBeacon(config.webhookUrl, blob)
    if (!sent) {
      throw new Error('[feedtack] sendBeacon failed — payload may be too large')
    }
    return 'webhook'
  }

  await navigator.clipboard.writeText(json)
  return 'clipboard'
}
