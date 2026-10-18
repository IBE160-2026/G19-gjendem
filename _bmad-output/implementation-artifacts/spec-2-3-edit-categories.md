---
title: Edit category names and colours
type: feature
created: 2026-10-18
status: done
route: oneshot
---

<frozen-after-approval>
## Intent

Implement story 2.3 as authorised: Administrer kategorier opens a single list of all categories. Each row offers name, preset colours, a custom colour picker and a live card preview. Save explicitly; cancel leaves saved data unchanged. Changes apply to every task including archived/completed tasks. Renaming Ellers preserves its role as the default. Category deletion and calendar backgrounds are outside this increment.

Given existing tasks, when their category is renamed/recoloured, then identity, dates, titles, descriptions, completion and archive state are preserved across reload. Given a task draft, when categories are edited, then its fields and selected category remain intact. Given invalid/duplicate names, stale edits or storage failure, when saving, then retain the category draft and explain the error without overwriting saved changes. Preview must not modify persisted data and must keep text and conflict cues readable.
</frozen-after-approval>

## Implementation Notes

No outstanding intent questions. Small reversible extension of existing model and view. Preserve current task.category values as immutable IDs; expose display names/colours through optional categoryOverrides in the existing envelope. This avoids migrating task records. Built-in Ellers stays the default ID. New custom category IDs must avoid all existing IDs even when an old name is reused. Validate overrides against existing IDs; task mutations preserve metadata. Save individual rows with optimistic category snapshot comparison inside the existing Web Lock. Existing unrelated planning changes remain untouched.

Implemented in app/model.js, main.js, index.html and styles.css. Added model coverage and category-edit-check.mjs; updated both README guides. Each row saves independently; name uniqueness is checked against display names. Category forms retain independent drafts and trigger unload warnings. Colours use the existing pale tint and accent treatment, preserving conflict text. No task migration or eager storage write is required.

## Review Triage Log

- Medium, patched: creating a category while management was open left it absent from that list until reopening. drawManager now reconciles after creation, retaining the existing DOM for dirty category rows. Browser regression verifies the new row appears and an unrelated draft survives. The independent reviewer found no further defensible issues; no findings deferred.

## Verification

- 18 Node model tests pass, covering stable IDs, renamed defaults, reused names, archived task preservation, malformed metadata, stale edits and failed writes.
- Isolated Edge category-edit checks pass: presets/custom colour, preview and cancel, all-task display, preserved task drafts, duplicate errors, write failures, cross-tab stale edits and dynamic management rows.
- Existing categories, core and timetable browser suites pass. Desktop management screenshot inspected. Tests used isolated browser profiles; no personal task data was accessed.
