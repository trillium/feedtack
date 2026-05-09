import { describe, expect, it } from 'vitest'
import { hashField } from '../capture/content.js'
import { isContentAdapter, isContentEditAdapter } from './adapter.js'
import type { FieldApproval, FieldApprovalState } from './payload.js'

describe('FieldApprovalState staleness logic', () => {
  it('is stale when approval is null', () => {
    const state: FieldApprovalState = {
      fieldPath: 'hero.heading',
      approval: null,
      stale: true,
    }
    expect(state.stale).toBe(true)
  })

  it('is not stale when hash matches', async () => {
    const content = 'Hello world'
    const hash = await hashField(content)
    const approval: FieldApproval = {
      hash,
      by: ['u1'],
      at: '2026-05-08T00:00:00Z',
    }
    const state: FieldApprovalState = {
      fieldPath: 'hero.heading',
      approval,
      stale: approval.hash !== hash,
    }
    expect(state.stale).toBe(false)
  })

  it('is stale when hash mismatches (content changed)', async () => {
    const approvedHash = await hashField('Old content')
    const currentHash = await hashField('New content')
    const approval: FieldApproval = {
      hash: approvedHash,
      by: ['u1'],
      at: '2026-05-08T00:00:00Z',
    }
    const state: FieldApprovalState = {
      fieldPath: 'hero.heading',
      approval,
      stale: approval.hash !== currentHash,
    }
    expect(state.stale).toBe(true)
  })
})

describe('isContentAdapter', () => {
  it('returns true for object with all ContentAdapter methods', () => {
    const adapter = {
      approve: async () => {},
      revokeApproval: async () => {},
      loadApprovals: async () => [],
    }
    expect(isContentAdapter(adapter)).toBe(true)
  })

  it('returns false for plain FeedtackAdapter without ContentAdapter methods', () => {
    const adapter = {
      submit: async () => {},
      reply: async () => {},
      resolve: async () => {},
      archive: async () => {},
      loadFeedback: async () => [],
    }
    expect(isContentAdapter(adapter)).toBe(false)
  })

  it('returns false for null', () => {
    expect(isContentAdapter(null)).toBe(false)
  })
})

describe('isContentEditAdapter', () => {
  const base = {
    approve: async () => {},
    revokeApproval: async () => {},
    loadApprovals: async () => [],
  }

  it('returns true when all ContentEditAdapter methods present', () => {
    const adapter = {
      ...base,
      loadFields: async () => ({}),
      saveField: async () => {},
    }
    expect(isContentEditAdapter(adapter)).toBe(true)
  })

  it('returns false when missing saveField', () => {
    const adapter = { ...base, loadFields: async () => ({}) }
    expect(isContentEditAdapter(adapter)).toBe(false)
  })

  it('returns false when missing loadFields', () => {
    const adapter = { ...base, saveField: async () => {} }
    expect(isContentEditAdapter(adapter)).toBe(false)
  })

  it('returns false for plain ContentAdapter without edit methods', () => {
    expect(isContentEditAdapter(base)).toBe(false)
  })

  it('returns false for null', () => {
    expect(isContentEditAdapter(null)).toBe(false)
  })
})
