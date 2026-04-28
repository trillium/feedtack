import type { Tier } from '@/components/tier-card'
import styles from './lubalin-pricing.module.css'

/* ------------------------------------------------------------------ */
/*  Tier data — every plan is $0, the open-source joke                */
/* ------------------------------------------------------------------ */

const TIERS: Tier[] = [
  {
    name: 'Free',
    price: '$0',
    subtitle: 'Forever. Seriously.',
    pinColor: '#3b82f6',
    features: [
      'All adapters (console, localStorage, Supabase, webhooks)',
      'Unlimited pins',
      'Rich DOM targeting',
      'Feedback scopes (element, page, site)',
      'Custom CSS theming',
      'Full TypeScript support',
      'Community GitHub Issues',
    ],
    cta: 'npm install feedtack',
  },
  {
    name: 'Pro',
    price: '$0',
    subtitle: 'Same price. More prestige.',
    pinColor: '#8b5cf6',
    featured: true,
    features: [
      'Everything in Free',
      'Priority GitHub Issues (you star the repo first)',
      'Custom adapter support (you write them)',
      'Advanced DOM targeting',
      'Unlimited unlimited pins',
      'A warm feeling inside',
    ],
    cta: 'npm install feedtack',
  },
  {
    name: 'Enterprise',
    price: '$0',
    subtitle: 'For teams who like saying "enterprise."',
    pinColor: '#f59e0b',
    locked: true,
    features: [
      'Everything in Pro',
      'Unlimited Unlimited',
      '24/7 Self-Service Support (read the docs)',
      'White-glove npm install',
      'Dedicated Slack channel (make your own)',
      'SOC 2 Type II (you handle that)',
      'On-prem deployment (it\u2019s an npm package)',
    ],
    cta: 'Contribute to Unlock',
    ctaHref: 'https://github.com/trillium/feedtack',
  },
]

/* ------------------------------------------------------------------ */
/*  Build the repeating $0 divider string                             */
/* ------------------------------------------------------------------ */
const ZERO_REPEAT = Array.from({ length: 24 })
  .map(() => '$0')
  .join(' \u00b7 ')

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export function LubalinPricing() {
  return (
    <div className={styles.page}>
      {/* Background watermark letter */}
      <div className={styles.watermark} aria-hidden="true">
        &amp;
      </div>

      {/* Geometric ornaments */}
      <div className={styles.ornamentTopLeft} aria-hidden="true" />
      <div className={styles.ornamentBottomRight} aria-hidden="true" />

      {/* ---- Hero ---- */}
      <section className={styles.hero}>
        <div className={styles.geoCircle} aria-hidden="true" />
        <h1 className={styles.heroWord}>Pricing</h1>
        <p className={styles.subtitle}>
          Choose the plan that&apos;s right for you.
          <span className={styles.subtitlePunch}>
            Spoiler: they&apos;re all the same.
          </span>
        </p>
      </section>

      {/* ---- Type-as-divider ---- */}
      <div className={styles.typeDivider} aria-hidden="true">
        {ZERO_REPEAT}
      </div>

      {/* ---- Tier grid ---- */}
      <div className={styles.grid}>
        {TIERS.map((tier) => {
          const isFeatured = tier.featured === true
          const isLocked = tier.locked === true

          const cardClass = [
            styles.card,
            isFeatured ? styles.cardFeatured : '',
            isLocked ? styles.cardLocked : '',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <article key={tier.name} className={cardClass}>
              {isLocked && (
                <div className={styles.lockOverlay}>
                  <div className={styles.lockIcon}>
                    Locked
                    <span className={styles.lockSub}>Contribute to unlock</span>
                  </div>
                </div>
              )}

              <h2 className={styles.tierName}>{tier.name}</h2>
              <div className={styles.tierPrice}>{tier.price}</div>
              <p className={styles.tierSub}>{tier.subtitle}</p>

              <ul className={styles.features}>
                {tier.features.map((f) => (
                  <li key={f} className={styles.featureItem}>
                    {f}
                  </li>
                ))}
              </ul>

              <a className={styles.ctaLink} href={tier.ctaHref ?? '#'}>
                {tier.cta}
              </a>
            </article>
          )
        })}
      </div>

      {/* ---- Footer quote ---- */}
      <footer className={styles.footerQuote}>
        <p className={styles.quoteText}>
          &ldquo;The most important thing in type design is not the beautiful
          letter, but the beautiful word, and even more, the beautiful
          line.&rdquo;
          <span className={styles.quoteAttr}>
            &mdash; Herb Lubalin, typographer
          </span>
        </p>
      </footer>
    </div>
  )
}
