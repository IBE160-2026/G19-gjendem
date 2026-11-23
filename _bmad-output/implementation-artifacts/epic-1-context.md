# Epic 1 Context: Review past unfinished tasks

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Help the user notice and resolve earlier unfinished work without interpreting every past date as a missed delivery deadline. A dated task can represent anything the user intends; eligibility depends on its saved date and completion status. The notice, review list and per-task completion/editing are delivered and locally verified. Story 1.4 and combined Epic 1 local acceptance are complete as of 23 November 2026; see epic-1-acceptance.md for requirement-to-test evidence.

## Stories

- Story 1.1: Notice past unfinished work when opening the calendar
- Story 1.2: Open the large past-unfinished review window
- Story 1.3: Reschedule or complete a listed task
- Story 1.4: Keep unresolved tasks and refresh the notice

## Requirements & Constraints

A qualifying task is incomplete and has a saved calendar date strictly before the actual local current date. Tasks dated today, future tasks, undated tasks and completed tasks, including cleaned-up completed tasks, are excluded. The calculation is independent of the calendar month being browsed and must include relevant tasks from earlier months and years. Count saved records, never unsaved draft values. Show no warning when there are no qualifying tasks. Unreadable storage must produce an error, not a misleading zero count, and must never be replaced with empty data.

The notice must expose a meaningful count and access to the corresponding list. The review gathers all qualifying tasks rather than presenting one at a time. Order by task calendar date, oldest first, not creation order. Each listed task exposes its title, date and category name, with category colour as an additional cue. Do not rely on colour alone or inject task text as markup.

Opening or inspecting the review cannot complete, move, archive or delete tasks. Closing it does not acknowledge or permanently snooze unfinished work. On the next calendar visit, qualifying tasks must produce the notice again. Ordinary task operations remain available through their existing calendar interfaces outside the modal. Completion of this increment does not establish full calendar acceptance or external user-trial results.

Each listed task has its own "Lagre som utført" and "Endre" actions; neither applies to the entire list. Successful completion removes only that task from the unfinished list and retains it in Fullført, following existing completion/cleanup rules elsewhere. Editing opens inside the same window. Saving a date of today or later removes the task from this list but preserves its identity and other details; another past date keeps it in the appropriately ordered list. Successful saves return to the updated list and count, retaining the window while qualifying tasks remain and closing after the last is resolved. Cancelling an edit returns to the list without changing saved data; changed drafts retain the existing discard confirmation. Failed completion leaves the task unfinished. Failed edits retain the draft and explain the error; a stale edit must never overwrite a newer other-tab change.

Refresh the count automatically at local midnight and when returning after inactivity or PC sleep, using the actual local date without forcing the window open or moving focus. The next explicit review opening must show the updated qualifying tasks. Other-tab changes must not erase or replace drafts, reset focus, close the editor or silently overwrite newer records. Defer disruptive view updates until editing safely ends and explain that saved data changed. Counts still reflect saved records rather than draft values. These are in-app notices, not operating-system or background notifications. AI, mobile redesign, recurring tasks and cloud synchronisation are outside this work.

## Technical Decisions

Retain the simple browser application, usable from the published static Vercel site and from the existing local development server. No new starter framework, account service, database or background service is needed. Tasks and categories belong to the current browser profile and origin; localhost and the published address hold separate data. GitHub and publication do not back up user-entered tasks.

Preserve date-only calendar meaning and local day boundaries rather than shifting dates through UTC. Preserve task identity, category links and current time/completion semantics. Read failures, failed writes and concurrent edits must remain distinguishable. Retain versioned browser storage, existing validation and stale-edit protection. Review actions do not require a new task model or persisted dismissal flags. No action may report success before storage succeeds.

Use the latest confirmed requirements as authority where older draft UX or technical plans differ. The earlier unresolved placement of past-task access is resolved by the large review overlay. Older assumptions about removing completed tasks, Vite scaffolding, unsettled time rules and local-only publication are historical and must not be recreated.

## UX & Interaction Patterns

Use concise Norwegian Bokmål with neutral task language. The review is an in-app overlay covering almost the entire viewport, not a sidebar section or a separate browser tab. Show prominent notice text and a scrollable consolidated task list. Preserve the calendar's calm, readable cards and named categories; a custom background must not reduce overlay readability.

Place an accessible close cross in the upper-left corner. Outside clicks and Escape must not dismiss the review. The window may also close after successful handling of the final qualifying task. Closing or cancelling must respect unsaved-edit protection. Opening moves keyboard focus into the overlay, and underlying calendar controls must not receive accidental interaction. Successful task handling leaves focus useful for continuing with the remaining list. Closing restores focus to the notice entry, or another visible logical control when that entry no longer exists. No essential action is hover-only. Retain visible focus, semantic controls and labelled headings, with adequate text and control contrast and access under browser zoom.

## Cross-Story Dependencies

The notice enables review access; the review hosts the completion/edit actions; unresolved-task retention and refresh build on those saved mutations. Stories 1.1–1.3 have delivered increments, with Story 1.3 locally verified on 23 November 2026. Story 1.4 and combined Epic 1 local acceptance are complete. The combined dismissal/revisit, successful and failed action, last-task closure, midnight/inactivity and other-tab paths, including an active unsaved editor, passed the documented local tests. Preserve the established month, timetable, cleanup, filtering and appearance workflows. Calendar-wide acceptance and two external user trials remain separate later work; unit or browser checks alone do not establish those outcomes. Epic 7 mobile adaptation remains deferred, and AI still follows calendar completion and acceptance.
