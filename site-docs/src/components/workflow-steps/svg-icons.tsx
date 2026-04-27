import { WFA_COLORS } from './constants'

/* ------------------------------------------------------------------ */
/*  Cursor — Figma/Liveblocks-style collaboration pointer              */
/* ------------------------------------------------------------------ */

const CURSOR_PATH =
  'M0.928548 2.18278C0.619075 1.37094 1.42087 0.577818 2.2293 0.896107L14.3863 5.68247C15.2271 6.0135 15.2325 7.20148 14.3947 7.54008L9.85984 9.373C9.61167 9.47331 9.41408 9.66891 9.31127 9.91604L7.43907 14.4165C7.09186 15.2511 5.90335 15.2333 5.58136 14.3886L0.928548 2.18278Z'

export function CursorIcon({
  fill = 'var(--color-fd-foreground, #111827)',
  stroke = 'var(--color-fd-card, #fff)',
  strokeWidth = 0.8,
}: {
  fill?: string
  stroke?: string
  strokeWidth?: number
}) {
  return (
    <path
      d={CURSOR_PATH}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  Checkmark Circle — green success indicator                         */
/* ------------------------------------------------------------------ */

export function CheckmarkIcon({
  cx = 150,
  cy = 100,
  color = WFA_COLORS.green,
  pulseClassName,
}: {
  cx?: number
  cy?: number
  color?: string
  pulseClassName?: string
}) {
  return (
    <>
      <circle
        cx={cx}
        cy={cy}
        r="28"
        fill={color}
        opacity="0.15"
        className={pulseClassName}
        style={
          pulseClassName ? { transformOrigin: `${cx}px ${cy}px` } : undefined
        }
      />
      <circle cx={cx} cy={cy} r="18" fill={color} />
      <path
        d={`M${cx - 8} ${cy} l6 6 l10 -12`}
        fill="none"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Word Dashes — typing-simulation rectangles for the form            */
/* ------------------------------------------------------------------ */

/** [x, y, width] for each "word" rectangle */
const WORDS: [number, number, number][] = [
  [16, 35, 14],
  [33.5, 35, 10],
  [47, 35, 18],
  [68.5, 35, 12],
  [84, 35, 16],
  [103.5, 35, 10],
  [16, 41, 16],
  [35.5, 41, 12],
  [51, 41, 10],
  [64.5, 41, 18],
  [86, 41, 14],
  [16, 47, 10],
  [29.5, 47, 16],
  [49, 47, 12],
  [64.5, 47, 14],
  [82, 47, 18],
  [16, 53, 18],
  [37.5, 53, 12],
  [53, 53, 8],
]

export function WordDashes({ color = WFA_COLORS.blue }: { color?: string }) {
  return (
    <>
      {WORDS.map(([x, y, w], i) => (
        <rect
          key={`w${x}-${y}`}
          className={`wfa-word-${i + 1}`}
          x={x}
          y={y}
          width={w}
          height={3}
          rx={1.5}
          fill={color}
          opacity={0}
        />
      ))}
    </>
  )
}
