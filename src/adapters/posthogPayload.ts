import type { FeedtackPayload, FeedtackPin } from '../types/payload.js'

export interface PostHogPinPayload {
  selector: string
  component_name: string | null
  data_testid: string | null
  element_path: string | null
}

export interface PostHogEventProperties {
  distinct_id: string
  $process_person_profile?: false
  feedtack_id: string
  scope: string
  sentiment: string | null
  pathname: string
  schema_version: string
  breakpoint: string | null
  pins: PostHogPinPayload[]
  [key: string]: unknown
}

export interface PostHogCaptureBody {
  api_key?: string
  event: 'feedtack submitted'
  distinct_id: string
  uuid: string
  timestamp: string
  properties: PostHogEventProperties
}

export interface PostHogClient {
  capture(
    event: string,
    properties?: Record<string, unknown> | PostHogEventProperties,
    options?: { uuid?: string },
  ): void | Promise<void>
}

export interface PostHogOptions {
  /** PostHog Project API Key (token) */
  apiKey?: string
  /** PostHog host URL. Defaults to 'https://us.i.posthog.com' */
  host?: string
  /** Full custom capture endpoint URL (overrides host) */
  endpoint?: string
  /** Custom fetch function */
  fetch?: typeof fetch
  /** Custom PostHog client (e.g. from posthog-js) */
  posthog?: PostHogClient
  /** Alternative alias for posthog client */
  client?: PostHogClient
}

/**
 * Generate a UUID v4 string using standard Web Crypto or fallback.
 */
export function generateUUID(): string {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Format a pin into the allowlisted PostHog pin shape.
 * Leaves out coordinates, bounding rect, color, index, and ancestor textContent.
 */
function formatPin(pin: FeedtackPin): PostHogPinPayload {
  const target = pin?.target as
    | (FeedtackPin['target'] & {
        component_name?: string
        componentName?: string
        data_testid?: string
        element_path?: string
      })
    | undefined

  let componentName: string | null = null
  if (target) {
    if (typeof target.component_name === 'string') {
      componentName = target.component_name
    } else if (typeof target.componentName === 'string') {
      componentName = target.componentName
    } else if (Array.isArray(target.ancestors)) {
      for (const ancestor of target.ancestors) {
        if (!ancestor) continue
        const ancestorWithSnake = ancestor as typeof ancestor & {
          component_name?: string
        }
        if (
          typeof ancestor.componentName === 'string' &&
          ancestor.componentName
        ) {
          componentName = ancestor.componentName
          break
        }
        if (
          typeof ancestorWithSnake.component_name === 'string' &&
          ancestorWithSnake.component_name
        ) {
          componentName = ancestorWithSnake.component_name
          break
        }
      }
    }
  }

  const dataTestId =
    target && typeof target.data_testid === 'string'
      ? target.data_testid
      : target && typeof target.dataTestId === 'string'
        ? target.dataTestId
        : null

  const elementPath =
    target && typeof target.element_path === 'string'
      ? target.element_path
      : target && typeof target.elementPath === 'string'
        ? target.elementPath
        : null

  const selector =
    target && typeof target.selector === 'string' ? target.selector : ''

  return {
    selector,
    component_name: componentName,
    data_testid: dataTestId,
    element_path: elementPath,
  }
}

/**
 * Build the allowlisted PostHog capture event payload.
 */
export function buildPostHogPayload(
  payload: FeedtackPayload,
  apiKey?: string,
): {
  body: PostHogCaptureBody
  properties: PostHogEventProperties
  isAnonymous: boolean
} {
  const hasUser =
    payload.submittedBy &&
    typeof payload.submittedBy.id === 'string' &&
    payload.submittedBy.id.trim().length > 0

  const isAnonymous = !hasUser
  const distinctId = hasUser ? payload.submittedBy.id : generateUUID()

  const properties: PostHogEventProperties = {
    distinct_id: distinctId,
    ...(isAnonymous ? { $process_person_profile: false } : {}),
    feedtack_id: payload.id,
    scope: payload.scope,
    sentiment: payload.sentiment ?? null,
    pathname: payload.page?.pathname ?? '',
    schema_version: payload.schemaVersion,
    breakpoint: payload.viewport?.breakpoint ?? null,
    pins: Array.isArray(payload.pins) ? payload.pins.map(formatPin) : [],
  }

  const body: PostHogCaptureBody = {
    event: 'feedtack submitted',
    distinct_id: distinctId,
    uuid: payload.id,
    timestamp: payload.timestamp,
    properties,
  }

  if (apiKey) {
    body.api_key = apiKey
  }

  return { body, properties, isAnonymous }
}
