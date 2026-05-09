import { beforeEach, describe, expect, it, vi } from 'vitest'
import { hashField, scanFields } from './content.js'

describe('scanFields', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('returns all elements with data-feedtack-field', () => {
    document.body.innerHTML = `
      <h1 data-feedtack-field="hero.heading">Hello</h1>
      <p data-feedtack-field="hero.subheading">World</p>
      <button data-feedtack-field="hero.cta">Click</button>
    `
    const fields = scanFields()
    expect(fields).toHaveLength(3)
    expect(fields.map((f) => f.fieldPath)).toEqual([
      'hero.heading',
      'hero.subheading',
      'hero.cta',
    ])
  })

  it('returns content from textContent', () => {
    document.body.innerHTML = `<h1 data-feedtack-field="hero.heading">Hello world</h1>`
    const [field] = scanFields()
    expect(field.content).toBe('Hello world')
  })

  it('returns empty array when no annotated elements', () => {
    document.body.innerHTML = `<h1>No annotation</h1>`
    expect(scanFields()).toHaveLength(0)
  })

  it('respects a root element', () => {
    document.body.innerHTML = `
      <div id="inside">
        <h1 data-feedtack-field="hero.heading">In scope</h1>
      </div>
      <h2 data-feedtack-field="footer.text">Out of scope</h2>
    `
    const root = document.getElementById('inside')!
    const fields = scanFields(root)
    expect(fields).toHaveLength(1)
    expect(fields[0].fieldPath).toBe('hero.heading')
  })

  it('warns on duplicate field paths in dev mode', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    document.body.innerHTML = `
      <h1 data-feedtack-field="hero.heading">First</h1>
      <h2 data-feedtack-field="hero.heading">Duplicate</h2>
    `
    scanFields()
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('hero.heading'),
    )
    warnSpy.mockRestore()
  })

  it('does not warn when paths are unique', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    document.body.innerHTML = `
      <h1 data-feedtack-field="hero.heading">First</h1>
      <h2 data-feedtack-field="hero.subheading">Second</h2>
    `
    scanFields()
    expect(warnSpy).not.toHaveBeenCalled()
    warnSpy.mockRestore()
  })
})

describe('hashField', () => {
  it('returns a 12-character hex string', async () => {
    const hash = await hashField('hello world')
    expect(hash).toHaveLength(12)
    expect(hash).toMatch(/^[0-9a-f]+$/)
  })

  it('produces the same hash for identical content', async () => {
    const a = await hashField('same content')
    const b = await hashField('same content')
    expect(a).toBe(b)
  })

  it('produces different hashes for different content', async () => {
    const a = await hashField('content A')
    const b = await hashField('content B')
    expect(a).not.toBe(b)
  })

  it('handles empty string', async () => {
    const hash = await hashField('')
    expect(hash).toHaveLength(12)
  })
})
