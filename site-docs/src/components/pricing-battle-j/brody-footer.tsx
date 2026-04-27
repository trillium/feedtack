import styles from './brody-footer.module.css'

/**
 * Open-source callout in Brody's ruled editorial style.
 * Geometric accents, tracked-out type, bold rules.
 */
export function BrodyFooter() {
  return (
    <section className={styles.footer}>
      <div className={styles.rule} />

      <div className={styles.content}>
        {/* Geometric accent */}
        <div className={styles.geoAccent} aria-hidden="true">
          <svg aria-hidden="true" viewBox="0 0 80 80" className={styles.geoSvg}>
            <circle
              cx="40"
              cy="40"
              r="30"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <rect
              x="25"
              y="25"
              width="30"
              height="30"
              fill="currentColor"
              opacity="0.1"
            />
            <line
              x1="10"
              y1="40"
              x2="70"
              y2="40"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.3"
            />
            <line
              x1="40"
              y1="10"
              x2="40"
              y2="70"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.3"
            />
          </svg>
        </div>

        <h2 className={styles.title}>OPEN SOURCE</h2>
        <p className={styles.subtitle}>
          Feedtack is MIT-licensed. Always free. Always open.
        </p>

        <a
          href="https://github.com/trillium/feedtack"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          <span className={styles.linkText}>VIEW ON GITHUB</span>
          <span className={styles.linkArrow}>&rarr;</span>
        </a>
      </div>

      {/* Bottom strip with geometric symbols */}
      <div className={styles.bottomStrip} aria-hidden="true">
        <span className={styles.stripDot} />
        <span className={styles.stripRule} />
        <span className={styles.stripSquare} />
        <span className={styles.stripRule} />
        <span className={styles.stripDot} />
      </div>
    </section>
  )
}
