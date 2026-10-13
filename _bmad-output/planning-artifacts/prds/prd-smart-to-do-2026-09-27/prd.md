---
title: "PRD: Smart To-Do"
status: final
created: 2026-09-27
updated: 2026-10-13
---

# PRD: Smart To-Do

## 1. Purpose and users

This PRD translates the approved [product brief](../../../../product-brief.md) into requirements for a solo IBE160 project. The 13 October revision reconciles the calendar decisions, implemented increments and teacher feedback. It replaces the earlier completion and pending time-rule wording. Earlier review reports remain historical; this revision's reconciliation and review are dated 13 October. See [UX behaviour](../../ux-designs/ux-smart-to-do-2026-09-27/EXPERIENCE.md) for layout context and [implementation records](../../../implementation-artifacts/) for subsequent decisions. Where older planning text differs, the confirmed rules below govern this revision.

Smart To-Do gives people one calendar overview of personal tasks across work, family and studies. Matthew is the first user: he currently uses work notes, a mobile calendar and memory, and finds it difficult to maintain an overview. The app supports personal organisation, not team administration.

**Confirmed platform:** The first version is a simple local web app used in a browser on the user's PC, without login or internet publication. Task data stays in that browser and is not automatically synchronised to other devices. Clearing browser data can remove saved tasks; the app must explain this limitation. The existing local-storage choice and its limits are recorded in the [technical addendum](addendum.md). External AI connectivity is addressed separately in Stage 2.

**Confirmed interface language:** Norwegian Bokmål. Buttons, field labels, status messages and error messages use Norwegian Bokmål. The first version supports this language only; project documentation remains in English.

## 2. Terms and development stages

- **Task:** A title, optional description, one category, one optional date, optional start/end times and a completion status. There are no separate work-period and submission-deadline task types; the user can explain the task's meaning in its optional description.
- **Date:** The single calendar date chosen by the user, labelled "Dato". A dated task may have no time. An undated task is different from a dated task without a time.
- **Default categories:** "Jobb" (blue), "Skole" (yellow), "Familie" (green) or "Ellers" (light brown). Ellers is the default. Each task has one category; AI suggests that category rather than introducing another tagging system.
- **Past unfinished task:** An incomplete task dated before today. This replaces mandatory overdue/deadline semantics; the app does not infer whether the date meant planned work or a delivery deadline.

**Stage 1:** Complete and test the calendar, task management, categories and saved data before starting AI implementation. Current delivery status is recorded in section 7; this PRD defines the full target, not a claim that all requirements are delivered.

**Stage 2 (deferred):** After the calendar is complete and understood, decide how to implement AI category suggestions. Provider selection, detailed AI stories and the test-mode implementation wait until then. Priority suggestions, short summaries and free-text interpretation are possible later extensions, not committed requirements for either stage.

## 3. Functional requirements

### Task management

- **FR-1 — Create:** The user can add a task with a non-empty title. Description, date and times are optional. Blank titles produce a clear message without discarding entered text.
- **FR-2 — Edit and delete:** The user can change a task or delete it. A changed date moves it to the correct day. Deletion requires confirmation; cancellation leaves the task unchanged.
- **FR-3 — Complete:** A checkbox completes a task without opening its form. It remains visible with a checked checkbox and strikethrough text in the calendar, timetable and side panels until explicit cleanup (FR-14). Unchecking reopens it without losing its data. The undated list also retains completed tasks until cleanup; the past unfinished list includes only incomplete tasks.
- **FR-4 — Save:** Tasks and categories survive closing and reopening the app in the same supported environment. A failed save displays an error and does not claim success or discard the draft. Stale edits must not overwrite newer changes from another tab. Unreadable saved data must not be silently replaced.

### Calendar and overview

- **FR-5 — Month view:** The main view shows the current month and lets the user move between months and return to today. Dated tasks appear on their chosen dates. Today is clearly marked independently of the selected day.
- **FR-6 — Day details:** Selecting a day enlarges its calendar area into a timetable ordered by start time. A panel to its right shows only that day's tasks without times. The timetable covers all 24 hours and opens at 12:00. Closing the expanded day restores normal size. Calendar overflow provides access to all tasks not hidden by cleanup; none silently disappear.
- **FR-7 — Undated and past unfinished:** "Uten dato" lists tasks not hidden by cleanup without dates and lets the user create them directly. Assigning a date places the same task in the calendar; clearing its date returns it to that list without losing other details. An undated task cannot have times: saving a blank date with times must explain that a date is needed or both times must be cleared, retaining the draft. Past unfinished tasks remain accessible even when their month is not displayed. A task dated today is not in that past list.
- **FR-8 — Categories:** Provide the four categories and colours defined above, defaulting to Ellers. Retain the ability to create additional categories. Names accompany colours. Filtering shows matching tasks; clearing the filter restores the full overview.
- **FR-11 — Upcoming sidebar:** Left of the calendar, show "I dag", "Denne uken" (after today to this week's end) and "Kommende" (next week onwards). Show up to two task rows per section; if more exist, the third row is "Vis mer". It expands that section inline to all its tasks; "Vis mindre" collapses it. Periods use the real local date and Monday–Sunday weeks, independently of the displayed calendar month; they do not duplicate today. Completed tasks remain visible until cleanup (FR-14).
- **FR-12 — Optional times and conflicts:** A dated task can have start/end times or neither. Both times must be supplied or both empty; end must be later than start on the same date. Overnight intervals are not supported. Overlapping unfinished tasks on the same date have red title text, retaining their category backgrounds and a textual conflict cue. Touching endpoints do not overlap; completed tasks do not contribute to conflicts. The user can save a conflict and reschedule manually; the app never moves tasks automatically.
- **FR-13 — Inline entry:** Each calendar day has a small plus button that opens an inline form in its expanded area with date prefilled. Clicking a timetable time also prefills start time; the user chooses the end. Clicking an existing task opens the same form with its values. Successful saving returns the day to normal month-view size. Failed saving preserves entered values and the open form. Opening an empty time chooser sets the draft to 12:00. Hours and five-minute choices (00, 05, …, 55) update the draft immediately and remain editable until "Lagre oppgave". New or changed times, including typed values, use five-minute steps. Both times can be cleared; unchanged legacy minute values are preserved. Leaving an unsaved changed form requires confirmation.

- **FR-14 — Recoverable cleanup:** "Rydd side" hides all completed tasks from normal calendar, timetable, upcoming and undated views across all dates, without deleting them. "Fullført" shows every completed task, whether cleaned up or not. Unchecking reopens the task and restores it to its dated or undated location with its details intact. Newly completed tasks stay visible until cleanup is requested again. Cleanup must preserve any unsaved editor draft.

### AI assistance — Stage 2 only

- **FR-9 — Suggest:** On user request, AI proposes an existing category from the task text. The user can accept, reject or change it. No suggestion changes a date, time or category automatically.
- **FR-10 — Failure:** An unavailable AI service or unusable suggestion produces understandable feedback. Creating, editing and completing tasks still work. The app does not silently apply an invalid suggestion.

## 4. Quality requirements

- **NFR-1 — Clarity:** Category and task status must be understandable without relying on colour alone. Main controls have descriptive labels and can be used with a keyboard.
- **NFR-2 — Reliability:** Month changes, tasks without dates and reopening the app must not lose or shift saved task data.
- **NFR-3 — Data handling:** Explain what task text is sent before requesting external AI assistance. API credentials must not appear in public code or be exposed to the browser. Use fictional tasks in demonstrations.

## 5. Acceptance and success

The following are acceptance targets. Existing automated checks cover parts of them; completion of the ten-task acceptance run, external user trials and AI evaluation must be documented separately:

- Use ten tasks across the four default categories to verify creation, editing, deletion, completion, filtering and data retention after closing and reopening. Include undated, past unfinished, today and next-month tasks (FR-1–8).
- Verify completion keeps tasks visible with checked boxes and strikethrough in the timetable and both side panels; reopening retains date, category and description. Verify cleanup across dates and undated tasks, restoration from Fullført, failed-write recovery and draft preservation (FR-3, FR-14).
- Verify the sidebar's two-row limit and inline expansion, Sunday/Monday period boundaries, time/date prefill, successful collapse and failed-save recovery (FR-11, FR-13).
- Verify only overlapping unfinished tasks show conflict cues, touching endpoints do not conflict and overnight intervals are rejected, and that untimed tasks remain accessible beside the timetable (FR-6, FR-12).
- Verify the empty time chooser starts the draft at 12:00, five-minute selections update it without early persistence, and clearing both times works. Verify scheduling and unscheduling an undated task preserve its identity, description, category and completion state (FR-7, FR-12–13).
- Matthew can find upcoming, past unfinished and undated tasks across categories without consulting separate notes for the same tasks.
- Two other users can add a dated task, locate it and complete it without step-by-step help. Record difficulties and improvements.
- In Stage 2, at least 16 of 20 predefined, unambiguous tasks receive category suggestions meeting written criteria. Verify rejection, correction and AI failure separately (FR-9–10).
- Document setup, limitations, testing and AI assistance on GitHub; Matthew can explain the implemented behaviour.

**Countermeasure:** Faster entry and higher AI accuracy must not be achieved by silently hiding tasks outside explicit cleanup or filtering, discarding failed saves or applying suggestions without user control.

## 6. Exclusions and open decisions

The first version excludes task sharing, team administration, account synchronisation, external calendar connections, automatic reminders, recurring tasks and automatic rescheduling. Manual start/end times are included. Quiz and study-buddy functions are outside this product.

**Remaining calendar decisions:** Matthew and the developer will settle the past-unfinished list layout and category creation/filtering behaviour while writing the remaining Stage 1 stories, before implementing those screens. The proposed "Ikke ferdig" left-panel section is not yet an approved layout. Existing undated, cleanup and time rules above are settled and need no new design decision.

**Deferred AI decisions:** After Stage 1 acceptance, Matthew and the developer will select the provider, connection approach, cost limit and exact data sent. Credentials must stay on the server, outside committed code and browser JavaScript. Before Stage 2 implementation, define a clearly labelled fixed-suggestion test mode that runs without the owner's key or a paid account, plus 20 fictional inputs and written expected-category criteria. Test mode verifies the interaction and failure paths; it does not measure live AI accuracy. These are pending planning obligations, not implemented functionality.

## 7. Delivery status and next work — 13 October 2026

**Implemented increments:** Task creation/editing/deletion and descriptions; completion/reopening; local saving; month and expanded-day views; four default categories; upcoming sidebar; optional times, conflict rules and time chooser; undated list; recoverable cleanup and Fullført. See [implementation records](../../../implementation-artifacts/) and [test instructions](../../../../README.md#run-tests). These increments do not establish that all Stage 1 acceptance targets have passed.

**Remaining Stage 1 work:** Separate past-unfinished overview (part of FR-7), category creation and filtering (part of FR-8), the ten-task acceptance run, two external user trials, and final usability, reliability and assessor-startup checks. Create epics and testable stories for this remaining work before continuing implementation, referring to existing increments rather than recreating them.

**Stage 2:** Not implemented. Detailed planning and implementation follow calendar completion. No AI service, evaluation result or test mode is claimed as delivered.

**Change record:** This revision retains FR-1 through FR-13, adds FR-14 for the approved cleanup feature, settles previously pending time rules and records the user's calendar-first sequencing. It reconciles the 6 October brief update without expanding scope to free-text AI or other optional extensions.
