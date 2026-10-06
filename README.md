# G19 — Smart To-Do

Solo project in **IBE160 Programming with AI**, Molde University College, autumn 2026 (15 credits). Student: **Matthew Ryan Gjendem**. Group: **G19 — Ctrl+AI**.

Smart To-Do brings personal tasks for work, school, family and other responsibilities into one calendar. It runs locally in a PC browser with Norwegian Bokmål controls. Development follows the BMAD method with AI assistance.

## Start the app

1. Install Node.js if it is not available. The app has been verified with Node.js 24.19.0. Check with `node --version`.
2. Download or clone this repository, then open its root folder in VS Code.
3. In the terminal, run:

   ```powershell
   node app/server.mjs
   ```

4. Open [the calendar](http://localhost:5173/) in Edge or Chrome. Keep the terminal running. Press Ctrl+C in the terminal to stop the app.

No package installation, account or API key is needed to run the current app. If port 5173 is already occupied, check whether the calendar is already running. Stop that earlier instance before restarting; keep the same address to retain access to your browser's saved tasks.

## Available now

- Month calendar with today marked, an expanded daily timetable and a separate list for that day's tasks without times.
- Create, edit, complete, reopen and delete tasks, with optional descriptions and dates.
- Jobb (blue), Skole (yellow), Familie (green) and Ellers (light brown), with Ellers as the default.
- Optional start/end times on the same date. Time choices use five-minute steps; the timetable opens at noon. Overlapping unfinished tasks show red text and an overlap label. Tasks that end exactly when another starts do not conflict.
- Left sidebar for today, the rest of the week and next week onwards, with two tasks per section and inline expansion.
- **Uten dato** for tasks to schedule later, **Rydd side** to hide completed tasks without deleting them, and **Fullført** to view or reopen completed tasks.
- Local saving, failed-save feedback and protection against stale edits from another browser tab.

## Planned work

Stage 1 still needs a separate overview of past unfinished tasks, category filtering and additional categories. Past dated tasks can currently be found by navigating to their calendar month.

Stage 2 will add AI category suggestions that the user accepts, rejects or changes. **AI is not implemented yet.** Before that stage, we will create epics and stories, select a service, document costs and what data is sent, and keep the API key on the server in an uncommitted `.env` file. No provider or model has been selected. The current app does not read `.env` or call an AI service.

A clearly labelled test mode with fixed suggestions is planned so an assessor can test the workflow without our key or a paid account. We will prepare 20 fictional tasks and written category criteria; fixed test responses do not demonstrate live AI accuracy. The live target remains at least 16 acceptable suggestions out of 20, with failure handling tested separately. Free-text interpretation is a possible later extension, not an approved implementation commitment.

## Run tests

From the repository root, run the model tests; these need only Node.js:

```powershell
node --test app/model.test.mjs
```

They cover date and time validation, overlap rules, weekly grouping, persistence, stale changes, descriptions, undated tasks and recoverable cleanup.

Browser tests additionally require Playwright and Microsoft Edge. Install Playwright in a separate test-tools folder if necessary (`npm install playwright` there), then set `PLAYWRIGHT_MODULE` to that installation's absolute `node_modules/playwright` directory. This is only needed for automated browser tests, not for running the app.

Keep the app server running in one terminal. In a second PowerShell terminal at the repository root:

```powershell
# Replace the example with your actual Playwright installation path.
$env:PLAYWRIGHT_MODULE = 'C:/path/to/test-tools/node_modules/playwright'
node app/browser-check.mjs
node app/timetable-check.mjs
node app/sidebar-check.mjs
node app/time-picker-check.mjs
node app/description-check.mjs
node app/completed-check.mjs
node app/undated-check.mjs
```

These suites cover task editing, completion and deletion; timetables and conflicts; week boundaries and sidebar expansion; time selection; descriptions; cleanup/restoration; and undated task scheduling. They use isolated browser contexts, not the user's saved tasks. Generated screenshots are local test artifacts.

For a quick manual check: create one dated task and one undated task, refresh and confirm both remain, schedule the undated task, complete it, use Rydd side and reopen it through Fullført. The ten-task acceptance set, two external user trials and 20-task AI evaluation remain targets; automated checks do not replace these evaluations.

## Storage and limitations

Source code and documentation are versioned on GitHub. **The tasks you enter are stored only in this browser**, using localStorage. They are not uploaded to GitHub, stored in a cloud database or synchronised across devices. Use the same browser profile and address: `localhost` and `127.0.0.1` have separate storage. Clearing browser/site data removes tasks; private browsing is not durable storage.

The current app has no login, sharing, external calendar integration, automatic reminders or recurring tasks. Time intervals require a date and must start and end on that same day; overnight tasks are not supported. The desktop calendar may require horizontal scrolling on narrow screens. AI credentials must never be added to public code or browser JavaScript when Stage 2 is built.

## Project documentation

- [Product brief](product-brief.md) — purpose, scope, measurable targets and the 6 October feedback response.
- [PRD](./_bmad-output/planning-artifacts/prds/prd-smart-to-do-2026-09-27/prd.md) — functional requirements. Some earlier completion/time-rule wording still needs updating to match subsequent approved changes.
- [UX design](./_bmad-output/planning-artifacts/ux-designs/ux-smart-to-do-2026-09-27/DESIGN.md) and [interaction design](./_bmad-output/planning-artifacts/ux-designs/ux-smart-to-do-2026-09-27/EXPERIENCE.md).
- [Technical plan](./_bmad-output/planning-artifacts/technical-plan-smart-to-do.md).
- [Implementation records](./_bmad-output/implementation-artifacts/) — individual changes, decisions, verification and review notes.
- [Detailed app guide](app/README.md).

The current implementation uses plain HTML, CSS and JavaScript with a small Node.js server. Historical planning documents describe the plan at the time; implementation records and commits show later decisions. Epics/stories for remaining work and an explicit mapping from tests to PRD requirements are still to be prepared.
