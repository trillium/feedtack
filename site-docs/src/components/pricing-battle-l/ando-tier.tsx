/**
 * AndoTier — a single pricing tier in the Ando style.
 * No cards. No borders. No decoration.
 * Just typography, space, and a thin line of light.
 *
 * The tier is revealed through hierarchy:
 *   name (small, muted, uppercase, tracked)
 *   price (large, stark)
 *   subtitle (quiet italic whisper)
 *   features (a list that barely announces itself)
 *   cta (a monospace whisper with a light-line hover)
 */

interface AndoTierProps {
  name: string
  price: string
  subtitle: string
  features: string[]
  cta: string
  ctaHref?: string
  index: number
  featured?: boolean
}

export function AndoTier({
  name,
  price,
  subtitle,
  features,
  cta,
  ctaHref,
  index,
  featured,
}: AndoTierProps) {
  const delayClass = `ando-emerge-${index + 3}`

  return (
    <div className={`ando-tier ando-emerge ${delayClass} flex flex-col`}>
      {/* Tier name — architectural label */}
      <p
        className="text-[0.6875rem] font-medium tracking-[0.25em] uppercase mb-8"
        style={{ color: 'var(--ando-muted)' }}
      >
        {name}
      </p>

      {/* Price — monumental */}
      <div className="mb-2 flex items-baseline gap-2">
        <span
          className="text-5xl font-extralight tracking-tight lg:text-6xl"
          style={{ color: 'var(--ando-text)' }}
        >
          {price}
        </span>
        <span
          className="text-sm font-light tracking-wide"
          style={{ color: 'var(--ando-muted)', opacity: 0.6 }}
        >
          forever
        </span>
      </div>

      {/* Subtitle — the quiet commentary */}
      <p
        className="text-sm italic mb-10 lg:mb-14"
        style={{ color: 'var(--ando-muted)', opacity: 0.7 }}
      >
        {subtitle}
      </p>

      {/* Features — sparse, meditative list */}
      <ul className="ando-feature-list mb-10 lg:mb-14 flex-1 space-y-3.5">
        {features.map((f) => (
          <li key={f} className="text-[0.8125rem] font-light leading-relaxed">
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      {ctaHref ? (
        <a
          href={ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="ando-cta"
        >
          {cta}
        </a>
      ) : (
        <code className="ando-cta font-mono">
          {cta}
          {featured && (
            <span
              className="ando-breathe ml-2 inline-block size-1.5 rounded-full"
              style={{ backgroundColor: 'var(--ando-accent)' }}
            />
          )}
        </code>
      )}
    </div>
  )
}
