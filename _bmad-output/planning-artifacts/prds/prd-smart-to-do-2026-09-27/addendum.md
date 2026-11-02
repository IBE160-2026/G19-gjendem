# Smart To-Do PRD — technical context

Updated: 2 November 2026.

The existing app uses plain HTML, CSS and JavaScript with a small local Node.js server. Task records are stored in browser localStorage. No login, cloud database or account synchronisation is used. The code and documents are versioned on GitHub; user-entered tasks are not uploaded there.

Tasks persist only for the same browser profile and origin. localhost and 127.0.0.1 have separate storage. Clearing browser/site data removes the tasks. Supported-browser Web Locks coordinate writes, and stale record checks reject conflicting edits. These mechanisms support FR-4; they are not a cloud backup.

The same frontend is now published at https://g19-gjendem.vercel.app/. Vercel serves static files with Root Directory `app`, preset `Other`, empty Build and Install commands and Output Directory `.`. The local Node server remains a development/startup option; it is not required by visitors to the published site. HTTPS-site storage is separate from localhost and from other browser profiles. Category data and appearance preferences also remain local; uploaded background images are processed in the browser rather than sent to a shared database. Deployment does not supply backup, data migration or device synchronisation.

See the [app guide](../../../../app/README.md) for current behaviour, [root README](../../../../README.md) for startup and tests, and [technical plan](../../technical-plan-smart-to-do.md) for the earlier architecture rationale. Later implementation records document deviations from that plan. AI service, server-side credential configuration and fixed-response test mode remain future decisions after calendar acceptance.
