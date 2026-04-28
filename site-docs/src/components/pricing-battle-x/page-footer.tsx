import styles from './enterprise-architect.module.css'

/**
 * PageFooter — Global footer with auxiliary navigation
 *
 * @component
 * @accessibility Role: contentinfo, proper link labeling
 * @designPattern DS-FOOTER-001 (Standard Footer)
 * @owner Platform Design Committee
 * @since v4.0.0
 */

const FOOTER_LINKS = [
  { label: 'Terms of Service', href: '#' },
  { label: 'Privacy Policy', href: '#' },
  { label: 'Cookie Preferences', href: '#' },
  { label: 'Acceptable Use Policy', href: '#' },
  { label: 'Status Page', href: '#' },
  { label: 'Security', href: '#' },
] as const

export function PageFooter() {
  return (
    <div className={styles.pageFooter}>
      <div className={styles.footerInner}>
        <nav aria-label="Footer navigation">
          <div className={styles.footerLinks}>
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={styles.footerLink}
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>

        <div className={styles.footerDivider} />

        <p className={styles.footerCopy}>
          Feedtack is open source software licensed under the MIT License.
          <br />
          No actual enterprise, sales team, or SLA exists. This page is a work
          of satire.
        </p>

        <p className={styles.footerDocRef}>
          DOC-REF: FEED-PRICE-2026-001-R6 | Generated: 2026-01-15T09:42:00Z |
          Classification: PUBLIC
        </p>
      </div>
    </div>
  )
}
