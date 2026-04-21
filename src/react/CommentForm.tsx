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
      <label htmlFor="feedtack-comment" className="feedtack-sr-only">
        Feedback comment
      </label>
      <textarea
        id="feedtack-comment"
        className={commentError ? 'error' : ''}
        placeholder="What's the issue? (required)"
        value={comment}
        onChange={(e) => onCommentChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            onSubmit()
          }
        }}
        ref={(el) => el?.focus()}
        aria-describedby={commentError ? 'feedtack-comment-error' : undefined}
        aria-invalid={commentError || undefined}
      />
      {commentError && (
        <span id="feedtack-comment-error" className="feedtack-error-msg">
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
          {sentimentLabels.satisfied ?? 'Good'}
        </button>
        <button
          type="button"
          className={sentiment === 'bad' ? 'selected' : ''}
          onClick={() => onSentimentChange(sentiment === 'bad' ? null : 'bad')}
        >
          {sentimentLabels.dissatisfied ?? 'Bad'}
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
