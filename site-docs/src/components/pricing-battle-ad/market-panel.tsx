/** Data-dense market metrics panel — Bloomberg terminal energy */
export function MarketPanel() {
  const metrics = [
    { label: 'NPM Downloads', value: '∞', color: '' },
    { label: 'Cost Basis', value: '$0.00', color: '' },
    { label: 'Annual Savings', value: '$∞', color: 'amber' },
    { label: 'Adapter Count', value: 'ALL', color: '' },
    { label: 'Pin Limit', value: 'NONE', color: 'gold' },
    { label: 'Vendor Lock-in', value: '0%', color: '' },
    { label: 'Markup', value: '0.00%', color: '' },
    { label: 'Enterprise Tax', value: '$0.00', color: '' },
  ]

  return (
    <section className="market-panel">
      <h2 className="market-panel-title">
        Portfolio Analytics — Real-Time Market Data
      </h2>
      <div className="market-grid">
        {metrics.map((m) => (
          <div key={m.label} className="market-cell">
            <div className="market-cell-label">{m.label}</div>
            <div
              className={`market-cell-value${m.color ? ` market-cell-value-${m.color}` : ''}`}
            >
              {m.value}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
