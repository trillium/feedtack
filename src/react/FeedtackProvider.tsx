'use client'

import type React from 'react'
import type { FeedtackUser } from '../types/payload.js'
import { PIN_PALETTE } from '../ui/colors.js'
import { CommentForm } from './CommentForm.js'
import { FeedtackContext } from './context.js'
import { FeedbackModal } from './FeedbackModal.js'
import { PinOverlay } from './PinOverlay.js'
import type { FeedtackProviderProps } from './providerTypes.js'
import { ThreadPanel } from './ThreadPanel.js'
import { useAnchoredPins } from './useAnchoredPins.js'
import { useFeedtackState } from './useFeedtackState.js'
import { cx, getAnchoredPosition } from './utils.js'

export type {
  FeedtackClasses,
  FeedtackProviderProps,
  FeedtackSentimentLabels,
} from './providerTypes.js'

export function FeedtackProvider<TUser = FeedtackUser>({
  children,
  adapter,
  currentUser,
  mapUser,
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
}: FeedtackProviderProps<TUser>) {
  const resolvedUser: FeedtackUser = mapUser
    ? mapUser(currentUser)
    : (currentUser as unknown as FeedtackUser)

  if (process.env.NODE_ENV !== 'production' && !resolvedUser.id) {
    console.warn(
      '[feedtack] currentUser has no id — provide mapUser to normalize your user type',
    )
  }

  const state = useFeedtackState({
    adapter,
    currentUser: resolvedUser,
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
  const showButton = !adminOnly || resolvedUser.role === 'admin'

  const openItem = state.openThreadId
    ? state.feedbackItems.find((i) => i.payload.id === state.openThreadId)
    : null
  const closeThread = () => state.setOpenThreadId(null)

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
          onClose={closeThread}
          onBackdropClick={state.isPinModeActive ? undefined : closeThread}
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
          onPlacePin={() => {
            state.closeModal()
            state.activatePinMode()
          }}
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
