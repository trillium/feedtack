import {
  ANON_USER,
  type FeedtackInjectConfig,
  type FeedtackInjectRawConfig,
} from './types.js'

const INJECT_VERSION = '1.2.0'

/** Validate a webhook URL — must be https, or http for localhost/127.0.0.1 */
export function validateWebhookUrl(url: string): string {
  const parsed = new URL(url)
  const isLocalhost =
    parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1'
  if (
    parsed.protocol !== 'https:' &&
    !(parsed.protocol === 'http:' && isLocalhost)
  ) {
    throw new Error(
      `[feedtack] Webhook URL must use https (or http for localhost), got ${parsed.protocol}//${parsed.hostname}`,
    )
  }
  return parsed.href
}

/** Parse raw config from window.__feedtack into validated config */
export function parseConfig(
  raw?: FeedtackInjectRawConfig,
): FeedtackInjectConfig {
  const config: FeedtackInjectConfig = {
    version: INJECT_VERSION,
    user: ANON_USER,
  }

  if (!raw) return config

  if (raw.webhookUrl) {
    config.webhookUrl = validateWebhookUrl(raw.webhookUrl)
  }

  if (raw.user) {
    config.user = {
      id: raw.user.id ?? ANON_USER.id,
      name: raw.user.name ?? ANON_USER.name,
      role: raw.user.role ?? ANON_USER.role,
      ...(raw.user.avatarUrl ? { avatarUrl: raw.user.avatarUrl } : {}),
      ...(raw.user.email ? { email: raw.user.email } : {}),
    }
  }

  return config
}
