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
    breakpoint: z.string().nullable().optional(),
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
    const tagName = target.tagName as string
    const selector = target.selector as string
    const bestEffort = target.best_effort as boolean
    const classes = target.classes as string[] | undefined
    const textContent = target.textContent as string | null | undefined
    const placeholder = target.placeholder as string | null | undefined
    const ariaLabel = target.ariaLabel as string | null | undefined
    const role = target.role as string | null | undefined
    const type = target.type as string | null | undefined
    const name = target.name as string | null | undefined
    const dataTestId = target.dataTestId as string | null | undefined
    const dataFeedtackComponent = target.dataFeedtackComponent as
      | string
      | null
      | undefined
    const componentName = target.componentName as string | null | undefined

    lines.push(
      '### Element Context',
      '',
      `- **Tag:** \`${tagName}\``,
      `- **Selector:** \`${selector}\``,
      `- **Best effort:** ${bestEffort}`,
    )
    if (classes && classes.length > 0)
      lines.push(`- **Classes:** ${classes.join(' ')}`)
    if (textContent) lines.push(`- **Text:** "${textContent}"`)
    if (placeholder) lines.push(`- **Placeholder:** ${placeholder}`)
    if (ariaLabel) lines.push(`- **ARIA:** ${ariaLabel}`)
    if (role) lines.push(`- **Role:** ${role}`)
    if (type) lines.push(`- **Type:** ${type}`)
    if (name) lines.push(`- **Name:** ${name}`)
    if (dataTestId) lines.push(`- **data-testid:** ${dataTestId}`)
    if (dataFeedtackComponent)
      lines.push(`- **data-feedtack-component:** ${dataFeedtackComponent}`)
    if (componentName) lines.push(`- **Component:** ${componentName}`)

    const ancestors = target.ancestors as
      | Array<Record<string, unknown>>
      | undefined
    if (ancestors?.length) {
      lines.push('', '**Ancestor chain:**', '')
      for (const a of ancestors) {
        // Build the tag#id part (no space between tag and id)
        let tagIdPart = a.tag as string
        if (a.id) tagIdPart += `#${a.id}`
        const componentLabel = (a.componentName ?? a.dataFeedtackComponent) as
          | string
          | null
          | undefined
        // Add component label with a space: `nav (Sidebar)`
        const ancestorLabel = componentLabel
          ? `${tagIdPart} (${componentLabel})`
          : tagIdPart
        let ancestorLine = `- \`${ancestorLabel}\``
        const aClasses = a.classes as string[] | undefined
        if (aClasses && aClasses.length > 0)
          ancestorLine += ` — Classes: ${aClasses.join(' ')}`
        const aAriaLabel = a.ariaLabel as string | null | undefined
        if (aAriaLabel) ancestorLine += ` — ARIA: ${aAriaLabel}`
        lines.push(ancestorLine)
      }
    }
    lines.push('')
  }

  const {
    width: w,
    height: h,
    devicePixelRatio: dpr,
    breakpoint,
  } = payload.viewport
  lines.push(
    '### Viewport',
    '',
    `${w}x${h} @ ${dpr}x DPR${breakpoint ? ` (${breakpoint})` : ''}`,
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
