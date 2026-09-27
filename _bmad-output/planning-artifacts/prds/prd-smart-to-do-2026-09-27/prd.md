---
title: "PRD: Smart To-Do"
status: draft
created: 2026-09-27
updated: 2026-09-27
---

# PRD: Smart To-Do

## 1. Purpose and users

This draft translates the approved [product brief](../../../../product-brief.md) into requirements for a solo IBE160 project. It is a basis for discussion before UX design, architecture and implementation. Detailed behaviours below are proposals until reviewed.

Smart To-Do gives people one calendar overview of personal tasks across work, family and studies. Matthew is the first user: he currently uses work notes, a mobile calendar and memory, and finds it difficult to maintain an overview. The app supports personal organisation, not team administration.

**[ASSUMPTION A1]** The first version is a web app used in a desktop browser, with a Norwegian interface and no login. These choices are not yet confirmed. Storage technology and publishing are architecture decisions.

## 2. Terms and development stages

- **Task:** A title, optional notes, a category, an optional deadline and a completion status.
- **Deadline:** A calendar date by which a task should be completed, not a reserved work period.
- **Category:** A grouping such as Work, Family or Studies. **[ASSUMPTION A2]** Each task has one category; AI labels suggest that category rather than introducing a second tagging system.
- **Overdue:** An unfinished task with a deadline earlier than today.

**Stage 1:** Working task management, calendar, categories and saved data.

**Stage 2:** AI category suggestions after Stage 1 works and is understood. Priority suggestions and short task summaries are later possibilities, not required for Stage 1 or 2.

## 3. Functional requirements

### Task management

- **FR-1 — Create:** The user can add a task with a non-empty title. Notes and deadline are optional. Blank titles produce a clear message without discarding entered text.
- **FR-2 — Edit and delete:** The user can change a task or delete it. A changed deadline moves the task to the correct date. **[ASSUMPTION A3]** Deletion requires confirmation; cancellation leaves the task unchanged.
- **FR-3 — Complete:** The user can mark a task complete. **[ASSUMPTION A4]** Completion can be reversed; completed tasks remain available in a separate view and do not count as overdue.
- **FR-4 — Save:** Tasks and categories survive closing and reopening the app in the same supported environment. A failed save displays an error and does not claim success.

### Calendar and overview

- **FR-5 — Month view:** The main view shows the current month and lets the user move between months and return to today. Dated tasks appear on their deadline dates. Today is clearly marked.
- **FR-6 — Day details:** Selecting a day shows its tasks and allows task creation and editing. If a calendar cell cannot show every task, an indicator provides access to the rest; none silently disappear.
- **FR-7 — Undated and overdue:** Tasks without deadlines appear in an accessible list. Overdue tasks remain accessible even when their month is not displayed. A task due today is not overdue.
- **FR-8 — Categories:** The app provides Work, Family and Studies categories and lets the user create additional ones. Names and colours identify categories. Filtering shows matching tasks; clearing the filter restores the full overview. **[ASSUMPTION A5]** New tasks start as Uncategorized until the user selects a category.

### AI assistance — Stage 2 only

- **FR-9 — Suggest:** On user request, AI proposes an existing category from the task text. The user can accept, reject or change it. No suggestion changes a deadline or category automatically.
- **FR-10 — Failure:** An unavailable AI service or unusable suggestion produces understandable feedback. Creating, editing and completing tasks still work. The app does not silently apply an invalid suggestion.

## 4. Quality requirements

- **NFR-1 — Clarity:** Category and task status must be understandable without relying on colour alone. Main controls have descriptive labels and can be used with a keyboard.
- **NFR-2 — Reliability:** Month changes, tasks without deadlines and reopening the app must not lose or shift saved task data.
- **NFR-3 — Data handling:** Explain what task text is sent before requesting external AI assistance. API credentials must not appear in public code or browser-delivered secrets. Use fictional tasks in demonstrations.

## 5. Acceptance and success

All targets are planned checks, not results:

- Use ten tasks across the three default categories to verify creation, editing, deletion, completion, filtering and reopening. Include undated, overdue, today and next-month deadlines (FR-1–8).
- Matthew can find upcoming, overdue and undated tasks across categories without consulting separate notes for the same tasks.
- Two other users can add a dated task, locate it and complete it without step-by-step help. Record difficulties and improvements.
- In Stage 2, at least 16 of 20 predefined, unambiguous tasks receive category suggestions meeting written criteria. Verify rejection, correction and AI failure separately (FR-9–10).
- Document setup, limitations, testing and AI assistance on GitHub; Matthew can explain the implemented behaviour.

**Countermeasure:** Faster entry and higher AI accuracy must not be achieved by hiding tasks, discarding failed saves or applying suggestions without user control.

## 6. Exclusions and open decisions

The first version excludes task sharing, team administration, account synchronisation, external calendar connections, automatic reminders, recurring tasks and scheduling work into time slots.

Before UX and architecture planning, Matthew and the assistant should confirm A1–A5: platform/language/login, one category per task, deletion confirmation, completed-task behaviour and the Uncategorized default. The developer will choose storage with an explicit statement of its retention limits before implementing FR-4. Before Stage 2, confirm the AI provider, cost limit and data sent. None of these open choices implies completed design or implementation.
