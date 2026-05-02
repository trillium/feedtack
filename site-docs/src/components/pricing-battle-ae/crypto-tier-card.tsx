import type { Tier } from '@/data/pricing-tiers'
import s from './crypto.module.css'

const TIER_MAP: Record<
  string,
  {
    web3Name: string
    subtitle: string
    hexClass: string
    emoji: string
    note: string
    ctaLabel: string
    ctaClass: string
  }
> = {
  Free: {
    web3Name: 'Community',
    subtitle: 'Permissionless entry. No KYC required.',
    hexClass: 'hexCommunity',
    emoji: '\u{1F310}',
    note: 'Gasless onboarding \u2014 zero fees forever',
    ctaLabel: '\u{22C6} Mint Your Plan',
    ctaClass: 'ctaSecondary',
  },
  Pro: {
    web3Name: 'Validator',
    subtitle: 'Stake your reputation. Ship composable feedback.',
    hexClass: 'hexValidator',
    emoji: '\u{26A1}',
    note: 'Governance voting rights included',
    ctaLabel: '\u{22C6} Mint Your Plan',
    ctaClass: 'ctaPrimary',
  },
  Enterprise: {
    web3Name: 'Protocol',
    subtitle: 'Full-stack sovereignty. Run your own feedback chain.',
    hexClass: 'hexProtocol',
    emoji: '\u{1F6E1}\u{FE0F}',
    note: 'Requires on-chain contribution attestation',
    ctaLabel: '\u{22C6} Stake to Unlock',
    ctaClass: 'ctaLocked',
  },
}

function LockOverlay() {
  return (
    <div className={s.lockOverlay}>
      <div className={s.lockFrost} />
      <div className={s.lockContent}>
        <div className={s.lockHex}>
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="#22c55e"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            role="img"
            aria-label="Locked"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <p className={s.lockTitle}>Contribution Required</p>
        <p className={s.lockSubtext}>
          Submit a PR to claim your on-chain attestation
        </p>
      </div>
    </div>
  )
}

export function CryptoTierCard({ tier }: { tier: Tier }) {
  const meta = TIER_MAP[tier.name] ?? TIER_MAP.Free
  const cardClasses = [
    s.card,
    tier.featured ? s.cardFeatured : '',
    tier.locked ? s.cardLocked : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={cardClasses}>
      <div className={s.glowBorder} />

      {tier.featured && <span className={s.featuredBadge}>Most Staked</span>}

      {tier.locked && <LockOverlay />}

      {/* Hex icon */}
      <div className={s.hexIcon}>
        <div className={`${s.hexIconInner} ${s[meta.hexClass]}`}>
          {meta.emoji}
        </div>
      </div>

      <h2 className={s.tierName}>{meta.web3Name}</h2>
      <p className={s.tierSubtitle}>{meta.subtitle}</p>

      <div className={s.priceRow}>
        <span className={s.priceAmount}>{tier.price}</span>
        <span className={s.pricePeriod}>/ epoch</span>
      </div>

      <div className={s.priceNote}>
        <span className={s.priceNoteIcon} />
        {meta.note}
      </div>

      <div className={s.divider} />

      <ul className={s.features}>
        {tier.features.map((feature) => (
          <li key={feature} className={s.featureItem}>
            <svg
              className={s.featureCheck}
              viewBox="0 0 16 16"
              fill="none"
              role="img"
              aria-label="Included"
            >
              <circle cx="8" cy="8" r="8" fill="currentColor" opacity={0.08} />
              <path
                d="M5 8l2 2 4-4"
                stroke={
                  tier.locked
                    ? '#22c55e'
                    : tier.featured
                      ? '#06b6d4'
                      : '#a855f7'
                }
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {tier.ctaHref ? (
        <a
          href={tier.ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className={`${s.ctaMint} ${s[meta.ctaClass]}`}
        >
          {meta.ctaLabel}
        </a>
      ) : (
        <button type="button" className={`${s.ctaMint} ${s[meta.ctaClass]}`}>
          {meta.ctaLabel}
        </button>
      )}
    </div>
  )
}
