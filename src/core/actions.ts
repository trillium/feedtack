import {
  getDeviceMeta,
  getPageMeta,
  getViewportMeta,
} from '../capture/index.js'
import type { FeedtackAdapter } from '../types/adapter.js'
import type {
  FeedbackItem,
  FeedtackPayload,
  FeedtackUser,
} from '../types/payload.js'
import { SCHEMA_VERSION } from '../types/payload.js'
import type { FlushController } from './flush.js'
import type { FeedtackEngineState } from './types.js'
import { generateId } from './types.js'

export interface ActionContext {
  adapter: FeedtackAdapter
  currentUser: FeedtackUser
  onError?: (err: Error) => void
  rescopeRoles?: string[]
  getState: () => FeedtackEngineState
  setState: (partial: Partial<FeedtackEngineState>) => void
  getCurrentScope: () => 'element' | 'site' | 'page'
  deactivatePinMode: () => void
  flushCtrl: FlushController | null
}

function updateItem(
  ctx: ActionContext,
  id: string,
  fn: (item: FeedbackItem) => FeedbackItem,
): void {
  ctx.setState({
    feedbackItems: ctx
      .getState()
      .feedbackItems.map((i) => (i.payload.id === id ? fn(i) : i)),
  })
}

export async function handleSubmit(ctx: ActionContext): Promise<void> {
  const s = ctx.getState()
  if (!s.comment.trim()) {
    ctx.setState({ commentError: true })
    return
  }
  ctx.setState({ submitting: true })
  const payload: FeedtackPayload = {
    schemaVersion: SCHEMA_VERSION,
    id: generateId(),
    timestamp: new Date().toISOString(),
    scope: ctx.getCurrentScope(),
    submittedBy: ctx.currentUser,
    comment: s.comment.trim(),
    sentiment: s.sentiment,
    pins: s.pendingPins.map((p, i) => ({ ...p, index: i + 1 })),
    page: getPageMeta(),
    viewport: getViewportMeta(),
    device: getDeviceMeta(),
  }
  try {
    await ctx.adapter.submit(payload)
    ctx.setState({
      feedbackItems: [
        ...ctx.getState().feedbackItems,
        { payload, replies: [], resolutions: [], archives: [] },
      ],
    })
    ctx.deactivatePinMode()
  } catch (err) {
    ctx.onError?.(err as Error)
  } finally {
    ctx.setState({ submitting: false })
  }
}

export async function handleModalSubmit(ctx: ActionContext): Promise<void> {
  if (!ctx.getState().comment.trim()) {
    ctx.setState({ commentError: true })
    return
  }
  const scope = ctx.getState().composeScope
  await handleSubmit(ctx)
  const items = ctx.getState().feedbackItems
  const newItem = items[items.length - 1]
  if (newItem && newItem.payload.scope === scope) {
    const key = scope === 'site' ? 'siteFeedback' : 'pageFeedback'
    ctx.setState({
      [key]: [...ctx.getState()[key], newItem],
      feedbackItems: items.slice(0, -1),
    })
  }
  ctx.setState({
    comment: '',
    sentiment: null,
    commentError: false,
    isModalOpen: false,
  })
}

export async function handleReply(
  ctx: ActionContext,
  feedbackId: string,
): Promise<void> {
  const body = ctx.getState().replyBody.trim()
  if (!body) return
  const ts = new Date().toISOString()
  try {
    await ctx.adapter.reply(feedbackId, {
      author: ctx.currentUser,
      body,
      timestamp: ts,
    })
    updateItem(ctx, feedbackId, (item) => {
      const updated = {
        ...item,
        replies: [
          ...item.replies,
          {
            id: generateId(),
            feedbackId,
            author: ctx.currentUser,
            body,
            timestamp: ts,
          },
        ],
      }
      const rescope = ctx.rescopeRoles
        ? ctx.rescopeRoles.includes(ctx.currentUser.role)
        : ctx.currentUser.role !== 'agent'
      if (rescope && updated.resolutions.length === 0 && ctx.flushCtrl) {
        ctx.flushCtrl.clearFlushed(ctx.getState().pathname)
      }
      return updated
    })
    ctx.setState({ replyBody: '' })
  } catch (err) {
    ctx.onError?.(err as Error)
  }
}

export async function handleResolve(
  ctx: ActionContext,
  feedbackId: string,
): Promise<void> {
  const ts = new Date().toISOString()
  try {
    await ctx.adapter.resolve(feedbackId, {
      resolvedBy: ctx.currentUser,
      timestamp: ts,
    })
    updateItem(ctx, feedbackId, (item) => ({
      ...item,
      resolutions: [
        ...item.resolutions,
        { feedbackId, resolvedBy: ctx.currentUser, timestamp: ts },
      ],
    }))
  } catch (err) {
    ctx.onError?.(err as Error)
  }
}

export async function handleArchive(
  ctx: ActionContext,
  feedbackId: string,
): Promise<void> {
  const ts = new Date().toISOString()
  try {
    await ctx.adapter.archive(feedbackId, ctx.currentUser.id)
    updateItem(ctx, feedbackId, (item) => ({
      ...item,
      archives: [
        ...item.archives,
        { feedbackId, archivedBy: ctx.currentUser, timestamp: ts },
      ],
    }))
    ctx.setState({ openThreadId: null })
  } catch (err) {
    ctx.onError?.(err as Error)
  }
}

export function loadFeedback(ctx: ActionContext): void {
  ctx.setState({ loading: true })
  ctx.adapter
    .loadFeedback({ pathname: ctx.getState().pathname })
    .then((items) => {
      const feedbackItems: FeedbackItem[] = []
      const siteFeedback: FeedbackItem[] = []
      const pageFeedback: FeedbackItem[] = []
      for (const item of items) {
        if (item.payload.scope === 'site') siteFeedback.push(item)
        else if (item.payload.scope === 'page') pageFeedback.push(item)
        else feedbackItems.push(item)
      }
      ctx.setState({ feedbackItems, siteFeedback, pageFeedback })
    })
    .catch((err) => ctx.onError?.(err as Error))
    .finally(() => ctx.setState({ loading: false }))
}
