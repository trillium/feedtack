import { BrodyFooter } from '@/components/pricing-battle-j/brody-footer'
import { BrodyHero } from '@/components/pricing-battle-j/brody-hero'
import { BrodyTierCard } from '@/components/pricing-battle-j/brody-tier-card'
import { TIERS } from '@/data/pricing-tiers'
import styles from './page.module.css'

export const metadata = {
  title: 'Pricing',
  description: 'Feedtack pricing — all tiers $0, forever.',
}

export default function PricingBattleJPage() {
  return (
    <div className={styles.page}>
      <BrodyHero />

      <section className={styles.tiersSection}>
        <div className={styles.tiersGrid}>
          {TIERS.map((tier) => (
            <BrodyTierCard key={tier.name} tier={tier} />
          ))}
        </div>
      </section>

      <BrodyFooter />
    </div>
  )
}
