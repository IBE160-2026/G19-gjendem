---
title: Apply time selections directly to the editable draft
type: feature
created: 2026-10-01
status: done
route: oneshot
---

<frozen-after-approval>
## Intent

Remove Bruk klokkeslett. Selecting hour or minute immediately updates the time field, keeps the chooser open for revision and does not persist until Lagre oppgave. Preserve five-minute options, untimed tasks, existing values, failed-save handling and ordinary task-level discard behavior.
</frozen-after-approval>

## Implementation Notes

- Reuse timeField's existing draft input event; change handlers update that input without closing. Keep clear and close controls. No storage changes or new dependencies.
- Update picker browser check to verify immediate field values, repeated selection, absent apply button and no storage write before task save.

## Review and verification

- Medium, fixed: an empty field with preselected 12:00 could not accept that unchanged option without Apply. Opening the empty chooser now initializes the draft to 12:00 (communicated to user); task storage remains unchanged. Clearing both fields still permits untimed tasks.
- Low verification gap, fixed: alter a previously saved task's time through the chooser, close and cancel the editor; stored time remains unchanged.
- Picker browser suite passed for immediate changes, repeated adjustments, draft discard protection, no early persistence, save/reload, legacy values and removal of times. No data migration or user calendar changes from tests.
