import type { Tier } from '@/data/pricing-tiers'

/** Sparkline bars — fake "adoption data" per tier */
function Sparkline({ seed }: { seed: number }) {
  const bars = Array.from({ length: 20 }, (_, i) => {
    // Deterministic pseudo-random based on seed + index
    const v = Math.abs(Math.sin(seed * 13.7 + i * 2.3)) * 100
    return { id: `spark-${seed}-${i}`, height: Math.max(8, v) }
  })

  return (
    <div className="tier-sparkline" aria-hidden="true">
      {bars.map((bar) => (
        <div
          key={bar.id}
          className="sparkline-bar"
          style={{ height: `${bar.height}%` }}
        />
      ))}
    </div>
  )
}

interface TierCardProps {
  tier: Tier
  index: number
  marketTerms: {
    badge: string
    changeLabel: string
    changeColor: string
  }
}

export function TierCard({ tier, index, marketTerms }: TierCardProps) {
  const cardClass = [
    'tier-card',
    tier.featured ? 'tier-card-featured' : '',
    tier.locked ? 'tier-card-locked' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const ctaClass = [
    'tier-cta',
    tier.featured ? 'tier-cta-featured' : '',
    tier.locked ? 'tier-cta-locked' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const badgeClass = [
    'tier-badge',
    tier.featured ? 'tier-badge-featured' : '',
    tier.locked ? 'tier-badge-locked' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={cardClass}>
      <div className="tier-card-header">
        <h3 className="tier-name">{tier.name}</h3>
        {(tier.featured || tier.locked) && (
          <span className={badgeClass}>{marketTerms.badge}</span>
        )}
      </div>

      <div className="tier-price-row">
        <span className="tier-price">{tier.price}</span>
        <span
          className="tier-price-change"
          style={{ color: marketTerms.changeColor }}
        >
          {marketTerms.changeLabel}
        </span>
      </div>

      <p className="tier-subtitle">{tier.subtitle}</p>

      <Sparkline seed={index + 1} />

      <ul className="tier-features">
        {tier.features.map((feature) => (
          <li key={feature} className="tier-feature">
            <span className="tier-feature-check" aria-hidden="true">
              +
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {tier.ctaHref ? (
        <a href={tier.ctaHref} className={ctaClass}>
          {tier.cta}
        </a>
      ) : (
        <button type="button" className={ctaClass}>
          {tier.cta}
        </button>
      )}
    </div>
  )
}
