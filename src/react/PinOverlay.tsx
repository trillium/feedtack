'use client'

import type React from 'react'
import type { FeedbackItem, FeedtackPin } from '../types/payload.js'
import { cx } from './utils.js'

interface PinOverlayProps {
  feedbackItems: FeedbackItem[]
  pathname: string
  isArchivedForUser: (item: FeedbackItem) => boolean
  hasValidPins: (item: FeedbackItem) => boolean
  hasUnread: (item: FeedbackItem) => boolean
  openThreadId: string | null
  setOpenThreadId: (id: string | null) => void
  getPosition: (id: string, pin: FeedtackPin) => { x: number; y: number }
  renderPinIcon?: (item: FeedbackItem) => React.ReactNode
  pinMarkerClass?: string
}

export function PinOverlay({
  feedbackItems,
  pathname,
  isArchivedForUser,
  hasValidPins,
  hasUnread,
  openThreadId,
  setOpenThreadId,
  getPosition,
  renderPinIcon,
  pinMarkerClass,
}: PinOverlayProps) {
  return (
    <>
      {feedbackItems
        .filter((item) => item.payload.page.pathname === pathname)
        .filter((item) => !isArchivedForUser(item))
        .filter((item) => hasValidPins(item))
        .map((item) => {
          const pin = item.payload.pins[0]
          const pos = getPosition(item.payload.id, pin)
          return (
            <button
              type="button"
              key={item.payload.id}
              className={cx(
                'feedtack-pin-marker',
                item.resolutions.length > 0 && 'feedtack-pin-resolved',
                pinMarkerClass,
              )}
              style={{
                background: pin.color,
                left: pos.x,
                top: pos.y,
                position: 'absolute',
                cursor: 'pointer',
              }}
              onClick={() =>
                setOpenThreadId(
                  openThreadId === item.payload.id ? null : item.payload.id,
                )
              }
            >
              {renderPinIcon ? (
                <span className="feedtack-pin-icon">{renderPinIcon(item)}</span>
              ) : (
                item.resolutions.length > 0 && (
                  <span
                    className="feedtack-pin-icon"
                    role="img"
                    aria-label="Resolved"
                  >
                    ✓
                  </span>
                )
              )}
              {hasUnread(item) && <div className="feedtack-pin-badge" />}
            </button>
          )
        })}
    </>
  )
}
