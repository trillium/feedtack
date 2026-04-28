import s from '@/components/pricing-battle-ac/pricing.module.css'
import { PricingCard } from '@/components/pricing-battle-ac/pricing-card'
import { PricingFootnote } from '@/components/pricing-battle-ac/pricing-footnote'
import { PricingHeader } from '@/components/pricing-battle-ac/pricing-header'
import { TIERS } from '@/data/pricing-tiers'

export const metadata = {
  title: 'Pricing',
  description: 'Feedtack pricing — three tiers, one price, all free forever.',
}

export default function PricingBattleAcPage() {
  return (
    <div className={`${s.surface} min-h-screen`}>
      <PricingHeader />

      <main className="flex justify-center px-4 pb-8 md:px-6">
        <ul className={s.grid} aria-label="Pricing plans">
          {TIERS.map((tier) => (
            <li key={tier.name} className="list-none">
              <PricingCard tier={tier} />
            </li>
          ))}
        </ul>
      </main>

      <footer className="flex justify-center">
        <PricingFootnote />
      </footer>
    </div>
  )
}
