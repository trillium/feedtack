import { CrayonStar, SquigglyLine } from './decorations'
import type { CrayonTier } from './tier-data'

const CARD_STYLES: Record<
  string,
  {
    cardClass: string
    nameClass: string
    buttonClass: string
    kidVoice: string
  }
> = {
  Free: {
    cardClass: 'crayon-card crayon-card-free',
    nameClass: 'crayon-tier-name-free',
    buttonClass: 'crayon-button crayon-button-red',
    kidVoice: 'this one is FREE and its the BEST!!!',
  },
  Pro: {
    cardClass: 'crayon-card crayon-card-pro',
    nameClass: 'crayon-tier-name-pro',
    buttonClass: 'crayon-button crayon-button-purple',
    kidVoice: 'this one is ALSO free becuz sharing is caring 💜',
  },
  Enterprise: {
    cardClass: 'crayon-card crayon-card-enterprise',
    nameClass: 'crayon-tier-name-enterprise',
    buttonClass: 'crayon-button crayon-button-green',
    kidVoice:
      'my mommy says this one is for big companies but its still free!!!',
  },
}

const STAR_COLORS = [
  '#e8262a',
  '#fbbf24',
  '#9333ea',
  '#16a34a',
  '#1d4ed8',
  '#f97316',
]

export function CrayonCard({ tier }: { tier: CrayonTier }) {
  const style = CARD_STYLES[tier.name] ?? CARD_STYLES.Free
  const starColor = STAR_COLORS[tier.name.length % STAR_COLORS.length]

  return (
    <div className={style.cardClass}>
      {/* Floating decorative star */}
      <div
        className="crayon-float-star"
        style={{ top: '-18px', right: '12px' }}
      >
        <CrayonStar color={starColor} size={36} />
      </div>

      {/* Locked banner */}
      {tier.locked && (
        <div className="crayon-locked-banner">🔒 LOCKED (help unlock it!!)</div>
      )}

      {/* Tier name */}
      <div className={style.nameClass}>
        {tier.name === 'Free' && 'fReE'}
        {tier.name === 'Pro' && 'pRo!!'}
        {tier.name === 'Enterprise' && 'eNtErPrIsE'}
      </div>

      {/* Kid voice */}
      <p
        style={{
          fontSize: '0.85rem',
          color: '#92400e',
          fontWeight: 700,
          marginTop: '0.5rem',
          transform: `rotate(${tier.name === 'Pro' ? '1deg' : '-0.5deg'})`,
        }}
      >
        {style.kidVoice}
      </p>

      {/* Price circle */}
      <div style={{ textAlign: 'center', margin: '1rem 0' }}>
        <div className="crayon-price-circle">{tier.price}</div>
      </div>

      {/* Squiggly divider */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          margin: '0.5rem 0',
        }}
      >
        <SquigglyLine
          width={160}
          color={tier.featured ? '#9333ea' : '#f97316'}
        />
      </div>

      {/* Features */}
      <ul className="crayon-features">
        {tier.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>

      {/* CTA */}
      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        {tier.ctaHref ? (
          <a
            href={tier.ctaHref}
            className={style.buttonClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            {tier.cta}
          </a>
        ) : (
          <span className={style.buttonClass}>{tier.cta}</span>
        )}
      </div>
    </div>
  )
}
