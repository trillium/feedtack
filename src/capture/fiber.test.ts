import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  checkFiberOnSubmit,
  DEV_FIBER_MESSAGE,
  getComponentName,
  PROD_FIBER_MESSAGE,
  resetFiberStateForTests,
} from './fiber.js'
import { getTargetMeta } from './target.js'

/** Attach a fake React fiber (named component) onto an element. */
function attachFiber(el: Element, name = 'MyComponent'): void {
  const fiber = { type: { displayName: name, name }, return: null }
  ;(el as unknown as Record<string, unknown>).__reactFiber$test = fiber
}

/** Create a bare button appended directly to body (no intermediate ancestors). */
function makeButton(): HTMLButtonElement {
  const btn = document.createElement('button')
  document.body.appendChild(btn)
  return btn
}

describe('fiber enforcement', () => {
  beforeEach(() => {
    resetFiberStateForTests()
    vi.unstubAllEnvs()
    document.body.innerHTML = ''
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  it('importing the module never throws regardless of env (capture-time only)', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    vi.resetModules()
    await expect(import('./fiber.js')).resolves.toBeDefined()
    vi.stubEnv('NODE_ENV', 'production')
    vi.resetModules()
    await expect(import('./fiber.js')).resolves.toBeDefined()
  })

  it('1: fiber present → componentName resolved, no throw/warn, fiberAvailable true', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const btn = makeButton()
    attachFiber(btn, 'CheckoutButton')

    expect(getComponentName(btn)).toBe('CheckoutButton')

    const meta = getTargetMeta(btn, getComponentName)
    expect(meta.fiberAvailable).toBe(true)

    checkFiberOnSubmit()
    expect(warnSpy).not.toHaveBeenCalled()
  })

  it('2: fiber absent + dev → throws with the exact message', () => {
    vi.stubEnv('NODE_ENV', 'development')
    const btn = makeButton()

    let thrown: unknown
    try {
      getComponentName(btn)
    } catch (err) {
      thrown = err
    }
    expect(thrown).toBeInstanceOf(Error)
    expect((thrown as Error).message).toBe(DEV_FIBER_MESSAGE)
  })

  it('3: fiber absent + prod → null componentName; submit warns exactly once across captures', () => {
    vi.stubEnv('NODE_ENV', 'production')
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const first = makeButton()
    const second = makeButton()

    // Multiple captures, none throw, all resolve to null in production.
    expect(getComponentName(first)).toBeNull()
    expect(getComponentName(second)).toBeNull()
    expect(getComponentName(first)).toBeNull()
    expect(warnSpy).not.toHaveBeenCalled()

    // Warning fires only at submit time, and only once across repeated submits.
    checkFiberOnSubmit()
    checkFiberOnSubmit()
    checkFiberOnSubmit()

    expect(warnSpy).toHaveBeenCalledTimes(1)
    expect(warnSpy).toHaveBeenCalledWith(PROD_FIBER_MESSAGE)
  })

  it('4: FEEDTACK_FIBER_DISABLED=true → no throw, no warn, componentName null', () => {
    // Force the strictest env (dev + prod submit) to prove disabled fully suppresses.
    vi.stubEnv('NODE_ENV', 'development')
    vi.stubEnv('FEEDTACK_FIBER_DISABLED', 'true')
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const btn = makeButton()

    expect(() => getComponentName(btn)).not.toThrow()
    expect(getComponentName(btn)).toBeNull()

    vi.stubEnv('NODE_ENV', 'production')
    checkFiberOnSubmit()
    expect(warnSpy).not.toHaveBeenCalled()
  })

  it('5: FEEDTACK_FIBER_OPTIONAL=true → no throw, no warn, fiberAvailable false', () => {
    vi.stubEnv('NODE_ENV', 'development')
    vi.stubEnv('FEEDTACK_FIBER_OPTIONAL', 'true')
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const btn = makeButton()

    expect(() => getComponentName(btn)).not.toThrow()
    expect(getComponentName(btn)).toBeNull()

    const meta = getTargetMeta(btn, getComponentName)
    expect(meta.fiberAvailable).toBe(false)

    vi.stubEnv('NODE_ENV', 'production')
    checkFiberOnSubmit()
    expect(warnSpy).not.toHaveBeenCalled()
  })
})
