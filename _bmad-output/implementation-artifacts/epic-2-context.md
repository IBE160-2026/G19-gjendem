# Epic 2 Context: Organise tasks by category

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Help the user organise personal work, study and family tasks by filtering the calendar overview and creating or updating categories, while preserving every existing task and its category association. Filtering, custom-category creation and name/colour editing are already delivered; their combined Epic 2 local acceptance is complete as of 23 November 2026 (see epic-2-acceptance.md). The approved overview supplies the three stories; the updated PRD and detailed Epic 2 criteria resolve the category decisions recorded as open in older drafts. Calendar-wide acceptance remains separate work.

## Stories

- Story 2.1: Filter tasks by category
- Story 2.2: Create user-defined categories
- Story 2.3: Edit category names and colours

## Requirements & Constraints

- Each task has one category. Initially provide Jobb in blue, Skole in yellow, Familie in green and Ellers in light brown. Users may add categories and rename or recolour any category, including defaults. The category initially called Ellers remains the task-creation default after renaming.
- Selecting a category shows its matching tasks; clearing the filter restores all categories. Filtering is a display operation and must not delete, reschedule, complete or recategorise tasks. Hidden tasks still participate in conflict detection, and cleanup still applies across categories.
- Tasks and categories must survive reopening in the same supported browser environment. Existing task identity, descriptions, dates, times, completion and cleanup state must survive category-related changes and any storage migration.
- Saving a category updates its name and colour for all associated tasks, including completed tasks, without changing task identity or other details. Reject blank and duplicate names with feedback. Preview is unsaved until Save; Cancel discards the edit. Failed saves preserve the previous saved state and entered values.
- Preserve the established task rules: completed tasks stay visible until explicit cleanup; Fullført retains all completed tasks; reopening restores their dated or undated location. Filtering must not be confused with cleanup or permanent task loss.
- Preserve normal task editing and unsaved drafts. Failed saves must report an understandable error without claiming success or discarding input. Stale edits must not overwrite newer saved data from another tab.
- Stage 1 task data stays in the current browser profile and site address, including on the published site. It requires no AI service, credentials or account system. AI suggestions are deferred until calendar acceptance. Use fictional task data for demonstrations and checks.
- Verify filtering and restoration, creation and reuse of custom categories, rename/recolour across active and completed tasks, the retained default after renaming, persistence after reopening, existing-task preservation and failed saves. Record expected and actual results without treating historical automated checks as current acceptance. The separate ten-task acceptance run, external user trials and published-site checks are not established by feature tests alone.

## Technical Decisions

- Retain the plain HTML/CSS/JavaScript application. A local Node server supports development and startup; the published site serves the same frontend statically. Do not recreate the historical Vite proposal. There is no finalised architecture document; updated requirements and approved decisions supersede historical technical and UX proposals.
- Keep a single task model with a category association and one optional local calendar date. Category work must not introduce multiple tags, separate deadline/work dates or automatic date changes.
- Retain versioned browser storage. Read the latest saved state before writing, coordinate competing writes and reject stale changes. Successfully persist a mutation before presenting it as saved. Unreadable stored data must not be replaced with an empty collection.
- Category identity must remain independent of an editable display name so renaming preserves associations and the default category. Any storage migration must preserve the saved task collection and its associations; acceptance must not invent a new migration solely from an obsolete planning gap.
- Browser storage belongs to a browser profile and origin. Keep the established local address and port so existing tasks remain accessible. Localhost and the published HTTPS site have separate data; publication does not transfer tasks. This persistence is not backup or cross-device synchronisation.
- Render user-entered names as text, not executable markup. Store date-only values as local calendar dates without UTC conversion.

## UX & Interaction Patterns

- Use Norwegian Bokmål for controls, labels, validation and feedback. Maintain the calm, month-first desktop layout, with upcoming tasks on the left and selected-day untimed tasks on the right.
- "Vis kategori" exposes the active single-category filter; "Vis alle" restores the overview. Distinguish no matching tasks from a genuinely empty task collection. "Administrer kategorier" opens a combined list for name and colour edits, offering presets and a custom colour with explicit Save and Cancel.
- Show category names alongside colour in selectors and task displays. Preserve independent checkbox completion, strikethrough, today marking and red conflict titles with a textual conflict cue. A colour change must not obscure these meanings.
- Normal text, including conflict and completed text, targets at least 4.5:1 contrast on its actual background; essential controls and focus boundaries target 3:1. Verify chosen custom colours rather than assuming the original palette guarantees readability.
- Use labelled semantic controls, visible focus, keyboard access and sensible focus restoration. Preserve draft text and focus when validation or storage fails; do not discard an editor merely to refresh filtered results. Browser zoom must not make task access or category controls unreachable.

## Cross-Story Dependencies

- Filtering, creation and editing share stable category identity. Custom categories must become available for task assignment and filtering; rename/recolour operations must keep those associations intact.
- Preserve the past-unfinished review and its saved-data-based count when defining filter scope. Its established rule includes all unfinished tasks dated before local today; filtering must not silently redefine that rule.
- Epic 1 is locally accepted; preserve its all-category past-unfinished workflow. Epic 5 verifies category features together with existing calendar workflows and external user trials. Epic 6 remains deferred until calendar acceptance. Appearance, holidays and responsive-layout work belong to separate epics.
