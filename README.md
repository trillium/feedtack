# feedtack

> Click anywhere. Drop a pin. Get a payload a developer can act on.

**feedtack** is a drop-in React feedback overlay. Non-technical stakeholders click anywhere on a page, leave a comment, and feedtack emits a structured JSON payload so complete that an LLM can attempt a first-pass fix before consuming developer hours.

## Install

```bash
npm install feedtack
# or
pnpm add feedtack
```

## Quick start

```tsx
import { FeedtackProvider } from 'feedtack/react'
import { ConsoleAdapter } from 'feedtack'

export default function App() {
  return (
    <FeedtackProvider
      adapter={new ConsoleAdapter()}
      currentUser={{ id: 'u1', name: 'Trillium', role: 'admin' }}
    >
      <YourApp />
    </FeedtackProvider>
  )
}
```

## Production — webhook adapter

```tsx
import { FeedtackProvider } from 'feedtack/react'
import { WebhookAdapter } from 'feedtack'

const adapter = new WebhookAdapter({
  submitUrl: 'https://your-app.com/api/feedtack',
  updateUrl: 'https://your-app.com/api/feedtack/update', // optional
  loadFeedback: async (filter) => {
    const res = await fetch(`/api/feedtack?pathname=${filter?.pathname ?? ''}`)
    return res.json()
  },
})

export default function App() {
  return (
    <FeedtackProvider
      adapter={adapter}
      currentUser={{ id: 'u1', name: 'Alice', role: 'designer', avatarUrl: '/alice.jpg' }}
      hotkey="p"        // default: Shift+P
      adminOnly         // only show button to users with role === 'admin'
      onError={console.error}
    >
      <YourApp />
    </FeedtackProvider>
  )
}
```

## Custom adapter

```ts
import type { FeedtackAdapter } from 'feedtack'

class MySupabaseAdapter implements FeedtackAdapter {
  async submit(payload) { /* POST to supabase */ }
  async reply(feedbackId, reply) { /* insert reply */ }
  async resolve(feedbackId, resolution) { /* update resolved */ }
  async archive(feedbackId, userId) { /* insert archive record */ }
  async loadFeedback(filter) { /* select from supabase */ }
}
```

## The payload

Every pin emits a versioned JSON payload:

```json
{
  "schemaVersion": "1.0.0",
  "id": "ft_01j...",
  "timestamp": "2026-04-09T13:42:00.000Z",
  "submittedBy": { "id": "u1", "name": "Alice", "role": "designer" },
  "comment": "This button doesn't do anything",
  "sentiment": "dissatisfied",
  "pins": [{
    "index": 1,
    "color": "#ef4444",
    "x": 420, "y": 812,
    "xPct": 29.2, "yPct": 78.4,
    "target": {
      "selector": "#submit-btn",
      "best_effort": false,
      "tagName": "BUTTON",
      "textContent": "Place Order",
      "attributes": { "id": "submit-btn", "disabled": "true" },
      "boundingRect": { "x": 420, "y": 812, "width": 200, "height": 44 }
    }
  }],
  "page": { "url": "https://app.example.com/checkout", "pathname": "/checkout", "title": "Checkout" },
  "viewport": { "width": 1440, "height": 900, "scrollX": 0, "scrollY": 812, "devicePixelRatio": 2 },
  "device": { "userAgent": "Mozilla/5.0...", "platform": "MacIntel", "touchEnabled": false }
}
```

## `useFeedtack` hook

```tsx
import { useFeedtack } from 'feedtack/react'

function MyButton() {
  const { activatePinMode, isPinModeActive } = useFeedtack()
  return <button onClick={activatePinMode}>{isPinModeActive ? 'Cancel' : 'Give Feedback'}</button>
}
```

## What feedtack does NOT do

- LLM triage or routing (downstream concern — feedtack emits, others act)
- Developer dashboard or inbox
- Screenshot annotation

## ICEBOX

- Script tag CDN distribution
- Next.js plugin
- `allowedCaptures` config for scoping DOM access

## License

MIT
