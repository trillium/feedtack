import s from './savanna.module.css'

export function PricingHero() {
  return (
    <>
      <div className={s.canopy} aria-hidden="true" />
      <header className={s.hero}>
        <p className={s.heroEyebrow}>Elevated Pricing</p>
        <h1 className={s.heroTitle}>
          Reach new heights.
          <br />
          Always free.
        </h1>
        <p className={s.heroSubtitle}>
          Three tall tiers, one grounded price. Every feature stands above the
          rest — browse at your own pace, no acacia strings attached.
        </p>
      </header>
    </>
  )
}
