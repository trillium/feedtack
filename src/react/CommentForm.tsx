'use client'

import type { FeedtackSentiment } from '../types/payload.js'
import type {
  FeedtackClasses,
  FeedtackSentimentLabels,
} from './FeedtackProvider.js'
import { cx } from './utils.js'

interface CommentFormProps {
  comment: string
  commentError: boolean
  sentiment: FeedtackSentiment
  submitting: boolean
  formPos: Record<string, number | undefined>
  classes: FeedtackClasses
  sentimentLabels: FeedtackSentimentLabels
  onCommentChange: (value: string) => void
  onSentimentChange: (value: FeedtackSentiment) => void
  onSubmit: () => void
  onCancel: () => void
}

export function CommentForm({
  comment,
  commentError,
  sentiment,
  submitting,
  formPos,
  classes,
  sentimentLabels,
  onCommentChange,
  onSentimentChange,
  onSubmit,
  onCancel,
}: CommentFormProps) {
  return (
    <div
      className={cx('feedtack-form', classes.form)}
      style={{ position: 'fixed', ...formPos }}
    >
      <textarea
        className={commentError ? 'error' : ''}
        placeholder="What's the issue? (required)"
        value={comment}
        onChange={(e) => onCommentChange(e.target.value)}
        ref={(el) => el?.focus()}
      />
      {commentError && (
        <span className="feedtack-error-msg">Comment is required</span>
      )}
      <div className="feedtack-sentiment">
        <button
          type="button"
          className={sentiment === 'satisfied' ? 'selected' : ''}
          onClick={() =>
            onSentimentChange(sentiment === 'satisfied' ? null : 'satisfied')
          }
        >
          {sentimentLabels.satisfied ?? '😊 Satisfied'}
        </button>
        <button
          type="button"
          className={sentiment === 'dissatisfied' ? 'selected' : ''}
          onClick={() =>
            onSentimentChange(
              sentiment === 'dissatisfied' ? null : 'dissatisfied',
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
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          className="feedtack-btn-submit"
          onClick={onSubmit}
          disabled={submitting}
        >
          {submitting ? 'Sending…' : 'Submit'}
        </button>
      </div>
    </div>
  )
}
