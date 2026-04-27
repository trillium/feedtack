export const PIN_PATH =
  'M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20C24 5.4 18.6 0 12 0z'

export const WFA_COLORS = {
  red: '#ef4444',
  blue: '#3b82f6',
  green: '#22c55e',
  amber: '#f59e0b',
} as const

/** Inline style helpers for fd-* CSS variable fills */
export const fd = {
  card: { fill: 'var(--color-fd-card, #ffffff)' },
  border: { stroke: 'var(--color-fd-border, #e5e7eb)' },
  cardBorder: {
    fill: 'var(--color-fd-card, #ffffff)',
    stroke: 'var(--color-fd-border, #e5e7eb)',
  },
  muted: { fill: 'var(--color-fd-muted, #f3f4f6)' },
  mutedFg: { fill: 'var(--color-fd-muted-foreground, #9ca3af)' },
  fg: { fill: 'var(--color-fd-foreground, #111827)' },
  primary: { fill: 'var(--color-fd-primary, #2563eb)' },
} as const
