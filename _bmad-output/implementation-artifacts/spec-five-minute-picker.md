---
title: Noon starting point and five-minute time choices
type: feature
created: 2026-10-01
status: done
route: oneshot
---

<frozen-after-approval>
## Intent

Reduce scrolling when choosing task times: open an empty time picker at 12:00 and offer minutes 00,05,10 through 55. Keep untimed tasks possible and do not silently assign a time just by opening the picker. Start the expanded day timeline at noon too. Existing saved times must not be rounded automatically. User requests trying this simpler minute selection.
</frozen-after-approval>

## Implementation Notes

- Replace native time popup with an explicit lightweight chooser, separate hour/minute selects and an apply button. Keep labelled editable HH:mm text fields for keyboard entry. New/changed values require five-minute steps; unchanged legacy off-step values remain valid.
- Preserve clicked-hour prefill and existing edit times. Empty fields preview 12:00 without committing. No automatic end time. No dependencies or storage migration.

## Review and verification

- Medium, fixed: opening the chooser on input clicks stole focus from manual entry. Chooser now opens from the adjacent labelled button; input supports ordinary click-and-type. Browser regression exercises actual keyboard typing.
- Picker browser checks passed: noon timeline and empty preview, exact five-minute option list, explicit apply, cancel/Escape, invalid step feedback, persistence, clearing times and unchanged legacy minute preservation.
- Timetable browser suite and all eleven model tests passed. Desktop screenshot inspected. No user data was changed by tests; they run in isolated browser contexts.
