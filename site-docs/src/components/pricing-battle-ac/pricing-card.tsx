import type { Tier } from '@/data/pricing-tiers'
import { FeatureList } from './feature-list'
import { LockIcon } from './lock-icon'
import s from './pricing.module.css'

interface PricingCardProps {
  tier: Tier
}

export function PricingCard({ tier }: PricingCardProps) {
  const cardClass = [
    s.card,
    tier.featured ? s.cardFeatured : '',
    tier.locked ? s.cardLocked : '',
  ]
    .filter(Boolean)
    .join(' ')

  const ctaClass = [
    s.cta,
    tier.featured ? s.ctaPrimary : '',
    tier.locked ? s.ctaGhost : '',
  ]
    .filter(Boolean)
    .join(' ')

  const CtaTag = tier.ctaHref ? 'a' : 'span'
  const ctaProps = tier.ctaHref ? { href: tier.ctaHref } : {}

  return (
    <article className={cardClass} aria-label={`${tier.name} plan`}>
      {tier.locked && <div className={s.lockedOverlay} />}

      <div
        className="flex flex-col gap-4"
        style={{ position: 'relative', zIndex: 1 }}
      >
        {/* Header cluster */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <h3 className={s.title}>{tier.name}</h3>
            {tier.featured && <span className={s.badge}>Recommended</span>}
            {tier.locked && (
              <span className={`${s.badge} ${s.badgeLocked}`}>
                <LockIcon />
                Locked
              </span>
            )}
          </div>
          <p className={s.subtitle}>{tier.subtitle}</p>
        </div>

        {/* Price */}
        <div className="flex items-baseline">
          <span className={s.priceDisplay}>{tier.price}</span>
          <span className={s.pricePeriod}>/ forever</span>
        </div>

        {/* CTA */}
        <CtaTag
          className={ctaClass}
          role={tier.ctaHref ? undefined : 'button'}
          tabIndex={0}
          {...ctaProps}
        >
          {tier.cta}
        </CtaTag>

        {/* Divider */}
        <hr className={s.divider} />

        {/* Features (Ant Design density — tight spacing, small text) */}
        <FeatureList features={tier.features} muted={tier.locked} />
      </div>
    </article>
  )
}
