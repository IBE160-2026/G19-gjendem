# Epic 1 Context: Review past unfinished tasks

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Help the user notice and review earlier unfinished work without interpreting every past date as a missed delivery deadline. A dated task can represent anything the user intends; the app identifies unfinished work using its saved date and completion status. The complete epic adds a notice, a large consolidated review window, actions to reschedule or complete tasks, and refresh rules that protect unsaved work. Current delivery scope is deliberately narrower: the user requested the first increment, the notice and read-only overview window; mutation actions follow in the next increment.

## Stories

- Story 1.1: Notice past unfinished work when opening the calendar
- Story 1.2: Open the large past-unfinished review window
- Story 1.3: Reschedule or complete a listed task
- Story 1.4: Keep unresolved tasks and refresh the notice

## Requirements & Constraints

A qualifying task is incomplete and has a saved calendar date strictly before the actual local current date. Tasks dated today, future tasks, undated tasks and completed tasks, including cleaned-up completed tasks, are excluded. The calculation is independent of the calendar month being browsed and must include relevant tasks from earlier months and years. Count saved records, never unsaved draft values. Show no warning when there are no qualifying tasks. Unreadable storage must produce an error, not a misleading zero count, and must never be replaced with empty data.

The notice must expose a meaningful count and access to the corresponding list. The review gathers all qualifying tasks rather than presenting one at a time. Order by task calendar date, oldest first, not creation order. Each listed task exposes its title, date and category name, with category colour as an additional cue. Do not rely on colour alone or inject task text as markup.

Opening or inspecting the review cannot complete, move, archive or delete tasks. Closing it does not acknowledge or permanently snooze unfinished work. On the next calendar visit, qualifying tasks must produce the notice again. Ordinary task operations remain available through their existing calendar interfaces outside the modal. This increment must not claim that the complete epic or its mutation/refresh stories are delivered.

The completed epic will allow per-task completion and editing inside the same review window. Successful changes update the count/list, retain the window while tasks remain and close it after the final qualifying task is resolved. Cancelling an edit preserves saved data; failure keeps the draft and explains the error. Those actions are deferred for the current first increment rather than being silently implemented or presented as functioning controls.

The full epic also requires local-midnight and return-from-inactivity count refresh without forcing the window open or moving focus. Other-tab changes must not erase drafts or silently overwrite newer records; disruptive view updates are deferred while editing. These are in-app notices, not operating-system or background notifications. AI, mobile redesign, recurring tasks and cloud synchronisation are outside this work.

## Technical Decisions

Retain the simple browser application, usable from the published static Vercel site and from the existing local development server. No new starter framework, account service, database or background service is needed. Tasks and categories belong to the current browser profile and origin; localhost and the published address hold separate data. GitHub and publication do not back up user-entered tasks.

Preserve date-only calendar meaning and local day boundaries rather than shifting dates through UTC. Preserve task identity, category links and current time/completion semantics. Read failures, failed writes and concurrent edits must remain distinguishable. Existing versioned storage and stale-edit protection are retained; the first read-only increment does not require a data migration or extra persisted dismissal flags.

Use the latest confirmed requirements as authority where older draft UX or technical plans differ. The earlier unresolved placement of past-task access is resolved by the large review overlay. Older assumptions about removing completed tasks, Vite scaffolding, unsettled time rules and local-only publication are historical and must not be recreated.

## UX & Interaction Patterns

Use concise Norwegian Bokmål with neutral task language. The review is an in-app overlay covering almost the entire viewport, not a sidebar section or a separate browser tab. Show prominent notice text and a scrollable consolidated task list. Preserve the calendar's calm, readable cards and named categories; a custom background must not reduce overlay readability.

Place an accessible close cross in the upper-left corner. Outside clicks and Escape must not dismiss the review. The complete epic also permits closure after successful handling of the final task, but the read-only first increment closes through the cross. Opening moves keyboard focus into the overlay, and underlying calendar controls must not receive accidental interaction. Closing restores focus to the notice entry, or another visible logical control when that entry no longer exists. No essential action is hover-only. Retain visible focus, semantic controls and labelled headings, with adequate text and control contrast and access under browser zoom.

## Cross-Story Dependencies

The first increment combines the count and read-only list into one coherent review entry. It uses existing saved task/category information without altering the established month, timetable, completion, cleanup, filtering or appearance workflows. Later Story 1.3 adds actions using existing mutation and editor protections. Story 1.4 completes refresh and retained-work behaviour across changes and day boundaries. Calendar acceptance and two external user trials remain separate later work; completed unit or browser checks alone do not establish those outcomes. Epic 7 mobile adaptation remains deferred, and AI still follows calendar completion and acceptance.
