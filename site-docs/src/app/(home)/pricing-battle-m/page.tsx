import { DeconstructedCard } from '@/components/pricing-battle-m/deconstructed-card'
import '@/components/pricing-battle-m/kawakubo.css'
import { TIERS } from '@/data/pricing-tiers'

export const metadata = {
  title: 'Pricing',
  description:
    'Feedtack pricing — deconstructed. Three tiers, zero cost, open source.',
}

export default function PricingBattleM() {
  return (
    <div className="cdg-page">
      {/* Void circles — scattered negative space */}
      <div className="cdg-void cdg-void--1" aria-hidden="true" />
      <div className="cdg-void cdg-void--2" aria-hidden="true" />
      <div className="cdg-void cdg-void--3" aria-hidden="true" />

      {/* Margin notes */}
      <div className="cdg-margin-note cdg-margin-note--left" aria-hidden="true">
        comme des prix
      </div>
      <div
        className="cdg-margin-note cdg-margin-note--right"
        aria-hidden="true"
      >
        object &amp; subject
      </div>

      {/* Anti-label watermark */}
      <div className="cdg-anti-label" aria-hidden="true">
        pricing
      </div>

      {/* Header — deconstructed title */}
      <header className="cdg-header">
        <div className="cdg-header__void" aria-hidden="true" />
        <h1 className="cdg-header__title">
          <span className="cdg-strike">Pay</span> <span>Nothing</span>
        </h1>
        <p className="cdg-header__subtitle">
          Three tiers. One price. The absence of cost as form.
        </p>
      </header>

      {/* Intentional negative space */}
      <div className="cdg-negative-space" aria-hidden="true" />

      {/* Tier grid with stitch marks */}
      <section className="cdg-grid" aria-label="Pricing tiers">
        {/* Stitch lines — raw garment seams */}
        <div className="cdg-stitch cdg-stitch--1" aria-hidden="true" />
        <div className="cdg-stitch cdg-stitch--2" aria-hidden="true" />

        {TIERS.map((tier) => (
          <DeconstructedCard key={tier.name} tier={tier} />
        ))}
      </section>

      {/* Footer */}
      <footer className="cdg-footer">
        <p className="cdg-footer__text">
          Open source
          <em className="cdg-footer__heart">/</em>
          Free forever
          <em className="cdg-footer__heart">/</em>
          Anti-establishment pricing
        </p>
      </footer>
    </div>
  )
}
