---
title: One photo behind the calendar grid
type: feature
created: 2026-10-18
status: done
route: oneshot
---

<frozen-after-approval>
## Intent

Add a separate photo choice under Tilpass utseende for one continuous cover-cropped picture behind the whole monthly day grid, as explicitly selected by the user. Do not repeat a picture per cell. Date labels, today, tasks and conflicts remain readable. Preview, Save, Cancel, remove and reset behave like the existing surrounding photo. Keep the surrounding photo independently configurable and preserve all tasks, categories and previous appearance preferences. Given an older saved appearance, loading without a grid photo must remain valid; given two pending photos, cancelling/removing either must not resurrect it or overwrite the other.
</frozen-after-approval>

## Implementation Notes

Small reversible extension; no intent gaps or data migration. Add optional gridImage to appearance v1 (default empty), use existing image validation/conversion limits and independent async tokens per image. Shared Save is disabled while either photo is processing. Add one month-grid wrapper behind all week rows; expanded day/edit panels remain opaque. Preserve current calendar-first arrangement and existing colour controls. Removing grid photo reveals the selected day colours. Appearance storage remains separate from tasks; quota errors retain drafts. Unrelated existing planning changes stay untouched.

## Review Triage Log

- Medium, patched: when two images were loading, one failure could be cleared by the other's successful completion. Added independent persistent per-image error messages; a controlled mixed success/failure browser regression confirms the failure remains visible. No other defensible findings; nothing deferred.

## Verification

21 Node model tests pass, including loading legacy preferences without gridImage and validating both image fields. Isolated Edge grid-image checks pass preview, cancel, save/reload, independent removal, reset, navigation, expanded day, task-data preservation, late results after removal and mixed upload success/failure. Existing appearance and timetable suites verify storage failures, stale saves, concurrent operations, task editing and conflict behaviour. Visually inspected the screenshot: a single gradient/circle test fixture spans all rows rather than repeating per cell; date pills and task cards remain opaque. No personal data or photos used.
