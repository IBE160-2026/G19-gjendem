# Epic 2 — local acceptance, 23 November 2026

Scope: Stories 2.1–2.3 / PRD FR-8, with FR-4 persistence and FR-12/14/17 interactions. The previously delivered category features were tested in isolated Microsoft Edge browser contexts using fictional tasks. No personal browser data, live site or cloud storage was modified.

| Rule / expected outcome | Current evidence | Result |
|---|---|---|
| 2.1: filter month/day, upcoming, undated and completed views; clear restores all; reload resets filter | categories-check.mjs; category-acceptance-check.mjs | Passed |
| 2.1: filter does not modify records; hidden categories still contribute conflicts; empty-category feedback | categories-check.mjs | Passed |
| 2.1: past review deliberately shows every qualifying category | category-acceptance-check.mjs | Passed |
| 2.1: cleanup archives completed tasks in selected and hidden categories, preserves unfinished tasks and all records | category-acceptance-check.mjs | Passed |
| 2.2: create category, choose colour, use in task, persist/reload; preserve old tasks and task draft | categories-check.mjs | Passed |
| 2.2: name validation, failed writes, duplicate and unique simultaneous saves | model.test.mjs; categories-check.mjs | Passed |
| 2.3: preview/cancel, preset/custom colour, default rename, archived/completed display, unchanged task records | category-edit-check.mjs; model.test.mjs | Passed |
| 2.3: custom-category rename/recolour reaches month, timetable/untimed day, sidebar, undated, completed and past review | category-acceptance-check.mjs | Passed |
| 2.3: custom name resembling markup remains text; stable ID/filter; reload retains name/colour and task details | category-acceptance-check.mjs | Passed |
| 2.3: duplicate/write/stale errors preserve drafts; task draft survives category edits; newly created management rows appear | category-edit-check.mjs | Passed |

Commands: with the local server running and PLAYWRIGHT_MODULE configured as in README, run `node app/categories-check.mjs`, `node app/category-edit-check.mjs`, and `node app/category-acceptance-check.mjs`. All passed. The four unit-test suites in README also passed, 26 tests total. The current category management screenshot was inspected for desktop layout and named colour controls.

The new integration test initially selected every metadata line in a completed card rather than its category line. Its selector was corrected; this was a test issue, not an application defect. No application behaviour change was needed for these checks.

Independent review identified two evidence gaps. The final fixtures include completed and undated tasks from another category, proving both exclusion and restoration. Stale-edit checks now explicitly assert retained name/colour and unchanged saved state. Both strengthened suites passed after these additions; no findings remain deferred.

Decision: Epic 2 locally accepted. Full calendar ten-task acceptance, two external user trials, production checks and mobile adaptation remain separate work. Category deletion and multiple-category selection were not added.
