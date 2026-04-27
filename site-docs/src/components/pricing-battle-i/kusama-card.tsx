import type { Tier } from '@/data/pricing-tiers'
import './kusama-card.css'

/** Kusama color palette — dots upon dots */
const DOT_COLORS = ['#e42b2b', '#ffd700', '#ff6b9d'] as const

function LockOverlay() {
  return (
    <div className="kusama-lock-overlay">
      <div className="kusama-lock-overlay__frost" />
      <div className="kusama-lock-overlay__content">
        <div className="kusama-lock-icon">
          <svg
            viewBox="0 0 24 24"
            width={24}
            height={24}
            fill="none"
            stroke="#1a1a1a"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            role="img"
            aria-label="Locked"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <p className="kusama-lock-text">Submit a PR to unlock</p>
        <p className="kusama-lock-sub">
          Open source contribution required. Yes, really.
        </p>
      </div>
    </div>
  )
}

/** Generate the dot divider — 15 dots fading from center */
function DotDivider({ color }: { color: string }) {
  const count = 15
  return (
    <div className="kusama-divider">
      {Array.from({ length: count }, (_, idx) => {
        const dist = Math.abs(idx - Math.floor(count / 2))
        const opacity = 1 - dist * 0.12
        return (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: static decorative dots never reorder
            key={idx}
            className="kusama-divider__dot"
            style={{
              background: color,
              opacity: Math.max(0.15, opacity),
              width: dist === 0 ? 8 : 6,
              height: dist === 0 ? 8 : 6,
            }}
          />
        )
      })}
    </div>
  )
}

export function KusamaCard({ tier, index }: { tier: Tier; index: number }) {
  const color = DOT_COLORS[index % DOT_COLORS.length]
  const isFeatured = tier.featured ?? false
  const isLocked = tier.locked ?? false

  const cardClass = [
    'kusama-card',
    isFeatured && 'kusama-card--featured',
    isLocked && 'kusama-card--locked',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={cardClass}>
      {isFeatured && <span className="kusama-badge">Most Popular</span>}
      {isLocked && <LockOverlay />}

      {/* Dot badge */}
      <div
        className="kusama-card__dot-badge"
        style={{ background: color, color }}
      >
        <span
          style={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: 'white',
            display: 'block',
          }}
        />
      </div>

      {/* Name */}
      <h2 className="kusama-card__name">{tier.name}</h2>

      {/* Price */}
      <div style={{ marginBottom: 4 }}>
        <span className="kusama-card__price">{tier.price}</span>
        <span className="kusama-card__price-suffix">/ forever</span>
      </div>
      <p className="kusama-card__subtitle">{tier.subtitle}</p>

      {/* Dot divider */}
      <DotDivider color={color} />

      {/* Features */}
      <ul className="kusama-features">
        {tier.features.map((feature, fi) => (
          <li
            key={feature}
            className="kusama-feature"
            style={{ animationDelay: `${fi * 60}ms` }}
          >
            <span
              className="kusama-feature__dot"
              style={{ background: color, opacity: 0.7 }}
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
          className="kusama-cta kusama-cta--locked"
        >
          {tier.cta}
        </a>
      ) : isFeatured ? (
        <span className="kusama-cta kusama-cta--primary">
          <code>{tier.cta}</code>
        </span>
      ) : (
        <span className="kusama-cta kusama-cta--secondary">
          <code>{tier.cta}</code>
        </span>
      )}
    </div>
  )
}
