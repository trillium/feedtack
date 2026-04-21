import type { FeedtackAdapter } from '../types/adapter.js'
import type {
  FeedbackItem,
  FeedtackFilter,
  FeedtackPayload,
  FeedtackReply,
  FeedtackResolution,
} from '../types/payload.js'

export interface LocalStorageAdapterConfig {
  /** localStorage key. Default: 'feedtack' */
  key?: string
}

/** Zero-infrastructure adapter — persists feedback to localStorage */
export class LocalStorageAdapter implements FeedtackAdapter {
  private key: string

  constructor(config: LocalStorageAdapterConfig = {}) {
    this.key = config.key ?? 'feedtack'
  }

  private read(): FeedbackItem[] {
    try {
      const raw = localStorage.getItem(this.key)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }

  private write(items: FeedbackItem[]): void {
    localStorage.setItem(this.key, JSON.stringify(items))
  }

  async submit(payload: FeedtackPayload): Promise<void> {
    const items = this.read()
    items.push({ payload, replies: [], resolutions: [], archives: [] })
    this.write(items)
  }

  async reply(
    feedbackId: string,
    reply: Omit<FeedtackReply, 'id' | 'feedbackId'>,
  ): Promise<void> {
    const items = this.read()
    const item = items.find((i) => i.payload.id === feedbackId)
    if (!item) return
    item.replies.push({
      id: `r_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
      feedbackId,
      ...reply,
    })
    this.write(items)
  }

  async resolve(
    feedbackId: string,
    resolution: Omit<FeedtackResolution, 'feedbackId'>,
  ): Promise<void> {
    const items = this.read()
    const item = items.find((i) => i.payload.id === feedbackId)
    if (!item) return
    item.resolutions.push({ feedbackId, ...resolution })
    this.write(items)
  }

  async archive(feedbackId: string, userId: string): Promise<void> {
    const items = this.read()
    const item = items.find((i) => i.payload.id === feedbackId)
    if (!item) return
    item.archives.push({
      feedbackId,
      archivedBy: { id: userId, name: '', role: '' },
      timestamp: new Date().toISOString(),
    })
    this.write(items)
  }

  async loadFeedback(filter?: FeedtackFilter): Promise<FeedbackItem[]> {
    const items = this.read()
    if (!filter) return items
    return items.filter((item) => {
      if (filter.scope && item.payload.scope !== filter.scope) return false
      if (filter.pathname && item.payload.page.pathname !== filter.pathname)
        return false
      if (filter.url && item.payload.page.url !== filter.url) return false
      if (filter.userId && item.payload.submittedBy.id !== filter.userId)
        return false
      return true
    })
  }
}
