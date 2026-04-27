import s from './editorial.module.css'

export function EditorialHero() {
  return (
    <section className={s.hero}>
      <hr className={s.heroRule} />
      <span className={s.heroKicker}>Feedtack Pricing</span>
      <h1 className={s.heroTitle}>
        Zero
        <br />
        Dollars
      </h1>
      <p className={s.heroSubtitle}>
        Three tiers. One price. All free, forever. An open-source feedback
        widget that believes great tools shouldn&rsquo;t cost a thing.
      </p>
      <hr className={s.heroRuleBottom} />
    </section>
  )
}
