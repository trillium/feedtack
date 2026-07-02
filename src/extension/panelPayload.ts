/**
 * Payload assembly for the side panel — pure functions, no DOM refs.
 */

import type {
  FeedtackPayload,
  FeedtackPin,
  FeedtackPinTarget,
  FeedtackSentiment,
} from '../types/payload.js'

export interface PickedElement {
  selector: string
  dataTestId: string | null
  tagName: string
  textContent: string
  rect: DOMRectInit
  ancestors: unknown[]
  pageUrl: string
  pagePathname: string
  pageTitle: string
  scrollX: number
  scrollY: number
  viewportWidth: number
  viewportHeight: number
}

export interface PayloadInputs {
  name: string
  email: string
  comment: string
  sentiment: FeedtackSentiment
}

export function buildPayload(
  el: PickedElement,
  inputs: PayloadInputs,
): FeedtackPayload {
  const rect = el.rect

  const target: FeedtackPinTarget = {
    selector: el.selector,
    best_effort: !el.dataTestId && !el.selector.startsWith('#'),
    dataTestId: el.dataTestId,
    elementPath: el.selector,
    tagName: el.tagName,
    ancestors: el.ancestors as never,
    boundingRect: {
      x: rect.x ?? 0,
      y: rect.y ?? 0,
      width: rect.width ?? 0,
      height: rect.height ?? 0,
    },
  }

  const pin: FeedtackPin = {
    index: 1,
    color: '#2563eb',
    x: (rect.x ?? 0) + (rect.width ?? 0) / 2,
    y: (rect.y ?? 0) + (rect.height ?? 0) / 2 + el.scrollY,
    xPct:
      el.viewportWidth > 0
        ? (((rect.x ?? 0) + (rect.width ?? 0) / 2) / el.viewportWidth) * 100
        : 0,
    yPct:
      el.viewportHeight > 0
        ? (((rect.y ?? 0) + (rect.height ?? 0) / 2 + el.scrollY) /
            el.viewportHeight) *
          100
        : 0,
    target,
  }

  const name = inputs.name.trim()
  const email = inputs.email.trim()
  const userId = name.toLowerCase().replace(/\s+/g, '-') || 'anon'

  return {
    schemaVersion: '2.0.0',
    id: `ft_ext_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    scope: 'element',
    submittedBy: {
      id: userId,
      name: name || 'Anonymous',
      role: 'reviewer',
      ...(email ? { email } : {}),
    },
    comment: inputs.comment.trim(),
    sentiment: inputs.sentiment,
    pins: [pin],
    page: {
      url: el.pageUrl,
      pathname: el.pagePathname,
      title: el.pageTitle,
    },
    viewport: {
      width: el.viewportWidth,
      height: el.viewportHeight,
      scrollX: el.scrollX,
      scrollY: el.scrollY,
      devicePixelRatio: window.devicePixelRatio,
      breakpoint: null,
    },
    device: {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      touchEnabled: navigator.maxTouchPoints > 0,
    },
  }
}
