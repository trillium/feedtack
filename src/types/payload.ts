export const SCHEMA_VERSION = '2.0.0'

export type FeedtackScope = 'site' | 'page' | 'element'

export interface FeedtackUser {
  /** Unique identifier — used for attribution across pins, replies, resolutions, archives */
  id: string
  /** Display name shown in threads */
  name: string
  /** Controls UI access, e.g. 'admin' | 'designer' | 'stakeholder' | 'partner' */
  role: string
  /** Shown in reply threads next to name */
  avatarUrl?: string
  /** Reserved for future notification use */
  email?: string
}

export interface FeedtackBoundingRect {
  x: number
  y: number
  width: number
  height: number
}

export interface AncestorNode {
  tag: string
  id: string | null
  ariaLabel: string | null
  role: string | null
  type: string | null
  name: string | null
  title: string | null
  alt: string | null
  dataTestId: string | null
  dataFeedtackComponent: string | null
  /** 1-indexed position among all sibling elements. Null when node has a stable id or dataTestId. */
  nthChild: number | null
  /** 1-indexed position among same-tag siblings. Null when node has a stable id or dataTestId. */
  nthOfType: number | null
  /** React component display name from fiber traversal, or data-feedtack-component value */
  componentName: string | null
}

export interface FeedtackPinTarget {
  /** CSS selector path to the resolved interactive target */
  selector: string
  /** True when no stable selector was found — downstream consumers should not rely on selector for automated targeting */
  best_effort: boolean
  /** data-testid attribute value if present, null otherwise */
  dataTestId: string | null
  /** Readable DOM ancestry path retained for backward compatibility */
  elementPath: string | null
  tagName: string
  /** Ancestor chain up to 5 levels from the resolved target, for LLM element location */
  ancestors: AncestorNode[]
  boundingRect: FeedtackBoundingRect
}

export interface FeedtackPin {
  /** 1-based index within the session */
  index: number
  /** Hex color chosen by user from the fixed palette */
  color: string
  /** Document-relative X coordinate (clientX + scrollX) */
  x: number
  /** Document-relative Y coordinate (clientY + scrollY) */
  y: number
  /** X as percentage of document width */
  xPct: number
  /** Y as percentage of document height */
  yPct: number
  target: FeedtackPinTarget
}

export interface FeedtackPageMeta {
  url: string
  pathname: string
  title: string
}

export interface FeedtackViewportMeta {
  width: number
  height: number
  scrollX: number
  scrollY: number
  devicePixelRatio: number
}

export interface FeedtackDeviceMeta {
  userAgent: string
  platform: string
  touchEnabled: boolean
}

export type FeedtackSentiment = 'good' | 'bad' | null

export interface FeedtackPayload {
  schemaVersion: string
  /** Unique feedback ID, e.g. ft_01j... */
  id: string
  /** ISO 8601 UTC */
  timestamp: string
  /** Feedback scope: site-wide, page-level, or element-specific */
  scope: FeedtackScope
  submittedBy: FeedtackUser
  comment: string
  sentiment: FeedtackSentiment
  /** Pins placed on the page. Empty for site/page scope. */
  pins: FeedtackPin[]
  page: FeedtackPageMeta
  viewport: FeedtackViewportMeta
  device: FeedtackDeviceMeta
}

export interface FeedtackReply {
  id: string
  feedbackId: string
  author: FeedtackUser
  body: string
  /** ISO 8601 UTC */
  timestamp: string
}

export interface FeedtackResolution {
  feedbackId: string
  resolvedBy: FeedtackUser
  /** ISO 8601 UTC */
  timestamp: string
}

export interface FeedtackArchive {
  feedbackId: string
  archivedBy: FeedtackUser
  /** ISO 8601 UTC */
  timestamp: string
}

export interface FeedbackItem {
  payload: FeedtackPayload
  replies: FeedtackReply[]
  resolutions: FeedtackResolution[]
  archives: FeedtackArchive[]
}

export interface FeedtackFilter {
  url?: string
  pathname?: string
  userId?: string
  scope?: FeedtackScope
}
