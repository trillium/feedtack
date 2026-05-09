import { beforeEach, describe, expect, it, vi } from 'vitest'
import { serializeNode } from '../capture/target.js'
import type { FeedtackPayload } from '../types/payload.js'
import { parseConfig, validateWebhookUrl } from './config.js'
import { sendPayload } from './egress.js'
import type { FeedtackInjectConfig } from './types.js'
import { ANON_USER } from './types.js'

// ── 7.1 target serializeNode (no fiber walker) ──────────────────────

describe('target serializeNode (no fiber walker)', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('returns componentName null (no fiber walker)', () => {
    document.body.innerHTML = '<button>Click</button>'
    const btn = document.querySelector('button')!
    const node = serializeNode(btn)
    expect(node.componentName).toBeNull()
  })

  it('returns data-feedtack-component when present', () => {
    document.body.innerHTML =
      '<button data-feedtack-component="NavBtn">Click</button>'
    const btn = document.querySelector('button')!
    const node = serializeNode(btn)
    expect(node.componentName).toBe('NavBtn')
  })
})

// ── 7.2 & 7.3 config parser ──────────────────────────────────────────

describe('parseConfig', () => {
  it('applies defaults for missing fields', () => {
    const config = parseConfig()
    expect(config.user).toEqual(ANON_USER)
    expect(config.webhookUrl).toBeUndefined()
    expect(config.version).toBe('1.2.0')
  })

  it('applies defaults for empty object', () => {
    const config = parseConfig({})
    expect(config.user).toEqual(ANON_USER)
    expect(config.webhookUrl).toBeUndefined()
  })

  it('uses provided user fields', () => {
    const config = parseConfig({
      user: { id: 'u1', name: 'Alice', role: 'admin' },
    })
    expect(config.user!.id).toBe('u1')
    expect(config.user!.name).toBe('Alice')
  })

  it('fills missing user fields with defaults', () => {
    const config = parseConfig({ user: { id: 'u2' } })
    expect(config.user!.name).toBe('Anonymous')
    expect(config.user!.role).toBe('reviewer')
  })
})

describe('validateWebhookUrl', () => {
  it('accepts valid https URL', () => {
    const url = validateWebhookUrl('https://example.com/hook')
    expect(url).toBe('https://example.com/hook')
  })

  it('rejects http URL', () => {
    expect(() => validateWebhookUrl('http://example.com/hook')).toThrow(
      'https:',
    )
  })

  it('rejects invalid URL', () => {
    expect(() => validateWebhookUrl('not-a-url')).toThrow()
  })

  it('normalizes URL via new URL()', () => {
    const url = validateWebhookUrl('https://example.com/hook?a=1')
    expect(url).toBe('https://example.com/hook?a=1')
  })
})

// ── 7.4 & 7.5 egress ────────────────────────────────────────────────

function makePayload(): FeedtackPayload {
  return {
    schemaVersion: '2.0.0',
    id: 'ft_test',
    timestamp: new Date().toISOString(),
    scope: 'page',
    submittedBy: ANON_USER,
    comment: 'test',
    sentiment: null,
    pins: [],
    page: { url: 'http://localhost', pathname: '/', title: 'Test' },
    viewport: {
      width: 1024,
      height: 768,
      scrollX: 0,
      scrollY: 0,
      devicePixelRatio: 1,
    },
    device: {
      userAgent: 'test',
      platform: 'test',
      touchEnabled: false,
    },
  }
}

describe('sendPayload — clipboard mode', () => {
  it('writes JSON to clipboard when no webhookUrl', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })

    const config: FeedtackInjectConfig = {
      version: '1.2.0',
      user: ANON_USER,
    }
    const mode = await sendPayload(makePayload(), config)
    expect(mode).toBe('clipboard')
    expect(writeText).toHaveBeenCalledOnce()
    const arg = writeText.mock.calls[0][0]
    expect(JSON.parse(arg).id).toBe('ft_test')
  })
})

describe('sendPayload — webhook mode', () => {
  it('calls sendBeacon with Blob of type application/json', async () => {
    const sendBeacon = vi.fn().mockReturnValue(true)
    Object.assign(navigator, { sendBeacon })

    const config: FeedtackInjectConfig = {
      version: '1.2.0',
      user: ANON_USER,
      webhookUrl: 'https://example.com/hook',
    }
    const mode = await sendPayload(makePayload(), config)
    expect(mode).toBe('webhook')
    expect(sendBeacon).toHaveBeenCalledOnce()
    const [url, blob] = sendBeacon.mock.calls[0]
    expect(url).toBe('https://example.com/hook')
    expect(blob).toBeInstanceOf(Blob)
    expect(blob.type).toBe('application/json')
  })

  it('throws when sendBeacon returns false', async () => {
    const sendBeacon = vi.fn().mockReturnValue(false)
    Object.assign(navigator, { sendBeacon })

    const config: FeedtackInjectConfig = {
      version: '1.2.0',
      user: ANON_USER,
      webhookUrl: 'https://example.com/hook',
    }
    await expect(sendPayload(makePayload(), config)).rejects.toThrow(
      'sendBeacon failed',
    )
  })
})

// ── 7.6 idempotency guard ────────────────────────────────────────────

describe('idempotency guard', () => {
  it('sets __feedtack_injected on window after injection', async () => {
    // Reset injection state
    delete window.__feedtack_injected
    document.getElementById('feedtack-inject')?.remove()

    await import('./main.js')
    expect(window.__feedtack_injected).toBe(true)
  })
})
