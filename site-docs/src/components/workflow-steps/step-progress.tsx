'use client'

import { Fragment, useEffect, useRef, useState } from 'react'

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

/** How full is the segment between step i and step i+1? (0–1) */
function segmentFill(
  segIndex: number,
  activeIndex: number | null,
  pct: number,
): number {
  if (activeIndex == null) return 0 // reset gap — clear bar
  if (segIndex < activeIndex) return 1 // completed segment
  if (segIndex > activeIndex) return 0 // future segment
  // Active segment — partial fill
  const step = STEPS[activeIndex]
  return (pct - step.start) / (step.end - step.start)
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

  return (
    <div className="mb-6 overflow-visible px-6" aria-live="polite">
      {/* Labels row — mirrors the dots+segments layout below */}
      <div className="flex items-end">
        {STEPS.map((step, i) => {
          const isActive = i === activeIndex
          const isReached = activeIndex != null && pct >= step.start
          return (
            <Fragment key={step.name}>
              {/* Wrapper matches dot width, positions label centered above */}
              <div
                className="relative shrink-0 flex justify-center"
                style={{ width: isActive ? '14px' : '10px' }}
              >
                <span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 text-sm font-semibold whitespace-nowrap sm:text-base"
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
              </div>
              {i < STEPS.length - 1 && <div className="flex-1" />}
            </Fragment>
          )
        })}
      </div>

      {/* Dots + segment tracks — flexbox, no absolute positioning */}
      <div className="mt-3 flex items-center">
        {STEPS.map((step, i) => {
          const isActive = i === activeIndex
          const isReached = activeIndex != null && pct >= step.start
          const fill =
            i < STEPS.length - 1 ? segmentFill(i, activeIndex, pct) : 0
          return (
            <Fragment key={step.name}>
              {/* Dot */}
              <div
                className="shrink-0 rounded-full"
                style={{
                  width: isActive ? '14px' : '10px',
                  height: isActive ? '14px' : '10px',
                  background: isReached
                    ? 'var(--color-fd-primary, #2563eb)'
                    : 'var(--color-fd-card, #ffffff)',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  borderColor: isReached
                    ? 'var(--color-fd-primary, #2563eb)'
                    : 'var(--color-fd-border, #e5e7eb)',
                  boxShadow: isActive
                    ? '0 0 0 3px color-mix(in srgb, var(--color-fd-primary, #2563eb) 25%, transparent)'
                    : 'none',
                  transition:
                    'width 0.3s, height 0.3s, background 0.3s, border-color 0.3s, box-shadow 0.3s',
                }}
              />
              {/* Segment track between dots */}
              {i < STEPS.length - 1 && (
                <div
                  className="relative mx-0.5 h-1.5 flex-1 overflow-hidden rounded-full"
                  style={{
                    background: 'var(--color-fd-border, #d1d5db)',
                  }}
                >
                  <div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      width: `${fill * 100}%`,
                      background: 'var(--color-fd-primary, #2563eb)',
                      transition: 'width 0.15s linear',
                      boxShadow:
                        fill > 0
                          ? '0 0 6px color-mix(in srgb, var(--color-fd-primary, #2563eb) 50%, transparent)'
                          : 'none',
                    }}
                  />
                </div>
              )}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
