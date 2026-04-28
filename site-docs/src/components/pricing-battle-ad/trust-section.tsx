/** Social proof — the whale convincer */
export function TrustSection() {
  const logos = [
    'Goldman Stacks',
    'Morgan Standup',
    'J.P. Morgan.parse()',
    'Blackrock.yml',
    'Citadel.css',
    'Two Sigma Grids',
    'Bridgewater Assoc. Array',
  ]

  return (
    <section className="trust-section">
      <p className="trust-header">
        Trusted by 10,000+ engineering teams at the world&apos;s most discerning
        organizations
      </p>
      <div className="trust-logos">
        {logos.map((name) => (
          <span key={name} className="trust-logo">
            {name}
          </span>
        ))}
      </div>
    </section>
  )
}
