/**
 * Anderson-style vintage tier card — each tier presented as
 * a hotel menu card or vintage label with ornamental borders.
 */
import { CornerOrnament, OrnamentalDivider, TierPlaque } from './ornament'

export interface TierK {
  name: string
  price: string
  subtitle: string
  number: number
  color: string
  features: string[]
  cta: string
  ctaHref?: string
  featured?: boolean
  locked?: boolean
}

function LockedOverlay() {
  return (
    <div className="anderson-locked">
      <div
        style={{
          fontFamily: 'var(--wa-font-display)',
          textAlign: 'center',
          padding: '2rem',
        }}
      >
        <div
          style={{
            fontSize: '2rem',
            marginBottom: '0.5rem',
            opacity: 0.6,
          }}
        >
          &#128477;
        </div>
        <p
          style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--wa-ink)',
            marginBottom: '0.25rem',
          }}
        >
          Submit a PR to Unlock
        </p>
        <p
          style={{
            fontSize: '0.85rem',
            fontFamily: 'var(--wa-font-body)',
            fontStyle: 'italic',
            color: 'var(--wa-ink)',
            opacity: 0.6,
          }}
        >
          Open source contribution required
        </p>
      </div>
    </div>
  )
}

export function TierCardK({ tier, delay }: { tier: TierK; delay: number }) {
  const cardClasses = [
    'anderson-card',
    'anderson-animate',
    tier.featured ? 'anderson-card-featured' : '',
    delay === 1
      ? 'anderson-animate-delay-1'
      : delay === 2
        ? 'anderson-animate-delay-2'
        : delay === 3
          ? 'anderson-animate-delay-3'
          : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={cardClasses}
      style={{ maxWidth: 350, width: '100%', flex: '1 1 280px' }}
    >
      {/* Corner ornaments */}
      <CornerOrnament position="top-left" />
      <CornerOrnament position="top-right" />
      <CornerOrnament position="bottom-left" />
      <CornerOrnament position="bottom-right" />

      {/* Featured badge */}
      {tier.featured && (
        <div className="anderson-badge">Concierge&apos;s Choice</div>
      )}

      {/* Room number plaque */}
      <TierPlaque number={tier.number} color={tier.color} />

      {/* Tier name */}
      <h2
        style={{
          fontFamily: 'var(--wa-font-display)',
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'var(--wa-ink)',
          margin: '0 0 0.25rem',
        }}
      >
        {tier.name}
      </h2>

      {/* Subtitle */}
      <p
        style={{
          fontFamily: 'var(--wa-font-body)',
          fontSize: '0.9rem',
          fontStyle: 'italic',
          color: 'var(--wa-ink)',
          opacity: 0.6,
          margin: 0,
        }}
      >
        {tier.subtitle}
      </p>

      <OrnamentalDivider color={tier.color} />

      {/* Price */}
      <div style={{ margin: '0.75rem 0' }}>
        <span
          style={{
            fontFamily: 'var(--wa-font-display)',
            fontSize: '3rem',
            fontWeight: 300,
            letterSpacing: '-0.02em',
            color: 'var(--wa-ink)',
            lineHeight: 1,
          }}
        >
          {tier.price}
        </span>
        <span
          style={{
            fontFamily: 'var(--wa-font-body)',
            fontSize: '0.95rem',
            fontStyle: 'italic',
            color: 'var(--wa-ink)',
            opacity: 0.5,
            marginLeft: '0.25rem',
          }}
        >
          / forever
        </span>
      </div>

      <OrnamentalDivider color={tier.color} />

      {/* Features */}
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: '1rem 0 1.5rem',
          textAlign: 'left',
        }}
      >
        {tier.features.map((feature) => (
          <li
            key={feature}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.6rem',
              marginBottom: '0.6rem',
              fontFamily: 'var(--wa-font-body)',
              fontSize: '0.9rem',
              color: 'var(--wa-ink)',
              lineHeight: 1.4,
            }}
          >
            <span
              className="anderson-check"
              style={{ borderColor: tier.color }}
            >
              &#10003;
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA — ticket stub */}
      {tier.ctaHref ? (
        <a
          href={tier.ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="anderson-cta"
          style={{ borderColor: tier.color }}
        >
          {tier.cta}
        </a>
      ) : (
        <span className="anderson-cta" style={{ borderColor: tier.color }}>
          {tier.cta}
        </span>
      )}

      {/* Locked overlay */}
      {tier.locked && <LockedOverlay />}
    </div>
  )
}
