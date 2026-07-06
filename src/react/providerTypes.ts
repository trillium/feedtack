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
  /**
   * Class applied to the feedback modal <dialog>. Use this to override
   * text colors and other styles when the host page's CSS (Tailwind dark
   * mode, prose plugins, etc.) wins specificity battles against the
   * default --ft-text token.
   */
  modal?: string
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
   * @deprecated Never invoked by the provider, and deliberately not auto-wired:
   * Feedtack cannot know when a deploy-relevant moment occurs (a Deploy button,
   * a CI step, a merge) — auto-invoking would run async DOM scans at times the
   * consumer didn't choose. Use `useContentApproval(adapter, userId).checkDeploy()`
   * in your own deploy UI, or the CI Gate recipe in the Content Approval docs
   * for pipelines. This prop will be removed in the next major.
   */
  onDeployCheck?: () => Promise<{ approved: boolean; pending: string[] }>
  /**
   * CSS breakpoint map used to resolve viewport breakpoint at submission time.
   * Keys are breakpoint names, values are min-width pixel thresholds.
   * Defaults to Tailwind v3 breakpoints (sm: 640, md: 768, lg: 1024, xl: 1280, 2xl: 1536).
   */
  breakpoints?: Record<string, number>
}
