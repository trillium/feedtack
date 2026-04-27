import { KusamaCard } from '@/components/pricing-battle-i/kusama-card'
import { KusamaOrbs } from '@/components/pricing-battle-i/kusama-orbs'
import '@/components/pricing-battle-i/kusama.css'
import { TIERS } from '@/data/pricing-tiers'

export default function KusamaPricingPage() {
  return (
    <div className="kusama-page">
      {/* Infinite dot field — the cosmos of polka dots */}
      <div className="kusama-dotfield" aria-hidden="true" />
      <div className="kusama-net" aria-hidden="true" />

      {/* Floating orbs — pumpkins in the void */}
      <KusamaOrbs />

      {/* Hero */}
      <section className="kusama-hero">
        <h1 className="kusama-title">
          <span className="kusama-title-ring" aria-hidden="true" />
          Pricing
        </h1>
        <p className="kusama-subtitle">
          Choose the plan that&apos;s right for you.
          <br />
          <span className="kusama-subtitle-dot" aria-hidden="true" />
          Spoiler: they&apos;re all the same.
          <span className="kusama-subtitle-dot" aria-hidden="true" />
        </p>
      </section>

      {/* Tier cards */}
      <section className="kusama-grid">
        {TIERS.map((tier, i) => (
          <KusamaCard key={tier.name} tier={tier} index={i} />
        ))}
      </section>

      {/* Infinity message */}
      <div className="kusama-infinity">
        <div className="kusama-infinity__symbol" aria-hidden="true">
          &#8734;
        </div>
        <p className="kusama-infinity__text">
          Open source forever. Dots all the way down.
        </p>
      </div>
    </div>
  )
}
