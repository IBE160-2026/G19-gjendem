---
title: Expanded day timetable with optional task times
type: feature
created: 2026-10-01
status: done
route: oneshot
---

<frozen-after-approval>
## Intent

Continue the calendar with optional start/end times, an expanded day timetable, and a right-side list of that day's tasks without time. Day date opens the expanded view; plus opens its inline editor, and hour buttons prefill start with no automatic end. Save collapses the day; failure keeps input. Sort timed tasks by start, keep categories and visible completion, and flag both conflicting titles red with an Overlapper text cue. Preserve all existing tasks without migrating storage. Left upcoming sidebar remains a later increment.
</frozen-after-approval>

## Implementation Notes

- Reuse model.js persistence and main.js editor; extract reusable task-card rendering so month, timetable and untimed panel share behavior. Render all 24 hours in a scrollable timeline, with full minute precision in fields and task labels.
- User confirmed on 2026-10-01: only incomplete tasks contribute conflicts; start/end must be same day in this increment. Both times or neither; touching boundaries do not conflict. No overnight support.
- Add model and browser checks for invalid pairs, adjacent/overlapping times, legacy tasks, sorting, time prefill, right-panel separation, successful collapse, failed-save retention and completion propagation. Preserve cross-tab optimistic checks and write locks.
- Existing untracked BMAD/setup artifacts remain untouched. This additive local feature has no external side effects or automatic user-data writes.

## Review Triage Log

- Low, fixed: prior browser test counted both month and expanded-day copies after canceling deletion; scope the count to month cards.
- Low, fixed: initial scroll subtracted offsets from different coordinate systems; scroll to the slot's offset within the positioned timeline.
- Low verification gap, fixed: sorting fixture reused IDs and could pass with no sorting; use distinct IDs and verify chronological order with untimed last.
- Low verification gap, fixed: browser test changes times, toggles completion twice while the editor stays open, checks preserved fields, then saves successfully.
- Low verification gap, fixed: browser test changes times from another tab and checks stale save/delete rejection while entered times remain intact.
- Low performance suggestion, rejected for this increment: pairwise conflict detection compares tasks on all dates. The local personal dataset is small; no observed performance failure. Grouping/indexing can be added if measured usage warrants it.

## Verification

- Nine model tests passed, covering paired times, invalid/overnight intervals, minute precision, adjacent boundaries, complete/untimed/different-day exclusions and sorting alongside previous persistence tests.
- Existing Edge browser suite passed after adapting selectors to multiple task surfaces.
- New timetable Edge suite passed: 24-hour access, ordered rows, selected-day untimed separation, start-only prefill, validation, red conflict text, completion/reopen, adjacent intervals, reload, removing times, failed-save draft retention, same-tab draft preservation and cross-tab stale-write rejection.
- Inspected full-page screenshot for desktop calendar, expanded timetable and right untimed list. Tests use isolated storage. README and UI guidance updated. Left upcoming sidebar remains unimplemented.
