/**
 * Saul Bass-inspired geometric SVG shapes.
 * Paper cut-out aesthetic — bold, angular, hand-crafted feeling.
 */

interface ShapeProps {
  className?: string
  color?: string
  size?: number
}

/** Vertigo-style spiral — concentric off-center circles */
export function SpiralDisc({ className, color, size = 120 }: ShapeProps) {
  const fill = color ?? 'var(--bass-accent)'
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      aria-hidden="true"
    >
      <circle cx="60" cy="60" r="58" fill={fill} />
      <circle cx="62" cy="58" r="44" fill="var(--bass-bg)" />
      <circle cx="58" cy="62" r="32" fill={fill} />
      <circle cx="61" cy="59" r="20" fill="var(--bass-bg)" />
      <circle cx="59" cy="61" r="10" fill={fill} />
    </svg>
  )
}

/** Diagonal slash — the Bass trademark */
export function DiagonalSlash({ className, color, size = 100 }: ShapeProps) {
  const fill = color ?? 'var(--bass-accent)'
  return (
    <svg
      width={size}
      height={size * 2.5}
      viewBox="0 0 40 100"
      className={className}
      aria-hidden="true"
    >
      <polygon points="0,100 15,100 40,0 25,0" fill={fill} />
    </svg>
  )
}

/** Torn paper edge — jagged, hand-cut feeling */
export function TornEdge({ className, color }: ShapeProps) {
  const fill = color ?? 'var(--bass-fg)'
  return (
    <svg
      width="100%"
      height="24"
      viewBox="0 0 400 24"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <polygon
        points="0,24 0,8 12,12 28,4 45,14 62,6 80,10 98,2 115,12 132,4 150,14 168,8 185,16 202,4 220,12 238,6 255,14 272,2 290,10 308,6 325,16 342,8 360,12 378,4 395,14 400,10 400,24"
        fill={fill}
      />
    </svg>
  )
}

/** Paper cut-out hand pointing — Bass poster style */
export function PointingHand({ className, color, size = 48 }: ShapeProps) {
  const fill = color ?? 'var(--bass-accent)'
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M8 28 L28 28 L28 20 L32 20 L32 16 L36 16 L36 20 L40 20 L40 24 L44 24 L44 32 L40 32 L40 36 L36 36 L36 40 L8 40 Z"
        fill={fill}
      />
    </svg>
  )
}

/** Bold geometric number — for tier numbering */
export function TierNumber({
  n,
  className,
  color,
  size = 160,
}: ShapeProps & { n: number }) {
  const fill = color ?? 'var(--bass-accent)'
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="10"
        y="10"
        width="140"
        height="140"
        fill={fill}
        transform="rotate(3 80 80)"
      />
      <text
        x="80"
        y="112"
        textAnchor="middle"
        fill="var(--bass-bg)"
        fontSize="120"
        fontWeight="900"
        fontFamily="Georgia, 'Times New Roman', serif"
        style={{ letterSpacing: '-0.05em' }}
      >
        {n}
      </text>
    </svg>
  )
}
