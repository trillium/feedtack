/** Fixed palette of 6 colors for pin markers */
export const PIN_PALETTE = [
  '#ef4444', // red
  '#3b82f6', // blue
  '#22c55e', // green
  '#f59e0b', // amber
  '#a855f7', // purple
  '#ec4899', // pink
] as const

export type PinColor = typeof PIN_PALETTE[number]
