import type { Metadata } from 'next'
import { BloombergFooter } from '@/components/pricing-battle-ad/bloomberg-footer'
import { HeroSection } from '@/components/pricing-battle-ad/hero-section'
import { MarketPanel } from '@/components/pricing-battle-ad/market-panel'
import { StatusBar } from '@/components/pricing-battle-ad/status-bar'
import { TickerBar } from '@/components/pricing-battle-ad/ticker-bar'
import { TierCard } from '@/components/pricing-battle-ad/tier-card'
import { TrustSection } from '@/components/pricing-battle-ad/trust-section'
import { TIERS } from '@/data/pricing-tiers'
import '@/components/pricing-battle-ad/bloomberg.css'

export const metadata: Metadata = {
  title: 'Pricing — Feedtack Capital Markets',
  description:
    'Institutional-grade feedback infrastructure. Zero cost. Infinite returns.',
}

/** Market terms per tier — the Wall Street flavor text */
const TIER_MARKET_TERMS = [
  {
    badge: '',
    changeLabel: 'STABLE +0.00%',
    changeColor: '#00d26a',
  },
  {
    badge: 'ALPHA',
    changeLabel: 'OUTPERFORM +0.00%',
    changeColor: '#d4a843',
  },
  {
    badge: 'INVITATION ONLY',
    changeLabel: 'OVERWEIGHT +0.00%',
    changeColor: '#3b82f6',
  },
]

export default function PricingBattleAD() {
  return (
    <div className="bloomberg-page">
      <TickerBar />
      <StatusBar />

      <HeroSection />

      {/* Invitation banner */}
      <div className="invitation-banner">
        <p className="invitation-text">
          Select Your Position &mdash; All Instruments Priced at Par
        </p>
        <p className="invitation-sub">
          Every tier is $0. This is not financial advice. This is an npm
          package.
        </p>
      </div>

      {/* Tier cards */}
      <section className="tiers-section">
        <div className="tiers-section-header">
          <span className="tiers-section-title">
            Investment Vehicles &mdash; Q4 2025
          </span>
          <span className="tiers-section-subtitle">
            All positions held at $0.00 | No margin required
          </span>
        </div>

        <div className="tiers-grid">
          {TIERS.map((tier, i) => (
            <TierCard
              key={tier.name}
              tier={tier}
              index={i}
              marketTerms={TIER_MARKET_TERMS[i]}
            />
          ))}
        </div>
      </section>

      <TrustSection />
      <MarketPanel />
      <BloombergFooter />
    </div>
  )
}
