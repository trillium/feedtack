import styles from './enterprise-architect.module.css'

/**
 * ComplianceBadges — Security & compliance certification display
 *
 * @component
 * @accessibility Role: list with descriptive labels
 * @designPattern DS-CARD-005 (Status Card)
 * @owner Security & Compliance Team
 * @since v4.0.0
 */

const BADGES = [
  {
    icon: '🔒',
    label: 'SOC 2 Type II',
    desc: 'Self-certified*',
  },
  {
    icon: '🛡️',
    label: 'GDPR Ready',
    desc: 'Your data, your rules',
  },
  {
    icon: '📋',
    label: 'ISO 27001',
    desc: 'Aspirationally compliant',
  },
  {
    icon: '🏢',
    label: 'On-Prem Deploy',
    desc: 'npm install feedtack',
  },
] as const

export function ComplianceBadges() {
  return (
    <section
      className={styles.complianceSection}
      aria-labelledby="compliance-heading"
    >
      <p className={styles.sectionLabel}>
        Section 3.0 — Security &amp; Compliance
      </p>
      <h2 id="compliance-heading" className={styles.sectionTitle}>
        Enterprise-Grade Security
      </h2>

      <ul
        className={styles.complianceGrid}
        aria-label="Compliance certifications"
      >
        {BADGES.map((badge) => (
          <li key={badge.label} className={styles.complianceCard}>
            <div className={styles.complianceIcon} aria-hidden="true">
              {badge.icon}
            </div>
            <p className={styles.complianceLabel}>{badge.label}</p>
            <p className={styles.complianceDesc}>{badge.desc}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
