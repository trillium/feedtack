/**
 * Floating Kusama orbs — giant polka-dotted spheres
 * drifting across the page like pumpkins in infinity.
 */

interface Orb {
  className: string
  style: React.CSSProperties
}

const ORBS: Orb[] = [
  {
    className: 'kusama-orb kusama-orb--red',
    style: { width: 120, height: 120, top: '8%', left: '3%', opacity: 0.18 },
  },
  {
    className: 'kusama-orb kusama-orb--yellow',
    style: { width: 80, height: 80, top: '15%', right: '5%', opacity: 0.2 },
  },
  {
    className: 'kusama-orb kusama-orb--pink',
    style: { width: 60, height: 60, top: '45%', left: '8%', opacity: 0.15 },
  },
  {
    className: 'kusama-orb kusama-orb--red',
    style: { width: 40, height: 40, top: '60%', right: '12%', opacity: 0.12 },
  },
  {
    className: 'kusama-orb kusama-orb--yellow',
    style: {
      width: 100,
      height: 100,
      bottom: '10%',
      left: '15%',
      opacity: 0.14,
    },
  },
  {
    className: 'kusama-orb kusama-orb--pink',
    style: {
      width: 50,
      height: 50,
      bottom: '20%',
      right: '8%',
      opacity: 0.16,
    },
  },
  {
    className: 'kusama-orb kusama-orb--red',
    style: { width: 30, height: 30, top: '35%', left: '50%', opacity: 0.1 },
  },
  {
    className: 'kusama-orb kusama-orb--yellow',
    style: { width: 70, height: 70, top: '75%', left: '60%', opacity: 0.1 },
  },
]

export function KusamaOrbs() {
  return (
    <div
      className="pointer-events-none"
      style={{ position: 'fixed', inset: 0, zIndex: 1 }}
      aria-hidden="true"
    >
      {ORBS.map((orb) => {
        const key = `${orb.className}-${orb.style.top}-${orb.style.left}-${orb.style.right}`
        return <div key={key} className={orb.className} style={orb.style} />
      })}
    </div>
  )
}
