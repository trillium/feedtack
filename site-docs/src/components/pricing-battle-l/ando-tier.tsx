/**
 * AndoTier — a single pricing tier in the Ando style.
 * No cards. No borders. No decoration.
 * Just typography, space, and a thin line of light.
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
    <div
      className={`ando-tier ando-emerge ${delayClass} relative flex flex-col`}
    >
      {/* Tier name */}
      <p className="mb-8 text-[0.6875rem] font-medium uppercase tracking-[0.25em] text-fd-muted-foreground">
        {name}
      </p>

      {/* Price */}
      <div className="mb-2 flex items-baseline gap-2">
        <span className="text-5xl font-extralight tracking-tight text-fd-foreground lg:text-6xl">
          {price}
        </span>
        <span className="text-sm font-light tracking-wide text-fd-muted-foreground/60">
          forever
        </span>
      </div>

      {/* Subtitle */}
      <p className="mb-10 text-sm italic text-fd-muted-foreground/70 lg:mb-14">
        {subtitle}
      </p>

      {/* Features */}
      <ul className="mb-10 flex-1 space-y-3.5 lg:mb-14">
        {features.map((f) => (
          <li
            key={f}
            className="text-[0.8125rem] font-light leading-relaxed text-fd-muted-foreground transition-colors duration-400 hover:text-fd-foreground"
          >
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
          className="ando-cta relative inline-block cursor-pointer font-mono text-[0.8125rem] tracking-[0.04em] text-fd-muted-foreground"
        >
          {cta}
        </a>
      ) : (
        <code className="ando-cta relative inline-block cursor-pointer font-mono text-[0.8125rem] tracking-[0.04em] text-fd-muted-foreground">
          {cta}
          {featured && (
            <span className="ando-breathe ml-2 inline-block size-1.5 rounded-full bg-[#c8965a]" />
          )}
        </code>
      )}
    </div>
  )
}
