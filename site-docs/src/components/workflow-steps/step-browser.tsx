import { fd, WFA_COLORS } from './constants'

/** Step 1 — Mock browser window with content blocks */
export function StepBrowser() {
  return (
    <g className="wfa-browser">
      <rect
        x="30"
        y="30"
        width="220"
        height="160"
        rx="8"
        style={fd.cardBorder}
        strokeWidth="1.5"
      />
      <rect x="30" y="30" width="220" height="24" rx="8" style={fd.muted} />
      <rect x="30" y="46" width="220" height="8" style={fd.muted} />
      <circle cx="44" cy="42" r="3.5" fill="#ef4444" />
      <circle cx="55" cy="42" r="3.5" fill="#f59e0b" />
      <circle cx="66" cy="42" r="3.5" fill="#22c55e" />
      <rect
        x="80"
        y="36"
        width="120"
        height="12"
        rx="3"
        style={fd.card}
        opacity="0.7"
      />
      <rect
        x="44"
        y="66"
        width="100"
        height="8"
        rx="2"
        style={fd.mutedFg}
        opacity="0.3"
      />
      <rect
        x="44"
        y="80"
        width="180"
        height="6"
        rx="2"
        style={fd.mutedFg}
        opacity="0.2"
      />
      <rect
        x="44"
        y="92"
        width="160"
        height="6"
        rx="2"
        style={fd.mutedFg}
        opacity="0.2"
      />
      <rect
        x="44"
        y="110"
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
        x="52"
        y="118"
        width="70"
        height="6"
        rx="2"
        style={fd.mutedFg}
        opacity="0.3"
      />
      <rect
        x="52"
        y="130"
        width="100"
        height="5"
        rx="2"
        style={fd.mutedFg}
        opacity="0.2"
      />
      <rect
        x="44"
        y="158"
        width="140"
        height="6"
        rx="2"
        style={fd.mutedFg}
        opacity="0.15"
      />
      <rect
        x="44"
        y="170"
        width="110"
        height="6"
        rx="2"
        style={fd.mutedFg}
        opacity="0.15"
      />
    </g>
  )
}
