import type {
  FeedtackDeviceMeta,
  FeedtackPageMeta,
  FeedtackViewportMeta,
} from '../types/payload.js'

export const TAILWIND_BREAKPOINTS: Record<string, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

export function getViewportMeta(
  breakpoints: Record<string, number> = TAILWIND_BREAKPOINTS,
): FeedtackViewportMeta {
  // Resolve breakpoint: sort by value descending, return name of first match
  let breakpoint: string | null = null
  if (typeof window.matchMedia === 'function') {
    const entries = Object.entries(breakpoints).sort((a, b) => b[1] - a[1])
    for (const [name, px] of entries) {
      if (window.matchMedia(`(min-width: ${px}px)`).matches) {
        breakpoint = name
        break
      }
    }
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
    scrollX: window.scrollX,
    scrollY: window.scrollY,
    devicePixelRatio: window.devicePixelRatio,
    breakpoint,
  }
}

export function getPageMeta(): FeedtackPageMeta {
  return {
    url: window.location.href,
    pathname: window.location.pathname,
    title: document.title,
  }
}

export function getDeviceMeta(): FeedtackDeviceMeta {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    touchEnabled: navigator.maxTouchPoints > 0,
  }
}

export function getPinCoords(event: { clientX: number; clientY: number }): {
  x: number
  y: number
  xPct: number
  yPct: number
} {
  // Document-relative coordinates: accounts for scroll position
  const x = event.clientX + window.scrollX
  const y = event.clientY + window.scrollY
  const docWidth = document.documentElement.scrollWidth
  const docHeight = document.documentElement.scrollHeight
  return {
    x,
    y,
    xPct: Number(((x / docWidth) * 100).toFixed(2)),
    yPct: Number(((y / docHeight) * 100).toFixed(2)),
  }
}
