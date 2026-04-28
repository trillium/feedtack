import type { Tier } from '@/data/pricing-tiers'

export function DeconstructedCard({ tier }: { tier: Tier }) {
  const classes = [
    'cdg-card',
    tier.featured ? 'cdg-card--featured' : '',
    tier.locked ? 'cdg-card--locked' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <article className={classes}>
      <div className="cdg-card__inner">
        <p className="cdg-card__name">{tier.name}</p>

        <div className="cdg-card__price-block">
          <p className="cdg-card__price">{tier.price}</p>
          <p className="cdg-card__subtitle">{tier.subtitle}</p>
        </div>

        <div className="cdg-card__divider" aria-hidden="true" />

        <ul className="cdg-features">
          {tier.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>

        <a href={tier.ctaHref ?? '#'} className="cdg-cta">
          {tier.cta}
        </a>
      </div>
    </article>
  )
}
