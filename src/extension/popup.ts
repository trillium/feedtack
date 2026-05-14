const webhookInput = document.getElementById('webhookUrl') as HTMLInputElement
const nameInput = document.getElementById('userName') as HTMLInputElement
const emailInput = document.getElementById('userEmail') as HTMLInputElement
const enabledInput = document.getElementById('enabled') as HTMLInputElement
const saveBtn = document.getElementById('save') as HTMLButtonElement
const savedMsg = document.getElementById('saved') as HTMLDivElement

// Load saved config
chrome.storage.sync.get(
  ['webhookUrl', 'userName', 'userEmail', 'enabled'],
  (data) => {
    if (data.webhookUrl) webhookInput.value = data.webhookUrl
    if (data.userName) nameInput.value = data.userName
    if (data.userEmail) emailInput.value = data.userEmail
    enabledInput.checked = data.enabled !== false
  },
)

// Save
saveBtn.addEventListener('click', () => {
  const values: Record<string, string | boolean> = {
    enabled: enabledInput.checked,
  }

  if (webhookInput.value.trim()) values.webhookUrl = webhookInput.value.trim()
  if (nameInput.value.trim()) values.userName = nameInput.value.trim()
  if (emailInput.value.trim()) values.userEmail = emailInput.value.trim()

  chrome.storage.sync.set(values, () => {
    savedMsg.style.display = 'block'
    setTimeout(() => {
      savedMsg.style.display = 'none'
    }, 1500)
  })
})
