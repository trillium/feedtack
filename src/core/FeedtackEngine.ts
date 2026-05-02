import type { FeedbackItem } from '../types/payload.js'
import { PIN_PALETTE } from '../ui/colors.js'
import type { ActionContext } from './actions.js'
import {
  handleArchive,
  handleModalSubmit,
  handleReply,
  handleResolve,
  handleSubmit,
  loadFeedback,
} from './actions.js'
import {
  applyTheme,
  attachSpaNavigation,
  injectRoot,
  injectStyles,
  type SpaNavigationHandles,
  setCrosshair,
} from './dom.js'
import { attachFlush, type FlushController } from './flush.js'
import { attachInputListeners, type InputListenerHandles } from './input.js'
import type {
  FeedtackEngineOpts,
  FeedtackEngineState,
  FeedtackStateListener,
} from './types.js'

const DEFAULT_IDLE_MS = 5 * 60 * 1000

export class FeedtackEngine {
  private readonly opts: FeedtackEngineOpts
  private state: FeedtackEngineState
  private listeners = new Set<FeedtackStateListener>()
  private actionCtx: ActionContext

  private styleEl: HTMLStyleElement | null = null
  private rootEl: HTMLDivElement | null = null
  private spaNav: SpaNavigationHandles | null = null
  flushCtrl: FlushController | null = null
  private inputHandles: InputListenerHandles | null = null

  constructor(opts: FeedtackEngineOpts) {
    this.opts = opts
    const pathname =
      typeof window === 'undefined' ? '/' : window.location.pathname
    this.state = {
      isPinModeActive: false,
      pendingPins: [],
      selectedColor: PIN_PALETTE[0],
      showForm: false,
      comment: '',
      sentiment: null,
      commentError: false,
      submitting: false,
      feedbackItems: [],
      siteFeedback: [],
      pageFeedback: [],
      loading: true,
      openThreadId: null,
      replyBody: '',
      isModalOpen: false,
      composeScope: 'site',
      pathname,
    }
    this.actionCtx = {
      adapter: opts.adapter,
      currentUser: opts.currentUser,
      onError: opts.onError,
      rescopeRoles: opts.rescopeRoles,
      getState: () => this.state,
      setState: (p) => this.setState(p),
      getCurrentScope: () => this.getCurrentScope(),
      deactivatePinMode: () => this.deactivatePinMode(),
      flushCtrl: null,
    }
  }

  // ── State ──────────────────────────────────────────────────────────────

  getState(): Readonly<FeedtackEngineState> {
    return this.state
  }

  subscribe(listener: FeedtackStateListener): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private setState(partial: Partial<FeedtackEngineState>): void {
    const keys = Object.keys(partial) as Array<keyof FeedtackEngineState>
    let changed = false
    for (const k of keys) {
      if (this.state[k] !== partial[k]) {
        changed = true
        break
      }
    }
    if (!changed) return
    this.state = { ...this.state, ...partial }
    for (const fn of this.listeners) fn(this.state, keys)
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────

  mount(): void {
    if (this.opts.disabled) return
    this.styleEl = injectStyles()
    this.rootEl = injectRoot()
    if (this.opts.theme) applyTheme(this.opts.theme)
    this.spaNav = attachSpaNavigation(() => this.onNavUpdate())
    this.inputHandles = attachInputListeners(
      () => this.state,
      (p) => this.setState(p),
      this.opts.hotkey ?? 'p',
      () => this.openModal(),
      () => this.deactivatePinMode(),
    )
    if (this.opts.onFlush) {
      this.flushCtrl = attachFlush(
        () => this.state.feedbackItems,
        () => this.state.pathname,
        this.opts.onFlush,
        this.opts.flushIdleMs ?? DEFAULT_IDLE_MS,
      )
      this.actionCtx.flushCtrl = this.flushCtrl
    }
    loadFeedback(this.actionCtx)
  }

  destroy(): void {
    this.spaNav?.detach()
    this.flushCtrl?.detach()
    this.inputHandles?.detachKeyboard()
    this.inputHandles?.detachClick()
    this.inputHandles = null
    setCrosshair(false)
    this.styleEl?.remove()
    this.rootEl?.remove()
    this.styleEl = null
    this.rootEl = null
  }

  private onNavUpdate(): void {
    const p = window.location.pathname
    if (p === this.state.pathname) return
    this.flushCtrl?.flushPath(this.state.pathname)
    this.setState({ pathname: p })
    loadFeedback(this.actionCtx)
  }

  // ── Pin mode ──────────────────────────────────────────────────────────

  activatePinMode(): void {
    this.setState({ isPinModeActive: true })
    setCrosshair(true)
  }

  deactivatePinMode(): void {
    this.setState({
      isPinModeActive: false,
      pendingPins: [],
      showForm: false,
      comment: '',
      sentiment: null,
      commentError: false,
      openThreadId: null,
    })
    setCrosshair(false)
  }

  // ── Setters ───────────────────────────────────────────────────────────

  setComment(v: string): void {
    this.setState({ comment: v })
  }
  setSentiment(v: FeedtackEngineState['sentiment']): void {
    this.setState({ sentiment: v })
  }
  setCommentError(v: boolean): void {
    this.setState({ commentError: v })
  }
  setSelectedColor(c: string): void {
    this.setState({ selectedColor: c })
  }
  setOpenThreadId(id: string | null): void {
    this.setState({ openThreadId: id })
  }
  setReplyBody(v: string): void {
    this.setState({ replyBody: v })
  }
  setComposeScope(s: 'site' | 'page'): void {
    this.setState({ composeScope: s })
  }
  openModal(): void {
    this.setState({ isModalOpen: true })
  }
  closeModal(): void {
    this.setState({ isModalOpen: false })
  }

  // ── Derived ───────────────────────────────────────────────────────────

  getCurrentScope() {
    const s = this.state
    return s.isPinModeActive || s.pendingPins.length > 0
      ? ('element' as const)
      : s.composeScope
  }

  isArchivedForUser(item: FeedbackItem): boolean {
    return item.archives.some(
      (a) => a.archivedBy.id === this.opts.currentUser.id,
    )
  }
  hasUnread(item: FeedbackItem): boolean {
    return item.replies.length > 0
  }
  hasValidPins(item: FeedbackItem): boolean {
    return Array.isArray(item.payload?.pins) && item.payload.pins.length > 0
  }

  // ── Actions (delegated) ───────────────────────────────────────────────

  handleSubmit(): Promise<void> {
    return handleSubmit(this.actionCtx)
  }
  handleModalSubmit(): Promise<void> {
    return handleModalSubmit(this.actionCtx)
  }
  handleReply(id: string): Promise<void> {
    return handleReply(this.actionCtx, id)
  }
  handleResolve(id: string): Promise<void> {
    return handleResolve(this.actionCtx, id)
  }
  handleArchive(id: string): Promise<void> {
    return handleArchive(this.actionCtx, id)
  }
}
