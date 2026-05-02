export function CountdownBanner() {
  return (
    <div className="countdown-bar">
      {'\u{23F0}'} LIMITED TIME: Free tier expires never &mdash; Act now!{' '}
      {'\u{23F0}'}
    </div>
  )
}

export function CompareToggle() {
  return (
    <div style={{ textAlign: 'center', marginBottom: 32 }}>
      <span className="compare-toggle">
        <span className="compare-toggle-dot" />
        Compare Plans
      </span>
      <div
        style={{
          fontSize: 11,
          color: 'var(--scrappy-muted)',
          marginTop: 6,
          fontStyle: 'italic',
        }}
      >
        (This toggle does nothing. All plans are the same.)
      </div>
    </div>
  )
}

export function MarqueeBanner() {
  const text =
    'BACKED BY Y COMBINATOR (not really) \u{00B7} FEATURED ON PRODUCT HUNT (in our dreams) \u{00B7} AS SEEN ON HACKER NEWS (we posted it ourselves) \u{00B7} TRUSTED BY 10,000+ DEVELOPERS (npm install count) \u{00B7} '
  return (
    <div className="marquee-container">
      <div className="marquee-content">
        {text}
        {text}
      </div>
    </div>
  )
}

export function SocialProof() {
  return (
    <div className="social-proof">
      <span className="social-proof-item">
        {'\u{2B50}'} 4.9/5 on G2 (0 reviews)
      </span>
      <span className="social-proof-item">
        {'\u{1F469}\u{200D}\u{1F4BB}'} 10,000+ devs (aspirational)
      </span>
      <span className="social-proof-item">
        {'\u{1F30D}'} Used in 0 countries (so far)
      </span>
      <span className="social-proof-item">
        {'\u{1F916}'} AI-powered (it&apos;s JavaScript)
      </span>
    </div>
  )
}
