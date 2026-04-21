'use client'

import type React from 'react'
import type { FeedtackAdapter } from '../types/adapter.js'
import type { FeedbackItem, FeedtackUser } from '../types/payload.js'
import type { FeedtackTheme } from '../types/theme.js'
import { PIN_PALETTE } from '../ui/colors.js'
import { CommentForm } from './CommentForm.js'
import { FeedtackContext } from './context.js'
import { FeedbackModal } from './FeedbackModal.js'
import { PinOverlay } from './PinOverlay.js'
import { ThreadPanel } from './ThreadPanel.js'
import { useAnchoredPins } from './useAnchoredPins.js'
import type { FeedtackFlushEvent } from './useFeedtackFlush.js'
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
  /** Called with batched feedback when user leaves a page or goes idle */
  onFlush?: (event: FeedtackFlushEvent) => void
  /** Idle timeout in ms before flushing (default 5 min) */
  flushIdleMs?: number
  /** User roles that trigger re-scope on reply (default: any non-'agent' role) */
  rescopeRoles?: string[]
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
  onFlush,
  flushIdleMs,
  rescopeRoles,
}: FeedtackProviderProps) {
  const state = useFeedtackState({
    adapter,
    currentUser,
    hotkey,
    theme,
    onError,
    disabled,
    onFlush,
    flushIdleMs,
    rescopeRoles,
  })

  const { getPosition } = useAnchoredPins(state.feedbackItems, state.pathname)

  const firstPin = state.pendingPins[0]
  const formPos = firstPin ? getAnchoredPosition(firstPin.x, firstPin.y) : {}
  const showButton = !adminOnly || currentUser.role === 'admin'

  const openItem = state.openThreadId
    ? state.feedbackItems.find((i) => i.payload.id === state.openThreadId)
    : null

  const handlePlacePin = () => {
    state.closeModal()
    state.activatePinMode()
  }

  return (
    <FeedtackContext.Provider
      value={{
        activatePinMode: disabled ? () => {} : state.activatePinMode,
        deactivatePinMode: disabled ? () => {} : state.deactivatePinMode,
        isPinModeActive: disabled ? false : state.isPinModeActive,
        selectedColor: state.selectedColor,
        setSelectedColor: disabled ? () => {} : state.setSelectedColor,
        pinPalette: PIN_PALETTE,
        openModal: disabled ? () => {} : state.openModal,
        closeModal: disabled ? () => {} : state.closeModal,
        isModalOpen: disabled ? false : state.isModalOpen,
      }}
    >
      {children}

      {!disabled && showButton && (
        <button
          type="button"
          className={cx(
            'feedtack-btn',
            (state.isPinModeActive || state.isModalOpen) && 'active',
            classes.button,
          )}
          onClick={() => state.openModal()}
          title="Open feedback"
          aria-label="Open feedback"
        >
          Feedback
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

      {!state.loading && (
        <PinOverlay
          feedbackItems={state.feedbackItems}
          pathname={state.pathname}
          isArchivedForUser={state.isArchivedForUser}
          hasValidPins={state.hasValidPins}
          hasUnread={state.hasUnread}
          openThreadId={state.openThreadId}
          setOpenThreadId={state.setOpenThreadId}
          getPosition={getPosition}
          renderPinIcon={renderPinIcon}
          pinMarkerClass={classes.pinMarker}
        />
      )}

      {openItem && (
        <ThreadPanel
          item={openItem}
          replyBody={state.replyBody}
          onReplyBodyChange={state.setReplyBody}
          onReply={() => state.handleReply(openItem.payload.id)}
          onResolve={() => state.handleResolve(openItem.payload.id)}
          onArchive={() => state.handleArchive(openItem.payload.id)}
          onClose={() => state.setOpenThreadId(null)}
          pinPosition={getPosition(
            openItem.payload.id,
            openItem.payload.pins[0],
          )}
          className={classes.thread}
        />
      )}

      {!disabled && (
        <FeedbackModal
          isOpen={state.isModalOpen}
          onClose={state.closeModal}
          activeTab={state.composeScope}
          onTabChange={state.setComposeScope}
          siteFeedback={state.siteFeedback}
          pageFeedback={state.pageFeedback}
          comment={state.comment}
          onCommentChange={(v) => {
            state.setComment(v)
            state.setCommentError(false)
          }}
          commentError={state.commentError}
          sentiment={state.sentiment}
          onSentimentChange={state.setSentiment}
          submitting={state.submitting}
          onSubmit={state.handleModalSubmit}
          onPlacePin={handlePlacePin}
          replyBody={state.replyBody}
          onReplyBodyChange={state.setReplyBody}
          onReply={(id) => state.handleReply(id)}
          onResolve={(id) => state.handleResolve(id)}
          onArchive={(id) => state.handleArchive(id)}
          openThreadId={state.openThreadId}
          onOpenThread={state.setOpenThreadId}
        />
      )}

      {state.loading && (
        <div className="feedtack-loading">Loading feedback…</div>
      )}
    </FeedtackContext.Provider>
  )
}
