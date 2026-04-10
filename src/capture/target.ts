import type { FeedtackPinTarget } from '../types/payload.js'

/** Build readable tag.class ancestry path, stopping at body or a data-testid ancestor */
export function getElementPath(element: Element): string {
  const parts: string[] = []
  let current: Element | null = element

  while (current && current !== document.body) {
    const tag = current.tagName.toLowerCase()
    const classes = Array.from(current.classList).join('.')
    let part = classes ? `${tag}.${classes}` : tag

    // If an ancestor has a data-testid, anchor there and stop
    if (current !== element && current.hasAttribute('data-testid')) {
      part = `[data-testid="${current.getAttribute('data-testid')}"]`
      parts.unshift(part)
      break
    }

    parts.unshift(part)
    current = current.parentElement
  }

  return parts.join(' > ')
}

/** Build shortest unique CSS selector for an element */
export function getCSSSelector(element: Element): string {
  const parts: string[] = []
  let current: Element | null = element

  while (current && current !== document.body) {
    let selector = current.tagName.toLowerCase()
    const parent = current.parentElement

    if (parent) {
      const siblings = Array.from(parent.children).filter(
        (c) => c.tagName === current!.tagName,
      )
      if (siblings.length > 1) {
        const index = siblings.indexOf(current) + 1
        selector += `:nth-of-type(${index})`
      }
    }

    parts.unshift(selector)
    current = current.parentElement
  }

  return parts.join(' > ')
}

/** Capture DOM target metadata at the clicked element */
export function getTargetMeta(element: Element): FeedtackPinTarget {
  const id = element.getAttribute('id')
  const testId = element.getAttribute('data-testid')

  let selector: string
  let best_effort: boolean

  if (id) {
    selector = `#${id}`
    best_effort = false
  } else if (testId) {
    selector = `[data-testid="${testId}"]`
    best_effort = false
  } else {
    selector = getCSSSelector(element)
    best_effort = true
  }

  const rect = element.getBoundingClientRect()
  const attrs: Record<string, string> = {}
  for (const attr of Array.from(element.attributes)) {
    attrs[attr.name] = attr.value
  }

  return {
    selector,
    best_effort,
    testId: testId ?? null,
    elementPath: testId ? null : getElementPath(element),
    tagName: element.tagName,
    textContent: (element.textContent ?? '').trim().slice(0, 200),
    attributes: attrs,
    boundingRect: {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
    },
  }
}
