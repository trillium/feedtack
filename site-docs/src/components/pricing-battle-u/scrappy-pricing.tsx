import type { Tier } from '@/components/tier-card'
import {
  FAKE_OLD_PRICES,
  FAQ_ITEMS,
  STARTUP_BUZZWORDS,
  TIER_EMOJIS,
} from './scrappy-data'
import {
  CompareToggle,
  CountdownBanner,
  MarqueeBanner,
  SocialProof,
} from './scrappy-helpers'
import './scrappy-styles.css'

function ScrappyCard({ tier, index }: { tier: Tier; index: number }) {
  const buzzwords = STARTUP_BUZZWORDS[tier.name] ?? tier.features
  const emoji = TIER_EMOJIS[tier.name] ?? '\u{2728}'
  const fakeOldPrice = FAKE_OLD_PRICES[tier.name] ?? '$99'

  return (
    <div className="scrappy-card">
      {/* Every tier is "Most Popular" */}
      <div className="popular-badge">
        {index === 0
          ? '\u{1F31F} Most Popular'
          : index === 1
            ? '\u{1F525} Most Popular'
            : '\u{1F4A5} Most Popular'}
      </div>

      {tier.locked && (
        <div className="scrappy-lock-overlay">
          <div className="scrappy-lock-icon">{'\u{1F512}'}</div>
          <p className="scrappy-lock-text">Ship a PR to Unlock</p>
          <p className="scrappy-lock-subtext">
            We&apos;re a startup, we need contributors
          </p>
        </div>
      )}

      <span className="scrappy-tier-emoji">{emoji}</span>
      <h3 className="scrappy-tier-name">{tier.name}</h3>
      <p className="scrappy-tier-desc">{tier.subtitle}</p>

      <div style={{ marginBottom: 16 }}>
        <span className="scrappy-old-price">{fakeOldPrice}</span>
        <span className="scrappy-price">{tier.price}</span>
        <span className="scrappy-price-period">/ forever</span>
      </div>

      <div className="scrappy-divider" />

      <ul className="scrappy-features" style={{ marginBottom: 20 }}>
        {buzzwords.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>

      {tier.ctaHref ? (
        <a
          href={tier.ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="scrappy-cta scrappy-cta-outline"
        >
          {tier.cta}
        </a>
      ) : tier.featured ? (
        <code className="scrappy-cta scrappy-cta-primary">{tier.cta}</code>
      ) : (
        <code className="scrappy-cta scrappy-cta-secondary">{tier.cta}</code>
      )}

      {/* Footnotes on enterprise */}
      {tier.name === 'Enterprise' && (
        <div
          style={{
            marginTop: 12,
            fontSize: 10,
            color: 'var(--scrappy-muted)',
            lineHeight: 1.4,
          }}
        >
          <p style={{ margin: 0 }}>* Not actually Kubernetes-native</p>
          <p style={{ margin: 0 }}>** Not quantum-resistant either</p>
        </div>
      )}
    </div>
  )
}

export function ScrappyPricing({ tiers }: { tiers: Tier[] }) {
  return (
    <div className="scrappy-page">
      <CountdownBanner />

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '60px 24px 20px' }}>
        <div
          style={{
            display: 'inline-block',
            background: 'var(--scrappy-orange)',
            color: 'white',
            fontSize: 11,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            padding: '4px 12px',
            borderRadius: 4,
            marginBottom: 16,
          }}
        >
          {'\u{1F389}'} Just raised our seed round {'\u{1F389}'}
        </div>
        <h1
          style={{
            fontSize: 'clamp(36px, 6vw, 56px)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 1.1,
            margin: '0 0 12px',
            color: 'var(--scrappy-text)',
          }}
        >
          Simple, transparent pricing
        </h1>
        <p
          style={{
            fontSize: 18,
            color: 'var(--scrappy-muted)',
            maxWidth: 480,
            margin: '0 auto 8px',
            lineHeight: 1.5,
          }}
        >
          No hidden fees. No credit card required. No pricing at all, actually.
        </p>
        <p
          style={{
            fontSize: 13,
            color: 'var(--scrappy-muted)',
            opacity: 0.6,
            fontStyle: 'italic',
          }}
        >
          We&apos;re an open source npm package. What did you expect?
        </p>
      </section>

      <SocialProof />
      <CompareToggle />

      {/* Cards */}
      <div className="scrappy-grid">
        {tiers.map((tier, i) => (
          <ScrappyCard key={tier.name} tier={tier} index={i} />
        ))}
      </div>

      <MarqueeBanner />

      {/* FAQ that's not really a FAQ */}
      <section
        style={{
          maxWidth: 600,
          margin: '0 auto',
          padding: '0 24px 80px',
        }}
      >
        <h2
          style={{
            fontSize: 24,
            fontWeight: 800,
            textAlign: 'center',
            marginBottom: 24,
            color: 'var(--scrappy-text)',
          }}
        >
          {'\u{1F914}'} Frequently Asked Questions
        </h2>
        <div
          style={{
            borderRadius: 12,
            border: '1px solid var(--scrappy-border)',
            overflow: 'hidden',
          }}
        >
          {FAQ_ITEMS.map((faq, i) => (
            <div
              key={faq.q}
              style={{
                padding: '16px 20px',
                borderBottom:
                  i < 4 ? '1px solid var(--scrappy-border)' : 'none',
              }}
            >
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  margin: '0 0 4px',
                  color: 'var(--scrappy-text)',
                }}
              >
                {faq.q}
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: 'var(--scrappy-muted)',
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
