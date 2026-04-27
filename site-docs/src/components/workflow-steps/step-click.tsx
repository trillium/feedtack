import { fd, PIN_PATH, WFA_COLORS } from './constants'

/** Step 2 — Browser with cursor moving in and dropping a pin */
export function StepClick() {
  return (
    <g className="wfa-pin-step">
      {/* Reuse browser frame as context, centered same as step 1 */}
      <g transform="translate(40, 20)">
        <rect
          width="220"
          height="160"
          rx="8"
          style={fd.cardBorder}
          strokeWidth="1.5"
        />
        <rect width="220" height="24" rx="8" style={fd.muted} />
        <rect y="16" width="220" height="8" style={fd.muted} />
        <circle cx="14" cy="12" r="3.5" fill="#ef4444" />
        <circle cx="25" cy="12" r="3.5" fill="#f59e0b" />
        <circle cx="36" cy="12" r="3.5" fill="#22c55e" />
        <rect
          x="50"
          y="6"
          width="120"
          height="12"
          rx="3"
          style={fd.card}
          opacity="0.7"
        />
        {/* Content lines */}
        <rect
          x="14"
          y="36"
          width="100"
          height="8"
          rx="2"
          style={fd.mutedFg}
          opacity="0.3"
        />
        <rect
          x="14"
          y="50"
          width="180"
          height="6"
          rx="2"
          style={fd.mutedFg}
          opacity="0.2"
        />
        <rect
          x="14"
          y="62"
          width="160"
          height="6"
          rx="2"
          style={fd.mutedFg}
          opacity="0.2"
        />
        {/* Highlighted element */}
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
      </g>
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
      {/* Step label */}
      <text className="wfa-label wfa-pin-label" x="150" y="210">
        2. Click
      </text>
    </g>
  )
}
