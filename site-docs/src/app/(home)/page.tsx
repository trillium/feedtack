import Link from 'next/link'
import { FeedtackLogo } from '@/components/logo'
import { PIN_PALETTE, PinSvg } from '@/components/pin-svg'
import { WorkflowAnimation } from '@/components/workflow-animation'

const SCATTERED_PINS: {
  x: string
  y: string
  color: string
  size: number
  rotate: number
  opacity: number
}[] = [
  {
    x: '8%',
    y: '12%',
    color: PIN_PALETTE[0],
    size: 38,
    rotate: -18,
    opacity: 0.7,
  },
  {
    x: '22%',
    y: '6%',
    color: PIN_PALETTE[1],
    size: 28,
    rotate: 12,
    opacity: 0.5,
  },
  {
    x: '78%',
    y: '8%',
    color: PIN_PALETTE[2],
    size: 34,
    rotate: -8,
    opacity: 0.6,
  },
  {
    x: '90%',
    y: '18%',
    color: PIN_PALETTE[3],
    size: 26,
    rotate: 20,
    opacity: 0.5,
  },
  {
    x: '5%',
    y: '55%',
    color: PIN_PALETTE[4],
    size: 30,
    rotate: -25,
    opacity: 0.45,
  },
  {
    x: '92%',
    y: '48%',
    color: PIN_PALETTE[5],
    size: 32,
    rotate: 15,
    opacity: 0.55,
  },
  {
    x: '15%',
    y: '80%',
    color: PIN_PALETTE[2],
    size: 24,
    rotate: 10,
    opacity: 0.4,
  },
  {
    x: '85%',
    y: '75%',
    color: PIN_PALETTE[0],
    size: 28,
    rotate: -12,
    opacity: 0.45,
  },
  {
    x: '50%',
    y: '4%',
    color: PIN_PALETTE[4],
    size: 22,
    rotate: 5,
    opacity: 0.35,
  },
  {
    x: '65%',
    y: '85%',
    color: PIN_PALETTE[1],
    size: 26,
    rotate: -20,
    opacity: 0.4,
  },
]

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

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-24 sm:py-32 lg:py-40">
        {/* Scattered decorative pins */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          {SCATTERED_PINS.map((pin) => (
            <div
              key={`${pin.x}-${pin.y}`}
              className="absolute"
              style={{
                left: pin.x,
                top: pin.y,
                opacity: pin.opacity,
                transform: `rotate(${pin.rotate}deg)`,
              }}
            >
              <PinSvg color={pin.color} size={pin.size} />
            </div>
          ))}
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          {/* Brand pin + wordmark */}
          <div className="mb-8 flex flex-col items-center gap-4">
            <PinSvg color="#2563eb" size={72} />
            <FeedtackLogo className="text-4xl sm:text-5xl" />
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-fd-foreground sm:text-4xl lg:text-5xl">
            Click anywhere.
            <br />
            Drop a pin.
            <br />
            Leave a note.
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-fd-muted-foreground sm:text-xl">
            Get a payload a developer can act on.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/docs"
              className="inline-flex items-center rounded-lg bg-fd-primary px-6 py-3 text-sm font-semibold text-fd-primary-foreground shadow-sm transition-colors hover:bg-fd-primary/90"
            >
              Get Started
            </Link>
            <a
              href="https://github.com/trillium/feedtack"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-fd-border px-6 py-3 text-sm font-semibold text-fd-foreground transition-colors hover:bg-fd-accent"
            >
              <svg
                viewBox="0 0 16 16"
                className="size-4"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Workflow animation */}
      <WorkflowAnimation />

      {/* Features */}
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

      {/* CTA */}
      <section className="px-6 py-16 text-center">
        <p className="text-fd-muted-foreground">
          Open source. MIT licensed. Built for React.
        </p>
        <div className="mt-4">
          <code className="rounded bg-fd-muted px-3 py-1.5 text-sm font-mono text-fd-foreground">
            npm install feedtack
          </code>
        </div>
      </section>
    </>
  )
}
