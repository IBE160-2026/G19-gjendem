# Smart To-Do — first working slice

Requires Node.js (verified locally with 24.19.0). No package installation is needed.

From the repository folder in the VS Code terminal:

```powershell
node app/server.mjs
```

Open http://localhost:5173 in Edge or Chrome. Keep the terminal running; Ctrl+C stops the server. If the port is occupied, stop the previous instance rather than selecting a different port. Use the same address and browser profile each time: localhost and 127.0.0.1 have separate storage.

The app supports month navigation, today marking, inline task creation/editing, four categories, completion/reopening, confirmed deletion and persistence. All tasks currently require a date. Scheduling, undated tasks, custom categories, sidebars and AI are later increments of the PRD. No sample tasks are inserted into user storage.

Click a task title to edit its title, date or category. Use its checkbox to complete/reopen without opening the editor; completed titles stay visible with strikethrough. Delete is available inside the editor and requires confirmation. Legacy records without a completed field are treated as unfinished without an automatic migration. Stale edits/deletes are rejected if another tab changed the record; cancel and reopen to use the latest version.

Tasks are stored locally in the browser, not in Git or on a server. Clearing site data removes them; private browsing does not provide durable storage. Corrupt/unsupported data is left untouched and an error is shown. Normal writes are coordinated across tabs using Web Locks in supported browsers.

Run automated model checks:

```powershell
node --test app/model.test.mjs
```

Manual acceptance: add a task using a day's plus, confirm Ellers is the default, select another category and date, save, reload and verify it remains. Check previous/next month and I dag. Enter a blank title; it must not save. Cancel an edited form and verify the discard confirmation. The first working slice uses a small allowlisted Node HTTP server instead of the proposed Vite toolchain; the app itself is standard browser HTML/CSS/JavaScript.
