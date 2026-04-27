import { fd, WFA_COLORS } from './constants'

/** Step 1 — Mock browser window with content blocks */
export function StepBrowser() {
  return (
    <g className="wfa-browser">
      {/* Center a 220x160 browser in the 300x250 viewport */}
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
        {/* Bottom lines */}
        <rect
          x="14"
          y="128"
          width="140"
          height="6"
          rx="2"
          style={fd.mutedFg}
          opacity="0.15"
        />
        <rect
          x="14"
          y="140"
          width="110"
          height="6"
          rx="2"
          style={fd.mutedFg}
          opacity="0.15"
        />
      </g>
      {/* Step label */}
      <text className="wfa-label" x="150" y="210">
        1. Browse
      </text>
    </g>
  )
}
