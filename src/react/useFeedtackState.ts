'use client'

import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react'
import { checkFiberAtMount } from '../capture/fiber.js'
import { FeedtackEngine } from '../core/FeedtackEngine.js'
import type { FeedtackEngineState, FeedtackFlushEvent } from '../core/types.js'
import type { FeedtackAdapter } from '../types/adapter.js'
import type { FeedbackItem, FeedtackUser } from '../types/payload.js'
import type { FeedtackTheme } from '../types/theme.js'

export type { FeedtackFlushEvent } from '../core/types.js'

export interface UseFeedtackStateOpts {
  adapter: FeedtackAdapter
  currentUser: FeedtackUser
  hotkey: string
  theme?: FeedtackTheme
  onError?: (err: Error) => void
  disabled?: boolean
  onFlush?: (event: FeedtackFlushEvent) => void
  flushIdleMs?: number
  rescopeRoles?: string[]
  breakpoints?: Record<string, number>
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
  breakpoints,
}: UseFeedtackStateOpts) {
  // Create engine once, stable across renders
  const engineRef = useRef<FeedtackEngine | null>(null)
  if (!engineRef.current) {
    engineRef.current = new FeedtackEngine({
      adapter,
      currentUser,
      hotkey,
      theme,
      onError,
      disabled,
      onFlush,
      flushIdleMs,
      rescopeRoles,
      breakpoints,
    })
  }
  const engine = engineRef.current

  // Mount / destroy lifecycle. The fiber check runs here — first mount in the
  // browser is the earliest moment fiber presence is observable (library code
  // is never executed at build), and in dev it equals "dev server launched,
  // page opened" — the right time to inform the developer.
  useEffect(() => {
    if (!disabled) checkFiberAtMount()
    engine.mount()
    return () => engine.destroy()
  }, [engine, disabled])

  // Subscribe to engine state via useSyncExternalStore
  const subscribe = useCallback(
    (cb: () => void) => engine.subscribe(cb),
    [engine],
  )
  const getSnapshot = useCallback(() => engine.getState(), [engine])

  const state: Readonly<FeedtackEngineState> = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getSnapshot,
  )

  // Helpers that delegate to engine
  const isArchivedForUser = useCallback(
    (item: FeedbackItem) => engine.isArchivedForUser(item),
    [engine],
  )
  const hasUnread = useCallback(
    (item: FeedbackItem) => engine.hasUnread(item),
    [engine],
  )
  const hasValidPins = useCallback(
    (item: FeedbackItem) => engine.hasValidPins(item),
    [engine],
  )

  return {
    // Pin mode
    isPinModeActive: state.isPinModeActive,
    isActive: state.isPinModeActive,
    activatePinMode: useCallback(() => engine.activatePinMode(), [engine]),
    activate: useCallback(() => engine.activatePinMode(), [engine]),
    deactivatePinMode: useCallback(() => engine.deactivatePinMode(), [engine]),
    deactivate: useCallback(() => engine.deactivatePinMode(), [engine]),
    pendingPins: state.pendingPins,
    selectedColor: state.selectedColor,
    setSelectedColor: useCallback(
      (c: string) => engine.setSelectedColor(c),
      [engine],
    ),
    showForm: state.showForm,

    // Form
    comment: state.comment,
    setComment: useCallback((v: string) => engine.setComment(v), [engine]),
    sentiment: state.sentiment,
    setSentiment: useCallback(
      (v: Parameters<typeof engine.setSentiment>[0]) => engine.setSentiment(v),
      [engine],
    ),
    commentError: state.commentError,
    setCommentError: useCallback(
      (v: boolean) => engine.setCommentError(v),
      [engine],
    ),
    submitting: state.submitting,

    // Feedback
    feedbackItems: state.feedbackItems,
    siteFeedback: state.siteFeedback,
    pageFeedback: state.pageFeedback,
    loading: state.loading,
    pathname: state.pathname,

    // Thread
    openThreadId: state.openThreadId,
    setOpenThreadId: useCallback(
      (id: string | null) => engine.setOpenThreadId(id),
      [engine],
    ),
    replyBody: state.replyBody,
    setReplyBody: useCallback((v: string) => engine.setReplyBody(v), [engine]),

    // Modal
    isModalOpen: state.isModalOpen,
    openModal: useCallback(() => engine.openModal(), [engine]),
    closeModal: useCallback(() => engine.closeModal(), [engine]),
    composeScope: state.composeScope,
    setComposeScope: useCallback(
      (s: 'site' | 'page') => engine.setComposeScope(s),
      [engine],
    ),

    // Actions
    handleSubmit: useCallback(() => engine.handleSubmit(), [engine]),
    handleModalSubmit: useCallback(() => engine.handleModalSubmit(), [engine]),
    handleReply: useCallback((id: string) => engine.handleReply(id), [engine]),
    handleResolve: useCallback(
      (id: string) => engine.handleResolve(id),
      [engine],
    ),
    handleArchive: useCallback(
      (id: string) => engine.handleArchive(id),
      [engine],
    ),

    // Derived helpers
    isArchivedForUser,
    hasUnread,
    hasValidPins,
  }
}
