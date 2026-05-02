import type { Metadata } from 'next'
import { OxmanPricing } from '@/components/pricing-battle-p/oxman-pricing'

export const metadata: Metadata = {
  title: 'Pricing — Material Ecology',
  description:
    'Bio-inspired parametric pricing. Every tier is free, every feature a cell in the same organism.',
}

export default function PricingBattlePPage() {
  return <OxmanPricing />
}
