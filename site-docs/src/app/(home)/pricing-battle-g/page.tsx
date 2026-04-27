import { HadidBackground, HadidWaveDivider } from '@/components/pricing-battle-g/hadid-background'
import { HadidGrid } from '@/components/pricing-battle-g/hadid-grid'
import { HadidOpenSource } from '@/components/pricing-battle-g/hadid-open-source'
import { HadidTierZone } from '@/components/pricing-battle-g/hadid-tier-zone'
import { TIERS } from '@/data/pricing-tiers'
import '@/components/pricing-battle-g/hadid.css'

export default function PricingBattleGPage() {
  return (
    <div className="hadid-page">
      {/* Parametric background layers */}
      <HadidBackground />
      <HadidGrid />

      {/* Hero */}
      <section className="hadid-hero">
        {/* Parametric arc decoration */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 1200 400"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M-50,350 Q300,50 600,200 T1250,100"
            stroke="var(--color-fd-border)"
            strokeWidth="0.8"
            opacity="0.3"
          />
          <path
            d="M-50,380 Q350,80 650,230 T1250,130"
            stroke="var(--color-fd-border)"
            strokeWidth="0.5"
            opacity="0.2"
          />
        </svg>
        <h1 className="hadid-hero-title">
          Pricing
        </h1>
        <p className="hadid-hero-subtitle">
          Three tiers. One price. Zero compromise.
        </p>
        <p className="hadid-hero-tagline">
          Spoiler: they&apos;re all free forever.
        </p>
      </section>

      {/* Wave transition */}
      <HadidWaveDivider />

      {/* Tier zones */}
      <section className="hadid-tiers">
        {TIERS.map((tier) => (
          <HadidTierZone key={tier.name} tier={tier} />
        ))}
      </section>

      {/* Open source callout */}
      <HadidOpenSource />
    </div>
  )
}
