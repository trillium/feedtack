import type {
  FeedtackDeviceMeta,
  FeedtackPageMeta,
  FeedtackViewportMeta,
} from '../types/payload.js'

export function getViewportMeta(): FeedtackViewportMeta {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    scrollX: window.scrollX,
    scrollY: window.scrollY,
    devicePixelRatio: window.devicePixelRatio,
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

export function getPinCoords(event: MouseEvent): {
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
