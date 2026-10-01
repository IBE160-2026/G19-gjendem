---
title: Optional task descriptions
type: feature
created: 2026-10-01
status: done
route: oneshot
---

<frozen-after-approval>
## Intent

Continue the agreed task requirements with an optional description in the existing inline create/edit form. The user previously requested explaining a task's purpose in its description rather than introducing task types. Preserve line breaks, allow editing and clearing, and keep calendar/sidebar cards compact with titles only. Existing records without description remain usable. Save only through the existing task-save action; failed writes retain the draft.
</frozen-after-approval>

## Implementation Notes

- Reuse existing form, storage and optimistic-write checks; optional string field with no data migration. Render description as textarea.value, never HTML.
- Include textarea in saving lock controls. Verify persistence, clearing, legacy compatibility, multiline text, failed writes and draft retention through completion.

## Review and verification

- No implementation defects found in independent review. Two low verification gaps addressed: browser loads and saves a legacy record without description while preserving other fields; text-safety payload includes closing textarea and event-handler markup as well as script text.
- Description browser checks passed for multiline save/reload, text-only rendering, edit/clear, completion draft retention, failed writes and legacy records. Twelve model tests passed. README updated. Tests use isolated data; no GitHub push requested.
