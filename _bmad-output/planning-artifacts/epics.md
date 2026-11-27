---
title: Smart To-Do — detailed calendar stories
status: draft
created: 2026-10-13
updated: 2026-11-23
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

**Current delivery status — 23 November 2026:** Epic 1 and Stories 1.1–1.4 are complete and locally accepted. See [acceptance evidence](../implementation-artifacts/epic-1-acceptance.md). Older planning and increment entries below describe their state at the time. The overall detailed-story workflow and calendar-wide user acceptance remain incomplete.

This draft develops the [approved six-epic overview](epics-and-stories-overview.md) into testable stories, starting with Epic 1. The user approved the overview and requested the next planning task; its grouping is retained rather than requiring another approval of the same scope. This is not a completed workflow or an implementation instruction for all epics. Epic 1 criteria below are locally accepted; Epics 4–5 still need their detailed planning records reconciled with delivered increments. Epic 6 remains deferred until calendar acceptance, as explicitly requested.

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
| FR-8 | Epic 2 filtering, creation and category editing locally accepted; see epic-2-acceptance.md |
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

**Status:** Done — locally accepted 23 November 2026; see acceptance evidence above.

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

**Status:** Done — locally accepted 23 November 2026; see acceptance evidence above.

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

**Status:** Done — locally accepted 23 November 2026; see acceptance evidence above.

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

**Status:** Done — locally accepted 23 November 2026; see acceptance evidence above.

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

## Epic 2: Organise tasks by category

**Status:** Stories 2.1–2.3 delivered and locally accepted 23 November 2026. These criteria consolidate the approved implementation records; they do not add features. See [acceptance evidence](../implementation-artifacts/epic-2-acceptance.md).

### Story 2.1: Filter tasks by category

- Given tasks in several categories, when one category is selected, then month/day, upcoming, undated and completed views show matching tasks without modifying saved records.
- Given an active filter, when Vis alle is used or the page reloads, then all categories are shown again. A category with no tasks has an explanatory empty state.
- Given hidden categories, when conflicts are calculated or Rydd side is used, then all categories still participate. The past-unfinished review deliberately remains across all categories.
- Given an open task draft, when the filter changes, then fields remain intact; saving into another category follows that category so the result remains visible.

### Story 2.2: Create user-defined categories

- Given a trimmed unique name of 1–40 characters and a valid colour, when saved, then the category is available in the filter, legend and task editor and survives reload.
- Given blank, duplicate (case-insensitive and Unicode-normalised) names or invalid colours, when submitted, then creation is rejected without changing saved data. Names are rendered as text.
- Given storage failure or simultaneous category creation, when saving, then existing tasks and category metadata survive; failed drafts remain editable and duplicate names cannot be created.
- Given an existing task draft, when a category is created, then its fields and selected category are preserved. New tasks still default to the original Ellers category.

### Story 2.3: Edit category names and colours

- Given Administrer kategorier, when opened, then all categories provide name, preset/custom colour, preview, Save and Cancel controls.
- Given edited values, when previewed or cancelled, then saved categories and tasks remain unchanged until explicit Save.
- Given a saved rename/recolour, when viewing active, completed or archived tasks, then their category display changes while IDs, titles, descriptions, dates, times and completion/cleanup states remain unchanged, including after reload.
- Given renamed Ellers, when adding a task, then the same category remains the default under its new display name.
- Given a duplicate, failed write or stale edit, when saving, then reject it with feedback and retain the draft. Existing task drafts also survive category edits.

## Epic 3: Customise calendar appearance

**Status:** Stories 3.1–3.4 and the approved continuous-grid-photo extension are delivered and locally accepted 23 November 2026. See [acceptance evidence](../implementation-artifacts/epic-3-acceptance.md). These criteria consolidate existing behaviour, not new features.

### Story 3.1: Surrounding background

- Given a chosen background colour or valid local JPG/PNG/WebP photo, when selected, then preview it around the calendar without saving; a photo uses centred cover cropping.
- Given surrounding and grid photos, when either is removed or replaced, then the other remains independently configurable. The grid photo covers the whole month once, rather than repeating in each cell.
- Given an invalid image or delayed decoding, when it fails or the choice is cancelled/reset/removed, then explain the failure and never revive a cancelled image or overwrite a newer choice.

### Story 3.2: Calendar colour and grid photo

- Given calendar/day colours, when changed, then preview them immediately while dates, category/task text, today, completion and conflicts remain distinguishable.
- Given a grid photo, when displayed or removed, then opaque date/task surfaces retain readability and removal reveals the chosen day colour. Navigation and expanded-day use preserve the appearance.
- Given task/category data or drafts, when appearance changes, then their values, associations and category colours remain unchanged.

### Story 3.3: Retain preferences

- Given a preview, when Save succeeds, then the choices survive reopening in the same browser/profile/address; Cancel restores the latest saved appearance.
- Given quota failure or a newer save in another tab, when saving, then retain the draft, show feedback and do not overwrite the saved appearance or task/category data.
- Given either photo is processing, when the user attempts Save, then saving remains unavailable until image processing settles. Competing task and appearance saves must leave their controls usable.

### Story 3.4: Reset appearance

- Given customised colours and two photos, when Reset is chosen, then preview defaults and removal of both photos without changing saved preferences until Save.
- Given reset preview, when Cancel is chosen, then restore saved appearance; when Save succeeds and the app reloads, then retain defaults.
- Given saved tasks/categories and their open drafts, when appearance is reset and saved, then preserve them intact.

### Story 3.5: Mykere kalender med naturbakgrunn

**Status — 27 November 2026:** Implemented and locally tested; user visual acceptance remains pending. Stories 3.1–3.4 retain their existing acceptance.

As a calendar user, I want a softer appearance with an optional mountain landscape while retaining my own images and colours, so that the calendar feels personal and remains easy to read.

See [Story 3.5 details and acceptance criteria](story-3-5-soft-nature-appearance.md), including the selected mockup and standalone landscape.

## Epics 4–5: Remaining planning reconciliation

The approved stories remain in the overview. Reconcile delivered holiday decisions with their implementation records before final acceptance; do not rebuild them from historical open questions. Calendar-wide acceptance and external trials still belong to Epic 5.

## Epic 6: Deferred

Retain the five provisional stories in the approved overview. Do not choose a provider or write implementation-ready AI stories until the calendar is complete and accepted.

## Session handoff — 13 October 2026

Paused at the user's request after recording Epic 1 interaction decisions. All qualifying past unfinished tasks are shown together in a near-full-screen window. Each has completion/edit actions; successful handling updates the list and keeps the window open while tasks remain. The upper-left cross closes without resolving remaining tasks, which are included in the notice on the next visit. Outside clicks and Escape do not close the review. No application implementation was performed in this planning session.

Next session: finish Epic 1 criteria by settling sort order, editor placement and refresh behavior while the app stays open; then continue detailed stories for Epics 2–5. Preserve the approved six-epic overview. AI planning and implementation remain deferred until calendar acceptance. Before implementation, reconcile newly approved behavior with PRD/UX. Do not treat this draft as completed or implemented.

## Planning continuation — 18 October 2026

The user confirmed oldest task dates first and editing inside the same review window, returning to the refreshed list after saving. These decisions resolve the sort-order and editor-placement items in the historical 13 October handoff. Previously approved dismissal, completion and recurrence rules are unchanged. This is a documentation update, not an implementation.

The user subsequently confirmed automatic count refresh across local midnight without forcing the review window open, plus preservation of unsaved edits when another tab changes saved data. These refresh decisions are captured in Story 1.4. Next: continue detailed calendar stories for Epics 2–5 and reconcile new requirements with PRD/UX before coding. Epic 6 remains deferred until calendar acceptance.
## Backlog addition — 2 November 2026

[Epic 7 — Adapt the calendar to mobile and larger PC screens](epic-7-responsive-calendar.md) records five approved stories with acceptance criteria from the user discussion. Status: approved backlog, not started. It preserves the desktop layout while adding a mobile month/day experience and extra calendar width on larger PC screens. This addition does not mark the overall detailed-story workflow complete or change the current work order. Resume the pending Epic 1 past-unfinished review (PRD FR-17–18); schedule Epic 7 later and reconcile PRD/UX before its implementation.
## Epic 1 first increment — 23 November 2026

Stories 1.1 and the read-only portion of 1.2 are implemented: counted notice, user-opened near-full-screen list, oldest task date first, upper-left cross and non-dismissal by Escape/backdrop. Closing preserves tasks and the notice recurs on later visits. The list spans all categories. No completion/edit buttons are claimed delivered in this increment. Basic saved-data refresh uses the existing date/visibility and storage hooks without resetting task drafts. Story 1.3 and full Epic 1 acceptance remain pending. See [increment evidence](../implementation-artifacts/spec-1-1-past-unfinished-overview.md).

## Epic 1 action increment — 23 November 2026

Story 1.3 now adds per-task completion and editing inside the same review window. Successful saves refresh the list; tasks rescheduled to another past date remain, and completed, undated or today/future tasks leave it. The window stays open for remaining tasks and closes when none remain, without deleting completed records. Cancel/discard protection, failed-save drafts, stale-edit protection and keyboard focus were verified in isolated browser checks. See [action evidence](../implementation-artifacts/spec-1-3-past-task-actions.md). Story 1.4 and full Epic 1 acceptance still require their final check; no production deployment is claimed.
