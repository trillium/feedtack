import type {
  ContentAdapter,
  ContentEditAdapter,
  FeedtackAdapter,
} from '../types/adapter.js'
import type {
  FeedbackItem,
  FeedtackFilter,
  FeedtackPayload,
  FeedtackReply,
  FeedtackResolution,
  FieldApproval,
  FieldApprovalState,
  FieldFilter,
} from '../types/payload.js'

export interface WebhookAdapterConfig {
  /** URL to POST new feedback payloads to */
  submitUrl: string
  /** URL to POST reply/resolve/archive state updates to */
  updateUrl?: string
  /** Required: async function that returns persisted feedback items */
  loadFeedback: (filter?: FeedtackFilter) => Promise<FeedbackItem[]>
  /** Optional: async function that returns stored field approvals */
  loadApprovals?: (filter?: FieldFilter) => Promise<FieldApprovalState[]>
  /** Optional: async function that returns all stored field values for hydration */
  loadFields?: () => Promise<Record<string, string>>
}

/** Production adapter — POSTs feedback as JSON to a webhook endpoint */
export class WebhookAdapter
  implements FeedtackAdapter, ContentAdapter, ContentEditAdapter
{
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

  async reply(
    feedbackId: string,
    reply: Omit<FeedtackReply, 'id' | 'feedbackId'>,
  ): Promise<void> {
    const url = this.config.updateUrl ?? this.config.submitUrl
    await this.post(url, { type: 'reply', feedbackId, ...reply })
  }

  async resolve(
    feedbackId: string,
    resolution: Omit<FeedtackResolution, 'feedbackId'>,
  ): Promise<void> {
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

  // ContentAdapter implementation

  async approve(fieldPath: string, approval: FieldApproval): Promise<void> {
    const url = this.config.updateUrl ?? this.config.submitUrl
    await this.post(url, { type: 'approve', fieldPath, ...approval })
  }

  async revokeApproval(fieldPath: string, userId: string): Promise<void> {
    const url = this.config.updateUrl ?? this.config.submitUrl
    await this.post(url, { type: 'revoke', fieldPath, userId })
  }

  async loadApprovals(filter?: FieldFilter): Promise<FieldApprovalState[]> {
    if (this.config.loadApprovals) {
      return this.config.loadApprovals(filter)
    }
    return []
  }

  // ContentEditAdapter implementation

  async loadFields(): Promise<Record<string, string>> {
    if (this.config.loadFields) {
      return this.config.loadFields()
    }
    return {}
  }

  async saveField(fieldPath: string, value: string): Promise<void> {
    const url = this.config.updateUrl ?? this.config.submitUrl
    await this.post(url, {
      type: 'save-field',
      fieldPath,
      value,
      clearApproval: true,
    })
  }
}
