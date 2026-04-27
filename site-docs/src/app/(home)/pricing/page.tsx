import { PIN_PALETTE, PinSvg } from '@/components/pin-svg'
import { SponsorSection } from '@/components/sponsor-section'
import { type Tier, TierCard } from '@/components/tier-card'

const TIERS: Tier[] = [
  {
    name: 'Free',
    price: '$0',
    subtitle: 'Forever. Seriously.',
    pinColor: PIN_PALETTE[1],
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
    pinColor: PIN_PALETTE[2],
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
    subtitle: 'For teams who like saying "enterprise."',
    pinColor: PIN_PALETTE[3],
    locked: true,
    features: [
      'Everything in Pro',
      'Unlimited Unlimited',
      '24/7 Self-Service Support (read the docs)',
      'White-glove npm install',
      'Dedicated Slack channel (make your own)',
      'SOC 2 Type II (you handle that)',
      "On-prem deployment (it's an npm package)",
    ],
    cta: 'Contribute to Unlock',
    ctaHref: 'https://github.com/trillium/feedtack',
  },
]

export default function PricingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-28 pb-20 text-center sm:pt-36 sm:pb-24">
        {/* Multi-layered gradient background */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background: [
              'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(37,99,235,0.08) 0%, transparent 60%)',
              'radial-gradient(ellipse 40% 40% at 20% 50%, rgba(139,92,246,0.04) 0%, transparent 60%)',
              'radial-gradient(ellipse 40% 40% at 80% 50%, rgba(245,158,11,0.04) 0%, transparent 60%)',
            ].join(', '),
          }}
        />

        {/* Scattered decorative pins — larger, bolder, fewer */}
        <div
          className="pointer-events-none absolute inset-0 hidden sm:block"
          aria-hidden="true"
        >
          <div className="absolute left-[6%] top-[18%] opacity-20 -rotate-[20deg]">
            <PinSvg color={PIN_PALETTE[4]} size={36} />
          </div>
          <div className="absolute right-[8%] top-[22%] opacity-15 rotate-[16deg]">
            <PinSvg color={PIN_PALETTE[0]} size={28} />
          </div>
          <div className="absolute left-[18%] bottom-[20%] opacity-10 rotate-[10deg]">
            <PinSvg color={PIN_PALETTE[5]} size={24} />
          </div>
          <div className="absolute right-[16%] bottom-[25%] opacity-10 -rotate-[8deg]">
            <PinSvg color={PIN_PALETTE[3]} size={20} />
          </div>
        </div>

        <div className="relative">
          <h1 className="text-5xl font-black tracking-tighter text-fd-foreground sm:text-6xl lg:text-7xl">
            Pricing
          </h1>
          <p className="mx-auto mt-5 max-w-md text-lg text-fd-muted-foreground leading-relaxed">
            Choose the plan that&apos;s right for you.
            <br />
            <span className="text-fd-muted-foreground/60">
              Spoiler: they&apos;re all the same.
            </span>
          </p>
        </div>
      </section>

      {/* Tier cards */}
      <section className="mx-auto max-w-6xl px-6 pb-32">
        <div className="grid items-center gap-6 lg:grid-cols-3">
          {TIERS.map((tier) => (
            <TierCard key={tier.name} tier={tier} />
          ))}
        </div>
      </section>

      {/* Open Source callout + sponsors */}
      <SponsorSection />
    </>
  )
}
