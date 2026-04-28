import styles from './enterprise-architect.module.css'

/**
 * Breadcrumbs — Hierarchical navigation component
 *
 * Implements WAI-ARIA Breadcrumb pattern per
 * https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/
 *
 * @component
 * @accessibility aria-label on nav, aria-current on terminal node
 * @owner Information Architecture Team
 * @since v4.1.0
 * @reviewed 2026-Q1 (IA Committee — 3 rounds)
 */

const BREADCRUMB_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/' },
  { label: 'Pricing', href: '/' },
  { label: 'Plans', href: '/' },
  { label: 'Overview', href: null },
] as const

export function Breadcrumbs() {
  return (
    <nav className={styles.breadcrumbNav} aria-label="Breadcrumb navigation">
      <ol className={styles.breadcrumbList}>
        {BREADCRUMB_ITEMS.map((item, index) => (
          <li key={item.label} className={styles.breadcrumbItem}>
            {index > 0 && (
              <span className={styles.breadcrumbSeparator} aria-hidden="true">
                /
              </span>
            )}
            {item.href ? (
              <a href={item.href} className={styles.breadcrumbLink}>
                {item.label}
              </a>
            ) : (
              <span className={styles.breadcrumbCurrent} aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
