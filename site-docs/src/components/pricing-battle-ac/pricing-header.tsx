import s from './pricing.module.css'

export function PricingHeader() {
  return (
    <header className={s.header}>
      <span className={s.overline}>Pricing</span>
      <h1 className={s.display}>
        Three tiers.
        <br />
        One price.
      </h1>
      <p className={s.headline}>
        Every plan is free, forever. Pick the one that matches your vibe.
      </p>
    </header>
  )
}
