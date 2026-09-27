# PRD editorial prose review

Date: 2026-09-27

This document exists to help the student developer and course reviewer understand what Smart To-Do must do and how its behaviour will be checked.

Reader: humans. Style: Microsoft style with British English. Preserve the concise numbered requirements, staged delivery, requirement identifiers and agreed scope. The preceding structure pass found no actionable issues; retain the current structure.

Word metrics: the required script could not run because uv could not access its cache. No word-reduction target or reduction estimate is used for this prose-only pass.

| Pass | Original Text | Revised Text | Changes |
| --- | --- | --- | --- |
| prose | NFR-3: "API credentials must not appear in public code or browser-delivered secrets." | "API credentials must not appear in public code or be exposed to the browser." | Replaces the unclear phrase "browser-delivered secrets" with a direct statement of the existing credential restriction. Does not prescribe an implementation. |
| prose | §5: "Use ten tasks across the three default categories to verify creation, editing, deletion, completion, filtering and reopening." | "Use ten tasks across the three default categories to verify creation, editing, deletion, completion, filtering and data retention after reopening the app." | Distinguishes restarting the app to check persistence from reopening a completed task, which is checked in the next bullet. |

Two small clarity fixes recommended. No changes to requirements, structure, scope or technical decisions are proposed. No other comprehension issues found.
