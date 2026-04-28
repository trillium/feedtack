import { PictogramEnterprise, PictogramFree, PictogramPro } from './pictograms'
import type { OlympicTier } from './tier-data'

const TIER_THEMES = {
  Free: {
    accent: 'var(--munich-blue)',
    number: '01',
  },
  Pro: {
    accent: 'var(--munich-green)',
    number: '02',
  },
  Enterprise: {
    accent: 'var(--munich-orange)',
    number: '03',
  },
} as const

const PICTOGRAM_MAP: Record<string, React.FC<{ color: string }>> = {
  Free: PictogramFree,
  Pro: PictogramPro,
  Enterprise: PictogramEnterprise,
}

export function OlympicCard({ tier }: { tier: OlympicTier }) {
  const theme = TIER_THEMES[tier.name as keyof typeof TIER_THEMES]
  const PictogramComponent = PICTOGRAM_MAP[tier.name]

  return (
    <article className="olympic-card">
      {tier.featured && (
        <span className="olympic-featured-label">Recommended</span>
      )}

      {tier.locked && <div className="olympic-locked-overlay" />}

      {/* Color stripe */}
      <div
        className="olympic-card-stripe"
        style={{ background: theme.accent }}
      />

      {/* Event number watermark */}
      <span className="olympic-event-number">{theme.number}</span>

      {/* Pictogram */}
      <div className="olympic-pictogram">
        {PictogramComponent && <PictogramComponent color={theme.accent} />}
      </div>

      {/* Tier name badge */}
      <div className="olympic-name-badge">
        <h2 style={{ background: theme.accent }}>{tier.name}</h2>
      </div>

      {/* Price */}
      <div className="olympic-price-block">
        <span className="price" style={{ color: theme.accent }}>
          {tier.price}
        </span>
        <span className="price-label">/forever</span>
        <p className="subtitle">{tier.subtitle}</p>
      </div>

      {/* Divider */}
      <div className="olympic-divider" style={{ background: theme.accent }} />

      {/* Features */}
      <ul className="olympic-features">
        {tier.features.map((feature) => (
          <li key={feature}>
            <span className="olympic-check">
              <span style={{ background: theme.accent }} />
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      {tier.ctaHref ? (
        <a
          href={tier.ctaHref}
          className="olympic-cta"
          style={{ background: theme.accent }}
        >
          {tier.cta}
        </a>
      ) : (
        <button
          type="button"
          className="olympic-cta"
          style={{ background: theme.accent }}
        >
          {tier.cta}
        </button>
      )}
    </article>
  )
}
