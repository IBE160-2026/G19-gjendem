---
title: Calendar appearance with saved previews
type: feature
created: 2026-10-18
status: done
route: oneshot
---

<frozen-after-approval>
## Intent

Deliver the approved Epic 3 stories together: customise the surrounding background with colour or a local photo, customise calendar and day-cell colours, preview immediately, and explicitly Save or Cancel. Photos cover the surrounding viewport with centred cropping. Remember saved choices on reopening. Reset restores standard appearance only, requiring Save to persist; tasks and categories remain unchanged. Preserve the user's previous calendar-first layout.

Given a draft, changing a colour/photo previews it without writing storage. Cancel restores the latest saved appearance; Save persists and survives reload. Given reset, preview defaults and preserve all tasks/categories. Given a failed image or storage write, retain the prior valid draft and explain the error. Given another tab saved after opening, reject stale saves and offer Cancel/reopen. Task/category drafts are independent. Arbitrary backgrounds must not hide text, today marking, category colours or red conflict cues.
</frozen-after-approval>

## Implementation Notes

One cohesive appearance editor, no further intent gaps or irreversible changes. Separate versioned localStorage key protects task records and avoids image copying during task saves. Standalone appearance module, explicit server allowlist entry, markup and CSS variables. JPG/PNG/WebP up to 10 MiB, decoded dimensions limited to 40 MP, resize to 1600px maximum dimension, flatten/re-encode JPEG and cap saved data URL at 1.5 million characters. No upload or external image URLs. Use black/white contrast-selected text for chosen calendar/day colours, neutral opaque panels for forms and header/footer. Async image processing is invalidated on Cancel/reset/removal or newer selection. Saved drafts use raw snapshot comparison under Web Locks. Existing unrelated planning modifications remain untouched.

Implemented appearance.js plus server allowlist, HTML controls and CSS variables. Included the prior user-approved move of the calendar above management controls. Main task persistence now excludes the independently owned appearance controls to prevent overlapping operations restoring stale disabled states. Saved appearance never writes the task/category storage key. UI instructions explicitly distinguish preview/reset from persistence. Local server restarted to expose the new module.

## Verification

20 model tests pass, including appearance validation, failed/stale writes and contrast checks across 4096 RGB samples. Isolated Edge appearance suite passes preview/Cancel, saved reload, reset, image conversion and invalid images, delayed-image cancellation, failed saves, cross-tab stale saves, task-draft/data preservation, dark surfaces, simultaneous task/appearance saves, error legibility and keyboard focus. Existing core, category-edit and timetable browser suites pass. Desktop dark-theme screenshot visually inspected. No personal images/tasks used.

## Review Triage Log

- Medium, patched: main task persist could snapshot appearance controls while disabled and later leave them disabled. Excluded independently owned appearance controls from task operation locking; delayed-lock regression passes.
- Medium, patched: fixed-red task errors were invisible on matching custom surfaces. Added opaque neutral background for #message.error; actual failed task write against red calendar verified.
- Medium, patched: blue focus outline could disappear on matching day colour. Added black outline with white outer ring; keyboard focus against blue background verified.

All three independent review findings addressed; nothing deferred. No GitHub push requested.
