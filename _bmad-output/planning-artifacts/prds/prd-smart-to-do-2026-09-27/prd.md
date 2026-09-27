---
title: "PRD: Smart To-Do"
status: draft
created: 2026-09-27
updated: 2026-09-27
---

# PRD: Smart To-Do

## 1. Purpose and users

This PRD translates the approved [product brief](../../../../product-brief.md) into requirements for a solo IBE160 project. This revision incorporates the approved calendar sketch and subsequent UX decisions. It supersedes earlier deadline-only wording, category names and the separate completed-task view. The revised draft awaits its closing review; older review reports describe the previous revision. See [UX behaviour](../../ux-designs/ux-smart-to-do-2026-09-27/EXPERIENCE.md).

Smart To-Do gives people one calendar overview of personal tasks across work, family and studies. Matthew is the first user: he currently uses work notes, a mobile calendar and memory, and finds it difficult to maintain an overview. The app supports personal organisation, not team administration.

**Confirmed platform:** The first version is a simple local web app used in a browser on the user's PC, without login or internet publication. Task data stays in that browser and is not automatically synchronised to other devices. Clearing browser data can remove saved tasks; the app must explain this limitation. The specific browser storage mechanism remains an architecture decision. External AI connectivity is addressed separately in Stage 2.

**Confirmed interface language:** Norwegian Bokmål. Buttons, field labels, status messages and error messages use Norwegian Bokmål. The first version supports this language only; project documentation remains in English.

## 2. Terms and development stages

- **Task:** A title, optional description, one category, one optional date, optional start/end times and a completion status. There are no separate work-period and submission-deadline task types; the user explains the task's meaning in its description.
- **Date:** The single calendar date chosen by the user, labelled "Dato". A dated task may have no time. An undated task is different from a dated task without a time.
- **Category:** "Jobb" (blue), "Skole" (yellow), "Familie" (green) or "Ellers" (light brown). Ellers is the default. Each task has one category; AI suggests that category rather than introducing another tagging system.
- **Past unfinished task:** An incomplete task dated before today. This replaces mandatory overdue/deadline semantics; the app does not infer whether the date meant planned work or a delivery deadline.

**Stage 1:** Working task management, calendar, categories and saved data.

**Stage 2:** AI category suggestions after Stage 1 works and is understood. Priority suggestions and short task summaries are later possibilities, not required for Stage 1 or 2.

## 3. Functional requirements

### Task management

- **FR-1 — Create:** The user can add a task with a non-empty title. Description, date and times are optional. Blank titles produce a clear message without discarding entered text.
- **FR-2 — Edit and delete:** The user can change a task or delete it. A changed date moves it to the correct day. Deletion requires confirmation; cancellation leaves the task unchanged.
- **FR-3 — Complete:** A checkbox completes a task without opening its form. It remains visible with a checked checkbox and strikethrough text in the calendar, timetable and side panels. Unchecking reopens it without losing its data. The undated list also retains completed tasks; the past unfinished list includes only incomplete tasks.
- **FR-4 — Save:** Tasks and categories survive closing and reopening the app in the same supported environment. A failed save displays an error and does not claim success.

### Calendar and overview

- **FR-5 — Month view:** The main view shows the current month and lets the user move between months and return to today. Dated tasks appear on their chosen dates. Today is clearly marked independently of the selected day.
- **FR-6 — Day details:** Selecting a day enlarges its calendar area into a timetable ordered by start time. A panel to its right shows only that day's tasks without times. Calendar overflow provides access to all tasks; none silently disappear.
- **FR-7 — Undated and past unfinished:** Tasks without dates appear in an accessible list. Past unfinished tasks remain accessible even when their month is not displayed. A task dated today is not in that past list.
- **FR-8 — Categories:** Provide the four categories and colours defined above, defaulting to Ellers. Retain the ability to create additional categories. Names accompany colours. Filtering shows matching tasks; clearing the filter restores the full overview.
- **FR-11 — Upcoming sidebar:** Left of the calendar, show "I dag", "Denne uken" (after today to this week's end) and "Kommende" (next week onwards). Show up to two task rows per section; if more exist, the third row is "Vis mer". It expands that section inline to all its tasks; "Vis mindre" collapses it. Periods do not duplicate today. Completed tasks remain visible.
- **FR-12 — Optional times and conflicts:** A dated task can have start/end times or neither. Overlapping time ranges on the same date make both tasks' text red, retaining their category backgrounds and a textual conflict cue. The user can save a conflict and reschedule manually; the app never moves tasks automatically. Detailed boundary and completion rules remain proposed UX defaults pending review.
- **FR-13 — Inline entry:** Each calendar day has a small plus button that opens an inline form in its expanded area with date prefilled. Clicking a timetable time also prefills start time; the user chooses the end. Clicking an existing task opens the same form with its values. Successful saving returns the day to normal month-view size. Failed saving preserves entered values and the open form.

### AI assistance — Stage 2 only

- **FR-9 — Suggest:** On user request, AI proposes an existing category from the task text. The user can accept, reject or change it. No suggestion changes a date, time or category automatically.
- **FR-10 — Failure:** An unavailable AI service or unusable suggestion produces understandable feedback. Creating, editing and completing tasks still work. The app does not silently apply an invalid suggestion.

## 4. Quality requirements

- **NFR-1 — Clarity:** Category and task status must be understandable without relying on colour alone. Main controls have descriptive labels and can be used with a keyboard.
- **NFR-2 — Reliability:** Month changes, tasks without dates and reopening the app must not lose or shift saved task data.
- **NFR-3 — Data handling:** Explain what task text is sent before requesting external AI assistance. API credentials must not appear in public code or be exposed to the browser. Use fictional tasks in demonstrations.

## 5. Acceptance and success

All targets are planned checks, not results:

- Use ten tasks across the four default categories to verify creation, editing, deletion, completion, filtering and data retention after closing and reopening. Include undated, past unfinished, today and next-month tasks (FR-1–8).
- Verify completion keeps tasks visible with checked boxes and strikethrough in the timetable and both side panels; reopening retains date, category and description (FR-3).
- Verify the sidebar's two-row limit and inline expansion, Sunday/Monday period boundaries, time/date prefill, successful collapse and failed-save recovery (FR-11, FR-13).
- Verify overlapping tasks both show conflict cues without losing category colours, and that untimed tasks remain accessible beside the timetable (FR-6, FR-12).
- Matthew can find upcoming, past unfinished and undated tasks across categories without consulting separate notes for the same tasks.
- Two other users can add a dated task, locate it and complete it without step-by-step help. Record difficulties and improvements.
- In Stage 2, at least 16 of 20 predefined, unambiguous tasks receive category suggestions meeting written criteria. Verify rejection, correction and AI failure separately (FR-9–10).
- Document setup, limitations, testing and AI assistance on GitHub; Matthew can explain the implemented behaviour.

**Countermeasure:** Faster entry and higher AI accuracy must not be achieved by hiding tasks, discarding failed saves or applying suggestions without user control.

## 6. Exclusions and open decisions

The first version excludes task sharing, team administration, account synchronisation, external calendar connections, automatic reminders, recurring tasks and automatic rescheduling. Manual start/end times are included. Quiz and study-buddy functions are outside this product.

Before implementing the affected screens, Matthew and the developer will settle the layout for undated/past unfinished lists and category creation/filtering, plus the proposed time-validation and conflict boundary rules in EXPERIENCE.md. These views were not demonstrated in the approved sketch.

The developer will choose the browser storage mechanism and document its retention limits during architecture planning, before implementing FR-4. Matthew and the developer will confirm the AI provider, connection approach, cost limit and data sent before Stage 2. These deferred decisions do not block UX planning; they must be resolved before the relevant implementation starts.

