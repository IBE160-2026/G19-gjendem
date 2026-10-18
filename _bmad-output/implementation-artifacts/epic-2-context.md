# Epic 2 Context: Organise tasks by category

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Help the user organise personal work, study and family tasks by filtering the calendar overview and creating or updating categories, while preserving every existing task and its category association. The approved overview supplies this epic's stories; detailed criteria are not yet present in the main epics file. The current implementation request prioritises category filtering and custom categories. Category editing remains part of the approved epic scope, without implying that all three stories must ship in this increment.

## Stories

- Story 2.1: Filter tasks by category
- Story 2.2: Create user-defined categories
- Story 2.3: Edit category names and colours

## Requirements & Constraints

- Each task has one category. Initially provide Jobb in blue, Skole in yellow, Familie in green and Ellers in light brown; Ellers is the default for task creation. Users may add categories. The approved extension permits renaming and recolouring existing categories, including defaults.
- Selecting a category shows its matching tasks. Clearing the filter restores the complete applicable overview. Filtering is a display operation and must not delete, reschedule, complete or recategorise tasks.
- Tasks and categories must survive reopening in the same supported browser environment. Existing task identity, descriptions, dates, times, completion and cleanup state must survive category-related changes and any storage migration.
- Category editing must retain task associations. Category identity, migration, default-category behaviour after renaming, filter scope and name validation remain decisions for the affected story specification; the planning documents do not establish their exact policies.
- Preserve the established task rules: completed tasks stay visible until explicit cleanup; Fullført retains all completed tasks; reopening restores their dated or undated location. Filtering must not be confused with cleanup or permanent task loss.
- Preserve normal task editing and unsaved drafts. Failed saves must report an understandable error without claiming success or discarding input. Stale edits must not overwrite newer saved data from another tab.
- Stage 1 remains local and requires no AI service, credentials, account system or cloud infrastructure. AI suggestions are deferred until calendar acceptance. Use fictional task data for demonstrations and checks.
- Verify filtering and restoration across the surfaces included in the story's chosen scope, creation and reuse of custom categories, persistence after reopening, existing-task preservation and failure handling. The separate ten-task acceptance run and external user trials are not established by automated feature tests.

## Technical Decisions

- Extend the existing plain HTML/CSS/JavaScript application and local Node server; do not recreate the historical Vite starter proposal. There is no finalised architecture document; the October requirements and subsequent approved decisions take precedence over the September technical draft.
- Keep a single task model with a category association and one optional local calendar date. Category work must not introduce multiple tags, separate deadline/work dates or automatic date changes.
- Retain versioned browser storage. Read the latest saved state before writing, coordinate competing writes and reject stale changes. Successfully persist a mutation before presenting it as saved. Unreadable stored data must not be replaced with an empty collection.
- Design any custom-category migration to preserve the saved task collection and its associations. Do not infer a migration policy from an older proposal; record the chosen behaviour in the relevant story.
- Browser storage belongs to a browser profile and origin. Keep the established local address and port so existing tasks remain accessible. This persistence is not backup or cross-device synchronisation.
- Render user-entered names as text, not executable markup. Store date-only values as local calendar dates without UTC conversion.

## UX & Interaction Patterns

- Use Norwegian Bokmål for controls, labels, validation and feedback. Maintain the calm, month-first desktop layout, with upcoming tasks on the left and selected-day untimed tasks on the right.
- Keep the active category filter visible and provide an obvious clear action. Distinguish a category with no matching tasks from a genuinely empty task collection. The category filter and management entry surfaces are not specified by existing mockups and need a concrete design in the implementation spec.
- Show category names alongside colour in selectors and task displays. Preserve independent checkbox completion, strikethrough, today marking and red conflict titles with a textual conflict cue. A colour change must not obscure these meanings.
- Normal text, including conflict and completed text, targets at least 4.5:1 contrast on its actual background; essential controls and focus boundaries target 3:1. Verify chosen custom colours rather than assuming the original palette guarantees readability.
- Use labelled semantic controls, visible focus, keyboard access and sensible focus restoration. Preserve draft text and focus when validation or storage fails; do not discard an editor merely to refresh filtered results. Browser zoom must not make task access or category controls unreachable.

## Cross-Story Dependencies

- Filtering and category management need a consistent category identity and lookup contract. Custom categories must become available to task assignment and filtering; later rename/recolour operations must keep those associations intact.
- Preserve the past-unfinished review and its saved-data-based count when defining filter scope. Its established rule includes all unfinished tasks dated before local today; filtering must not silently redefine that rule.
- Epic 5 verifies category features together with existing calendar workflows. Epic 6 remains deferred until calendar acceptance. Appearance customisation and public holidays belong to separate epics.
