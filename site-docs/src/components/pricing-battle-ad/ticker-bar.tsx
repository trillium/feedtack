/** Fake Bloomberg-style scrolling ticker */
export function TickerBar() {
  const items = [
    { symbol: 'FTCK', price: '0.00', change: '+0.00', pct: '+0.00%', up: true },
    { symbol: 'PINS', price: '999.99', change: '+∞', pct: '+∞%', up: true },
    {
      symbol: 'BUGS',
      price: '0.00',
      change: '-100%',
      pct: 'SQUASHED',
      up: false,
    },
    {
      symbol: 'DX',
      price: '10/10',
      change: '+10',
      pct: 'IMMACULATE',
      up: true,
    },
    { symbol: 'OSS', price: 'FREE', change: '+0.00', pct: '+0.00%', up: true },
    {
      symbol: 'SAAS',
      price: '0.00',
      change: '-99.99',
      pct: '-100%',
      up: false,
    },
    { symbol: 'ADAPT', price: 'ALL', change: '+∞', pct: 'INCLUDED', up: true },
    {
      symbol: 'FEED',
      price: 'BACK',
      change: '+100%',
      pct: 'COLLECTED',
      up: true,
    },
    {
      symbol: 'LOCK',
      price: '0.00',
      change: '+0.00',
      pct: 'UNLOCKED',
      up: true,
    },
    {
      symbol: 'NPM.I',
      price: '1.0.0',
      change: '+1.0.0',
      pct: 'LATEST',
      up: true,
    },
  ]

  // Double the items for seamless loop, each with a unique key
  const doubled = [
    ...items.map((item) => ({ ...item, key: `a-${item.symbol}` })),
    ...items.map((item) => ({ ...item, key: `b-${item.symbol}` })),
  ]

  return (
    <div className="ticker-bar" aria-hidden="true">
      <div className="ticker-track">
        {doubled.map((item) => (
          <span key={item.key} className="ticker-item">
            <span className="ticker-symbol">{item.symbol}</span>
            <span className={item.up ? 'ticker-up' : 'ticker-down'}>
              {item.price} {item.change} ({item.pct})
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
