import { CheckIcon } from '@/components/pricing-new/check-icon'
import { LockOverlay } from '@/components/pricing-new/lock-overlay'
import type { Tier } from '@/data/pricing-tiers'

function CardCta({ tier }: { tier: Tier }) {
  const baseClasses =
    'relative z-20 block w-full rounded-2xl px-5 py-3.5 text-center text-sm font-semibold transition-all duration-300'

  if (tier.ctaHref) {
    return (
      <a
        href={tier.ctaHref}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClasses} bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-0.5 active:translate-y-0`}
      >
        {tier.cta}
      </a>
    )
  }

  if (tier.featured) {
    return (
      <code
        className={`${baseClasses} font-mono bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/35 hover:-translate-y-0.5 active:translate-y-0`}
      >
        {tier.cta}
      </code>
    )
  }

  return (
    <code
      className={`${baseClasses} font-mono border border-fd-border/60 bg-fd-card/80 text-fd-foreground hover:bg-fd-accent hover:border-fd-border hover:-translate-y-0.5`}
    >
      {tier.cta}
    </code>
  )
}

function cardClasses(tier: Tier): string {
  if (tier.locked) {
    return [
      'border-fd-border/30 bg-fd-card/60 backdrop-blur-md',
      'hover:border-fd-border/50',
    ].join(' ')
  }
  if (tier.featured) {
    return [
      'tier-card-new-featured',
      'border-transparent bg-fd-card',
      'shadow-2xl shadow-blue-500/[0.06]',
      'lg:-mt-4 lg:mb-4',
    ].join(' ')
  }
  return [
    'border-fd-border/40 bg-fd-card/70 backdrop-blur-md',
    'hover:border-fd-border/60 hover:bg-fd-card/90',
    'hover:shadow-xl hover:shadow-fd-foreground/[0.03]',
  ].join(' ')
}

export function TierCardNew({ tier }: { tier: Tier }) {
  return (
    <div
      className={`pricing-card-enter group relative flex flex-col rounded-3xl border p-8 sm:p-10 transition-all duration-400 hover:-translate-y-1.5 ${cardClasses(tier)}`}
    >
      {/* Featured badge */}
      {tier.featured && (
        <span className="badge-pulse absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 rounded-full bg-gradient-to-r from-blue-600 via-violet-500 to-blue-600 bg-[length:200%_100%] px-6 py-1.5 text-[10px] font-bold tracking-[0.2em] uppercase text-white shadow-lg shadow-blue-500/25">
          Recommended
        </span>
      )}

      {/* Lock overlay for enterprise */}
      {tier.locked && <LockOverlay />}

      {/* Tier name */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div
            className="flex size-3 rounded-full transition-shadow duration-300 group-hover:shadow-[0_0_12px_2px]"
            style={{
              backgroundColor: tier.pinColor,
              boxShadow: `0 0 0 0 ${tier.pinColor}`,
            }}
          />
          <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-fd-muted-foreground">
            {tier.name}
          </h2>
        </div>
      </div>

      {/* Price */}
      <div className="mb-2">
        <span className="text-7xl font-black tracking-[-0.06em] text-fd-foreground tabular-nums">
          {tier.price}
        </span>
        <span className="ml-2 text-sm font-medium text-fd-muted-foreground/70">
          / forever
        </span>
      </div>

      {/* Subtitle */}
      <p className="mb-8 text-sm text-fd-muted-foreground/70 italic leading-relaxed">
        {tier.subtitle}
      </p>

      {/* Divider */}
      <div className="mb-8 h-px bg-gradient-to-r from-transparent via-fd-border/40 to-transparent" />

      {/* Features list */}
      <ul className="mb-10 flex-1 space-y-4">
        {tier.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-3 text-[13px] leading-relaxed text-fd-muted-foreground/80 transition-colors duration-200 group-hover:text-fd-muted-foreground"
          >
            <CheckIcon color={tier.pinColor} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA button */}
      <CardCta tier={tier} />
    </div>
  )
}
