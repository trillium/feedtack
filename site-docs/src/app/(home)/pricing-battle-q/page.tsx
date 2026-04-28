import type { Metadata } from 'next'
import { MonolithCard } from '@/components/pricing-battle-q/monolith-card'
import { PrismHero } from '@/components/pricing-battle-q/prism-hero'
import { TIERS } from '@/components/pricing-battle-q/tier-data'
import '@/components/pricing-battle-q/thorgerson.css'

export const metadata: Metadata = {
  title: 'Pricing — Feedtack',
  description:
    'Choose your tier. They are all free. This is an open-source project.',
}

export default function PricingBattleQ() {
  const [free, pro, enterprise] = TIERS

  return (
    <div className="thorgerson-landscape">
      {/* Vignette overlay */}
      <div className="thorgerson-vignette" />

      {/* Horizon glow */}
      <div className="thorgerson-horizon" />

      {/* Floating surreal shapes */}
      <div className="floating-shape floating-shape--triangle" />
      <div className="floating-shape floating-shape--circle" />
      <div className="floating-shape floating-shape--rectangle" />

      {/* Extended rainbow beams across landscape */}
      <div className="rainbow-beam rainbow-beam--left" />
      <div className="rainbow-beam rainbow-beam--right" />

      {/* The Prism */}
      <PrismHero />

      {/* Title */}
      <div className="thorgerson-title">
        <h1>Pricing</h1>
        <p>Choose the plan that&apos;s right for you. They&apos;re all free.</p>
      </div>

      {/* Monolith tier cards */}
      <div className="thorgerson-tiers">
        <MonolithCard tier={free} variant="free" />
        <MonolithCard tier={pro} variant="pro" />
        <MonolithCard tier={enterprise} variant="enterprise" />
      </div>

      {/* Footer */}
      <footer className="thorgerson-footer">
        <p>
          Feedtack is open source.{' '}
          <a
            href="https://github.com/trillium/feedtack"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </p>
      </footer>
    </div>
  )
}
