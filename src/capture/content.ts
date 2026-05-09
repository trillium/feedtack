const DEV =
  typeof process !== 'undefined' && process.env.NODE_ENV !== 'production'

export interface ScannedField {
  fieldPath: string
  element: Element
  content: string
}

/**
 * Scans the DOM for elements annotated with data-feedtack-field.
 * @param root - Element to search within. Defaults to document.body.
 */
export function scanFields(root?: Element): ScannedField[] {
  const searchRoot = root ?? document.body
  const nodes = Array.from(
    searchRoot.querySelectorAll<HTMLElement>('[data-feedtack-field]'),
  )

  const seen = new Map<string, number>()
  const fields: ScannedField[] = []

  for (const el of nodes) {
    const fieldPath = el.dataset.feedtackField ?? ''
    if (!fieldPath) continue

    seen.set(fieldPath, (seen.get(fieldPath) ?? 0) + 1)
    fields.push({
      fieldPath,
      element: el,
      content: el.textContent ?? '',
    })
  }

  if (DEV) {
    for (const [path, count] of seen) {
      if (count > 1) {
        console.warn(
          `[feedtack] Duplicate data-feedtack-field="${path}" found ${count} times on this page. Field paths must be unique.`,
        )
      }
    }
  }

  return fields
}

/**
 * Computes a 12-character truncated SHA-256 hash of a string using Web Crypto API.
 */
export async function hashField(content: string): Promise<string> {
  const encoded = new TextEncoder().encode(content)
  const buffer = await crypto.subtle.digest('SHA-256', encoded)
  const hex = Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  return hex.slice(0, 12)
}
