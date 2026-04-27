export function BrutalistHeader() {
  return (
    <header
      className="relative border-b-4 border-fd-foreground"
      style={{ fontFamily: 'monospace' }}
    >
      {/* Top dateline bar */}
      <div className="flex items-center justify-between border-b-2 border-fd-foreground px-4 py-1 text-[10px] uppercase tracking-[0.3em] text-fd-muted-foreground">
        <span>Vol. 1 — No. 0</span>
        <span>Est. 2025</span>
        <span>Price: $0.00</span>
      </div>

      {/* Masthead */}
      <div className="relative px-6 py-6 sm:px-12 sm:py-8">
        {/* Grid overlay */}
        <div
          className="brutalist-grid-overlay pointer-events-none absolute inset-0"
          aria-hidden="true"
        />

        <div className="relative">
          {/* Title — newspaper masthead style */}
          <h1
            className="text-fd-foreground text-center leading-[0.85]"
            style={{
              fontSize: 'clamp(3rem, 10vw, 8rem)',
              fontFamily:
                '"Courier New", "Courier", "Lucida Console", monospace',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
            }}
          >
            Pricing
          </h1>

          {/* Subhead — rotated, offset */}
          <p
            className="absolute -right-2 top-2 bg-fd-foreground px-3 py-1 text-fd-background sm:right-8 sm:top-4"
            style={{
              fontFamily: 'monospace',
              fontSize: '0.65rem',
              transform: 'rotate(3deg)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            All plans: $0
          </p>

          {/* Subtitle */}
          <p
            className="mt-4 text-center text-fd-muted-foreground"
            style={{
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              maxWidth: '36ch',
              margin: '1rem auto 0',
            }}
          >
            Choose the plan that&apos;s right for you.
            <br />
            <span className="opacity-50">
              Spoiler: they&apos;re all the same.
            </span>
          </p>
        </div>
      </div>

      {/* Bottom rule with label */}
      <div className="flex items-center gap-2 border-t-2 border-fd-foreground px-4 py-1">
        <span
          className="text-[10px] uppercase tracking-[0.2em] text-fd-muted-foreground"
          style={{ fontFamily: 'monospace' }}
        >
          Open Source — MIT License — Free Forever
        </span>
        <div className="flex-1 border-t border-dashed border-fd-foreground/30" />
        <span
          className="text-[10px] text-fd-muted-foreground"
          style={{ fontFamily: 'monospace' }}
        >
          Page A-1
        </span>
      </div>
    </header>
  )
}
