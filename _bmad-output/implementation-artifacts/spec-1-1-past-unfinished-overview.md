---
title: Past unfinished notice and review window
type: feature
created: 2026-11-23
status: done
route: oneshot
---

<frozen-after-approval>
## Intent

Deliver the user's first increment of Epic 1: show a notice with the count of past unfinished tasks when opening the calendar and let the user open a near-full-screen review window. Show all qualifying tasks together with title, date and category, oldest date first. Exclude today's, undated and completed tasks. The upper-left cross closes without modifying tasks; Escape and backdrop clicks do not dismiss. The notice recurs on the next visit while tasks qualify. Editing and completion actions inside this window are explicitly the next increment, not delivered here. Preserve the existing calendar and all saved data.
</frozen-after-approval>

## Implementation Notes

No intent gaps or irreversible actions; local changes only. Scope: model selector, main.js rendering/events, index.html dialog/notice, styles.css, targeted unit/browser tests and documentation. Use native dialog for modal focus isolation and keyboard focus return. Opening the notice is user-triggered, following PRD FR-17; never force the dialog open on background refresh. Read saved records independently for the notice so midnight/other-tab refresh cannot overwrite an editor draft. Show all categories in this review regardless of the calendar filter. On read error do not present stale data as current or overwrite storage. Existing untracked tooling/notes remain untouched. No complete Epic 1 or FR-17/18 completion claim.

## Verification

- 26 model/appearance/holiday/past-overview unit tests passed. Main script syntax and diff whitespace checks passed.
- New isolated Edge browser test passed: selection/count, oldest-first ordering, safe text, category-filter independence, focus, Escape/backdrop retention, explicit closure, repeat visit, unchanged storage and draft preservation.
- Extended checks passed for corrupted storage inside the open modal, recovery and date rollover through the visibility refresh while preserving an editor draft.
- Existing core browser suite passed, covering mutations, failed saves, corrupt data, cross-tab changes, stale edits and focus. Its first run exposed an overwritten existing read-error message; the overview now preserves that message when the app is blocked.
- Visually inspected the 1440px screenshot: near-full-screen opaque panel, cross upper-left, readable dated cards. No real user task data was used. No production deployment or external user trial performed.

## Review Triage Log

- Low, patched: successful recovery could leave an overview-owned global error visible. Track the owned message and clear it only if still displayed, preserving unrelated messages.
- Medium verification gap, patched: added a next-local-day visibility refresh with an active draft; count updates without opening the dialog, altering storage or discarding text.
- Medium verification gap, patched: added open-modal corrupt storage check; stale rows clear, accessible error appears, cross still works and draft/data remain intact.

Independent reviewer found no confirmed mutation, selection or draft-loss defect. Only the blind review layer applies to the oneshot route; no other review layers were configured.
