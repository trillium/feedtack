import { PIN_PALETTE, PinSvg } from '@/components/pin-svg'

const FEATURES = [
  {
    title: 'Adapter System',
    description:
      'Send feedback anywhere. Console, localStorage, webhooks, Supabase, or build your own adapter in a few lines.',
    icon: PIN_PALETTE[1],
  },
  {
    title: 'Rich DOM Targeting',
    description:
      'Every pin captures CSS selectors, XPath, DOM attributes, and text content so developers know exactly what was clicked.',
    icon: PIN_PALETTE[2],
  },
  {
    title: 'Feedback Scopes',
    description:
      'Users choose whether feedback targets a specific element, the current page, or the whole site. Context comes built in.',
    icon: PIN_PALETTE[3],
  },
]

export function FeaturesGrid() {
  return (
    <section className="border-t border-fd-border bg-fd-card/50 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-8 sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-fd-border bg-fd-card p-6 shadow-sm"
            >
              <div className="mb-4">
                <PinSvg color={feature.icon} size={28} />
              </div>
              <h3 className="text-lg font-semibold text-fd-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-fd-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
