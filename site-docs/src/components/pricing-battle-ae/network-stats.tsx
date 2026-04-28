import s from './crypto.module.css'

const STATS = [
  { value: '10,000+', label: 'Waitlist Wallets' },
  { value: '∞', label: 'TPS Capacity' },
  { value: '$0', label: 'Gas Fees' },
  { value: '100%', label: 'Uptime (It\u2019s NPM)' },
]

export function NetworkStats() {
  return (
    <div className={s.networkBar}>
      {STATS.map((stat) => (
        <div key={stat.label} className={s.networkStat}>
          <span className={s.networkStatValue}>{stat.value}</span>
          <span className={s.networkStatLabel}>{stat.label}</span>
        </div>
      ))}
    </div>
  )
}
