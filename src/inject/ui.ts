import { INJECT_STYLES } from './styles.js'

export interface InjectUI {
  shadow: ShadowRoot
  fab: HTMLButtonElement
  panel: HTMLDivElement
  textarea: HTMLTextAreaElement
  sentimentGood: HTMLButtonElement
  sentimentBad: HTMLButtonElement
  submitBtn: HTMLButtonElement
  cancelBtn: HTMLButtonElement
  pinCount: HTMLDivElement
  status: HTMLDivElement
  errorMsg: HTMLDivElement
}

/** Create the Shadow DOM host and render the injectable UI */
export function createInjectUI(): InjectUI {
  const host = document.createElement('div')
  host.id = 'feedtack-inject'
  document.body.appendChild(host)

  const shadow = host.attachShadow({ mode: 'closed' })

  const style = document.createElement('style')
  style.textContent = INJECT_STYLES
  shadow.appendChild(style)

  // FAB
  const fab = document.createElement('button')
  fab.className = 'ft-fab'
  fab.textContent = 'Feedback'
  fab.setAttribute('aria-label', 'Toggle feedtack feedback panel')
  shadow.appendChild(fab)

  // Panel
  const panel = document.createElement('div')
  panel.className = 'ft-panel'
  panel.setAttribute('role', 'dialog')
  panel.setAttribute('aria-label', 'Feedtack feedback panel')

  // Header
  const header = document.createElement('div')
  header.className = 'ft-panel-header'
  const title = document.createElement('span')
  title.className = 'ft-panel-title'
  title.textContent = 'Feedback'
  const closeBtn = document.createElement('button')
  closeBtn.className = 'ft-panel-close'
  closeBtn.textContent = '\u00d7'
  closeBtn.setAttribute('aria-label', 'Close panel')
  header.appendChild(title)
  header.appendChild(closeBtn)
  panel.appendChild(header)

  // Body
  const body = document.createElement('div')
  body.className = 'ft-panel-body'

  const pinCount = document.createElement('div')
  pinCount.className = 'ft-pin-count'
  pinCount.textContent = 'Click on elements to place pins, then submit.'
  body.appendChild(pinCount)

  const textarea = document.createElement('textarea')
  textarea.className = 'ft-textarea'
  textarea.placeholder = 'Describe your feedback...'
  textarea.setAttribute('aria-label', 'Feedback comment')
  body.appendChild(textarea)

  const errorMsg = document.createElement('div')
  errorMsg.className = 'ft-error-msg'
  errorMsg.style.display = 'none'
  errorMsg.textContent = 'Please enter a comment.'
  body.appendChild(errorMsg)

  // Sentiment
  const sentimentRow = document.createElement('div')
  sentimentRow.className = 'ft-sentiment'
  const sentimentGood = document.createElement('button')
  sentimentGood.textContent = 'Good'
  sentimentGood.setAttribute('aria-label', 'Mark as good')
  const sentimentBad = document.createElement('button')
  sentimentBad.textContent = 'Bad'
  sentimentBad.setAttribute('aria-label', 'Mark as bad')
  sentimentRow.appendChild(sentimentGood)
  sentimentRow.appendChild(sentimentBad)
  body.appendChild(sentimentRow)

  // Actions
  const actions = document.createElement('div')
  actions.className = 'ft-actions'
  const cancelBtn = document.createElement('button')
  cancelBtn.className = 'ft-btn-cancel'
  cancelBtn.textContent = 'Cancel'
  const submitBtn = document.createElement('button')
  submitBtn.className = 'ft-btn-submit'
  submitBtn.textContent = 'Submit'
  actions.appendChild(cancelBtn)
  actions.appendChild(submitBtn)
  body.appendChild(actions)

  const status = document.createElement('div')
  status.className = 'ft-status'
  status.style.display = 'none'
  body.appendChild(status)

  panel.appendChild(body)
  shadow.appendChild(panel)

  return {
    shadow,
    fab,
    panel,
    textarea,
    sentimentGood,
    sentimentBad,
    submitBtn,
    cancelBtn,
    pinCount,
    status,
    errorMsg,
  }
}
