import { AndoFooter } from '@/components/pricing-battle-l/ando-footer'
import { AndoTier } from '@/components/pricing-battle-l/ando-tier'
import '@/components/pricing-battle-l/ando-styles.css'
import { ConcreteSurface } from '@/components/pricing-battle-l/concrete-surface'
import { LightSlit } from '@/components/pricing-battle-l/light-slit'

const TIERS = [
  {
    name: 'Free',
    price: '$0',
    subtitle: 'Forever. Seriously.',
    features: [
      'All adapters (console, localStorage, Supabase, webhooks)',
      'Unlimited pins',
      'Rich DOM targeting',
      'Feedback scopes (element, page, site)',
      'Custom CSS theming',
      'Full TypeScript support',
      'Community GitHub Issues',
    ],
    cta: 'npm install feedtack',
  },
  {
    name: 'Pro',
    price: '$0',
    subtitle: 'Same price. More prestige.',
    featured: true,
    features: [
      'Everything in Free',
      'Priority GitHub Issues (you star the repo first)',
      'Custom adapter support (you write them)',
      'Advanced DOM targeting',
      'Unlimited unlimited pins',
      'A warm feeling inside',
    ],
    cta: 'npm install feedtack',
  },
  {
    name: 'Enterprise',
    price: '$0',
    subtitle: 'For teams who like saying \u201centerprise.\u201d',
    features: [
      'Everything in Pro',
      'Unlimited Unlimited',
      '24/7 Self-Service Support (read the docs)',
      'White-glove npm install',
      'Dedicated Slack channel (make your own)',
      'On-prem deployment (it\u2019s an npm package)',
    ],
    cta: 'Contribute to Unlock',
    ctaHref: 'https://github.com/trillium/feedtack',
  },
]

export default function PricingBattleLPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <ConcreteSurface />

      {/* Hero — vast emptiness, a single word */}
      <section className="relative px-6 pb-20 pt-36 text-center lg:pb-28 lg:pt-52">
        <h1 className="ando-emerge ando-emerge-1 text-[0.6875rem] font-medium uppercase tracking-[0.35em] text-fd-muted-foreground">
          Pricing
        </h1>

        <div className="h-14 lg:h-20" aria-hidden="true" />

        <p className="ando-emerge ando-emerge-2 mx-auto max-w-lg text-2xl font-extralight leading-relaxed tracking-wide text-fd-foreground lg:text-3xl">
          Choose the plan that{'\u2019'}s right for you.
        </p>
        <p className="ando-emerge ando-emerge-2 mt-3 text-sm font-light italic text-fd-muted-foreground/50">
          Spoiler: they{'\u2019'}re all the same.
        </p>
      </section>

      {/* The slit of light */}
      <div className="mx-auto max-w-4xl px-16 lg:px-24">
        <LightSlit className="ando-emerge ando-emerge-3" />
      </div>

      {/* Tiers — three columns separated by vertical light beams */}
      <section className="mx-auto max-w-5xl px-6 pb-24 pt-20 lg:px-0 lg:pb-36 lg:pt-28">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {TIERS.map((tier, i) => (
            <div key={tier.name} className="ando-tier-cell relative lg:px-10">
              <AndoTier
                name={tier.name}
                price={tier.price}
                subtitle={tier.subtitle}
                features={tier.features}
                cta={tier.cta}
                ctaHref={tier.ctaHref}
                index={i}
                featured={tier.featured}
              />

              {/* Mobile separator */}
              {i < TIERS.length - 1 && (
                <div className="mx-auto w-24 pt-16 lg:hidden">
                  <LightSlit />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final slit */}
      <div className="mx-auto max-w-4xl px-16 lg:px-24">
        <LightSlit />
      </div>

      <AndoFooter />
    </div>
  )
}
