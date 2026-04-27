/**
 * Decorative ornamental elements for the Anderson pricing diorama.
 * Corner flourishes, dividers, and border motifs.
 */

/** A diamond-centered horizontal rule in the vintage Anderson style. */
export function OrnamentalDivider({ color }: { color?: string }) {
  return (
    <div className="anderson-divider">
      <div
        className="anderson-divider-diamond"
        style={color ? { borderColor: color } : undefined}
      />
    </div>
  )
}

/** Decorative corner ornament — SVG flourish for card corners. */
export function CornerOrnament({
  position,
}: {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}) {
  const rotations: Record<string, string> = {
    'top-left': '0',
    'top-right': '90',
    'bottom-right': '180',
    'bottom-left': '270',
  }

  const positionStyles: Record<string, React.CSSProperties> = {
    'top-left': { top: 14, left: 14 },
    'top-right': { top: 14, right: 14 },
    'bottom-left': { bottom: 14, left: 14 },
    'bottom-right': { bottom: 14, right: 14 },
  }

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{
        position: 'absolute',
        ...positionStyles[position],
        transform: `rotate(${rotations[position]}deg)`,
        opacity: 0.4,
      }}
    >
      <path
        d="M0 0L0 6M0 0L6 0"
        stroke="var(--wa-border)"
        strokeWidth="1.5"
      />
    </svg>
  )
}

/** A centered star-like ornament used between sections. */
export function StarOrnament() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        padding: '1rem 0',
        color: 'var(--wa-border)',
        fontSize: '0.75rem',
        letterSpacing: '0.3em',
        fontFamily: 'var(--wa-font-display)',
      }}
      aria-hidden="true"
    >
      <span style={{ opacity: 0.5 }}>---</span>
      <span style={{ fontSize: '1rem' }}>&#10043;</span>
      <span style={{ opacity: 0.5 }}>---</span>
    </div>
  )
}

/** A vintage room number / tier number plaque. */
export function TierPlaque({
  number,
  color,
}: {
  number: number
  color: string
}) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        border: `2px solid ${color}`,
        borderRadius: '50%',
        fontFamily: 'var(--wa-font-display)',
        fontSize: '1rem',
        fontWeight: 700,
        color,
        marginBottom: '0.75rem',
      }}
    >
      {number}
    </div>
  )
}
