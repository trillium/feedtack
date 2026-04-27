import { PIN_PATH, WFA_COLORS } from './constants'

/** Step 2 — Cursor moves in and drops a pin */
export function StepClick() {
  return (
    <>
      <g className="wfa-cursor" style={{ transformOrigin: '110px 128px' }}>
        <path
          d="M110 128 l0 18 l4.5 -4.5 l3.5 7 l2.5 -1.2 l-3.5 -7 l5.5 -0.8 Z"
          fill="var(--color-fd-foreground, #111827)"
          stroke="var(--color-fd-card, #fff)"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </g>
      <g className="wfa-pin" style={{ transformOrigin: '109px 128px' }}>
        <g transform="translate(103, 108)">
          <path d={PIN_PATH} fill={WFA_COLORS.red} transform="scale(0.55)" />
        </g>
      </g>
      <circle
        className="wfa-ring"
        cx="109"
        cy="128"
        r="6"
        fill="none"
        stroke={WFA_COLORS.red}
        strokeWidth="1.5"
        style={{ transformOrigin: '109px 128px' }}
      />
    </>
  )
}
