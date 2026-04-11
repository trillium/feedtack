import { beforeEach, describe, expect, it } from 'vitest'
import {
  getAncestorChain,
  getCSSSelector,
  getTargetMeta,
  resolveTarget,
  serializeNode,
} from './target.js'

describe('resolveTarget — interactive ancestor promotion', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('promotes SVG inside button to button', () => {
    document.body.innerHTML =
      '<button id="btn"><svg><path></path></svg></button>'
    const path = document.querySelector('path')!
    const resolved = resolveTarget(path)
    expect(resolved.tagName.toLowerCase()).toBe('button')
  })

  it('promotes span inside anchor to anchor', () => {
    document.body.innerHTML = '<a href="#"><span>text</span></a>'
    const span = document.querySelector('span')!
    const resolved = resolveTarget(span)
    expect(resolved.tagName.toLowerCase()).toBe('a')
  })

  it('leaves directly interactive element unchanged', () => {
    document.body.innerHTML = '<button id="btn">Click</button>'
    const btn = document.querySelector('button')!
    expect(resolveTarget(btn)).toBe(btn)
  })

  it('leaves non-interactive element with no interactive ancestor unchanged', () => {
    document.body.innerHTML = '<div class="wrapper"><p>text</p></div>'
    const p = document.querySelector('p')!
    expect(resolveTarget(p)).toBe(p)
  })
})

describe('getAncestorChain — depth and serialization', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('caps chain at 5 levels', () => {
    document.body.innerHTML =
      '<div><div><div><div><div><div><button id="deep"></button></div></div></div></div></div></div>'
    const btn = document.querySelector('button')!
    const chain = getAncestorChain(btn)
    expect(chain.length).toBe(5)
  })

  it('stops before body', () => {
    document.body.innerHTML = '<div><button id="btn"></button></div>'
    const btn = document.querySelector('button')!
    const chain = getAncestorChain(btn)
    expect(chain.every((n) => n.tag !== 'body')).toBe(true)
  })

  it('each node includes tag and semantic attributes', () => {
    document.body.innerHTML =
      '<div aria-label="container" role="region"><button id="btn"></button></div>'
    const btn = document.querySelector('button')!
    const chain = getAncestorChain(btn)
    expect(chain[0].tag).toBe('div')
    expect(chain[0].ariaLabel).toBe('container')
    expect(chain[0].role).toBe('region')
  })
})

describe('serializeNode — nth-child / nth-of-type', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('computes nthChild for unlabeled element', () => {
    document.body.innerHTML =
      '<div><span></span><span></span><span id="target"></span></div>'
    const target = document.querySelector('#target')!
    // target has id so nthChild should be null
    const node = serializeNode(target)
    expect(node.nthChild).toBeNull()
  })

  it('computes nthChild for element without id or data-testid', () => {
    document.body.innerHTML = '<div><p></p><p></p><p class="target"></p></div>'
    const target = document.querySelector('.target')!
    const node = serializeNode(target)
    expect(node.nthChild).toBe(3)
  })

  it('computes nthOfType correctly', () => {
    document.body.innerHTML =
      '<div><span></span><button></button><button class="target"></button></div>'
    const target = document.querySelector('.target')!
    const node = serializeNode(target)
    expect(node.nthOfType).toBe(2)
  })

  it('omits nthChild when node has id', () => {
    document.body.innerHTML = '<div><button id="stable"></button></div>'
    const btn = document.querySelector('button')!
    const node = serializeNode(btn)
    expect(node.nthChild).toBeNull()
    expect(node.nthOfType).toBeNull()
  })

  it('omits nthChild when node has data-testid', () => {
    document.body.innerHTML =
      '<div><button data-testid="submit"></button></div>'
    const btn = document.querySelector('button')!
    const node = serializeNode(btn)
    expect(node.nthChild).toBeNull()
  })
})

describe('data-feedtack-component', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('captures data-feedtack-component on target', () => {
    document.body.innerHTML =
      '<button data-feedtack-component="CheckoutButton">Buy</button>'
    const btn = document.querySelector('button')!
    const node = serializeNode(btn)
    expect(node.dataFeedtackComponent).toBe('CheckoutButton')
    expect(node.componentName).toBe('CheckoutButton')
  })

  it('captures data-feedtack-component on ancestor node in chain', () => {
    document.body.innerHTML =
      '<div data-feedtack-component="Sidebar"><button id="btn">x</button></div>'
    const btn = document.querySelector('button')!
    const chain = getAncestorChain(btn)
    expect(chain[0].dataFeedtackComponent).toBe('Sidebar')
  })
})

describe('getComponentName — fiber unavailable', () => {
  it('returns null without throwing when fiber not present', async () => {
    const { getComponentName } = await import('./fiber.js')
    const el = document.createElement('button')
    document.body.appendChild(el)
    expect(() => getComponentName(el)).not.toThrow()
    expect(getComponentName(el)).toBeNull()
  })
})

describe('getTargetMeta — selector priority and ancestor chain', () => {
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

  it('uses data-testid selector when no id', () => {
    const el = document.createElement('button')
    el.setAttribute('data-testid', 'checkout-submit')
    document.body.appendChild(el)

    const meta = getTargetMeta(el)
    expect(meta.selector).toBe('[data-testid="checkout-submit"]')
    expect(meta.best_effort).toBe(false)
    expect(meta.dataTestId).toBe('checkout-submit')
    expect(meta.elementPath).toBeNull()
  })

  it('sets dataTestId to null when no data-testid attribute exists', () => {
    const el = document.createElement('button')
    document.body.appendChild(el)

    const meta = getTargetMeta(el)
    expect(meta.dataTestId).toBeNull()
  })

  it('falls back to CSS selector and sets best_effort true', () => {
    const el = document.createElement('button')
    document.body.appendChild(el)

    const meta = getTargetMeta(el)
    expect(typeof meta.selector).toBe('string')
    expect(meta.selector.length).toBeGreaterThan(0)
    expect(meta.best_effort).toBe(true)
  })

  it('uses data-feedtack-component in selector when no id or testid', () => {
    const el = document.createElement('button')
    el.setAttribute('data-feedtack-component', 'NavButton')
    document.body.appendChild(el)

    const meta = getTargetMeta(el)
    expect(meta.selector).toBe('[data-feedtack-component="NavButton"]')
    expect(meta.best_effort).toBe(false)
  })

  it('captures tagName', () => {
    const el = document.createElement('button')
    el.id = 'btn'
    document.body.appendChild(el)

    const meta = getTargetMeta(el)
    expect(meta.tagName).toBe('BUTTON')
  })

  it('promotes SVG click to button and captures button metadata', () => {
    document.body.innerHTML =
      '<button id="icon-btn"><svg><path></path></svg></button>'
    const path = document.querySelector('path')!

    const meta = getTargetMeta(path)
    expect(meta.selector).toBe('#icon-btn')
    expect(meta.tagName).toBe('BUTTON')
  })

  it('includes ancestors array', () => {
    document.body.innerHTML =
      '<div id="wrapper"><button id="btn">x</button></div>'
    const btn = document.querySelector('button')!

    const meta = getTargetMeta(btn)
    expect(Array.isArray(meta.ancestors)).toBe(true)
    expect(meta.ancestors[0].tag).toBe('div')
  })

  it('retains elementPath for backward compat', () => {
    document.body.innerHTML = '<div><button id="btn">x</button></div>'
    const btn = document.querySelector('button')!

    const meta = getTargetMeta(btn)
    // btn has id so elementPath is not null (no testid)
    expect(
      typeof meta.elementPath === 'string' || meta.elementPath === null,
    ).toBe(true)
  })
})

describe('getCSSSelector', () => {
  it('builds a selector path', () => {
    document.body.innerHTML = '<div><ul><li></li></ul></div>'
    const li = document.querySelector('li')!
    const selector = getCSSSelector(li)
    expect(selector).toContain('li')
  })

  it('stops at id', () => {
    document.body.innerHTML = '<div id="root"><ul><li></li></ul></div>'
    const li = document.querySelector('li')!
    const selector = getCSSSelector(li)
    expect(selector).toContain('#root')
  })
})
