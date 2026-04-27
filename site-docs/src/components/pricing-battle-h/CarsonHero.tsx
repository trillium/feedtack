import s from './carson.module.css'

export function CarsonHero() {
  return (
    <section className={s.heroZone}>
      <div className={s.heroInner}>
        {/* background word — enormous, ghosted */}
        <span className={s.heroWord} aria-hidden="true">
          PRICING
        </span>

        {/* strikethrough line */}
        <div className={s.heroStrike} aria-hidden="true" />

        {/* actual title — multi-line, mixed type, Carson collision */}
        <div className={s.heroTitle}>
          <span className={s.heroLine1}>feedtack presents</span>
          <span className={s.heroLine2}>All Free</span>
          <span className={s.heroLine3}>always was, always will be</span>
        </div>

        {/* scattered text fragments */}
        <span className={`${s.fragment} ${s.frag1}`} aria-hidden="true">
          open source
        </span>
        <span className={`${s.fragment} ${s.frag2}`} aria-hidden="true">
          mit license
        </span>
        <span className={`${s.fragment} ${s.frag3}`} aria-hidden="true">
          zero dollars
        </span>
      </div>
    </section>
  )
}
