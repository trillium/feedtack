'use client'

import type { FeedtackSentiment } from '../types/payload.js'
import { cx } from './utils.js'

interface ModalComposeFormProps {
  comment: string
  onCommentChange: (value: string) => void
  commentError: boolean
  sentiment: FeedtackSentiment
  onSentimentChange: (value: FeedtackSentiment) => void
  submitting: boolean
  onSubmit: () => void
}

export function ModalComposeForm({
  comment,
  onCommentChange,
  commentError,
  sentiment,
  onSentimentChange,
  submitting,
  onSubmit,
}: ModalComposeFormProps) {
  return (
    <div className="feedtack-modal-compose">
      <textarea
        className={cx('feedtack-modal-textarea', commentError && 'error')}
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
        <span className="feedtack-error-msg">Comment is required</span>
      )}
      <div className="feedtack-sentiment">
        <button
          type="button"
          className={cx(
            'feedtack-sentiment-btn',
            sentiment === 'good' && 'selected',
          )}
          onClick={() =>
            onSentimentChange(sentiment === 'good' ? null : 'good')
          }
        >
          Good
        </button>
        <button
          type="button"
          className={cx(
            'feedtack-sentiment-btn',
            sentiment === 'bad' && 'selected',
          )}
          onClick={() => onSentimentChange(sentiment === 'bad' ? null : 'bad')}
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
  )
}
