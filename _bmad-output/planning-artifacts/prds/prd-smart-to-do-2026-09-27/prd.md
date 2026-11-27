---
title: "PRD: Smart To-Do"
status: final
created: 2026-09-27
updated: 2026-11-02
---

# PRD: Smart To-Do

## 1. Purpose and users

This PRD translates the [product brief](../../../../product-brief.md) into requirements for a solo IBE160 project. The 2 November revision incorporates approved category, appearance, holiday, past-unfinished review and publication decisions. Earlier reviews and plans remain historical where they differ from these requirements. See [UX behaviour](../../ux-designs/ux-smart-to-do-2026-09-27/EXPERIENCE.md), the [approved stories](../../epics-and-stories-overview.md) and [implementation records](../../../implementation-artifacts/) for context. Requirements describe the agreed target; section 7 separately records delivery and verification status.

Smart To-Do gives people one calendar overview of personal tasks across work, family and studies. Matthew is the first user: he currently uses work notes, a mobile calendar and memory, and finds it difficult to maintain an overview. The app supports personal organisation, not team administration.

**Confirmed platform:** A simple web app primarily used in a PC browser, available locally and published on Vercel at [Smart To-Do](https://g19-gjendem.vercel.app/), without app login. Tasks, categories and appearance settings stay in the current browser profile and site address. Localhost and the published site have separate data; publication does not transfer existing tasks or synchronise devices. Clearing site data can remove saved data; the app must explain this limitation. The [technical addendum](addendum.md) records storage and deployment details. External AI connectivity remains Stage 2 work.

**Confirmed interface language:** Norwegian Bokmål. Buttons, field labels, status messages and error messages use Norwegian Bokmål. The first version supports this language only; project documentation remains in English.

## 2. Terms and development stages

- **Task:** A title, optional description, one category, one optional date, optional start/end times and a completion status. There are no separate work-period and submission-deadline task types; the user can explain the task's meaning in its optional description.
- **Date:** The single calendar date chosen by the user, labelled "Dato". A dated task may have no time. An undated task is different from a dated task without a time.
- **Default categories:** Initially "Jobb" (blue), "Skole" (yellow), "Familie" (green) and "Ellers" (light brown). Names and colours are editable; the category initially named Ellers remains the default even when renamed. Each task has one category; AI suggests an existing category rather than introducing another tagging system.
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
- **FR-7 — Undated and past unfinished:** "Uten dato" lists undated tasks that have not been hidden by cleanup and lets the user create new undated tasks directly. Assigning a date places the same task in the calendar; clearing its date returns it to that list without losing other details. An undated task cannot have times: saving a blank date with times must explain that a date is needed or both times must be cleared, retaining the draft. Past unfinished tasks remain accessible even when their month is not displayed. A task dated today is not in that past list.
- **FR-8 — Categories:** Provide the initial categories above and allow additional categories. "Vis kategori" filters task views to one selected category; "Vis alle" restores all categories. Filtering does not change task data, suppress conflict detection with hidden tasks, or limit cleanup to the selected category. "Administrer kategorier" presents a combined list for editing names and colours using presets or a custom colour. Saving a category updates all its tasks, including completed tasks, without changing their identity or other details. Preview remains unsaved until Save; Cancel discards the edit. Reject blank or duplicate names with feedback. Names accompany colours; failed saves preserve the previous saved state.
- **FR-11 — Upcoming sidebar:** Left of the calendar, show "I dag", "Denne uken" (after today to this week's end) and "Kommende" (next week onwards). Show up to two task rows per section; if more exist, the third row is "Vis mer". It expands that section inline to all its tasks; "Vis mindre" collapses it. Periods use the real local date and Monday–Sunday weeks, independently of the displayed calendar month; they do not duplicate today. Completed tasks remain visible until cleanup (FR-14).
- **FR-12 — Optional times and conflicts:** A dated task can have start/end times or neither. Both times must be supplied or both empty; end must be later than start on the same date. Overnight intervals are not supported. Overlapping unfinished tasks on the same date have red title text, retaining their category backgrounds and a textual conflict cue. Touching endpoints do not overlap; completed tasks do not contribute to conflicts. The user can save a conflict and reschedule manually; the app never moves tasks automatically.
- **FR-13 — Inline entry:** Each calendar day has a small plus button that opens an inline form in its expanded area with date prefilled. Clicking a timetable time also prefills start time; the user chooses the end. Clicking an existing task opens the same form with its values. Successful saving returns the day to normal month-view size. Failed saving preserves entered values and the open form. Opening an empty time chooser sets the draft to 12:00. Hours and five-minute choices (00, 05, …, 55) update the draft immediately and remain editable until "Lagre oppgave". New or changed times, including typed values, use five-minute steps. Both times can be cleared; unchanged legacy minute values are preserved. Leaving an unsaved changed form requires confirmation.

- **FR-14 — Recoverable cleanup:** "Rydd side" hides all completed tasks from normal calendar, timetable, upcoming and undated views across all dates, without deleting them. "Fullført" shows every completed task, whether cleaned up or not. Unchecking reopens the task and restores it to its dated or undated location with its details intact. Newly completed tasks stay visible until cleanup is requested again. Cleanup must preserve any unsaved editor draft.

### Personalisation and holidays

- **FR-15 — Appearance:** "Tilpass utseende" lets the user choose colours around the calendar and inside its day cells, a personal background image around the calendar, and one continuous image behind the whole month grid. Images fill their area and may be cropped. Changes preview immediately; Save retains them after reopening, Cancel restores saved appearance, and Reset previews the standard appearance until saved. The two images can be removed independently. These actions never delete tasks or categories. Invalid images and storage failures give understandable feedback without replacing saved preferences. Dates, task text, category labels, today marking and conflict cues remain readable over colours and images.
- **FR-16 — Norwegian holidays:** Show the 12 named annual Norwegian holidays with a red date, names below the date and a small Norwegian flag at the bottom-right of the cell. Include fixed and Easter-relative holidays, preserve both names if dates coincide, and permit normal task entry. Apply current annual rules for 1900–2099; explain when the displayed year falls outside coverage. This is not a historical legal calendar or a full official flag-day calendar; ordinary Sundays and holiday eves are not separately marked. Holiday information is not stored as user tasks.

### Review past unfinished tasks — approved, not yet implemented

- **FR-17 — Opening review:** When the calendar opens, show a notice only if incomplete tasks dated before the current local date exist. Include their count. Today's, undated and completed tasks do not qualify. Let the user review all qualifying tasks together, oldest task date first, in a near-full-screen window. Each task has "Lagre som utført" and "Endre". Editing occurs inside that window; successful saves update the list and count while keeping the window open for remaining tasks. Cancellation preserves saved data. Close after the last qualifying task is resolved or via the upper-left cross; outside clicks and Escape do not dismiss the window. Closing with the cross changes no tasks, and remaining qualifying tasks trigger the notice next time the calendar opens. Failed saves retain the task and draft.
- **FR-18 — Review refresh:** Recalculate the count across local midnight and on return after inactivity without forcing the review window open or moving focus. Other-tab updates must not discard unsaved drafts; defer disruptive refreshes and retain stale-edit protection. These are in-app notices, not background or operating-system reminders.

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
- Verify category creation, filtering, renaming and recolouring across active and completed tasks, default-category behaviour and failed saves (FR-8).
- Verify immediate appearance preview, Save, Cancel, Reset, independent image removal, reload retention and readability over images; tasks and categories must remain unchanged (FR-15).
- Verify fixed and movable holiday dates, coinciding names, year boundaries and bottom-right flag placement without covering tasks (FR-16).
- Verify the past-unfinished notice, date ordering, in-window editing, explicit dismissal, repeated notice on the next visit, last-task closure, midnight refresh and unsaved-draft protection (FR-17–18).
- Test the published address in a fresh browser profile without local server setup: create, edit, complete and reload tasks. Confirm that another profile has independent data and that local data does not silently migrate. Keep local README startup checks as a separate acceptance activity.
- Two other users can add a dated task, locate it and complete it without step-by-step help. Record difficulties and improvements.
- In Stage 2, at least 16 of 20 predefined, unambiguous tasks receive category suggestions meeting written criteria. Verify rejection, correction and AI failure separately (FR-9–10).
- Document setup, limitations, testing and AI assistance on GitHub; Matthew can explain the implemented behaviour.

**Countermeasure:** Faster entry and higher AI accuracy must not be achieved by silently hiding tasks outside explicit cleanup or filtering, discarding failed saves or applying suggestions without user control.

## 6. Exclusions and open decisions

The agreed scope excludes task sharing, team administration, account synchronisation, external calendar connections, scheduled/background reminders, recurring tasks and automatic rescheduling. The in-app past-unfinished notice (FR-17–18), manual start/end times and internet publication are included. Quiz and study-buddy functions are outside this product.

**Calendar planning:** Category behaviour is implemented. Epic 1 / FR-17–18 is implemented and locally accepted as of 23 November 2026; see [acceptance evidence](../../../implementation-artifacts/epic-1-acceptance.md). Calendar-wide user acceptance remains separate work.

**Ideas for later consideration — not approved requirements:** Week view and week numbers; recurring tasks; search; task copying; drag-to-reschedule with undo; multiple-category selection; export/import backup; and advance reminders. These came from brainstorming inspired by Google Calendar. Matthew selects any additions before they become scoped stories or alter the calendar acceptance boundary. They are not promised by this PRD. AI retains Epic 6 and follows calendar acceptance.

**Deferred AI decisions:** After Stage 1 acceptance, Matthew and the developer will select the provider, connection approach, cost limit and exact data sent. Credentials must stay on the server, outside committed code and browser JavaScript. Before Stage 2 implementation, define a clearly labelled fixed-suggestion test mode that runs without the owner's key or a paid account, plus 20 fictional inputs and written expected-category criteria. Test mode verifies the interaction and failure paths; it does not measure live AI accuracy. These are pending planning obligations, not implemented functionality.

## 7. Delivery status and next work — 2 November 2026

**Implemented increments:** Task creation/editing/deletion and descriptions; completion/reopening; local saving; month and expanded-day views; four default categories; upcoming sidebar; optional times, conflict rules and time chooser; undated list; recoverable cleanup and Fullført. See [implementation records](../../../implementation-artifacts/) and [test instructions](../../../../README.md#run-tests). These increments do not establish that all Stage 1 acceptance targets have passed.

**Additional delivered increments:** Category filtering, custom categories and editing names/colours (FR-8); saved appearance previews and continuous grid photo (FR-15); named Norwegian holidays with Norwegian flags (FR-16); and Vercel publication linked in README. Checked against current code and implementation records on 2 November.

**Verification evidence:** The 18 October work recorded 24 passing model/appearance/holiday unit tests and browser checks for core task flows and holidays. These are historical recorded results, not a new full test run for this document revision. On 31 October the published address returned HTTP 200 with the expected app, and Matthew confirmed task creation and persistence after refreshing the published page. Published editing and a full production acceptance run are not yet verified. No completed two-user trial or ten-task acceptance report is claimed.

**Remaining Stage 1 work (updated 23 November):** Complete the ten-task acceptance run, two external user trials, published-site checks and final usability, reliability and assessor-startup checks. Epic 1 is complete locally. Maintain testable stories for remaining work and link results to requirements; do not recreate delivered category/appearance/holiday features.

**Stage 2:** Not implemented. Detailed planning and implementation follow calendar completion. No AI service, evaluation result or test mode is claimed as delivered.

**Change record:**

- **23 November 2026 — appearance:** Epic 3 / FR-15 locally accepted with [combined evidence](../../../implementation-artifacts/epic-3-acceptance.md). Consolidated the delivered independent surrounding/grid photos, reset and preservation rules in Stories 3.1–3.4. No new requirements or production/user-trial acceptance claimed.

- **23 November 2026 — categories:** Epic 2 / FR-8 locally accepted with [combined test evidence](../../../implementation-artifacts/epic-2-acceptance.md). Consolidated Stories 2.1–2.3 and documented the existing all-category exception for the past review. No new category requirements or production/user-trial acceptance claimed.

- **23 November 2026:** Closed Epic 1 locally with requirement-to-test evidence, including midnight/inactivity refresh, cross-tab draft protection and per-task actions. No new requirements, production deployment or external user acceptance claimed.

- **13 October 2026:** Retained FR-1–13, added FR-14 for recoverable cleanup, settled time rules and recorded calendar-first sequencing.
- **2 November 2026:** Superseded the local-only publication restriction after the course enabled Vercel and the app was published. Expanded FR-8 to reflect approved category editing; added FR-15–16 for appearance and holidays and FR-17–18 for the previously approved past-unfinished workflow. Corrected delivered/pending status against the code, separated historical automated checks from user and production acceptance, and retained brainstormed extensions as unapproved ideas. AI remains deferred. No application code changed in this revision.

## FR-15 extension — Story 3.5, 27 November 2026

Approved implementation scope: softer rounded visual surfaces and a bundled optional mountain photo for either existing independent background. Preserve uploaded images, colours, explicit preview/save/cancel/reset and all task/category data. Stories 3.1–3.4 retain their earlier acceptance; Story 3.5 requires fresh verification and user visual acceptance. See ../../story-3-5-soft-nature-appearance.md.
