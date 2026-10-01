---
title: Upcoming task sidebar
type: feature
created: 2026-10-01
status: done
route: oneshot
---

<frozen-after-approval>
## Intent

Add the approved left sidebar: I dag, Denne uken (after today through Sunday), Kommende (next Monday onwards). Show two tasks per section, then Vis mer if more exist, expanding that section inline with Vis mindre to collapse. Periods follow real local today independently of displayed month. Completed tasks remain visible, checked and struck through. Reuse task editing and completion, category colours, times and conflict cues. Clicking a future task must open its date/editor even in another month. Preserve unsaved drafts and storage failures. No new storage schema or dependencies.
</frozen-after-approval>

## Implementation Notes

- Add pure period grouping in model.js, using calendar-day arithmetic across week/month/year and DST boundaries. Sort date then existing time comparator. Keep expansion in transient UI state, not task data.
- Reuse taskCard for sidebar; render it alongside calendar and update all surfaces after mutations. Dates displayed on future task cards distinguish different days. Responsive fallback stacks the sidebar above calendar at narrow widths; desktop layout keeps it left.
- Existing authorized BMAD/setup untracked files remain untouched. Scope is a small reversible sidebar increment, with no outstanding intent gaps.

## Review Triage Log

- Medium, fixed: clicking the prior day's expansion control just after midnight could remove the control and then dereference it for focus. Redraw now restores a matching control or the period heading.
- Medium, fixed: automatic midnight redraw could lose sidebar keyboard focus. Preserve matching task/toggle focus, falling back to the affected heading.
- Low verification gap, fixed: injected failed sidebar completion verifies rollback in both surfaces, draft retention and restored controls before successful retry.
- Low verification gap, fixed: complete the task from sidebar while editing it, preserve draft, then save without a false conflict.
- Low verification gap, fixed: sidebar browser suite uses Europe/Oslo explicitly and verifies Sunday-to-Monday regrouping while preserving a dirty editor.

## Verification

- Eleven model tests passed, including Sunday/Monday, year boundary, DST week sorting and completed inclusion.
- Sidebar browser checks passed: two-row limits, independent inline expansion, conflict/completion updates, focus, month-independent periods, off-month editing, unsaved draft protection, moving tasks between sections, failed writes and midnight/week rollover.
- Prior browser and timetable suites passed with selectors scoped to their intended task surface. Test data stays in isolated browser contexts.
- Desktop screenshot inspected: panel left of calendar with category colours, dates and completion. README updated. No GitHub upload requested.
