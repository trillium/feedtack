import type { Tier } from '@/data/pricing-tiers'
import styles from './enterprise-architect.module.css'

/**
 * TierCards — Pricing tier card grid
 *
 * Renders all tiers in a structured grid with feature enumeration.
 * Each card follows the DS-CARD-003 pattern from the component library.
 *
 * @component
 * @accessibility Role: region, aria-labelledby per card
 * @designPattern DS-CARD-003 (Standard Card w/ Action)
 * @owner Revenue Product Team
 * @since v4.0.0
 */

const TIER_SLA_NOTES: Record<string, string> = {
  Free: 'SLA: Best-effort (99.9% aspirational)',
  Pro: 'SLA: 99.9% uptime, 24h response*',
  Enterprise: 'SLA: 99.99% uptime, <1h response**',
}

const TIER_SEATS: Record<string, string> = {
  Free: 'Up to 5 seats',
  Pro: 'Up to 50 seats',
  Enterprise: 'Unlimited seats',
}

export function TierCards({ tiers }: { tiers: Tier[] }) {
  return (
    <section
      className={styles.tierSection}
      aria-labelledby="tier-section-heading"
    >
      <p className={styles.sectionLabel}>Section 1.0 — Subscription Tiers</p>
      <h2 id="tier-section-heading" className={styles.sectionTitle}>
        Select Your Plan
      </h2>

      <ul className={styles.tierGrid} aria-label="Available pricing tiers">
        {tiers.map((tier, index) => {
          const isFeatured = tier.featured === true
          const isEnterprise = tier.locked === true

          return (
            <li
              key={tier.name}
              className={`${styles.tierCard} ${isFeatured ? styles.tierCardFeatured : ''}`}
              aria-labelledby={`tier-name-${index}`}
            >
              {isFeatured && (
                <span
                  className={styles.recommendedBadge}
                  title="Recommended plan"
                >
                  Recommended
                </span>
              )}

              <p id={`tier-name-${index}`} className={styles.tierName}>
                {tier.name}
              </p>

              <p className={styles.tierPrice}>
                {tier.price}
                <span className={styles.tierPricePeriod}>/mo per seat</span>
              </p>

              <p className={styles.tierDescription}>
                {tier.subtitle}{' '}
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    marginTop: '4px',
                  }}
                >
                  {TIER_SEATS[tier.name] ?? ''}
                </span>
              </p>

              <a
                href={tier.ctaHref ?? '#'}
                className={`${styles.tierCta} ${
                  isEnterprise
                    ? styles.tierCtaEnterprise
                    : isFeatured
                      ? styles.tierCtaPrimary
                      : styles.tierCtaSecondary
                }`}
                aria-label={
                  isEnterprise
                    ? `Contact Sales for ${tier.name} plan`
                    : `Get started with ${tier.name} plan`
                }
              >
                {isEnterprise ? 'Contact Sales' : tier.cta}
              </a>

              <ul
                className={styles.tierFeatureList}
                aria-label={`${tier.name} plan features`}
              >
                {tier.features.map((feature) => (
                  <li key={feature} className={styles.tierFeatureItem}>
                    <span
                      className={styles.tierFeatureCheck}
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className={styles.tierSlaNote}>
                {TIER_SLA_NOTES[tier.name] ?? 'SLA: See agreement'}
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
