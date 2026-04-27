import { PIN_PALETTE, PinSvg } from '@/components/pin-svg'

const CHECK = '\u2713'
const LOCK = '\uD83D\uDD12'

const TIERS = [
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
    ctaHref: undefined,
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
    ctaHref: undefined,
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

function TierCard({ tier }: { tier: (typeof TIERS)[number] }) {
  const isLocked = 'locked' in tier && tier.locked
  const isFeatured = 'featured' in tier && tier.featured

  return (
    <div
      className={`relative flex flex-col rounded-xl border p-6 shadow-sm ${
        isLocked
          ? 'border-fd-border bg-fd-card/60 opacity-80'
          : isFeatured
            ? 'border-fd-primary bg-fd-primary/5 ring-2 ring-fd-primary/20'
            : 'border-fd-border bg-fd-card'
      }`}
    >
      {isFeatured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-fd-primary px-3 py-0.5 text-xs font-semibold text-fd-primary-foreground">
          Most Popular
        </span>
      )}
      {isLocked && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl bg-fd-background/40 backdrop-blur-[1px]">
          <div className="text-center">
            <span className="text-4xl">{LOCK}</span>
            <p className="mt-2 text-xs font-medium text-fd-muted-foreground">
              Submit a PR to unlock
            </p>
          </div>
        </div>
      )}
      <div className="mb-4 flex items-center gap-3">
        <PinSvg color={tier.pinColor} size={28} />
        <h2 className="text-xl font-bold text-fd-foreground">{tier.name}</h2>
      </div>
      <div className="mb-1">
        <span className="text-4xl font-extrabold text-fd-foreground">
          {tier.price}
        </span>
        <span className="text-fd-muted-foreground"> / forever</span>
      </div>
      <p className="mb-6 text-sm text-fd-muted-foreground italic">
        {tier.subtitle}
      </p>
      <ul className="mb-8 flex-1 space-y-2">
        {tier.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2 text-sm text-fd-foreground"
          >
            <span className="mt-0.5 font-bold text-fd-primary">{CHECK}</span>
            {feature}
          </li>
        ))}
      </ul>
      {tier.ctaHref ? (
        <a
          href={tier.ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 block w-full rounded-lg bg-fd-muted px-4 py-2.5 text-center text-sm font-semibold text-fd-foreground transition-colors hover:bg-fd-accent"
        >
          {tier.cta}
        </a>
      ) : (
        <code className="block w-full rounded-lg bg-fd-muted px-4 py-2.5 text-center text-sm font-mono text-fd-foreground transition-colors hover:bg-fd-accent cursor-pointer">
          {tier.cta}
        </code>
      )}
    </div>
  )
}

export default function PricingPage() {
  return (
    <>
      {/* Header */}
      <section className="relative px-6 pt-24 pb-12 text-center sm:pt-32">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          <div className="absolute left-[10%] top-[15%] opacity-40 rotate-[-15deg]">
            <PinSvg color={PIN_PALETTE[4]} size={30} />
          </div>
          <div className="absolute right-[12%] top-[20%] opacity-35 rotate-[12deg]">
            <PinSvg color={PIN_PALETTE[0]} size={26} />
          </div>
          <div className="absolute left-[25%] top-[8%] opacity-30 rotate-[8deg]">
            <PinSvg color={PIN_PALETTE[5]} size={22} />
          </div>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-fd-foreground sm:text-5xl">
          Pricing
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-lg text-fd-muted-foreground">
          Choose the plan that&apos;s right for you. Spoiler: they&apos;re all
          the same.
        </p>
      </section>

      {/* Tiers */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-8 sm:grid-cols-3">
          {TIERS.map((tier) => (
            <TierCard key={tier.name} tier={tier} />
          ))}
        </div>
      </section>

      {/* Open Source callout */}
      <section className="border-t border-fd-border px-6 py-16 text-center">
        <PinSvg color="#2563eb" size={40} className="mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-fd-foreground">
          Feedtack is free and open source.
        </h2>
        <p className="mx-auto mt-2 max-w-md text-fd-muted-foreground">
          MIT licensed. No strings attached. No credit card. No &quot;call us
          for pricing.&quot; Just{' '}
          <code className="text-fd-foreground">npm install</code> and go.
        </p>
        <div className="mx-auto mt-8 max-w-sm">
          <p className="mb-4 text-sm font-semibold text-fd-foreground">
            But if you want to support the project...
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href="https://github.com/sponsors/trillium"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-fd-border px-5 py-2.5 text-sm font-semibold text-fd-foreground transition-colors hover:bg-fd-accent"
            >
              <svg
                viewBox="0 0 16 16"
                className="size-4"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M4.25 2.5c-1.336 0-2.75 1.164-2.75 3 0 2.15 1.58 4.144 3.365 5.682A20.565 20.565 0 008 13.393a20.561 20.561 0 003.135-2.211C12.92 9.644 14.5 7.65 14.5 5.5c0-1.836-1.414-3-2.75-3-1.373 0-2.609.986-3.029 2.456a.75.75 0 01-1.442 0C6.859 3.486 5.623 2.5 4.25 2.5z" />
              </svg>
              GitHub Sponsors
            </a>
            <a
              href="https://buymeacoffee.com/trillium"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-fd-border px-5 py-2.5 text-sm font-semibold text-fd-foreground transition-colors hover:bg-fd-accent"
            >
              <span aria-hidden="true">&#9749;</span>
              Buy Me a Coffee
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
