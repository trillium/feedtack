import type { FeedtackAdapter } from '../types/adapter.js'
import type {
  FeedbackItem,
  FeedtackPin,
  FeedtackSentiment,
  FeedtackUser,
} from '../types/payload.js'
import type { FeedtackTheme } from '../types/theme.js'

export function generateId(): string {
  return `ft_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`
}

export interface FeedtackFlushEvent {
  pathname: string
  items: FeedbackItem[]
}

export interface FeedtackEngineOpts {
  adapter: FeedtackAdapter
  currentUser: FeedtackUser
  hotkey?: string
  theme?: FeedtackTheme
  onError?: (err: Error) => void
  disabled?: boolean
  onFlush?: (event: FeedtackFlushEvent) => void
  flushIdleMs?: number
  rescopeRoles?: string[]
}

export interface FeedtackEngineState {
  isPinModeActive: boolean
  pendingPins: Array<Omit<FeedtackPin, 'index'>>
  selectedColor: string
  showForm: boolean
  comment: string
  sentiment: FeedtackSentiment
  commentError: boolean
  submitting: boolean
  feedbackItems: FeedbackItem[]
  siteFeedback: FeedbackItem[]
  pageFeedback: FeedbackItem[]
  loading: boolean
  openThreadId: string | null
  replyBody: string
  isModalOpen: boolean
  composeScope: 'site' | 'page'
  pathname: string
}

export type FeedtackStateListener = (
  state: FeedtackEngineState,
  changedKeys: Array<keyof FeedtackEngineState>,
) => void
