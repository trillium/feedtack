# feedtack

> Click anywhere. Drop a pin. Leave a note. Get a payload a developer can act on.

**feedtack** is a drop-in React feedback overlay. A "Feedback" button opens a modal where anyone can leave site-wide notes, page-level comments, or place a pin on a specific element — all from one entry point. feedtack emits a structured JSON payload so complete that an LLM can attempt a first-pass fix before consuming developer hours.

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

Git-trackable feedback — each submission becomes a JSON file in `.feedback/`. `DiskAdapter` ships with the package and also implements `ContentAdapter` + `ContentEditAdapter`.

```ts
import { DiskAdapter } from 'feedtack/node'

const adapter = new DiskAdapter({ directory: '.feedback' }) // default: '.feedback'
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

Every submission emits a versioned JSON payload. The `scope` field indicates where the feedback lives.

**Element-scoped (pinned to a specific element):**

```json
{
  "schemaVersion": "2.0.0",
  "id": "ft_01j...",
  "timestamp": "2026-04-09T13:42:00.000Z",
  "submittedBy": { "id": "u1", "name": "Alice", "role": "designer" },
  "scope": "element",
  "comment": "This button doesn't do anything",
  "sentiment": "bad",
  "pins": [{
    "index": 1,
    "color": "#ef4444",
    "x": 420, "y": 812,
    "xPct": 29.2, "yPct": 78.4,
    "target": {
      "selector": "#submit-btn",
      "best_effort": false,
      "tagName": "BUTTON",
      "dataTestId": "submit-btn",
      "ancestors": ["form#checkout", "main"],
      "boundingRect": { "x": 420, "y": 812, "width": 200, "height": 44 }
    }
  }],
  "page": { "url": "https://app.example.com/checkout", "pathname": "/checkout", "title": "Checkout" },
  "viewport": { "width": 1440, "height": 900, "scrollX": 0, "scrollY": 812, "devicePixelRatio": 2 },
  "device": { "userAgent": "Mozilla/5.0...", "platform": "MacIntel", "touchEnabled": false }
}
```

**Page or site-scoped (no pin):**

```json
{
  "schemaVersion": "2.0.0",
  "id": "ft_01k...",
  "scope": "page",
  "comment": "This page is really confusing — too many steps",
  "sentiment": "bad",
  "pins": [],
  "page": { "url": "https://app.example.com/checkout", "pathname": "/checkout", "title": "Checkout" },
  ...
}
```

`sentiment` values: `"good"` | `"bad"` | `null`

## Feedback scopes

Feedtack supports three levels of feedback, all accessible from the modal:

| Scope | When to use | Pins |
|-------|-------------|------|
| `site` | Config-level feedback affecting the whole site (e.g. "change the font everywhere") | None |
| `page` | Feedback specific to the current page (e.g. "this page is confusing") | None |
| `element` | Feedback pinned to a specific element (e.g. "this button doesn't work") | One or more |

**How it works:**
- Clicking "Feedback" opens the modal
- The modal has **Site** and **Page** tabs for scope-level feedback
- "Place a pin" in the modal footer activates crosshair mode — useful on mobile too
- `Shift+P` anywhere on the page opens the modal

## `useFeedtack` hook

```tsx
import { useFeedtack } from 'feedtack/react'

function MyButton() {
  const { openModal, closeModal, isModalOpen, activatePinMode, isPinModeActive } = useFeedtack()
  return <button onClick={openModal}>{isModalOpen ? 'Close' : 'Give Feedback'}</button>
}
```

## Content approval (opt-in)

Feedtack can also track whether copywriting fields on a page have been reviewed and approved. Annotate elements with `data-feedtack-field`, use an adapter that implements `ContentAdapter` (`DiskAdapter` and `WebhookAdapter` both do), and call the hook:

```tsx
<h1 data-feedtack-field="hero.heading">Welcome to Acme</h1>
<p data-feedtack-field="hero.subheading">The best tools for your team.</p>
```

```tsx
import { useContentApproval } from 'feedtack/react'

const { fields, approve, checkDeploy } = useContentApproval(adapter, currentUser.id)

// Gate deploys on all fields being approved
const result = await checkDeploy()
// => { approved: false, pending: ['hero.subheading'] }
```

Approvals are hash-based — if the content changes, the approval goes stale automatically. See the [Content Approval docs](https://feedtack.vercel.app/docs/concepts/content-approval) for the full API.

## Content editing (opt-in)

For teams that want to edit content inline, `useContentEdit` builds on top of content approval. It hydrates the DOM with stored values, makes annotated fields `contenteditable`, and auto-saves on blur. The adapter must implement `ContentEditAdapter` (`DiskAdapter` and `WebhookAdapter` both do).

```tsx
import { useContentEdit, ContentEditToolbar } from 'feedtack/react'

function AdminLayout({ adapter, children }) {
  const edit = useContentEdit(adapter, currentUser.id)

  return (
    <>
      {children}
      {edit.active && <ContentEditToolbar {...edit.toolbarProps} />}
      <button onClick={edit.active ? edit.deactivate : edit.activate}>
        {edit.active ? 'Exit edit mode' : 'Edit content'}
      </button>
    </>
  )
}
```

The toolbar shows approve/revert actions per field, a session changes panel, and a deploy gate. See the [Content Editing docs](https://feedtack.vercel.app/docs/concepts/content-editing) for details.

## What feedtack does NOT do

- LLM triage or routing (downstream concern — feedtack emits, others act)
- Developer dashboard or inbox
- Screenshot annotation

## ICEBOX

- Vanilla JS content editing (no React dependency)
- Script tag CDN distribution
- Next.js plugin
- `allowedCaptures` config for scoping DOM access

## License

MIT
