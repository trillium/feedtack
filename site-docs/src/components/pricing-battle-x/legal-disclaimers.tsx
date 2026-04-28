import styles from './enterprise-architect.module.css'

/**
 * LegalDisclaimers — Footnotes, disclaimers, and legal notices
 *
 * @component
 * @accessibility Role: contentinfo (footer landmark), proper list semantics
 * @legal Reviewed by Legal (2026-01-18). No actual legal review occurred.
 * @owner Legal & Compliance
 * @since v4.0.0
 */

const DISCLAIMERS = [
  '* "Priority GitHub Issues" means you starred the repository before filing. Response times are aspirational and not legally binding.',
  '** "Dedicated Slack channel" means you create a Slack channel and invite yourself. Feedtack maintainers may or may not join.',
  '*** SOC 2 Type II certification is the responsibility of the customer. Feedtack is an npm package. You certify yourself.',
  '† All pricing is in USD. All plans are $0.00/month. Price may change at any time, but it will still be $0.00.',
  '†† "Seats" are a conceptual framework. Feedtack does not track or limit users. Seat counts are listed for enterprise procurement compatibility.',
  '††† SLA uptime guarantees refer to the npm registry availability, not Feedtack itself. Feedtack runs in your browser.',
  '§ "White-glove onboarding" consists of the command: npm install feedtack. White gloves not included.',
  '§§ "On-prem deployment" means you installed an npm package on your own server. This has always been possible.',
  '¶ This pricing page was reviewed by 6 stakeholders across 4 departments over 3 sprints. All plans remained $0.',
  '¶¶ No animals were harmed in the production of this pricing page. Several committee meetings were, however, fatally boring.',
] as const

export function LegalDisclaimers() {
  return (
    <footer
      className={styles.legalSection}
      role="contentinfo"
      aria-label="Legal disclaimers and footnotes"
    >
      <div className={styles.legalInner}>
        <h2 className={styles.legalTitle}>
          Legal Notices, Disclaimers &amp; Footnotes
        </h2>

        <ul className={styles.legalList} aria-label="Disclaimer items">
          {DISCLAIMERS.map((text) => (
            <li key={text} className={styles.legalItem}>
              {text}
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
