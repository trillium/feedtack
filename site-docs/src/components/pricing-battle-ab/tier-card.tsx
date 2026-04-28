import type { Tier } from '@/data/pricing-tiers'
import { CheckIcon } from './check-icon'
import { LockIcon } from './lock-icon'

function cardClasses(tier: Tier) {
  const base = [
    'relative flex flex-col rounded-2xl border p-8',
    'transition-all duration-300',
  ]

  if (tier.locked) {
    return [...base, 'border-fd-border/50 bg-fd-card/30'].join(' ')
  }

  if (tier.featured) {
    return [
      ...base,
      'border-blue-500/30 bg-gradient-to-b from-blue-500/[0.06] to-transparent',
      'shadow-lg shadow-blue-500/[0.06] ring-1 ring-blue-500/10',
      'hover:shadow-xl hover:shadow-blue-500/[0.1]',
      'lg:scale-105',
    ].join(' ')
  }

  return [
    ...base,
    'border-fd-border/60 bg-fd-card/50',
    'hover:border-fd-border hover:shadow-md',
  ].join(' ')
}

function ctaClasses(tier: Tier) {
  const base =
    'mt-auto block rounded-xl px-6 py-3 text-center text-sm font-semibold transition-all duration-200'

  if (tier.locked) {
    return `${base} border border-fd-border/60 text-fd-muted-foreground hover:border-fd-border hover:text-fd-foreground`
  }

  if (tier.featured) {
    return `${base} bg-blue-500 text-white hover:bg-blue-600 shadow-sm shadow-blue-500/20 hover:shadow-md hover:shadow-blue-500/25`
  }

  return `${base} border border-fd-border bg-fd-background text-fd-foreground hover:bg-fd-muted/50`
}

export function TierCard({ tier }: { tier: Tier }) {
  const Tag = tier.ctaHref ? 'a' : 'span'

  return (
    <div className={cardClasses(tier)}>
      {/* Featured badge */}
      {tier.featured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-500 px-4 py-1 text-xs font-semibold text-white">
          Popular
        </span>
      )}

      {/* Locked overlay */}
      {tier.locked && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-fd-background/60 backdrop-blur-[2px]">
          <div className="flex flex-col items-center gap-2 text-fd-muted-foreground">
            <LockIcon className="h-6 w-6" />
            <span className="text-xs font-medium uppercase tracking-wider">
              Contribute to unlock
            </span>
          </div>
        </div>
      )}

      {/* Tier name */}
      <h3 className="text-sm font-semibold uppercase tracking-wider text-fd-muted-foreground">
        {tier.name}
      </h3>

      {/* Price */}
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-5xl font-extrabold tracking-tight text-fd-foreground">
          {tier.price}
        </span>
        <span className="text-sm text-fd-muted-foreground">/forever</span>
      </div>

      {/* Subtitle */}
      <p className="mt-2 text-sm leading-relaxed text-fd-muted-foreground">
        {tier.subtitle}
      </p>

      {/* Divider */}
      <div className="my-6 h-px bg-fd-border/60" />

      {/* Features */}
      <ul className="mb-8 flex flex-col gap-3">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
            <span className="text-sm leading-snug text-fd-muted-foreground">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Tag
        className={ctaClasses(tier)}
        {...(tier.ctaHref
          ? { href: tier.ctaHref, target: '_blank', rel: 'noopener noreferrer' }
          : {})}
      >
        {tier.cta}
      </Tag>
    </div>
  )
}
