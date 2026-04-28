import type { PricingTier } from '@/data/pricing-tiers'
import s from './rams.module.css'

/**
 * A single pricing tier, rendered in the spirit of Dieter Rams.
 * Every element earns its place. No decoration. Pure information.
 */
export function RamsTierCard({ tier }: { tier: PricingTier }) {
  const isLink = !!tier.ctaHref

  return (
    <article className={tier.featured ? s.cardFeatured : s.card}>
      {tier.featured && <div className={s.cardAccent} />}

      <header className={s.cardHeader}>
        <p className={s.tierLabel}>{tier.name}</p>

        <div className={s.priceRow}>
          <span className={s.priceValue}>{tier.price}</span>
          <span className={s.pricePeriod}>/forever</span>
        </div>

        <p className={s.subtitle}>{tier.subtitle}</p>
      </header>

      <div className={s.divider} />

      <ul className={s.features}>
        {tier.features.map((feature) => (
          <li key={feature} className={s.feature}>
            {feature}
          </li>
        ))}
      </ul>

      <div className={s.ctaWrap}>
        {isLink ? (
          <a
            href={tier.ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className={s.ctaLink}
          >
            {tier.cta}
          </a>
        ) : (
          <code className={s.ctaCode}>{tier.cta}</code>
        )}
      </div>
    </article>
  )
}
