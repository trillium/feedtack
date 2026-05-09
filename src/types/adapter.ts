import type {
  FeedbackItem,
  FeedtackFilter,
  FeedtackPayload,
  FeedtackReply,
  FeedtackResolution,
  FieldApproval,
  FieldApprovalState,
  FieldFilter,
} from './payload.js'

/**
 * Optional extension interface for adapters that support content field approvals.
 * Implement alongside FeedtackAdapter — adapters that omit this continue to work unchanged.
 */
export interface ContentAdapter {
  /** Record approval for a field at its current hash */
  approve(fieldPath: string, approval: FieldApproval): Promise<void>
  /** Remove approval for a field by a specific user */
  revokeApproval(fieldPath: string, userId: string): Promise<void>
  /** Load approval states, optionally filtered */
  loadApprovals(filter?: FieldFilter): Promise<FieldApprovalState[]>
}

/**
 * Optional extension of ContentAdapter for adapters that support inline content editing.
 * saveField MUST atomically persist the new value AND clear the stored approval.
 */
export interface ContentEditAdapter extends ContentAdapter {
  /** Fetch all stored field values for DOM hydration — keyed by dot-path */
  loadFields(): Promise<Record<string, string>>
  /** Persist a field edit. MUST clear the stored approval for the field. */
  saveField(fieldPath: string, value: string): Promise<void>
}

/** Returns true if the adapter implements ContentEditAdapter */
export function isContentEditAdapter(
  adapter: unknown,
): adapter is ContentEditAdapter {
  return (
    isContentAdapter(adapter) &&
    typeof (adapter as ContentEditAdapter).loadFields === 'function' &&
    typeof (adapter as ContentEditAdapter).saveField === 'function'
  )
}

/** Warn in dev mode when an edit method is called on a non-ContentEditAdapter */
export function warnIfNotContentEditAdapter(
  adapter: unknown,
  method: string,
): void {
  if (DEV && !isContentEditAdapter(adapter)) {
    console.warn(
      `[feedtack] ${method}() called but the adapter does not implement ContentEditAdapter. ` +
        'Content editing features are unavailable with this adapter.',
    )
  }
}

const DEV =
  typeof process !== 'undefined' && process.env.NODE_ENV !== 'production'

/** Returns true if the adapter implements ContentAdapter */
export function isContentAdapter(adapter: unknown): adapter is ContentAdapter {
  return (
    typeof adapter === 'object' &&
    adapter !== null &&
    typeof (adapter as ContentAdapter).approve === 'function' &&
    typeof (adapter as ContentAdapter).revokeApproval === 'function' &&
    typeof (adapter as ContentAdapter).loadApprovals === 'function'
  )
}

/** Warn in dev mode when a ContentAdapter method is called on a non-ContentAdapter */
export function warnIfNotContentAdapter(
  adapter: unknown,
  method: string,
): void {
  if (DEV && !isContentAdapter(adapter)) {
    console.warn(
      `[feedtack] ${method}() called but the adapter does not implement ContentAdapter. ` +
        'Content approval features are unavailable with this adapter.',
    )
  }
}

/** Plugin contract — implement this interface to create a custom feedtack backend */
export interface FeedtackAdapter {
  /** Submit new feedback payload */
  submit(payload: FeedtackPayload): Promise<void>
  /** Post a reply to an existing feedback item */
  reply(
    feedbackId: string,
    reply: Omit<FeedtackReply, 'id' | 'feedbackId'>,
  ): Promise<void>
  /** Mark a feedback item as resolved */
  resolve(
    feedbackId: string,
    resolution: Omit<FeedtackResolution, 'feedbackId'>,
  ): Promise<void>
  /** Archive a feedback item for a specific user */
  archive(feedbackId: string, userId: string): Promise<void>
  /** Load persisted feedback items, optionally filtered */
  loadFeedback(filter?: FeedtackFilter): Promise<FeedbackItem[]>
}
