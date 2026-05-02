import { PIN_PALETTE, PinSvg } from '@/components/pin-svg'

const FEATURES = [
  {
    title: 'Adapter System',
    description:
      'Send feedback anywhere. Console, localStorage, webhooks, Supabase, or build your own adapter in a few lines.',
    color: PIN_PALETTE[1],
    badge: 'Extensible',
  },
  {
    title: 'Rich DOM Targeting',
    description:
      'Every pin captures CSS selectors, XPath, DOM attributes, and text content so developers know exactly what was clicked.',
    color: PIN_PALETTE[2],
    badge: 'Precise',
  },
  {
    title: 'Feedback Scopes',
    description:
      'Users choose whether feedback targets a specific element, the current page, or the whole site. Context comes built in.',
    color: PIN_PALETTE[3],
    badge: 'Contextual',
  },
] as const

export function FeaturesGrid() {
  return (
    <section className="relative overflow-hidden px-6 py-24 sm:py-32">
      {/* Subtle radial glow behind section */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 0%, hsl(var(--primary) / 0.05), transparent)',
        }}
      />

      <div className="relative mx-auto max-w-5xl">
        {/* Section header */}
        <div className="mb-16 text-center sm:mb-20">
          <p className="mb-3 text-sm font-semibold tracking-widest uppercase text-fd-primary">
            Built for developers
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-fd-foreground sm:text-3xl lg:text-4xl">
            Everything you need,
            <br className="hidden sm:block" /> nothing you don&rsquo;t
          </h2>
        </div>

        {/* Staggered feature rows */}
        <div className="space-y-6 sm:space-y-0">
          {FEATURES.map((feature, i) => {
            const isEven = i % 2 === 0
            return (
              <div
                key={feature.title}
                className={[
                  'group relative sm:flex sm:items-start sm:gap-8',
                  'rounded-2xl p-6 sm:p-8',
                  // Alternate alignment on larger screens
                  isEven ? 'sm:flex-row' : 'sm:flex-row-reverse sm:text-right',
                  // Offset middle row for visual rhythm
                  i === 1 ? 'sm:mx-12 lg:mx-20' : '',
                ].join(' ')}
              >
                {/* Decorative connector line between features */}
                {i > 0 && (
                  <div
                    className="pointer-events-none absolute left-1/2 -top-3 hidden h-6 w-px bg-fd-border sm:block"
                    aria-hidden="true"
                  />
                )}

                {/* Pin icon with glow rings */}
                <div
                  className={[
                    'relative mb-5 flex shrink-0 items-center justify-center sm:mb-0',
                    isEven ? '' : 'sm:order-none',
                  ].join(' ')}
                >
                  <div
                    className="absolute size-16 rounded-full opacity-[0.08]"
                    style={{ backgroundColor: feature.color }}
                    aria-hidden="true"
                  />
                  <div
                    className="absolute size-24 rounded-full opacity-[0.04]"
                    style={{ backgroundColor: feature.color }}
                    aria-hidden="true"
                  />
                  <div className="relative">
                    <PinSvg color={feature.color} size={44} />
                  </div>
                </div>

                {/* Text content */}
                <div className="min-w-0 flex-1">
                  <div
                    className={[
                      'mb-2 flex items-center gap-3',
                      isEven ? '' : 'sm:justify-end',
                    ].join(' ')}
                  >
                    <h3 className="text-lg font-semibold text-fd-foreground sm:text-xl">
                      {feature.title}
                    </h3>
                    <span
                      className="inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase"
                      style={{
                        borderColor: feature.color + '40',
                        color: feature.color,
                        backgroundColor: feature.color + '0a',
                      }}
                    >
                      {feature.badge}
                    </span>
                  </div>
                  <p className="max-w-md text-[15px] leading-relaxed text-fd-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom decorative row of mini pins */}
        <div
          className="mt-16 flex items-center justify-center gap-3 sm:mt-20"
          aria-hidden="true"
        >
          {PIN_PALETTE.map((color, i) => (
            <div
              key={color}
              className="opacity-20"
              style={{
                transform: `rotate(${(i - 2.5) * 8}deg)`,
              }}
            >
              <PinSvg color={color} size={16} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
