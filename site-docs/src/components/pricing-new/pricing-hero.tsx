export function PricingHeroNew() {
  return (
    <section className="relative px-6 pt-32 pb-16 sm:pt-40 sm:pb-20 text-center">
      {/* Eyebrow badge */}
      <div className="hero-reveal hero-reveal-1">
        <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-fd-border/40 bg-fd-card/60 px-5 py-2 text-xs font-medium text-fd-muted-foreground backdrop-blur-xl">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          100% open source &middot; MIT licensed
        </div>
      </div>

      {/* Main heading — dramatic scale */}
      <h1 className="hero-reveal hero-reveal-2">
        <span className="block text-6xl font-black tracking-[-0.04em] text-fd-foreground sm:text-7xl lg:text-8xl">
          Pricing
        </span>
        <span className="mt-2 block text-lg font-medium tracking-wide text-fd-muted-foreground sm:text-xl lg:text-2xl">
          that respects your wallet
        </span>
      </h1>

      {/* Subheading */}
      <p className="hero-reveal hero-reveal-3 mx-auto mt-8 max-w-lg text-base leading-relaxed text-fd-muted-foreground/80">
        Every feature. Every adapter. Every update.
        <br />
        <span className="font-semibold text-fd-foreground/70">
          Zero dollars. Zero catches. Zero regrets.
        </span>
      </p>

      {/* Decorative divider */}
      <div className="hero-reveal hero-reveal-3 mx-auto mt-12 h-px w-48 hr-shimmer" />
    </section>
  )
}
