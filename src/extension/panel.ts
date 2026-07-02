/**
 * Feedtack side panel — tacking UI.
 *
 * Flow:
 *  1. User clicks "Pick Element" → sends startPicker to active tab's content script
 *  2. Content script activates crosshair picker, returns element metadata on click
 *  3. User adds a note + optional sentiment
 *  4. Submit → POST to webhook URL
 */

import type { FeedtackSentiment } from '../types/payload.js'
import { buildPayload, type PickedElement } from './panelPayload.js'

// --- DOM refs ---

const pickBtn = document.getElementById('pick-btn') as HTMLButtonElement
const elementCard = document.getElementById('element-card') as HTMLDivElement
const cardSelector = document.getElementById('card-selector') as HTMLSpanElement
const cardText = document.getElementById('card-text') as HTMLSpanElement
const noteInput = document.getElementById('note') as HTMLTextAreaElement
const sentimentBtns =
  document.querySelectorAll<HTMLButtonElement>('.sentiment-btn')
const statusEl = document.getElementById('status') as HTMLDivElement
const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement
const webhookInput = document.getElementById('webhook-url') as HTMLInputElement
const nameInput = document.getElementById('user-name') as HTMLInputElement
const emailInput = document.getElementById('user-email') as HTMLInputElement
const fabToggle = document.getElementById('fab-enabled') as HTMLInputElement

// --- State ---

let pickedElement: PickedElement | null = null
let sentiment: FeedtackSentiment = null
let pickerActive = false

// --- Load settings ---

chrome.storage.sync.get(
  ['webhookUrl', 'userName', 'userEmail', 'fabEnabled'],
  (data) => {
    if (data.webhookUrl) webhookInput.value = data.webhookUrl
    if (data.userName) nameInput.value = data.userName
    if (data.userEmail) emailInput.value = data.userEmail
    fabToggle.checked = data.fabEnabled === true
  },
)

// Auto-save settings on change
webhookInput.addEventListener('change', () =>
  chrome.storage.sync.set({ webhookUrl: webhookInput.value }),
)
nameInput.addEventListener('change', () =>
  chrome.storage.sync.set({ userName: nameInput.value }),
)
emailInput.addEventListener('change', () =>
  chrome.storage.sync.set({ userEmail: emailInput.value }),
)
fabToggle.addEventListener('change', () => {
  chrome.storage.sync.set({ fabEnabled: fabToggle.checked })
  // Notify content scripts in all tabs to re-evaluate FAB state
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      if (tab.id) {
        chrome.tabs
          .sendMessage(tab.id, {
            type: 'setFab',
            enabled: fabToggle.checked,
          })
          .catch(() => {})
      }
    }
  })
})

// --- Pick button ---

pickBtn.addEventListener('click', async () => {
  if (pickerActive) {
    await sendToActiveTab({ type: 'stopPicker' })
    setPickerActive(false)
    return
  }

  const tab = await getActiveTab()
  if (!tab?.id) {
    showStatus('No active tab found.', 'error')
    return
  }

  setPickerActive(true)

  chrome.tabs.sendMessage(tab.id, { type: 'startPicker' }, (response) => {
    if (chrome.runtime.lastError || !response) {
      showStatus('Could not connect — try refreshing the page.', 'error')
      setPickerActive(false)
      return
    }
    pickedElement = response as PickedElement
    setPickerActive(false)
    renderElementCard(pickedElement)
    updateSubmitState()
  })
})

// --- Sentiment ---

for (const btn of sentimentBtns) {
  btn.addEventListener('click', () => {
    const value = btn.dataset.value as 'good' | 'bad'
    if (sentiment === value) {
      // deselect
      sentiment = null
      btn.classList.remove(`selected-${value}`)
    } else {
      sentiment = value
      for (const b of sentimentBtns) b.className = 'sentiment-btn'
      btn.classList.add(`selected-${value}`)
    }
  })
}

// --- Submit ---

submitBtn.addEventListener('click', async () => {
  const webhookUrl = webhookInput.value.trim()
  if (!webhookUrl) {
    showStatus('Enter a webhook URL in Settings.', 'error')
    return
  }
  if (!pickedElement) {
    showStatus('Pick an element first.', 'error')
    return
  }

  const payload = buildPayload(pickedElement, {
    name: nameInput.value,
    email: emailInput.value,
    comment: noteInput.value,
    sentiment,
  })

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    showStatus('Tack submitted!', 'ok')
    reset()
  } catch (err) {
    showStatus(
      `Submit failed — is tack-server running? (${err instanceof Error ? err.message : err})`,
      'error',
    )
  }
})

// --- Helpers ---

function setPickerActive(active: boolean) {
  pickerActive = active
  pickBtn.textContent = active ? '✕  Cancel' : ''
  if (!active) {
    // Restore icon + label
    pickBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/>
        <line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/>
        <line x1="12" y1="22" x2="12" y2="18"/>
      </svg>
      Pick Element`
  }
  pickBtn.classList.toggle('active', active)
}

function renderElementCard(el: PickedElement) {
  cardSelector.textContent = el.dataTestId
    ? `[data-testid="${el.dataTestId}"]`
    : el.selector
  cardText.textContent = el.textContent || el.tagName
  elementCard.classList.add('visible')
}

function updateSubmitState() {
  submitBtn.disabled = !pickedElement
}

function showStatus(msg: string, type: 'ok' | 'error') {
  statusEl.textContent = msg
  statusEl.className = type
  if (type === 'ok') setTimeout(() => (statusEl.className = ''), 3000)
}

function reset() {
  pickedElement = null
  sentiment = null
  noteInput.value = ''
  for (const b of sentimentBtns) b.className = 'sentiment-btn'
  elementCard.classList.remove('visible')
  updateSubmitState()
}

async function getActiveTab(): Promise<chrome.tabs.Tab | undefined> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  return tab
}

async function sendToActiveTab(message: unknown): Promise<void> {
  const tab = await getActiveTab()
  if (tab?.id) {
    chrome.tabs.sendMessage(tab.id, message).catch(() => {})
  }
}
