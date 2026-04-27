import styles from './brody-hero.module.css'

/**
 * Neville Brody editorial hero — deconstructed masthead.
 * Giant display type with geometric accents, post-punk ruled layout.
 */
export function BrodyHero() {
  return (
    <section className={styles.hero}>
      {/* Background texture — diagonal hatching */}
      <div className={styles.bgTexture} aria-hidden="true" />

      {/* Geometric navigation symbols */}
      <div className={styles.symbolRow} aria-hidden="true">
        <svg aria-hidden="true" viewBox="0 0 24 24" className={styles.symbol}>
          <circle
            cx="12"
            cy="12"
            r="10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
        <svg aria-hidden="true" viewBox="0 0 24 24" className={styles.symbol}>
          <rect
            x="4"
            y="4"
            width="16"
            height="16"
            fill="currentColor"
            opacity="0.3"
          />
        </svg>
        <svg aria-hidden="true" viewBox="0 0 24 24" className={styles.symbol}>
          <polygon
            points="12,2 22,22 2,22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Main heading — massive editorial type */}
      <div className={styles.headingBlock}>
        <div className={styles.topRule} />
        <h1 className={styles.heading}>
          <span className={styles.headingMain}>PRICING</span>
        </h1>
        <div className={styles.bottomRule} />
      </div>

      {/* Subheading — smaller, tracked-out, industrial */}
      <p className={styles.subheading}>
        Choose the plan that&apos;s right for you
      </p>
      <p className={styles.subheadingSmall}>
        Spoiler: they&apos;re all the same
      </p>

      {/* Decorative glyph strip */}
      <div className={styles.glyphStrip} aria-hidden="true">
        <span className={styles.stripChar}>&#x25CF;</span>
        <span className={styles.stripLine} />
        <span className={styles.stripChar}>&#x25C6;</span>
        <span className={styles.stripLine} />
        <span className={styles.stripChar}>&#x25A0;</span>
        <span className={styles.stripLine} />
        <span className={styles.stripChar}>&#x25B2;</span>
      </div>
    </section>
  )
}
