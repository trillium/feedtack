import { CooperFooter } from '@/components/pricing-battle-r/cooper-footer'
import { CooperHero } from '@/components/pricing-battle-r/cooper-hero'
import { CooperTierCard } from '@/components/pricing-battle-r/cooper-tier-card'
import { TIERS } from '@/components/pricing-battle-r/tier-data'
import '@/components/pricing-battle-r/cooper.css'

export const metadata = {
  title: 'Pricing — Muriel Cooper',
  description:
    'Feedtack pricing plans in the style of Muriel Cooper and the MIT Media Lab.',
}

export default function PricingBattleR() {
  return (
    <div className="cooper-scene">
      {/* Information landscape background */}
      <div className="cooper-landscape" aria-hidden="true" />
      <div className="cooper-grid" aria-hidden="true" />

      {/* Floating axis labels */}
      <div className="cooper-axis cooper-axis--left" aria-hidden="true">
        Information Landscape
      </div>
      <div className="cooper-axis cooper-axis--right" aria-hidden="true">
        Depth of Field
      </div>

      {/* Layered typographic hero */}
      <CooperHero />

      {/* Coordinate readout */}
      <div className="cooper-coords" aria-hidden="true">
        x: 0.00 &nbsp; y: 0.00 &nbsp; z: 0.00 &nbsp; — &nbsp; 3 planes visible
      </div>

      {/* Tier cards as floating planes */}
      <section className="cooper-tiers">
        {TIERS.map((tier, i) => (
          <CooperTierCard key={tier.name} tier={tier} index={i} />
        ))}
      </section>

      <CooperFooter />
    </div>
  )
}
