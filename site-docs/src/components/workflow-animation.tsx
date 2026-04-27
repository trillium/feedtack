/**
 * WorkflowAnimation — pure CSS/SVG animated visualization of the
 * Feedtack workflow in 5 steps. Loops infinitely, respects
 * prefers-reduced-motion, and uses fd-* CSS variables for dark mode.
 */
import './workflow-animation.css'

import { StepBrowser } from './workflow-steps/step-browser'
import { StepCatalogue } from './workflow-steps/step-catalogue'
import { StepClick } from './workflow-steps/step-click'
import { StepForm } from './workflow-steps/step-form'
import { StepSubmit } from './workflow-steps/step-submit'

export function WorkflowAnimation() {
  return (
    <section
      className="flex items-center justify-center px-6 py-16 sm:py-20"
      aria-label="Animated workflow showing how Feedtack works"
    >
      <div className="wfa-root w-full max-w-2xl">
        <svg
          viewBox="0 0 520 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Feedtack workflow: click, pin, feedback, submit, catalogue"
          className="h-auto w-full"
        >
          <StepBrowser />
          <StepClick />
          <StepForm />
          <StepSubmit />
          <StepCatalogue />
          <StepLabels />
          <defs>
            <filter id="wfaShadow" x="-4%" y="-4%" width="108%" height="112%">
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="3"
                floodColor="#000"
                floodOpacity="0.08"
              />
            </filter>
          </defs>
        </svg>
      </div>
    </section>
  )
}

function StepLabels() {
  const y = 280
  return (
    <>
      <g className="wfa-browser">
        <text className="wfa-label" x="60" y={y}>
          1. Browse
        </text>
      </g>
      <g className="wfa-pin" style={{ transformOrigin: '109px 128px' }}>
        <text className="wfa-label" x="160" y={y}>
          2. Click
        </text>
      </g>
      <g className="wfa-form" style={{ transformOrigin: '198px 120px' }}>
        <text className="wfa-label" x="260" y={y}>
          3. Describe
        </text>
      </g>
      <g className="wfa-check" style={{ transformOrigin: '300px 130px' }}>
        <text className="wfa-label" x="360" y={y}>
          4. Submit
        </text>
      </g>
      <g className="wfa-catalogue">
        <text className="wfa-label" x="460" y={y}>
          5. Catalogue
        </text>
      </g>
    </>
  )
}
