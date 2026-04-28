import s from './pricing.module.css'

export function PricingFootnote() {
  return (
    <p className={s.footnote}>
      All plans include every feature. The tiers exist purely for psychological
      comfort. Feedtack is open source under the MIT license.
    </p>
  )
}
