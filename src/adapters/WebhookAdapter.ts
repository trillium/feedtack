import type { FeedtackAdapter } from '../types/adapter.js'
import type { FeedbackItem, FeedtackFilter, FeedtackPayload, FeedtackReply, FeedtackResolution } from '../types/payload.js'

export interface WebhookAdapterConfig {
  /** URL to POST new feedback payloads to */
  submitUrl: string
  /** URL to POST reply/resolve/archive state updates to */
  updateUrl?: string
  /** Required: async function that returns persisted feedback items */
  loadFeedback: (filter?: FeedtackFilter) => Promise<FeedbackItem[]>
}

/** Production adapter — POSTs feedback as JSON to a webhook endpoint */
export class WebhookAdapter implements FeedtackAdapter {
  private config: WebhookAdapterConfig

  constructor(config: WebhookAdapterConfig) {
    this.config = config
  }

  private async post(url: string, body: unknown): Promise<void> {
    let response: Response
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    } catch (err) {
      throw new Error(`[feedtack] Network error: ${(err as Error).message}`)
    }

    if (!response.ok) {
      throw new Error(`[feedtack] Webhook responded with ${response.status}`)
    }
  }

  async submit(payload: FeedtackPayload): Promise<void> {
    await this.post(this.config.submitUrl, payload)
  }

  async reply(feedbackId: string, reply: Omit<FeedtackReply, 'id' | 'feedbackId'>): Promise<void> {
    const url = this.config.updateUrl ?? this.config.submitUrl
    await this.post(url, { type: 'reply', feedbackId, ...reply })
  }

  async resolve(feedbackId: string, resolution: Omit<FeedtackResolution, 'feedbackId'>): Promise<void> {
    const url = this.config.updateUrl ?? this.config.submitUrl
    await this.post(url, { type: 'resolve', feedbackId, ...resolution })
  }

  async archive(feedbackId: string, userId: string): Promise<void> {
    const url = this.config.updateUrl ?? this.config.submitUrl
    await this.post(url, { type: 'archive', feedbackId, userId })
  }

  async loadFeedback(filter?: FeedtackFilter): Promise<FeedbackItem[]> {
    return this.config.loadFeedback(filter)
  }
}
