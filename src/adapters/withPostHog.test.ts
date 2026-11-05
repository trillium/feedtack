import { describe, expect, it, vi } from 'vitest'
import type { FeedtackAdapter } from '../types/adapter.js'
import type { FeedtackPayload } from '../types/payload.js'
import { SCHEMA_VERSION } from '../types/payload.js'
import {
  buildPostHogPayload,
  generateUUID,
  withPostHog,
} from './withPostHog.js'

function createSamplePayload(
  overrides?: Partial<FeedtackPayload>,
): FeedtackPayload {
  return {
    schemaVersion: SCHEMA_VERSION,
    id: 'ft_test_12345',
    timestamp: '2026-11-05T12:00:00.000Z',
    scope: 'element',
    submittedBy: {
      id: 'usr_abc',
      name: 'Alice',
      email: 'alice@example.com',
      role: 'admin',
    },
    comment: 'Sensitive user feedback comment text',
    sentiment: 'good',
    pins: [
      {
        index: 1,
        color: '#ff0000',
        x: 150,
        y: 250,
        xPct: 15,
        yPct: 25,
        target: {
          selector: '#submit-btn',
          best_effort: false,
          dataTestId: 'submit-action-btn',
          elementPath: 'div.container > button#submit-btn',
          tagName: 'BUTTON',
          ancestors: [
            {
              tag: 'div',
              id: 'container',
              ariaLabel: 'main container',
              role: 'region',
              type: null,
              name: null,
              title: null,
              alt: null,
              dataTestId: 'main-container',
              dataFeedtackComponent: null,
              nthChild: 1,
              nthOfType: 1,
              componentName: 'FormContainer',
              classes: ['container'],
              textContent: 'Sensitive ancestor text content inside container',
              placeholder: null,
            },
          ],
          boundingRect: { x: 150, y: 250, width: 100, height: 40 },
        },
      },
    ],
    page: {
      url: 'https://example.com/pricing?ref=promo',
      pathname: '/pricing',
      title: 'Pricing Page',
    },
    viewport: {
      width: 1440,
      height: 900,
      scrollX: 0,
      scrollY: 100,
      devicePixelRatio: 2,
      breakpoint: 'desktop',
    },
    device: {
      userAgent: 'Mozilla/5.0 Chrome/130',
      platform: 'MacIntel',
      touchEnabled: false,
    },
    ...overrides,
  }
}

function createMockAdapter(): FeedtackAdapter & {
  submitSpy: ReturnType<typeof vi.fn>
  replySpy: ReturnType<typeof vi.fn>
} {
  const submitSpy = vi.fn().mockResolvedValue(undefined)
  const replySpy = vi.fn().mockResolvedValue(undefined)
  return {
    submit: submitSpy,
    reply: replySpy,
    resolve: vi.fn().mockResolvedValue(undefined),
    archive: vi.fn().mockResolvedValue(undefined),
    loadFeedback: vi.fn().mockResolvedValue([]),
    submitSpy,
    replySpy,
  }
}

describe('withPostHog', () => {
  describe('allowlisted payload shape', () => {
    it('produces exact allowlisted properties on buildPostHogPayload', () => {
      const payload = createSamplePayload()
      const { body, properties, isAnonymous } = buildPostHogPayload(
        payload,
        'phc_test_key_123',
      )

      expect(isAnonymous).toBe(false)
      expect(body.event).toBe('feedtack submitted')
      expect(body.api_key).toBe('phc_test_key_123')
      expect(body.uuid).toBe('ft_test_12345')
      expect(body.distinct_id).toBe('usr_abc')
      expect(body.timestamp).toBe(payload.timestamp)

      // Expected allowlisted properties
      expect(properties.feedtack_id).toBe('ft_test_12345')
      expect(properties.scope).toBe('element')
      expect(properties.sentiment).toBe('good')
      expect(properties.pathname).toBe('/pricing')
      expect(properties.schema_version).toBe(SCHEMA_VERSION)
      expect(properties.breakpoint).toBe('desktop')
      expect(properties.distinct_id).toBe('usr_abc')

      // Pins array shape
      expect(properties.pins).toHaveLength(1)
      expect(properties.pins[0]).toEqual({
        selector: '#submit-btn',
        component_name: 'FormContainer',
        data_testid: 'submit-action-btn',
        element_path: 'div.container > button#submit-btn',
      })
    })

    it('handles pins with missing or null attributes gracefully', () => {
      const payload = createSamplePayload({
        pins: [
          {
            index: 1,
            color: '#000',
            x: 0,
            y: 0,
            xPct: 0,
            yPct: 0,
            target: {
              selector: '',
              best_effort: false,
              dataTestId: null,
              elementPath: null,
              tagName: 'DIV',
              ancestors: [],
              boundingRect: { x: 0, y: 0, width: 0, height: 0 },
            },
          },
        ],
      })

      const { properties } = buildPostHogPayload(payload)
      expect(properties.pins[0]).toEqual({
        selector: '',
        component_name: null,
        data_testid: null,
        element_path: null,
      })
    })
  })

  describe('excluded fields absent', () => {
    it('leaves out comment text, ancestor textContent, email, screenshots, coordinates, and device meta', () => {
      const payload = {
        ...createSamplePayload({
          submittedBy: {
            id: 'u1',
            name: 'Bob',
            email: 'secret-bob@company.com',
            role: 'user',
          },
          comment: 'Super secret private feedback note',
        }),
        screenshot: 'data:image/png;base64,xxxx',
        screenshots: ['https://cdn.example.com/shot.png'],
      } as unknown as FeedtackPayload

      const { body, properties } = buildPostHogPayload(payload)

      // Top-level properties object should strictly not contain sensitive info
      const props = properties as Record<string, unknown>
      expect(props.comment).toBeUndefined()
      expect(props.email).toBeUndefined()
      expect(props.textContent).toBeUndefined()
      expect(props.screenshot).toBeUndefined()
      expect(props.screenshots).toBeUndefined()
      expect(props.device).toBeUndefined()
      expect(props.userAgent).toBeUndefined()
      expect(props.platform).toBeUndefined()
      expect(props.url).toBeUndefined()
      expect(props.title).toBeUndefined()
      expect(props.width).toBeUndefined()
      expect(props.height).toBeUndefined()

      // Pin should strictly contain only allowlisted fields
      const pin = properties.pins[0] as unknown as Record<string, unknown>
      expect(pin.comment).toBeUndefined()
      expect(pin.textContent).toBeUndefined()
      expect(pin.ancestors).toBeUndefined()
      expect(pin.boundingRect).toBeUndefined()
      expect(pin.x).toBeUndefined()
      expect(pin.y).toBeUndefined()
      expect(pin.xPct).toBeUndefined()
      expect(pin.yPct).toBeUndefined()
      expect(pin.color).toBeUndefined()
      expect(pin.index).toBeUndefined()

      // Full serialized JSON check
      const serialized = JSON.stringify(body)
      expect(serialized).not.toContain('Sensitive user feedback comment text')
      expect(serialized).not.toContain('secret-bob@company.com')
      expect(serialized).not.toContain(
        'Sensitive ancestor text content inside container',
      )
      expect(serialized).not.toContain('data:image/png')
    })
  })

  describe('uuid and distinct_id rules', () => {
    it('uses submittedBy.id as distinct_id when present and omits $process_person_profile', () => {
      const payload = createSamplePayload({
        submittedBy: { id: 'user_456', name: 'Test', role: 'admin' },
      })
      const { body, properties, isAnonymous } = buildPostHogPayload(payload)

      expect(isAnonymous).toBe(false)
      expect(body.distinct_id).toBe('user_456')
      expect(properties.distinct_id).toBe('user_456')
      expect(properties.$process_person_profile).toBeUndefined()
      expect(body.uuid).toBe(payload.id)
    })

    it('generates a random uuid and sets $process_person_profile: false when anonymous', () => {
      const payload = createSamplePayload({
        submittedBy: { id: '', name: 'Anonymous', role: 'guest' },
      })
      const { body, properties, isAnonymous } = buildPostHogPayload(payload)

      expect(isAnonymous).toBe(true)
      expect(properties.$process_person_profile).toBe(false)
      expect(body.distinct_id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      )
      expect(properties.distinct_id).toBe(body.distinct_id)
      expect(body.uuid).toBe(payload.id)
    })

    it('generates valid UUID v4 using generateUUID', () => {
      const uuid = generateUUID()
      expect(uuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      )
    })
  })

  describe('error resilience and submit delegation', () => {
    const okFetch = () =>
      vi.fn().mockResolvedValue({ ok: true, status: 200 } as Response)

    it('posts to the capture endpoint with the allowlisted body after submit', async () => {
      const adapter = createMockAdapter()
      const mockFetch = okFetch()
      const wrapped = withPostHog(adapter, {
        apiKey: 'phc_custom',
        host: 'https://eu.i.posthog.com/',
        fetch: mockFetch,
      })
      const payload = createSamplePayload()

      await wrapped.submit(payload)

      expect(adapter.submitSpy).toHaveBeenCalledWith(payload)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://eu.i.posthog.com/capture/',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: expect.any(AbortSignal),
        }),
      )
      const body = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(body.api_key).toBe('phc_custom')
      expect(body.event).toBe('feedtack submitted')
      expect(body.uuid).toBe(payload.id)
    })

    it('does not fail wrapped submit when fetch suffers a network failure', async () => {
      const adapter = createMockAdapter()
      const mockFetch = vi
        .fn()
        .mockRejectedValue(new TypeError('Failed to fetch'))
      const wrapped = withPostHog(adapter, {
        apiKey: 'phc_test',
        fetch: mockFetch,
      })
      const payload = createSamplePayload()

      await expect(wrapped.submit(payload)).resolves.toBeUndefined()
      expect(mockFetch).toHaveBeenCalled()
      expect(adapter.submitSpy).toHaveBeenCalledWith(payload)
    })

    it('does not fail wrapped submit when PostHog returns a 500', async () => {
      const adapter = createMockAdapter()
      const mockFetch = vi
        .fn()
        .mockResolvedValue({ ok: false, status: 500 } as Response)
      const wrapped = withPostHog(adapter, {
        apiKey: 'phc_test',
        fetch: mockFetch,
      })

      await expect(
        wrapped.submit(createSamplePayload()),
      ).resolves.toBeUndefined()
      expect(mockFetch).toHaveBeenCalled()
    })

    it('does not block submit when the PostHog request hangs, and aborts it on timeout', async () => {
      vi.useFakeTimers()
      try {
        const adapter = createMockAdapter()
        let signal: AbortSignal | undefined
        const hangingFetch = vi.fn((_url: string, init: RequestInit) => {
          signal = init.signal as AbortSignal
          return new Promise<Response>(() => {})
        })
        const wrapped = withPostHog(adapter, {
          apiKey: 'phc_test',
          fetch: hangingFetch as unknown as typeof fetch,
        })

        await expect(
          wrapped.submit(createSamplePayload()),
        ).resolves.toBeUndefined()
        expect(signal?.aborted).toBe(false)
        vi.advanceTimersByTime(5000)
        expect(signal?.aborted).toBe(true)
      } finally {
        vi.useRealTimers()
      }
    })

    it('does not send to PostHog when the underlying submit fails', async () => {
      const adapter = createMockAdapter()
      adapter.submitSpy.mockRejectedValue(
        new Error('Underlying database failed'),
      )
      const mockFetch = okFetch()
      const wrapped = withPostHog(adapter, {
        apiKey: 'phc_test',
        fetch: mockFetch,
      })

      await expect(wrapped.submit(createSamplePayload())).rejects.toThrow(
        'Underlying database failed',
      )
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('forwards other adapter methods and preserves adapter this context', async () => {
      const adapter = createMockAdapter()
      const wrapped = withPostHog(adapter, { apiKey: 'phc_key' })

      await wrapped.reply('ft_1', {
        body: 'Reply text',
        author: { id: 'u1', name: 'User', role: 'admin' },
        timestamp: '2026-11-05T00:00:00.000Z',
      })

      expect(adapter.replySpy).toHaveBeenCalledWith('ft_1', {
        body: 'Reply text',
        author: { id: 'u1', name: 'User', role: 'admin' },
        timestamp: '2026-11-05T00:00:00.000Z',
      })
    })
  })
})
