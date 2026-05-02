export function CooperHero() {
  return (
    <section className="cooper-hero">
      <div className="cooper-hero-stack">
        {/* Depth layer 3 — far back, huge, barely visible */}
        <div className="cooper-hero-depth-3" aria-hidden="true">
          Pricing
        </div>
        {/* Depth layer 2 — mid distance, blurred */}
        <div className="cooper-hero-depth-2" aria-hidden="true">
          Pricing
        </div>
        {/* Depth layer 1 — foreground, sharp */}
        <h1 className="cooper-hero-depth-1">Pricing</h1>
      </div>
      <p className="cooper-hero-sub">
        Choose the plan that&apos;s right for you
        <span>Spoiler: they&apos;re all the same</span>
      </p>
    </section>
  )
}
