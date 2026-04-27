import { CarsonColophon } from '@/components/pricing-battle-h/CarsonColophon'
import { CarsonHero } from '@/components/pricing-battle-h/CarsonHero'
import { CarsonTier } from '@/components/pricing-battle-h/CarsonTier'
import s from '@/components/pricing-battle-h/carson.module.css'
import { TIERS } from '@/data/pricing-tiers'

const TEXTURE_LINE =
  'feedtack feedtack feedtack $0 $0 $0 open source mit license free forever '

export default function PricingBattleH() {
  return (
    <div className={s.arena}>
      {/* vertical column rules */}
      <div className={`${s.vertRule} ${s.vertRule1}`} aria-hidden="true" />
      <div className={`${s.vertRule} ${s.vertRule2}`} aria-hidden="true" />
      <div className={`${s.vertRule} ${s.vertRule3}`} aria-hidden="true" />

      {/* text as texture — repeating background */}
      <div className={s.textTexture} aria-hidden="true">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`tex-${i.toString()}`}
            className={s.textTextureLine}
            style={{ transform: `rotate(${-2 + (i % 3)}deg)` }}
          >
            {TEXTURE_LINE.repeat(4)}
          </div>
        ))}
      </div>

      {/* diagonal slashes */}
      <div
        className={s.diagonalSlash}
        style={{ top: '25%', left: '-20%', transform: 'rotate(-18deg)' }}
        aria-hidden="true"
      />
      <div
        className={s.diagonalSlash}
        style={{ top: '65%', left: '-10%', transform: 'rotate(10deg)' }}
        aria-hidden="true"
      />
      <div
        className={s.diagonalSlash}
        style={{ top: '85%', left: '-15%', transform: 'rotate(-5deg)' }}
        aria-hidden="true"
      />

      {/* scattered oversized glyphs */}
      <span
        className={s.scatteredNum}
        style={{
          top: '8%',
          left: '3%',
          fontSize: '24rem',
          transform: 'rotate(-10deg)',
        }}
        aria-hidden="true"
      >
        $
      </span>
      <span
        className={s.scatteredNum}
        style={{
          top: '45%',
          right: '1%',
          fontSize: '18rem',
          transform: 'rotate(15deg)',
        }}
        aria-hidden="true"
      >
        0
      </span>
      <span
        className={s.scatteredNum}
        style={{
          bottom: '5%',
          left: '15%',
          fontSize: '12rem',
          transform: 'rotate(-3deg)',
          opacity: 0.015,
        }}
        aria-hidden="true"
      >
        &amp;
      </span>

      {/* hero */}
      <CarsonHero />

      {/* horizontal strip divider */}
      <div className={s.horizStrip} aria-hidden="true" />

      {/* tier cards — anti-grid */}
      <section className={s.tiersZone}>
        <div className={s.tiersGrid}>
          {TIERS.map((tier, i) => (
            <CarsonTier key={tier.name} tier={tier} index={i} />
          ))}
        </div>
      </section>

      {/* colophon */}
      <CarsonColophon />
    </div>
  )
}
