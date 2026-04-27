import type { Tier } from '@/data/pricing-tiers'
import { BrodyGlyph } from './brody-glyph'
import styles from './brody-tier-card.module.css'

const TIER_ACCENTS = {
  Free: '#e63946',
  Pro: '#f4f1de',
  Enterprise: '#e9c46a',
} as const

function LockOverlay() {
  return (
    <div className={styles.lockOverlay}>
      <div className={styles.lockScanlines} />
      <div className={styles.lockFrost} />
      <div className={styles.lockContent}>
        <svg
          viewBox="0 0 48 48"
          className={styles.lockIcon}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="square"
          role="img"
          aria-label="Locked"
        >
          <rect x="8" y="22" width="32" height="22" />
          <path d="M14 22V14a10 10 0 0 1 20 0v8" />
          <circle cx="24" cy="33" r="3" fill="currentColor" />
        </svg>
        <p className={styles.lockTitle}>SUBMIT A PR</p>
        <p className={styles.lockSubtitle}>Open source contribution required</p>
      </div>
    </div>
  )
}

export function BrodyTierCard({ tier }: { tier: Tier }) {
  const accent =
    TIER_ACCENTS[tier.name as keyof typeof TIER_ACCENTS] || '#e63946'
  const isLocked = tier.locked
  const isFeatured = tier.featured

  return (
    <article
      className={`${styles.card} ${isFeatured ? styles.featured : ''} ${isLocked ? styles.locked : ''}`}
      style={{ '--tier-accent': accent } as React.CSSProperties}
    >
      {isLocked && <LockOverlay />}

      {/* Tier logotype — glyph as custom letterform */}
      <div className={styles.glyphRow}>
        <BrodyGlyph letter={tier.name.charAt(0)} size={80} accent={accent} />
        <div className={styles.tierLabel}>
          <h2 className={styles.tierName}>{tier.name}</h2>
          <div
            className={styles.accentRule}
            style={{ backgroundColor: accent }}
          />
        </div>
      </div>

      {/* Price block — monumental type treatment */}
      <div className={styles.priceBlock}>
        <span className={styles.priceValue}>{tier.price}</span>
        <span className={styles.pricePeriod}>/ forever</span>
      </div>

      <p className={styles.subtitle}>{tier.subtitle}</p>

      {/* Geometric divider */}
      <div className={styles.divider}>
        <div
          className={styles.dividerLine}
          style={{ backgroundColor: accent }}
        />
        <div
          className={styles.dividerDot}
          style={{ backgroundColor: accent }}
        />
        <div
          className={styles.dividerLine}
          style={{ backgroundColor: accent }}
        />
      </div>

      {/* Features — vertical rhythm with custom markers */}
      <ul className={styles.features}>
        {tier.features.map((feature) => (
          <li key={feature} className={styles.featureItem}>
            <span
              className={styles.featureMarker}
              style={{ backgroundColor: accent }}
            />
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
          className={styles.cta}
          style={
            {
              '--cta-bg': accent,
              '--cta-text': '#1a1a2e',
            } as React.CSSProperties
          }
        >
          {tier.cta}
        </a>
      ) : (
        <code
          className={`${styles.cta} ${isFeatured ? styles.ctaFeatured : styles.ctaDefault}`}
        >
          {tier.cta}
        </code>
      )}

      {isFeatured && (
        <div className={styles.featuredBadge}>
          <span className={styles.featuredBadgeText}>POPULAR</span>
        </div>
      )}
    </article>
  )
}
