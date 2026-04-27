import { BrowserFrame } from './browser-frame'
import { PIN_PATH, WFA_COLORS } from './constants'

/** Step 2 — Browser with cursor moving in and dropping a pin */
export function StepClick() {
  return (
    <g className="wfa-pin-step">
      <BrowserFrame />
      {/* Cursor — animated to move toward pin target */}
      <g className="wfa-cursor" style={{ transformOrigin: '120px 118px' }}>
        <path
          d="M120 118 l0 18 l4.5 -4.5 l3.5 7 l2.5 -1.2 l-3.5 -7 l5.5 -0.8 Z"
          fill="var(--color-fd-foreground, #111827)"
          stroke="var(--color-fd-card, #fff)"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </g>
      {/* Pin drops at the target */}
      <g className="wfa-pin" style={{ transformOrigin: '119px 118px' }}>
        <g transform="translate(113, 98)">
          <path d={PIN_PATH} fill={WFA_COLORS.red} transform="scale(0.55)" />
        </g>
      </g>
      {/* Ripple ring */}
      <circle
        className="wfa-ring"
        cx="119"
        cy="118"
        r="6"
        fill="none"
        stroke={WFA_COLORS.red}
        strokeWidth="1.5"
        style={{ transformOrigin: '119px 118px' }}
      />
    </g>
  )
}
