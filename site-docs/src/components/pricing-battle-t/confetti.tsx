'use client'

import { useEffect, useState } from 'react'

const COLORS = [
  '#c084fc',
  '#22d3ee',
  '#facc15',
  '#f472b6',
  '#34d399',
  '#8b5cf6',
]

interface Piece {
  id: number
  left: string
  color: string
  duration: string
  delay: string
  shape: 'square' | 'circle' | 'strip'
  size: number
}

export function Confetti() {
  const [pieces, setPieces] = useState<Piece[]>([])

  useEffect(() => {
    const generated: Piece[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      duration: `${2 + Math.random() * 3}s`,
      delay: `${Math.random() * 2}s`,
      shape: (['square', 'circle', 'strip'] as const)[
        Math.floor(Math.random() * 3)
      ],
      size: 6 + Math.random() * 6,
    }))
    setPieces(generated)

    const timer = setTimeout(() => setPieces([]), 5000)
    return () => clearTimeout(timer)
  }, [])

  if (pieces.length === 0) return null

  return (
    <div className="tolinski-confetti" aria-hidden="true">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="tolinski-confetti-piece"
          style={{
            left: p.left,
            backgroundColor: p.color,
            animationDuration: p.duration,
            animationDelay: p.delay,
            width: p.shape === 'strip' ? p.size * 0.4 : p.size,
            height: p.shape === 'strip' ? p.size * 1.5 : p.size,
            borderRadius:
              p.shape === 'circle'
                ? '50%'
                : p.shape === 'strip'
                  ? '2px'
                  : '1px',
          }}
        />
      ))}
    </div>
  )
}
