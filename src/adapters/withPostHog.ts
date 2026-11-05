import type { FeedtackAdapter } from '../types/adapter.js'
import type { FeedtackPayload } from '../types/payload.js'
import {
  buildPostHogPayload,
  generateUUID,
  type PostHogCaptureBody,
  type PostHogClient,
  type PostHogEventProperties,
  type PostHogOptions,
  type PostHogPinPayload,
} from './posthogPayload.js'

export type {
  PostHogCaptureBody,
  PostHogClient,
  PostHogEventProperties,
  PostHogOptions,
  PostHogPinPayload,
}
export { buildPostHogPayload, generateUUID }

async function sendPostHogEvent(
  payload: FeedtackPayload,
  options: PostHogOptions,
): Promise<void> {
  const client =
    options.client ??
    options.posthog ??
    (typeof (options as unknown as PostHogClient)?.capture === 'function'
      ? (options as unknown as PostHogClient)
      : undefined) ??
    (typeof window !== 'undefined' &&
    typeof (window as unknown as { posthog?: PostHogClient }).posthog
      ?.capture === 'function'
      ? (window as unknown as { posthog: PostHogClient }).posthog
      : undefined)

  const apiKey =
    options.apiKey ??
    (typeof process !== 'undefined'
      ? process.env?.POSTHOG_API_KEY ||
        process.env?.NEXT_PUBLIC_POSTHOG_KEY ||
        process.env?.VITE_POSTHOG_KEY
      : undefined) ??
    (typeof window !== 'undefined'
      ? (
          window as unknown as {
            posthog?: { config?: { token?: string } }
          }
        ).posthog?.config?.token
      : undefined)

  const { body, properties } = buildPostHogPayload(payload, apiKey)

  if (client && typeof client.capture === 'function') {
    await client.capture('feedtack submitted', properties, { uuid: payload.id })
    return
  }

  if (!apiKey && !options.endpoint && !options.fetch) {
    throw new Error(
      'PostHog apiKey is required when no custom endpoint, client, or fetch is provided',
    )
  }

  const host =
    options.host ??
    (typeof window !== 'undefined'
      ? (
          window as unknown as {
            posthog?: { config?: { api_host?: string } }
          }
        ).posthog?.config?.api_host
      : undefined) ??
    'https://us.i.posthog.com'

  const endpoint = options.endpoint ?? `${host.replace(/\/+$/, '')}/capture/`

  const fetchFn =
    options.fetch ?? (typeof fetch !== 'undefined' ? fetch : undefined)
  if (!fetchFn) {
    throw new Error('fetch is not available')
  }

  const res = await fetchFn(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    throw new Error(`PostHog capture HTTP error: ${res.status}`)
  }
}

/**
 * Wraps a FeedtackAdapter to mirror submissions to the PostHog capture endpoint.
 *
 * Privacy-safe: sends only allowlisted metadata (feedtack_id, scope, sentiment,
 * pathname, schema_version, breakpoint, pins[selector, component_name, data_testid, element_path]).
 * Leaves out comment text, ancestor textContent, email and screenshots by default.
 *
 * Wrapped in try/catch so PostHog failures or network errors never block or fail the underlying submit.
 */
export function withPostHog<T extends FeedtackAdapter>(
  adapter: T,
  options?: PostHogOptions | string,
): T {
  const opts: PostHogOptions =
    typeof options === 'string'
      ? { apiKey: options }
      : typeof (options as unknown as PostHogClient)?.capture === 'function'
        ? { client: options as unknown as PostHogClient }
        : (options ?? {})

  const wrappedSubmit = async (payload: FeedtackPayload): Promise<void> => {
    try {
      await sendPostHogEvent(payload, opts)
    } catch {
      // PostHog failures never block or fail the underlying submit
    }
    return adapter.submit(payload)
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
