'use client'

import { Fragment, useCallback, useEffect, useRef, useState } from 'react'

const DURATION_MS = 16_000

const STEPS = [
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
  const containerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const dotRefs = useRef<(HTMLDivElement | null)[]>([])
  const [offsetX, setOffsetX] = useState(0)

  const setDotRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      dotRefs.current[i] = el
    },
    [],
  )

  // Slide inner content to center the active dot on narrow screens
  useEffect(() => {
    const container = containerRef.current
    const inner = innerRef.current
    const dot = activeIndex != null ? dotRefs.current[activeIndex] : null
    if (!container || !inner || !dot) return
    const containerW = container.offsetWidth
    const innerW = inner.scrollWidth
    if (innerW <= containerW) {
      setOffsetX(0)
      return
    } // fits, no shift needed
    const dotCenter = dot.offsetLeft + dot.offsetWidth / 2
    const shift = containerW / 2 - dotCenter
    setOffsetX(shift)
  }, [activeIndex])

  return (
    <div className="mb-6 overflow-visible" aria-live="polite">
      <div
        ref={containerRef}
        className="mx-auto overflow-visible px-6"
        style={{ maxWidth: 'min(80vw, 520px)' }}
      >
        <div
          ref={innerRef}
          style={{
            minWidth: '420px',
            transform: `translateX(${offsetX}px)`,
            transition: 'transform 0.4s ease',
          }}
        >
          {/* Labels row */}
          <div className="flex items-end gap-4 pb-1">
            {STEPS.map((step, i) => {
              const isActive = i === activeIndex
              const isReached = activeIndex != null && pct >= step.start
              return (
                <Fragment key={step.name}>
                  <span
                    className="shrink-0 text-sm font-semibold whitespace-nowrap sm:text-base"
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
                    ref={setDotRef(i)}
                    className="shrink-0 rounded-full"
                    style={{
                      width: '14px',
                      height: '14px',
                      transform: isActive ? 'scale(1)' : 'scale(0.714)',
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
                        'transform 0.3s, background 0.3s, border-color 0.3s, box-shadow 0.3s',
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
      </div>
    </div>
  )
}
