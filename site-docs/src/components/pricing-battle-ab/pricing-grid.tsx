import type { Tier } from '@/data/pricing-tiers'
import { TierCard } from './tier-card'

export function PricingGrid({ tiers }: { tiers: Tier[] }) {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-24 pt-12">
      <div className="grid items-start gap-6 lg:grid-cols-3 lg:gap-8">
        {tiers.map((tier) => (
          <TierCard key={tier.name} tier={tier} />
        ))}
      </div>
    </section>
  )
}
