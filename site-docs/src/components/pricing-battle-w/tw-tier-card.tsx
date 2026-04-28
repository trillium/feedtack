import type { Tier } from './tier-data'

interface TwTierCardProps {
  tier: Tier
  index: number
}

const RING_COLORS = [
  'ring-indigo-500/30 hover:ring-indigo-400/60',
  'ring-purple-500/30 hover:ring-purple-400/60',
  'ring-pink-500/30 hover:ring-pink-400/60',
] as const

const GRADIENT_BORDERS = [
  'from-indigo-500 via-indigo-400 to-blue-500',
  'from-purple-500 via-fuchsia-500 to-pink-500',
  'from-pink-500 via-rose-500 to-orange-500',
] as const

const BADGE_STYLES = [
  'border-indigo-500/30 bg-indigo-500/10 text-indigo-300',
  'border-purple-500/30 bg-purple-500/10 text-purple-300',
  'border-pink-500/30 bg-pink-500/10 text-pink-300',
] as const

const CHECK_COLORS = [
  'text-indigo-400',
  'text-purple-400',
  'text-pink-400',
] as const

export function TwTierCard({ tier, index }: TwTierCardProps) {
  const isFeatured = tier.featured
  const isLocked = tier.locked

  return (
    <div className="group relative flex h-full flex-col">
      {/* Gradient border glow — only on featured */}
      {isFeatured && (
        <div
          className={`tw-gradient-shift pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br ${GRADIENT_BORDERS[index]} opacity-60 blur-sm transition-all duration-500 group-hover:opacity-100 group-hover:blur-md sm:rounded-3xl`}
          aria-hidden="true"
        />
      )}

      {/* Card shell: glassmorphism + ring + backdrop-blur + rounded + shadow + transition + group-hover */}
      <div
        className={`relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-xl shadow-black/20 ring-1 ring-inset backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 sm:rounded-3xl sm:p-6 md:p-8 ${RING_COLORS[index]} ${isFeatured ? 'scale-[1.02] sm:scale-105' : ''}`}
      >
        {/* "Popular" ribbon for featured tier */}
        {isFeatured && (
          <div className="absolute -right-8 top-5 z-20 rotate-45 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 px-8 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg sm:top-6 sm:py-1 sm:text-xs">
            Popular
          </div>
        )}

        {/* Locked overlay */}
        {isLocked && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-slate-950/60 backdrop-blur-[2px] sm:rounded-3xl">
            <div className="flex flex-col items-center gap-2 text-center">
              <svg
                className="h-8 w-8 text-slate-500 sm:h-10 sm:w-10"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                role="img"
                aria-label="Locked"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 sm:text-sm">
                Contribute to Unlock
              </span>
            </div>
          </div>
        )}

        {/* Tier name badge */}
        <div className="mb-4 flex items-center gap-3 sm:mb-6">
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest sm:px-3 sm:py-1 sm:text-xs ${BADGE_STYLES[index]}`}
          >
            {tier.name}
          </span>
        </div>

        {/* Price */}
        <div className="mb-1 flex items-baseline gap-1 sm:mb-2">
          <span className="tw-gradient-shift bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-4xl font-black tracking-tighter text-transparent sm:text-5xl md:text-6xl">
            {tier.price}
          </span>
          <span className="text-xs font-medium tracking-wide text-slate-500 sm:text-sm">
            /forever
          </span>
        </div>

        {/* Subtitle */}
        <p className="mb-5 text-xs leading-relaxed text-slate-400 sm:mb-6 sm:text-sm md:mb-8">
          {tier.subtitle}
        </p>

        {/* Divider with gradient */}
        <div className="mb-5 h-px w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent sm:mb-6 md:mb-8" />

        {/* Features */}
        <ul className="mb-6 flex flex-1 flex-col gap-2.5 sm:mb-8 sm:gap-3">
          {tier.features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2 text-xs leading-snug text-slate-300 sm:gap-2.5 sm:text-sm"
            >
              <svg
                className={`mt-0.5 h-3.5 w-3.5 flex-shrink-0 sm:h-4 sm:w-4 ${CHECK_COLORS[index]}`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA button */}
        <div className="mt-auto">
          <a
            href={tier.ctaHref ?? '#'}
            className={`tw-pulse-ring group/btn relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 sm:rounded-2xl sm:px-6 sm:py-3 sm:text-sm ${
              isFeatured
                ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40'
                : 'border border-slate-700 bg-slate-800/80 text-slate-300 hover:border-slate-600 hover:bg-slate-700/80 hover:text-white'
            }`}
          >
            {/* Shimmer overlay */}
            {isFeatured && (
              <span
                className="tw-shimmer pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                aria-hidden="true"
              />
            )}
            <span className="relative z-10">{tier.cta}</span>
            <svg
              className="relative z-10 h-3 w-3 transition-transform duration-300 group-hover/btn:translate-x-1 sm:h-4 sm:w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
