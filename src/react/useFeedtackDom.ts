'use client'

import { useEffect, useRef } from 'react'
import type { FeedtackTheme } from '../types/theme.js'
import { themeToCSS } from '../types/theme.js'
import { FEEDTACK_DEFAULT_TOKENS, FEEDTACK_STYLES } from '../ui/styles.js'

/** Injects feedtack styles, root div, and theme tokens into the document */
export function useFeedtackDom(theme?: FeedtackTheme, disabled?: boolean) {
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (disabled) return
    if (document.getElementById('feedtack-styles')) return
    const style = document.createElement('style')
    style.id = 'feedtack-styles'
    style.textContent = FEEDTACK_DEFAULT_TOKENS + FEEDTACK_STYLES
    document.head.appendChild(style)
    return () => {
      style.remove()
    }
  }, [disabled])

  useEffect(() => {
    if (disabled) return
    const root = document.createElement('div')
    root.id = 'feedtack-root'
    document.body.appendChild(root)
    rootRef.current = root
    return () => {
      root.remove()
    }
  }, [disabled])

  useEffect(() => {
    if (disabled) return
    const root = document.getElementById('feedtack-root')
    if (!root || !theme) return
    const tokens = themeToCSS(theme)
    for (const [k, v] of Object.entries(tokens)) {
      root.style.setProperty(k, v)
    }
  }, [theme, disabled])

  return rootRef
}
