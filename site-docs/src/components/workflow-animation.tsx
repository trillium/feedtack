/**
 * WorkflowAnimation — pure CSS/SVG animated visualization of the
 * Feedtack workflow in 5 steps. Loops infinitely, respects
 * prefers-reduced-motion, and uses fd-* CSS variables for dark mode.
 *
 * All steps share a single centered stage area. Each step fades in,
 * plays its animation, then fades out before the next appears.
 */
import './workflow-animation.css'

import { ShimmerGradient } from './workflow-steps/shimmer-bar'
import { StepBrowser } from './workflow-steps/step-browser'
import { StepCatalogue } from './workflow-steps/step-catalogue'
import { StepClick } from './workflow-steps/step-click'
import { StepForm } from './workflow-steps/step-form'
import { StepProgress } from './workflow-steps/step-progress'
import { StepSubmit } from './workflow-steps/step-submit'

export function WorkflowAnimation() {
  return (
    <section
      className="flex items-center justify-center px-6 py-16 sm:py-20"
      aria-label="Animated workflow showing how Feedtack works"
    >
      <div
        className="wfa-root mx-auto w-full"
        style={{ maxWidth: 'min(80vw, 520px)', maxHeight: '650px' }}
      >
        <StepProgress />
        <svg
          viewBox="0 0 300 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Feedtack workflow: browse, click, describe, submit, catalogue"
          className="h-auto w-full"
          style={{ maxHeight: '400px' }}
        >
          <StepBrowser />
          <StepClick />
          <StepForm />
          <StepSubmit />
          <StepCatalogue />
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
            <ShimmerGradient />
          </defs>
        </svg>
      </div>
    </section>
  )
}
