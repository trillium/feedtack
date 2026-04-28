import s from './crypto.module.css'

export function CryptoHero() {
  return (
    <section className={s.hero}>
      <div className={s.heroBadge}>
        <span className={s.badgeDot} />
        Mainnet Live &middot; Genesis Round Open
      </div>

      <h1 className={s.heroTitle}>
        The Trustless
        <br />
        Feedback Protocol
      </h1>

      <p className={s.heroSubtitle}>
        Sovereign, composable, permissionless feedback infrastructure for the
        decentralized web. <strong>Zero-knowledge survey proofs</strong> meet{' '}
        <strong>on-chain attestations</strong>.
      </p>

      {/* Fake token ticker */}
      <div className={s.ticker}>
        <span className={s.tickerSymbol}>$FTACK</span>
        <span className={s.tickerDivider} />
        <span className={s.tickerPrice}>$0.00</span>
        <span className={s.tickerChange}>+0.00%</span>
        <span className={s.tickerDivider} />
        <span className={s.tickerVolume}>Vol: $0</span>
      </div>

      {/* Genesis spots */}
      <div className={s.genesisSpots}>
        <span>7,312 / 10,000 Genesis Spots Claimed</span>
        <div className={s.genesisBar}>
          <div className={s.genesisFill} />
        </div>
      </div>
    </section>
  )
}
