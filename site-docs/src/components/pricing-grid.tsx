import { TierCard } from '@/components/tier-card'
import { TIERS } from '@/data/pricing-tiers'

export function PricingGrid() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 pb-24">
      {/* Ambient glow behind the featured card */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[600px] opacity-[0.04]"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse at center, #3b82f6 0%, transparent 70%)',
        }}
      />

      <div className="relative grid items-start gap-6 lg:grid-cols-3 lg:gap-8">
        {TIERS.map((tier) => (
          <TierCard key={tier.name} tier={tier} />
        ))}
      </div>

      {/* Bottom trust line */}
      <div className="mt-10 flex flex-col items-center gap-3">
        <div className="h-px w-32 bg-gradient-to-r from-transparent via-fd-border/50 to-transparent" />
        <p className="text-xs text-fd-muted-foreground/70 tracking-wide">
          No credit card required. No usage limits. No catch.
        </p>
      </div>
    </section>
  )
}
