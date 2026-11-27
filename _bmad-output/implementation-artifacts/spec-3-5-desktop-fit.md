---
title: Fit the desktop month into the first viewport
created: 2026-11-27
type: feature
status: done
route: oneshot
---

<frozen-after-approval>
## Intent

Implement the user-approved Story 3.5 PC-fit adjustment: compact title and past notice, shared month/category/navigation heading where space permits, compact month task previews with accessible day-opening overflow, and controls below a viewport-sized month. Preserve all days, desktop left sidebar, uploaded backgrounds, category and completion/conflict cues, existing review dialog and data. Expanded views/forms and small or zoomed windows may scroll. No new mobile layout or publication.
</frozen-after-approval>

## Implementation Notes

Small reversible extension of main.js, index.html and scoped desktop CSS. No intent gaps or irreversible operations. Existing untracked files are unrelated. Reuse taskCard, day-number click, drawDay and existing draft safeguards; preserve all tasks in DOM with desktop preview visibility, accessible overflow action, and keep narrow-screen rendering unchanged. Use viewport-aware CSS row sizing and actual measured surrounding space rather than deleting weeks. Test six-week and five-week months, pending notice, dense holiday tasks, expanded day/edit return, resized viewport and preserved storage. Desktop targets 1366x768 and 1920x1080 CSS pixels; small viewports retain natural scrolling.

## Verification

26 unit tests passed. Five browser suites passed: desktop-fit-check, appearance-acceptance-check, nature-appearance-check, past-unfinished-check and holidays-check. The desktop suite checks five/six-week months, 1366x768 and 1920x1080, notice/no-notice states, multiple tasks on a holiday, overflow/day access, dialog recurrence, resize with draft preservation and unchanged stored tasks. Added combined holiday-label bounds and narrow dark-calendar text assertions. Inspected screenshot of the six-week November view with eight past tasks and five current-day tasks: entire month, actions and footer fit 1366x768. Open work and small viewports remain scrollable. No personal data or live deployment changed. User visual acceptance remains pending.

## Review Triage Log

- Medium, patched: nowrap holiday labels retained display:table and could extend into the next date. Switched compact labels to constrained blocks; May 17 2027 collision bounds now verified.
- Medium, patched: new heading/action wrappers broke direct-child contrast selectors. Updated descendant selectors and verified white text on a black calendar in the narrow existing layout.

No other review layers were configured. Independent review findings resolved; no new deferrals. A duplicate toolbar introduced during movement was caught by the first desktop test and removed before the successful suites.
