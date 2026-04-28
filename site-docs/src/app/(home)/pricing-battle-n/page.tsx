import { OlympicCard } from '@/components/pricing-battle-n/olympic-card'
import {
  PictogramCode,
  PictogramPin,
  PictogramShield,
  PictogramTarget,
} from '@/components/pricing-battle-n/pictograms'
import { TIERS } from '@/components/pricing-battle-n/tier-data'
import '@/components/pricing-battle-n/olympic.css'

export const metadata = {
  title: 'Pricing — Munich 72',
  description:
    "Feedtack pricing in the style of Otl Aicher's Munich 1972 Olympics.",
}

const MUNICH_COLORS = [
  'var(--munich-blue)',
  'var(--munich-green)',
  'var(--munich-orange)',
  'var(--munich-yellow)',
]

const CAPABILITY_PICTOGRAMS = [
  { icon: PictogramPin, label: 'Pins', color: 'var(--munich-blue)' },
  { icon: PictogramTarget, label: 'Targeting', color: 'var(--munich-green)' },
  { icon: PictogramCode, label: 'TypeScript', color: 'var(--munich-orange)' },
  { icon: PictogramShield, label: 'Adapters', color: 'var(--munich-yellow)' },
  { icon: PictogramPin, label: 'Scopes', color: 'var(--munich-green)' },
  { icon: PictogramTarget, label: 'Theming', color: 'var(--munich-blue)' },
]

export default function PricingBattleN() {
  return (
    <div className="olympic-page">
      {/* Munich palette stripe banner */}
      <div className="olympic-stripe-banner" aria-hidden="true">
        {MUNICH_COLORS.map((color) => (
          <span key={color} style={{ background: color }} />
        ))}
      </div>

      {/* Systematic grid background */}
      <div style={{ position: 'relative' }}>
        <div className="olympic-grid-bg" aria-hidden="true" />

        {/* Header */}
        <header className="olympic-header">
          {/* Decorative rings nod */}
          <div className="olympic-rings" aria-hidden="true">
            <span style={{ color: 'var(--munich-blue)' }} />
            <span style={{ color: 'var(--munich-green)' }} />
            <span style={{ color: 'var(--munich-orange)' }} />
            <span style={{ color: 'var(--munich-yellow)' }} />
          </div>

          <h1>Pricing</h1>
          <p>
            Every plan. Same finish line.
            <br />
            All free. All equal. All gold.
          </p>
        </header>

        {/* Pictogram capability grid */}
        <section
          className="olympic-pictogram-grid"
          aria-label="Core capabilities"
        >
          {CAPABILITY_PICTOGRAMS.map((item) => (
            <div key={item.label} className="olympic-pictogram-cell">
              <item.icon color={item.color} />
              <span>{item.label}</span>
            </div>
          ))}
        </section>

        {/* Tier cards */}
        <section className="olympic-grid">
          {TIERS.map((tier) => (
            <OlympicCard key={tier.name} tier={tier} />
          ))}
        </section>

        {/* Footer */}
        <footer className="olympic-footer">
          <p>
            Feedtack is open source. Every feature is free, forever.
            <br />
            The only competition is how fast you can npm install.
          </p>
        </footer>

        {/* Bottom stripe */}
        <div className="olympic-stripe-banner" aria-hidden="true">
          {MUNICH_COLORS.map((color) => (
            <span key={color} style={{ background: color }} />
          ))}
        </div>
      </div>
    </div>
  )
}
