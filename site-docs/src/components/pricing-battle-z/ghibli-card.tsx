import type { GhibliTier } from './tier-data'

const TIER_ICONS: Record<string, string> = {
  Free: '🌱',
  Pro: '🌻',
  Enterprise: '🏔',
}

const TIER_WHISPERS: Record<string, string> = {
  Free: 'Like a seed carried by the wind',
  Pro: 'The field remembers every bloom',
  Enterprise: 'Even mountains were once small stones',
}

export function GhibliCard({ tier }: { tier: GhibliTier }) {
  const icon = TIER_ICONS[tier.name] ?? '🌿'
  const whisper = TIER_WHISPERS[tier.name] ?? ''
  const isFeatured = tier.featured === true
  const isLocked = tier.locked === true

  const cardClass = [
    'ghibli-card',
    isFeatured ? 'ghibli-card-featured' : '',
    isLocked ? 'ghibli-card-locked' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const ctaClass = [
    'ghibli-cta',
    isFeatured ? 'ghibli-cta-featured' : '',
    isLocked ? 'ghibli-cta-locked' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <article className={cardClass}>
      <div style={{ padding: '1.75rem 1.5rem 1.5rem' }}>
        {/* Tier icon and name */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.25rem',
          }}
        >
          <span
            className="ghibli-float"
            style={{
              fontSize: '1.4rem',
              animationDelay: isFeatured ? '-1s' : '0s',
            }}
            aria-hidden="true"
          >
            {icon}
          </span>
          <h2
            style={{
              fontFamily: "'Georgia', 'Palatino', serif",
              fontSize: '1.15rem',
              fontWeight: 600,
              color: '#4a3f2f',
              letterSpacing: '0.01em',
            }}
          >
            {tier.name}
          </h2>
          {isFeatured && (
            <span
              style={{
                fontSize: '0.65rem',
                fontFamily: "'Georgia', serif",
                fontStyle: 'italic',
                color: '#6b8f5e',
                background: 'rgba(107, 143, 94, 0.1)',
                padding: '0.15rem 0.5rem',
                borderRadius: '8px',
              }}
            >
              recommended
            </span>
          )}
          {isLocked && (
            <span
              style={{
                fontSize: '0.65rem',
                fontFamily: "'Georgia', serif",
                fontStyle: 'italic',
                color: '#8b7750',
                opacity: 0.6,
              }}
            >
              (sealed)
            </span>
          )}
        </div>

        {/* Price */}
        <div style={{ margin: '0.75rem 0 0.25rem' }}>
          <span
            style={{
              fontFamily: "'Georgia', 'Palatino', serif",
              fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
              fontWeight: 400,
              color: '#4a3f2f',
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}
          >
            {tier.price}
          </span>
          <span
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: '0.8rem',
              color: '#8b7750',
              marginLeft: '0.35rem',
              fontStyle: 'italic',
            }}
          >
            / forever
          </span>
        </div>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: '0.8rem',
            color: '#8b7750',
            lineHeight: 1.5,
            marginBottom: '1rem',
          }}
        >
          {tier.subtitle}
        </p>

        {/* Delicate divider */}
        <div
          style={{
            width: '100%',
            height: '1px',
            background:
              'linear-gradient(90deg, transparent, #d4c5a9, transparent)',
            margin: '0.75rem 0',
          }}
        />

        {/* Features */}
        <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0' }}>
          {tier.features.map((f) => (
            <li
              key={f}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
                marginBottom: '0.5rem',
                fontFamily: "'Georgia', serif",
                fontSize: '0.8rem',
                color: '#5a4a30',
                lineHeight: 1.5,
              }}
            >
              <span className="ghibli-check" aria-hidden="true">
                ✦
              </span>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        {/* Whisper — tiny poetic note */}
        {whisper && (
          <p
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: '0.7rem',
              fontStyle: 'italic',
              color: '#8b7750',
              opacity: 0.5,
              textAlign: 'center',
              margin: '1rem 0 0.75rem',
            }}
          >
            &ldquo;{whisper}&rdquo;
          </p>
        )}

        {/* CTA */}
        {tier.ctaHref ? (
          <a href={tier.ctaHref} className={ctaClass}>
            {isLocked ? '🔒 ' : ''}
            {tier.cta}
          </a>
        ) : (
          <div className={ctaClass}>
            <code
              style={{
                fontFamily: "'SF Mono', 'Fira Code', monospace",
                fontSize: '0.8rem',
              }}
            >
              $ {tier.cta}
            </code>
          </div>
        )}
      </div>
    </article>
  )
}
