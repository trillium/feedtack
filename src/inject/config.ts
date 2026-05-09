import {
  ANON_USER,
  type FeedtackInjectConfig,
  type FeedtackInjectRawConfig,
} from './types.js'

const INJECT_VERSION = '1.2.0'

/** Validate a webhook URL — must be absolute https */
export function validateWebhookUrl(url: string): string {
  const parsed = new URL(url)
  if (parsed.protocol !== 'https:') {
    throw new Error(
      `[feedtack] Webhook URL must use https: protocol, got ${parsed.protocol}`,
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
