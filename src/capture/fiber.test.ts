import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  checkFiberAtMount,
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

describe('fiber enforcement (mount-time)', () => {
  beforeEach(() => {
    resetFiberStateForTests()
    vi.unstubAllEnvs()
    document.body.innerHTML = ''
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  it('module import never throws regardless of environment', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    await expect(import('./fiber.js')).resolves.toBeDefined()
    vi.stubEnv('NODE_ENV', 'development')
    await expect(import('./fiber.js')).resolves.toBeDefined()
  })

  it('fiber present: mount check passes silently and componentName resolves', () => {
    vi.stubEnv('NODE_ENV', 'development')
    const btn = makeButton()
    attachFiber(btn)
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(() => checkFiberAtMount()).not.toThrow()
    expect(warnSpy).not.toHaveBeenCalled()
    expect(getComponentName(btn)).toBe('MyComponent')
  })

  it('fiber absent + development: mount check throws the exact message', () => {
    vi.stubEnv('NODE_ENV', 'development')
    document.body.innerHTML = '<main><p>no react here</p></main>'
    let thrown: unknown = null
    try {
      checkFiberAtMount()
    } catch (err) {
      thrown = err
    }
    expect(thrown).toBeInstanceOf(Error)
    expect((thrown as Error).message).toBe(DEV_FIBER_MESSAGE)
  })

  it('fiber absent + production: warns exactly once across repeated mounts', () => {
    vi.stubEnv('NODE_ENV', 'production')
    document.body.innerHTML = '<main><p>no react here</p></main>'
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(() => checkFiberAtMount()).not.toThrow()
    checkFiberAtMount()
    checkFiberAtMount()
    expect(warnSpy).toHaveBeenCalledTimes(1)
    expect(warnSpy).toHaveBeenCalledWith(PROD_FIBER_MESSAGE)
  })

  it('FEEDTACK_FIBER_DISABLED=true: no throw, no warn, componentName null', () => {
    vi.stubEnv('NODE_ENV', 'development')
    vi.stubEnv('FEEDTACK_FIBER_DISABLED', 'true')
    document.body.innerHTML = '<main><p>no react here</p></main>'
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(() => checkFiberAtMount()).not.toThrow()
    expect(warnSpy).not.toHaveBeenCalled()
    const btn = makeButton()
    attachFiber(btn)
    expect(getComponentName(btn)).toBeNull()
  })

  it('FEEDTACK_FIBER_OPTIONAL=true: degrades silently in both environments', () => {
    vi.stubEnv('NODE_ENV', 'development')
    vi.stubEnv('FEEDTACK_FIBER_OPTIONAL', 'true')
    document.body.innerHTML = '<main><p>no react here</p></main>'
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(() => checkFiberAtMount()).not.toThrow()
    vi.stubEnv('NODE_ENV', 'production')
    expect(() => checkFiberAtMount()).not.toThrow()
    expect(warnSpy).not.toHaveBeenCalled()
  })

  it('per-element capture never throws — fiber-less elements are legitimate', () => {
    vi.stubEnv('NODE_ENV', 'development')
    const btn = makeButton()
    expect(() => getComponentName(btn)).not.toThrow()
    expect(getComponentName(btn)).toBeNull()
  })

  it('getTargetMeta marks fiberAvailable per target when a walker is provided', () => {
    vi.stubEnv('NODE_ENV', 'development')
    const withFiber = makeButton()
    attachFiber(withFiber)
    const withoutFiber = makeButton()
    expect(getTargetMeta(withFiber, getComponentName).fiberAvailable).toBe(true)
    expect(getTargetMeta(withoutFiber, getComponentName).fiberAvailable).toBe(
      false,
    )
    expect(getTargetMeta(withoutFiber).fiberAvailable).toBeUndefined()
  })

  it('mount check scoped to a fiber-less root warns once in production', () => {
    vi.stubEnv('NODE_ENV', 'production')
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const detachedRoot = document.createElement('div')
    detachedRoot.innerHTML = '<p>static</p>'
    checkFiberAtMount(detachedRoot)
    expect(warnSpy).toHaveBeenCalledTimes(1)
  })
})
