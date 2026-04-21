'use client'

import { useCallback } from 'react'
import {
  getDeviceMeta,
  getPageMeta,
  getViewportMeta,
} from '../capture/index.js'
import type { FeedtackAdapter } from '../types/adapter.js'
import type {
  FeedbackItem,
  FeedtackPayload,
  FeedtackPin,
  FeedtackSentiment,
  FeedtackUser,
} from '../types/payload.js'
import { SCHEMA_VERSION } from '../types/payload.js'
import { generateId } from './utils.js'

export interface FeedtackActionDeps {
  adapter: FeedtackAdapter
  currentUser: FeedtackUser
  onError?: (err: Error) => void
  /** Current form state readers */
  getComment: () => string
  getSentiment: () => FeedtackSentiment
  getPendingPins: () => Array<Omit<FeedtackPin, 'index'>>
  getReplyBody: () => string
  getPathname: () => string
  /** State setters */
  setCommentError: (v: boolean) => void
  setSubmitting: (v: boolean) => void
  setFeedbackItems: React.Dispatch<React.SetStateAction<FeedbackItem[]>>
  setReplyBody: (v: string) => void
  setOpenThreadId: (v: string | null) => void
  deactivatePinMode: () => void
  /** Flush/re-scope support */
  clearFlushed?: (path: string) => void
  shouldRescope?: (role: string) => boolean
  hasFlush?: boolean
}

export function useFeedtackActions(deps: FeedtackActionDeps) {
  const { adapter, currentUser, onError } = deps

  const updateItem = useCallback(
    (id: string, fn: (item: FeedbackItem) => FeedbackItem) =>
      deps.setFeedbackItems((prev) =>
        prev.map((i) => (i.payload.id === id ? fn(i) : i)),
      ),
    [deps.setFeedbackItems],
  )

  const handleSubmit = useCallback(async () => {
    const comment = deps.getComment()
    if (!comment.trim()) {
      deps.setCommentError(true)
      return
    }
    deps.setSubmitting(true)
    const payload: FeedtackPayload = {
      schemaVersion: SCHEMA_VERSION,
      id: generateId(),
      timestamp: new Date().toISOString(),
      submittedBy: currentUser,
      comment: comment.trim(),
      sentiment: deps.getSentiment(),
      pins: deps.getPendingPins().map((p, i) => ({ ...p, index: i + 1 })),
      page: getPageMeta(),
      viewport: getViewportMeta(),
      device: getDeviceMeta(),
    }
    try {
      await adapter.submit(payload)
      deps.setFeedbackItems((prev) => [
        ...prev,
        { payload, replies: [], resolutions: [], archives: [] },
      ])
      deps.deactivatePinMode()
    } catch (err) {
      onError?.(err as Error)
    } finally {
      deps.setSubmitting(false)
    }
  }, [adapter, currentUser, onError, deps])

  const handleReply = useCallback(
    async (feedbackId: string) => {
      const body = deps.getReplyBody().trim()
      if (!body) return
      const ts = new Date().toISOString()
      try {
        await adapter.reply(feedbackId, {
          author: currentUser,
          body,
          timestamp: ts,
        })
        updateItem(feedbackId, (item) => {
          const updated = {
            ...item,
            replies: [
              ...item.replies,
              {
                id: generateId(),
                feedbackId,
                author: currentUser,
                body,
                timestamp: ts,
              },
            ],
          }
          const rescope =
            deps.shouldRescope?.(currentUser.role) ??
            currentUser.role !== 'agent'
          if (rescope && updated.resolutions.length === 0 && deps.hasFlush) {
            deps.clearFlushed?.(deps.getPathname())
          }
          return updated
        })
        deps.setReplyBody('')
      } catch (err) {
        onError?.(err as Error)
      }
    },
    [adapter, currentUser, onError, updateItem, deps],
  )

  const handleResolve = useCallback(
    async (feedbackId: string) => {
      const ts = new Date().toISOString()
      try {
        await adapter.resolve(feedbackId, {
          resolvedBy: currentUser,
          timestamp: ts,
        })
        updateItem(feedbackId, (item) => ({
          ...item,
          resolutions: [
            ...item.resolutions,
            { feedbackId, resolvedBy: currentUser, timestamp: ts },
          ],
        }))
      } catch (err) {
        onError?.(err as Error)
      }
    },
    [adapter, currentUser, onError, updateItem],
  )

  const handleArchive = useCallback(
    async (feedbackId: string) => {
      const ts = new Date().toISOString()
      try {
        await adapter.archive(feedbackId, currentUser.id)
        updateItem(feedbackId, (item) => ({
          ...item,
          archives: [
            ...item.archives,
            { feedbackId, archivedBy: currentUser, timestamp: ts },
          ],
        }))
        deps.setOpenThreadId(null)
      } catch (err) {
        onError?.(err as Error)
      }
    },
    [adapter, currentUser, onError, updateItem, deps],
  )

  return { handleSubmit, handleReply, handleResolve, handleArchive }
}
