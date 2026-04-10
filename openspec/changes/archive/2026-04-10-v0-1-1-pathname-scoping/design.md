## Context

Pins store absolute pixel coordinates and page metadata at capture time. When an SPA navigates to a new route, the DOM layout changes but the feedtack state does not — causing pins from one page to bleed into another.

## Decision

### 1. Pathname tracking via history patch
Track `window.location.pathname` in React state. Detect SPA navigation by patching `history.pushState` and `history.replaceState`, plus listening to `popstate` for browser back/forward. On pathname change, re-call `loadFeedback({ pathname })` to load the new page's pins.

**Why patching history:** There is no standard browser event for `pushState`/`replaceState` — patching is the established approach used by analytics and routing libraries. The patch is cleaned up on unmount.

### 2. Render-time pathname filter as safety net
Even after reloading, rendered pin markers are filtered by `item.payload.page.pathname === currentPathname`. This prevents stale state from ever leaking through regardless of adapter timing.
