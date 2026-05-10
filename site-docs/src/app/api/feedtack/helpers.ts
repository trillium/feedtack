import { z } from 'zod/v4'

// ---------------------------------------------------------------------------
// Rate limiting: in-memory, 5 submissions per hour per IP
// ---------------------------------------------------------------------------
const rateMap = new Map<string, number[]>()
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 60 * 60 * 1000 // 1 hour

export function isRateLimited(ip: string): {
  limited: boolean
  retryAfter: number
} {
  const now = Date.now()
  const timestamps = (rateMap.get(ip) ?? []).filter(
    (t) => now - t < RATE_WINDOW_MS,
  )
  rateMap.set(ip, timestamps)

  if (timestamps.length >= RATE_LIMIT) {
    const oldest = timestamps[0]
    const retryAfter = Math.ceil((oldest + RATE_WINDOW_MS - now) / 1000)
    return { limited: true, retryAfter }
  }
  timestamps.push(now)
  return { limited: false, retryAfter: 0 }
}

// ---------------------------------------------------------------------------
// Zod schema for incoming Feedtack payload (loose — we store the whole thing)
// ---------------------------------------------------------------------------
export const PayloadSchema = z.object({
  schemaVersion: z.string(),
  id: z.string(),
  timestamp: z.string(),
  scope: z.enum(['site', 'page', 'element']),
  submittedBy: z.object({
    id: z.string(),
    name: z.string(),
    username: z.string().optional(),
    role: z.string(),
  }),
  comment: z.string(),
  sentiment: z.nullable(z.enum(['good', 'bad'])),
  pins: z.array(z.any()),
  page: z.object({
    url: z.string(),
    pathname: z.string(),
    title: z.string(),
  }),
  viewport: z.object({
    width: z.number(),
    height: z.number(),
    scrollX: z.number(),
    scrollY: z.number(),
    devicePixelRatio: z.number(),
  }),
  device: z.object({
    userAgent: z.string(),
    platform: z.string(),
    touchEnabled: z.boolean(),
  }),
})

// ---------------------------------------------------------------------------
// Format a Feedtack payload as a GitHub issue body
// ---------------------------------------------------------------------------
export function formatIssueBody(
  payload: z.infer<typeof PayloadSchema>,
): string {
  const pin = payload.pins[0] as Record<string, unknown> | undefined
  const target = pin?.target as Record<string, unknown> | undefined

  const submitterLabel = payload.submittedBy.username
    ? `${payload.submittedBy.name} (@${payload.submittedBy.username})`
    : payload.submittedBy.name

  const lines: string[] = [
    '## Docs Feedback',
    '',
    `**Submitted by:** ${submitterLabel}`,
    `**Scope:** ${payload.scope}`,
    `**Page:** [${payload.page.pathname}](${payload.page.url})`,
    `**Sentiment:** ${payload.sentiment ?? 'none'}`,
    '',
    '### Comment',
    '',
    payload.comment,
    '',
  ]

  if (target) {
    lines.push(
      '### Element Target',
      '',
      `- **Selector:** \`${target.selector}\``,
      `- **Tag:** \`${target.tagName}\``,
      `- **data-testid:** ${target.dataTestId ?? 'n/a'}`,
      `- **Best effort:** ${target.best_effort}`,
    )

    const ancestors = target.ancestors as
      | Array<Record<string, unknown>>
      | undefined
    if (ancestors?.length) {
      lines.push('', '**Ancestor chain:**', '')
      for (const a of ancestors) {
        const parts = [a.tag as string]
        if (a.id) parts.push(`#${a.id}`)
        if (a.componentName) parts.push(`(${a.componentName})`)
        lines.push(`- \`${parts.join('')}\``)
      }
    }
    lines.push('')
  }

  lines.push(
    '### Viewport',
    '',
    `${payload.viewport.width}x${payload.viewport.height} @ ${payload.viewport.devicePixelRatio}x DPR`,
    '',
    '### Device',
    '',
    `- **Platform:** ${payload.device.platform}`,
    `- **Touch:** ${payload.device.touchEnabled}`,
    '',
    '---',
    '<details><summary>Raw payload</summary>',
    '',
    '```json',
    JSON.stringify(payload, null, 2),
    '```',
    '',
    '</details>',
  )

  return lines.join('\n')
}
