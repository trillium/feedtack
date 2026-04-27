import '@/components/pricing-new/pricing-new.css'
import { AuroraBg } from '@/components/pricing-new/aurora-bg'
import { PricingGridNew } from '@/components/pricing-new/pricing-grid'
import { PricingHeroNew } from '@/components/pricing-new/pricing-hero'
import { SponsorSectionNew } from '@/components/pricing-new/sponsor-section'

export default function PricingNewPage() {
  return (
    <>
      <AuroraBg>
        <PricingHeroNew />
        <PricingGridNew />
      </AuroraBg>
      <SponsorSectionNew />
    </>
  )
}
