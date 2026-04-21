'use client'

import { useCallback, useEffect, useState } from 'react'
import type { FeedtackAdapter } from '../types/adapter.js'
import type {
  FeedbackItem,
  FeedtackScope,
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

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [composeScope, setComposeScope] = useState<'site' | 'page'>('site')

  // Site/page scoped feedback loaded separately
  const [siteFeedback, setSiteFeedback] = useState<FeedbackItem[]>([])
  const [pageFeedback, setPageFeedback] = useState<FeedbackItem[]>([])

  const openModal = useCallback(() => setIsModalOpen(true), [])
  const closeModal = useCallback(() => setIsModalOpen(false), [])

  const resetForm = useCallback(() => {
    setComment('')
    setSentiment(null)
    setCommentError(false)
  }, [])

  const pinMode = usePinMode({
    hotkey,
    disabled,
    isModalOpen: openThreadId !== null || isModalOpen,
    onHotkey: openModal,
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

  // Load element-scoped feedback (existing behavior)
  useEffect(() => {
    setLoading(true)
    adapter
      .loadFeedback({ pathname })
      .then((items) => {
        const elementItems: FeedbackItem[] = []
        const siteItems: FeedbackItem[] = []
        const pageItems: FeedbackItem[] = []
        for (const item of items) {
          if (item.payload.scope === 'site') siteItems.push(item)
          else if (item.payload.scope === 'page') pageItems.push(item)
          else elementItems.push(item)
        }
        setFeedbackItems(elementItems)
        setSiteFeedback(siteItems)
        setPageFeedback(pageItems)
      })
      .catch((err) => onError?.(err))
      .finally(() => setLoading(false))
  }, [adapter, onError, pathname])

  // Derive current scope based on state
  const getCurrentScope = useCallback((): FeedtackScope => {
    if (pinMode.isActive || pinMode.pendingPins.length > 0) return 'element'
    return composeScope
  }, [pinMode.isActive, pinMode.pendingPins.length, composeScope])

  const commentRef = () => comment
  const sentimentRef = () => sentiment
  const scopeRef = () => getCurrentScope()
  const pinsRef = () => pinMode.pendingPins
  const replyRef = () => replyBody
  const pathRef = () => pathname

  const actions = useFeedtackActions({
    adapter,
    currentUser,
    onError,
    getComment: commentRef,
    getSentiment: sentimentRef,
    getScope: scopeRef,
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

  // Modal submit wraps actions.handleSubmit but also updates site/page lists
  const handleModalSubmit = useCallback(async () => {
    if (!comment.trim()) {
      setCommentError(true)
      return
    }
    await actions.handleSubmit()
    // After submit, move the new item from feedbackItems to the right scope list
    const scope = composeScope
    setFeedbackItems((prev) => {
      const newItem = prev[prev.length - 1]
      if (newItem && newItem.payload.scope === scope) {
        if (scope === 'site') {
          setSiteFeedback((s) => [...s, newItem])
        } else {
          setPageFeedback((p) => [...p, newItem])
        }
        return prev.slice(0, -1)
      }
      return prev
    })
    resetForm()
  }, [actions, composeScope, resetForm, comment])

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
    siteFeedback,
    pageFeedback,
    loading,
    openThreadId,
    setOpenThreadId,
    replyBody,
    setReplyBody,
    // Modal state
    isModalOpen,
    openModal,
    closeModal,
    composeScope,
    setComposeScope,
    handleModalSubmit,
    ...actions,
    isArchivedForUser,
    hasUnread,
    hasValidPins,
  }
}
