import type { ConstructivistTier } from './tier-data'

export function ConstructivistCard({
  tier,
  index,
}: {
  tier: ConstructivistTier
  index: number
}) {
  const isFeatured = tier.featured === true
  const isLocked = tier.locked === true

  const cardClass = [
    'lissitzky-card',
    isFeatured && 'lissitzky-card--featured',
    isLocked && 'lissitzky-card--locked',
  ]
    .filter(Boolean)
    .join(' ')

  const sectionLabels = ['Section I', 'Section II', 'Section III']

  return (
    <article className={cardClass}>
      {/* Header */}
      <div className="lissitzky-card__header">
        <div className="lissitzky-card__label">{sectionLabels[index]}</div>
        <h2 className="lissitzky-card__name">{tier.name}</h2>
      </div>

      {/* Price */}
      <div className="lissitzky-card__price-block">
        <div className="lissitzky-card__price">{tier.price}</div>
        <span className="lissitzky-card__price-label">Per month / forever</span>
        <div className="lissitzky-card__subtitle">{tier.subtitle}</div>
      </div>

      {/* Features */}
      <ul className="lissitzky-card__features">
        {tier.features.map((feature) => (
          <li key={feature} className="lissitzky-card__feature">
            {feature}
          </li>
        ))}
      </ul>

      {/* CTA */}
      {tier.ctaHref ? (
        <a href={tier.ctaHref} className="lissitzky-card__cta">
          {tier.cta}
        </a>
      ) : (
        <div className="lissitzky-card__cta">
          <code>{`$ ${tier.cta}`}</code>
        </div>
      )}
    </article>
  )
}
