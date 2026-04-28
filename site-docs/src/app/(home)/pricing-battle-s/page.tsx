import { ConstructivistCard } from '@/components/pricing-battle-s/constructivist-card'
import { ConstructivistFooter } from '@/components/pricing-battle-s/constructivist-footer'
import { ConstructivistHero } from '@/components/pricing-battle-s/constructivist-hero'
import { TIERS } from '@/components/pricing-battle-s/tier-data'
import '@/components/pricing-battle-s/constructivist.css'

export default function PricingBattleS() {
  return (
    <div className="lissitzky-page">
      {/* Suprematist background shapes */}
      <div className="lissitzky-shapes" aria-hidden="true">
        <div className="lissitzky-shapes__rect lissitzky-shapes__rect--1" />
        <div className="lissitzky-shapes__rect lissitzky-shapes__rect--2" />
        <div className="lissitzky-shapes__rect lissitzky-shapes__rect--3" />
        <div className="lissitzky-shapes__rect lissitzky-shapes__rect--4" />
      </div>

      {/* Scattered geometric decorations */}
      <div
        className="lissitzky-circle lissitzky-circle--lg"
        style={{ top: '40%', right: '-4rem', opacity: 0.06 }}
        aria-hidden="true"
      />
      <div
        className="lissitzky-circle lissitzky-circle--md lissitzky-circle--filled"
        style={{ bottom: '20%', left: '-2rem', opacity: 0.05 }}
        aria-hidden="true"
      />
      <div
        className="lissitzky-bar"
        style={{
          width: '4px',
          height: '300px',
          top: '25%',
          left: '12%',
          transform: 'rotate(-20deg)',
          opacity: 0.08,
        }}
        aria-hidden="true"
      />

      <ConstructivistHero />

      <main className="lissitzky-grid">
        {TIERS.map((tier, i) => (
          <ConstructivistCard key={tier.name} tier={tier} index={i} />
        ))}
      </main>

      <ConstructivistFooter />
    </div>
  )
}
