# Epic 4 Context: See Norwegian public holidays

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Show Norwegian public holidays in the calendar with their names and correct dates for the displayed year, including movable holidays, so users can plan with useful calendar context while continuing to use every date for normal tasks. The approved epic overview establishes the scope; the older PRD and UX documents do not yet fully describe this addition. Reconcile the affected planning requirements before implementation, using the current approved presentation recorded below.

## Stories

- Story 4.1: Holiday display

## Requirements & Constraints

- Display named Norwegian public holidays with a distinct marking for the selected year. Movable holidays must follow that year's dates rather than reuse dates from the current year.
- Holidays are calendar information, not user-created tasks. They must not prevent task creation or alter task dates, categories, completion or saved details.
- Confirm the precise holiday set, supported year range and expected dates against authoritative sources before implementation. The planning artifacts leave these choices open; this context does not establish a holiday list or an arbitrary year limit.
- Keep month navigation, return to today and access to all dated tasks working. Today's indication remains distinct from the selected day and holiday marking.
- Preserve normal day expansion, timed task entry and the selected-day untimed panel. Calendar information must not hide task content or prevent reaching tasks in crowded cells.
- Preserve existing appearance preferences, including personal photos around the calendar and chosen calendar/day colours. Keep category backgrounds, completion cues and red conflict titles distinguishable alongside holiday markings.
- Use concise Norwegian Bokmål labels and holiday names. Meaning must remain available without relying on red colour or the flag alone.
- Maintain keyboard access, visible focus and descriptive control names. Support the desktop browser layout and browser zoom without losing controls or tasks. Normal text targets 4.5:1 contrast; essential controls and focus boundaries target 3:1, including on user-selected surfaces.
- Calendar work belongs to Stage 1. No AI provider, credentials, cloud service or AI functionality is part of this epic.

## Technical Decisions

- Retain the approved plain HTML/CSS/JavaScript and local Node-server approach; the historical proposal to scaffold a Vite starter is superseded. No new application framework or cloud infrastructure is required.
- Treat date-only values as local calendar dates. Do not convert them through UTC in ways that shift the displayed day. Holiday dates and task dates must agree when navigating between months and years.
- Keep date calculations separable from browser rendering so the selected holiday rules and year boundaries can be checked independently. The planning material does not yet choose a holiday algorithm, library or external data service.
- Keep holiday calendar information separate from the task collection. Rendering holidays must not create task records or require rewriting saved task/category data.
- Preserve the storage guarantees of surrounding task workflows: persist successfully before showing success, retain drafts on failure, reject stale changes, and never replace unreadable saved data with an empty collection. Keep the stable local origin and existing browser storage environment.
- Render user-entered text safely as text. Calendar decorations must not compromise the handling of task titles, category names or appearance choices.

## UX & Interaction Patterns

The current user-approved holiday presentation is a red date number, the holiday name underneath, and a small red flag at the bottom-right of the day cell. Apply this within the calm month-first layout, preserving normal task interaction and the established appearance choices. The holiday name supplies a textual cue independent of the red styling.

Keep the day number, add button and task controls reachable. A holiday cell remains a normal selectable day, with the same inline editor and save/cancel behaviour as other days. Do not introduce a special blocked-date state. Preserve readable system-font text, compact metadata, spacing, rounded surfaces and light dividers. The marking must coexist with today's outline/text cue, task completion checkboxes/strikethrough and textual conflict cues.

## Cross-Story Dependencies

Epic 4 contains one story and can deliver independent value on the existing calendar. Its display must coexist with Epic 2 category controls and Epic 3 appearance preferences; those features must not lose their normal operation when holiday information is added. Epic 5 verifies the combined calendar result through the planned acceptance run, external user trials and startup checks. Epic 6 remains deferred until calendar acceptance.
