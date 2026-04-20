'use client'

import { useCallback, useEffect, useRef } from 'react'
import type { FeedbackItem } from '../types/payload.js'

export interface FeedtackFlushEvent {
  pathname: string
  items: FeedbackItem[]
}

export interface UseFeedtackFlushOpts {
  pathname: string
  feedbackItems: FeedbackItem[]
  onFlush?: (event: FeedtackFlushEvent) => void
  flushIdleMs?: number
  disabled?: boolean
}

const DEFAULT_IDLE_MS = 5 * 60 * 1000

export function useFeedtackFlush({
  pathname,
  feedbackItems,
  onFlush,
  flushIdleMs = DEFAULT_IDLE_MS,
  disabled,
}: UseFeedtackFlushOpts) {
  const flushedRef = useRef<Set<string>>(new Set())
  const prevPathnameRef = useRef(pathname)
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const flush = useCallback(
    (path: string, items: FeedbackItem[]) => {
      if (!onFlush || flushedRef.current.has(path)) return
      const pageItems = items.filter((i) => i.payload.page.pathname === path)
      if (pageItems.length === 0) return
      flushedRef.current.add(path)
      onFlush({ pathname: path, items: pageItems })
    },
    [onFlush],
  )

  // Flush on pathname change (leaving the page)
  useEffect(() => {
    if (disabled || !onFlush) return
    const prev = prevPathnameRef.current
    prevPathnameRef.current = pathname
    if (prev !== pathname) {
      flush(prev, feedbackItems)
    }
  }, [pathname, feedbackItems, flush, onFlush, disabled])

  // Flush on idle timeout
  useEffect(() => {
    if (disabled || !onFlush || flushIdleMs <= 0) return
    const resetTimer = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
      idleTimerRef.current = setTimeout(() => {
        flush(pathname, feedbackItems)
      }, flushIdleMs)
    }
    const events = ['mousemove', 'keydown', 'scroll', 'touchstart'] as const
    for (const e of events)
      window.addEventListener(e, resetTimer, { passive: true })
    resetTimer()
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
      for (const e of events) window.removeEventListener(e, resetTimer)
    }
  }, [pathname, feedbackItems, flush, onFlush, flushIdleMs, disabled])

  // Flush on page unload
  useEffect(() => {
    if (disabled || !onFlush) return
    const handleUnload = () => flush(pathname, feedbackItems)
    window.addEventListener('beforeunload', handleUnload)
    return () => window.removeEventListener('beforeunload', handleUnload)
  }, [pathname, feedbackItems, flush, onFlush, disabled])

  // Allow re-flush of a path (for re-scope after new replies)
  const clearFlushed = useCallback((path: string) => {
    flushedRef.current.delete(path)
  }, [])

  return { clearFlushed }
}
