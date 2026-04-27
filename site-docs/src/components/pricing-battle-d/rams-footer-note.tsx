import s from './rams.module.css'

/**
 * Closing statement. Honest, direct, functional.
 * Rams: "Good design is as little design as possible."
 */
export function RamsFooterNote() {
  return (
    <footer className={s.footer}>
      <div className={s.footerDivider} />

      <div className={s.footerContent}>
        <div className={s.footerText}>
          <p className={s.footerLabel}>Open source</p>
          <p className={s.footerDesc}>
            MIT licensed. No vendor lock-in. No telemetry. The code is the
            product.
          </p>
        </div>

        <div className={s.footerLinks}>
          <a
            href="https://github.com/trillium/feedtack"
            target="_blank"
            rel="noopener noreferrer"
            className={s.footerLink}
          >
            GitHub
          </a>
          <a
            href="https://github.com/sponsors/trillium"
            target="_blank"
            rel="noopener noreferrer"
            className={s.footerLink}
          >
            Sponsor
          </a>
        </div>
      </div>
    </footer>
  )
}
