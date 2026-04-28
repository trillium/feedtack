import styles from './enterprise-architect.module.css'

/**
 * FAQSection — Frequently Asked Questions
 *
 * @component
 * @accessibility Semantic heading hierarchy, dl pattern considered but
 *   rejected in round 4 of accessibility review in favor of heading + p.
 * @owner Product Marketing
 * @since v4.0.0
 */

const FAQS = [
  {
    q: 'What is the difference between the Free, Pro, and Enterprise plans?',
    a: 'Technically, nothing. All plans are $0 and include the same features. However, the Enterprise plan includes the prestige of saying you have an Enterprise plan during procurement meetings.',
  },
  {
    q: 'How many seats are included?',
    a: 'All plans include unlimited seats because Feedtack is an npm package that runs in your browser. The "seat" limits listed above are purely decorative.',
  },
  {
    q: 'Do you offer SSO / SAML integration?',
    a: 'Feedtack is a client-side JavaScript library. SSO is not applicable. But we listed it anyway because enterprise pricing pages require it.',
  },
  {
    q: 'What is your uptime SLA?',
    a: "Feedtack runs in your browser, so uptime is whatever your computer's uptime is. We guarantee 99.9% aspirational uptime, which means we aspire to it.",
  },
  {
    q: 'Can I speak to a sales representative?',
    a: 'There is no sales team. But "Contact Sales" sounds more enterprise, so we included the button. It links to the GitHub repo.',
  },
  {
    q: 'Is Feedtack SOC 2 Type II certified?',
    a: 'No. But the compliance badge looks great in a slide deck. You handle your own SOC 2 compliance since it runs on your infrastructure.',
  },
] as const

export function FAQSection() {
  return (
    <section className={styles.faqSection} aria-labelledby="faq-heading">
      <p className={styles.sectionLabel}>
        Section 4.0 — Frequently Asked Questions
      </p>
      <h2 id="faq-heading" className={styles.sectionTitle}>
        FAQ
      </h2>

      <ul
        aria-label="Frequently asked questions"
        style={{ listStyle: 'none', margin: 0, padding: 0 }}
      >
        {FAQS.map((faq, i) => (
          <li key={faq.q} className={styles.faqItem}>
            <h3 className={styles.faqQuestion} id={`faq-q-${i}`}>
              {faq.q}
            </h3>
            <p className={styles.faqAnswer}>{faq.a}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
