import s from './editorial-features.module.css'

export function FeatureList({
  features,
  variant = 'default',
}: {
  features: string[]
  variant?: 'default' | 'featured' | 'locked'
}) {
  return (
    <ul className={s.featureList}>
      {features.map((feature) => {
        const firstChar = feature[0]
        const rest = feature.slice(1)
        return (
          <li key={feature} className={s.featureItem}>
            {variant !== 'featured' && (
              <span className={s.dropCap}>{firstChar}</span>
            )}
            {variant !== 'featured' ? rest : feature}
          </li>
        )
      })}
    </ul>
  )
}
