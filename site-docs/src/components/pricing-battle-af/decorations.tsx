/**
 * Hand-drawn SVG decorations — stars, suns, stick figures, squiggles, and a
 * 5-year-old's best attempt at the Feedtack logo (a pin/tack).
 */

export function CrayonStar({
  color = '#fbbf24',
  size = 40,
  className = '',
}: {
  color?: string
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
    >
      <polygon
        points="50,5 63,35 95,35 70,57 80,90 50,70 20,90 30,57 5,35 37,35"
        fill={color}
        stroke="#92400e"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CrayonSun({
  size = 80,
  className = '',
}: {
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="50"
        cy="50"
        r="22"
        fill="#fbbf24"
        stroke="#f97316"
        strokeWidth="3"
      />
      {/* rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <line
          key={angle}
          x1="50"
          y1="50"
          x2={50 + 38 * Math.cos((angle * Math.PI) / 180)}
          y2={50 + 38 * Math.sin((angle * Math.PI) / 180)}
          stroke="#f97316"
          strokeWidth="3"
          strokeLinecap="round"
        />
      ))}
    </svg>
  )
}

export function StickFigure({
  size = 60,
  className = '',
}: {
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 80"
      className={className}
      aria-hidden="true"
    >
      {/* head */}
      <circle
        cx="30"
        cy="14"
        r="10"
        fill="none"
        stroke="#e8262a"
        strokeWidth="3"
      />
      {/* body */}
      <line x1="30" y1="24" x2="30" y2="52" stroke="#e8262a" strokeWidth="3" />
      {/* arms */}
      <line x1="30" y1="34" x2="12" y2="44" stroke="#e8262a" strokeWidth="3" />
      <line x1="30" y1="34" x2="48" y2="44" stroke="#e8262a" strokeWidth="3" />
      {/* legs */}
      <line x1="30" y1="52" x2="16" y2="72" stroke="#e8262a" strokeWidth="3" />
      <line x1="30" y1="52" x2="44" y2="72" stroke="#e8262a" strokeWidth="3" />
      {/* smile */}
      <path
        d="M24,16 Q30,22 36,16"
        fill="none"
        stroke="#e8262a"
        strokeWidth="2"
      />
    </svg>
  )
}

export function SquigglyLine({
  width = 200,
  color = '#9333ea',
  className = '',
}: {
  width?: number
  color?: string
  className?: string
}) {
  return (
    <svg
      width={width}
      height="16"
      viewBox={`0 0 ${width} 16`}
      className={className}
      aria-hidden="true"
    >
      <path
        d={`M0,8 ${Array.from({ length: Math.floor(width / 20) })
          .map(
            (_, i) =>
              `Q${i * 20 + 10},${i % 2 === 0 ? 0 : 16} ${(i + 1) * 20},8`,
          )
          .join(' ')}`}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** A 5-year-old's attempt at drawing the Feedtack pin logo */
export function CrayonFeedtackLogo({
  size = 100,
  className = '',
}: {
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size * 1.4}
      viewBox="0 0 100 140"
      className={className}
      aria-hidden="true"
    >
      {/* pin head — wobbly circle */}
      <ellipse
        cx="50"
        cy="42"
        rx="34"
        ry="38"
        fill="#e8262a"
        stroke="#92400e"
        strokeWidth="4"
      />
      {/* shiny spot */}
      <ellipse cx="38" cy="30" rx="8" ry="10" fill="#fca5a5" opacity="0.7" />
      {/* pin needle — slightly crooked */}
      <line
        x1="50"
        y1="78"
        x2="53"
        y2="130"
        stroke="#6b7280"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* needle point */}
      <polygon points="49,128 53,130 57,128 53,140" fill="#6b7280" />
      {/* letter F on the pin — messy */}
      <text
        x="40"
        y="52"
        fill="white"
        fontSize="30"
        fontWeight="900"
        fontFamily="'Comic Sans MS', cursive"
        transform="rotate(-5, 50, 42)"
      >
        F
      </text>
    </svg>
  )
}

export function Rainbow({ className = '' }: { className?: string }) {
  return <div className={`crayon-rainbow ${className}`} />
}
