---
title: Complete and edit tasks inside the past review
type: feature
created: 2026-11-23
status: done
route: oneshot
---

<frozen-after-approval>
## Intent

Add per-task "Lagre som utført" and "Endre" actions to the existing review window. Completing removes only that task from the unfinished list but retains it in calendar/completed views. Editing uses the existing task fields inside the same dialog. Successful saves return to the updated list and retain the window while tasks qualify; close when none remain. A task moved to another past date stays listed, while moving to today/future or removing the date resolves it. Cancel preserves stored data; confirm before discarding a changed draft. Preserve failed-save drafts and stale-edit protection. Cross closes with the same discard confirmation during editing; Escape/backdrop still cannot close. Do not change the mobile layout, AI or other planning scope.
</frozen-after-approval>

## Implementation Notes

No intent gaps or irreversible changes: reuse the existing reversible task mutations and editor validation. Small footprint: app/main.js editor host/finish routing, modal markup/styles, targeted Playwright tests and delivery notes. Existing generic editor remains the only form. The modal list is hidden while editing; refresh never closes or replaces a modal editor when another tab resolves its task. Read errors and action errors have separate elements. Completion uses the displayed record as its optimistic comparison snapshot. Retain current calendar draft protections: starting another edit asks before discarding; merely opening/closing the review preserves background drafts. Deletion remains in the ordinary calendar editor, not a new review action. Preserve existing untracked files and do not push.

## Verification

26 existing unit tests passed; main.js syntax and whitespace checks passed. Isolated Edge action checks passed for completion, same-past-date rescheduling, moving to today, removing date with paired-time validation, cancel/discard confirmation, failed completion/save, stale edits after another tab resolves the final task, final-window closure and retained completed records. Existing overview browser checks and core task CRUD/storage browser checks passed. Screenshots of list and editor inspected. No production deployment or external user acceptance claimed.

## Review Triage Log

- Medium, patched: completion failure disabled the focused button and did not restore focus. Restore the triggering button or a surviving modal action; quota-failure test verifies focus.
- Medium, patched: list rebuild on another-tab update removed the focused action. Preserve task identity/action and restore the matching control or a surviving fallback. Cross-tab test waits for the old button to detach and verifies focus on its replacement.

The configured independent blind reviewer found two concrete issues, both fixed. No additional review layers were configured for this oneshot route.
