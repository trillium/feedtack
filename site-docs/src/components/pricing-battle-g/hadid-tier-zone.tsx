import type { Tier } from '@/data/pricing-tiers'

const ZONE_ACCENTS = {
  Free: {
    color: '#3aa89f',
    gradient: 'linear-gradient(135deg, #3aa89f, #2d8a83)',
    glow: 'rgba(58, 168, 159, 0.08)',
    slug: 'free' as const,
  },
  Pro: {
    color: '#e8634a',
    gradient: 'linear-gradient(135deg, #e8634a, #c9503b)',
    glow: 'rgba(232, 99, 74, 0.08)',
    slug: 'pro' as const,
  },
  Enterprise: {
    color: '#8b6bb0',
    gradient: 'linear-gradient(135deg, #8b6bb0, #6f519a)',
    glow: 'rgba(139, 107, 176, 0.08)',
    slug: 'enterprise' as const,
  },
} as const

function LockOverlay() {
  return (
    <div
      className="absolute inset-0 z-10 flex items-center justify-center"
      style={{ borderRadius: 'inherit' }}
    >
      {/* Scan lines */}
      <div
        className="absolute inset-0 overflow-hidden opacity-[0.04]"
        style={{ borderRadius: 'inherit' }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, currentColor 0, currentColor 1px, transparent 0, transparent 5px)',
          }}
        />
      </div>
      {/* Frosted glass */}
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{
          background: 'var(--color-fd-background)',
          opacity: 0.75,
          borderRadius: 'inherit',
        }}
      />
      {/* Content */}
      <div className="relative text-center px-6">
        <div
          className="mx-auto mb-3 flex items-center justify-center"
          style={{
            width: 64,
            height: 64,
            borderRadius: '55% 45% 50% 50% / 50% 55% 45% 50%',
            background:
              'linear-gradient(135deg, rgba(139,107,176,0.12), rgba(139,107,176,0.04))',
            border: '1px solid rgba(139,107,176,0.2)',
          }}
        >
          <svg
            viewBox="0 0 24 24"
            className="text-fd-muted-foreground"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            width={28}
            height={28}
            role="img"
            aria-label="Locked"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <p
          className="text-fd-foreground"
          style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: '0.9rem',
            fontWeight: 400,
            letterSpacing: '0.05em',
          }}
        >
          Submit a PR to unlock
        </p>
        <p className="mt-1 text-xs text-fd-muted-foreground opacity-70">
          Open source contribution required
        </p>
      </div>
    </div>
  )
}

export function HadidTierZone({ tier }: { tier: Tier }) {
  const accent =
    ZONE_ACCENTS[tier.name as keyof typeof ZONE_ACCENTS] ?? ZONE_ACCENTS.Free
  const zoneClass = `hadid-zone hadid-zone--${accent.slug}`

  return (
    <div className={zoneClass}>
      {/* Background fill */}
      <div
        className="hadid-zone-bg"
        style={{
          background: tier.featured
            ? `linear-gradient(160deg, ${accent.glow}, var(--color-fd-card) 60%)`
            : undefined,
          boxShadow: tier.featured
            ? `inset 0 0 0 1px ${accent.color}20, 0 8px 40px -10px ${accent.color}15`
            : undefined,
        }}
      />

      {/* Accent stripe */}
      <div
        className="hadid-accent-stripe"
        style={{ background: accent.gradient }}
      />

      {/* Locked overlay */}
      {tier.locked && <LockOverlay />}

      {/* Content */}
      <div className="hadid-zone-content flex flex-col h-full">
        {/* Featured badge */}
        {tier.featured && (
          <div
            className="mb-4 inline-flex self-start items-center gap-1.5 px-3 py-1"
            style={{
              background: accent.glow,
              borderRadius: '50px 20px 50px 20px',
              border: `1px solid ${accent.color}30`,
              fontSize: '0.7rem',
              fontWeight: 500,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: accent.color,
            }}
          >
            <span
              className="inline-block animate-pulse"
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: accent.color,
              }}
            />
            Most Popular
          </div>
        )}

        <p className="hadid-tier-name">{tier.name}</p>

        <div className="hadid-price-wrap">
          <span className="hadid-price">{tier.price}</span>
          <span className="hadid-price-period">/ forever</span>
        </div>

        <p className="hadid-subtitle">{tier.subtitle}</p>

        {/* Curved divider */}
        <hr
          className="hadid-divider"
          style={{ background: accent.gradient }}
        />

        {/* Features */}
        <ul className="hadid-features">
          {tier.features.map((feature) => (
            <li key={feature} className="hadid-feature">
              <span
                className="hadid-feature-dot"
                style={{ background: accent.color }}
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
            className="block text-center transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: accent.gradient,
              color: '#fff',
              padding: '0.75rem 1.5rem',
              borderRadius: '50px 16px 50px 16px',
              fontSize: '0.85rem',
              fontWeight: 500,
              letterSpacing: '0.05em',
            }}
          >
            {tier.cta}
          </a>
        ) : (
          <code
            className="block text-center cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: tier.featured ? accent.gradient : accent.glow,
              color: tier.featured
                ? '#fff'
                : 'var(--color-fd-foreground)',
              padding: '0.75rem 1.5rem',
              borderRadius: '16px 50px 16px 50px',
              fontSize: '0.85rem',
              fontFamily: 'monospace',
              border: tier.featured
                ? 'none'
                : `1px solid ${accent.color}25`,
            }}
          >
            {tier.cta}
          </code>
        )}
      </div>
    </div>
  )
}
