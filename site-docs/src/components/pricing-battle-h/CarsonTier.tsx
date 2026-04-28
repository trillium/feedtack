import type { PricingTier } from '@/data/pricing-tiers'
import s from './carson-tier.module.css'

const OFFSETS = [s.offset0, s.offset1, s.offset2] as const

interface CarsonTierProps {
  tier: PricingTier
  index: number
}

export function CarsonTier({ tier, index }: CarsonTierProps) {
  const offset = OFFSETS[index % OFFSETS.length]
  const isFeatured = tier.featured
  const isLocked = tier.locked

  return (
    <article
      className={[
        s.tier,
        offset,
        isFeatured && s.featured,
        isLocked && s.locked,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* tier number watermark */}
      <span className={s.tierNumber} aria-hidden="true">
        {index + 1}
      </span>

      {/* diagonal slash across card */}
      <div className={s.cardSlash} aria-hidden="true" />

      {/* tier name — oversized, bleeds */}
      <h2 className={s.tierName}>{tier.name}</h2>

      {/* price — collides with name */}
      <div className={s.priceBlock}>
        <span className={s.priceMain}>{tier.price}</span>
        <span className={s.priceForever}>/ forever</span>
      </div>

      {/* subtitle pull-quote */}
      <p className={s.subtitle}>{tier.subtitle}</p>

      {/* features — dense, staggered */}
      <ul className={s.featuresList}>
        {tier.features.map((feature) => (
          <li key={feature} className={s.featureItem}>
            {feature}
          </li>
        ))}
      </ul>

      {/* CTA */}
      {tier.ctaHref ? (
        <a
          href={tier.ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className={s.cta}
        >
          {tier.cta}
        </a>
      ) : (
        <button type="button" className={s.cta}>
          {tier.cta}
        </button>
      )}

      {/* locked overlay — redacted */}
      {isLocked && (
        <div className={s.lockedOverlay} aria-hidden="true">
          <span className={s.lockedText}>access restricted</span>
          <span className={s.lockedBig}>Submit a PR</span>
        </div>
      )}
    </article>
  )
}
