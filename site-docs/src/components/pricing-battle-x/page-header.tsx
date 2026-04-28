import styles from './enterprise-architect.module.css'

/**
 * PageHeader — Primary heading region for Pricing Overview
 *
 * @component
 * @accessibility Landmark: banner (implicit via header placement)
 * @designReview Approved 2026-01-14 (Design Governance Board)
 * @stakeholders VP Product, Dir. Engineering, Legal, Brand, Marketing, Finance
 * @since v4.0.0
 */

const APPROVALS = [
  'Legal',
  'Brand',
  'Accessibility',
  'Security',
  'Finance',
  'VP Product',
] as const

export function PageHeader() {
  return (
    <header className={styles.pageHeader}>
      <div className={styles.pageHeaderInner}>
        <span className={styles.documentId} title="Document reference number">
          Doc ID: FEED-PRICE-2026-001 Rev. 6
        </span>

        <h1 id="pricing-page-title" className={styles.pageTitle}>
          Plans &amp; Pricing
        </h1>

        <p className={styles.pageSubtitle}>
          Choose the plan that best fits your organization&apos;s needs. All
          plans include enterprise-grade features, dedicated SLA, and SSO
          integration.*
        </p>

        <ul
          className={styles.approvalBadges}
          aria-label="Stakeholder approvals"
        >
          {APPROVALS.map((name) => (
            <li key={name} className={styles.approvalBadge}>
              <span className={styles.approvalCheckmark} aria-hidden="true">
                ✓
              </span>
              {name}
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
