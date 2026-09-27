---
title: "PRD: Smart To-Do"
status: final
created: 2026-09-27
updated: 2026-09-27
---

# PRD: Smart To-Do

## 1. Purpose and users

This PRD translates the approved [product brief](../../../../product-brief.md) into requirements for a solo IBE160 project. It guides UX design, architecture and implementation. The platform, interface language, category model, deletion confirmation and completed-task behaviour have been confirmed.

Smart To-Do gives people one calendar overview of personal tasks across work, family and studies. Matthew is the first user: he currently uses work notes, a mobile calendar and memory, and finds it difficult to maintain an overview. The app supports personal organisation, not team administration.

**Confirmed platform:** The first version is a simple local web app used in a browser on the user's PC, without login or internet publication. Task data stays in that browser and is not automatically synchronised to other devices. Clearing browser data can remove saved tasks; the app must explain this limitation. The specific browser storage mechanism remains an architecture decision. External AI connectivity is addressed separately in Stage 2.

**Confirmed interface language:** Norwegian Bokmål. Buttons, field labels, status messages and error messages use Norwegian Bokmål. The first version supports this language only; project documentation remains in English.

## 2. Terms and development stages

- **Task:** A title, optional notes, a category, an optional deadline and a completion status.
- **Deadline:** A calendar date by which a task should be completed, not a reserved work period.
- **Category:** A grouping such as Work, Family or Studies, displayed as "Jobb", "Familie" and "Studier". Uncategorized is displayed as "Uten kategori". Each task has one category; AI labels suggest that category rather than introducing a second tagging system.
- **Overdue:** An unfinished task with a deadline earlier than today.

**Stage 1:** Working task management, calendar, categories and saved data.

**Stage 2:** AI category suggestions after Stage 1 works and is understood. Priority suggestions and short task summaries are later possibilities, not required for Stage 1 or 2.

## 3. Functional requirements

### Task management

- **FR-1 — Create:** The user can add a task with a non-empty title. Notes and deadline are optional. Blank titles produce a clear message without discarding entered text.
- **FR-2 — Edit and delete:** The user can change a task or delete it. A changed deadline moves the task to the correct date. Deletion requires confirmation; cancellation leaves the task unchanged.
- **FR-3 — Complete:** The user can mark a task complete. Completed tasks retain their data in a separate view and are excluded from the active calendar, day, undated and overdue views. Reopening restores the task to its deadline date or the undated list, retaining its category and notes; an earlier deadline makes it overdue again.
- **FR-4 — Save:** Tasks and categories survive closing and reopening the app in the same supported environment. A failed save displays an error and does not claim success.

### Calendar and overview

- **FR-5 — Month view:** The main view shows the current month and lets the user move between months and return to today. Dated tasks appear on their deadline dates. Today is clearly marked.
- **FR-6 — Day details:** Selecting a day shows its tasks and allows task creation and editing. If a calendar cell cannot show every task, an indicator provides access to the rest; none silently disappear.
- **FR-7 — Undated and overdue:** Tasks without deadlines appear in an accessible list. Overdue tasks remain accessible even when their month is not displayed. A task due today is not overdue.
- **FR-8 — Categories:** The app provides "Jobb", "Familie" and "Studier" categories and lets the user create additional ones. Names and colours identify categories. Filtering shows matching tasks; clearing the filter restores the full overview. New tasks start as "Uten kategori" until the user selects a category.

### AI assistance — Stage 2 only

- **FR-9 — Suggest:** On user request, AI proposes an existing category from the task text. The user can accept, reject or change it. No suggestion changes a deadline or category automatically.
- **FR-10 — Failure:** An unavailable AI service or unusable suggestion produces understandable feedback. Creating, editing and completing tasks still work. The app does not silently apply an invalid suggestion.

## 4. Quality requirements

- **NFR-1 — Clarity:** Category and task status must be understandable without relying on colour alone. Main controls have descriptive labels and can be used with a keyboard.
- **NFR-2 — Reliability:** Month changes, tasks without deadlines and reopening the app must not lose or shift saved task data.
- **NFR-3 — Data handling:** Explain what task text is sent before requesting external AI assistance. API credentials must not appear in public code or be exposed to the browser. Use fictional tasks in demonstrations.

## 5. Acceptance and success

All targets are planned checks, not results:

- Use ten tasks across the three default categories to verify creation, editing, deletion, completion, filtering and data retention after closing and reopening the app. Include undated, overdue, today and next-month deadlines (FR-1–8).
- Verify that completion removes a task from active views without deleting it, and reopening restores its date, category, notes and appropriate overdue state (FR-3).
- Matthew can find upcoming, overdue and undated tasks across categories without consulting separate notes for the same tasks.
- Two other users can add a dated task, locate it and complete it without step-by-step help. Record difficulties and improvements.
- In Stage 2, at least 16 of 20 predefined, unambiguous tasks receive category suggestions meeting written criteria. Verify rejection, correction and AI failure separately (FR-9–10).
- Document setup, limitations, testing and AI assistance on GitHub; Matthew can explain the implemented behaviour.

**Countermeasure:** Faster entry and higher AI accuracy must not be achieved by hiding tasks, discarding failed saves or applying suggestions without user control.

## 6. Exclusions and open decisions

The first version excludes task sharing, team administration, account synchronisation, external calendar connections, automatic reminders, recurring tasks and scheduling work into time slots.

The developer will choose the browser storage mechanism and document its retention limits during architecture planning, before implementing FR-4. Matthew and the developer will confirm the AI provider, connection approach, cost limit and data sent before Stage 2. These deferred decisions do not block UX planning; they must be resolved before the relevant implementation starts.

