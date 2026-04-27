import { CheckmarkIcon } from './svg-icons'

/** Step 4 — Submission confirmation (green checkmark) */
export function StepSubmit() {
  return (
    <g className="wfa-check" style={{ transformOrigin: '150px 110px' }}>
      <CheckmarkIcon pulseClassName="wfa-check-pulse" />
    </g>
  )
}
