import type React from 'react'
import type { FeedtackFlushEvent } from '../core/types.js'
import type { FeedtackAdapter } from '../types/adapter.js'
import type { FeedbackItem, FeedtackUser } from '../types/payload.js'
import type { FeedtackTheme } from '../types/theme.js'

export interface FeedtackClasses {
  button?: string
  form?: string
  thread?: string
  colorPicker?: string
  pinMarker?: string
}

export interface FeedtackSentimentLabels {
  satisfied?: React.ReactNode
  dissatisfied?: React.ReactNode
}

export interface FeedtackProviderProps<TUser = FeedtackUser> {
  children: React.ReactNode
  adapter: FeedtackAdapter
  currentUser: TUser
  mapUser?: (user: TUser) => FeedtackUser
  hotkey?: string
  adminOnly?: boolean
  theme?: FeedtackTheme
  classes?: FeedtackClasses
  sentimentLabels?: FeedtackSentimentLabels
  onError?: (err: Error) => void
  disabled?: boolean
  /** Render custom content inside a submitted pin marker. Receives the feedback item. */
  renderPinIcon?: (item: FeedbackItem) => React.ReactNode
  /** Called with batched feedback when user leaves a page or goes idle */
  onFlush?: (event: FeedtackFlushEvent) => void
  /** Idle timeout in ms before flushing (default 5 min) */
  flushIdleMs?: number
  /** User roles that trigger re-scope on reply (default: any non-'agent' role) */
  rescopeRoles?: string[]
  /**
   * Called by the consumer (e.g. on a Deploy button click) to check whether all
   * content fields have current approvals. Feedtack surfaces the data; the consumer
   * decides what to do with the result.
   */
  onDeployCheck?: () => Promise<{ approved: boolean; pending: string[] }>
}
