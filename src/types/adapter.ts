import type { FeedbackItem, FeedtackFilter, FeedtackPayload, FeedtackReply, FeedtackResolution } from './payload.js'

/** Plugin contract — implement this interface to create a custom feedtack backend */
export interface FeedtackAdapter {
  /** Submit new feedback payload */
  submit(payload: FeedtackPayload): Promise<void>
  /** Post a reply to an existing feedback item */
  reply(feedbackId: string, reply: Omit<FeedtackReply, 'id' | 'feedbackId'>): Promise<void>
  /** Mark a feedback item as resolved */
  resolve(feedbackId: string, resolution: Omit<FeedtackResolution, 'feedbackId'>): Promise<void>
  /** Archive a feedback item for a specific user */
  archive(feedbackId: string, userId: string): Promise<void>
  /** Load persisted feedback items, optionally filtered */
  loadFeedback(filter?: FeedtackFilter): Promise<FeedbackItem[]>
}
