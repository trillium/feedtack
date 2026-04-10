export function generateId(): string {
  return `ft_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`
}

export function getAnchoredPosition(
  x: number,
  y: number,
): { left?: number; right?: number; top?: number; bottom?: number } {
  const FORM_HEIGHT = 220
  const EDGE = 300
  const vw = window.innerWidth
  const vh = window.innerHeight

  const clientX = x - window.scrollX
  const clientY = y - window.scrollY

  const left = clientX > vw - EDGE ? undefined : clientX + 16
  const right = clientX > vw - EDGE ? vw - clientX + 16 : undefined
  const top = clientY > vh - EDGE ? undefined : clientY + 16
  const bottom = clientY > vh - EDGE ? vh - clientY + FORM_HEIGHT : undefined

  return { left, right, top, bottom }
}

export function cx(...parts: (string | undefined | false)[]): string {
  return parts.filter(Boolean).join(' ')
}
