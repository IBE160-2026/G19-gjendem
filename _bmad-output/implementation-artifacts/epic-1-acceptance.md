# Epic 1 — local acceptance, 23 November 2026

Scope: Stories 1.1–1.4 / PRD FR-7 (past access), FR-17–18. Acceptance uses fictional data in isolated Microsoft Edge contexts against the local app. Existing inspected screenshots from the overview/action increments cover presentation. This is not a production deployment, calendar-wide ten-task evaluation or external user trial.

| Story / rule | Evidence | Result |
|---|---|---|
| 1.1: incomplete dates strictly before local today; zero count; exclude today/future/undated/completed | past-unfinished.test.mjs; past-unfinished-check.mjs | Passed |
| 1.1: unreadable storage reports errors without replacing data | past-unfinished-check.mjs | Passed |
| 1.2: all categories, oldest dates including other years; safe text; modal and focus | past-unfinished-check.mjs; screenshots from preceding increments | Passed |
| 1.2: cross closes without mutation; Escape/backdrop do not; revisit restores notice | past-unfinished-check.mjs; past-refresh-check.mjs | Passed |
| 1.3: complete retains record; edit within dialog; move within past or to today; clear date; refresh list and final closure | past-actions-check.mjs | Passed |
| 1.3: cancel/discard, failed completion/save, stale edits, retained drafts and focus | past-actions-check.mjs | Passed |
| 1.4: actual page close/new page in same storage context retains unresolved tasks | past-refresh-check.mjs | Passed |
| 1.4: timer across local midnight/year boundary updates count without opening dialog, changing storage, input or focus | past-refresh-check.mjs with Europe/Oslo clock | Passed |
| 1.4: previously hidden notice appears from zero to one; midnight/inactivity preserve an active modal draft and show the correct list after cancel | past-refresh-check.mjs, additional isolated context | Passed |
| 1.4: return after inactivity recalculates immediately using current date | past-refresh-check.mjs visibility event; past-unfinished-check.mjs | Passed |
| 1.4: other-tab change during modal editing; visible explanation, retained draft/focus, stale save rejected | past-refresh-check.mjs | Passed |
| 1.4: external completion decreases count, retains others, closes only at zero; all records retained | past-refresh-check.mjs | Passed |

Reproduction: start `node app/server.mjs`, configure PLAYWRIGHT_MODULE as described in README, then run `node app/past-unfinished-check.mjs`, `node app/past-actions-check.mjs` and `node app/past-refresh-check.mjs`. All passed. The four unit-test files listed in README passed (26 tests). Core calendar regression `node app/browser-check.mjs` passed.

The new refresh test initially failed waiting for a cross-tab message inside the modal: feedback was only behind the modal. The storage handler now also writes that message to the modal's status region; the same test passes after the correction. No storage migration was needed.

Decision: Epic 1 is complete and locally accepted. Broader Epic 5 user/assessor acceptance and published-site checks remain separate work.
