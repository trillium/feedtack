# feedtack — Designer Questions

Answers to these questions drive the OpenSpec proposal, specs, and design artifacts.

---

## Proposal — WHY and WHAT

1. **The problem statement in one sentence**: Is feedtack solving "feedback gets lost in translation" or "developers lack enough context to reproduce issues"? These are related but the framing changes what counts as success.

Users need to be able to give feedback about specific parts of the codebase or UI etc so that an LLM can first pass try to solve them before taking on developer hours.

The goal is to allow users to do basic updates via LLM that don't need developer insigh.

2. **Who are the two users?** The person clicking (stakeholder) and the person receiving (developer/agent). Are there more personas — e.g. a product manager who reviews before routing?

Stakeholder
Designer
Copy Writer
Partner

3. **What does "done" look like for v1?** A stakeholder drops a pin → what happens next? Does feedtack just emit JSON to a webhook, store to Supabase, write to a file? What's the minimum viable delivery path?

A tack is emitted via JSON to a webhook, it contains all relevant data around where the tack is placed, as well as commentary from the user via a text box.

---

## Specs — WHAT (observable behavior)

4. **Pin activation UX**: Does the stakeholder toggle a floating button, use a keyboard shortcut, or is the overlay always-on? Who controls visibility — the host app or the stakeholder?
   An admin nav has the a button to place a pin, pin can also be used as a hotkey, the hotkey needs to be visible in the button text.

5. **Pin placement**: One pin per session, or can multiple pins be dropped before submitting? Does each pin submit independently, or is there a "send all" action?
   As many pins as necessary, a comment can also have multiple pins, color coded.

6. **Comment form**: Required or optional? Minimum/maximum length? Any structured fields (severity, type) or pure freeform?
   required form. Can also have simple toggle like "satisfied" vs "dissatisfied" that are just concept scope, not directly actionable.

7. **Error conditions to spec**: What happens when Supabase is unreachable? What happens if the user cancels mid-pin? What if the page navigates while a pin is open?
   Supabase is not the target, JSONL webhook is the target.

8. **Payload schema ownership**: Is the JSON schema versioned and stable (breaking changes require a major bump), or is it internal and free to evolve?
   yes, versioned and stable is the target.

9. **What metadata is mandatory vs optional?** Some DOM targets (canvas, SVG, iframes) resist standard selector paths. Is a best-effort payload acceptable, or should feedtack block submission if it can't fully describe the target?

We will be building this within react apps mostly, so less worry about canvas for now.

---

## Design — HOW

10. **DOM isolation strategy**: Shadow DOM, iframe, or plain div with aggressive CSS reset? The choice affects portability vs styling complexity.
    Please give examples of this so I understand the distinction

11. **State model**: Is in-progress feedback (pin placed, comment not yet submitted) persisted across page reloads, or lost on navigation?

Persisted, use will want the abibility to go back and verify that the solve fixes their problem. There should be a `response` ability IE a chat where other team members or an LLM can reply. If one team member thinks it is resolved, it can be marked resolved. User still should have the ability to check on stuff, and archive their comment.

Multiple people shold be able to archive a comment independent of eachother, users should know who has checked resolved and archive

12. **Backend adapter interface**: Should adapters be user-supplied plugins, or is the adapter list fixed (Supabase, local JSON, webhook)? What's the plugin contract?
    Please give examples of this so I understand the distinction

13. **Distribution targets**: Script tag CDN, npm ESM, React provider, Next.js plugin — which are in scope for v1 vs later?

should be an import

14. **Selector strategy for hostile DOM**: What's the fallback hierarchy when `id` → `data-testid` → CSS selector → XPath all fail or produce unstable paths?

Please give examples of this so I understand the distinction

15. **Security boundary**: The overlay runs inside the host app. What's the trust model — does it have access to `window.__STATE__`, Redux store, cookies? Should it, or is that a privacy line?

everything for now, scope down later.

---

## Cross-cutting

16. **OpenSpec domain partition**: How should `openspec/specs/` be sliced — by layer (`pin-ui`, `metadata-capture`, `payload-schema`, `backend-adapters`) or by user journey (`capture-flow`, `delivery-flow`)?

Please give examples of this so I understand the distinction

17. **What is explicitly out of scope for the spec?** You've said no LLM triage, no dashboard, no screenshot annotation — should these be `REMOVED` stubs in the spec to signal intent, or simply absent?

they can be labeled ICEBOX
