import { describe, expect, it } from 'vitest'
import type { FeedtackPayload } from './payload.js'
import { SCHEMA_VERSION } from './payload.js'

const mockPayload: FeedtackPayload = {
  schemaVersion: SCHEMA_VERSION,
  id: 'ft_01j_test',
  timestamp: '2026-04-09T00:00:00.000Z',
  submittedBy: { id: 'u1', name: 'Test User', role: 'designer' },
  comment: 'This button is broken',
  sentiment: null,
  pins: [
    {
      index: 1,
      color: '#ef4444',
      x: 420,
      y: 812,
      xPct: 29.2,
      yPct: 90.2,
      target: {
        selector: '#submit-btn',
        best_effort: false,
        testId: null,
        elementPath: 'button',
        tagName: 'BUTTON',
        textContent: 'Place Order',
        attributes: { id: 'submit-btn', class: 'btn-primary' },
        boundingRect: { x: 420, y: 812, width: 200, height: 44 },
      },
    },
  ],
  page: {
    url: 'https://app.example.com/checkout',
    pathname: '/checkout',
    title: 'Checkout',
  },
  viewport: {
    width: 1440,
    height: 900,
    scrollX: 0,
    scrollY: 812,
    devicePixelRatio: 2,
  },
  device: {
    userAgent: 'Mozilla/5.0',
    platform: 'MacIntel',
    touchEnabled: false,
  },
}

describe('SCHEMA_VERSION', () => {
  it('is 1.0.0', () => {
    expect(SCHEMA_VERSION).toBe('1.0.0')
  })
})

describe('FeedtackPayload', () => {
  it('has schemaVersion set to SCHEMA_VERSION', () => {
    expect(mockPayload.schemaVersion).toBe(SCHEMA_VERSION)
  })

  it('includes all required top-level fields', () => {
    expect(mockPayload).toHaveProperty('id')
    expect(mockPayload).toHaveProperty('timestamp')
    expect(mockPayload).toHaveProperty('submittedBy')
    expect(mockPayload).toHaveProperty('comment')
    expect(mockPayload).toHaveProperty('sentiment')
    expect(mockPayload).toHaveProperty('pins')
    expect(mockPayload).toHaveProperty('page')
    expect(mockPayload).toHaveProperty('viewport')
    expect(mockPayload).toHaveProperty('device')
  })

  it('sentiment is null when not selected', () => {
    expect(mockPayload.sentiment).toBeNull()
  })

  it('pin has document-relative coordinates', () => {
    const pin = mockPayload.pins[0]
    expect(typeof pin.x).toBe('number')
    expect(typeof pin.y).toBe('number')
    expect(typeof pin.xPct).toBe('number')
    expect(typeof pin.yPct).toBe('number')
  })
})
