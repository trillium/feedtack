export function SponsorSectionNew() {
  return (
    <section className="relative px-6 py-28 text-center overflow-hidden">
      {/* Background gradient lifting from bottom */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
        }}
      />

      {/* Top border */}
      <div className="absolute inset-x-0 top-0 h-px hr-shimmer" />

      <div className="relative mx-auto max-w-2xl">
        {/* Decorative dots cluster */}
        <div
          className="mb-10 flex items-center justify-center gap-2"
          aria-hidden="true"
        >
          <div className="size-1.5 rounded-full bg-blue-500/40" />
          <div className="size-2 rounded-full bg-blue-500/60" />
          <div className="size-3 rounded-full bg-blue-500" />
          <div className="size-2 rounded-full bg-blue-500/60" />
          <div className="size-1.5 rounded-full bg-blue-500/40" />
        </div>

        <h2 className="text-4xl font-black tracking-[-0.03em] text-fd-foreground sm:text-5xl">
          Free and open source.
        </h2>
        <p className="mx-auto mt-6 max-w-md text-fd-muted-foreground leading-relaxed">
          MIT licensed. No strings attached. No credit card. No &quot;call us
          for pricing.&quot; Just{' '}
          <code className="rounded-lg bg-fd-muted/80 px-2.5 py-1 text-sm font-semibold text-fd-foreground border border-fd-border/30">
            npm install
          </code>{' '}
          and go.
        </p>

        {/* Sponsor buttons */}
        <div className="mt-12">
          <p className="mb-8 text-[10px] font-bold uppercase tracking-[0.25em] text-fd-muted-foreground/40">
            Support the project
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="https://github.com/sponsors/trillium"
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn inline-flex items-center gap-3 rounded-2xl border border-pink-500/15 bg-gradient-to-b from-pink-500/[0.06] to-transparent px-7 py-4 text-sm font-semibold text-fd-foreground backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-pink-500/30 hover:shadow-xl hover:shadow-pink-500/10"
            >
              <svg
                viewBox="0 0 16 16"
                className="size-5 text-pink-500 transition-transform duration-300 group-hover/btn:scale-125"
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
              className="group/btn inline-flex items-center gap-3 rounded-2xl border border-amber-500/15 bg-gradient-to-b from-amber-500/[0.06] to-transparent px-7 py-4 text-sm font-semibold text-fd-foreground backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/30 hover:shadow-xl hover:shadow-amber-500/10"
            >
              <span
                className="text-lg text-amber-500 transition-transform duration-300 group-hover/btn:scale-125"
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
