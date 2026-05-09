import type { FeedtackUser } from '../types/payload.js'

export interface FeedtackInjectConfig {
  /** Webhook URL for sendBeacon egress. Omit for clipboard mode. */
  webhookUrl?: string
  /** User identity. Defaults to anonymous reviewer. */
  user?: FeedtackUser
  /** Package version — stamped into payload for traceability */
  version: string
}

/** Raw config shape users provide on window.__feedtack */
export interface FeedtackInjectRawConfig {
  webhookUrl?: string
  user?: Partial<FeedtackUser>
}

export const ANON_USER: FeedtackUser = {
  id: 'anon',
  name: 'Anonymous',
  role: 'reviewer',
}
