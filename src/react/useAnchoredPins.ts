'use client'

import { useCallback, useEffect, useState } from 'react'
import type { FeedbackItem, FeedtackPin } from '../types/payload.js'

export interface AnchoredPosition {
  x: number
  y: number
}

/**
 * Resolve pin positions from DOM nodes when possible, falling back to stored x/y.
 *
 * For each pin, we attempt to find the target element via its CSS selector.
 * If found, we compute where the pin should be relative to the element's current
 * bounding rect, preserving the original click offset within the element.
 */
export function useAnchoredPins(items: FeedbackItem[], pathname: string) {
  const [positions, setPositions] = useState<Map<string, AnchoredPosition>>(
    new Map(),
  )

  const resolve = useCallback(() => {
    const next = new Map<string, AnchoredPosition>()
    for (const item of items) {
      if (item.payload.page.pathname !== pathname) continue
      const pin = item.payload.pins[0]
      if (!pin) continue
      const pos = resolvePin(pin)
      next.set(item.payload.id, pos)
    }
    setPositions(next)
  }, [items, pathname])

  useEffect(() => {
    resolve()
  }, [resolve])

  // Re-resolve on resize and scroll (throttled)
  useEffect(() => {
    let raf = 0
    const handler = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(resolve)
    }
    window.addEventListener('resize', handler, { passive: true })
    window.addEventListener('scroll', handler, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', handler)
      window.removeEventListener('scroll', handler)
    }
  }, [resolve])

  const getPosition = useCallback(
    (itemId: string, fallbackPin: FeedtackPin): AnchoredPosition => {
      return positions.get(itemId) ?? { x: fallbackPin.x, y: fallbackPin.y }
    },
    [positions],
  )

  return { getPosition }
}

function resolvePin(pin: FeedtackPin): AnchoredPosition {
  const { target } = pin
  if (!target.selector) return { x: pin.x, y: pin.y }

  let el: Element | null = null
  try {
    el = document.querySelector(target.selector)
  } catch {
    // Invalid selector — fall back
    return { x: pin.x, y: pin.y }
  }
  if (!el) return { x: pin.x, y: pin.y }

  const rect = el.getBoundingClientRect()
  const origRect = target.boundingRect

  // Compute original click offset within the element as a ratio
  const ratioX =
    origRect.width > 0 ? (pin.x - origRect.x) / origRect.width : 0.5
  const ratioY =
    origRect.height > 0 ? (pin.y - origRect.y) / origRect.height : 0.5

  // Apply ratio to current rect (document-relative)
  const x = rect.x + window.scrollX + ratioX * rect.width
  const y = rect.y + window.scrollY + ratioY * rect.height

  return { x, y }
}
