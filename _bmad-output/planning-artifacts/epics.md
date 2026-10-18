---
title: Smart To-Do — detailed calendar stories
status: draft
created: 2026-10-13
updated: 2026-10-18
stepsCompleted: [step-01-validate-prerequisites, step-02-design-epics]
currentStep: step-03-create-stories
inputDocuments:
  - epics-and-stories-overview.md
  - prds/prd-smart-to-do-2026-09-27/prd.md
  - prds/prd-smart-to-do-2026-09-27/addendum.md
  - technical-plan-smart-to-do.md
  - ux-designs/ux-smart-to-do-2026-09-27/DESIGN.md
  - ux-designs/ux-smart-to-do-2026-09-27/EXPERIENCE.md
  - ../../product-brief.md
---

# Smart To-Do — Epic Breakdown

## Overview

This draft develops the [approved six-epic overview](epics-and-stories-overview.md) into testable stories, starting with Epic 1. The user approved the overview and requested the next planning task; its grouping is retained rather than requiring another approval of the same scope. This is not a completed workflow or an implementation instruction for all epics. Epic 1 criteria below are drafts; Epics 2–5 still need detailed criteria. Epic 6 remains deferred until calendar acceptance, as explicitly requested.

Source precedence: the October PRD, its technical addendum, implementation records and subsequent user-approved overview supersede historical proposals in the September technical/UX drafts. The technical plan is not a finalized architecture: Vite scaffolding and unsettled time rules are obsolete proposals, not new work to recreate. New notice, category-editing, appearance and holiday requirements must be reconciled with PRD/UX before their implementation.

## Requirements Inventory

### Functional Requirements

- **FR-1 — Create:** The user can add a task with a non-empty title. Description, date and times are optional. Blank titles produce a clear message without discarding entered text.
- **FR-2 — Edit and delete:** The user can change a task or delete it. A changed date moves it to the correct day. Deletion requires confirmation; cancellation leaves the task unchanged.
- **FR-3 — Complete:** A checkbox completes a task without opening its form. It remains visible with a checked checkbox and strikethrough text in the calendar, timetable and side panels until explicit cleanup (FR-14). Unchecking reopens it without losing its data. The undated list also retains completed tasks until cleanup; the past unfinished list includes only incomplete tasks.
- **FR-4 — Save:** Tasks and categories survive closing and reopening the app in the same supported environment. A failed save displays an error and does not claim success or discard the draft. Stale edits must not overwrite newer changes from another tab. Unreadable saved data must not be silently replaced.
- **FR-5 — Month view:** The main view shows the current month and lets the user move between months and return to today. Dated tasks appear on their chosen dates. Today is clearly marked independently of the selected day.
- **FR-6 — Day details:** Selecting a day enlarges its calendar area into a timetable ordered by start time. A panel to its right shows only that day's tasks without times. The timetable covers all 24 hours and opens at 12:00. Closing the expanded day restores normal size. Calendar overflow provides access to all tasks not hidden by cleanup; none silently disappear.
- **FR-7 — Undated and past unfinished:** "Uten dato" lists tasks not hidden by cleanup without dates and lets the user create them directly. Assigning a date places the same task in the calendar; clearing its date returns it to that list without losing other details. An undated task cannot have times: saving a blank date with times must explain that a date is needed or both times must be cleared, retaining the draft. Past unfinished tasks remain accessible even when their month is not displayed. A task dated today is not in that past list.
- **FR-8 — Categories:** Provide the four categories and colours defined above, defaulting to Ellers. Retain the ability to create additional categories. Names accompany colours. Filtering shows matching tasks; clearing the filter restores the full overview.
- **FR-11 — Upcoming sidebar:** Left of the calendar, show "I dag", "Denne uken" (after today to this week's end) and "Kommende" (next week onwards). Show up to two task rows per section; if more exist, the third row is "Vis mer". It expands that section inline to all its tasks; "Vis mindre" collapses it. Periods use the real local date and Monday–Sunday weeks, independently of the displayed calendar month; they do not duplicate today. Completed tasks remain visible until cleanup (FR-14).
- **FR-12 — Optional times and conflicts:** A dated task can have start/end times or neither. Both times must be supplied or both empty; end must be later than start on the same date. Overnight intervals are not supported. Overlapping unfinished tasks on the same date have red title text, retaining their category backgrounds and a textual conflict cue. Touching endpoints do not overlap; completed tasks do not contribute to conflicts. The user can save a conflict and reschedule manually; the app never moves tasks automatically.
- **FR-13 — Inline entry:** Each calendar day has a small plus button that opens an inline form in its expanded area with date prefilled. Clicking a timetable time also prefills start time; the user chooses the end. Clicking an existing task opens the same form with its values. Successful saving returns the day to normal month-view size. Failed saving preserves entered values and the open form. Opening an empty time chooser sets the draft to 12:00. Hours and five-minute choices (00, 05, …, 55) update the draft immediately and remain editable until "Lagre oppgave". New or changed times, including typed values, use five-minute steps. Both times can be cleared; unchanged legacy minute values are preserved. Leaving an unsaved changed form requires confirmation.
- **FR-14 — Recoverable cleanup:** "Rydd side" hides all completed tasks from normal calendar, timetable, upcoming and undated views across all dates, without deleting them. "Fullført" shows every completed task, whether cleaned up or not. Unchecking reopens the task and restores it to its dated or undated location with its details intact. Newly completed tasks stay visible until cleanup is requested again. Cleanup must preserve any unsaved editor draft.
- **FR-9 — Suggest:** On user request, AI proposes an existing category from the task text. The user can accept, reject or change it. No suggestion changes a date, time or category automatically.
- **FR-10 — Failure:** An unavailable AI service or unusable suggestion produces understandable feedback. Creating, editing and completing tasks still work. The app does not silently apply an invalid suggestion.

### NonFunctional Requirements

- **NFR-1 — Clarity:** Category and task status must be understandable without relying on colour alone. Main controls have descriptive labels and can be used with a keyboard.
- **NFR-2 — Reliability:** Month changes, tasks without dates and reopening the app must not lose or shift saved task data.
- **NFR-3 — Data handling:** Explain what task text is sent before requesting external AI assistance. API credentials must not appear in public code or be exposed to the browser. Use fictional tasks in demonstrations.

### Additional Requirements

- ADD-1: On opening the app, notify only about unfinished dated tasks strictly before the real local today. No OS/background notification and no separate alerts for today, undated tasks or time conflicts.
- ADD-2: Allow changing existing category names and colours as well as creating categories; retain task identity and associations.
- ADD-3: Allow a colour or personal image around the calendar and a chosen colour for calendar/day surfaces; persist choices and restore defaults without deleting tasks.
- ADD-4: Show Norwegian public holidays by name and year, including movable holidays; they do not prevent task creation.
- Technical baseline: retain the existing plain HTML/CSS/JavaScript app and local Node server. No new starter or cloud infrastructure is needed. Store date-only values as local calendar dates; never shift them through UTC.
- Storage: preserve versioned browser data, read latest state before writing, reject stale changes and never overwrite corrupt data with an empty collection. Persist successfully before claiming success. Retain drafts on failure and use a stable origin/port.
- Security: display user input as text. Stage 1 requires no external AI request or credential. Image storage limits and custom-category migration need design decisions in their own stories.

### UX Design Requirements

- UX-DR1: Retain Norwegian labels, local PC-browser use and a calm month-first layout with left overview and selected-day untimed panel on the right.
- UX-DR2: Use named category colours consistently; today has an outline and text cue; completion uses checkbox/strikethrough; conflicts keep category colour and add red title plus text cue. User-selected colours must preserve distinguishable states.
- UX-DR3: Preserve readable system-font text, compact metadata, consistent spacing, rounded cards and light dividers; avoid obscuring controls with uploaded backgrounds.
- UX-DR4: Normal text targets 4.5:1 contrast; essential controls/focus boundaries target 3:1. Test actual custom colour combinations and completed text.
- UX-DR5: Toolbar exposes month navigation and return to today. Day number, plus and time-entry controls have descriptive accessible names.
- UX-DR6: Month cells retain reachable full task content; day expansion uses full calendar width, chronological full-day timetable and selected-day untimed list. No loss of tasks during zoom.
- UX-DR7: Upcoming periods retain two initial rows, independent inline expansion and collapse, based on real today and Monday–Sunday weeks.
- UX-DR8: Task checkbox operates independently from title editing. Open the same task in a labelled editor; preserve date/category/details on reopening.
- UX-DR9: Editors keep title, description, date/category and time fields with save/cancel/delete controls. Warn before discarding modified drafts; confirmed deletion identifies the task.
- UX-DR10: Distinguish loading, empty, invalid, saving, storage error and success states. Avoid duplicate writes, announce feedback, and preserve draft values and focus after errors.
- UX-DR11: Maintain semantic controls, visible focus, keyboard access and logical focus restoration through list updates and expansion. No essential action is hover-only or colour-only.
- UX-DR12: Auxiliary views reuse task cards and allow editing without inventing a date. Fullført/cleanup follow current FR-14, superseding the old UX exclusion of a completed inventory.
- UX-DR13: Category filters expose the active selection and a clear action; distinguish no matching tasks from genuinely empty storage. Category creation/edit controls need design before implementation.
- UX-DR14: Desktop is the target; verify supported width and browser zoom. Prototype narrow-screen hiding, dark theme and fictional data are not approved requirements.
- UX-DR15: AI controls, consent/data explanation and pending/failure/acceptance feedback are deferred to Epic 6; do not add them during calendar implementation.

### FR Coverage Map

| Requirement | Remaining epic / evidence |
|---|---|
| FR-1, FR-2, FR-3, FR-4 | Existing app increments; Epic 1 reuses editing/completion, Epic 2 preserves data, Epic 5 regression acceptance |
| FR-5, FR-6 | Existing calendar/timetable; Epics 3–4 must preserve them; Epic 5 acceptance |
| FR-7 | Undated already implemented; Epic 1 completes separate past-unfinished access |
| FR-8 | Four categories already implemented; Epic 2 adds filtering and category management |
| FR-9, FR-10 | Epic 6, deferred |
| FR-11, FR-12, FR-13, FR-14 | Existing sidebar/times/editor/cleanup increments; Epic 5 regression acceptance |
| ADD-1 | Epic 1 |
| ADD-2 | Epic 2 |
| ADD-3 | Epic 3 |
| ADD-4 | Epic 4 |
| NFR-1, NFR-2 / UX-DR1–14 | Apply to affected stories in Epics 1–4 and verification in Epic 5 |
| NFR-3 / UX-DR15 | Epic 6; preserve safe rendering and fictional test data throughout |

## Epic List

1. **Review past unfinished tasks:** find and act on earlier unfinished work (FR-7, ADD-1; reuse FR-2–4).
2. **Organise tasks by category:** filter, create and rename/recolour categories (FR-8, ADD-2).
3. **Customise appearance:** choose backgrounds and calendar colours, retain preferences and reset (ADD-3).
4. **See Norwegian public holidays:** show named holidays without obstructing tasks (ADD-4).
5. **Make the calendar ready for use:** ten-task acceptance, two real user trials and assessor-startup verification (all Stage 1 requirements).
6. **AI assistance after calendar completion:** category suggestions, safe connection, failure handling, assessor test mode and 20-task evaluation (FR-9–10). Details deferred.

Epics 1–4 can deliver independent value on the existing app. Epic 5 verifies their combined result. Epic 6 starts only after calendar acceptance. All touch some shared app files, but their user outcomes and design decisions differ; keep the user-approved grouping.

## Epic 1: Review past unfinished tasks

Goal: notice earlier unfinished work, review it and decide whether to reschedule or complete it. No inference that every past date is a missed submission deadline.

### Story 1.1: Notice past unfinished work when opening the calendar

As a calendar user,
I want an in-app count of earlier unfinished tasks,
So that I remember to review work I have not completed.

**Status:** Draft. Can deliver a plain count independently; the review-list link is introduced in 1.2 so this story has no dependency on a future story.

**Acceptance Criteria:**

- **Given** three saved unfinished tasks dated before local today, **when** the calendar opens and storage loads successfully, **then** an in-app notice reports three, regardless of the displayed calendar month.
- **Given** tasks dated today, in the future, without a date, or completed (including cleaned-up tasks), **when** the count is calculated, **then** none of those tasks are included.
- **Given** no qualifying tasks, **when** the calendar opens, **then** no past-unfinished warning is displayed.
- **Given** storage cannot be read, **when** opening the app, **then** display a storage error rather than a false zero count and do not overwrite saved data.
- **Given** the app is closed, **when** a task's date passes, **then** no background or operating-system notification is required.

**Confirmed presentation:** The review opens in a large in-app overlay covering nearly the entire viewport, rather than in the left sidebar or a small field above the calendar. It is not a separate browser tab.

### Story 1.2: Open the large past-unfinished review window

As a calendar user,
I want to open the tasks behind the notice,
So that I can see which tasks need a decision.

**Status:** Draft. Depends on 1.1. Near-full-screen overlay, dismissal rules and showing all qualifying tasks together are confirmed.

**Acceptance Criteria:**

- **Given** a positive notice count, **when** I activate its review action by mouse or keyboard, **then** a near-full-screen review overlay exposes the tasks counted by 1.1, including tasks from other months and years, with prominent notice text. All qualifying tasks appear together in the same window, with scrolling inside the window when necessary; do not present tasks one at a time.
- **Given** a task is in the list, **when** it is displayed, **then** its title, calendar date and named category are available, with category colour as an additional cue.
- **Given** I open or close the list, **when** the view changes, **then** no task data is changed or deleted and keyboard focus remains on a meaningful visible control.

- **Given** the review window is open, **when** I view its controls, **then** it has two main choices, "Lagre som utført" and "Endre", plus an accessible close cross in the upper-left corner.
- **Given** the review window is open, **when** I click outside it or press Escape, **then** it stays open. The upper-left cross closes the review; successful completion or editing closes it only when no qualifying tasks remain. Handling one task must not dismiss remaining tasks; this does not restrict closing the browser itself.
- **Given** I use a keyboard, **when** the overlay opens, **then** focus enters it, its heading and close control are accessible, and the underlying calendar cannot receive accidental interactions. Closing returns focus to the notice entry or another visible control if the notice is gone.

**Confirmed multi-task behavior:** Keep the review window open while qualifying tasks remain so the user can handle the rest. Each task has its own "Lagre som utført" and "Endre" actions; neither action applies to the whole list. Close after the last qualifying task is successfully resolved, or when the user explicitly uses the upper-left cross.

**Confirmed order — 18 October 2026:** Show tasks by their assigned calendar date, oldest first (not by record creation date).

- **Given** qualifying tasks from different past dates, **when** the review list opens or refreshes after saving, **then** the oldest task dates appear first regardless of entry order.

### Story 1.3: Reschedule or complete a listed task

As a calendar user,
I want to change the date or complete an earlier task,
So that the overview reflects my current plans.

**Status:** Draft. Depends on 1.2 and reuses existing editor/completion behavior.

**Acceptance Criteria:**

- **Given** a listed task, **when** I choose "Endre", open its editor, change its date to today or later and save successfully, **then** the same task moves to that calendar date, leaves the past-unfinished list and keeps its other details.
- **Given** a listed task is moved to another past date, **when** the save succeeds, **then** it stays in the list with the new date.
- **Given** a listed task, **when** I choose "Lagre som utført" and saving succeeds, **then** it leaves this unfinished-only list but remains available in Fullført and follows existing visible-completion/cleanup rules elsewhere. The window stays open for remaining tasks, with its count updated; it closes when no qualifying tasks remain.
- **Given** I choose "Endre" for one task, **when** I edit and return to the review, **then** no saved data changes until I explicitly save; cancelling returns to the unresolved list. Successful saving refreshes the list and count, retaining the window while other qualifying tasks remain. The editor opens inside the same review window, not in another browser tab or in the calendar behind it. After successful saving, return to the updated list inside that window; close only when no qualifying tasks remain.
- **Given** I am editing inside the review window, **when** I cancel, **then** return to the list without changing the saved task. If the draft has changes, retain the existing discard-confirmation behavior.
- **Given** completion saving fails, **when** the failure is reported, **then** keep the review window open and leave the task unfinished.
- **Given** I cancel editing or saving fails, **when** the action ends, **then** saved task data and the count are not falsely updated; failed saves retain the draft and report an error.
- **Given** another tab changed the task after its editor opened, **when** I attempt to save a stale edit, **then** the newer saved task is preserved and the existing conflict message retains my draft.

### Story 1.4: Keep unresolved tasks and refresh the notice

As a calendar user,
I want untreated tasks to remain visible and the notice to follow saved changes,
So that tasks do not disappear simply because I reviewed them.

**Status:** Draft. Depends on 1.3.

**Acceptance Criteria:**

- **Given** I close the review using its upper-left cross without changing the task, **when** the window closes, **then** no task is marked complete or permanently dismissed; the task remains unfinished.
- **Given** I leave a task untreated and close the app, **when** I open it again in the same browser/storage environment, **then** a notice appears again and includes the task while it remains unfinished and dated before today. Closing the cross is not a permanent snooze or acknowledgement.
- **Given** a successful date or completion change, **when** the list updates, **then** the count matches the remaining qualifying records; when none remain, the notice disappears. Handling one task must not silently complete or dismiss other tasks. Keep the window open while any qualifying tasks remain; close it after the last task is successfully resolved.
- **Given** I only inspect the list, **when** I return later, **then** inspection alone has not completed, rescheduled or cleaned up any task.

**Confirmed refresh behavior — 18 October 2026:**

- **Given** the calendar remains open across local midnight, **when** the current day changes, **then** automatically recalculate the past-unfinished count from saved tasks using the new local date; do not open the large review window or move focus just because the count changed.
- **Given** the app was inactive or the PC asleep across midnight, **when** the user returns to the calendar, **then** refresh the count using the actual local date without forcing the review window open.
- **Given** qualifying tasks remain after a date change, **when** I activate the review action, **then** I can open their updated overview; the opening notice also includes them on the next calendar visit.
- **Given** another tab changes saved tasks, **when** this tab refreshes its overview, **then** it must not erase or replace an unsaved editor draft, reset focus or close the editor. If a view refresh would discard the draft, defer that refresh until editing safely ends and explain that saved data changed.
- **Given** another tab changed the same task I am editing, **when** I attempt to save an outdated edit, **then** retain my draft and use the existing conflict handling rather than silently overwrite the newer saved record.

These refreshes never create operating-system/background notifications. Display counts are based on saved records, not unsaved draft values.

## Epics 2–5: Next planning conversations

The approved stories remain in the overview; detailed criteria are not yet written here. Outstanding choices include filter scope, category identity/default behavior, category rename validation, safe colour contrast, image limits and storage, reset scope, exact public-holiday coverage/year range and acceptance-test setup. Resolve choices for each affected story before marking it ready for development.

## Epic 6: Deferred

Retain the five provisional stories in the approved overview. Do not choose a provider or write implementation-ready AI stories until the calendar is complete and accepted.

## Session handoff — 13 October 2026

Paused at the user's request after recording Epic 1 interaction decisions. All qualifying past unfinished tasks are shown together in a near-full-screen window. Each has completion/edit actions; successful handling updates the list and keeps the window open while tasks remain. The upper-left cross closes without resolving remaining tasks, which are included in the notice on the next visit. Outside clicks and Escape do not close the review. No application implementation was performed in this planning session.

Next session: finish Epic 1 criteria by settling sort order, editor placement and refresh behavior while the app stays open; then continue detailed stories for Epics 2–5. Preserve the approved six-epic overview. AI planning and implementation remain deferred until calendar acceptance. Before implementation, reconcile newly approved behavior with PRD/UX. Do not treat this draft as completed or implemented.

## Planning continuation — 18 October 2026

The user confirmed oldest task dates first and editing inside the same review window, returning to the refreshed list after saving. These decisions resolve the sort-order and editor-placement items in the historical 13 October handoff. Previously approved dismissal, completion and recurrence rules are unchanged. This is a documentation update, not an implementation.

The user subsequently confirmed automatic count refresh across local midnight without forcing the review window open, plus preservation of unsaved edits when another tab changes saved data. These refresh decisions are captured in Story 1.4. Next: continue detailed calendar stories for Epics 2–5 and reconcile new requirements with PRD/UX before coding. Epic 6 remains deferred until calendar acceptance.
