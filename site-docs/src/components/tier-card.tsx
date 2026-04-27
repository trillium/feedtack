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

function LockOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-2xl overflow-hidden">
      {/* Animated scan line */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, currentColor 0, currentColor 1px, transparent 0, transparent 4px)',
        }}
      />
      {/* Frosted glass */}
      <div className="absolute inset-0 bg-fd-background/70 backdrop-blur-[6px]" />
      {/* Content */}
      <div className="relative text-center px-6">
        <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-2xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-amber-600/5 shadow-lg shadow-amber-500/5">
          <svg
            viewBox="0 0 24 24"
            className="size-9 text-amber-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            role="img"
            aria-label="Locked"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <p className="text-base font-bold text-fd-foreground tracking-tight">
          Submit a PR to unlock
        </p>
        <p className="mt-1.5 text-sm text-fd-muted-foreground max-w-[200px] mx-auto leading-relaxed">
          Open source contribution required. Yes, really.
        </p>
        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
          <span className="inline-block size-1.5 rounded-full bg-amber-500 animate-pulse" />
          Awaiting your PR
        </div>
      </div>
    </div>
  )
}

export function TierCard({ tier }: { tier: Tier }) {
  const isLocked = tier.locked
  const isFeatured = tier.featured

  return (
    <div
      className={`group relative flex flex-col rounded-2xl border p-8 transition-all duration-300 ${
        isLocked
          ? 'border-fd-border/60 bg-fd-card/40'
          : isFeatured
            ? 'border-blue-500/30 bg-gradient-to-b from-blue-500/[0.08] via-fd-card to-fd-card shadow-xl shadow-blue-500/[0.08] ring-1 ring-blue-500/10 lg:scale-[1.03] hover:shadow-2xl hover:shadow-blue-500/[0.12]'
            : 'border-fd-border bg-fd-card hover:border-fd-border/80 hover:shadow-lg hover:shadow-fd-foreground/[0.03]'
      }`}
    >
      {isFeatured && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-5 py-1.5 text-xs font-bold tracking-wider uppercase text-white shadow-lg shadow-blue-500/25 bg-gradient-to-r from-blue-600 to-violet-600">
          Most Popular
        </span>
      )}

      {isLocked && <LockOverlay />}

      {/* Tier name with pin */}
      <div className="mb-6 flex items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-xl"
          style={{
            background: `${tier.pinColor}12`,
            border: `1px solid ${tier.pinColor}25`,
          }}
        >
          <PinSvg color={tier.pinColor} size={22} />
        </div>
        <h2 className="text-lg font-semibold tracking-tight text-fd-foreground">
          {tier.name}
        </h2>
      </div>

      {/* Price — dramatic treatment */}
      <div className="mb-1">
        <span className="text-6xl font-black tracking-tighter text-fd-foreground">
          {tier.price}
        </span>
        <span className="ml-1.5 text-base font-medium text-fd-muted-foreground">
          / forever
        </span>
      </div>
      <p className="mb-8 text-sm text-fd-muted-foreground/80 italic">
        {tier.subtitle}
      </p>

      {/* Divider */}
      <div className="mb-6 h-px bg-gradient-to-r from-transparent via-fd-border to-transparent" />

      {/* Features */}
      <ul className="mb-8 flex-1 space-y-3">
        {tier.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-3 text-sm text-fd-muted-foreground"
          >
            <svg
              className="mt-0.5 size-4 shrink-0"
              viewBox="0 0 16 16"
              fill="none"
              role="img"
              aria-label="Included"
            >
              <circle cx="8" cy="8" r="8" fill={tier.pinColor} opacity={0.12} />
              <path
                d="M5 8l2 2 4-4"
                stroke={tier.pinColor}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      {tier.ctaHref ? (
        <a
          href={tier.ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-20 block w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-md shadow-amber-500/20 transition-all hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5"
        >
          {tier.cta}
        </a>
      ) : isFeatured ? (
        <code className="block w-full cursor-pointer rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3 text-center font-mono text-sm text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5">
          {tier.cta}
        </code>
      ) : (
        <code className="block w-full cursor-pointer rounded-xl border border-fd-border bg-fd-muted/50 px-4 py-3 text-center font-mono text-sm text-fd-foreground transition-all hover:bg-fd-accent hover:border-fd-border/80">
          {tier.cta}
        </code>
      )}
    </div>
  )
}
