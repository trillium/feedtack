import { PricingFooter } from '@/components/pricing-battle-ab/pricing-footer'
import { PricingGrid } from '@/components/pricing-battle-ab/pricing-grid'
import { PricingHeader } from '@/components/pricing-battle-ab/pricing-header'
import { TIERS } from '@/data/pricing-tiers'

export const metadata = {
  title: 'Pricing',
  description: 'Feedtack pricing — three tiers, one price, all free forever.',
}

export default function PricingBattleAbPage() {
  return (
    <div className="min-h-screen bg-fd-background text-fd-foreground">
      <PricingHeader />
      <PricingGrid tiers={TIERS} />
      <PricingFooter />
    </div>
  )
}
