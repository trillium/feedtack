import { TIERS } from '@/data/pricing-tiers'
import { VignelliTier } from './VignelliTier'
import styles from './vignelli-pricing.module.css'

/**
 * Massimo Vignelli pricing page.
 *
 * "The life of a designer is a life of fight: fight against the
 * ugliness." — Massimo Vignelli
 *
 * Grid. Helvetica. Scale. Weight. Rules. Nothing else.
 */
export function VignelliPricing() {
  return (
    <div className={styles.page}>
      {/* ── Header ──────────────────────────────────────────── */}
      <header className={styles.header}>
        <hr className={styles.headerRule} />
        <h1 className={styles.title}>Pricing</h1>
        <p className={styles.subtitle}>
          Three plans. One price. Zero compromise. Open source means everyone
          gets everything.
        </p>
      </header>

      {/* ── Tier Grid ───────────────────────────────────────── */}
      <section className={styles.grid}>
        {TIERS.map((tier) => (
          <VignelliTier key={tier.name} tier={tier} />
        ))}
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className={styles.footer}>
        <hr className={styles.footerRule} />
        <div className={styles.footerGrid}>
          <h2 className={styles.footerHeading}>
            Open
            <br />
            Source
          </h2>
          <p className={styles.footerText}>
            Feedtack is MIT-licensed. No vendor lock-in, no usage limits, no
            surprise invoices. Fork it, extend it, ship it.{' '}
            <a
              href="https://github.com/trillium/feedtack"
              className={styles.footerLink}
            >
              View on GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
