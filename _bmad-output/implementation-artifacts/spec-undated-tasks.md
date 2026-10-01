---
type: feature
created: 2026-10-01
status: done
route: oneshot
---

# Undated tasks

<frozen-after-approval>
## Intent
Let users capture tasks before deciding a date, as required by the PRD. Add a Norwegian Uten dato list beside the existing completed-list control. Keep the calendar, optional description, categories and completion behavior consistent. Undated means an empty date string, not a separate task type. Existing storage remains readable without migration.

Given a new task, when saved without a date or times, then it persists in Uten dato and is absent from the calendar and upcoming periods.
Given an undated task, when the user assigns a date, then the same task appears on that calendar day with its details retained. Clearing a dated task's date reverses this operation.
Given clock times without a date, when saving, then an explanation blocks the save and preserves the draft.
Given an undated completed task, when Rydd side is used, then the record remains in Fullført. Reopening restores it to Uten dato.
Given an unsaved undated editor, when another task is completed or cleanup runs, then the editor retains its draft. Failed writes and stale edits retain existing protections.

Implement model validation in app/model.js, list and editor integration in app/main.js, panel markup/styles in app/index.html and app/styles.css. Verify persistence invariants in app/model.test.mjs and the browser lifecycle in app/undated-check.mjs. No cloud sync, new dependencies or AI classification is included.
</frozen-after-approval>

## Implementation Notes
- A separate editor host supports undated drafts without inventing a calendar date.
- Date is optional; clock times still require a date and a complete same-day interval.
- Completed-list labels now refer to the overview, covering both dated and undated tasks.

## Review Triage Log
- Low, fixed: README incorrectly described dates as mandatory; updated the feature description and test command.
- Low, fixed: new-draft completion coverage was missing; browser checks now retain title, description and category through an unrelated completion, reject discard, then save successfully.
- Low, fixed: undated cross-tab coverage was missing; scheduling and deletion in another tab now verify conflict errors, retained drafts and unchanged newer storage.
- Low, fixed: scheduling coverage used the current month only; browser checks now navigate to February of the next year and verify the destination day.
- Low, fixed: preservation assertions were incomplete; checks now use a nondefault category, track the same task ID and verify an unrelated record remains unchanged.

## Verification
- All 14 model tests passed.
- Browser suites passed: undated tasks, completed cleanup, time picker, timetable, descriptions.
- Inspected a full-page browser screenshot: Norwegian controls, category colours and new panel fit the existing layout.
- Tests use isolated browser contexts and leave the user's saved tasks untouched.
- No review findings deferred. Saved locally; no remote push requested for this increment.
