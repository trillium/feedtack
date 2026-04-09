import { describe, it, expect, beforeEach } from 'vitest'
import { getTargetMeta, getCSSSelector } from './target.js'

describe('getTargetMeta — selector priority chain', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('uses id selector when id is present', () => {
    const el = document.createElement('button')
    el.id = 'submit-btn'
    document.body.appendChild(el)

    const meta = getTargetMeta(el)
    expect(meta.selector).toBe('#submit-btn')
    expect(meta.best_effort).toBe(false)
  })

  it('uses data-testid when no id is present', () => {
    const el = document.createElement('button')
    el.setAttribute('data-testid', 'checkout-submit')
    document.body.appendChild(el)

    const meta = getTargetMeta(el)
    expect(meta.selector).toBe('[data-testid="checkout-submit"]')
    expect(meta.best_effort).toBe(false)
  })

  it('falls back to CSS selector and sets best_effort true', () => {
    const el = document.createElement('button')
    document.body.appendChild(el)

    const meta = getTargetMeta(el)
    expect(typeof meta.selector).toBe('string')
    expect(meta.selector.length).toBeGreaterThan(0)
    expect(meta.best_effort).toBe(true)
  })

  it('truncates textContent to 200 chars', () => {
    const el = document.createElement('p')
    el.textContent = 'a'.repeat(300)
    document.body.appendChild(el)

    const meta = getTargetMeta(el)
    expect(meta.textContent.length).toBe(200)
  })

  it('captures tagName', () => {
    const el = document.createElement('button')
    el.id = 'btn'
    document.body.appendChild(el)

    const meta = getTargetMeta(el)
    expect(meta.tagName).toBe('BUTTON')
  })
})

describe('getCSSSelector', () => {
  it('builds a selector path', () => {
    document.body.innerHTML = '<div><ul><li></li></ul></div>'
    const li = document.querySelector('li')!
    const selector = getCSSSelector(li)
    expect(selector).toContain('li')
  })
})
