# feedtack

> Click anywhere. Drop a pin. Get a payload a developer can act on.

**feedtack** is a drop-in DOM feedback overlay for web apps. Non-technical stakeholders click anywhere on a page, leave a short comment, and feedtack emits a structured JSON payload so complete that a developer (or LLM, or ticket system) can act on it without asking any follow-up questions.

## The problem

Non-technical stakeholders describe UI problems in words. Developers need coordinates, element state, viewport size, page URL, component hierarchy, and application state. There is always a gap. feedtack closes it.

## What it does

- **Click-anywhere pin UI** — floating toggle, crosshair cursor, pin marker
- **Automatic metadata capture** — element path, viewport, scroll position, page state, device info
- **Comment form** — minimal textarea + submit, no friction
- **Structured JSON payload** — LLM-ready but not LLM-dependent
- **Pluggable backends** — Supabase out of the box, local JSON fallback, bring your own

## What it does not do

feedtack is **Tool 1**: capture and emit. It does not triage, summarize, or route feedback. That is a downstream concern. The payload is the product.

## Install

```bash
npm install feedtack
```

### Script tag (any site)

```html
<script src="https://unpkg.com/feedtack/dist/feedtack.min.js"></script>
<script>
  Feedtack.init({ projectId: 'your-project-id' });
</script>
```

### React / Next.js

```tsx
import { FeedtackProvider } from 'feedtack/react';

export default function RootLayout({ children }) {
  return (
    <FeedtackProvider projectId="your-project-id">
      {children}
    </FeedtackProvider>
  );
}
```

## The payload

Every pin emits a payload like this:

```json
{
  "id": "fb_01j...",
  "timestamp": "2026-04-09T13:42:00.000Z",
  "comment": "This button doesn't do anything",
  "target": {
    "selector": "#checkout-form > button.submit",
    "tagName": "BUTTON",
    "textContent": "Place Order",
    "boundingRect": { "x": 420, "y": 812, "width": 200, "height": 44 },
    "attributes": { "id": "submit-btn", "class": "submit btn-primary", "disabled": "true" }
  },
  "page": {
    "url": "https://app.example.com/checkout",
    "title": "Checkout — Acme Store",
    "pathname": "/checkout"
  },
  "viewport": {
    "width": 1440,
    "height": 900,
    "scrollX": 0,
    "scrollY": 812,
    "devicePixelRatio": 2
  },
  "device": {
    "userAgent": "Mozilla/5.0...",
    "platform": "MacIntel",
    "touchEnabled": false
  },
  "pin": {
    "x": 520,
    "y": 834,
    "xPct": 36.1,
    "yPct": 92.7
  }
}
```

A developer who was not present, on a different device, in a different timezone, should be able to read this and know exactly what the user was looking at, what state the app was in, and what they meant.

## Self-hostable

feedtack has no required SaaS dependency. Run your own backend or use the local JSON adapter during development.

## License

MIT
