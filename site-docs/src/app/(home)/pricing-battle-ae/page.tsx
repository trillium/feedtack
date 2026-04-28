import s from '@/components/pricing-battle-ae/crypto.module.css'
import { CryptoBottom } from '@/components/pricing-battle-ae/crypto-bottom'
import { CryptoHero } from '@/components/pricing-battle-ae/crypto-hero'
import { CryptoTierCard } from '@/components/pricing-battle-ae/crypto-tier-card'
import { NetworkStats } from '@/components/pricing-battle-ae/network-stats'
import { TIERS } from '@/data/pricing-tiers'

export const metadata = {
  title: 'Pricing — The Trustless Feedback Protocol',
  description:
    'Sovereign, composable, permissionless feedback infrastructure. All tiers $0. WAGMI.',
}

export default function PricingBattleAEPage() {
  return (
    <div className={s.page}>
      {/* Background effects */}
      <div className={s.hexGrid} aria-hidden="true" />
      <div className={s.nodeLines} aria-hidden="true" />

      {/* Decorative diamonds */}
      <div className={`${s.diamond} ${s.diamond1}`} aria-hidden="true" />
      <div className={`${s.diamond} ${s.diamond2}`} aria-hidden="true" />
      <div className={`${s.diamond} ${s.diamond3}`} aria-hidden="true" />
      <div className={`${s.diamond} ${s.diamond4}`} aria-hidden="true" />

      <CryptoHero />

      {/* Early adopter banner */}
      <div className={s.earlyBanner}>
        <span className={s.earlyBannerText}>
          {'🔥'} Early Adopter Pricing &mdash; Limited Genesis Round {'🔥'}
        </span>
      </div>

      {/* Waitlist flex */}
      <p className={s.waitlist}>
        Join <span className={s.waitlistCount}>10,247</span> builders in the
        waitlist
      </p>

      {/* Tier cards */}
      <div className={s.grid}>
        {TIERS.map((tier) => (
          <CryptoTierCard key={tier.name} tier={tier} />
        ))}
      </div>

      {/* Network stats */}
      <NetworkStats />

      {/* Bottom CTA / the punchline */}
      <CryptoBottom />
    </div>
  )
}
