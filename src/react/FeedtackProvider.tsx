'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FeedtackContext } from './context.js'
import { getTargetMeta, getViewportMeta, getPageMeta, getDeviceMeta, getPinCoords } from '../capture/index.js'
import { FEEDTACK_STYLES } from '../ui/styles.js'
import { PIN_PALETTE } from '../ui/colors.js'
import { SCHEMA_VERSION } from '../types/payload.js'
import type { FeedtackAdapter } from '../types/adapter.js'
import type { FeedbackItem, FeedtackPayload, FeedtackPin, FeedtackSentiment, FeedtackUser } from '../types/payload.js'

export interface FeedtackProviderProps {
  children: React.ReactNode
  adapter: FeedtackAdapter
  currentUser: FeedtackUser
  /** Keyboard shortcut to toggle pin mode. Default: 'p' (Shift+P) */
  hotkey?: string
  /** Only show the activation button for users whose role is in this list */
  adminOnly?: boolean
  onError?: (err: Error) => void
}

interface PendingPin {
  x: number
  y: number
  color: string
  target: FeedtackPin['target']
  viewport: FeedtackPin['target'] extends infer T ? T : never
  raw: Omit<FeedtackPin, 'index'>
}

function generateId(): string {
  return `ft_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`
}

function getAnchoredPosition(x: number, y: number): { left?: number; right?: number; top?: number; bottom?: number } {
  const FORM_WIDTH = 290
  const FORM_HEIGHT = 220
  const EDGE = 300
  const vw = window.innerWidth
  const vh = window.innerHeight

  const clientX = x - window.scrollX
  const clientY = y - window.scrollY

  const left = clientX > vw - EDGE ? undefined : clientX + 16
  const right = clientX > vw - EDGE ? vw - clientX + 16 : undefined
  const top = clientY > vh - EDGE ? undefined : clientY + 16
  const bottom = clientY > vh - EDGE ? vh - clientY + FORM_HEIGHT : undefined

  return { left, right, top, bottom }
}

export function FeedtackProvider({ children, adapter, currentUser, hotkey = 'p', adminOnly = false, onError }: FeedtackProviderProps) {
  const [isPinModeActive, setIsPinModeActive] = useState(false)
  const [pendingPins, setPendingPins] = useState<Array<Omit<FeedtackPin, 'index'>>>([])
  const [selectedColor, setSelectedColor] = useState<string>(PIN_PALETTE[0])
  const [showForm, setShowForm] = useState(false)
  const [comment, setComment] = useState('')
  const [sentiment, setSentiment] = useState<FeedtackSentiment>(null)
  const [commentError, setCommentError] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([])
  const [loading, setLoading] = useState(true)
  const [openThreadId, setOpenThreadId] = useState<string | null>(null)
  const [replyBody, setReplyBody] = useState('')
  const rootRef = useRef<HTMLDivElement | null>(null)

  // Inject styles once
  useEffect(() => {
    if (document.getElementById('feedtack-styles')) return
    const style = document.createElement('style')
    style.id = 'feedtack-styles'
    style.textContent = FEEDTACK_STYLES
    document.head.appendChild(style)
    return () => { style.remove() }
  }, [])

  // Inject root div
  useEffect(() => {
    const root = document.createElement('div')
    root.id = 'feedtack-root'
    document.body.appendChild(root)
    rootRef.current = root
    return () => { root.remove() }
  }, [])

  // Load persisted feedback on mount
  useEffect(() => {
    setLoading(true)
    adapter.loadFeedback({ pathname: window.location.pathname })
      .then(setFeedbackItems)
      .catch((err) => onError?.(err))
      .finally(() => setLoading(false))
  }, [adapter, onError])

  const activatePinMode = useCallback(() => setIsPinModeActive(true), [])
  const deactivatePinMode = useCallback(() => {
    setIsPinModeActive(false)
    setPendingPins([])
    setShowForm(false)
    setComment('')
    setSentiment(null)
    setCommentError(false)
  }, [])

  // Crosshair cursor
  useEffect(() => {
    if (isPinModeActive) {
      document.documentElement.classList.add('feedtack-crosshair')
    } else {
      document.documentElement.classList.remove('feedtack-crosshair')
    }
    return () => document.documentElement.classList.remove('feedtack-crosshair')
  }, [isPinModeActive])

  // Hotkey listener (Shift+P by default)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === hotkey.toUpperCase() && e.shiftKey) {
        setIsPinModeActive((prev) => !prev)
      }
      if (e.key === 'Escape') {
        deactivatePinMode()
        setOpenThreadId(null)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [hotkey, deactivatePinMode])

  // Click handler in pin mode
  const handlePageClick = useCallback((e: MouseEvent) => {
    if (!isPinModeActive) return
    const target = e.target as Element
    if (target.closest('#feedtack-root') || target.closest('.feedtack-form') || target.closest('.feedtack-color-picker')) return

    e.preventDefault()
    e.stopPropagation()

    const coords = getPinCoords(e)
    const targetMeta = getTargetMeta(target)

    setPendingPins((prev) => [...prev, {
      color: selectedColor,
      ...coords,
      target: targetMeta,
    }])
    setShowForm(true)
  }, [isPinModeActive, selectedColor])

  useEffect(() => {
    document.addEventListener('click', handlePageClick, true)
    return () => document.removeEventListener('click', handlePageClick, true)
  }, [handlePageClick])

  const handleSubmit = async () => {
    if (!comment.trim()) { setCommentError(true); return }
    setSubmitting(true)
    const payload: FeedtackPayload = {
      schemaVersion: SCHEMA_VERSION,
      id: generateId(),
      timestamp: new Date().toISOString(),
      submittedBy: currentUser,
      comment: comment.trim(),
      sentiment,
      pins: pendingPins.map((p, i) => ({ ...p, index: i + 1 })),
      page: getPageMeta(),
      viewport: getViewportMeta(),
      device: getDeviceMeta(),
    }
    try {
      await adapter.submit(payload)
      setFeedbackItems((prev) => [...prev, { payload, replies: [], resolutions: [], archives: [] }])
      deactivatePinMode()
    } catch (err) {
      onError?.(err as Error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleReply = async (feedbackId: string) => {
    if (!replyBody.trim()) return
    try {
      await adapter.reply(feedbackId, {
        author: currentUser,
        body: replyBody.trim(),
        timestamp: new Date().toISOString(),
      })
      setFeedbackItems((prev) => prev.map((item) =>
        item.payload.id === feedbackId
          ? { ...item, replies: [...item.replies, { id: generateId(), feedbackId, author: currentUser, body: replyBody.trim(), timestamp: new Date().toISOString() }] }
          : item
      ))
      setReplyBody('')
    } catch (err) { onError?.(err as Error) }
  }

  const handleResolve = async (feedbackId: string) => {
    try {
      await adapter.resolve(feedbackId, { resolvedBy: currentUser, timestamp: new Date().toISOString() })
      setFeedbackItems((prev) => prev.map((item) =>
        item.payload.id === feedbackId
          ? { ...item, resolutions: [...item.resolutions, { feedbackId, resolvedBy: currentUser, timestamp: new Date().toISOString() }] }
          : item
      ))
    } catch (err) { onError?.(err as Error) }
  }

  const handleArchive = async (feedbackId: string) => {
    try {
      await adapter.archive(feedbackId, currentUser.id)
      setFeedbackItems((prev) => prev.map((item) =>
        item.payload.id === feedbackId
          ? { ...item, archives: [...item.archives, { feedbackId, archivedBy: currentUser, timestamp: new Date().toISOString() }] }
          : item
      ))
      setOpenThreadId(null)
    } catch (err) { onError?.(err as Error) }
  }

  const isArchivedForUser = (item: FeedbackItem) =>
    item.archives.some((a) => a.archivedBy.id === currentUser.id)

  const hasUnread = (item: FeedbackItem) => item.replies.length > 0

  const firstPin = pendingPins[0]
  const formPos = firstPin ? getAnchoredPosition(firstPin.x, firstPin.y) : {}

  const showButton = !adminOnly || currentUser.role === 'admin'

  return (
    <FeedtackContext.Provider value={{ activatePinMode, deactivatePinMode, isPinModeActive }}>
      {children}

      {/* Activation button */}
      {showButton && (
        <button
          className={`feedtack-btn${isPinModeActive ? ' active' : ''}`}
          onClick={() => isPinModeActive ? deactivatePinMode() : activatePinMode()}
          title="Toggle feedback pin mode"
        >
          Drop Pin [Shift+{hotkey.toUpperCase()}]
        </button>
      )}

      {/* Color picker — shown when pin mode is active */}
      {isPinModeActive && (
        <div className="feedtack-color-picker">
          {PIN_PALETTE.map((color) => (
            <button
              key={color}
              className={`feedtack-color-swatch${selectedColor === color ? ' selected' : ''}`}
              style={{ background: color }}
              onClick={() => setSelectedColor(color)}
              title={color}
            />
          ))}
        </div>
      )}

      {/* Pending pin markers */}
      {pendingPins.map((pin, i) => (
        <div
          key={i}
          className="feedtack-pin-marker"
          style={{
            background: pin.color,
            left: pin.x,
            top: pin.y,
            position: 'absolute',
          }}
        />
      ))}

      {/* New feedback comment form */}
      {showForm && (
        <div className="feedtack-form" style={{ position: 'fixed', ...formPos }}>
          <textarea
            className={commentError ? 'error' : ''}
            placeholder="What's the issue? (required)"
            value={comment}
            onChange={(e) => { setComment(e.target.value); setCommentError(false) }}
            autoFocus
          />
          {commentError && <span className="feedtack-error-msg">Comment is required</span>}
          <div className="feedtack-sentiment">
            <button
              className={sentiment === 'satisfied' ? 'selected' : ''}
              onClick={() => setSentiment(sentiment === 'satisfied' ? null : 'satisfied')}
            >😊 Satisfied</button>
            <button
              className={sentiment === 'dissatisfied' ? 'selected' : ''}
              onClick={() => setSentiment(sentiment === 'dissatisfied' ? null : 'dissatisfied')}
            >😞 Dissatisfied</button>
          </div>
          <div className="feedtack-form-actions">
            <button className="feedtack-btn-cancel" onClick={deactivatePinMode}>Cancel</button>
            <button className="feedtack-btn-submit" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Sending…' : 'Submit'}
            </button>
          </div>
        </div>
      )}

      {/* Persisted pin markers */}
      {!loading && feedbackItems
        .filter((item) => !isArchivedForUser(item))
        .map((item) => {
          const firstItemPin = item.payload.pins[0]
          const unread = hasUnread(item)
          return (
            <div
              key={item.payload.id}
              className="feedtack-pin-marker"
              style={{
                background: firstItemPin.color,
                left: firstItemPin.x,
                top: firstItemPin.y,
                position: 'absolute',
                cursor: 'pointer',
              }}
              onClick={() => setOpenThreadId(openThreadId === item.payload.id ? null : item.payload.id)}
            >
              {unread && <div className="feedtack-pin-badge" />}
            </div>
          )
        })}

      {/* Thread panel for open pin */}
      {openThreadId && (() => {
        const item = feedbackItems.find((i) => i.payload.id === openThreadId)
        if (!item) return null
        const pin = item.payload.pins[0]
        const pos = getAnchoredPosition(pin.x, pin.y)
        return (
          <div className="feedtack-thread" style={{ position: 'fixed', ...pos }}>
            <strong style={{ fontSize: 13 }}>{item.payload.submittedBy.name}</strong>
            <p style={{ fontSize: 13 }}>{item.payload.comment}</p>
            {item.replies.map((r) => (
              <div key={r.id} style={{ borderTop: '1px solid #f3f4f6', paddingTop: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{r.author.name}</span>
                <p style={{ fontSize: 12 }}>{r.body}</p>
              </div>
            ))}
            <textarea
              placeholder="Reply…"
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              style={{ width: '100%', fontSize: 12, padding: 6, borderRadius: 6, border: '1px solid #e5e7eb', marginTop: 4 }}
            />
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <button className="feedtack-btn-submit" style={{ fontSize: 12, padding: '4px 10px' }} onClick={() => handleReply(openThreadId)}>Reply</button>
              <button className="feedtack-btn-cancel" style={{ fontSize: 12 }} onClick={() => handleResolve(openThreadId)}>Mark Resolved</button>
              <button className="feedtack-btn-cancel" style={{ fontSize: 12 }} onClick={() => handleArchive(openThreadId)}>Archive</button>
              <button className="feedtack-btn-cancel" style={{ fontSize: 12 }} onClick={() => setOpenThreadId(null)}>Close</button>
            </div>
          </div>
        )
      })()}

      {loading && <div className="feedtack-loading">Loading feedback…</div>}
    </FeedtackContext.Provider>
  )
}
