import s from '@/components/pricing-battle-b/editorial.module.css'
import { EditorialColophon } from '@/components/pricing-battle-b/editorial-colophon'
import {
  sansFont,
  serifFont,
} from '@/components/pricing-battle-b/editorial-fonts'
import { EditorialHero } from '@/components/pricing-battle-b/editorial-hero'
import { EditorialPullQuote } from '@/components/pricing-battle-b/editorial-pull-quote'
import { TierSection } from '@/components/pricing-battle-b/tier-section'
import { TIERS } from '@/data/pricing-tiers'

export const metadata = {
  title: 'Pricing',
  description: 'Feedtack pricing — three tiers, one price, all free forever.',
}

export default function PricingBattleBPage() {
  return (
    <div
      className={s.page}
      style={{
        '--font-serif': "'Cormorant Garamond', Georgia, serif",
        '--font-sans': "'DM Sans', 'Helvetica Neue', sans-serif",
      } as React.CSSProperties}
    >
      <EditorialHero />

      {TIERS.map((tier, i) => (
        <TierSection key={tier.name} tier={tier} index={i} />
      ))}

      <EditorialPullQuote />
      <EditorialColophon />
    </div>
  )
}
