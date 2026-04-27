import type { Tier } from '@/data/pricing-tiers'
import styles from './vignelli-pricing.module.css'

interface VignelliTierProps {
  tier: Tier
}

/**
 * A single pricing column in the Vignelli grid.
 *
 * Information hierarchy through scale and weight alone.
 * Color is used only to signal "recommended" (red).
 * No shadows, no gradients, no rounded corners.
 */
export function VignelliTier({ tier }: VignelliTierProps) {
  const tierClass = [
    styles.tier,
    tier.featured ? styles.tierFeatured : '',
    tier.locked ? styles.tierLocked : '',
  ]
    .filter(Boolean)
    .join(' ')

  const ctaClass = [
    styles.cta,
    tier.featured ? styles.ctaFeatured : '',
    tier.locked ? styles.ctaLocked : '',
  ]
    .filter(Boolean)
    .join(' ')

  const href = tier.ctaHref ?? `https://www.npmjs.com/package/feedtack`

  return (
    <div className={tierClass}>
      <p className={styles.tierName}>{tier.name}</p>

      <p className={styles.tierPrice}>
        {tier.price}
        <span className={styles.tierPeriod}>/mo</span>
      </p>

      <p className={styles.tierSubtitle}>{tier.subtitle}</p>

      <hr className={styles.featureRule} />

      <ul className={styles.features}>
        {tier.features.map((feature) => (
          <li key={feature} className={styles.feature}>
            {feature}
          </li>
        ))}
      </ul>

      <a href={href} className={ctaClass}>
        {tier.cta}
      </a>
    </div>
  )
}
