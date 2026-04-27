import type { CSSProperties } from 'react'

import './shimmer-bar.css'

/**
 * SVG gradient used by ShimmerBar overlays.
 * Place once inside the root <svg> <defs> block.
 */
export function ShimmerGradient() {
  return (
    <linearGradient
      id="wfaShimmer"
      gradientUnits="userSpaceOnUse"
      x1="0"
      y1="0"
      x2="80"
      y2="0"
    >
      <stop offset="0%" stopColor="rgba(255,255,255,0)" />
      <stop offset="40%" stopColor="rgba(255,255,255,0)" />
      <stop offset="50%" stopColor="rgba(255,255,255,0.18)" />
      <stop offset="60%" stopColor="rgba(255,255,255,0)" />
      <stop offset="100%" stopColor="rgba(255,255,255,0)" />
    </linearGradient>
  )
}

/**
 * Skeleton bar with a shimmer sweep clipped to its bounds.
 * Uses a nested <svg overflow="hidden"> to contain the animation.
 */
export function ShimmerBar({
  x,
  y,
  width,
  height,
  rx = 2,
  style,
  opacity,
}: {
  x: number
  y: number
  width: number
  height: number
  rx?: number
  style?: CSSProperties
  opacity?: number
}) {
  return (
    <svg
      x={x}
      y={y}
      width={width}
      height={height}
      overflow="hidden"
      aria-hidden="true"
    >
      <rect
        width={width}
        height={height}
        rx={rx}
        style={style}
        opacity={opacity}
      />
      <rect
        width={width}
        height={height}
        rx={rx}
        fill="url(#wfaShimmer)"
        className="wfa-shimmer"
      />
    </svg>
  )
}
