import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ConsoleAdapter } from './ConsoleAdapter.js'
import { WebhookAdapter } from './WebhookAdapter.js'
import type { FeedtackPayload } from '../types/payload.js'
import { SCHEMA_VERSION } from '../types/payload.js'

const mockPayload: FeedtackPayload = {
  schemaVersion: SCHEMA_VERSION,
  id: 'ft_test',
  timestamp: '2026-04-09T00:00:00.000Z',
  submittedBy: { id: 'u1', name: 'Test', role: 'designer' },
  comment: 'test comment',
  sentiment: null,
  pins: [{
    index: 1, color: '#ef4444', x: 100, y: 200, xPct: 10, yPct: 20,
    target: { selector: '#btn', best_effort: false, tagName: 'BUTTON', textContent: 'Click', attributes: {}, boundingRect: { x: 100, y: 200, width: 80, height: 36 } },
  }],
  page: { url: 'https://example.com/', pathname: '/', title: 'Home' },
  viewport: { width: 1280, height: 800, scrollX: 0, scrollY: 0, devicePixelRatio: 1 },
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
    const mockItems = [{ payload: mockPayload, replies: [], resolutions: [], archives: [] }]
    const adapter = new WebhookAdapter({
      submitUrl: 'https://example.com/webhook',
      loadFeedback: async () => mockItems,
    })
    const result = await adapter.loadFeedback()
    expect(result).toBe(mockItems)
  })
})
