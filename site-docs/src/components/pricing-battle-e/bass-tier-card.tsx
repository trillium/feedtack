import type { Tier } from '@/data/pricing-tiers'
import styles from './bass-pricing.module.css'
import { TierNumber, TornEdge } from './bass-shapes'

interface BassTierCardProps {
  tier: Tier
  index: number
}

export function BassTierCard({ tier, index }: BassTierCardProps) {
  const isFeatured = tier.featured === true
  const tierNum = index + 1

  return (
    <article className={styles.card}>
      {/* Giant background number */}
      <div className={styles.cardNumber}>
        <TierNumber n={tierNum} size={200} />
      </div>

      {/* Tier name */}
      <h2
        className={`${styles.tierName} ${isFeatured ? styles.tierNameFeatured : ''}`}
      >
        {tier.name}
      </h2>

      {/* Price */}
      <div className={styles.price}>
        {tier.price}
        <span className={styles.pricePeriod}>/forever</span>
      </div>

      {/* Subtitle */}
      <p className={styles.subtitle}>{tier.subtitle}</p>

      {/* Torn paper divider */}
      <TornEdge className={styles.divider} />

      {/* Features */}
      <ul className={styles.features}>
        {tier.features.map((feature) => (
          <li key={feature} className={styles.feature}>
            <span className={styles.featureBullet} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      {tier.ctaHref ? (
        <a
          href={tier.ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.cta} ${isFeatured ? styles.ctaFeatured : ''}`}
        >
          {tier.cta}
        </a>
      ) : (
        <button
          type="button"
          className={`${styles.cta} ${isFeatured ? styles.ctaFeatured : ''}`}
          onClick={() => {
            navigator.clipboard.writeText('npm install feedtack')
          }}
        >
          {tier.cta}
        </button>
      )}
    </article>
  )
}
