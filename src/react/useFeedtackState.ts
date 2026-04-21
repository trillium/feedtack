'use client'

import { useCallback, useEffect, useState } from 'react'
import type { FeedtackAdapter } from '../types/adapter.js'
import type {
  FeedbackItem,
  FeedtackSentiment,
  FeedtackUser,
} from '../types/payload.js'
import type { FeedtackTheme } from '../types/theme.js'
import { useFeedtackActions } from './useFeedtackActions.js'
import { useFeedtackDom } from './useFeedtackDom.js'
import type { FeedtackFlushEvent } from './useFeedtackFlush.js'
import { useFeedtackFlush } from './useFeedtackFlush.js'
import { usePinMode } from './usePinMode.js'

export interface UseFeedtackStateOpts {
  adapter: FeedtackAdapter
  currentUser: FeedtackUser
  hotkey: string
  theme?: FeedtackTheme
  onError?: (err: Error) => void
  disabled?: boolean
  /** Called with batched feedback when user leaves a page or goes idle */
  onFlush?: (event: FeedtackFlushEvent) => void
  /** Idle timeout before flushing (default 5 min) */
  flushIdleMs?: number
  /** Roles that trigger re-scope on reply (default: any non-'agent' role) */
  rescopeRoles?: string[]
}

export function useFeedtackState({
  adapter,
  currentUser,
  hotkey,
  theme,
  onError,
  disabled,
  onFlush,
  flushIdleMs,
  rescopeRoles,
}: UseFeedtackStateOpts) {
  useFeedtackDom(theme, disabled)

  const [pathname, setPathname] = useState(() =>
    typeof window === 'undefined' ? '/' : window.location.pathname,
  )

  // Track SPA navigation (popstate + pushState/replaceState)
  useEffect(() => {
    const update = () => setPathname(window.location.pathname)
    const origPush = history.pushState.bind(history)
    const origReplace = history.replaceState.bind(history)
    history.pushState = (...args: Parameters<typeof history.pushState>) => {
      origPush(...args)
      queueMicrotask(update)
    }
    history.replaceState = (
      ...args: Parameters<typeof history.replaceState>
    ) => {
      origReplace(...args)
      queueMicrotask(update)
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
    isModalOpen: openThreadId !== null,
    onDeactivate: () => {
      resetForm()
      setOpenThreadId(null)
    },
  })

  const { clearFlushed } = useFeedtackFlush({
    pathname,
    feedbackItems,
    onFlush,
    flushIdleMs,
    disabled,
  })

  useEffect(() => {
    setLoading(true)
    adapter
      .loadFeedback({ pathname })
      .then(setFeedbackItems)
      .catch((err) => onError?.(err))
      .finally(() => setLoading(false))
  }, [adapter, onError, pathname])

  const commentRef = () => comment
  const sentimentRef = () => sentiment
  const pinsRef = () => pinMode.pendingPins
  const replyRef = () => replyBody
  const pathRef = () => pathname

  const actions = useFeedtackActions({
    adapter,
    currentUser,
    onError,
    getComment: commentRef,
    getSentiment: sentimentRef,
    getPendingPins: pinsRef,
    getReplyBody: replyRef,
    getPathname: pathRef,
    setCommentError,
    setSubmitting,
    setFeedbackItems,
    setReplyBody,
    setOpenThreadId,
    deactivatePinMode: pinMode.deactivate,
    clearFlushed,
    shouldRescope: rescopeRoles
      ? (role) => rescopeRoles.includes(role)
      : undefined,
    hasFlush: !!onFlush,
  })

  const isArchivedForUser = (item: FeedbackItem) =>
    item.archives.some((a) => a.archivedBy.id === currentUser.id)
  const hasUnread = (item: FeedbackItem) => item.replies.length > 0
  const hasValidPins = (item: FeedbackItem) =>
    Array.isArray(item.payload?.pins) && item.payload.pins.length > 0

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
    ...actions,
    isArchivedForUser,
    hasUnread,
    hasValidPins,
  }
}
