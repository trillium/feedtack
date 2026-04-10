## Proposal: Pathname-Scoped Pin Rendering

Pins placed on one page were rendering on all other pages in SPA apps. This fix scopes persisted pin markers to the pathname they were captured on, and reloads feedback whenever the user navigates to a new route.

**Target version:** 0.1.1
