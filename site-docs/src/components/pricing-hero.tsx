import { PIN_PALETTE, PinSvg } from '@/components/pin-svg'

const HERO_PINS = [
  { x: '6%', y: '18%', color: PIN_PALETTE[4], size: 36, rotate: -20 },
  { x: '92%', y: '22%', color: PIN_PALETTE[0], size: 28, rotate: 16 },
  { x: '18%', y: '80%', color: PIN_PALETTE[5], size: 24, rotate: 10 },
  { x: '84%', y: '75%', color: PIN_PALETTE[3], size: 20, rotate: -8 },
] as const

export function PricingHero() {
  return (
    <section className="relative overflow-hidden px-6 pt-28 pb-20 text-center sm:pt-36 sm:pb-24">
      {/* Multi-layered gradient background */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background: [
            'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(37,99,235,0.06) 0%, transparent 60%)',
            'radial-gradient(ellipse 40% 40% at 20% 50%, rgba(139,92,246,0.03) 0%, transparent 60%)',
            'radial-gradient(ellipse 40% 40% at 80% 50%, rgba(245,158,11,0.03) 0%, transparent 60%)',
          ].join(', '),
        }}
      />

      {/* Scattered decorative pins */}
      <div
        className="pointer-events-none absolute inset-0 hidden sm:block"
        aria-hidden="true"
      >
        {HERO_PINS.map((pin) => (
          <div
            key={`${pin.x}-${pin.y}`}
            className="absolute opacity-15"
            style={{
              left: pin.x,
              top: pin.y,
              transform: `rotate(${pin.rotate}deg)`,
            }}
          >
            <PinSvg color={pin.color} size={pin.size} />
          </div>
        ))}
      </div>

      <div className="relative">
        <h1 className="text-5xl font-black tracking-tighter text-fd-foreground sm:text-6xl lg:text-7xl">
          Pricing
        </h1>
        <p className="mx-auto mt-5 max-w-md text-lg text-fd-muted-foreground leading-relaxed">
          Choose the plan that&apos;s right for you.
          <br />
          <span className="text-fd-muted-foreground/60">
            Spoiler: they&apos;re all the same.
          </span>
        </p>
      </div>
    </section>
  )
}
