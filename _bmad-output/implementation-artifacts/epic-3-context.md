# Epic 3 Context: Customise calendar appearance

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Let the user personalise the calendar's surroundings and calendar/day surfaces, retain those choices between visits, and return to the standard appearance without changing tasks or categories. The calendar must remain a clear overview of personal work, family and study tasks. All four appearance stories are approved together in the current session, including cover-cropped personal images and immediate preview with explicit Save/Cancel. This session approval supersedes the older planning notes that leave those interaction and reset choices open; image limits and storage details still require implementation decisions rather than invented product requirements.

## Stories

- Story 3.1: Surrounding background
- Story 3.2: Calendar colour
- Story 3.3: Retain preferences
- Story 3.4: Reset appearance

## Requirements & Constraints

- Offer a chosen colour or personal image around the calendar, plus control of calendar and day-cell background colours. Personal images fill their surrounding area using cover cropping; they must not obscure the calendar's content or controls.
- Preview appearance changes immediately while editing. Persist the selected appearance only through explicit Save. Cancel restores the previously saved appearance. Reset restores the standard appearance without altering tasks, category definitions, category colours or task-category associations.
- Reopening the calendar in the same browser profile and origin restores successfully saved appearance preferences. The local app has no account, cloud backup or automatic cross-device synchronisation; do not imply otherwise.
- Appearance changes must preserve task visibility and existing navigation, month/day expansion, timetable, sidebars, filters and editor behaviour. They must not move tasks, alter completion state, hide information or discard an unrelated unsaved task draft.
- Retain named category colours, red conflict titles with a textual cue, checked/struck-through completion, and distinct today and selected-day indications. Appearance settings do not replace category management or redefine task status colours.
- Normal text, including red conflict text and completed task text, targets at least 4.5:1 contrast. Essential controls and focus boundaries target at least 3:1. Verify actual rendered custom combinations; do not assume a background picker guarantees readability. Today and selection must remain distinguishable.
- Saving failure must give understandable feedback and keep the editable choices available; it must not claim persistence. Unreadable saved information must not be silently replaced. Define and document supported image formats, size limits and image-storage handling before accepting the feature; no specific limits are established by the planning documents.
- Controls, validation and feedback use Norwegian Bokmål. Project documentation remains in English. No external AI request, credential, new account system or publication is part of this epic.

## Technical Decisions

- Extend the established local-browser application without replacing its architecture or introducing a framework/cloud service merely for appearance settings. The older technical-plan starter proposal is historical, not authorisation to re-scaffold the app.
- Keep appearance persistence logically separate from task/category mutations so saving or resetting appearance cannot rewrite unrelated records. Choose the concrete schema and storage approach in implementation; the planning documents do not prescribe image encoding or an image database.
- Follow existing reliability constraints: validate saved data, coordinate competing writes as necessary, reject stale changes instead of silently overwriting newer information, and preserve drafts when an operation fails. Immediate visual preview is temporary and must remain distinguishable from a successful persistent save.
- Persistence is tied to the supported browser profile and stable local origin/port. Clearing site data can remove locally saved preferences; avoid wording suggesting backup or guaranteed retention beyond that environment.
- Treat user-provided content safely. User text must remain text, not executable markup. Personal-image handling must preserve the local-only Stage 1 experience.
- Use the established standard appearance as the reset baseline. Historical design shades are starting values, not grounds to change the current baseline or overwrite subsequently customised categories.

## UX & Interaction Patterns

- Preserve the calm, month-first desktop layout, readable system fonts, compact metadata, rounded cards and light dividers. Appearance customisation must remain subordinate to legible tasks and usable navigation.
- Provide labelled, keyboard-operable controls and visible focus. Preview must let the user judge the calendar while editing; Save and Cancel must make the commit boundary clear. Announce relevant validation, save success and failure without unnecessary focus changes.
- Keep important controls and information readable over both light and dark photographs and colour choices. Background imagery must not become the only surface behind essential text or erase task/category/status distinctions.
- Preserve access at supported desktop widths and browser zoom. Do not adopt the old prototype's narrow-screen task hiding or automatic dark theme as new requirements.

## Cross-Story Dependencies

- Stories 3.1 and 3.2 share one appearance-editing experience; 3.3 persists its saved state and 3.4 restores its standard state. Implement their preview, Save/Cancel and reset behaviour coherently as the approved combined scope.
- Category customisation belongs to Epic 2. Appearance changes must respect its category colours and preserve task associations, including user-defined categories.
- Epic 5 verifies the combined calendar, including appearance persistence, reset, accessibility and regression behaviour. Its real-user trials and assessor-startup acceptance remain separate activities; passing automated checks alone does not complete them.
- AI implementation remains deferred until the calendar is complete and accepted.
