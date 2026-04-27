import { PinSvg } from '@/components/pin-svg'

export interface Tier {
  name: string
  price: string
  subtitle: string
  pinColor: string
  features: string[]
  cta: string
  ctaHref?: string
  featured?: boolean
  locked?: boolean
}

export function TierCard({ tier }: { tier: Tier }) {
  const isLocked = tier.locked
  const isFeatured = tier.featured

  return (
    <div
      className={`group relative flex flex-col rounded-2xl border p-6 transition-all duration-200 ${
        isLocked
          ? 'border-fd-border bg-fd-card/60'
          : isFeatured
            ? 'border-fd-primary/40 bg-gradient-to-b from-fd-primary/[0.07] to-fd-card ring-2 ring-fd-primary/20 hover:-translate-y-1 hover:shadow-lg hover:shadow-fd-primary/10'
            : 'border-fd-border bg-fd-card hover:-translate-y-1 hover:shadow-lg hover:shadow-fd-foreground/5'
      }`}
    >
      {isFeatured && (
        <span
          className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold tracking-wide uppercase text-white shadow-md"
          style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}
        >
          Most Popular
        </span>
      )}

      {/* Enterprise lock overlay with diagonal stripe pattern */}
      {isLocked && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-2xl overflow-hidden">
          {/* Diagonal stripes */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 8px)',
            }}
          />
          {/* Frosted center */}
          <div className="absolute inset-0 bg-fd-background/50 backdrop-blur-[2px]" />
          <div className="relative text-center">
            <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-full border-2 border-fd-border bg-fd-muted/80">
              <svg
                viewBox="0 0 24 24"
                className="size-7 text-fd-muted-foreground"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                role="img"
                aria-label="Locked"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <p className="text-sm font-bold text-fd-foreground">
              Submit a PR to unlock
            </p>
            <p className="mt-1 text-xs text-fd-muted-foreground">
              Open source contribution required
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <PinSvg color={tier.pinColor} size={28} />
        <h2 className="text-xl font-bold text-fd-foreground">{tier.name}</h2>
      </div>

      {/* Price */}
      <div className="mb-1 flex items-baseline gap-1">
        <span className="text-5xl font-black tracking-tight text-fd-foreground">
          {tier.price}
        </span>
        <span className="text-sm font-medium text-fd-muted-foreground">
          / forever
        </span>
      </div>
      <p className="mb-6 text-sm text-fd-muted-foreground italic">
        {tier.subtitle}
      </p>

      {/* Feature list — tiny pins as check icons */}
      <ul className="mb-8 flex-1 space-y-2.5">
        {tier.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2.5 text-sm text-fd-foreground"
          >
            <PinSvg
              color={tier.pinColor}
              size={14}
              className="mt-0.5 shrink-0 opacity-70"
            />
            {feature}
          </li>
        ))}
      </ul>

      {/* CTA */}
      {tier.ctaHref ? (
        <a
          href={tier.ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-20 block w-full rounded-xl bg-fd-muted px-4 py-2.5 text-center text-sm font-semibold text-fd-foreground transition-colors hover:bg-fd-accent"
        >
          {tier.cta}
        </a>
      ) : (
        <code className="block w-full cursor-pointer rounded-xl bg-fd-muted px-4 py-2.5 text-center font-mono text-sm text-fd-foreground transition-colors hover:bg-fd-accent">
          {tier.cta}
        </code>
      )}
    </div>
  )
}
