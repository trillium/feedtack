# FeedTack — Simplify & Streamline

## Problem
FeedTack (currently v1.4.0) needs a simplification and UX pass. Users need better visual feedback about what is highlighted or selected. The supply data pipeline may also need enrichment.

## Intent
- Simplify the codebase — reduce complexity without losing functionality
- Improve visual feedback for highlighted/selected state so users always know what the tool is acting on
- Evaluate whether supply data needs enrichment (more metadata? different format?) and how to do it

## Open Questions for Architecture Pass
- What specifically is visually unclear to users currently? (needs user testing or issue review)
- Is the supply data schema flexible enough for planned use cases?
- What does "enrichment" look like? (fetching metadata, adding tags, AI summarization?)
- Are there any obvious dead code paths or abstraction layers that can be removed?
- Does the Playwright reporter integration (added in v1.4.0) need any cleanup?

## Repo
`~/code/feedtack/`

## Related
- FeedTack npm package (public, 20+ versions)
- Autaly.ai visual test suite (uses feedtack's Playwright reporter)
