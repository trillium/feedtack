import type { BrutalistTier } from './tier-data'

function RedactedLine({ text, delay }: { text: string; delay: number }) {
  return (
    <li
      className="relative flex items-start gap-2 text-fd-foreground"
      style={{ fontSize: '0.75rem', lineHeight: 1.4 }}
    >
      <span
        className="mt-0.5 inline-block shrink-0 text-fd-muted-foreground"
        aria-hidden="true"
      >
        +
      </span>
      <span className="relative">
        {text}
        <span
          className="brutalist-redact-bar absolute inset-0 bg-fd-foreground"
          style={{ animationDelay: `${delay}ms` }}
          aria-hidden="true"
        />
      </span>
    </li>
  )
}

function ClassifiedStamp() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
      aria-hidden="true"
    >
      <div
        style={{
          transform: 'rotate(-18deg)',
          fontFamily: 'monospace',
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
          fontWeight: 900,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          borderRadius: 0,
          padding: '0.25em 0.5em',
          border: '4px double currentColor',
          color: 'var(--color-fd-muted-foreground)',
          opacity: 0.2,
        }}
      >
        CLASSIFIED
      </div>
    </div>
  )
}

export function EnterpriseTierBlock({ tier }: { tier: BrutalistTier }) {
  return (
    <article
      className="relative border-2 border-dashed border-fd-muted-foreground/50 bg-fd-background p-0 overflow-hidden"
      style={{ fontFamily: 'monospace' }}
    >
      {/* Hatch pattern overlay */}
      <div
        className="brutalist-hatch pointer-events-none absolute inset-0"
        aria-hidden="true"
      />

      {/* Scanline effect */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="brutalist-scanline absolute inset-x-0 h-8 bg-fd-foreground/[0.02]"
          aria-hidden="true"
        />
      </div>

      <ClassifiedStamp />

      {/* Header */}
      <div className="relative flex items-baseline justify-between border-b border-dashed border-fd-muted-foreground/40 px-4 py-2">
        <h2
          className="text-fd-muted-foreground uppercase tracking-[0.2em]"
          style={{ fontSize: '0.75rem', fontWeight: 700 }}
        >
          {tier.name}
        </h2>
        <span className="text-fd-muted-foreground" style={{ fontSize: '10px' }}>
          sec. 03
        </span>
      </div>

      {/* Classification banner */}
      <div className="relative border-b border-fd-muted-foreground/20 px-4 py-1">
        <span
          className="text-fd-muted-foreground/60"
          style={{
            fontSize: '0.55rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
          }}
        >
          CLEARANCE LEVEL: CONTRIBUTOR
        </span>
      </div>

      {/* Price */}
      <div className="relative border-b border-dashed border-fd-muted-foreground/30 px-4 py-6">
        <span
          className="text-fd-muted-foreground/40"
          style={{
            fontSize: 'clamp(4rem, 8vw, 6rem)',
            fontWeight: 900,
            lineHeight: 0.9,
            letterSpacing: '-0.05em',
          }}
        >
          {tier.price}
        </span>
        <span
          className="absolute bottom-2 right-4 text-fd-muted-foreground/40"
          style={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}
        >
          /FOREVER
        </span>
      </div>

      {/* Subtitle */}
      <div className="relative border-b border-fd-muted-foreground/20 px-4 py-2">
        <p
          className="text-fd-muted-foreground/60"
          style={{ fontSize: '0.75rem' }}
        >
          {tier.subtitle}
        </p>
      </div>

      {/* Features — redacted */}
      <div className="relative px-4 py-4">
        <div className="mb-2 text-[10px] uppercase tracking-[0.2em] text-fd-muted-foreground/40">
          [REDACTED]:
        </div>
        <ul className="space-y-1.5">
          {tier.features.map((f, i) => (
            <RedactedLine key={f} text={f} delay={800 + i * 150} />
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="relative border-t border-dashed border-fd-muted-foreground/40 px-4 py-3">
        <a
          href={tier.ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full border border-dashed border-fd-muted-foreground/50 bg-fd-background px-3 py-2 text-center text-fd-muted-foreground transition-colors hover:border-fd-foreground hover:bg-fd-foreground hover:text-fd-background"
          style={{
            fontSize: '0.75rem',
            borderRadius: 0,
            textDecoration: 'none',
          }}
        >
          {'[ '}
          {tier.cta}
          {' ]'}
        </a>
      </div>
    </article>
  )
}
