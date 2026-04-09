import type { FeedtackAdapter } from '../types/adapter.js'
import type { FeedbackItem, FeedtackFilter, FeedtackPayload, FeedtackReply, FeedtackResolution } from '../types/payload.js'

/** Development adapter — logs all operations to the browser console */
export class ConsoleAdapter implements FeedtackAdapter {
  async submit(payload: FeedtackPayload): Promise<void> {
    console.log('[feedtack] submit', payload)
  }

  async reply(feedbackId: string, reply: Omit<FeedtackReply, 'id' | 'feedbackId'>): Promise<void> {
    console.log('[feedtack] reply', { feedbackId, reply })
  }

  async resolve(feedbackId: string, resolution: Omit<FeedtackResolution, 'feedbackId'>): Promise<void> {
    console.log('[feedtack] resolve', { feedbackId, resolution })
  }

  async archive(feedbackId: string, userId: string): Promise<void> {
    console.log('[feedtack] archive', { feedbackId, userId })
  }

  async loadFeedback(_filter?: FeedtackFilter): Promise<FeedbackItem[]> {
    console.log('[feedtack] loadFeedback — ConsoleAdapter returns empty array')
    return []
  }
}
