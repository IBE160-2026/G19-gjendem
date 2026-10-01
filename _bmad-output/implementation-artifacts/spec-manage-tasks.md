---
title: Edit, complete and delete existing calendar tasks
type: feature
created: 2026-10-01
status: done
route: oneshot
---

<frozen-after-approval>
## Intent

Extend the approved local calendar so users can click a task to edit its title/date/category, mark it complete with an independent checkbox while retaining visible strikethrough text, reopen it, and delete it after confirmation. Keep saved legacy tasks working. Retain inline editing, collapse after successful save, and preserve input on failed writes. Scheduling and sidebars remain outside this increment. User authorized implementation on 2026-10-01.
</frozen-after-approval>

## Implementation Notes

- Existing app/model.js owns persistence and app/main.js owns rendering/editor; reuse current lock name and storage envelope. Add optional completed boolean, treating legacy omission as false. Compare original task with latest storage before edits/deletes to reject stale writes without resurrecting deleted tasks. Completion reads latest task and changes only the boolean.
- No installation, migration or automatic user-data changes. Existing unrelated untracked BMAD/setup files stay untouched. Changes limited to app model/UI/tests/docs and this record. Small reversible first task-management increment, no remaining intent gaps.

## Review Triage Log

- Medium, fixed: completing an open task invalidated its same-tab editor snapshot; successful local checkbox writes now update that snapshot's completion field. Browser regression saves the edited task after toggling twice.
- Medium, fixed: checkbox writes could miss another tab's changes received while awaiting the write lock; after success, redraw from the freshly read task collection when no editor is open. With an editor open, preserve the draft, announce external changes and refresh on cancel/save.
- Low verification gap, fixed: browser test injects a failed checkbox write, checks rollback/unlocked controls, restores storage and retries successfully.
- Low verification gap, fixed: browser tests stale editing and externally deleted task conflict feedback, retained text, cancel and reopen recovery.
- Low verification gap, fixed: browser check asserts computed line-through styling after completion and reload.

## Verification

- Seven Node model tests passed, including legacy data, edit/completion/delete persistence, failed writes and stale record protection.
- Edge browser suite passed: create, edit title/date/category, move month, complete/reopen, same-tab checkbox while editing, cancel/confirm deletion, reload, failed writes, cross-tab conflicts, corrupt storage and focus checks. Uses isolated browser data, never the user's tasks.
- README and in-app guidance updated. No GitHub push requested for this increment.
