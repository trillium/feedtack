import { PricingCard } from '@/components/pricing-battle-y/pricing-card'
import { PricingFooter } from '@/components/pricing-battle-y/pricing-footer'
import { PricingHero } from '@/components/pricing-battle-y/pricing-hero'
import s from '@/components/pricing-battle-y/savanna.module.css'
import { TIERS } from '@/data/pricing-tiers'

export const metadata = {
  title: 'Pricing',
  description:
    'Feedtack pricing — three elevated tiers, one grounded price, all free forever.',
}

export default function PricingBattleYPage() {
  return (
    <div className={s.page}>
      <PricingHero />

      <section className={s.cardGrid}>
        {TIERS.map((tier) => (
          <PricingCard key={tier.name} tier={tier} />
        ))}
      </section>

      <PricingFooter />
    </div>
  )
}
