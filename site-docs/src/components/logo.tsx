export const BRAND = {
  primary: '#2563eb', // blue-600 — "feed"
  secondary: '#f59e0b', // amber-500 — "tack"
} as const

export function FeedtackLogo({ className }: { className?: string }) {
  return (
    <span
      className={className}
      style={{ fontWeight: 700, fontSize: 'inherit', letterSpacing: '-0.02em' }}
    >
      <span style={{ color: BRAND.primary }}>Feed</span>
      <span style={{ color: BRAND.secondary }}>tack</span>
    </span>
  )
}
