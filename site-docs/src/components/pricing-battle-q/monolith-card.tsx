import type { ThorgersonTier } from './tier-data'

function LockIcon() {
  return (
    <svg
      className="monolith__lock-icon"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="rgba(255,255,255,0.5)"
      strokeWidth="1"
      role="img"
      aria-label="Locked tier"
    >
      <title>Locked</title>
      <rect x="5" y="11" width="14" height="10" rx="1" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  )
}

type Variant = 'free' | 'pro' | 'enterprise'

export function MonolithCard({
  tier,
  variant,
}: {
  tier: ThorgersonTier
  variant: Variant
}) {
  const className = `monolith monolith--${variant}`

  return (
    <div className={className}>
      {tier.locked && <LockIcon />}
      <div className="monolith__name">{tier.name}</div>
      <div className="monolith__price">{tier.price}</div>
      <div className="monolith__subtitle">{tier.subtitle}</div>
      <div className="monolith__divider" />
      <ul className="monolith__features">
        {tier.features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <a
        className="monolith__cta"
        href={tier.ctaHref ?? '#'}
        {...(tier.ctaHref
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {})}
      >
        {tier.cta}
      </a>
    </div>
  )
}
