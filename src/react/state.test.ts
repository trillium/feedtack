import { describe, expect, it } from 'vitest'
import type { FeedbackItem, FeedtackPayload } from '../types/payload.js'
import { SCHEMA_VERSION } from '../types/payload.js'

const user1 = { id: 'u1', name: 'Alice', role: 'designer' }
const user2 = { id: 'u2', name: 'Bob', role: 'stakeholder' }

const basePayload: FeedtackPayload = {
  schemaVersion: SCHEMA_VERSION,
  id: 'ft_001',
  timestamp: '2026-04-09T00:00:00.000Z',
  scope: 'element',
  submittedBy: user1,
  comment: 'test',
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
        dataTestId: null,
        elementPath: 'button',
        tagName: 'BUTTON',
        ancestors: [],
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

// Simulates the reducer logic in the provider
function applyResolution(
  item: FeedbackItem,
  resolvedBy: typeof user1,
): FeedbackItem {
  return {
    ...item,
    resolutions: [
      ...item.resolutions,
      {
        feedbackId: item.payload.id,
        resolvedBy,
        timestamp: new Date().toISOString(),
      },
    ],
  }
}

function applyArchive(
  item: FeedbackItem,
  archivedBy: typeof user1,
): FeedbackItem {
  return {
    ...item,
    archives: [
      ...item.archives,
      {
        feedbackId: item.payload.id,
        archivedBy,
        timestamp: new Date().toISOString(),
      },
    ],
  }
}

function isArchivedForUser(item: FeedbackItem, userId: string): boolean {
  return item.archives.some((a) => a.archivedBy.id === userId)
}

describe('multi-user resolve', () => {
  it('appends multiple resolutions without overwriting', () => {
    let item: FeedbackItem = {
      payload: basePayload,
      replies: [],
      resolutions: [],
      archives: [],
    }
    item = applyResolution(item, user1)
    item = applyResolution(item, user2)
    expect(item.resolutions).toHaveLength(2)
    expect(item.resolutions[0].resolvedBy.id).toBe('u1')
    expect(item.resolutions[1].resolvedBy.id).toBe('u2')
  })
})

describe('independent per-user archive', () => {
  it('user1 archives, user2 still sees item', () => {
    let item: FeedbackItem = {
      payload: basePayload,
      replies: [],
      resolutions: [],
      archives: [],
    }
    item = applyArchive(item, user1)
    expect(isArchivedForUser(item, user1.id)).toBe(true)
    expect(isArchivedForUser(item, user2.id)).toBe(false)
  })

  it('both users can independently archive', () => {
    let item: FeedbackItem = {
      payload: basePayload,
      replies: [],
      resolutions: [],
      archives: [],
    }
    item = applyArchive(item, user1)
    item = applyArchive(item, user2)
    expect(item.archives).toHaveLength(2)
    expect(isArchivedForUser(item, user1.id)).toBe(true)
    expect(isArchivedForUser(item, user2.id)).toBe(true)
  })
})
