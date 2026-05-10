import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getViewportMeta, TAILWIND_BREAKPOINTS } from './meta.js'

function mockMatchMedia(viewportWidth: number) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn((query: string) => {
      // Parse min-width queries like "(min-width: 1024px)"
      const match = query.match(/\(min-width:\s*(\d+)px\)/)
      const minWidth = match ? parseInt(match[1], 10) : 0
      return {
        matches: viewportWidth >= minWidth,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }
    }),
  })
}

describe('getViewportMeta — breakpoint resolution', () => {
  beforeEach(() => {
    // Set default window dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1440,
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 900,
    })
    Object.defineProperty(window, 'scrollX', {
      writable: true,
      configurable: true,
      value: 0,
    })
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    })
    Object.defineProperty(window, 'devicePixelRatio', {
      writable: true,
      configurable: true,
      value: 2,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns breakpoint "xl" for 1440px viewport with Tailwind defaults', () => {
    mockMatchMedia(1440)
    const meta = getViewportMeta(TAILWIND_BREAKPOINTS)
    expect(meta.breakpoint).toBe('xl')
  })

  it('returns breakpoint null when viewport is below all breakpoints', () => {
    mockMatchMedia(400)
    const meta = getViewportMeta(TAILWIND_BREAKPOINTS)
    expect(meta.breakpoint).toBeNull()
  })

  it('returns breakpoint null when no breakpoints provided', () => {
    mockMatchMedia(1440)
    const meta = getViewportMeta({})
    expect(meta.breakpoint).toBeNull()
  })

  it('resolves exact boundary match — 1024px returns "lg"', () => {
    mockMatchMedia(1024)
    const meta = getViewportMeta(TAILWIND_BREAKPOINTS)
    expect(meta.breakpoint).toBe('lg')
  })

  it('returns "2xl" for 1600px viewport', () => {
    mockMatchMedia(1600)
    const meta = getViewportMeta(TAILWIND_BREAKPOINTS)
    expect(meta.breakpoint).toBe('2xl')
  })

  it('returns "sm" for 640px viewport', () => {
    mockMatchMedia(640)
    const meta = getViewportMeta(TAILWIND_BREAKPOINTS)
    expect(meta.breakpoint).toBe('sm')
  })

  it('includes breakpoint in returned meta object', () => {
    mockMatchMedia(1440)
    const meta = getViewportMeta(TAILWIND_BREAKPOINTS)
    expect(meta).toHaveProperty('breakpoint')
    expect(typeof meta.width).toBe('number')
    expect(typeof meta.height).toBe('number')
    expect(typeof meta.devicePixelRatio).toBe('number')
  })

  it('uses custom breakpoints when provided', () => {
    mockMatchMedia(1300)
    const bootstrapBreakpoints = {
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
      xxl: 1400,
    }
    const meta = getViewportMeta(bootstrapBreakpoints)
    expect(meta.breakpoint).toBe('xl')
  })
})
