import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

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

export interface DiskAdapterConfig {
  /** Directory to store JSON files in. Default: '.feedback' */
  directory?: string
}

/** Node.js adapter — persists each feedback item as a JSON file on disk */
export class DiskAdapter
  implements FeedtackAdapter, ContentAdapter, ContentEditAdapter
{
  private dir: string
  private approvalsDir: string
  private fieldsDir: string

  constructor(config: DiskAdapterConfig = {}) {
    this.dir = config.directory ?? '.feedback'
    this.approvalsDir = join(this.dir, 'approvals')
    this.fieldsDir = join(this.dir, 'fields')
  }

  async submit(payload: FeedtackPayload): Promise<void> {
    await mkdir(this.dir, { recursive: true })
    const item: FeedbackItem = {
      payload,
      replies: [],
      resolutions: [],
      archives: [],
    }
    await this.write(payload.id, item)
  }

  async reply(
    feedbackId: string,
    reply: Omit<FeedtackReply, 'id' | 'feedbackId'>,
  ): Promise<void> {
    const item = await this.read(feedbackId)
    item.replies.push({
      id: `r_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
      feedbackId,
      ...reply,
    })
    await this.write(feedbackId, item)
  }

  async resolve(
    feedbackId: string,
    resolution: Omit<FeedtackResolution, 'feedbackId'>,
  ): Promise<void> {
    const item = await this.read(feedbackId)
    item.resolutions.push({ feedbackId, ...resolution })
    await this.write(feedbackId, item)
  }

  async archive(feedbackId: string, userId: string): Promise<void> {
    const item = await this.read(feedbackId)
    item.archives.push({
      feedbackId,
      archivedBy: { id: userId, name: '', role: '' },
      timestamp: new Date().toISOString(),
    })
    await this.write(feedbackId, item)
  }

  async loadFeedback(filter?: FeedtackFilter): Promise<FeedbackItem[]> {
    let files: string[]
    try {
      await mkdir(this.dir, { recursive: true })
      files = (await readdir(this.dir)).filter((f) => f.endsWith('.json'))
    } catch {
      return []
    }

    const items = await Promise.all(
      files.map(
        async (f) =>
          JSON.parse(
            await readFile(join(this.dir, f), 'utf-8'),
          ) as FeedbackItem,
      ),
    )

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

  // ContentAdapter implementation

  async approve(fieldPath: string, approval: FieldApproval): Promise<void> {
    await mkdir(this.approvalsDir, { recursive: true })
    const safeName = fieldPath.replace(/[^a-zA-Z0-9._-]/g, '_')
    await writeFile(
      join(this.approvalsDir, `${safeName}.json`),
      JSON.stringify(approval, null, 2),
    )
  }

  async revokeApproval(fieldPath: string, userId: string): Promise<void> {
    await mkdir(this.approvalsDir, { recursive: true })
    const safeName = fieldPath.replace(/[^a-zA-Z0-9._-]/g, '_')
    const filePath = join(this.approvalsDir, `${safeName}.json`)
    let approval: FieldApproval
    try {
      approval = JSON.parse(await readFile(filePath, 'utf-8')) as FieldApproval
    } catch {
      return
    }
    approval.by = approval.by.filter((id) => id !== userId)
    if (approval.by.length === 0) {
      const { unlink } = await import('node:fs/promises')
      await unlink(filePath).catch(() => {})
    } else {
      await writeFile(filePath, JSON.stringify(approval, null, 2))
    }
  }

  async loadApprovals(filter?: FieldFilter): Promise<FieldApprovalState[]> {
    let files: string[]
    try {
      await mkdir(this.approvalsDir, { recursive: true })
      files = (await readdir(this.approvalsDir)).filter((f) =>
        f.endsWith('.json'),
      )
    } catch {
      return []
    }

    const states = await Promise.all(
      files.map(async (f) => {
        const fieldPath = f.replace(/\.json$/, '').replace(/_/g, '.')
        const approval = JSON.parse(
          await readFile(join(this.approvalsDir, f), 'utf-8'),
        ) as FieldApproval
        return {
          fieldPath,
          approval,
          stale: false,
        } satisfies FieldApprovalState
      }),
    )

    if (!filter) return states
    return states.filter((s) => {
      if (filter.fieldPath && s.fieldPath !== filter.fieldPath) return false
      return true
    })
  }

  // ContentEditAdapter implementation

  async loadFields(): Promise<Record<string, string>> {
    let files: string[]
    try {
      await mkdir(this.fieldsDir, { recursive: true })
      files = (await readdir(this.fieldsDir)).filter((f) => f.endsWith('.json'))
    } catch {
      return {}
    }

    const entries = await Promise.all(
      files.map(async (f) => {
        const fieldPath = f.replace(/\.json$/, '').replace(/_/g, '.')
        const value = JSON.parse(
          await readFile(join(this.fieldsDir, f), 'utf-8'),
        ) as string
        return [fieldPath, value] as const
      }),
    )

    return Object.fromEntries(entries)
  }

  async saveField(fieldPath: string, value: string): Promise<void> {
    const safeName = fieldPath.replace(/[^a-zA-Z0-9._-]/g, '_')
    await mkdir(this.fieldsDir, { recursive: true })
    await writeFile(
      join(this.fieldsDir, `${safeName}.json`),
      JSON.stringify(value, null, 2),
    )
    // Atomically clear approval for this field
    const approvalPath = join(this.approvalsDir, `${safeName}.json`)
    const { unlink } = await import('node:fs/promises')
    await unlink(approvalPath).catch(() => {})
  }

  private async read(id: string): Promise<FeedbackItem> {
    return JSON.parse(
      await readFile(join(this.dir, `${id}.json`), 'utf-8'),
    ) as FeedbackItem
  }

  private async write(id: string, item: FeedbackItem): Promise<void> {
    await writeFile(join(this.dir, `${id}.json`), JSON.stringify(item, null, 2))
  }
}
