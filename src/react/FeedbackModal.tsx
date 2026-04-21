'use client'

import type React from 'react'
import { useCallback, useEffect } from 'react'
import type { FeedtackSentiment } from '../types/payload.js'
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
  // Thread interaction
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
  // Escape to close
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose()
    },
    [onClose],
  )

  if (!isOpen) return null

  const threads = activeTab === 'site' ? siteFeedback : pageFeedback
  const openItem = openThreadId
    ? threads.find((i) => i.payload.id === openThreadId)
    : null

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: overlay click-to-dismiss is standard modal UX
    <div
      className="feedtack-modal-overlay"
      role="presentation"
      onClick={handleOverlayClick}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose()
      }}
    >
      <div
        className="feedtack-modal"
        role="dialog"
        aria-label="Feedback"
        aria-modal="true"
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
            className={cx(
              'feedtack-modal-tab',
              activeTab === 'site' && 'active',
            )}
            onClick={() => onTabChange('site')}
          >
            Site
            {siteFeedback.length > 0 && (
              <span className="feedtack-tab-count">{siteFeedback.length}</span>
            )}
          </button>
          <button
            type="button"
            className={cx(
              'feedtack-modal-tab',
              activeTab === 'page' && 'active',
            )}
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
              {threads.length > 0 && (
                <div className="feedtack-modal-threads">
                  {threads.map((item) => (
                    <button
                      type="button"
                      key={item.payload.id}
                      className="feedtack-modal-thread-item"
                      onClick={() => onOpenThread(item.payload.id)}
                    >
                      <span className="feedtack-thread-author">
                        {item.payload.submittedBy.name}
                      </span>
                      <span className="feedtack-thread-comment">
                        {item.payload.comment}
                      </span>
                      <span className="feedtack-thread-meta">
                        {item.replies.length > 0 &&
                          `${item.replies.length} ${item.replies.length === 1 ? 'reply' : 'replies'}`}
                        {item.resolutions.length > 0 && ' · resolved'}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              <div className="feedtack-modal-compose">
                <textarea
                  className={cx(
                    'feedtack-modal-textarea',
                    commentError && 'error',
                  )}
                  placeholder="What's on your mind? (required)"
                  value={comment}
                  onChange={(e) => onCommentChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault()
                      onSubmit()
                    }
                  }}
                  aria-invalid={commentError || undefined}
                />
                {commentError && (
                  <span className="feedtack-error-msg">
                    Comment is required
                  </span>
                )}
                <div className="feedtack-sentiment">
                  <button
                    type="button"
                    className={sentiment === 'good' ? 'selected' : ''}
                    onClick={() =>
                      onSentimentChange(sentiment === 'good' ? null : 'good')
                    }
                  >
                    Good
                  </button>
                  <button
                    type="button"
                    className={sentiment === 'bad' ? 'selected' : ''}
                    onClick={() =>
                      onSentimentChange(sentiment === 'bad' ? null : 'bad')
                    }
                  >
                    Bad
                  </button>
                </div>
                <button
                  type="button"
                  className="feedtack-btn-submit"
                  onClick={onSubmit}
                  disabled={submitting}
                >
                  {submitting ? 'Sending…' : 'Submit'}
                </button>
              </div>
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
      </div>
    </div>
  )
}
