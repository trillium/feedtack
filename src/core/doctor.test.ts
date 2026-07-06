import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { resetFiberStateForTests } from '../capture/fiber.js'
import type { FeedtackAdapter } from '../types/adapter.js'
import type { FeedtackUser } from '../types/payload.js'
import { runFeedtackDoctor } from './doctor.js'

const user: FeedtackUser = { id: 'u1', name: 'Ada', role: 'admin' }

function makeAdapter(overrides: Record<string, unknown> = {}): FeedtackAdapter {
  return {
    submit: vi.fn(),
    loadFeedback: vi.fn(),
    reply: vi.fn(),
    resolve: vi.fn(),
    archive: vi.fn(),
    ...overrides,
  } as unknown as FeedtackAdapter
}

function statusOf(report: ReturnType<typeof runFeedtackDoctor>, id: string) {
  return report.checks.find((c) => c.id === id)?.status
}

function withFiber(): void {
  const el = document.createElement('div')
  ;(el as unknown as Record<string, unknown>).__reactFiber$test = {
    type: null,
    return: null,
  }
  document.body.appendChild(el)
}

describe('runFeedtackDoctor', () => {
  beforeEach(() => {
    resetFiberStateForTests()
    vi.unstubAllEnvs()
    document.body.innerHTML = ''
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  it('healthy setup: ok with fiber, adapter, user, unique fields all passing', () => {
    document.body.innerHTML =
      '<h1 data-feedtack-field="home.hero.heading">Hi</h1>' +
      '<div id="feedtack-root"></div>'
    withFiber()
    const report = runFeedtackDoctor({
      adapter: makeAdapter(),
      currentUser: user,
      print: false,
    })
    expect(report.ok).toBe(true)
    expect(statusOf(report, 'react-fiber')).toBe('pass')
    expect(statusOf(report, 'adapter')).toBe('pass')
    expect(statusOf(report, 'current-user')).toBe('pass')
    expect(statusOf(report, 'content-fields')).toBe('pass')
    expect(statusOf(report, 'provider')).toBe('pass')
  })

  it('no fiber in DOM fails the fiber check and flips ok', () => {
    document.body.innerHTML = '<main><p>static</p></main>'
    const report = runFeedtackDoctor({
      adapter: makeAdapter(),
      currentUser: user,
      print: false,
    })
    expect(statusOf(report, 'react-fiber')).toBe('fail')
    expect(report.ok).toBe(false)
  })

  it('FEEDTACK_FIBER_DISABLED reports info instead of fail', () => {
    vi.stubEnv('FEEDTACK_FIBER_DISABLED', 'true')
    const report = runFeedtackDoctor({ print: false })
    expect(statusOf(report, 'react-fiber')).toBe('info')
  })

  it('adapter missing core methods fails', () => {
    withFiber()
    const broken = makeAdapter({ submit: undefined })
    const report = runFeedtackDoctor({
      adapter: broken,
      currentUser: user,
      print: false,
    })
    expect(statusOf(report, 'adapter')).toBe('fail')
    expect(report.ok).toBe(false)
  })

  it('user with empty role fails attribution check', () => {
    withFiber()
    const report = runFeedtackDoctor({
      adapter: makeAdapter(),
      currentUser: { ...user, role: '' },
      print: false,
    })
    expect(statusOf(report, 'current-user')).toBe('fail')
  })

  it('duplicate field paths warn without flipping ok', () => {
    document.body.innerHTML =
      '<p data-feedtack-field="a.b">one</p><p data-feedtack-field="a.b">two</p>'
    withFiber()
    const report = runFeedtackDoctor({
      adapter: makeAdapter(),
      currentUser: user,
      print: false,
    })
    expect(statusOf(report, 'content-fields')).toBe('warn')
    expect(report.ok).toBe(true)
  })

  it('omitted adapter and user degrade to warnings, not failures', () => {
    withFiber()
    const report = runFeedtackDoctor({ print: false })
    expect(statusOf(report, 'adapter')).toBe('warn')
    expect(statusOf(report, 'current-user')).toBe('warn')
    expect(report.ok).toBe(true)
  })

  it('print mode groups a console report', () => {
    withFiber()
    const group = vi.spyOn(console, 'group').mockImplementation(() => {})
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const groupEnd = vi.spyOn(console, 'groupEnd').mockImplementation(() => {})
    runFeedtackDoctor({ adapter: makeAdapter(), currentUser: user })
    expect(group).toHaveBeenCalledOnce()
    expect(groupEnd).toHaveBeenCalledOnce()
  })
})
