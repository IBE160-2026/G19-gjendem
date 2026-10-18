---
title: Smart To-Do — remaining epics and stories
created: 2026-10-13
updated: 2026-10-18
status: approved-overview
---

# Remaining epics and stories

This records the overview approved by Matthew on 13 October 2026. It covers remaining work, not functionality already delivered. Story IDs below are planning references; detailed acceptance criteria and implementation decisions still need to be written before development. This is not a completed detailed BMAD story workflow.

Complete and test the calendar (Epics 1–5) before selecting or implementing the AI solution (Epic 6). Existing functionality is recorded in the [PRD](prds/prd-smart-to-do-2026-09-27/prd.md) and [implementation records](../implementation-artifacts/).

## Epic 1 — Review past unfinished tasks

- **1.1 Opening notice:** When the calendar opens, show a notice with the count of unfinished tasks dated before today, if any exist. This is an in-app notice, not an operating-system notification or background reminder. Today's tasks and undated tasks do not trigger it.
- **1.2 Review window:** Open a large in-app overlay covering nearly the whole screen, showing all relevant tasks together with title, date and category, ordered by task date with the oldest first, with scrolling when necessary. Include "Lagre som utført", "Endre" and an upper-left close cross. Outside clicks and Escape do not dismiss it.
- **1.3 Act on a task:** Let the user change its date or mark it complete. "Endre" opens editing inside the same review window. After saving, return to the updated list while qualifying tasks remain; close only when none remain. Cancelling leaves saved task data unchanged.
- **1.4 Keep unresolved work:** Closing with the cross leaves tasks unchanged and causes a new notice on the next calendar visit if they still qualify. Update the count after changes and remove the notice when none remain. Refresh the count automatically across local midnight or on return after inactivity without opening the large window or interrupting work. Other-tab updates must preserve unsaved editor drafts; defer disruptive view refreshes and retain stale-edit protection.

No additional notices for today's tasks, time conflicts or undated tasks were selected. The large review window and explicit dismissal controls are confirmed. All qualifying tasks appear together in the window. Each task has its own completion/edit actions. The window remains open while tasks remain, updating the list and count after successful saves. It closes when all qualifying tasks are resolved or the upper-left cross is used; closing with the cross preserves unresolved tasks for the next visit.

## Epic 2 — Organise tasks by category

- **2.1 Filter:** Show tasks for a selected category and restore all categories when the filter is cleared.
- **2.2 Create categories:** Add user-defined task categories.
- **2.3 Edit categories:** Change category names and colours, including the existing default categories.

Detailed stories must clarify category identity, existing-task preservation, default-category behaviour and filter scope before implementation.

## Epic 3 — Customise calendar appearance

- **3.1 Surrounding background:** Choose a background colour or a personal image around the calendar.
- **3.2 Calendar colour:** Change the background colour of the calendar and day cells.
- **3.3 Retain preferences:** Remember appearance choices when the calendar is opened again.
- **3.4 Reset appearance:** Restore the standard appearance without deleting tasks.

Task category colours, red conflict cues and text must remain readable. Image handling, storage limits and the precise reset scope are decisions for the detailed stories.

## Epic 4 — See Norwegian public holidays

- **4.1 Holiday display:** Show Norwegian public holidays with names and a distinct marking for the selected year, including movable holidays. Allow normal task entry on these dates.

Confirm the exact holiday set, supported year range and expected dates against authoritative sources before implementation. Holidays are calendar information, not user-created tasks.

## Epic 5 — Make the calendar ready for use

- **5.1 Acceptance run:** Test the complete calendar workflow using ten tasks across the categories, including dated, undated and past unfinished tasks. Record expected and actual results.
- **5.2 External user trials:** Have two other people try the calendar, record difficulties and address the problems found.
- **5.3 Assessor startup:** Verify that another person can start the app and run the documented tests on their own PC using the README.

These are pending activities. Existing automated tests do not establish completion of these user trials or acceptance runs. Use this epic to verify the added features as well as the existing core calendar.

## Epic 6 — AI assistance after the calendar is complete

The following are provisional stories. Detailed AI planning starts only after Epics 1–5 are complete and the calendar is accepted.

- **6.1 Plan the connection:** Choose an AI service and plan server-side secret storage and a cost limit.
- **6.2 Suggest a category:** Suggest an existing category from task text and let the user accept, change or reject it.
- **6.3 Handle failure:** Keep ordinary task management usable if the AI service fails or gives an unusable answer.
- **6.4 Assessor test mode:** Provide a clearly labelled mode with fixed suggestions, usable without the owner's key or payment.
- **6.5 Evaluate live suggestions:** Use 20 predefined fictional tasks and written criteria; retain the brief's target of at least 16 acceptable suggestions. Test corrections, rejections and failures separately. Fixed test responses do not demonstrate live AI accuracy.

No AI provider, model or implementation has been selected. Free-text interpretation, priority suggestions and summaries remain possible later extensions, not additional approved stories.

## Relationship to existing plans

Epics 1–2 complete or extend PRD FR-7/FR-8; Epic 5 supports the existing acceptance targets; Epic 6 retains the deferred intent of FR-9/FR-10. The opening notice, renaming/recolouring categories, appearance customisation and holiday display are newly approved additions from the discussion after the PRD reconciliation. Update the affected PRD/UX requirements before implementing them; do not treat them as already covered by the earlier PRD.

Next: write small, testable acceptance criteria for calendar stories and resolve the noted design decisions. Preserve this overview as the record of agreed scope; do not start AI implementation while the calendar is unfinished.
