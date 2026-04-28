import { GhibliCard } from '@/components/pricing-battle-z/ghibli-card'
import { GhibliFooter } from '@/components/pricing-battle-z/ghibli-footer'
import { GhibliHeader } from '@/components/pricing-battle-z/ghibli-header'
import { TIERS } from '@/components/pricing-battle-z/tier-data'
import '@/components/pricing-battle-z/ghibli.css'

export const metadata = {
  title: 'Pricing — Feedtack',
  description: 'Choose your path. All plans are free, like the wind.',
}

export default function PricingBattleZ() {
  const [free, pro, enterprise] = TIERS

  return (
    <div className="ghibli-sky">
      {/* Floating clouds */}
      <div className="ghibli-cloud ghibli-cloud-1" aria-hidden="true" />
      <div className="ghibli-cloud ghibli-cloud-2" aria-hidden="true" />
      <div className="ghibli-cloud ghibli-cloud-3" aria-hidden="true" />

      {/* Wind lines */}
      <div className="wind-line wind-line-1" aria-hidden="true" />
      <div className="wind-line wind-line-2" aria-hidden="true" />
      <div className="wind-line wind-line-3" aria-hidden="true" />

      {/* Soot sprites — 11 years of drawing these, they appear everywhere now */}
      <div className="soot-sprite soot-sprite-1" aria-hidden="true" />
      <div className="soot-sprite soot-sprite-2" aria-hidden="true" />
      <div className="soot-sprite soot-sprite-3" aria-hidden="true" />

      <GhibliHeader />

      {/* Pricing cards */}
      <main
        className="relative z-10 mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          alignItems: 'start',
        }}
      >
        <GhibliCard tier={free} />
        <div style={{ marginTop: '-0.5rem' }}>
          <GhibliCard tier={pro} />
        </div>
        <GhibliCard tier={enterprise} />
      </main>

      {/* Rolling hills at the bottom */}
      <div className="ghibli-hills" aria-hidden="true">
        <div className="ghibli-hill ghibli-hill-1 grass-sway" />
        <div
          className="ghibli-hill ghibli-hill-2 grass-sway"
          style={{ animationDelay: '-1s' }}
        />
        <div
          className="ghibli-hill ghibli-hill-3 grass-sway"
          style={{ animationDelay: '-2s' }}
        />
      </div>

      <GhibliFooter />
    </div>
  )
}
