'use client'

import type { FeedbackItem } from '../types/payload.js'

export function ThreadView({
  item,
  replyBody,
  onReplyBodyChange,
  onReply,
  onResolve,
  onArchive,
  onBack,
}: {
  item: FeedbackItem
  replyBody: string
  onReplyBodyChange: (value: string) => void
  onReply: () => void
  onResolve: () => void
  onArchive: () => void
  onBack: () => void
}) {
  return (
    <div className="feedtack-modal-thread-view">
      <button type="button" className="feedtack-modal-back" onClick={onBack}>
        &larr; Back
      </button>

      <div className="feedtack-modal-thread-content">
        <strong>{item.payload.submittedBy.name}</strong>
        <p>{item.payload.comment}</p>
      </div>

      {item.replies.map((r) => (
        <div key={r.id} className="feedtack-modal-reply">
          <span className="feedtack-reply-author">{r.author.name}</span>
          <p>{r.body}</p>
        </div>
      ))}

      <textarea
        className="feedtack-modal-textarea"
        placeholder="Reply…"
        value={replyBody}
        onChange={(e) => onReplyBodyChange(e.target.value)}
      />

      <div className="feedtack-modal-actions">
        <button type="button" className="feedtack-btn-submit" onClick={onReply}>
          Reply
        </button>
        <button
          type="button"
          className="feedtack-btn-cancel"
          onClick={onResolve}
        >
          Resolve
        </button>
        <button
          type="button"
          className="feedtack-btn-cancel"
          onClick={onArchive}
        >
          Archive
        </button>
      </div>
    </div>
  )
}
