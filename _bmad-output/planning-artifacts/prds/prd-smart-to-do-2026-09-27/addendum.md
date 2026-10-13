# Smart To-Do PRD — technical context

Updated: 13 October 2026.

The existing app uses plain HTML, CSS and JavaScript with a small local Node.js server. Task records are stored in browser localStorage. No login, cloud database or account synchronisation is used. The code and documents are versioned on GitHub; user-entered tasks are not uploaded there.

Tasks persist only for the same browser profile and origin. localhost and 127.0.0.1 have separate storage. Clearing browser/site data removes the tasks. Supported-browser Web Locks coordinate writes, and stale record checks reject conflicting edits. These mechanisms support FR-4; they are not a cloud backup.

See the [app guide](../../../../app/README.md) for current behaviour, [root README](../../../../README.md) for startup and tests, and [technical plan](../../technical-plan-smart-to-do.md) for the earlier architecture rationale. Later implementation records document deviations from that plan. AI service, server-side credential configuration and fixed-response test mode remain future decisions after calendar acceptance.
