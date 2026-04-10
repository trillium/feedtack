import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { FeedtackPayload } from '../types/payload.js'
import { SCHEMA_VERSION } from '../types/payload.js'
import { ConsoleAdapter } from './ConsoleAdapter.js'
import { LocalStorageAdapter } from './LocalStorageAdapter.js'
import { WebhookAdapter } from './WebhookAdapter.js'

const mockPayload: FeedtackPayload = {
  schemaVersion: SCHEMA_VERSION,
  id: 'ft_test',
  timestamp: '2026-04-09T00:00:00.000Z',
  submittedBy: { id: 'u1', name: 'Test', role: 'designer' },
  comment: 'test comment',
  sentiment: null,
  pins: [
    {
      index: 1,
      color: '#ef4444',
      x: 100,
      y: 200,
      xPct: 10,
      yPct: 20,
      target: {
        selector: '#btn',
        best_effort: false,
        testId: null,
        elementPath: 'button',
        tagName: 'BUTTON',
        textContent: 'Click',
        attributes: {},
        boundingRect: { x: 100, y: 200, width: 80, height: 36 },
      },
    },
  ],
  page: { url: 'https://example.com/', pathname: '/', title: 'Home' },
  viewport: {
    width: 1280,
    height: 800,
    scrollX: 0,
    scrollY: 0,
    devicePixelRatio: 1,
  },
  device: { userAgent: 'test', platform: 'test', touchEnabled: false },
}

describe('ConsoleAdapter', () => {
  it('submit logs payload', async () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const adapter = new ConsoleAdapter()
    await adapter.submit(mockPayload)
    expect(spy).toHaveBeenCalledWith('[feedtack] submit', mockPayload)
    spy.mockRestore()
  })

  it('loadFeedback returns empty array', async () => {
    const adapter = new ConsoleAdapter()
    const result = await adapter.loadFeedback()
    expect(result).toEqual([])
  })
})

describe('LocalStorageAdapter', () => {
  afterEach(() => {
    localStorage.clear()
  })

  it('submit persists and loadFeedback retrieves', async () => {
    const adapter = new LocalStorageAdapter()
    await adapter.submit(mockPayload)
    const items = await adapter.loadFeedback()
    expect(items).toHaveLength(1)
    expect(items[0].payload.id).toBe('ft_test')
  })

  it('loadFeedback filters by pathname', async () => {
    const adapter = new LocalStorageAdapter()
    await adapter.submit(mockPayload)
    const matched = await adapter.loadFeedback({ pathname: '/' })
    const missed = await adapter.loadFeedback({ pathname: '/other' })
    expect(matched).toHaveLength(1)
    expect(missed).toHaveLength(0)
  })

  it('reply appends to existing item', async () => {
    const adapter = new LocalStorageAdapter()
    await adapter.submit(mockPayload)
    await adapter.reply('ft_test', {
      author: mockPayload.submittedBy,
      body: 'noted',
      timestamp: new Date().toISOString(),
    })
    const items = await adapter.loadFeedback()
    expect(items[0].replies).toHaveLength(1)
    expect(items[0].replies[0].body).toBe('noted')
  })

  it('resolve appends resolution', async () => {
    const adapter = new LocalStorageAdapter()
    await adapter.submit(mockPayload)
    await adapter.resolve('ft_test', {
      resolvedBy: mockPayload.submittedBy,
      timestamp: new Date().toISOString(),
    })
    const items = await adapter.loadFeedback()
    expect(items[0].resolutions).toHaveLength(1)
  })

  it('archive appends archive record', async () => {
    const adapter = new LocalStorageAdapter()
    await adapter.submit(mockPayload)
    await adapter.archive('ft_test', 'u1')
    const items = await adapter.loadFeedback()
    expect(items[0].archives).toHaveLength(1)
    expect(items[0].archives[0].archivedBy.id).toBe('u1')
  })

  it('uses custom key', async () => {
    const adapter = new LocalStorageAdapter({ key: 'my-feedback' })
    await adapter.submit(mockPayload)
    expect(localStorage.getItem('my-feedback')).toBeTruthy()
    expect(localStorage.getItem('feedtack')).toBeNull()
  })

  it('survives corrupted localStorage gracefully', async () => {
    localStorage.setItem('feedtack', '{broken json')
    const adapter = new LocalStorageAdapter()
    const items = await adapter.loadFeedback()
    expect(items).toEqual([])
  })
})

describe('WebhookAdapter', () => {
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    fetchMock = vi.fn()
    global.fetch = fetchMock
  })

  it('submit POSTs payload with correct headers', async () => {
    fetchMock.mockResolvedValue({ ok: true })
    const adapter = new WebhookAdapter({
      submitUrl: 'https://example.com/webhook',
      loadFeedback: async () => [],
    })
    await adapter.submit(mockPayload)
    expect(fetchMock).toHaveBeenCalledWith('https://example.com/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockPayload),
    })
  })

  it('throws on non-2xx response', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 500 })
    const adapter = new WebhookAdapter({
      submitUrl: 'https://example.com/webhook',
      loadFeedback: async () => [],
    })
    await expect(adapter.submit(mockPayload)).rejects.toThrow('500')
  })

  it('throws on network failure', async () => {
    fetchMock.mockRejectedValue(new Error('DNS failure'))
    const adapter = new WebhookAdapter({
      submitUrl: 'https://example.com/webhook',
      loadFeedback: async () => [],
    })
    await expect(adapter.submit(mockPayload)).rejects.toThrow('DNS failure')
  })

  it('loadFeedback delegates to config function', async () => {
    const mockItems = [
      { payload: mockPayload, replies: [], resolutions: [], archives: [] },
    ]
    const adapter = new WebhookAdapter({
      submitUrl: 'https://example.com/webhook',
      loadFeedback: async () => mockItems,
    })
    const result = await adapter.loadFeedback()
    expect(result).toBe(mockItems)
  })
})
