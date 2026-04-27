'use client'

import { useEffect, useState } from 'react'

interface TypewriterProps {
  text: string
  delay?: number
  charSpeed?: number
  className?: string
  onComplete?: () => void
}

export function Typewriter({
  text,
  delay = 0,
  charSpeed = 30,
  className = '',
  onComplete,
}: TypewriterProps) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (!started) return
    if (displayed.length >= text.length) {
      setDone(true)
      onComplete?.()
      return
    }
    const timer = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1))
    }, charSpeed)
    return () => clearTimeout(timer)
  }, [started, displayed, text, charSpeed, onComplete])

  if (!started) return <span className={className}>&nbsp;</span>

  return (
    <span className={className}>
      {displayed}
      {!done && (
        <span className="blink-cursor" />
      )}
    </span>
  )
}
