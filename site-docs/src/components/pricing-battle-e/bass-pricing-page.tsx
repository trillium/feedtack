'use client'

import { TIERS } from '@/data/pricing-tiers'
import styles from './bass-pricing.module.css'
import { DiagonalSlash, SpiralDisc } from './bass-shapes'
import { BassTierCard } from './bass-tier-card'

export function BassPricingPage() {
  return (
    <div className={styles.scene}>
      {/* Decorative diagonal slashes — Bass signature */}
      <div className={styles.slashLeft}>
        <DiagonalSlash size={80} />
      </div>
      <div className={styles.slashRight}>
        <DiagonalSlash size={100} />
      </div>

      {/* Hero section */}
      <section className={styles.hero}>
        <div className={styles.heroBand} />

        {/* Spiral disc — Vertigo homage */}
        <div className={styles.spiralHero}>
          <SpiralDisc size={140} color="var(--bass-accent)" />
        </div>

        <h1 className={styles.heroTitle}>
          Pricing
          <span className={styles.heroTitleAccent}>
            Open Source. Always Free.
          </span>
        </h1>
        <p className={styles.heroSubtitle}>
          Choose the plan that&apos;s right for you. Spoiler:
          they&apos;re all the same.
        </p>
      </section>

      {/* Tier cards */}
      <section className={styles.grid}>
        {TIERS.map((tier, i) => (
          <BassTierCard key={tier.name} tier={tier} index={i} />
        ))}
      </section>

      {/* Open source badge */}
      <footer className={styles.badge}>
        <p className={styles.badgeText}>
          Feedtack is MIT-licensed.{' '}
          <a
            href="https://github.com/trillium/feedtack"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.badgeLink}
          >
            Star it on GitHub
          </a>{' '}
          and call it a day.
        </p>
      </footer>
    </div>
  )
}
