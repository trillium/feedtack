'use client'

import type { FeedbackItem } from '../types/payload.js'
import { cx, getAnchoredPosition } from './utils.js'

interface ThreadPanelProps {
  item: FeedbackItem
  replyBody: string
  onReplyBodyChange: (value: string) => void
  onReply: () => void
  onResolve: () => void
  onArchive: () => void
  onClose: () => void
  className?: string
}

export function ThreadPanel({
  item,
  replyBody,
  onReplyBodyChange,
  onReply,
  onResolve,
  onArchive,
  onClose,
  className,
}: ThreadPanelProps) {
  const pin = item.payload?.pins?.[0]
  if (!pin) return null
  const pos = getAnchoredPosition(pin.x, pin.y)

  return (
    <div
      className={cx('feedtack-thread', className)}
      style={{ position: 'fixed', ...pos }}
    >
      <strong style={{ fontSize: 13 }}>{item.payload.submittedBy.name}</strong>
      <p style={{ fontSize: 13 }}>{item.payload.comment}</p>

      {item.replies.map((r) => (
        <div
          key={r.id}
          style={{ borderTop: '1px solid var(--ft-border)', paddingTop: 8 }}
        >
          <span style={{ fontSize: 12, fontWeight: 600 }}>{r.author.name}</span>
          <p style={{ fontSize: 12 }}>{r.body}</p>
        </div>
      ))}

      <textarea
        placeholder="Reply…"
        value={replyBody}
        onChange={(e) => onReplyBodyChange(e.target.value)}
        style={{
          width: '100%',
          fontSize: 12,
          padding: 6,
          borderRadius: 6,
          border: '1px solid var(--ft-border)',
          marginTop: 4,
        }}
      />

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <button
          type="button"
          className="feedtack-btn-submit"
          style={{ fontSize: 12, padding: '4px 10px' }}
          onClick={onReply}
        >
          Reply
        </button>
        <button
          type="button"
          className="feedtack-btn-cancel"
          style={{ fontSize: 12 }}
          onClick={onResolve}
        >
          Mark Resolved
        </button>
        <button
          type="button"
          className="feedtack-btn-cancel"
          style={{ fontSize: 12 }}
          onClick={onArchive}
        >
          Archive
        </button>
        <button
          type="button"
          className="feedtack-btn-cancel"
          style={{ fontSize: 12 }}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  )
}
