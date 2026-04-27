export const BRAND = {
  primary: '#2563eb', // blue-600 — "feed"
  secondary: '#f59e0b', // amber-500 — "tack"
} as const

export function FeedtackLogo({ className }: { className?: string }) {
  return (
    <span
      className={className}
      style={{
        fontWeight: 700,
        fontSize: 'inherit',
        letterSpacing: '-0.02em',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25em',
      }}
    >
      <svg
        viewBox="0 0 24 32"
        fill={BRAND.primary}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ height: '1.1em', width: 'auto', flexShrink: 0 }}
      >
        <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20C24 5.4 18.6 0 12 0z" />
        <circle cx="12" cy="11" r="4.5" fill="white" fillOpacity={0.35} />
      </svg>
      <span style={{ color: BRAND.primary }}>Feed</span>
      <span style={{ color: BRAND.secondary }}>tack</span>
    </span>
  )
}
