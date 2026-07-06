'use client'

/**
 * React Fiber introspection + availability enforcement.
 *
 * Fiber access is a core assumption of feedtack's element identification. Silent
 * degradation to null produces malformed payloads that still look valid, so this
 * module enforces availability:
 *   - Development: throw on the first element checked when Fiber is inaccessible.
 *   - Production: warn once, at first tack submit, when Fiber was never found.
 *   - FEEDTACK_FIBER_DISABLED=true: skip fiber entirely (no warn, no throw).
 *   - FEEDTACK_FIBER_OPTIONAL=true: degrade silently (legacy behavior).
 *
 * All environment and DOM access happens at CAPTURE time, never at import time, so
 * importing this module is always SSR-safe.
 */

/** Message thrown in development when Fiber is inaccessible on the first element. */
export const DEV_FIBER_MESSAGE =
  '[feedtack] React Fiber is not accessible on this element. Feedtack requires a React app with Fiber enabled. Set FEEDTACK_FIBER_OPTIONAL=true to suppress this error.'

/** Message warned once in production when Fiber was never detected by first submit. */
export const PROD_FIBER_MESSAGE =
  '[feedtack] React Fiber was not detected. Set FEEDTACK_FIBER_OPTIONAL=true (degraded) or FEEDTACK_FIBER_DISABLED=true (intentional) to suppress this warning.'

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
/** True once any element checked exposed a fiber key. Read by the submit-time check. */
let fiberEverFound = false
/** True once the first element has been checked — gates the dev-mode throw. */
let firstElementChecked = false
/** True once the production submit-time warning has been emitted (warn-once latch). */
let fiberWarnEmitted = false

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

function getFiberKey(element: Element): string | null {
  if (fiberKey !== undefined) return fiberKey
  const key = Object.keys(element).find((k) => k.startsWith('__reactFiber$'))
  fiberKey = key ?? null
  return fiberKey
}

function readFiber(element: Element, key: string): FiberNode | undefined {
  return (element as unknown as Record<string, FiberNode | undefined>)[key]
}

/** Handle an element with no accessible fiber — may throw in development. */
function enforceFiberMissing(): void {
  const isFirst = !firstElementChecked
  firstElementChecked = true
  // Optional mode degrades silently regardless of environment.
  if (isFiberOptional()) return
  // Development: fail loudly on the very first element checked.
  if (!isProduction() && isFirst) {
    throw new Error(DEV_FIBER_MESSAGE)
  }
  // Production: the warning is deferred to the submit-time check (warn once).
}

/**
 * Extract a React component display name for an element via fiber traversal.
 * Returns null when no named component is found, when fiber is intentionally
 * disabled, or (in non-strict cases) when fiber is unavailable.
 *
 * Throws in development the first time an element lacks accessible fiber, unless
 * FEEDTACK_FIBER_OPTIONAL or FEEDTACK_FIBER_DISABLED is set.
 */
export function getComponentName(element: Element): string | null {
  // Disabled: skip fiber entirely — no traversal, no enforcement.
  if (isFiberDisabled()) return null

  const key = getFiberKey(element)
  if (!key) {
    // Enforcement may throw (dev) and must propagate — keep it outside the
    // traversal try/catch below so it is never swallowed.
    enforceFiberMissing()
    return null
  }

  firstElementChecked = true
  fiberEverFound = true

  try {
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

/**
 * Submit-time enforcement — call when the first tack is submitted. In production,
 * emits PROD_FIBER_MESSAGE exactly once per page lifetime if fiber was never found
 * and neither FEEDTACK_FIBER_OPTIONAL nor FEEDTACK_FIBER_DISABLED is set.
 *
 * No-op in development (the capture-time throw covers that path), when suppressed,
 * or when fiber was found.
 */
export function checkFiberOnSubmit(): void {
  if (fiberWarnEmitted) return
  if (!isProduction()) return
  if (isFiberDisabled()) return
  if (isFiberOptional()) return
  if (fiberEverFound) return
  fiberWarnEmitted = true
  console.warn(PROD_FIBER_MESSAGE)
}

/** Test-only: reset all module-level fiber state (cache + latches). */
export function resetFiberStateForTests(): void {
  fiberKey = undefined
  fiberEverFound = false
  firstElementChecked = false
  fiberWarnEmitted = false
}
