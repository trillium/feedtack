import { beforeEach, describe, expect, it } from 'vitest'
import { getCSSSelector, getElementPath, getTargetMeta } from './target.js'

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

  it('ships testId when data-testid is present (even if id wins selector)', () => {
    const el = document.createElement('button')
    el.id = 'submit-btn'
    el.setAttribute('data-testid', 'checkout-submit')
    document.body.appendChild(el)

    const meta = getTargetMeta(el)
    expect(meta.selector).toBe('#submit-btn')
    expect(meta.testId).toBe('checkout-submit')
  })

  it('uses data-testid when no id is present and sets elementPath null', () => {
    const el = document.createElement('button')
    el.setAttribute('data-testid', 'checkout-submit')
    document.body.appendChild(el)

    const meta = getTargetMeta(el)
    expect(meta.selector).toBe('[data-testid="checkout-submit"]')
    expect(meta.best_effort).toBe(false)
    expect(meta.testId).toBe('checkout-submit')
    expect(meta.elementPath).toBeNull()
  })

  it('sets testId to null when no data-testid attribute exists', () => {
    const el = document.createElement('button')
    document.body.appendChild(el)

    const meta = getTargetMeta(el)
    expect(meta.testId).toBeNull()
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

  it('elementPath shows tag.class ancestry when no testId', () => {
    document.body.innerHTML =
      '<div class="page"><section class="hero main"><button class="btn btn-primary"></button></section></div>'
    const btn = document.querySelector('button')!

    const meta = getTargetMeta(btn)
    expect(meta.elementPath).toBe(
      'div.page > section.hero.main > button.btn.btn-primary',
    )
    expect(meta.testId).toBeNull()
  })

  it('elementPath stops at ancestor with data-testid', () => {
    document.body.innerHTML =
      '<div data-testid="card"><span class="label"><em></em></span></div>'
    const em = document.querySelector('em')!

    const meta = getTargetMeta(em)
    expect(meta.elementPath).toBe('[data-testid="card"] > span.label > em')
  })

  it('elementPath includes bare tags without classes', () => {
    document.body.innerHTML = '<main><div><p></p></div></main>'
    const p = document.querySelector('p')!

    const meta = getTargetMeta(p)
    expect(meta.elementPath).toBe('main > div > p')
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
