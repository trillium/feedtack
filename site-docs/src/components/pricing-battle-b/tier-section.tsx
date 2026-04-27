import type { Tier } from '@/data/pricing-tiers'
import base from './editorial.module.css'
import s from './editorial-features.module.css'
import { FeatureList } from './feature-list'

const TIER_NUMBERS = ['01', '02', '03']

export function TierSection({ tier, index }: { tier: Tier; index: number }) {
  if (tier.featured) return <FeaturedTier tier={tier} index={index} />
  if (tier.locked) return <LockedTier tier={tier} index={index} />
  return <StandardTier tier={tier} index={index} />
}

function StandardTier({ tier, index }: { tier: Tier; index: number }) {
  return (
    <section className={base.tierSection}>
      <div className={base.tierInner}>
        <div className={base.tierNumber}>{TIER_NUMBERS[index]}</div>
        <h2 className={base.tierName}>{tier.name}</h2>
        <p className={base.tierSubtitle}>{tier.subtitle}</p>
        <div className={base.tierPrice}>
          <span className={base.priceAmount}>{tier.price}</span>
          <span className={base.pricePeriod}>/ forever</span>
        </div>
        <FeatureList features={tier.features} />
        <span className={s.cta}>{tier.cta}</span>
      </div>
    </section>
  )
}

function FeaturedTier({ tier, index }: { tier: Tier; index: number }) {
  return (
    <section className={`${base.tierSection} ${s.featuredSection}`}>
      <div className={base.tierInner}>
        <div className={base.tierNumber}>{TIER_NUMBERS[index]}</div>
        <h2 className={base.tierName}>{tier.name}</h2>
        <p className={base.tierSubtitle}>{tier.subtitle}</p>
        <div className={base.tierPrice}>
          <span className={base.priceAmount}>{tier.price}</span>
          <span className={base.pricePeriod}>/ forever</span>
        </div>
        <FeatureList features={tier.features} variant="featured" />
        <span className={`${s.cta} ${s.featuredCta}`}>{tier.cta}</span>
      </div>
    </section>
  )
}

function LockedTier({ tier, index }: { tier: Tier; index: number }) {
  const ctaEl = tier.ctaHref ? (
    <a href={tier.ctaHref} className={`${s.cta} ${s.lockedCta}`}>
      {tier.cta}
    </a>
  ) : (
    <span className={`${s.cta} ${s.lockedCta}`}>{tier.cta}</span>
  )

  return (
    <section className={`${base.tierSection} ${s.lockedSection}`}>
      <div className={s.lockedVeil} />
      <div className={base.tierInner}>
        <div className={s.lockedContent}>
          <div className={base.tierNumber}>{TIER_NUMBERS[index]}</div>
          <h2 className={base.tierName}>{tier.name}</h2>
          <p className={base.tierSubtitle}>{tier.subtitle}</p>
          <div className={base.tierPrice}>
            <span className={base.priceAmount}>{tier.price}</span>
            <span className={base.pricePeriod}>/ forever</span>
          </div>
          <FeatureList features={tier.features} variant="locked" />
        </div>
        {ctaEl}
      </div>
    </section>
  )
}
