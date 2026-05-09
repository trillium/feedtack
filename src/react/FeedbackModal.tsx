'use client'

import { useCallback, useEffect, useRef } from 'react'
import type { FeedbackItem, FeedtackSentiment } from '../types/payload.js'
import { ModalComposeForm } from './ModalComposeForm.js'
import { ModalThreadList } from './ModalThreadList.js'
import { ThreadView } from './ThreadView.js'
import { cx } from './utils.js'

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  activeTab: 'site' | 'page'
  onTabChange: (tab: 'site' | 'page') => void
  siteFeedback: FeedbackItem[]
  pageFeedback: FeedbackItem[]
  comment: string
  onCommentChange: (value: string) => void
  commentError: boolean
  sentiment: FeedtackSentiment
  onSentimentChange: (value: FeedtackSentiment) => void
  submitting: boolean
  onSubmit: () => void
  onPlacePin: () => void
  replyBody: string
  onReplyBodyChange: (value: string) => void
  onReply: (feedbackId: string) => void
  onResolve: (feedbackId: string) => void
  onArchive: (feedbackId: string) => void
  openThreadId: string | null
  onOpenThread: (id: string | null) => void
}

export function FeedbackModal({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  siteFeedback,
  pageFeedback,
  comment,
  onCommentChange,
  commentError,
  sentiment,
  onSentimentChange,
  submitting,
  onSubmit,
  onPlacePin,
  replyBody,
  onReplyBodyChange,
  onReply,
  onResolve,
  onArchive,
  openThreadId,
  onOpenThread,
}: FeedbackModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  // Sync the native dialog open state with the isOpen prop
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isOpen && !dialog.open) {
      dialog.showModal()
    } else if (!isOpen && dialog.open) {
      dialog.close()
    }
  }, [isOpen])

  // Handle native cancel event (Escape key) — delegates to onClose
  const handleCancel = useCallback(
    (e: React.SyntheticEvent) => {
      e.preventDefault()
      onClose()
    },
    [onClose],
  )

  // Close on backdrop click: when the click target is the <dialog> itself
  // (not its children), it means the user clicked the backdrop
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (e.target === dialogRef.current) {
        onClose()
      }
    },
    [onClose],
  )

  if (!isOpen) return null

  const threads = activeTab === 'site' ? siteFeedback : pageFeedback
  const openItem = openThreadId
    ? threads.find((i) => i.payload.id === openThreadId)
    : null

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: native <dialog> handles keyboard via onCancel (Escape)
    <dialog
      ref={dialogRef}
      className="feedtack-modal"
      aria-label="Feedback"
      onCancel={handleCancel}
      onClick={handleBackdropClick}
    >
      <div className="feedtack-modal-header">
        <span className="feedtack-modal-title">Feedback</span>
        <button
          type="button"
          className="feedtack-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
      </div>

      <div className="feedtack-modal-tabs">
        <button
          type="button"
          className={cx('feedtack-modal-tab', activeTab === 'site' && 'active')}
          onClick={() => onTabChange('site')}
        >
          Site
          {siteFeedback.length > 0 && (
            <span className="feedtack-tab-count">{siteFeedback.length}</span>
          )}
        </button>
        <button
          type="button"
          className={cx('feedtack-modal-tab', activeTab === 'page' && 'active')}
          onClick={() => onTabChange('page')}
        >
          Page
          {pageFeedback.length > 0 && (
            <span className="feedtack-tab-count">{pageFeedback.length}</span>
          )}
        </button>
      </div>

      <div className="feedtack-modal-body">
        {openItem ? (
          <ThreadView
            item={openItem}
            replyBody={replyBody}
            onReplyBodyChange={onReplyBodyChange}
            onReply={() => onReply(openItem.payload.id)}
            onResolve={() => onResolve(openItem.payload.id)}
            onArchive={() => onArchive(openItem.payload.id)}
            onBack={() => onOpenThread(null)}
          />
        ) : (
          <>
            <ModalThreadList threads={threads} onOpenThread={onOpenThread} />
            <ModalComposeForm
              comment={comment}
              onCommentChange={onCommentChange}
              commentError={commentError}
              sentiment={sentiment}
              onSentimentChange={onSentimentChange}
              submitting={submitting}
              onSubmit={onSubmit}
            />
          </>
        )}
      </div>

      <div className="feedtack-modal-footer">
        <button
          type="button"
          className="feedtack-modal-pin-btn"
          onClick={onPlacePin}
        >
          Place a pin
        </button>
      </div>
    </dialog>
  )
}
