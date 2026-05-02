import type { FeedbackItem } from '../types/payload.js'
import type { FeedtackFlushEvent } from './types.js'

const IDLE_EVENTS = ['mousemove', 'keydown', 'scroll', 'touchstart'] as const

export interface FlushController {
  flushPath: (path: string) => void
  clearFlushed: (path: string) => void
  detach: () => void
}

/** Set up flush listeners: beforeunload + idle timer */
export function attachFlush(
  getItems: () => FeedbackItem[],
  getPathname: () => string,
  onFlush: (event: FeedtackFlushEvent) => void,
  idleMs: number,
): FlushController {
  const flushedPaths = new Set<string>()
  let idleTimer: ReturnType<typeof setTimeout> | null = null

  function flushPath(path: string): void {
    if (flushedPaths.has(path)) return
    const pageItems = getItems().filter((i) => i.payload.page.pathname === path)
    if (pageItems.length === 0) return
    flushedPaths.add(path)
    onFlush({ pathname: path, items: pageItems })
  }

  function clearFlushed(path: string): void {
    flushedPaths.delete(path)
  }

  const onBeforeUnload = () => flushPath(getPathname())
  window.addEventListener('beforeunload', onBeforeUnload)

  let idleReset: (() => void) | null = null
  if (idleMs > 0) {
    idleReset = () => {
      if (idleTimer) clearTimeout(idleTimer)
      idleTimer = setTimeout(() => flushPath(getPathname()), idleMs)
    }
    for (const e of IDLE_EVENTS) {
      window.addEventListener(e, idleReset, { passive: true })
    }
    idleReset()
  }

  return {
    flushPath,
    clearFlushed,
    detach() {
      window.removeEventListener('beforeunload', onBeforeUnload)
      if (idleTimer) clearTimeout(idleTimer)
      if (idleReset) {
        for (const e of IDLE_EVENTS) {
          window.removeEventListener(e, idleReset)
        }
      }
    },
  }
}
