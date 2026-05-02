import type { CooperTier } from './tier-data'

interface CooperTierCardProps {
  tier: CooperTier
  index: number
}

export function CooperTierCard({ tier, index }: CooperTierCardProps) {
  const cardClass = [
    'cooper-card',
    tier.featured ? 'cooper-card--featured' : '',
    tier.locked ? 'cooper-card--locked' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const label = tier.featured
    ? 'Recommended'
    : tier.locked
      ? 'Restricted Access'
      : `Plane ${String(index + 1).padStart(2, '0')}`

  return (
    <article className={cardClass}>
      {/* Ghost name — large, behind everything */}
      <div className="cooper-card-name-ghost" aria-hidden="true">
        {tier.name}
      </div>

      <div className="cooper-card-label">{label}</div>

      <h2 className="cooper-card-name">
        {tier.name}
        {tier.locked && <span className="cooper-lock">Locked</span>}
      </h2>

      <div className="cooper-card-price">{tier.price}</div>
      <p className="cooper-card-subtitle">{tier.subtitle}</p>

      <ul className="cooper-features">
        {tier.features.map((feature) => (
          <li key={feature} className="cooper-feature">
            {feature}
          </li>
        ))}
      </ul>

      <a
        className="cooper-cta"
        href={tier.ctaHref ?? '#'}
        {...(tier.ctaHref
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {})}
      >
        {tier.cta}
      </a>

      {/* Large ghosted index number */}
      <div className="cooper-card-index" aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </div>
    </article>
  )
}
