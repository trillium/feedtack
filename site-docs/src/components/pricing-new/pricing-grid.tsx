import { TierCardNew } from '@/components/pricing-new/tier-card'
import { TIERS } from '@/data/pricing-tiers'

export function PricingGridNew() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 pb-20">
      {/* Ambient glow behind cards */}
      <div
        className="pointer-events-none absolute left-1/2 top-8 -translate-x-1/2 h-[600px] w-[700px] opacity-[0.03]"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse at center, #3b82f6 0%, transparent 65%)',
        }}
      />

      <div className="relative grid items-start gap-6 lg:grid-cols-3 lg:gap-8">
        {TIERS.map((tier) => (
          <TierCardNew key={tier.name} tier={tier} />
        ))}
      </div>

      {/* Trust line */}
      <div className="mt-14 flex flex-col items-center gap-4">
        <div className="h-px w-40 hr-shimmer" />
        <p className="text-xs tracking-widest uppercase text-fd-muted-foreground/50 font-medium">
          No credit card &middot; No usage limits &middot; No catch
        </p>
      </div>
    </section>
  )
}
