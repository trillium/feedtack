/** Hero section — luxury positioning with candlestick chart decoration */
export function HeroSection() {
  // Fake candlestick data — mostly green, naturally
  const candles = [
    { id: 'c1', h: 35, body: 18, bull: true },
    { id: 'c2', h: 28, body: 12, bull: false },
    { id: 'c3', h: 40, body: 22, bull: true },
    { id: 'c4', h: 32, body: 14, bull: true },
    { id: 'c5', h: 25, body: 10, bull: false },
    { id: 'c6', h: 45, body: 28, bull: true },
    { id: 'c7', h: 38, body: 20, bull: true },
    { id: 'c8', h: 30, body: 15, bull: false },
    { id: 'c9', h: 42, body: 25, bull: true },
    { id: 'c10', h: 48, body: 30, bull: true },
    { id: 'c11', h: 36, body: 18, bull: true },
    { id: 'c12', h: 28, body: 12, bull: false },
    { id: 'c13', h: 50, body: 32, bull: true },
    { id: 'c14', h: 44, body: 26, bull: true },
    { id: 'c15', h: 52, body: 35, bull: true },
    { id: 'c16', h: 46, body: 28, bull: true },
    { id: 'c17', h: 34, body: 16, bull: false },
    { id: 'c18', h: 55, body: 38, bull: true },
    { id: 'c19', h: 50, body: 32, bull: true },
    { id: 'c20', h: 58, body: 42, bull: true },
  ]

  return (
    <section className="hero-section">
      <p className="hero-eyebrow">
        By Invitation Only &bull; For Discerning Engineers &bull; Est. 2025
      </p>

      <h1 className="hero-title">
        Maximize Your <strong>Feedback Alpha</strong>
      </h1>

      <p className="hero-subtitle">
        The institutional-grade feedback infrastructure trusted by engineering
        teams who refuse to settle. Zero cost. Infinite returns. This is how
        portfolios are built.
      </p>

      <div className="hero-stats">
        <div className="hero-stat">
          <div className="hero-stat-value">10,000+</div>
          <div className="hero-stat-label">Teams Deployed</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-value">$0.00</div>
          <div className="hero-stat-label">Total Cost of Ownership</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-value">∞%</div>
          <div className="hero-stat-label">Return on Investment</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-value">0.00</div>
          <div className="hero-stat-label">Hidden Fees</div>
        </div>
      </div>

      {/* Decorative candlestick chart */}
      <div className="candle-chart" aria-hidden="true">
        {candles.map((c) => (
          <div
            key={c.id}
            className={`candle ${c.bull ? 'candle-bull' : 'candle-bear'}`}
            style={{ height: `${c.h}px` }}
          >
            <div
              className="candle-wick"
              style={{ height: `${c.h - c.body}px` }}
            />
            <div className="candle-body" style={{ height: `${c.body}px` }} />
          </div>
        ))}
      </div>
    </section>
  )
}
