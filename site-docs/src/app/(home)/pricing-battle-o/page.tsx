import type { Metadata } from 'next'
import { LubalinPricing } from '@/components/pricing-battle-o/lubalin-pricing'

export const metadata: Metadata = {
  title: 'Pricing — Feedtack',
  description:
    'Choose the plan that is right for you. Spoiler: they are all the same.',
}

export default function PricingBattleOPage() {
  return <LubalinPricing />
}
