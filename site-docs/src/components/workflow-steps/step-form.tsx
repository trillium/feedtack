import { fd, WFA_COLORS } from './constants'

/** Step 3 — Mini feedback form appears */
export function StepForm() {
  return (
    <g className="wfa-form" style={{ transformOrigin: '198px 120px' }}>
      <rect
        x="180"
        y="92"
        width="100"
        height="70"
        rx="6"
        style={fd.cardBorder}
        strokeWidth="1.2"
        filter="url(#wfaShadow)"
      />
      <text x="192" y="108" fontSize="8" fontWeight="600" style={fd.fg}>
        Feedback
      </text>
      <rect x="188" y="113" width="84" height="24" rx="3" style={fd.muted} />
      <rect
        className="wfa-typing"
        x="192"
        y="120"
        height="4"
        rx="1.5"
        fill={WFA_COLORS.blue}
        opacity="0.5"
      />
      <rect
        x="228"
        y="142"
        width="44"
        height="14"
        rx="3"
        fill={WFA_COLORS.blue}
      />
      <text
        x="250"
        y="152"
        fontSize="7"
        fill="white"
        textAnchor="middle"
        fontWeight="600"
      >
        Submit
      </text>
    </g>
  )
}
