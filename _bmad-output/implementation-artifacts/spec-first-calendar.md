---
title: First working task calendar
type: feature
created: 2026-09-27
status: done
route: oneshot
---

<frozen-after-approval>
## Intent

Build the authorized first slice: a local Norwegian browser calendar with today marked, month navigation, a plus button per day, task title/date/category entry and persistent browser storage. Use the approved four category colours, default Ellers, and inline creation. Successful saving collapses the editor; failed saving retains input. This slice does not implement time scheduling, AI, editing, completion or the upcoming sidebar. Preserve existing planning files and unrelated working-tree changes.
</frozen-after-approval>

## Implementation Notes

- Prior changes are the authorized planning work and installed BMAD files; continue additively without touching or staging unrelated files.
- Small independent first slice, no unresolved user-facing choice or irreversible operation. Use plain browser modules and a dependency-free Node local server because Node is available but npm is not on PATH. Vite was a proposal, not a binding requirement; no application dependencies are needed yet.
- Files: app/index.html, app/styles.css, app/main.js, app/model.js, app/server.mjs, app/model.test.mjs, app/README.md. Test dates, storage failures, browser creation/reload, category defaults and month navigation. Stable origin http://localhost:5173, loopback only.

- Added package.json for explicit ES modules and optional browser-check.mjs using externally installed Playwright. No dependencies installed. Norwegian UI overrides workflow's English file-output default; documentation remains English.
- Model tests passed (4). Browser checks in isolated Edge profile cover creation, persistence, navigation, category default, failed save and corrupt storage; screenshot inspected. No production user data added. No application error observed.

## Review Triage Log

- Medium, patched: pending lock permitted navigation to a newer editor; saving flag now blocks navigation and disables form fields until write completes. Browser regression check added.
- Low, deferred: mobile editor inherits calendar width. Desktop PC is the current target; retain horizontal scrolling, revisit a mobile layout in a separate increment.
- Medium, patched: today marker became stale overnight; refresh marker every 30 seconds and on visibility without replacing the editor.
- Low, patched: cancel focused first day in week; now targets the original date's plus. Browser check added.
- Medium, patched: cross-tab changes could remain hidden after cancel/navigation; reload current stored data on both paths. Browser check added.

## Verification

- `node --test app/model.test.mjs`
- `node app/browser-check.mjs` with PLAYWRIGHT_MODULE pointing to installed Playwright; Edge headless and isolated storage.
- Visual check of app/test-results/calendar.png (ignored test artifact).
