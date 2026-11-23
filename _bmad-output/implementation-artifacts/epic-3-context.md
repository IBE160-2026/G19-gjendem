# Epic 3 Context: Customise calendar appearance

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Let the user personalise the surroundings, calendar and day surfaces while retaining a readable task overview, save those choices between visits, and restore the standard appearance without changing tasks or categories. The four approved stories and the subsequent continuous calendar-grid photo increment are already delivered. Combined local acceptance is complete as of 23 November 2026; epic-3-acceptance.md records fresh results for the delivered scope. No broader calendar/user acceptance is claimed.

## Stories

- Story 3.1: Surrounding background
- Story 3.2: Calendar colour
- Story 3.3: Retain preferences
- Story 3.4: Reset appearance

## Requirements & Constraints

- Support a surrounding colour or personal photo, calendar and day-cell colours, and a separate personal photo behind the whole monthly grid. The grid photo is one continuous cover-cropped image across all week rows, never a repeated image in each cell. The two photos are independently configurable; surrounding photos use centred cover cropping.
- Changes preview immediately without persistence. Explicit Save commits them; Cancel restores the latest saved appearance. Reset previews the established defaults, including removal of both photos, and requires Save to persist. Removing the grid photo reveals the chosen day colours.
- Successfully saved choices survive reopening in the same browser profile and local origin. Reset, Save, Cancel and image removal preserve tasks, category definitions, task-category associations and unrelated unsaved task/category drafts.
- Keep existing month navigation, expanded-day timetable, task editing, sidebars, category filtering and completion/cleanup usable. Appearance must not change task dates, completion, visibility rules or category colours.
- Preserve readable named categories, red conflict titles with a textual cue, checked/struck-through completion, and distinguishable today and selected-day indicators. Normal text, including conflict and completed text, targets 4.5:1 contrast; essential controls and focus boundaries target 3:1. Acceptance must inspect actual rendered combinations and image backgrounds.
- Failed image processing keeps the prior valid choice. Failed saves retain editable choices and explain that persistence failed. Invalid stored data must not be silently replaced. A stale save must not overwrite a newer appearance saved in another tab.
- Use Norwegian Bokmål controls and feedback, English project documentation, and fictional tasks and image fixtures for verification. Photos remain local; no upload, external image URL, account, AI request or credential is part of this epic.

## Technical Decisions

- Preserve the established local HTML/CSS/JavaScript application and local server. Historical starter/framework proposals do not require re-scaffolding. Appearance acceptance does not introduce cloud storage, backup or cross-device synchronisation.
- Appearance uses independently versioned local persistence, separate from task/category storage. Appearance operations must never rewrite task records or interfere with task-operation control locking. Coordinate writes and compare the original saved snapshot before committing; reject stale changes while preserving the draft.
- Preserve compatibility with older saved appearance records that lack the optional grid photo. Missing grid imagery means no grid photo, without losing earlier colour or surrounding-photo preferences.
- Retain the delivered local-image limits: JPG, PNG or WebP; at most 10 MiB input and 40 megapixels decoded; resize to a maximum dimension of 1600 pixels, flatten and re-encode as JPEG, and cap each saved data URL at 1.5 million characters. Storage quota failure remains possible and must preserve drafts rather than claim success.
- Independently invalidate asynchronous work for each photo on replacement, removal, reset or Cancel. A late result must not resurrect a discarded photo or overwrite the other photo. Shared Save remains disabled while either image is processing; one successful conversion must not erase the other image's failure feedback.
- Use the existing standard appearance as the reset baseline. Never derive reset values from historical design shades or reset customised categories. Persistence remains tied to the supported stable local address/port and browser profile.

## UX & Interaction Patterns

- Retain the calendar-first desktop arrangement with management controls below it, the left overview and the expanded-day untimed panel on the right. Keep readable system fonts, compact metadata, rounded cards and light dividers.
- Keep one coherent appearance editor with labelled keyboard-operable controls, visible focus and clear preview versus saved-state feedback. Save, Cancel, removal and reset must remain understandable and reachable.
- Protect date labels, task cards and essential controls from photographs; expanded-day/editor panels stay opaque. Light, dark and strongly coloured backgrounds must not hide errors, focus rings or task status cues.
- Verify supported desktop widths and browser zoom without losing task or control access. Mobile redesign is separate approved backlog work, not part of this acceptance pass.

## Cross-Story Dependencies

- Stories 3.1 and 3.2 share the editor and image handling; 3.3 commits their combined saved state and 3.4 resets it. The delivered continuous-grid photo uses those same preview, persistence and reset rules and belongs in the combined acceptance scope.
- Epic 2 category editing remains independent. Custom category names/colours and all task associations must survive every appearance operation; existing task, category and timetable checks provide regression coverage.
- Historical appearance and grid-photo checks cover cancellation, reload, invalid images, storage failures, concurrent work and visual continuity. Record fresh expected/actual results for final acceptance instead of treating historical passing counts as a new run.
- Epic 5 still owns calendar-wide acceptance, two external user trials and assessor startup verification. Epic 3 acceptance does not complete those activities or authorise deferred Epic 6 AI work or Epic 7 responsive implementation.
