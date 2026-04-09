export interface FeedtackTheme {
  /** Accent color — pin button active state, focus rings, selected states */
  primary?: string
  /** Panel and picker background */
  background?: string
  /** Input and card surface background */
  surface?: string
  /** Primary text color */
  text?: string
  /** Secondary/placeholder text color */
  textMuted?: string
  /** Panel and input border color */
  border?: string
  /** Border radius applied to panels and inputs */
  radius?: string
  /** Notification badge color */
  badge?: string
}

/** Maps FeedtackTheme fields to CSS custom properties on #feedtack-root */
export function themeToCSS(theme: FeedtackTheme): Record<string, string> {
  const map: Record<string, string> = {}
  if (theme.primary)    map['--ft-primary'] = theme.primary
  if (theme.background) map['--ft-bg'] = theme.background
  if (theme.surface)    map['--ft-surface'] = theme.surface
  if (theme.text)       map['--ft-text'] = theme.text
  if (theme.textMuted)  map['--ft-text-muted'] = theme.textMuted
  if (theme.border)     map['--ft-border'] = theme.border
  if (theme.radius)     map['--ft-radius'] = theme.radius
  if (theme.badge)      map['--ft-badge'] = theme.badge
  return map
}
