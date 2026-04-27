'use client'

/**
 * WorkflowAnimation — pure CSS/SVG animated visualization of the
 * Feedtack workflow in 5 steps. Loops infinitely, respects
 * prefers-reduced-motion, and uses fd-* CSS variables for dark mode.
 *
 * All steps share a single centered stage area. Each step fades in,
 * plays its animation, then fades out before the next appears.
 */
import { useEffect, useState } from 'react'
import './workflow-animation.css'

import { StepBrowser } from './workflow-steps/step-browser'
import { StepCatalogue } from './workflow-steps/step-catalogue'
import { StepClick } from './workflow-steps/step-click'
import { StepForm } from './workflow-steps/step-form'
import { StepSubmit } from './workflow-steps/step-submit'

const DURATION_MS = 16_000

const STEPS = [
  { name: 'Browse', start: 0, end: 0.18 },
  { name: 'Click', start: 0.18, end: 0.34 },
  { name: 'Describe', start: 0.34, end: 0.54 },
  { name: 'Submit', start: 0.54, end: 0.68 },
  { name: 'Catalogue', start: 0.68, end: 0.9 },
] as const

function getStepIndex(elapsed: number): number | null {
  const pct = (elapsed % DURATION_MS) / DURATION_MS
  for (let i = 0; i < STEPS.length; i++) {
    if (pct >= STEPS[i].start && pct < STEPS[i].end) return i
  }
  return null // reset gap
}

export function WorkflowAnimation() {
  const [stepIndex, setStepIndex] = useState<number | null>(0)

  useEffect(() => {
    const t0 = Date.now()
    const id = setInterval(() => {
      setStepIndex(getStepIndex(Date.now() - t0))
    }, 200)
    return () => clearInterval(id)
  }, [])

  const label = stepIndex != null ? STEPS[stepIndex].name : ''
  const counter = stepIndex != null ? `${stepIndex + 1} / 5` : ''

  return (
    <section
      className="flex items-center justify-center px-6 py-16 sm:py-20"
      aria-label="Animated workflow showing how Feedtack works"
    >
      <div className="wfa-root w-full max-w-2xl">
        {/* Jumbotron step header */}
        <div className="mb-4 text-center" aria-live="polite">
          <p
            className="text-xl font-semibold text-fd-foreground"
            style={{
              opacity: label ? 1 : 0,
              transition: 'opacity 0.4s ease',
              minHeight: '1.75rem',
            }}
          >
            {label}
          </p>
          <p
            className="text-sm text-fd-muted-foreground"
            style={{
              opacity: counter ? 0.6 : 0,
              transition: 'opacity 0.4s ease',
              minHeight: '1.25rem',
            }}
          >
            {counter}
          </p>
        </div>
        <svg
          viewBox="0 0 300 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Feedtack workflow: browse, click, describe, submit, catalogue"
          className="h-auto w-full"
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
          </defs>
        </svg>
      </div>
    </section>
  )
}
