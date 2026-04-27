import { BrutalistFooter } from '@/components/pricing-battle-a/brutalist-footer'
import { BrutalistHeader } from '@/components/pricing-battle-a/brutalist-header'
import { EnterpriseTierBlock } from '@/components/pricing-battle-a/enterprise-tier-block'
import { FreeTierBlock } from '@/components/pricing-battle-a/free-tier-block'
import { ProTierBlock } from '@/components/pricing-battle-a/pro-tier-block'
import { TIERS } from '@/components/pricing-battle-a/tier-data'
import '@/components/pricing-battle-a/brutalist.css'

export default function PricingBattleA() {
  const [free, pro, enterprise] = TIERS

  return (
    <div
      className="min-h-screen bg-fd-background text-fd-foreground"
      style={{ fontFamily: 'monospace' }}
    >
      <BrutalistHeader />

      {/* Asymmetric zine layout */}
      <main
        className="relative mx-auto max-w-6xl px-4 py-8"
        style={{ paddingLeft: '2rem', paddingRight: '2rem' }}
      >
        {/* Grid overlay */}
        <div
          className="brutalist-grid-overlay pointer-events-none absolute inset-0"
          aria-hidden="true"
        />

        {/* Rotated margin label */}
        <div
          className="pointer-events-none absolute top-16 z-10"
          style={{ left: '-0.5rem' }}
          aria-hidden="true"
        >
          <span
            className="block text-fd-muted-foreground/20"
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: 'left top',
              fontSize: '0.6rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            Plans &amp; Pricing
          </span>
        </div>

        {/* Row 1: Free + Pro — asymmetric via CSS grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 3fr',
            gap: '1.5rem',
            alignItems: 'start',
            overflow: 'visible',
          }}
        >
          <div className="relative">
            <FreeTierBlock tier={free} />
            <div
              className="mt-2 text-fd-muted-foreground/40"
              style={{ fontSize: '0.55rem', letterSpacing: '0.1em' }}
            >
              FIG. 1 — Standard tier. No strings attached.
            </div>
          </div>

          <div
            className="relative"
            style={{ marginTop: '-1rem', overflow: 'visible' }}
          >
            <ProTierBlock tier={pro} />
            <div
              className="mt-2 text-fd-muted-foreground/40"
              style={{ fontSize: '0.55rem', letterSpacing: '0.1em' }}
            >
              FIG. 2 — Recommended. Same as Fig. 1, but more prestige.
            </div>
          </div>
        </div>

        {/* Divider with annotation */}
        <div className="relative" style={{ margin: '3rem 0' }}>
          <div className="border-t-2 border-fd-foreground" />
          <span
            className="absolute bg-fd-background px-3 text-fd-muted-foreground/50"
            style={{
              top: '-0.5rem',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '0.55rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            Below the fold
          </span>
        </div>

        {/* Row 2: Enterprise — centered, narrower */}
        <div className="relative mx-auto" style={{ maxWidth: '36rem' }}>
          <EnterpriseTierBlock tier={enterprise} />
          <div
            className="mt-2 text-fd-muted-foreground/40"
            style={{ fontSize: '0.55rem', letterSpacing: '0.1em' }}
          >
            FIG. 3 — Classified. Clearance required (submit PR).
          </div>
        </div>

        {/* Margin note — bottom right */}
        <div
          className="pointer-events-none absolute bottom-12"
          style={{ right: '-0.5rem' }}
          aria-hidden="true"
        >
          <span
            className="block text-fd-muted-foreground/15"
            style={{
              transform: 'rotate(90deg)',
              transformOrigin: 'right bottom',
              fontSize: '0.55rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            End of pricing schedule
          </span>
        </div>
      </main>

      <BrutalistFooter />
    </div>
  )
}
