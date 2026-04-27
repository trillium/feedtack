import { PricingHero } from '@/components/pricing-hero'
import { SponsorSection } from '@/components/sponsor-section'
import { TierCard } from '@/components/tier-card'
import { TIERS } from '@/data/pricing-tiers'

export default function PricingPage() {
  return (
    <>
      <PricingHero />

      <section className="mx-auto max-w-6xl px-6 pb-32">
        <div className="grid items-start gap-8 lg:grid-cols-3">
          {TIERS.map((tier) => (
            <TierCard key={tier.name} tier={tier} />
          ))}
        </div>
      </section>

      <SponsorSection />
    </>
  )
}
