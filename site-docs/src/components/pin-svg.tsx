import type { SVGProps } from 'react'

export const PIN_PALETTE = [
  '#ef4444', // red
  '#3b82f6', // blue
  '#22c55e', // green
  '#f59e0b', // amber
  '#a855f7', // purple
  '#ec4899', // pink
] as const

export type PinColor = (typeof PIN_PALETTE)[number]

interface PinSvgProps extends SVGProps<SVGSVGElement> {
  color?: string
  size?: number
}

export function PinSvg({
  color = '#2563eb',
  size = 32,
  ...props
}: PinSvgProps) {
  return (
    <svg
      viewBox="0 0 24 32"
      width={(size * 24) / 32}
      height={size}
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Pin marker"
      {...props}
    >
      <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20C24 5.4 18.6 0 12 0z" />
      <circle cx="12" cy="11" r="4.5" fill="white" fillOpacity={0.35} />
    </svg>
  )
}
