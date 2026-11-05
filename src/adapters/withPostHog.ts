import type { FeedtackAdapter } from '../types/adapter.js'
import type { FeedtackPayload } from '../types/payload.js'
import {
  buildPostHogPayload,
  generateUUID,
  type PostHogCaptureBody,
  type PostHogEventProperties,
  type PostHogOptions,
  type PostHogPinPayload,
} from './posthogPayload.js'

export type {
  PostHogCaptureBody,
  PostHogEventProperties,
  PostHogOptions,
  PostHogPinPayload,
}
export { buildPostHogPayload, generateUUID }

const POSTHOG_TIMEOUT_MS = 5000

async function sendPostHogEvent(
  payload: FeedtackPayload,
  options: PostHogOptions,
): Promise<void> {
  const { body } = buildPostHogPayload(payload, options.apiKey)
  const host = options.host ?? 'https://us.i.posthog.com'
  const fetchFn = options.fetch ?? fetch
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), POSTHOG_TIMEOUT_MS)
  try {
    const res = await fetchFn(`${host.replace(/\/+$/, '')}/capture/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    if (!res.ok) {
      throw new Error(`PostHog capture HTTP error: ${res.status}`)
    }
  } finally {
    clearTimeout(timer)
  }
}

/**
 * Wraps a FeedtackAdapter to mirror submissions to the PostHog capture endpoint.
 *
 * Privacy-safe: sends only allowlisted metadata (feedtack_id, scope, sentiment,
 * pathname, schema_version, breakpoint, pins[selector, component_name, data_testid, element_path]).
 * Leaves out comment text, ancestor textContent, email and screenshots by default.
 *
 * The event is sent after the underlying submit succeeds, without being awaited,
 * with a timeout, so PostHog failures or hangs never block or fail the submit.
 */
export function withPostHog<T extends FeedtackAdapter>(
  adapter: T,
  options: PostHogOptions,
): T {
  const wrappedSubmit = async (payload: FeedtackPayload): Promise<void> => {
    await adapter.submit(payload)
    sendPostHogEvent(payload, options).catch(() => {})
  }

  return new Proxy(adapter, {
    get(target, prop, receiver) {
      if (prop === 'submit') {
        return wrappedSubmit
      }
      const val = Reflect.get(target, prop, receiver)
      return typeof val === 'function' ? val.bind(target) : val
    },
  })
}
