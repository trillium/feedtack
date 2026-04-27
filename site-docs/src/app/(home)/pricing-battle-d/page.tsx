import { RamsFooterNote } from '@/components/pricing-battle-d/rams-footer-note'
import { RamsPricingGrid } from '@/components/pricing-battle-d/rams-pricing-grid'
import { RamsPricingHero } from '@/components/pricing-battle-d/rams-pricing-hero'
import { TIERS } from '@/data/pricing-tiers'

export const metadata = {
  title: 'Pricing',
  description:
    'Feedtack pricing — three tiers, one price, zero dollars. Open source.',
}

/**
 * Pricing page D — Dieter Rams.
 *
 * "Good design is as little design as possible."
 * Less, but better. Every element earns its place.
 */
export default function PricingBattleDPage() {
  return (
    <main
      style={{ minHeight: '100vh', background: 'var(--color-fd-background)' }}
    >
      <RamsPricingHero />
      <RamsPricingGrid tiers={TIERS} />
      <RamsFooterNote />
    </main>
  )
}
