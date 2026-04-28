import type { Metadata } from 'next'
import { GrizzledPricingTable } from '@/components/pricing-battle-v'
import { TIERS } from '@/data/pricing-tiers'

export const metadata: Metadata = {
  title: 'Pricing — feedtack-pricing(7)',
  description:
    'How much feedtack costs (nothing). The man page of pricing pages.',
}

export default function PricingBattleV() {
  return <GrizzledPricingTable tiers={TIERS} />
}
