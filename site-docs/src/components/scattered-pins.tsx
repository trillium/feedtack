import { PIN_PALETTE, PinSvg } from '@/components/pin-svg'

const SCATTERED_PINS: {
  x: string
  y: string
  color: string
  size: number
  rotate: number
  opacity: number
}[] = [
  {
    x: '8%',
    y: '12%',
    color: PIN_PALETTE[0],
    size: 38,
    rotate: -18,
    opacity: 0.7,
  },
  {
    x: '22%',
    y: '6%',
    color: PIN_PALETTE[1],
    size: 28,
    rotate: 12,
    opacity: 0.5,
  },
  {
    x: '78%',
    y: '8%',
    color: PIN_PALETTE[2],
    size: 34,
    rotate: -8,
    opacity: 0.6,
  },
  {
    x: '90%',
    y: '18%',
    color: PIN_PALETTE[3],
    size: 26,
    rotate: 20,
    opacity: 0.5,
  },
  {
    x: '5%',
    y: '55%',
    color: PIN_PALETTE[4],
    size: 30,
    rotate: -25,
    opacity: 0.45,
  },
  {
    x: '92%',
    y: '48%',
    color: PIN_PALETTE[5],
    size: 32,
    rotate: 15,
    opacity: 0.55,
  },
  {
    x: '15%',
    y: '80%',
    color: PIN_PALETTE[2],
    size: 24,
    rotate: 10,
    opacity: 0.4,
  },
  {
    x: '85%',
    y: '75%',
    color: PIN_PALETTE[0],
    size: 28,
    rotate: -12,
    opacity: 0.45,
  },
  {
    x: '50%',
    y: '4%',
    color: PIN_PALETTE[4],
    size: 22,
    rotate: 5,
    opacity: 0.35,
  },
  {
    x: '65%',
    y: '85%',
    color: PIN_PALETTE[1],
    size: 26,
    rotate: -20,
    opacity: 0.4,
  },
]

export function ScatteredPins() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {SCATTERED_PINS.map((pin) => (
        <div
          key={`${pin.x}-${pin.y}`}
          className="absolute"
          style={{
            left: pin.x,
            top: pin.y,
            opacity: pin.opacity,
            transform: `rotate(${pin.rotate}deg)`,
          }}
        >
          <PinSvg color={pin.color} size={pin.size} />
        </div>
      ))}
    </div>
  )
}
