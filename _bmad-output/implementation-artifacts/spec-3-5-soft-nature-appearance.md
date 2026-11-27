---
title: Softer calendar with optional mountain landscape
type: feature
created: 2026-11-27
status: done
route: oneshot
---

<frozen-after-approval>
## Intent

Implement approved Story 3.5: soften calendar, panels and controls using the selected mountain mockup as direction; provide the landscape as an optional local preset for either independent background. Preserve existing saved choices, upload/colour controls, preview/save/cancel/reset, task data, category colours, readable state cues and desktop arrangement. No mobile redesign, AI, default photo replacement or publication. User visual acceptance follows the working preview.
</frozen-after-approval>

## Implementation Notes

No intent gaps or irreversible operations. Small reversible extension: `app/appearance.js` reuses existing validated JPEG storage, image processing, per-image sequence guards and save flow; `app/index.html` adds two explicit preset targets; `app/styles.css` softens existing selectors without moving content; `app/server.mjs` serves one allowlisted local JPEG. Preserve unrelated untracked files. No sprint-status file exists.

The original generated landscape is retained in planning assets; compressed JPEG is bundled under `app/assets`. Preset selection loads locally and passes through the same processor as uploads; no schema migration or external image host. Add focused browser regression for asset delivery, both targets, save/reload, cancellation during load and failure; rerun existing appearance and grid suites plus unit tests. Review and inspect screenshots before recording implementation complete. Planning story remains pending user visual acceptance until the user tries it.

## Verification — 27 November 2026

Implemented rounded panels, day cells and task cards; restrained separators; frosted light photo surfaces; independent preset buttons using the existing upload pipeline. The bundled JPEG is 263,466 bytes. Unit tests: 26 passed. Browser suites: nature-appearance-check, appearance-check, grid-image-check and appearance-acceptance-check passed, including save/reload, reset, async cancellation, quotas, stale writes, record/draft preservation and contrast. Surrounding/grid screenshots inspected. Native browser-menu zoom remains Epic 5; user visual acceptance remains pending.

Initial restricted browser launch and server access failed; tests succeeded with isolated profiles and accessible local server. The first preset test exposed binary Content-Type incorrectly including charset; server now uses exact image/jpeg and the test asserts it. No external publication or personal-data mutation.

## Review Triage Log

- Medium, patched: same-image targets and generic JPEG assertion could miss wrong assignment. Added a distinct uploaded surrounding fixture, exact grid comparison and unchanged surrounding-value assertion.
- Medium, patched: failure test started empty and could miss image loss. It now starts with a saved grid photo and asserts unchanged rendering and storage after HTTP 503.

Independent blind review returned these two substantiated verification gaps and no confirmed application defect. No other review layers were configured. Implementation complete; final visual acceptance is explicitly left to the user.
