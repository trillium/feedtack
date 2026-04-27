import { WFA_COLORS } from './constants'

/** Step 4 — Submission confirmation (green checkmark) */
export function StepSubmit() {
  return (
    <g className="wfa-check" style={{ transformOrigin: '300px 130px' }}>
      <circle cx="300" cy="130" r="18" fill={WFA_COLORS.green} opacity="0.15" />
      <circle cx="300" cy="130" r="12" fill={WFA_COLORS.green} />
      <path
        d="M294 130 l4 4 l8 -8"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  )
}
