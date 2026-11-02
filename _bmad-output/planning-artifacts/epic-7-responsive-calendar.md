---
title: "Epic 7: Adapt the calendar to mobile and larger PC screens"
created: 2026-11-02
status: approved-backlog
implementationStatus: not-started
source: confirmed user discussion on 2026-11-02
---

# Epic 7 — Adapt the calendar to mobile and larger PC screens

## Goal and sequencing

Use the calendar comfortably in a mobile browser and on larger PC screens while preserving the existing PC experience. The user approved the behaviour below and explicitly deferred implementation. Continue the previous work order, starting with the pending past-unfinished review in Epic 1 (PRD FR-17–18). Epic 7 does not replace that next task. Its placement relative to final calendar acceptance and Epic 6 remains to be scheduled; AI remains deferred until calendar acceptance.

This is a saved backlog epic, not a claim that a full BMAD readiness workflow or implementation has been completed. Before implementation, reconcile these approved additions into the PRD and UX contract and settle responsive breakpoints, tablet behaviour and test devices. No exact screen-width thresholds were chosen in the discussion.

## Story 7.1 — Keep the complete month on mobile

As a mobile user, I want the complete month as my first view so I can keep an overview of my plans.

- The month grid shows all seven weekday columns within the mobile viewport, without horizontal scrolling to reach a weekday. Vertical page scrolling is allowed.
- Each day shows its date and up to two task previews with shortened text where necessary.
- If more tasks are available under the current filter and cleanup rules, show the actual additional count, such as "+3 flere" for five tasks.
- Opening the day provides access to every task matching the current view rules; shortened text does not change the stored title.
- Today, categories, holiday labels/flags and conflicts remain distinguishable.

## Story 7.2 — Open a large mobile day view

As a mobile user, I want a near-full-screen day view so I can read and manage the selected day's tasks.

- Tapping a day opens its day view over nearly the entire mobile screen.
- Untimed tasks for that date appear above the timetable; timed tasks appear in the timetable using the existing time rules.
- All tasks for the selected day remain reachable through scrolling, subject to the existing filter and cleanup rules.
- Closing returns to the month. Existing protection for unsaved edits still applies.
- The near-full-screen presentation is mobile-only. PC retains its existing in-calendar expanded day and untimed-task side panel.

## Story 7.3 — Scroll to the upcoming overview on mobile

As a mobile user, I want the upcoming overview below the calendar so I can reach it by scrolling.

- "I dag", "Denne uken" and "Kommende" appear below the mobile calendar.
- Their existing date boundaries, two-task limit, inline expansion and completion behaviour remain unchanged.
- No separate overview drawer is required.
- On PC the overview remains to the left of the calendar.

## Story 7.4 — Preserve PC layout and use wider screens

As a PC user, I want the familiar arrangement to remain while the calendar uses the extra width of a larger screen.

- Keep the month, left overview, controls and expanded-day behaviour in their current PC arrangement.
- A larger PC viewport gives the calendar more horizontal room without switching to the mobile day presentation.
- Text and controls remain readable and usable; widening does not simply scale every element indiscriminately.
- Changing viewport size changes presentation without changing task data or saved appearance preferences.

## Story 7.5 — Verify responsive use

As a user, I want the same task functions to remain usable across the supported screen sizes.

- Record checks on a narrow mobile viewport, mobile landscape, a normal PC viewport and a larger PC viewport; record exact dimensions and browsers when preparing implementation.
- Verify month navigation, day opening/closing, task creation/editing/completion, filtering and appearance controls.
- On mobile, touch controls and forms remain reachable while the on-screen keyboard is open.
- Verify two previews plus the remaining count with long titles and several tasks, and check holidays, today marking and conflict cues over custom backgrounds.
- Compare PC before/after screenshots and interaction checks to demonstrate that the existing arrangement and behaviour are preserved.

## Boundaries

This epic does not add account login, shared tasks, cloud storage, data migration or synchronisation between PC and mobile. Each browser and site address retains its own saved data. It does not add week view, recurrence or other unapproved brainstorming ideas. No implementation starts as part of recording this epic.
