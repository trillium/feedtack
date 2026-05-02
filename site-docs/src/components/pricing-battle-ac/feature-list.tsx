import { CheckIcon } from './check-icon'
import s from './pricing.module.css'

interface FeatureListProps {
  features: string[]
  muted?: boolean
}

export function FeatureList({ features, muted }: FeatureListProps) {
  return (
    <ul className={s.featureList}>
      {features.map((feature) => (
        <li key={feature} className={s.featureItem}>
          <CheckIcon muted={muted} />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  )
}
