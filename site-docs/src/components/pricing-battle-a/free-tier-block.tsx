import type { BrutalistTier } from './tier-data'

export function FreeTierBlock({ tier }: { tier: BrutalistTier }) {
  return (
    <article
      className="border-2 border-fd-foreground bg-fd-background p-0"
      style={{ fontFamily: 'monospace' }}
    >
      {/* Header bar */}
      <div className="flex items-baseline justify-between border-b-2 border-fd-foreground px-4 py-2">
        <h2
          className="text-fd-foreground uppercase tracking-[0.2em]"
          style={{ fontSize: '0.75rem', fontWeight: 700 }}
        >
          {tier.name}
        </h2>
        <span className="text-[10px] text-fd-muted-foreground">sec. 01</span>
      </div>

      {/* Price — massive, overlapping */}
      <div className="relative border-b border-dashed border-fd-foreground/40 px-4 py-6">
        <span
          className="text-fd-foreground"
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

      {/* Features — newspaper column style */}
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
                className="mt-0.5 inline-block shrink-0 text-fd-muted-foreground"
                aria-hidden="true"
              >
                +
              </span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="border-t-2 border-fd-foreground px-4 py-3">
        <code
          className="block w-full border-2 border-fd-foreground bg-fd-background px-3 py-2 text-center text-fd-foreground transition-colors hover:bg-fd-foreground hover:text-fd-background"
          style={{
            fontSize: '0.75rem',
            cursor: 'pointer',
            borderRadius: 0,
          }}
        >
          $ {tier.cta}
        </code>
      </div>
    </article>
  )
}
