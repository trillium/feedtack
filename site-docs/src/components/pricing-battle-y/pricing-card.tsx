import type { Tier } from '@/data/pricing-tiers'
import { CheckIcon } from './check-icon'
import { LeafIcon } from './leaf-icon'
import s from './savanna.module.css'

export function PricingCard({ tier }: { tier: Tier }) {
  const featured = tier.featured ?? false
  const locked = tier.locked ?? false

  const cardClass = [
    s.card,
    featured ? s.cardFeatured : '',
    locked ? s.cardLocked : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={cardClass}>
      {locked && <div className={s.lockedVeil} />}

      <LeafIcon
        className={[s.leafAccent, featured ? s.leafAccentFeatured : '']
          .filter(Boolean)
          .join(' ')}
      />

      {featured && <span className={s.badge}>Elevated Choice</span>}

      <p
        className={[
          s.tierName,
          featured ? s.tierNameFeatured : '',
          locked ? s.tierNameLocked : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {tier.name}
      </p>

      <div>
        <span
          className={[s.price, featured ? s.priceFeatured : '']
            .filter(Boolean)
            .join(' ')}
        >
          {tier.price}
        </span>
        <span
          className={[s.pricePeriod, featured ? s.pricePeriodFeatured : '']
            .filter(Boolean)
            .join(' ')}
        >
          {' '}
          / forever
        </span>
      </div>

      <p
        className={[s.subtitle, featured ? s.subtitleFeatured : '']
          .filter(Boolean)
          .join(' ')}
      >
        {tier.subtitle}
      </p>

      <div
        className={[s.divider, featured ? s.dividerFeatured : '']
          .filter(Boolean)
          .join(' ')}
      />

      <ul className={s.featureList}>
        {tier.features.map((feature) => (
          <li
            key={feature}
            className={[
              s.featureItem,
              featured ? s.featureItemFeatured : '',
              locked ? s.featureItemLocked : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <CheckIcon
              className={[
                s.checkIcon,
                featured ? s.checkIconFeatured : '',
                locked ? s.checkIconLocked : '',
              ]
                .filter(Boolean)
                .join(' ')}
            />
            {feature}
          </li>
        ))}
      </ul>

      {tier.ctaHref ? (
        <a href={tier.ctaHref} className={ctaClass(featured, locked)}>
          {tier.cta}
        </a>
      ) : (
        <span className={ctaClass(featured, locked)}>{tier.cta}</span>
      )}
    </div>
  )
}

function ctaClass(featured: boolean, locked: boolean): string {
  return [s.cta, featured ? s.ctaFeatured : '', locked ? s.ctaLocked : '']
    .filter(Boolean)
    .join(' ')
}
