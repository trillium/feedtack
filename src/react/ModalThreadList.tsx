'use client'

import type { FeedbackItem } from '../types/payload.js'

interface ModalThreadListProps {
  threads: FeedbackItem[]
  onOpenThread: (id: string) => void
}

export function ModalThreadList({
  threads,
  onOpenThread,
}: ModalThreadListProps) {
  if (threads.length === 0) return null

  return (
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
  )
}
