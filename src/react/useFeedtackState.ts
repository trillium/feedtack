'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  getDeviceMeta,
  getPageMeta,
  getViewportMeta,
} from '../capture/index.js'
import type { FeedtackAdapter } from '../types/adapter.js'
import type {
  FeedbackItem,
  FeedtackPayload,
  FeedtackSentiment,
  FeedtackUser,
} from '../types/payload.js'
import { SCHEMA_VERSION } from '../types/payload.js'
import type { FeedtackTheme } from '../types/theme.js'
import { useFeedtackDom } from './useFeedtackDom.js'
import { usePinMode } from './usePinMode.js'
import { generateId } from './utils.js'

export interface UseFeedtackStateOpts {
  adapter: FeedtackAdapter
  currentUser: FeedtackUser
  hotkey: string
  theme?: FeedtackTheme
  onError?: (err: Error) => void
  disabled?: boolean
}

export function useFeedtackState({
  adapter,
  currentUser,
  hotkey,
  theme,
  onError,
  disabled,
}: UseFeedtackStateOpts) {
  useFeedtackDom(theme, disabled)

  const [pathname, setPathname] = useState(() => window.location.pathname)

  // Track SPA navigation (popstate + pushState/replaceState)
  useEffect(() => {
    const update = () => setPathname(window.location.pathname)
    const origPush = history.pushState.bind(history)
    const origReplace = history.replaceState.bind(history)
    history.pushState = (...args: Parameters<typeof history.pushState>) => {
      origPush(...args)
      update()
    }
    history.replaceState = (
      ...args: Parameters<typeof history.replaceState>
    ) => {
      origReplace(...args)
      update()
    }
    window.addEventListener('popstate', update)
    return () => {
      window.removeEventListener('popstate', update)
      history.pushState = origPush
      history.replaceState = origReplace
    }
  }, [])

  const [comment, setComment] = useState('')
  const [sentiment, setSentiment] = useState<FeedtackSentiment>(null)
  const [commentError, setCommentError] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([])
  const [loading, setLoading] = useState(true)
  const [openThreadId, setOpenThreadId] = useState<string | null>(null)
  const [replyBody, setReplyBody] = useState('')

  const resetForm = useCallback(() => {
    setComment('')
    setSentiment(null)
    setCommentError(false)
  }, [])

  const pinMode = usePinMode({
    hotkey,
    disabled,
    onDeactivate: () => {
      resetForm()
      setOpenThreadId(null)
    },
  })

  useEffect(() => {
    setLoading(true)
    adapter
      .loadFeedback({ pathname })
      .then(setFeedbackItems)
      .catch((err) => onError?.(err))
      .finally(() => setLoading(false))
  }, [adapter, onError, pathname])

  const updateItem = (id: string, fn: (item: FeedbackItem) => FeedbackItem) =>
    setFeedbackItems((prev) =>
      prev.map((i) => (i.payload.id === id ? fn(i) : i)),
    )

  const handleSubmit = async () => {
    if (!comment.trim()) {
      setCommentError(true)
      return
    }
    setSubmitting(true)
    const payload: FeedtackPayload = {
      schemaVersion: SCHEMA_VERSION,
      id: generateId(),
      timestamp: new Date().toISOString(),
      submittedBy: currentUser,
      comment: comment.trim(),
      sentiment,
      pins: pinMode.pendingPins.map((p, i) => ({ ...p, index: i + 1 })),
      page: getPageMeta(),
      viewport: getViewportMeta(),
      device: getDeviceMeta(),
    }
    try {
      await adapter.submit(payload)
      setFeedbackItems((prev) => [
        ...prev,
        { payload, replies: [], resolutions: [], archives: [] },
      ])
      pinMode.deactivate()
    } catch (err) {
      onError?.(err as Error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleReply = async (feedbackId: string) => {
    if (!replyBody.trim()) return
    const ts = new Date().toISOString()
    const body = replyBody.trim()
    try {
      await adapter.reply(feedbackId, {
        author: currentUser,
        body,
        timestamp: ts,
      })
      updateItem(feedbackId, (item) => ({
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
      }))
      setReplyBody('')
    } catch (err) {
      onError?.(err as Error)
    }
  }

  const handleResolve = async (feedbackId: string) => {
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
  }

  const handleArchive = async (feedbackId: string) => {
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
      setOpenThreadId(null)
    } catch (err) {
      onError?.(err as Error)
    }
  }

  return {
    ...pinMode,
    isPinModeActive: pinMode.isActive,
    activatePinMode: pinMode.activate,
    deactivatePinMode: pinMode.deactivate,
    comment,
    setComment,
    sentiment,
    setSentiment,
    commentError,
    setCommentError,
    submitting,
    pathname,
    feedbackItems,
    loading,
    openThreadId,
    setOpenThreadId,
    replyBody,
    setReplyBody,
    handleSubmit,
    handleReply,
    handleResolve,
    handleArchive,
    isArchivedForUser: (item: FeedbackItem) =>
      item.archives.some((a) => a.archivedBy.id === currentUser.id),
    hasUnread: (item: FeedbackItem) => item.replies.length > 0,
  }
}
