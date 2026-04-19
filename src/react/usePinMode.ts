'use client'

import { useCallback, useEffect, useState } from 'react'
import { getPinCoords, getTargetMeta } from '../capture/index.js'
import type { FeedtackPin } from '../types/payload.js'
import { PIN_PALETTE } from '../ui/colors.js'

export interface UsePinModeOpts {
  hotkey: string
  onDeactivate?: () => void
  disabled?: boolean
  /** When true, suppress arrow-key color cycling (e.g. thread panel is open) */
  isModalOpen?: boolean
}

export function usePinMode({
  hotkey,
  onDeactivate,
  disabled,
  isModalOpen,
}: UsePinModeOpts) {
  const [isActive, setIsActive] = useState(false)
  const [pendingPins, setPendingPins] = useState<
    Array<Omit<FeedtackPin, 'index'>>
  >([])
  const [selectedColor, setSelectedColor] = useState<string>(PIN_PALETTE[0])
  const [showForm, setShowForm] = useState(false)

  const activate = useCallback(() => setIsActive(true), [])

  const deactivate = useCallback(() => {
    setIsActive(false)
    setPendingPins([])
    setShowForm(false)
    onDeactivate?.()
  }, [onDeactivate])

  // Crosshair cursor
  useEffect(() => {
    if (isActive) {
      document.documentElement.classList.add('feedtack-crosshair')
    } else {
      document.documentElement.classList.remove('feedtack-crosshair')
    }
    return () => document.documentElement.classList.remove('feedtack-crosshair')
  }, [isActive])

  // Hotkey + arrow keys for color cycling
  useEffect(() => {
    if (disabled) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === hotkey.toUpperCase() && e.shiftKey) {
        setIsActive((prev) => !prev)
      }
      if (e.key === 'Escape') {
        deactivate()
      }
      if (
        isActive &&
        !isModalOpen &&
        !showForm &&
        (e.key === 'ArrowLeft' || e.key === 'ArrowRight')
      ) {
        e.preventDefault()
        setSelectedColor((prev) => {
          const idx = PIN_PALETTE.indexOf(prev as (typeof PIN_PALETTE)[number])
          const dir = e.key === 'ArrowRight' ? 1 : -1
          return PIN_PALETTE[
            (idx + dir + PIN_PALETTE.length) % PIN_PALETTE.length
          ]
        })
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [hotkey, deactivate, isActive, disabled, isModalOpen, showForm])

  // Click-to-place pin
  const handlePageClick = useCallback(
    (e: MouseEvent) => {
      if (!isActive) return
      const target = e.target as Element
      if (
        target.closest('#feedtack-root, .feedtack-form, .feedtack-color-picker')
      )
        return
      e.preventDefault()
      e.stopPropagation()
      setPendingPins((prev) => [
        ...prev,
        {
          color: selectedColor,
          ...getPinCoords(e),
          target: getTargetMeta(target),
        },
      ])
      setShowForm(true)
    },
    [isActive, selectedColor],
  )

  useEffect(() => {
    if (disabled) return
    document.addEventListener('click', handlePageClick, true)
    return () => document.removeEventListener('click', handlePageClick, true)
  }, [handlePageClick, disabled])

  return {
    isActive,
    activate,
    deactivate,
    pendingPins,
    selectedColor,
    setSelectedColor,
    showForm,
  }
}
