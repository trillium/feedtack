import styles from './enterprise-architect.module.css'

/**
 * SystemBanner — Top-level environment indicator
 *
 * @component
 * @accessibility Role: status, aria-live: polite
 * @designToken ea-blue-900 (background), ea-success (status indicator)
 * @owner Platform Engineering
 * @since v4.0.0
 */
export function SystemBanner() {
  return (
    <div
      className={styles.systemBanner}
      role="status"
      aria-live="polite"
      aria-label="System environment status"
    >
      <span>
        <span className={styles.systemBannerDot} aria-hidden="true" />
        PROD — feedtack-pricing-service v4.2.1
      </span>
      <span>Region: us-east-1</span>
      <span>SLA: 99.9% Uptime</span>
    </div>
  )
}
