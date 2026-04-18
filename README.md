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

## Adapter recipes

The `FeedtackAdapter` interface has five methods. Here are copy-paste implementations for common backends.

### Disk / JSON files (Node.js)

Git-trackable feedback — each submission becomes a JSON file in `.feedback/`.

```ts
import type { FeedtackAdapter, FeedbackItem, FeedtackPayload } from 'feedtack'
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'

const DIR = '.feedback'

class DiskAdapter implements FeedtackAdapter {
  async submit(payload: FeedtackPayload) {
    await mkdir(DIR, { recursive: true })
    const item: FeedbackItem = { payload, replies: [], resolutions: [], archives: [] }
    await writeFile(join(DIR, `${payload.id}.json`), JSON.stringify(item, null, 2))
  }

  async reply(feedbackId: string, reply: Omit<FeedbackItem['replies'][0], 'id' | 'feedbackId'>) {
    const item = await this.read(feedbackId)
    item.replies.push({ ...reply, id: crypto.randomUUID(), feedbackId })
    await this.write(feedbackId, item)
  }

  async resolve(feedbackId: string, resolution: Omit<FeedbackItem['resolutions'][0], 'feedbackId'>) {
    const item = await this.read(feedbackId)
    item.resolutions.push({ ...resolution, feedbackId })
    await this.write(feedbackId, item)
  }

  async archive(feedbackId: string, userId: string) {
    const item = await this.read(feedbackId)
    item.archives.push({ feedbackId, archivedBy: { id: userId, name: '', role: '' }, timestamp: new Date().toISOString() })
    await this.write(feedbackId, item)
  }

  async loadFeedback() {
    await mkdir(DIR, { recursive: true })
    const files = (await readdir(DIR)).filter((f) => f.endsWith('.json'))
    return Promise.all(files.map(async (f) => JSON.parse(await readFile(join(DIR, f), 'utf-8')) as FeedbackItem))
  }

  private async read(id: string) { return JSON.parse(await readFile(join(DIR, `${id}.json`), 'utf-8')) as FeedbackItem }
  private async write(id: string, item: FeedbackItem) { await writeFile(join(DIR, `${id}.json`), JSON.stringify(item, null, 2)) }
}
```

### Supabase

```ts
import type { FeedtackAdapter, FeedbackItem, FeedtackFilter, FeedtackPayload } from 'feedtack'
import type { SupabaseClient } from '@supabase/supabase-js'

class SupabaseAdapter implements FeedtackAdapter {
  constructor(private supabase: SupabaseClient) {}

  async submit(payload: FeedtackPayload) {
    await this.supabase.from('feedtack_submissions').insert({ id: payload.id, data: payload })
  }

  async reply(feedbackId: string, reply: Omit<FeedbackItem['replies'][0], 'id' | 'feedbackId'>) {
    await this.supabase.from('feedtack_replies').insert({ feedback_id: feedbackId, ...reply })
  }

  async resolve(feedbackId: string, resolution: Omit<FeedbackItem['resolutions'][0], 'feedbackId'>) {
    await this.supabase.from('feedtack_resolutions').insert({ feedback_id: feedbackId, ...resolution })
  }

  async archive(feedbackId: string, userId: string) {
    await this.supabase.from('feedtack_archives').insert({ feedback_id: feedbackId, user_id: userId })
  }

  async loadFeedback(filter?: FeedtackFilter): Promise<FeedbackItem[]> {
    let query = this.supabase.from('feedtack_submissions').select('*, feedtack_replies(*), feedtack_resolutions(*), feedtack_archives(*)')
    if (filter?.pathname) query = query.eq('data->>page->>pathname', filter.pathname)
    const { data } = await query
    return (data ?? []).map((row) => ({
      payload: row.data,
      replies: row.feedtack_replies ?? [],
      resolutions: row.feedtack_resolutions ?? [],
      archives: row.feedtack_archives ?? [],
    }))
  }
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
