# Smart To-Do — first working slice

Requires Node.js (verified locally with 24.19.0). No package installation is needed.

From the repository folder in the VS Code terminal:

```powershell
node app/server.mjs
```

Open http://localhost:5173 in Edge or Chrome. Keep the terminal running; Ctrl+C stops the server. If the port is occupied, stop the previous instance rather than selecting a different port. Use the same address and browser profile each time: localhost and 127.0.0.1 have separate storage.

The app supports month navigation, today marking, inline task creation/editing, four categories, completion/reopening, confirmed deletion and persistence. Click a date to expand its timetable and right-hand untimed list. Optional start/end times must both be supplied or both empty, with end later than start on the same day. Hour buttons prefill the start only. The scrollable timetable includes all 24 hours and opens at noon. Saving collapses the expanded day.

The time chooser previews 12:00 for an empty field, with hour and five-minute selects (00,05,...55). Apply commits the choice; opening/closing does not assign a time. Users can also type HH:mm in five-minute steps. Existing off-step saved times are preserved when unchanged; editing their titles/categories does not round them. Clear both fields to remove times. Test with `node app/time-picker-check.mjs` using the same optional Playwright setup below.

Overlapping unfinished tasks on the same date have red titles and an "Overlapper" cue. Touching intervals do not conflict. Completed tasks remain visible but stop contributing conflicts. Clearing both times moves a task into the selected day's untimed list. Existing tasks without time fields remain valid without migration. All tasks still require a date. Undated tasks, custom categories and AI are later increments. No sample tasks are inserted into user storage.

The left sidebar groups tasks into today, the remaining days of the current Monday–Sunday week, and next week onwards. Each section shows two tasks, with inline Vis mer/Vis mindre expansion. Dates are relative to real local today, even while browsing other months. Tasks can be edited or completed directly from these lists; future-task editing opens the correct month. Completed items remain visible. Sidebar expansion is temporary UI state and is reset on page reload.

Click a task title to edit its title, date or category. Use its checkbox to complete/reopen without opening the editor; completed titles stay visible with strikethrough. Delete is available inside the editor and requires confirmation. Legacy records without a completed field are treated as unfinished without an automatic migration. Stale edits/deletes are rejected if another tab changed the record; cancel and reopen to use the latest version.

Tasks are stored locally in the browser, not in Git or on a server. Clearing site data removes them; private browsing does not provide durable storage. Corrupt/unsupported data is left untouched and an error is shown. Normal writes are coordinated across tabs using Web Locks in supported browsers.

Run automated model checks:

```powershell
node --test app/model.test.mjs
```

Optional browser suites (with the local server running and Playwright installed or PLAYWRIGHT_MODULE set to its module path): `node app/browser-check.mjs`, `node app/timetable-check.mjs` and `node app/sidebar-check.mjs`. They use isolated browser contexts, not the user's calendar data.

Manual acceptance: add a task using a day's plus, confirm Ellers is the default, select another category and date, save, reload and verify it remains. Check previous/next month and I dag. Enter a blank title; it must not save. Cancel an edited form and verify the discard confirmation. The first working slice uses a small allowlisted Node HTTP server instead of the proposed Vite toolchain; the app itself is standard browser HTML/CSS/JavaScript.
