/**
 * Target shim for injectable snippet — bypasses React fiber walker.
 * Re-implements serializeNode with componentName hardcoded to null.
 */
import type { AncestorNode, FeedtackPinTarget } from '../types/payload.js'

const INTERACTIVE_SELECTOR = 'button,a,input,select,textarea,label'

/** Resolve the capture target — promote to nearest interactive ancestor */
export function resolveTarget(element: Element): Element {
  const promoted = element.closest(INTERACTIVE_SELECTOR)
  return promoted ?? element
}

function attr(el: Element, name: string): string | null {
  return el.getAttribute(name)
}

function nthChild(el: Element): number {
  let n = 1
  let sib = el.previousElementSibling
  while (sib) {
    n++
    sib = sib.previousElementSibling
  }
  return n
}

function nthOfType(el: Element): number {
  const tag = el.tagName
  let n = 1
  let sib = el.previousElementSibling
  while (sib) {
    if (sib.tagName === tag) n++
    sib = sib.previousElementSibling
  }
  return n
}

/** Serialize a single DOM node — componentName always null (no React fiber) */
export function serializeNode(el: Element): AncestorNode {
  const id = attr(el, 'id')
  const dataTestId = attr(el, 'data-testid') ?? attr(el, 'data-test-id')
  const dataFeedtackComponent = attr(el, 'data-feedtack-component')
  const hasStableId = !!(id || dataTestId)

  return {
    tag: el.tagName.toLowerCase(),
    id,
    ariaLabel: attr(el, 'aria-label'),
    role: attr(el, 'role'),
    type: attr(el, 'type'),
    name: attr(el, 'name'),
    title: attr(el, 'title'),
    alt: attr(el, 'alt'),
    dataTestId,
    dataFeedtackComponent,
    nthChild: hasStableId ? null : nthChild(el),
    nthOfType: hasStableId ? null : nthOfType(el),
    componentName: dataFeedtackComponent ?? null,
  }
}

/** Walk up to 5 ancestor levels from the resolved target */
export function getAncestorChain(element: Element): AncestorNode[] {
  const chain: AncestorNode[] = []
  let current = element.parentElement
  while (current && current !== document.body && chain.length < 5) {
    chain.push(serializeNode(current))
    current = current.parentElement
  }
  return chain
}

/** Build shortest unique CSS selector for an element */
export function getCSSSelector(element: Element): string {
  const parts: string[] = []
  let current: Element | null = element

  while (current && current !== document.body) {
    const id = current.getAttribute('id')
    const testId =
      current.getAttribute('data-testid') ??
      current.getAttribute('data-test-id')
    const feedtackComponent = current.getAttribute('data-feedtack-component')

    if (id) {
      parts.unshift(`#${id}`)
      break
    } else if (testId) {
      parts.unshift(`[data-testid="${testId}"]`)
      break
    } else if (feedtackComponent) {
      parts.unshift(`[data-feedtack-component="${feedtackComponent}"]`)
      break
    } else {
      const tag = current.tagName.toLowerCase()
      const parent = current.parentElement
      if (parent) {
        const siblings = Array.from(parent.children).filter(
          (c) => c.tagName === current!.tagName,
        )
        const index = siblings.indexOf(current) + 1
        parts.unshift(
          siblings.length > 1 ? `${tag}:nth-of-type(${index})` : tag,
        )
      } else {
        parts.unshift(tag)
      }
    }
    current = current.parentElement
  }

  return parts.join(' > ')
}

function deriveElementPath(
  target: Element,
  ancestors: AncestorNode[],
): string | null {
  const dataTestId =
    target.getAttribute('data-testid') ?? target.getAttribute('data-test-id')
  if (dataTestId) return null

  const targetPart = (() => {
    const tag = target.tagName.toLowerCase()
    const classes = Array.from(target.classList).join('.')
    return classes ? `${tag}.${classes}` : tag
  })()

  const ancestorParts = ancestors.map((a) => {
    if (a.dataTestId) return `[data-testid="${a.dataTestId}"]`
    return a.tag
  })

  return [targetPart, ...ancestorParts].join(' > ')
}

/** Capture DOM target metadata at the clicked element */
export function getTargetMeta(element: Element): FeedtackPinTarget {
  const resolved = resolveTarget(element)

  const id = resolved.getAttribute('id')
  const dataTestId =
    resolved.getAttribute('data-testid') ??
    resolved.getAttribute('data-test-id')
  const feedtackComponent = resolved.getAttribute('data-feedtack-component')

  let selector: string
  let best_effort: boolean

  if (id) {
    selector = `#${id}`
    best_effort = false
  } else if (dataTestId) {
    selector = `[data-testid="${dataTestId}"]`
    best_effort = false
  } else if (feedtackComponent) {
    selector = `[data-feedtack-component="${feedtackComponent}"]`
    best_effort = false
  } else {
    selector = getCSSSelector(resolved)
    best_effort = true
  }

  const ancestors = getAncestorChain(resolved)
  const rect = resolved.getBoundingClientRect()

  return {
    selector,
    best_effort,
    dataTestId,
    elementPath: deriveElementPath(resolved, ancestors),
    tagName: resolved.tagName,
    ancestors,
    boundingRect: {
      x: rect.x + window.scrollX,
      y: rect.y + window.scrollY,
      width: rect.width,
      height: rect.height,
    },
  }
}
