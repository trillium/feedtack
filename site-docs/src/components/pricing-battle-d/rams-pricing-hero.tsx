import s from './rams.module.css'

/**
 * Hero section. Less but better.
 * The headline is the interface. Nothing else competes for attention.
 */
export function RamsPricingHero() {
  return (
    <header className={s.hero}>
      <h1>Pricing</h1>
      <p>
        Three tiers. One price. Zero dollars.
        <br />
        Open source means open source.
      </p>
    </header>
  )
}
