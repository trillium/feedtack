import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { hashField } from '../capture/content.js'
import type { ContentAdapter, FeedtackAdapter } from '../types/adapter.js'
import { useContentApproval } from './useContentApproval.js'

// Minimal DOM setup
beforeEach(() => {
  document.body.innerHTML = ''
})

function makeAdapter(
  overrides: Partial<ContentAdapter> = {},
): FeedtackAdapter & ContentAdapter {
  return {
    submit: vi.fn(),
    reply: vi.fn(),
    resolve: vi.fn(),
    archive: vi.fn(),
    loadFeedback: vi.fn(async () => []),
    approve: vi.fn(async () => {}),
    revokeApproval: vi.fn(async () => {}),
    loadApprovals: vi.fn(async () => []),
    ...overrides,
  }
}

describe('useContentApproval — storedValues option', () => {
  it('uses storedValues for hash when provided', async () => {
    const storedContent = 'Live stored value'
    const storedHash = await hashField(storedContent)

    document.body.innerHTML = `<h1 data-feedtack-field="hero.heading">Stale built value</h1>`

    const storedValues = new Map([['hero.heading', storedContent]])
    const adapter = makeAdapter({
      loadApprovals: vi.fn(async () => [
        {
          fieldPath: 'hero.heading',
          approval: {
            hash: storedHash,
            by: ['u1'],
            at: '2026-05-08T00:00:00Z',
          },
          stale: false,
        },
      ]),
    })

    const { result } = renderHook(() =>
      useContentApproval(adapter, 'u1', { storedValues }),
    )

    await waitFor(() => expect(result.current.fields).toHaveLength(1))
    // Hash was computed from storedContent, matches approval hash → not stale
    expect(result.current.fields[0].stale).toBe(false)
  })

  it('falls back to DOM textContent when storedValues not provided', async () => {
    const domContent = 'DOM content'
    const domHash = await hashField(domContent)

    document.body.innerHTML = `<h1 data-feedtack-field="hero.heading">${domContent}</h1>`

    const adapter = makeAdapter({
      loadApprovals: vi.fn(async () => [
        {
          fieldPath: 'hero.heading',
          approval: { hash: domHash, by: ['u1'], at: '2026-05-08T00:00:00Z' },
          stale: false,
        },
      ]),
    })

    const { result } = renderHook(() => useContentApproval(adapter, 'u1'))

    await waitFor(() => expect(result.current.fields).toHaveLength(1))
    expect(result.current.fields[0].stale).toBe(false)
  })

  it('marks stale when storedValue differs from approval hash', async () => {
    const approvedContent = 'Approved content'
    const approvedHash = await hashField(approvedContent)

    document.body.innerHTML = `<h1 data-feedtack-field="hero.heading">Stale built value</h1>`

    // storedValues contains different content than was approved
    const storedValues = new Map([['hero.heading', 'Changed after approval']])
    const adapter = makeAdapter({
      loadApprovals: vi.fn(async () => [
        {
          fieldPath: 'hero.heading',
          approval: {
            hash: approvedHash,
            by: ['u1'],
            at: '2026-05-08T00:00:00Z',
          },
          stale: false,
        },
      ]),
    })

    const { result } = renderHook(() =>
      useContentApproval(adapter, 'u1', { storedValues }),
    )

    await waitFor(() => expect(result.current.fields).toHaveLength(1))
    expect(result.current.fields[0].stale).toBe(true)
  })
})
