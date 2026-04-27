import { PinSvg } from '@/components/pin-svg'

export function SponsorSection() {
  return (
    <section className="relative px-6 py-24 text-center overflow-hidden">
      {/* Background gradient */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(37,99,235,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Top border with gradient fade */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fd-border to-transparent" />

      <div className="relative mx-auto max-w-2xl">
        {/* Pin cluster */}
        <div className="mb-8 flex items-center justify-center gap-1">
          <PinSvg color="#3b82f6" size={28} className="opacity-40 -rotate-12" />
          <PinSvg color="#2563eb" size={40} />
          <PinSvg color="#f59e0b" size={28} className="opacity-40 rotate-12" />
        </div>

        <h2 className="text-3xl font-black tracking-tight text-fd-foreground sm:text-4xl">
          Free and open source.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-fd-muted-foreground leading-relaxed">
          MIT licensed. No strings attached. No credit card. No &quot;call us
          for pricing.&quot; Just{' '}
          <code className="rounded-md bg-fd-muted px-2 py-0.5 text-sm font-semibold text-fd-foreground">
            npm install
          </code>{' '}
          and go.
        </p>

        {/* Sponsor buttons */}
        <div className="mt-12">
          <p className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-fd-muted-foreground/60">
            Support the project
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="https://github.com/sponsors/trillium"
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn inline-flex items-center gap-2.5 rounded-2xl border border-pink-500/20 bg-gradient-to-b from-pink-500/[0.08] to-transparent px-6 py-3.5 text-sm font-semibold text-fd-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-pink-500/30 hover:shadow-lg hover:shadow-pink-500/10"
            >
              <svg
                viewBox="0 0 16 16"
                className="size-5 text-pink-500 transition-transform duration-300 group-hover/btn:scale-110"
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
              className="group/btn inline-flex items-center gap-2.5 rounded-2xl border border-amber-500/20 bg-gradient-to-b from-amber-500/[0.08] to-transparent px-6 py-3.5 text-sm font-semibold text-fd-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/10"
            >
              <span
                className="text-lg text-amber-500 transition-transform duration-300 group-hover/btn:scale-110"
                aria-hidden="true"
              >
                &#9749;
              </span>
              Buy Me a Coffee
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
