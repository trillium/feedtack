'use client'

/** Cached React fiber key (e.g. "__reactFiber$abc123") — discovered once at runtime */
let fiberKey: string | null | undefined

function getFiberKey(element: Element): string | null {
  if (fiberKey !== undefined) return fiberKey
  const key = Object.keys(element).find((k) => k.startsWith('__reactFiber$'))
  fiberKey = key ?? null
  return fiberKey
}

/** Extract React component display name for an element via fiber traversal.
 *  Returns null if fiber is unavailable or no named component is found. */
export function getComponentName(element: Element): string | null {
  try {
    const key = getFiberKey(element)
    if (!key) return null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let fiber = (element as any)[key]
    while (fiber) {
      const type = fiber.type
      if (type && typeof type !== 'string') {
        const name = type.displayName ?? type.name
        if (name && name !== 'Anonymous') return name as string
      }
      fiber = fiber.return
    }
    return null
  } catch {
    return null
  }
}
