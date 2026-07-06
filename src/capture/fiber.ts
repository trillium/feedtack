'use client'

/**
 * React Fiber introspection + availability enforcement.
 *
 * Fiber access is a core assumption of feedtack's element identification. Silent
 * degradation to null produces malformed payloads that still look valid, so this
 * module enforces availability — at MOUNT time, the earliest moment the check is
 * honest. Feedtack is a library: bundlers include its code as text but never
 * execute it at build, and SSR prerender runs with no DOM, so fiber presence (a
 * property of live DOM elements) is only observable once the app is mounted in a
 * browser. In development that moment is "dev server launched, page opened" —
 * which is when the developer should hear about it, not when the first tack is
 * captured.
 *
 *   - Development: checkFiberAtMount() throws when no fiber is found in the DOM.
 *   - Production: checkFiberAtMount() emits console.warn once per page lifetime.
 *   - FEEDTACK_FIBER_DISABLED=true: skip fiber entirely (no warn, no throw).
 *   - FEEDTACK_FIBER_OPTIONAL=true: degrade silently (legacy behavior).
 *
 * Per-element capture (getComponentName) NEVER throws: a fiber-less element
 * inside a React app (static HTML, third-party widget) is legitimate and simply
 * yields componentName: null with fiberAvailable: false on the payload target.
 *
 * All environment and DOM access happens inside function calls, never at import
 * time, so importing this module is always SSR-safe.
 */

/** Message thrown in development when no Fiber is found in the mounted DOM. */
export const DEV_FIBER_MESSAGE =
  '[feedtack] React Fiber is not accessible in this app. Feedtack requires a React app with Fiber enabled. Set FEEDTACK_FIBER_OPTIONAL=true to suppress this error.'

/** Message warned once in production when no Fiber is found in the mounted DOM. */
export const PROD_FIBER_MESSAGE =
  '[feedtack] React Fiber was not detected. Set FEEDTACK_FIBER_OPTIONAL=true (degraded) or FEEDTACK_FIBER_DISABLED=true (intentional) to suppress this warning.'

/** Upper bound on elements inspected by the mount-time scan. React apps expose
 *  fiber keys on their first rendered elements, so a hit comes early; the cap
 *  bounds the cost on huge non-React documents. */
const MOUNT_SCAN_LIMIT = 300

/** Minimal shape of a React Fiber node's `type` — a host string, or a component. */
interface FiberComponentType {
  displayName?: string
  name?: string
}

/** Minimal shape of a React Fiber node walked during component-name resolution. */
interface FiberNode {
  type: string | FiberComponentType | null | undefined
  return: FiberNode | null
}

/** Cached React fiber key (e.g. "__reactFiber$abc123") — discovered once at runtime. */
let fiberKey: string | null | undefined
/** True once the mount-time warning/throw has fired (once-per-page latch). */
let mountCheckDone = false

/** Guarded env read — safe in the IIFE bundle and browsers without a defined process. */
function readEnv(name: string): string | undefined {
  if (typeof process === 'undefined') return undefined
  try {
    return process.env?.[name]
  } catch {
    return undefined
  }
}

function isProduction(): boolean {
  return readEnv('NODE_ENV') === 'production'
}

function isFiberDisabled(): boolean {
  return readEnv('FEEDTACK_FIBER_DISABLED') === 'true'
}

function isFiberOptional(): boolean {
  return readEnv('FEEDTACK_FIBER_OPTIONAL') === 'true'
}

function elementFiberKey(element: Element): string | undefined {
  return Object.keys(element).find((k) => k.startsWith('__reactFiber$'))
}

function getFiberKey(element: Element): string | null {
  if (fiberKey !== undefined) return fiberKey
  const key = elementFiberKey(element)
  fiberKey = key ?? null
  return fiberKey
}

function readFiber(element: Element, key: string): FiberNode | undefined {
  return (element as unknown as Record<string, FiberNode | undefined>)[key]
}

/**
 * Mount-time availability enforcement — call once when the React provider
 * mounts (dev server launch / page open is the right moment to inform the
 * developer; build time is impossible since library code is bundled as text,
 * not executed). Scans the mounted DOM for any element carrying a fiber key.
 *
 * When none is found and neither escape hatch is set: throws DEV_FIBER_MESSAGE
 * in development, console.warns PROD_FIBER_MESSAGE once per page lifetime in
 * production. No-op on repeat calls, in DISABLED/OPTIONAL modes, and outside
 * the browser (SSR-safe).
 */
export function checkFiberAtMount(root?: ParentNode): void {
  if (mountCheckDone) return
  if (typeof document === 'undefined') return
  if (isFiberDisabled()) return
  if (isFiberOptional()) return
  mountCheckDone = true

  const scope = root ?? document
  const elements = scope.querySelectorAll('*')
  const limit = Math.min(elements.length, MOUNT_SCAN_LIMIT)
  for (let i = 0; i < limit; i++) {
    const key = elementFiberKey(elements[i])
    if (key) {
      fiberKey = fiberKey ?? key
      return
    }
  }

  if (isProduction()) {
    console.warn(PROD_FIBER_MESSAGE)
  } else {
    throw new Error(DEV_FIBER_MESSAGE)
  }
}

/**
 * Extract a React component display name for an element via fiber traversal.
 * Returns null when fiber is unavailable on this element, intentionally
 * disabled, or no named component is found. Never throws — app-level fiber
 * absence is reported by checkFiberAtMount(), not per element.
 */
export function getComponentName(element: Element): string | null {
  if (isFiberDisabled()) return null

  try {
    const key = getFiberKey(element)
    if (!key) return null

    let fiber = readFiber(element, key)
    while (fiber) {
      const type = fiber.type
      if (type && typeof type !== 'string') {
        const name = type.displayName ?? type.name
        if (name && name !== 'Anonymous') return name
      }
      fiber = fiber.return
    }
    return null
  } catch {
    return null
  }
}

/** Test-only: reset all module-level fiber state (cache + latches). */
export function resetFiberStateForTests(): void {
  fiberKey = undefined
  mountCheckDone = false
}
