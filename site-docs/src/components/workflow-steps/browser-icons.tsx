import { fd, WFA_COLORS } from './constants'
import { ShimmerBar } from './shimmer-bar'

export { ShimmerBar }

/* ------------------------------------------------------------------ */
/*  Traffic Lights — macOS window controls                             */
/* ------------------------------------------------------------------ */

export function TrafficLights({
  cx = 14,
  cy = 12,
  r = 3.5,
  gap = 11,
}: {
  cx?: number
  cy?: number
  r?: number
  gap?: number
}) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill="#ef4444" />
      <circle cx={cx + gap} cy={cy} r={r} fill="#f59e0b" />
      <circle cx={cx + gap * 2} cy={cy} r={r} fill="#22c55e" />
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Address Bar — browser URL bar                                      */
/* ------------------------------------------------------------------ */

export function AddressBar({
  x = 50,
  y = 6,
  width = 120,
  height = 12,
  rx = 3,
  opacity = 0.7,
}: {
  x?: number
  y?: number
  width?: number
  height?: number
  rx?: number
  opacity?: number
}) {
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      rx={rx}
      style={fd.card}
      opacity={opacity}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  Browser Chrome — title bar background (bar + fill below radius)    */
/* ------------------------------------------------------------------ */

export function BrowserChrome({
  width = 220,
  height = 24,
  rx = 8,
}: {
  width?: number
  height?: number
  rx?: number
}) {
  return (
    <>
      <rect width={width} height={height} rx={rx} style={fd.muted} />
      <rect y="16" width={width} height="8" style={fd.muted} />
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Content Lines — placeholder text lines inside browser              */
/* ------------------------------------------------------------------ */

export function ContentLines() {
  return (
    <>
      <ShimmerBar
        x={14}
        y={36}
        width={100}
        height={8}
        style={fd.mutedFg}
        opacity={0.3}
      />
      <ShimmerBar
        x={14}
        y={50}
        width={180}
        height={6}
        style={fd.mutedFg}
        opacity={0.2}
      />
      <ShimmerBar
        x={14}
        y={62}
        width={160}
        height={6}
        style={fd.mutedFg}
        opacity={0.2}
      />
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Bottom Content Lines — extra lines for browse step                 */
/* ------------------------------------------------------------------ */

export function BottomContentLines() {
  return (
    <>
      <ShimmerBar
        x={14}
        y={128}
        width={140}
        height={6}
        style={fd.mutedFg}
        opacity={0.15}
      />
      <ShimmerBar
        x={14}
        y={140}
        width={110}
        height={6}
        style={fd.mutedFg}
        opacity={0.15}
      />
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Highlighted Element — dashed-border target element                 */
/* ------------------------------------------------------------------ */

export function HighlightedElement() {
  return (
    <>
      <rect
        x="14"
        y="80"
        width="130"
        height="36"
        rx="4"
        style={fd.primary}
        opacity="0.12"
        stroke={WFA_COLORS.blue}
        strokeWidth="1"
        strokeDasharray="4 2"
      />
      <rect
        x="22"
        y="88"
        width="70"
        height="6"
        rx="2"
        style={fd.mutedFg}
        opacity="0.3"
      />
      <rect
        x="22"
        y="100"
        width="100"
        height="5"
        rx="2"
        style={fd.mutedFg}
        opacity="0.2"
      />
    </>
  )
}
