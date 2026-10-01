---
title: Tidy completed tasks without deleting them
type: feature
created: 2026-10-01
status: done
route: oneshot
---

<frozen-after-approval>
## Intent

Add Rydd side to remove completed tasks from ordinary calendar, timetable and upcoming lists without deleting data. Add Fullført to show all completed records, including those not yet tidied. Users may reopen a completed task to restore it to its date. Completion alone still leaves a struck-through task visible until explicit cleanup. Preserve saved title, description, category and time values. Cleanup covers all completed dates, not only the currently displayed month; explain its effect beside the controls.
</frozen-after-approval>

## Implementation Notes

- Optional archived boolean on existing task records; absent means not archived. Only completed tasks may be archived. Reopening clears archived. Bulk cleanup uses the existing write lock and reads latest storage before mutation; failure changes no visible state.
- Completed panel is a toggle above the calendar, with dates and reusable task editing/checkbox controls. Preserve open drafts across cleanup and completion, updating only the local archive/completion snapshot fields when changed by this tab.
- No deletion, migration or external side effects. Unit/browser checks cover saved record retention, all-date list, cross-surface removal, reload, reopen and failed storage.

## Review and verification

- Independent review found no actionable defect in record retention, latest-data writes, editor preservation or reopening. Three low verification gaps addressed: external edits followed by cleanup still reject stale draft saves; reopening while editing preserves the draft and both flags; a past-year task returns to its original month.
- Thirteen model tests passed. Completed browser suite passed for failed cleanup, durable archive, all-date inventory, reopening, details retention, explicit cleanup only, dirty editor retention and two-tab conflict protection. Existing sidebar and timetable suites passed.
- Desktop screenshot inspected; README and UX decision log updated. All tests use isolated browser data. No GitHub push requested.
