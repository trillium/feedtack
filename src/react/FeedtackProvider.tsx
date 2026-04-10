'use client'

import type React from 'react'
import type { FeedtackAdapter } from '../types/adapter.js'
import type { FeedtackUser } from '../types/payload.js'
import type { FeedtackTheme } from '../types/theme.js'
import { PIN_PALETTE } from '../ui/colors.js'
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
}: FeedtackProviderProps) {
  const state = useFeedtackState({
    adapter,
    currentUser,
    hotkey,
    theme,
    onError,
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
        activatePinMode: state.activatePinMode,
        deactivatePinMode: state.deactivatePinMode,
        isPinModeActive: state.isPinModeActive,
      }}
    >
      {children}

      {showButton && (
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
        <div
          className={cx('feedtack-form', classes.form)}
          style={{ position: 'fixed', ...formPos }}
        >
          <textarea
            className={state.commentError ? 'error' : ''}
            placeholder="What's the issue? (required)"
            value={state.comment}
            onChange={(e) => {
              state.setComment(e.target.value)
              state.setCommentError(false)
            }}
            ref={(el) => el?.focus()}
          />
          {state.commentError && (
            <span className="feedtack-error-msg">Comment is required</span>
          )}
          <div className="feedtack-sentiment">
            <button
              type="button"
              className={state.sentiment === 'satisfied' ? 'selected' : ''}
              onClick={() =>
                state.setSentiment(
                  state.sentiment === 'satisfied' ? null : 'satisfied',
                )
              }
            >
              {sentimentLabels.satisfied ?? '😊 Satisfied'}
            </button>
            <button
              type="button"
              className={state.sentiment === 'dissatisfied' ? 'selected' : ''}
              onClick={() =>
                state.setSentiment(
                  state.sentiment === 'dissatisfied' ? null : 'dissatisfied',
                )
              }
            >
              {sentimentLabels.dissatisfied ?? '😞 Dissatisfied'}
            </button>
          </div>
          <div className="feedtack-form-actions">
            <button
              type="button"
              className="feedtack-btn-cancel"
              onClick={state.deactivatePinMode}
            >
              Cancel
            </button>
            <button
              type="button"
              className="feedtack-btn-submit"
              onClick={state.handleSubmit}
              disabled={state.submitting}
            >
              {state.submitting ? 'Sending…' : 'Submit'}
            </button>
          </div>
        </div>
      )}

      {!state.loading &&
        state.feedbackItems
          .filter((item) => item.payload.page.pathname === state.pathname)
          .filter((item) => !state.isArchivedForUser(item))
          .map((item) => {
            const pin = item.payload.pins[0]
            return (
              <button
                type="button"
                key={item.payload.id}
                className={cx('feedtack-pin-marker', classes.pinMarker)}
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
