---
title: "Smart To-Do: technical plan"
status: draft
created: 2026-09-27
---

# Smart To-Do: technical plan

This is a proposed build sequence for Matthew's solo project, not a finalized BMAD architecture or an implemented application. Requirements: [PRD](prds/prd-smart-to-do-2026-09-27/prd.md). Appearance and behaviour: [DESIGN](ux-designs/ux-smart-to-do-2026-09-27/DESIGN.md) and [EXPERIENCE](ux-designs/ux-smart-to-do-2026-09-27/EXPERIENCE.md).

## Proposed approach

Use HTML, CSS and plain JavaScript, with Vite's vanilla starter to run the app locally. This keeps the code approachable for a beginner. React is an alternative if the interface later needs a larger component system; it introduces additional concepts that are not needed for the first working slice. No framework or package version is pinned yet: verify the installed Node version and pin compatible dependencies when scaffolding.

Vite documents a vanilla starter and its Node requirements in its [official guide](https://vite.dev/guide/) (checked 2026-09-27). The development server serves the interface locally; it is not a task database or public deployment.

## Shared rules proposed for implementation

- Keep one task model: id, title, description, category id, optional date, optional start/end, completed. Never add separate planned-work and deadline dates.
- Store dates as local calendar strings (YYYY-MM-DD), times as HH:mm. Avoid converting date-only values through UTC. Derive calendar and sidebar contents from the same task collection.
- Separate rendering, task/date rules and storage into small modules. Conflict and period calculations should not depend on the browser interface so they can be tested independently.
- Use a versioned localStorage snapshot for the small initial dataset. Publish successful changes to the interface only after storage succeeds. Failed writes retain the editor. Invalid stored data must produce a recoverable message and must not be overwritten with an empty dataset.
- Run at a stable local address and port; do not silently switch ports. Storage belongs to an origin and browser profile. Explain that clearing browser data can remove tasks. This is not a backup or device sync. See [MDN localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
- Display user-entered text as text, not executable HTML. No external AI calls or secrets in Stage 1.

## Build in small working steps

1. **First working slice:** Start the local app. Show a month calendar with today marked. Add a task with title, date and one of the four categories; save it locally and find it again after reload. Use Norwegian labels. This is a partial milestone, not completion of Stage 1.
2. **Task management:** Add editing, confirmed deletion, completion/reopening and visible checked/struck-through tasks. Verify failed-save handling before expanding the interface.
3. **Full calendar interaction:** Add expanded day, start/end times, untimed right panel, overlap cues and the left sidebar with inline expansion.
4. **Complete Stage 1:** Add undated and past unfinished access, filtering and custom categories after their layouts are settled. Check keyboard use, readable categories, empty states and month/week boundaries. Run the PRD acceptance checks with users and record actual results.
5. **Stage 2:** Add AI category suggestions only after the base app is reliable and Matthew can explain it. First choose provider, connection, cost and data handling. Never put an API secret in browser code.

## Decisions to settle before the affected step

The first slice can be prepared from the approved design. Before time scheduling, confirm the proposed same-day validation, touching interval behaviour and whether completed tasks participate in conflicts. Before full Stage 1, settle the unmocked list/filter/category screens. The UX documents distinguish confirmed behaviour from these proposals.

Before coding, verify the toolchain and choose supported browser(s). Before claiming Stage 1 complete, test storage denial/corrupt data and decide how multiple open tabs avoid overwriting newer changes. Record the final choices in the architecture workflow rather than treating this draft as approval of every technical detail.
