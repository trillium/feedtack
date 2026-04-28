import { TIERS } from '@/components/pricing-battle-w/tier-data'
import { TwFooter } from '@/components/pricing-battle-w/tw-footer'
import { TwHeader } from '@/components/pricing-battle-w/tw-header'
import { TwTierCard } from '@/components/pricing-battle-w/tw-tier-card'
import '@/components/pricing-battle-w/tailwind-maximalist.css'

export const metadata = {
  title: 'Pricing — The Tailwind Maximalist',
  description:
    'Feedtack pricing — three tiers, one price, all free forever. Now with 47 utility classes per div.',
}

export default function PricingBattleWPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100 antialiased selection:bg-purple-500/30 selection:text-white">
      {/* Full-page gradient mesh background */}
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-950/50 via-slate-950 to-slate-950"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-950/30 via-transparent to-transparent"
        aria-hidden="true"
      />

      {/* Dot grid overlay */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgb(148 163 184) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10">
        <TwHeader />

        {/* Tier grid: 1 col mobile → 3 col desktop */}
        <section className="relative mx-auto grid max-w-sm grid-cols-1 gap-6 px-4 pb-8 sm:max-w-2xl sm:grid-cols-2 sm:gap-8 sm:px-6 md:max-w-5xl md:grid-cols-3 md:px-8 lg:max-w-6xl lg:gap-10 lg:px-12 xl:max-w-7xl">
          {TIERS.map((tier, i) => (
            <TwTierCard key={tier.name} tier={tier} index={i} />
          ))}
        </section>

        <TwFooter />
      </div>
    </div>
  )
}
