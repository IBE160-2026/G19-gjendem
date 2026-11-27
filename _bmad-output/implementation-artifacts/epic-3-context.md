# Epic 3 Context: Customise calendar appearance

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Let the user personalise the surroundings, calendar and day surfaces while retaining a readable task overview, save choices between visits, and restore the standard appearance without changing tasks or categories. Stories 3.1–3.4 and the continuous-grid-photo extension were locally accepted on 23 November 2026. The approved 27 November Story 3.5 adds a softer visual direction and optional mountain/lake preset; it is not implemented or accepted yet. Earlier acceptance remains valid for its original scope, not for the new story or broader calendar/user acceptance.

## Stories

- Story 3.1: Surrounding background
- Story 3.2: Calendar colour and grid photo
- Story 3.3: Retain preferences
- Story 3.4: Reset appearance
- Story 3.5: Softer calendar with nature background

## Requirements & Constraints

- Support a surrounding colour or personal photo, calendar and day-cell colours, and a separate personal photo behind the monthly grid. Grid imagery covers the month once rather than repeating in cells. Both photo areas remain independently configurable and use centred cover cropping.
- Add the approved mountain/lake landscape as an optional bundled choice alongside personal images and colours. Never automatically replace saved preferences or make the new landscape the reset default. The selected mockup establishes visual direction; its example tasks, labels and counts do not add functionality.
- Preview changes immediately. Explicit Save persists them, Cancel restores the latest saved appearance, and Reset previews the existing defaults and removes both photos until saved. Removing grid imagery reveals chosen day colours. Saved choices survive reopening in the same browser profile and origin.
- Preserve tasks, category definitions and associations, completion/cleanup states, filtering rules and unrelated task/category drafts during all appearance operations. Keep month navigation, expanded-day scheduling, sidebars and editing usable.
- Preserve named category colours, red conflicts with a textual cue, checked/struck-through completion, distinguishable today/selected-day indicators and Norwegian holiday flags. Normal text targets 4.5:1 contrast; essential control/focus boundaries target 3:1. Inspect rendered light, dark and strongly coloured photo combinations rather than relying on nominal colours.
- Failed image processing retains the prior valid choice. Failed saves explain the failure and retain editable choices. Invalid stored data must not be silently replaced; stale saves must not overwrite newer other-tab preferences.
- Use Norwegian Bokmål controls and feedback, English project documentation and fictional verification data. Personal photos remain local. No external image service, account, AI request, credentials, cloud backup or device synchronisation is introduced.

## Technical Decisions

- Retain the plain HTML/CSS/JavaScript frontend with local Node server and static Vercel publication. Historical starter/framework proposals do not mandate re-scaffolding; unrelated architecture examples are not this app's architecture.
- Appearance persistence is independent of task/category storage. Appearance saves must not rewrite task records or interfere with task-operation locking. Preserve compatibility with older saved preferences lacking optional grid imagery.
- Bundle an optimised derivative of the approved landscape for both local and published delivery, without external image calls. Preserve the original planning asset and its provenance. The landscape is fictional Norwegian-inspired imagery, not a claim about a specific real location.
- Preserve established local-image validation, processing and storage-limit behaviour. A browser storage quota failure must retain drafts rather than claim success. Independently invalidate asynchronous work for each image on replacement, removal, Reset or Cancel; late results must never revive discarded images or overwrite the other selection. Save remains unavailable while either image is processing.
- Keep persistence bound to the same browser profile and origin. Localhost and the published site have separate saved data; deployment does not transfer tasks or preferences.

## UX & Interaction Patterns

- Use the approved mountain mockup as the new visual direction: rounded panels and controls, quieter grid separators, and light subtly translucent surfaces. Do not sacrifice readable labels, controls or focus for translucency. Protect essential date/task content from imagery; editing and expanded-day surfaces must remain legible.
- Preserve calendar-first desktop structure, management controls below the calendar, the left overview and the selected day's untimed panel on the right. Keep the existing desktop interaction model and system fonts. No new mobile layout or timetable behaviour belongs to Story 3.5.
- Retain one coherent, labelled, keyboard-operable appearance editor with understandable preview versus saved feedback. Existing own-image selection, colour controls, removal, Save, Cancel and Reset remain available.
- Verify desktop widths and browser zoom without clipped text or unreachable controls. User review of the new appearance is required before final visual acceptance. Choosing exact radii or opacity is implementation tuning within the approved direction, not permission to change task workflows.

## Cross-Story Dependencies

- Stories 3.1–3.2 share appearance choices; 3.3 persists them and 3.4 resets them. Story 3.5 extends these existing flows rather than replacing them. Reconcile the visual/interaction documents and FR-15 delivery status before implementation and link fresh evidence to the new acceptance criteria.
- Category editing remains independent: custom names, colours and task associations must survive appearance operations. Existing task, category, timetable and photo checks supply regression coverage but historical passes are not fresh acceptance evidence.
- Epic 5 owns calendar-wide acceptance, ten-task checks, two external trials, published-site verification and assessor startup. Native browser-zoom verification is still a tracked manual check. Epic 7 owns mobile and wider-screen redesign. AI remains deferred until calendar acceptance.

## Implementation update — 27 November 2026

Story 3.5 is implemented and locally verified with 26 unit tests and four browser suites. User visual acceptance remains pending. See spec-3-5-soft-nature-appearance.md for implementation and review evidence; earlier not-implemented wording above describes the planning input.
