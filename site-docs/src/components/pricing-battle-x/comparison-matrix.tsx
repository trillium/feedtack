import styles from './enterprise-architect.module.css'
import { MATRIX } from './matrix-data'

/**
 * ComparisonMatrix — Feature comparison table
 *
 * Full-width responsive table comparing features across tiers.
 * Follows DS-TABLE-001 (Data Table) and DS-TABLE-002 (Comparison Table).
 *
 * @component
 * @accessibility Caption element, scope attributes on th, role annotations
 * @designPattern DS-TABLE-002 (Comparison Table)
 * @dataSource pricing-feature-matrix.yaml (v2.4)
 * @owner Product Marketing
 * @reviewedBy Accessibility Guild (2026-01-20)
 * @since v4.2.0
 */

function CellValue({
  value,
  note,
}: {
  value: string | boolean
  note?: string
}) {
  if (typeof value === 'boolean') {
    return value ? (
      <span className={styles.checkIcon} title="Included">
        ✓
      </span>
    ) : (
      <span className={styles.dashIcon} title="Not included">
        —
      </span>
    )
  }
  return (
    <span>
      {value}
      {note && <span className={styles.cellNote}>{note}</span>}
    </span>
  )
}

export function ComparisonMatrix() {
  return (
    <section
      className={styles.comparisonSection}
      aria-labelledby="comparison-heading"
    >
      <p className={styles.sectionLabel}>
        Section 2.0 — Feature Comparison Matrix
      </p>
      <h2 id="comparison-heading" className={styles.sectionTitle}>
        Detailed Plan Comparison
      </h2>

      <section
        aria-labelledby="comparison-heading"
        style={{ overflowX: 'auto' }}
      >
        <table
          className={styles.comparisonTable}
          aria-label="Feature comparison across Free, Pro, and Enterprise plans"
        >
          <caption className="sr-only">
            Comparison of features across all pricing tiers. All plans are $0.
          </caption>
          <thead>
            <tr>
              <th scope="col">Feature</th>
              <th scope="col">Free</th>
              <th scope="col">Pro</th>
              <th scope="col">Enterprise</th>
            </tr>
          </thead>
          <tbody>
            {MATRIX.map((row) =>
              row.isCategory ? (
                <tr key={row.feature} className={styles.comparisonCategoryRow}>
                  <td colSpan={4}>{row.feature}</td>
                </tr>
              ) : (
                <tr key={row.feature}>
                  <td>
                    {row.feature}
                    {row.note &&
                      typeof row.free === 'boolean' &&
                      typeof row.pro === 'boolean' && (
                        <span className={styles.cellNote}>{row.note}</span>
                      )}
                  </td>
                  <td>
                    <CellValue
                      value={row.free}
                      note={typeof row.free === 'string' ? row.note : undefined}
                    />
                  </td>
                  <td>
                    <CellValue
                      value={row.pro}
                      note={typeof row.pro === 'string' ? row.note : undefined}
                    />
                  </td>
                  <td>
                    <CellValue
                      value={row.enterprise}
                      note={
                        typeof row.enterprise === 'string'
                          ? row.note
                          : undefined
                      }
                    />
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </section>
    </section>
  )
}
