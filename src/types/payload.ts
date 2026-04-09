export const SCHEMA_VERSION = '1.0.0'

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

export interface FeedtackPinTarget {
  /** CSS selector path to the clicked element */
  selector: string
  /** True when no stable selector was found — downstream consumers should not rely on selector for automated targeting */
  best_effort: boolean
  tagName: string
  /** Trimmed text content of the element, max 200 chars */
  textContent: string
  attributes: Record<string, string>
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

export type FeedtackSentiment = 'satisfied' | 'dissatisfied' | null

export interface FeedtackPayload {
  schemaVersion: string
  /** Unique feedback ID, e.g. ft_01j... */
  id: string
  /** ISO 8601 UTC */
  timestamp: string
  submittedBy: FeedtackUser
  comment: string
  sentiment: FeedtackSentiment
  /** At least one pin required */
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
}
