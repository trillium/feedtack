import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/pricing-battle-x/breadcrumbs'
import { ComparisonMatrix } from '@/components/pricing-battle-x/comparison-matrix'
import { ComplianceBadges } from '@/components/pricing-battle-x/compliance-badges'
import styles from '@/components/pricing-battle-x/enterprise-architect.module.css'
import { FAQSection } from '@/components/pricing-battle-x/faq-section'
import { LegalDisclaimers } from '@/components/pricing-battle-x/legal-disclaimers'
import { PageFooter } from '@/components/pricing-battle-x/page-footer'
import { PageHeader } from '@/components/pricing-battle-x/page-header'
import { SystemBanner } from '@/components/pricing-battle-x/system-banner'
import { TierCards } from '@/components/pricing-battle-x/tier-cards'
import { TIERS } from '@/data/pricing-tiers'

export const metadata: Metadata = {
  title: 'Plans & Pricing — Feedtack Enterprise Platform',
  description:
    'Choose the Feedtack plan that fits your organization. All plans are $0. Enterprise-grade features, SSO, SLA, and compliance included.',
}

/**
 * PricingBattleX — "The Enterprise Architect"
 *
 * A pricing page that went through 6 rounds of committee review.
 * Corporate blue/gray palette. Breadcrumbs. Comparison matrix.
 * Legal disclaimers. Contact Sales buttons. ARIA labels on everything.
 * IBM Carbon Design System energy.
 *
 * @page /pricing-battle-x
 * @variant X — The Enterprise Architect
 * @designSystem Feedtack Enterprise DS v4.2.1
 * @approvedBy Design Governance Board, 2026-01-14
 */
export default function PricingBattleX() {
  return (
    <div className={styles.pageWrapper} lang="en">
      {/* Skip navigation link — WCAG 2.4.1 */}
      <a
        href="#pricing-page-title"
        className="sr-only focus:not-sr-only"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          background: '#2563eb',
          color: 'white',
          padding: '8px 16px',
          zIndex: 100,
        }}
      >
        Skip to main content
      </a>

      <SystemBanner />
      <Breadcrumbs />
      <PageHeader />

      <main id="main-content" aria-label="Pricing plans and feature comparison">
        <TierCards tiers={TIERS} />
        <ComparisonMatrix />
        <ComplianceBadges />
        <FAQSection />
      </main>

      <LegalDisclaimers />
      <PageFooter />

      {/* Fixed "Contact Sales" CTA — because every enterprise page needs one */}
      <a
        href="https://github.com/trillium/feedtack"
        className={styles.contactSalesFloat}
        aria-label="Contact our sales team (links to GitHub)"
        target="_blank"
        rel="noopener noreferrer"
      >
        Contact Sales
      </a>
    </div>
  )
}
