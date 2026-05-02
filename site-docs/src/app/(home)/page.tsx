import Link from 'next/link'
import { FeaturesGrid } from '@/components/features-grid'
import { FeedtackLogo } from '@/components/logo'
import { PinSvg } from '@/components/pin-svg'
import { ScatteredPins } from '@/components/scattered-pins'
import { WorkflowAnimation } from '@/components/workflow-animation'

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-32 pb-24 sm:pt-40 sm:pb-32 lg:pt-48 lg:pb-40">
        {/* Scattered decorative pins */}
        <ScatteredPins />

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
      <FeaturesGrid />

      {/* CTA */}
      <section className="px-6 py-16 text-center">
        <p className="text-fd-muted-foreground">
          Open source. MIT licensed. Built for the web.
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
