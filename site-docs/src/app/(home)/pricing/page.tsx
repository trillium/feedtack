import { PIN_PALETTE, PinSvg } from '@/components/pin-svg'
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
      <section className="relative overflow-hidden px-6 pt-24 pb-14 text-center sm:pt-32">
        {/* Subtle radial gradient behind the heading */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(37,99,235,0.06) 0%, transparent 70%)',
          }}
        />

        {/* Scattered decorative pins */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          <div className="absolute left-[8%] top-[12%] opacity-40 rotate-[-18deg]">
            <PinSvg color={PIN_PALETTE[4]} size={30} />
          </div>
          <div className="absolute right-[10%] top-[18%] opacity-35 rotate-[14deg]">
            <PinSvg color={PIN_PALETTE[0]} size={26} />
          </div>
          <div className="absolute left-[22%] top-[6%] opacity-25 rotate-[8deg]">
            <PinSvg color={PIN_PALETTE[5]} size={22} />
          </div>
          <div className="absolute right-[25%] top-[8%] opacity-20 rotate-[-10deg]">
            <PinSvg color={PIN_PALETTE[1]} size={18} />
          </div>
          <div className="absolute left-[45%] top-[4%] opacity-15 rotate-[22deg]">
            <PinSvg color={PIN_PALETTE[3]} size={20} />
          </div>
        </div>

        <h1 className="relative text-4xl font-black tracking-tight text-fd-foreground sm:text-5xl">
          Pricing
        </h1>
        <p className="relative mx-auto mt-4 max-w-lg text-lg text-fd-muted-foreground">
          Choose the plan that&apos;s right for you. Spoiler: they&apos;re all
          the same.
        </p>
      </section>

      {/* Tier cards */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-8 sm:grid-cols-3">
          {TIERS.map((tier) => (
            <TierCard key={tier.name} tier={tier} />
          ))}
        </div>
      </section>

      {/* Open Source callout */}
      <section className="relative border-t border-fd-border px-6 py-20 text-center">
        {/* Faint gradient wash */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(ellipse 50% 60% at 50% 0%, rgba(37,99,235,0.04) 0%, transparent 70%)',
          }}
        />

        <PinSvg color="#2563eb" size={44} className="relative mx-auto mb-5" />
        <h2 className="relative text-2xl font-black tracking-tight text-fd-foreground sm:text-3xl">
          Feedtack is free and open source.
        </h2>
        <p className="relative mx-auto mt-3 max-w-md text-fd-muted-foreground">
          MIT licensed. No strings attached. No credit card. No &quot;call us
          for pricing.&quot; Just{' '}
          <code className="rounded bg-fd-muted px-1.5 py-0.5 text-fd-foreground">
            npm install
          </code>{' '}
          and go.
        </p>

        <div className="relative mx-auto mt-10 max-w-sm">
          <p className="mb-5 text-sm font-bold uppercase tracking-wider text-fd-muted-foreground">
            Support the project
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            {/* GitHub Sponsors — pink accent */}
            <a
              href="https://github.com/sponsors/trillium"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-pink-300/40 bg-pink-50/50 px-5 py-2.5 text-sm font-semibold text-fd-foreground transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-pink-200/30 dark:border-pink-500/20 dark:bg-pink-950/20 dark:hover:shadow-pink-900/20"
            >
              <svg
                viewBox="0 0 16 16"
                className="size-4 text-pink-500"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M4.25 2.5c-1.336 0-2.75 1.164-2.75 3 0 2.15 1.58 4.144 3.365 5.682A20.565 20.565 0 008 13.393a20.561 20.561 0 003.135-2.211C12.92 9.644 14.5 7.65 14.5 5.5c0-1.836-1.414-3-2.75-3-1.373 0-2.609.986-3.029 2.456a.75.75 0 01-1.442 0C6.859 3.486 5.623 2.5 4.25 2.5z" />
              </svg>
              GitHub Sponsors
            </a>
            {/* Buy Me a Coffee — amber accent */}
            <a
              href="https://buymeacoffee.com/trillium"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-amber-300/40 bg-amber-50/50 px-5 py-2.5 text-sm font-semibold text-fd-foreground transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-amber-200/30 dark:border-amber-500/20 dark:bg-amber-950/20 dark:hover:shadow-amber-900/20"
            >
              <span className="text-amber-500" aria-hidden="true">
                &#9749;
              </span>
              Buy Me a Coffee
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
