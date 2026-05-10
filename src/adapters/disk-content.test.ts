import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { DiskAdapter } from './DiskAdapter.js'

let dir: string
let adapter: DiskAdapter

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'feedtack-content-test-'))
  adapter = new DiskAdapter({ directory: dir })
})

afterEach(async () => {
  await rm(dir, { recursive: true, force: true })
})

describe('DiskAdapter ContentAdapter', () => {
  it('approve stores approval for a field', async () => {
    await adapter.approve('hero.heading', {
      hash: 'abc123def456',
      by: ['u1'],
      at: '2026-05-08T00:00:00Z',
    })

    const states = await adapter.loadApprovals()
    expect(states).toHaveLength(1)
    expect(states[0].fieldPath).toBe('hero.heading')
    expect(states[0].approval?.hash).toBe('abc123def456')
    expect(states[0].approval?.by).toEqual(['u1'])
  })

  it('approve overwrites existing approval for same field', async () => {
    await adapter.approve('hero.heading', {
      hash: 'aaa',
      by: ['u1'],
      at: '2026-05-08T00:00:00Z',
    })
    await adapter.approve('hero.heading', {
      hash: 'bbb',
      by: ['u1', 'u2'],
      at: '2026-05-08T01:00:00Z',
    })

    const states = await adapter.loadApprovals()
    expect(states).toHaveLength(1)
    expect(states[0].approval?.hash).toBe('bbb')
  })

  it('revokeApproval removes a user from the by array', async () => {
    await adapter.approve('hero.heading', {
      hash: 'abc123def456',
      by: ['u1', 'u2'],
      at: '2026-05-08T00:00:00Z',
    })

    await adapter.revokeApproval('hero.heading', 'u1')

    const states = await adapter.loadApprovals()
    expect(states[0].approval?.by).toEqual(['u2'])
  })

  it('revokeApproval deletes file when last approver is removed', async () => {
    await adapter.approve('hero.heading', {
      hash: 'abc123def456',
      by: ['u1'],
      at: '2026-05-08T00:00:00Z',
    })

    await adapter.revokeApproval('hero.heading', 'u1')

    const states = await adapter.loadApprovals()
    expect(states).toHaveLength(0)
  })

  it('revokeApproval is a no-op for non-existent field', async () => {
    await expect(
      adapter.revokeApproval('nonexistent.field', 'u1'),
    ).resolves.not.toThrow()
  })

  it('loadApprovals returns empty array when no approvals stored', async () => {
    const states = await adapter.loadApprovals()
    expect(states).toEqual([])
  })

  it('loadApprovals filters by fieldPath', async () => {
    await adapter.approve('hero.heading', {
      hash: 'aaa',
      by: ['u1'],
      at: '2026-05-08T00:00:00Z',
    })
    await adapter.approve('hero.cta', {
      hash: 'bbb',
      by: ['u1'],
      at: '2026-05-08T00:00:00Z',
    })

    const states = await adapter.loadApprovals({ fieldPath: 'hero.heading' })
    expect(states).toHaveLength(1)
    expect(states[0].fieldPath).toBe('hero.heading')
  })
})

describe('DiskAdapter ContentEditAdapter', () => {
  it('saveField persists the value', async () => {
    await adapter.saveField('hero.heading', 'Hello world')
    const fields = await adapter.loadFields()
    expect(fields['hero.heading']).toBe('Hello world')
  })

  it('saveField clears existing approval', async () => {
    await adapter.approve('hero.heading', {
      hash: 'aaa',
      by: ['u1'],
      at: '2026-05-08T00:00:00Z',
    })
    await adapter.saveField('hero.heading', 'Updated text')

    const approvals = await adapter.loadApprovals({ fieldPath: 'hero.heading' })
    expect(approvals).toHaveLength(0)
  })

  it('saveField is safe when no approval exists', async () => {
    await expect(
      adapter.saveField('hero.heading', 'New value'),
    ).resolves.not.toThrow()
  })

  it('loadFields returns empty object when no fields stored', async () => {
    const fields = await adapter.loadFields()
    expect(fields).toEqual({})
  })

  it('loadFields returns all stored fields', async () => {
    await adapter.saveField('hero.heading', 'Title here')
    await adapter.saveField('hero.cta', 'Click me')

    const fields = await adapter.loadFields()
    expect(fields['hero.heading']).toBe('Title here')
    expect(fields['hero.cta']).toBe('Click me')
  })

  it('saveField overwrites previous value', async () => {
    await adapter.saveField('hero.heading', 'First')
    await adapter.saveField('hero.heading', 'Second')

    const fields = await adapter.loadFields()
    expect(fields['hero.heading']).toBe('Second')
  })
})
