'use client'

import type React from 'react'
import type { FeedtackAdapter } from '../types/adapter.js'
import type { FeedbackItem, FeedtackUser } from '../types/payload.js'
import type { FeedtackTheme } from '../types/theme.js'
import { PIN_PALETTE } from '../ui/colors.js'
import { CommentForm } from './CommentForm.js'
import { FeedtackContext } from './context.js'
import { ThreadPanel } from './ThreadPanel.js'
import { useFeedtackState } from './useFeedtackState.js'
import { cx, getAnchoredPosition } from './utils.js'

export interface FeedtackClasses {
  button?: string
  form?: string
  thread?: string
  colorPicker?: string
  pinMarker?: string
}

export interface FeedtackSentimentLabels {
  satisfied?: React.ReactNode
  dissatisfied?: React.ReactNode
}

export interface FeedtackProviderProps {
  children: React.ReactNode
  adapter: FeedtackAdapter
  currentUser: FeedtackUser
  hotkey?: string
  adminOnly?: boolean
  theme?: FeedtackTheme
  classes?: FeedtackClasses
  sentimentLabels?: FeedtackSentimentLabels
  onError?: (err: Error) => void
  disabled?: boolean
  /** Render custom content inside a submitted pin marker. Receives the feedback item. */
  renderPinIcon?: (item: FeedbackItem) => React.ReactNode
}

export function FeedtackProvider({
  children,
  adapter,
  currentUser,
  hotkey = 'p',
  adminOnly = false,
  theme,
  classes = {},
  sentimentLabels = {},
  onError,
  disabled = false,
  renderPinIcon,
}: FeedtackProviderProps) {
  const state = useFeedtackState({
    adapter,
    currentUser,
    hotkey,
    theme,
    onError,
    disabled,
  })

  const firstPin = state.pendingPins[0]
  const formPos = firstPin ? getAnchoredPosition(firstPin.x, firstPin.y) : {}
  const showButton = !adminOnly || currentUser.role === 'admin'

  const openItem = state.openThreadId
    ? state.feedbackItems.find((i) => i.payload.id === state.openThreadId)
    : null

  return (
    <FeedtackContext.Provider
      value={{
        activatePinMode: disabled ? () => {} : state.activatePinMode,
        deactivatePinMode: disabled ? () => {} : state.deactivatePinMode,
        isPinModeActive: disabled ? false : state.isPinModeActive,
      }}
    >
      {children}

      {!disabled && showButton && (
        <button
          type="button"
          className={cx(
            'feedtack-btn',
            state.isPinModeActive && 'active',
            classes.button,
          )}
          onClick={() =>
            state.isPinModeActive
              ? state.deactivatePinMode()
              : state.activatePinMode()
          }
          title="Toggle feedback pin mode"
          aria-label="Toggle feedback pin mode"
          aria-pressed={state.isPinModeActive}
        >
          Drop Pin [Shift+{hotkey.toUpperCase()}]
        </button>
      )}

      {state.isPinModeActive && (
        <div className={cx('feedtack-color-picker', classes.colorPicker)}>
          {PIN_PALETTE.map((color) => (
            <button
              type="button"
              key={color}
              className={cx(
                'feedtack-color-swatch',
                state.selectedColor === color && 'selected',
              )}
              style={{ background: color }}
              onClick={() => state.setSelectedColor(color)}
              title={color}
            />
          ))}
        </div>
      )}

      {state.pendingPins.map((pin) => (
        <div
          key={`${pin.x}-${pin.y}-${pin.color}`}
          className={cx('feedtack-pin-marker', classes.pinMarker)}
          style={{
            background: pin.color,
            left: pin.x,
            top: pin.y,
            position: 'absolute',
          }}
        />
      ))}

      {state.showForm && (
        <CommentForm
          comment={state.comment}
          commentError={state.commentError}
          sentiment={state.sentiment}
          submitting={state.submitting}
          formPos={formPos}
          classes={classes}
          sentimentLabels={sentimentLabels}
          onCommentChange={(v) => {
            state.setComment(v)
            state.setCommentError(false)
          }}
          onSentimentChange={state.setSentiment}
          onSubmit={state.handleSubmit}
          onCancel={state.deactivatePinMode}
        />
      )}

      {!state.loading &&
        state.feedbackItems
          .filter((item) => item.payload.page.pathname === state.pathname)
          .filter((item) => !state.isArchivedForUser(item))
          .filter((item) => state.hasValidPins(item))
          .map((item) => {
            const pin = item.payload.pins[0]
            return (
              <button
                type="button"
                key={item.payload.id}
                className={cx(
                  'feedtack-pin-marker',
                  item.resolutions.length > 0 && 'feedtack-pin-resolved',
                  classes.pinMarker,
                )}
                style={{
                  background: pin.color,
                  left: pin.x,
                  top: pin.y,
                  position: 'absolute',
                  cursor: 'pointer',
                }}
                onClick={() =>
                  state.setOpenThreadId(
                    state.openThreadId === item.payload.id
                      ? null
                      : item.payload.id,
                  )
                }
              >
                {renderPinIcon ? (
                  <span className="feedtack-pin-icon">
                    {renderPinIcon(item)}
                  </span>
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
                {state.hasUnread(item) && (
                  <div className="feedtack-pin-badge" />
                )}
              </button>
            )
          })}

      {openItem && (
        <ThreadPanel
          item={openItem}
          replyBody={state.replyBody}
          onReplyBodyChange={state.setReplyBody}
          onReply={() => state.handleReply(openItem.payload.id)}
          onResolve={() => state.handleResolve(openItem.payload.id)}
          onArchive={() => state.handleArchive(openItem.payload.id)}
          onClose={() => state.setOpenThreadId(null)}
          className={classes.thread}
        />
      )}

      {state.loading && (
        <div className="feedtack-loading">Loading feedback…</div>
      )}
    </FeedtackContext.Provider>
  )
}
