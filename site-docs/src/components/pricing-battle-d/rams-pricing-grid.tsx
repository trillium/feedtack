import type { Tier } from '@/data/pricing-tiers'
import s from './rams.module.css'
import { RamsTierCard } from './rams-tier-card'

/**
 * Three-column grid of tier cards.
 * Equal columns, no hierarchy tricks -- the content speaks.
 */
export function RamsPricingGrid({ tiers }: { tiers: Tier[] }) {
  return (
    <section className={s.grid}>
      <div className={s.gridInner}>
        {tiers.map((tier) => (
          <RamsTierCard key={tier.name} tier={tier} />
        ))}
      </div>
    </section>
  )
}
