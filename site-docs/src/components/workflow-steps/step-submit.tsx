import { WFA_COLORS } from './constants'

/** Step 4 — Submission confirmation (green checkmark) */
export function StepSubmit() {
  return (
    <g className="wfa-check" style={{ transformOrigin: '150px 110px' }}>
      {/* Centered checkmark */}
      <circle cx="150" cy="100" r="28" fill={WFA_COLORS.green} opacity="0.15" />
      <circle cx="150" cy="100" r="18" fill={WFA_COLORS.green} />
      <path
        d="M142 100 l6 6 l10 -12"
        fill="none"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Step label */}
      <text className="wfa-label" x="150" y="210">
        4. Submit
      </text>
    </g>
  )
}
