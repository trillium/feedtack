import type { BrutalistTier } from './tier-data'

function ApprovedStamp() {
  return (
    <div
      className="brutalist-stamp pointer-events-none absolute right-4 -top-6 z-10 sm:right-8 sm:-top-8"
      aria-hidden="true"
    >
      <div
        style={{
          transform: 'rotate(-12deg)',
          fontFamily: 'monospace',
          fontSize: 'clamp(0.9rem, 2vw, 1.4rem)',
          fontWeight: 900,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          borderRadius: 0,
          border: '4px double #dc2626',
          color: '#dc2626',
          padding: '0.4rem 1rem',
          opacity: 0.9,
        }}
      >
        <span style={{ lineHeight: 1 }}>APPROVED</span>
      </div>
    </div>
  )
}

export function ProTierBlock({ tier }: { tier: BrutalistTier }) {
  return (
    <article
      className="relative border-4 border-fd-foreground bg-fd-background p-0"
      style={{
        fontFamily: 'monospace',
        boxShadow: '8px 8px 0 0 var(--color-fd-foreground)',
        overflow: 'visible',
      }}
    >
      <ApprovedStamp />

      {/* Header — inverted */}
      <div className="flex items-baseline justify-between bg-fd-foreground px-4 py-2 text-fd-background">
        <h2
          className="uppercase tracking-[0.2em]"
          style={{ fontSize: '0.75rem', fontWeight: 700 }}
        >
          {tier.name}
        </h2>
        <span style={{ fontSize: '10px' }}>sec. 02</span>
      </div>

      {/* MOST POPULAR — raw stamp */}
      <div className="border-b-2 border-fd-foreground bg-fd-foreground/5 px-4 py-1">
        <span
          className="text-fd-foreground"
          style={{
            fontSize: '0.6rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            fontWeight: 700,
          }}
        >
          {'>>> MOST POPULAR <<<'}
        </span>
      </div>

      {/* Price */}
      <div className="relative border-b border-dashed border-fd-foreground/40 px-4 py-8">
        <span
          className="text-fd-foreground"
          style={{
            fontSize: 'clamp(5rem, 10vw, 7rem)',
            fontWeight: 900,
            lineHeight: 0.85,
            letterSpacing: '-0.06em',
          }}
        >
          {tier.price}
        </span>
        <span
          className="absolute bottom-2 right-4 text-fd-muted-foreground"
          style={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}
        >
          /FOREVER
        </span>
      </div>

      {/* Subtitle */}
      <div className="border-b border-fd-foreground/20 px-4 py-2">
        <p className="text-fd-muted-foreground" style={{ fontSize: '0.75rem' }}>
          {tier.subtitle}
        </p>
      </div>

      {/* Features */}
      <div className="px-4 py-4">
        <div className="mb-2 text-[10px] uppercase tracking-[0.2em] text-fd-muted-foreground">
          Includes:
        </div>
        <ul className="space-y-1.5">
          {tier.features.map((f) => (
            <li
              key={f}
              className="flex items-start gap-2 text-fd-foreground"
              style={{ fontSize: '0.75rem', lineHeight: 1.4 }}
            >
              <span
                className="mt-0.5 inline-block shrink-0 font-bold"
                aria-hidden="true"
              >
                +
              </span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA — inverted */}
      <div className="border-t-4 border-fd-foreground px-4 py-3">
        <code
          className="block w-full bg-fd-foreground px-3 py-3 text-center text-fd-background transition-opacity hover:opacity-80"
          style={{
            fontSize: '0.75rem',
            cursor: 'pointer',
            fontWeight: 700,
            borderRadius: 0,
            letterSpacing: '0.05em',
          }}
        >
          $ {tier.cta}
        </code>
      </div>
    </article>
  )
}
