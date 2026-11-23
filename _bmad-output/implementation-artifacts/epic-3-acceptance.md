# Epic 3 — local acceptance, 23 November 2026

Scope: Stories 3.1–3.4 and the approved continuous grid-photo extension, PRD FR-15. Tests use isolated Microsoft Edge contexts and generated canvas fixtures, not personal images or calendar data. No production deployment or broader calendar/user acceptance is claimed.

| Expected behaviour | Current evidence | Result |
|---|---|---|
| 3.1: surrounding colour/photo preview, cover crop, image conversion, invalid-image feedback | appearance-check.mjs | Passed |
| 3.1/3.2: independent surrounding/grid photos, one continuous grid layer, removal and Cancel | grid-image-check.mjs; appearance-acceptance-check.mjs | Passed |
| 3.1/3.2: unsupported MIME and files above 10 MiB rejected for either image; saved state and both valid previews retained | appearance-acceptance-check.mjs | Passed |
| 3.2: colour preview without saving, navigation and expanded day | appearance-check.mjs; grid-image-check.mjs | Passed |
| 3.2: readable dark-day and hovered date; date/today/holiday/task/conflict/category text over photos, completion strikethrough | appearance-acceptance-check.mjs; inspected screenshot | Passed |
| 3.3: Save/reload, Cancel, failed writes retain draft and saved state, stale saves preserve newer state | appearance-check.mjs; appearance.test.mjs | Passed |
| 3.3: late image completion does not undo Cancel/removal; independent upload errors; Save waits for images; concurrent task/appearance saves | grid-image-check.mjs; appearance-check.mjs | Passed |
| 3.4: reset preview is not saved; Cancel restores choices; saved reset clears both images and retains defaults after reload | appearance-check.mjs; appearance-acceptance-check.mjs | Passed |
| 3.4: tasks, custom/renamed categories and open task/category drafts survive reset/save | appearance-acceptance-check.mjs | Passed |
| Desktop access at 1366x768 and 1920x1080; enlarged-layout access at 683x384 CSS pixels / DPR 2 | appearance-acceptance-check.mjs; inspected enlarged-layout screenshot | Passed |

Run with the local server and PLAYWRIGHT_MODULE configured as in README: `node app/appearance-check.mjs`, `node app/grid-image-check.mjs`, `node app/appearance-acceptance-check.mjs`. All passed. The four unit-test files listed in README passed, 26 tests total, including 4,096 RGB samples for black/white text choice and storage compatibility checks.

The new rendered-contrast test initially misread opaque RGB black as transparent. Its test helper was corrected to inspect the alpha component only. No application defect was identified. The current combined screenshot was inspected with deliberately bright red/blue fixtures and a black calendar surface; white date/holiday/task backgrounds preserve legibility and the today outline remains visible.

Decision: Epic 3 locally accepted. This covers the documented desktop feature, not every possible user photograph or a complete accessibility audit. Epic 5 calendar-wide testing, external user trials and production checks remain pending. Mobile adaptation is separate.

Review follow-up: rendered reset/Cancel now explicitly proves both photos and saved colours return. Desktop width checks exercise save/cancel and expanded-day access. The DPR-2 viewport models the CSS layout space of 200% zoom on a 1366x768 display, but does not assert native browser-menu zoom; include that manual check in Epic 5. Two experimental temporary-profile zoom launches did not establish native zoom and are not counted as evidence.
