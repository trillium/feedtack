import { BrowserFrame } from './browser-frame'
import { PIN_PATH, WFA_COLORS } from './constants'
import { CursorIcon } from './svg-icons'

/** Step 2 — Browser with cursor moving in and dropping a pin */
export function StepClick() {
  return (
    <g className="wfa-pin-step">
      <BrowserFrame />
      {/* Cursor — Figma/Liveblocks-style collaboration pointer */}
      <g className="wfa-cursor" style={{ transformOrigin: '120px 118px' }}>
        <g transform="translate(118, 116) scale(1.1)">
          <CursorIcon />
        </g>
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
