import type { Tier } from '@/data/pricing-tiers'

const VERSE_LABELS = ['VERSE I', 'VERSE II', 'VERSE III']

interface DetroitTierProps {
  tier: Tier
  index: number
}

export function DetroitTier({ tier, index }: DetroitTierProps) {
  const classes = [
    'detroit-tier',
    tier.featured ? 'featured' : '',
    tier.locked ? 'locked' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes}>
      <div className="tier-verse-num">{VERSE_LABELS[index]}</div>
      <h2 className="tier-name">{tier.name}</h2>
      <div className="tier-price">{tier.price}</div>
      <p className="tier-tagline">{tier.subtitle}</p>

      <ul className="tier-bars">
        {tier.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>

      <a
        className="tier-cta"
        href={tier.ctaHref ?? '#'}
        {...(tier.ctaHref?.startsWith('http')
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {})}
      >
        {tier.cta} *mic drop*
      </a>
    </div>
  )
}
