import type { Metadata } from 'next'
import { ScrappyPricing } from '@/components/pricing-battle-u/scrappy-pricing'
import { TIERS } from '@/data/pricing-tiers'

export const metadata: Metadata = {
  title: 'Pricing – Feedtack',
  description:
    'Simple, transparent pricing. No hidden fees. No pricing at all, actually.',
}

export default function PricingBattleUPage() {
  return <ScrappyPricing tiers={TIERS} />
}
