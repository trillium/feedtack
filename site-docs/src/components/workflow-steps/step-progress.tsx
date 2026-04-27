'use client'

import { useEffect, useRef, useState } from 'react'

const DURATION_MS = 16_000

export const STEPS = [
  { name: 'Browse', start: 0, end: 0.18 },
  { name: 'Click', start: 0.18, end: 0.34 },
  { name: 'Describe', start: 0.34, end: 0.54 },
  { name: 'Submit', start: 0.54, end: 0.68 },
  { name: 'Catalogue', start: 0.68, end: 0.9 },
] as const

function getProgress(elapsed: number) {
  const pct = (elapsed % DURATION_MS) / DURATION_MS
  let activeIndex: number | null = null
  for (let i = 0; i < STEPS.length; i++) {
    if (pct >= STEPS[i].start && pct < STEPS[i].end) {
      activeIndex = i
      break
    }
  }
  return { pct, activeIndex }
}

export function StepProgress() {
  const [state, setState] = useState({
    pct: 0,
    activeIndex: 0 as number | null,
  })
  const t0 = useRef(Date.now())

  useEffect(() => {
    const id = setInterval(() => {
      setState(getProgress(Date.now() - t0.current))
    }, 50)
    return () => clearInterval(id)
  }, [])

  const { pct, activeIndex } = state
  // Clamp progress to the active range (0-90%), scale to 0-100% for the bar
  const barPct = Math.min(pct / 0.9, 1) * 100

  return (
    <div className="mb-6" aria-live="polite">
      {/* Step names with tick connectors */}
      <div className="flex items-end justify-between px-1">
        {STEPS.map((step, i) => {
          const isActive = i === activeIndex
          const isReached = pct >= step.start
          return (
            <div key={step.name} className="flex flex-col items-center gap-1">
              <span
                className="text-sm font-semibold sm:text-base"
                style={{
                  color: isActive
                    ? 'var(--color-fd-primary, #2563eb)'
                    : isReached
                      ? 'var(--color-fd-foreground, #374151)'
                      : 'var(--color-fd-muted-foreground, #9ca3af)',
                  opacity: isActive ? 1 : isReached ? 0.7 : 0.35,
                  transition: 'color 0.3s ease, opacity 0.3s ease',
                  textShadow: isActive
                    ? '0 0 12px color-mix(in srgb, var(--color-fd-primary, #2563eb) 40%, transparent)'
                    : 'none',
                }}
              >
                {step.name}
              </span>
              {/* Tick connector from label to bar */}
              <div
                className="h-2 w-px"
                style={{
                  background: isReached
                    ? 'var(--color-fd-primary, #2563eb)'
                    : 'var(--color-fd-border, #e5e7eb)',
                  opacity: isActive ? 1 : isReached ? 0.6 : 0.4,
                  transition: 'background 0.3s ease, opacity 0.3s ease',
                }}
              />
            </div>
          )
        })}
      </div>

      {/* Progress track with dots */}
      <div
        className="relative h-1 w-full rounded-full"
        style={{ background: 'var(--color-fd-border, #e5e7eb)' }}
      >
        {/* Filled bar — continuously advances */}
        <div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{
            background: 'var(--color-fd-primary, #2563eb)',
            width: `${barPct}%`,
            transition: 'width 0.15s linear',
            opacity: activeIndex != null ? 1 : 0.3,
            boxShadow:
              activeIndex != null
                ? '0 0 6px color-mix(in srgb, var(--color-fd-primary, #2563eb) 50%, transparent)'
                : 'none',
          }}
        />

        {/* Dots at each step boundary */}
        {STEPS.map((step, i) => {
          const dotPos = (step.start / 0.9) * 100
          const reached = pct >= step.start
          const isActive = i === activeIndex
          return (
            <div
              key={step.name}
              className="absolute rounded-full"
              style={{
                left: `${dotPos}%`,
                width: isActive ? '14px' : '10px',
                height: isActive ? '14px' : '10px',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                background: reached
                  ? 'var(--color-fd-primary, #2563eb)'
                  : 'var(--color-fd-card, #ffffff)',
                borderWidth: '2px',
                borderStyle: 'solid',
                borderColor: reached
                  ? 'var(--color-fd-primary, #2563eb)'
                  : 'var(--color-fd-border, #e5e7eb)',
                boxShadow: isActive
                  ? '0 0 0 3px color-mix(in srgb, var(--color-fd-primary, #2563eb) 25%, transparent)'
                  : 'none',
                transition:
                  'width 0.3s ease, height 0.3s ease, background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
