import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type {
  ContentAdapter,
  ContentEditAdapter,
  FeedtackAdapter,
} from '../types/adapter.js'
import { useContentEdit } from './useContentEdit.js'

beforeEach(() => {
  document.body.innerHTML = ''
})

function makeAdapter(
  overrides: Partial<ContentAdapter & ContentEditAdapter> = {},
): FeedtackAdapter & ContentAdapter & ContentEditAdapter {
  return {
    submit: vi.fn(),
    reply: vi.fn(),
    resolve: vi.fn(),
    archive: vi.fn(),
    loadFeedback: vi.fn(async () => []),
    approve: vi.fn(async () => {}),
    revokeApproval: vi.fn(async () => {}),
    loadApprovals: vi.fn(async () => []),
    loadFields: vi.fn(async () => ({})),
    saveField: vi.fn(async () => {}),
    ...overrides,
  }
}

describe('useContentEdit — activate', () => {
  it('hydrates DOM from adapter on activate', async () => {
    document.body.innerHTML = `<h1 data-feedtack-field="hero.heading">Old built value</h1>`

    const adapter = makeAdapter({
      loadFields: vi.fn(async () => ({ 'hero.heading': 'Live stored value' })),
    })

    const { result } = renderHook(() => useContentEdit(adapter, 'u1'))

    await act(async () => {
      await result.current.activate()
    })

    const el = document.querySelector<HTMLElement>(
      '[data-feedtack-field="hero.heading"]',
    )
    expect(el?.innerText).toBe('Live stored value')
  })

  it('sets contenteditable on annotated fields after activate', async () => {
    document.body.innerHTML = `<h1 data-feedtack-field="hero.heading">Text</h1>`

    const adapter = makeAdapter()
    const { result } = renderHook(() => useContentEdit(adapter, 'u1'))

    await act(async () => {
      await result.current.activate()
    })

    const el = document.querySelector('[data-feedtack-field="hero.heading"]')
    expect(el?.getAttribute('contenteditable')).toBe('true')
  })

  it('sets active to true after activate', async () => {
    const adapter = makeAdapter()
    const { result } = renderHook(() => useContentEdit(adapter, 'u1'))

    expect(result.current.active).toBe(false)
    await act(async () => {
      await result.current.activate()
    })
    expect(result.current.active).toBe(true)
  })

  it('removes contenteditable on deactivate', async () => {
    document.body.innerHTML = `<h1 data-feedtack-field="hero.heading">Text</h1>`

    const adapter = makeAdapter()
    const { result } = renderHook(() => useContentEdit(adapter, 'u1'))

    await act(async () => {
      await result.current.activate()
    })
    act(() => {
      result.current.deactivate()
    })

    const el = document.querySelector('[data-feedtack-field="hero.heading"]')
    expect(el?.getAttribute('contenteditable')).toBeNull()
  })
})

describe('useContentEdit — blur-to-save', () => {
  it('calls saveField when value changes on blur', async () => {
    document.body.innerHTML = `<h1 data-feedtack-field="hero.heading">Original</h1>`

    const saveField = vi.fn(async () => {})
    const adapter = makeAdapter({ saveField })

    const { result } = renderHook(() => useContentEdit(adapter, 'u1'))
    await act(async () => {
      await result.current.activate()
    })

    const el = document.querySelector<HTMLElement>(
      '[data-feedtack-field="hero.heading"]',
    )!
    // Simulate focus then change value then blur
    el.dataset.feedtackOriginal = 'Original'
    el.innerText = 'Updated'
    await act(async () => {
      el.dispatchEvent(new Event('blur', { bubbles: true }))
    })

    await waitFor(() =>
      expect(saveField).toHaveBeenCalledWith('hero.heading', 'Updated'),
    )
  })

  it('does not call saveField when value unchanged on blur', async () => {
    document.body.innerHTML = `<h1 data-feedtack-field="hero.heading">Same</h1>`

    const saveField = vi.fn(async () => {})
    const adapter = makeAdapter({ saveField })

    const { result } = renderHook(() => useContentEdit(adapter, 'u1'))
    await act(async () => {
      await result.current.activate()
    })

    const el = document.querySelector<HTMLElement>(
      '[data-feedtack-field="hero.heading"]',
    )!
    el.dataset.feedtackOriginal = 'Same'
    el.innerText = 'Same'
    await act(async () => {
      el.dispatchEvent(new Event('blur', { bubbles: true }))
    })

    expect(saveField).not.toHaveBeenCalled()
  })

  it('tracks change in session changes after save', async () => {
    document.body.innerHTML = `<h1 data-feedtack-field="hero.heading">Original</h1>`

    const adapter = makeAdapter()
    const { result } = renderHook(() => useContentEdit(adapter, 'u1'))
    await act(async () => {
      await result.current.activate()
    })

    const el = document.querySelector<HTMLElement>(
      '[data-feedtack-field="hero.heading"]',
    )!
    el.dataset.feedtackOriginal = 'Original'
    el.innerText = 'Updated'
    await act(async () => {
      el.dispatchEvent(new Event('blur', { bubbles: true }))
    })

    await waitFor(() => expect(result.current.changes).toHaveLength(1))
    expect(result.current.changes[0].fieldPath).toBe('hero.heading')
    expect(result.current.changes[0].from).toBe('Original')
    expect(result.current.changes[0].to).toBe('Updated')
  })
})

describe('useContentEdit — revert', () => {
  it('calls saveField with original value on revert', async () => {
    document.body.innerHTML = `<h1 data-feedtack-field="hero.heading">Original</h1>`

    const saveField = vi.fn(async () => {})
    const adapter = makeAdapter({ saveField })

    const { result } = renderHook(() => useContentEdit(adapter, 'u1'))
    await act(async () => {
      await result.current.activate()
    })

    const el = document.querySelector<HTMLElement>(
      '[data-feedtack-field="hero.heading"]',
    )!
    el.dataset.feedtackOriginal = 'Original'
    el.innerText = 'Updated'
    await act(async () => {
      el.dispatchEvent(new Event('blur', { bubbles: true }))
    })
    await waitFor(() => expect(result.current.changes).toHaveLength(1))

    saveField.mockClear()
    await act(async () => {
      await result.current.revert('hero.heading')
    })

    expect(saveField).toHaveBeenCalledWith('hero.heading', 'Original')
    expect(result.current.changes).toHaveLength(0)
  })
})
