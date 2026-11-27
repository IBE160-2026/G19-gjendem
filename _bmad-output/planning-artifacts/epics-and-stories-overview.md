---
title: Smart To-Do — remaining epics and stories
created: 2026-10-13
updated: 2026-11-02
status: approved-overview
---

# Remaining epics and stories

This records the overview approved by Matthew on 13 October 2026. It covers remaining work, not functionality already delivered. Story IDs below are planning references; detailed acceptance criteria and implementation decisions still need to be written before development. This is not a completed detailed BMAD story workflow.

Complete and test the calendar (Epics 1–5) before selecting or implementing the AI solution (Epic 6). Existing functionality is recorded in the [PRD](prds/prd-smart-to-do-2026-09-27/prd.md) and [implementation records](../implementation-artifacts/).

## Epic 1 — Review past unfinished tasks

**Status — 23 November 2026:** Stories 1.1–1.4 complete and locally accepted. See [acceptance evidence](../implementation-artifacts/epic-1-acceptance.md). Calendar-wide acceptance and external user trials in Epic 5 remain pending.

- **1.1 Opening notice:** When the calendar opens, show a notice with the count of unfinished tasks dated before today, if any exist. This is an in-app notice, not an operating-system notification or background reminder. Today's tasks and undated tasks do not trigger it.
- **1.2 Review window:** Open a large in-app overlay covering nearly the whole screen, showing all relevant tasks together with title, date and category, ordered by task date with the oldest first, with scrolling when necessary. Include "Lagre som utført", "Endre" and an upper-left close cross. Outside clicks and Escape do not dismiss it.
- **1.3 Act on a task:** Let the user change its date or mark it complete. "Endre" opens editing inside the same review window. After saving, return to the updated list while qualifying tasks remain; close only when none remain. Cancelling leaves saved task data unchanged.
- **1.4 Keep unresolved work:** Closing with the cross leaves tasks unchanged and causes a new notice on the next calendar visit if they still qualify. Update the count after changes and remove the notice when none remain. Refresh the count automatically across local midnight or on return after inactivity without opening the large window or interrupting work. Other-tab updates must preserve unsaved editor drafts; defer disruptive view refreshes and retain stale-edit protection.

No additional notices for today's tasks, time conflicts or undated tasks were selected. The large review window and explicit dismissal controls are confirmed. All qualifying tasks appear together in the window. Each task has its own completion/edit actions. The window remains open while tasks remain, updating the list and count after successful saves. It closes when all qualifying tasks are resolved or the upper-left cross is used; closing with the cross preserves unresolved tasks for the next visit.

## Epic 2 — Organise tasks by category

**Status — 23 November 2026:** Stories 2.1–2.3 complete and locally accepted. [Detailed criteria](epics.md#epic-2-organise-tasks-by-category) and [test evidence](../implementation-artifacts/epic-2-acceptance.md) record the combined check.

- **2.1 Filter:** Show tasks for a selected category and restore all categories when the filter is cleared.
- **2.2 Create categories:** Add user-defined task categories.
- **2.3 Edit categories:** Change category names and colours, including the existing default categories.

Category identity is stable across rename/recolour; the original Ellers stays the default. Normal task views follow the filter, while conflicts, cleanup and the past-unfinished review span all categories. Filtering resets on reload and does not modify records.

## Epic 3 — Customise calendar appearance

**Status — 23 November 2026:** Stories 3.1–3.4 and the later approved continuous calendar-grid photo are complete and locally accepted. See [test evidence](../implementation-artifacts/epic-3-acceptance.md) and the detailed criteria in epics.md.

- **3.1 Surrounding background:** Choose a background colour or a personal image around the calendar.
- **3.2 Calendar colour:** Change the background colour of the calendar and day cells.
- **3.3 Retain preferences:** Remember appearance choices when the calendar is opened again.
- **3.4 Reset appearance:** Restore the standard appearance without deleting tasks.
- **3.5 Softer calendar with nature background:** Rounded surfaces, quieter grid lines and a selectable mountain/lake background, preserving existing customisation. [Detailed story](story-3-5-soft-nature-appearance.md). Implemented and locally tested 27 November 2026; user visual acceptance remains pending. See [implementation evidence](../implementation-artifacts/spec-3-5-soft-nature-appearance.md).

Task category colours, red conflict cues and text remain readable. Surrounding and grid photos are independent, use cover cropping, and are processed locally with the documented image limits. Reset removes both photos and restores appearance defaults only; Save is required to retain it. Tasks, categories and their drafts remain unchanged.

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

## Epic 7 — Adapt the calendar to mobile and larger PC screens

**Status:** Approved backlog, not started. Recorded 2 November 2026 at the user's request; do not start implementation now. The existing work order remains unchanged: resume the pending past-unfinished review (Epic 1 / PRD FR-17–18). Epic numbers are stable identifiers, not a revised delivery sequence. Scheduling Epic 7 relative to the remaining acceptance work and deferred AI will be settled later.

- **7.1 Mobile month:** Keep the entire month as the mobile start view, with all seven weekday columns visible. Show up to two shortened task previews per day and the actual remaining count, for example "+3 flere".
- **7.2 Mobile day:** Tapping a day opens a near-full-screen day view with all that day's tasks. Untimed tasks appear above the timetable; closing returns to the month. This presentation applies only on mobile.
- **7.3 Mobile overview:** Place "I dag", "Denne uken" and "Kommende" below the calendar, reached by vertical scrolling rather than a separate drawer.
- **7.4 Preserve PC and use larger screens:** Retain the existing PC layout, left sidebar and in-calendar expanded-day behaviour. Let the calendar use more width on larger PC screens without changing that arrangement.
- **7.5 Screen and interaction checks:** Verify the agreed layouts and task flows on mobile and PC, including touch input and the mobile keyboard. Ensure category colours, holidays, appearance settings, completion and conflict indicators remain usable.

See [Epic 7 details and acceptance criteria](epic-7-responsive-calendar.md). This is a scoped record of approved discussion, not a completed full BMAD implementation-readiness workflow. No app code changes or new synchronisation features are authorised by this planning entry.

## Relationship to existing plans (historical overview)

Epics 1–2 complete or extend PRD FR-7/FR-8; Epic 5 supports the existing acceptance targets; Epic 6 retains the deferred intent of FR-9/FR-10. The opening notice, renaming/recolouring categories, appearance customisation and holiday display are newly approved additions from the discussion after the PRD reconciliation. Update the affected PRD/UX requirements before implementing them; do not treat them as already covered by the earlier PRD.

Next: write small, testable acceptance criteria for calendar stories and resolve the noted design decisions. Preserve this overview as the record of agreed scope; do not start AI implementation while the calendar is unfinished.
