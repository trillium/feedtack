import { DetroitFooter } from '@/components/pricing-battle-aa/detroit-footer'
import { DetroitHero } from '@/components/pricing-battle-aa/detroit-hero'
import { DetroitTier } from '@/components/pricing-battle-aa/detroit-tier'
import { VerseBreak } from '@/components/pricing-battle-aa/verse-break'
import { TIERS } from '@/data/pricing-tiers'
import '@/components/pricing-battle-aa/detroit.css'

export const metadata = {
  title: 'Pricing',
  description:
    'Feedtack pricing — three tiers, one price, zero dollars. You only get one shot.',
}

/**
 * Pricing page AA — Detroit Grit.
 *
 * Dark backgrounds, stark white type, aggressive layout.
 * 8 Mile road signs, battle rap energy, words that hit hard.
 * Every pixel earned. No softness.
 */
export default function PricingBattleAAPage() {
  return (
    <div className="detroit-page">
      <DetroitHero />

      <VerseBreak label="Drop the beat" />

      <section className="detroit-grid">
        {TIERS.map((tier, i) => (
          <DetroitTier key={tier.name} tier={tier} index={i} />
        ))}
      </section>

      <VerseBreak label="Final round" />

      <DetroitFooter />
    </div>
  )
}
