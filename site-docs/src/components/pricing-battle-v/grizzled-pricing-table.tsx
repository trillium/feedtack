import type { Tier } from '@/data/pricing-tiers'
import styles from './grizzled-pricing.module.css'

export function GrizzledPricingTable({ tiers }: { tiers: Tier[] }) {
  return (
    <div className={styles.page}>
      {/* header — man page style */}
      <header className={styles.header}>
        <h1 className={styles.title}>feedtack-pricing(7)</h1>
        <div className={styles.manpageRef}>
          Feedtack Reference Manual &mdash; Pricing &amp; Plans
        </div>
      </header>

      {/* NAME */}
      <section className={styles.section}>
        <div className={styles.sectionTitle}>Name</div>
        <p className={styles.description}>
          feedtack-pricing &mdash; how much feedtack costs (nothing)
        </p>
      </section>

      {/* SYNOPSIS */}
      <section className={styles.section}>
        <div className={styles.sectionTitle}>Synopsis</div>
        <p className={styles.description}>
          <code className={styles.ctaCode}>npm install feedtack</code>
        </p>
        <p className={styles.comment}>
          {/* <!-- that's it. that's the whole pricing page. --> */}
          &lt;!-- that&apos;s it. that&apos;s the whole pricing page. --&gt;
        </p>
      </section>

      {/* DESCRIPTION */}
      <section className={styles.section}>
        <div className={styles.sectionTitle}>Description</div>
        <p className={styles.description}>
          Yeah, it&apos;s all free. What did you expect? It&apos;s an npm
          package, not a Series B startup.
        </p>
        <p className={styles.description}>
          <span className={styles.snark}>
            No, there&apos;s no enterprise sales team. No, you can&apos;t
            &quot;schedule a demo.&quot; The demo is{' '}
            <code className={styles.ctaCode}>npm install feedtack</code>. It
            takes four seconds.
          </span>
        </p>
      </section>

      <hr className={styles.hr} />

      {/* PRICING TABLE — the actual content */}
      <section className={styles.section}>
        <div className={styles.sectionTitle}>Plans</div>
        <p className={styles.comment}>
          {/* <!-- this used to be a jQuery plugin --> */}
          &lt;!-- this used to be a jQuery plugin --&gt;
        </p>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Plan</th>
              <th>Price</th>
              <th>What You Get</th>
              <th>Install</th>
            </tr>
          </thead>
          <tbody>
            {tiers.map((tier) => (
              <tr key={tier.name}>
                <td className={styles.tierName}>
                  {tier.name}
                  {tier.locked && (
                    <span className={styles.lockedBadge}>locked</span>
                  )}
                  {tier.featured && (
                    <span className={styles.featuredBadge}>(*)</span>
                  )}
                </td>
                <td className={styles.price}>{tier.price}</td>
                <td className={styles.featuresCell}>
                  {tier.features.join(', ')}
                </td>
                <td className={styles.ctaCell}>
                  {tier.ctaHref ? (
                    <a
                      href={tier.ctaHref}
                      className={styles.ctaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {tier.cta}
                    </a>
                  ) : (
                    <code className={styles.ctaCode}>{tier.cta}</code>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <hr className={styles.hr} />

      {/* FAQ — using <details> like a self-respecting developer */}
      <section className={styles.section}>
        <div className={styles.sectionTitle}>FAQ</div>
        <p className={styles.comment}>
          &lt;!-- using real &lt;details&gt; elements because we&apos;re not
          animals --&gt;
        </p>

        <details className={styles.details}>
          <summary>Is there really no paid tier?</summary>
          <div className={styles.detailsContent}>
            <p>
              No. It&apos;s an open source npm package. Stop overthinking it.
            </p>
          </div>
        </details>

        <details className={styles.details}>
          <summary>What about support?</summary>
          <div className={styles.detailsContent}>
            <p>
              Open a GitHub issue. Read the source code. That&apos;s the
              support. It&apos;s been working for 20 years in every other open
              source project.
            </p>
          </div>
        </details>

        <details className={styles.details}>
          <summary>Do you offer SLAs?</summary>
          <div className={styles.detailsContent}>
            <p>
              The SLA is &quot;I&apos;ll get to it when I get to it.&quot; Same
              as every maintainer since 2003.
            </p>
          </div>
        </details>

        <details className={styles.details}>
          <summary>Can I get a SOC 2 report?</summary>
          <div className={styles.detailsContent}>
            <p>
              You can read the source code. It&apos;s right there. On GitHub. In
              plain text. That&apos;s more transparent than any SOC 2 audit
              you&apos;ve ever seen.
            </p>
          </div>
        </details>

        <details className={styles.details}>
          <summary>What about on-prem deployment?</summary>
          <div className={styles.detailsContent}>
            <p>
              <code className={styles.ctaCode}>npm install feedtack</code>.
              Congratulations, it&apos;s on your prem.
            </p>
          </div>
        </details>
      </section>

      <hr className={styles.hr} />

      {/* SEE ALSO */}
      <section className={styles.section}>
        <div className={styles.sectionTitle}>See Also</div>
        <p className={styles.description}>
          feedtack(1), npm-install(1), common-sense(7)
        </p>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <p>
          <a
            href="https://github.com/trillium/feedtack"
            className={styles.viewSource}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Source
          </a>{' '}
          &mdash; because you should always be able to read the code
        </p>
        <p className={styles.comment}>
          &lt;!-- built without a single div with rounded corners --&gt;
        </p>
      </footer>
    </div>
  )
}
