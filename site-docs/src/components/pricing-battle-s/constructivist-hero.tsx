export function ConstructivistHero() {
  return (
    <header className="lissitzky-hero">
      {/* Iconic red wedge */}
      <div
        className="lissitzky-wedge lissitzky-wedge--hero"
        aria-hidden="true"
      />

      {/* Suprematist circle decoration */}
      <div
        className="lissitzky-circle lissitzky-circle--md lissitzky-circle--filled"
        style={{ top: '1rem', left: '5%', opacity: 0.08 }}
        aria-hidden="true"
      />
      <div
        className="lissitzky-circle lissitzky-circle--sm"
        style={{ bottom: '1rem', right: '15%', opacity: 0.12 }}
        aria-hidden="true"
      />

      <h1 className="lissitzky-hero__title">Pricing</h1>
      <p className="lissitzky-hero__subtitle">
        Choose your plan &mdash; all roads lead to $0
      </p>
    </header>
  )
}
