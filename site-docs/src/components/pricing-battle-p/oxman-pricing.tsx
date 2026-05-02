import type { Tier } from '@/data/pricing-tiers'
import { TIERS } from '@/data/pricing-tiers'
import './oxman-pricing.css'

function OrganismIcon() {
  return (
    <div className="organism-icon">
      <svg className="organism-rings" viewBox="0 0 48 48">
        <title>Organic cell</title>
        <circle cx="24" cy="24" r="8" />
        <circle cx="24" cy="24" r="14" />
        <circle cx="24" cy="24" r="20" />
      </svg>
      <div className="organism-core" />
    </div>
  )
}

function LockedOverlay() {
  return (
    <div className="oxman-locked-overlay">
      <div className="oxman-locked-bg" />
      <div className="oxman-locked-content">
        <div className="oxman-lock-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <title>Locked</title>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <p className="oxman-locked-title">Submit a PR to unlock</p>
        <p className="oxman-locked-desc">
          Open source contribution required. The organism grows through
          collaboration.
        </p>
        <span className="oxman-locked-badge">
          <span className="oxman-locked-badge-dot" />
          Awaiting mutation
        </span>
      </div>
    </div>
  )
}

function TierCta({ tier }: { tier: Tier }) {
  if (tier.ctaHref) {
    return (
      <a
        href={tier.ctaHref}
        target="_blank"
        rel="noopener noreferrer"
        className="oxman-cta"
      >
        {tier.cta}
      </a>
    )
  }

  return (
    <div
      className="oxman-cta"
      data-featured={tier.featured ? 'true' : undefined}
    >
      <code>{tier.cta}</code>
    </div>
  )
}

function OxmanCard({ tier }: { tier: Tier }) {
  return (
    <div
      className="oxman-card"
      data-tier={tier.name.toLowerCase()}
      data-featured={tier.featured ? 'true' : undefined}
    >
      {tier.featured && (
        <span className="oxman-featured-badge">Most Popular</span>
      )}

      {tier.locked && <LockedOverlay />}

      <OrganismIcon />

      <p className="oxman-card-name">{tier.name}</p>

      <p className="oxman-card-price">
        {tier.price}
        <span> / forever</span>
      </p>

      <p className="oxman-card-desc">{tier.subtitle}</p>

      <div className="membrane-divider" />

      <ul className="oxman-features">
        {tier.features.map((feature) => (
          <li key={feature} className="oxman-feature">
            <span className="oxman-feature-dot" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <TierCta tier={tier} />
    </div>
  )
}

export function OxmanPricing() {
  return (
    <div className="oxman-page">
      <div className="oxman-mesh" />
      <div className="voronoi-overlay" />

      <header className="oxman-header">
        <p className="oxman-tagline">Material Ecology</p>
        <h1 className="oxman-title">
          Pricing grown from <strong>first principles</strong>
        </h1>
        <p className="oxman-subtitle">
          Like nature, every tier is free. The complexity emerges from
          simplicity. Every feature is a cell in the same organism.
        </p>
      </header>

      <div className="oxman-grid">
        {TIERS.map((tier) => (
          <OxmanCard key={tier.name} tier={tier} />
        ))}
      </div>

      <footer className="oxman-footer">
        <div className="dna-separator">
          <span className="dna-dot" />
          <span className="dna-dot" />
          <span className="dna-dot" />
          <span className="dna-dot" />
          <span className="dna-dot" />
        </div>
        <p>
          In material ecology, there is no waste — only transformation.
          <br />
          <em>Every contribution feeds the organism.</em>
        </p>
      </footer>
    </div>
  )
}
