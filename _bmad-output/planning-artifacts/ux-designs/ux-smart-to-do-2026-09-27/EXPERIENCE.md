---
title: "Smart To-Do Experience"
status: draft
created: 2026-09-27
updated: 2026-09-27
sources:
  - ../../prds/prd-smart-to-do-2026-09-27/prd.md
  - ../../../../product-brief.md
  - .memlog.md
  - mockups/smart-todo-skisse.html
---

# Smart To-Do — Experience

## Foundation

A local desktop browser app in Norwegian Bokmål, without login or cloud synchronisation. [DESIGN.md](DESIGN.md) owns its visual identity. No component library is required by UX. Stored tasks belong to the same browser environment; clearing browser data can remove them. Architecture chooses the storage implementation. Draft ready for review: sketch approval does not complete the optional reviewer gate or confirm unmocked surfaces.

A task has one optional date, optional paired start/end times, a title, description, one category and completion status. The user describes the purpose; there are no separate work and deadline dates/types. Jobb, Skole, Familie and Ellers are the four named categories; Ellers replaces “Uten kategori”. These latest decisions supersede earlier brief/PRD terminology and completed-task removal behavior; the parent planning update reconciles the PRD.

## Information Architecture

| Surface | Entry and purpose | Visual coverage |
|---|---|---|
| Month overview | App opens on current month; find today, browse dates and categories. | [Approved sketch](mockups/smart-todo-skisse.html) |
| Left task overview | Beside month; I dag, Denne uken, Kommende. | Approved sketch |
| Expanded day | Click date; show timed tasks plus selected-day untimed tasks on right. | Approved sketch |
| Inline editor | Day plus, time click or existing task click. | Approved sketch; deletion/storage errors not mocked |
| Undated task access | Required to find/create/edit tasks with no date; entry placement unresolved. | Spine-only, needs coverage choice |
| Earlier unfinished task access | Required independently of displayed month; use neutral dates, not assumed missed deadlines. | Spine-only, needs coverage choice |
| Completed inventory | Previously approved separate view; inline visibility now mandatory; whether to retain an additional inventory needs reconciliation. | Spine-only |
| Category filter/customisation | Filtering inherited from PRD; creation of additional categories needs reconciliation with four-category design. | Spine-only |
| AI category suggestion | Stage 2 only; explicit user-requested suggestion. | Deferred, not mocked |

## Voice and Tone

Use concise, neutral Bokmål. Labels: “Ny oppgave”, “Tittel”, “Beskrivelse”, “Dato”, “Kategori”, “Start (valgfritt)”, “Slutt (valgfritt)”, “Lagre oppgave”, “Avbryt”. Never label the single date “Arbeidsdato” or “Innleveringsfrist”.

Feedback proposals: “Oppgaven er lagret.”, “Ingen oppgaver.”, “Skriv en tittel.” and “Kunne ikke lagre. Opplysningene dine er beholdt.” Use “Overlapper” alongside red text. Do not claim cloud backup or synchronisation.

## Component Patterns

| Component | Behavioral contract |
|---|---|
| Calendar toolbar | Browse months and return to real current date; sidebar periods remain relative to today, not displayed month. |
| Calendar day | Date opens enlarged day; plus opens editor with selected date, no assumed time. Overflow opens that day. |
| Period section | I dag = today; Denne uken = after today through current week end; Kommende = next week onward. Two tasks initially; “Vis mer” expands only that section inline. “Vis mindre” is the sketch's proposed reversal. |
| Task row | Checkbox toggles completion without opening editor; title opens prefilled editor. Preserve completed tasks with check and strikethrough in timetable and both sidepanels. |
| Expanded day | Selected date's timetable and untimed panel; successful editor save collapses day. Failed save preserves form and expansion. |
| Timetable | Sort by start time; click time to prefill date and start, user supplies end. No automatic duration or rescheduling. |
| Untimed panel | Only selected-date tasks with neither time; dated timed tasks belong in timetable. Undated tasks are not placed here. |
| Task editor | Create/edit share fields; title required, date optional. Default Ellers. Save validates and persists before reporting success. Changing date relocates same task, not a copy. |
| Feedback | Saving, invalid input and storage failure are distinguishable; retain draft on failure. Announce completion and successful save without moving task focus unnecessarily. |
| Auxiliary task view | Must support editing undated and earlier tasks without inventing a date. Placement/editor host unresolved; do not pretend the date-only prototype covers this. |
| Category control | Single category choice. Filtering must be clearable; custom category creation and its colour assignment remain open. |
| Delete confirmation | Existing requirement: confirm before deletion, cancel leaves data unchanged. Placement unmocked. |
| AI suggestion | Stage 2: explain sent text, request suggestion, accept/reject/change explicitly. Failure leaves ordinary task operations available. |

## State Patterns

| State / applicable surfaces | Response |
|---|---|
| Initial load — all task views | Read stored data before showing success/empty state. A read failure must not overwrite existing data with an empty collection. |
| Empty — month, period, timetable, untimed and auxiliary lists | Show clear empty text and reachable add action; keep month navigation. |
| Expanded/collapsed — day and periods | Maintain selected date and an accessible expanded state. Collapsing a period affects display only. |
| Editing/invalid — inline editor | Keep values; identify blank title and invalid time fields in text; focus first error on submit. |
| Saving/error — mutations | Avoid duplicate submissions. Do not collapse or claim success after failure; failed checkbox/delete updates must not masquerade as persisted changes. |
| Complete/reopened — task views | Checked and struck through; unchecking restores ordinary text. Completion does not remove timetable/sidebar rows. |
| Conflicting — timed tasks | Both titles use `{colors.conflict}` while category fill stays. Proposed “Overlapper” text gives non-colour information. User resolves manually. |
| Keyboard focus — every interactive surface | Visible `{colors.today}` focus indicator and logical focus order; never hide focused task when collapsing. |
| Offline — Stage 1 | No external request is required for ordinary task operations. Local server/app availability and storage limits are explained during setup. |
| Filtered/no matches — category view | Keep visible active filter and clear action; distinguish no matching tasks from empty storage. |
| Confirming delete — editor | Explain targeted task; preserve it on cancel. |
| AI pending/failed — Stage 2 | Indicate request status; allow normal task management; do not silently apply unknown categories. |

## Interaction Primitives

Click or keyboard-activate visible controls; plus and time buttons have descriptive accessible names. Checkbox clicks do not bubble into task editing. Form values are not saved just by opening/closing a day. Dragging and automatic conflict resolution are not required.

Proposed implementation defaults, not separately confirmed: Monday–Sunday week; sort sidebar by date then time with untimed last; adjacent end/start times do not conflict; same-day intervals overlap when each starts before the other ends; require both times or neither and end later than start; time requires a date; no overnight intervals initially. The prototype ignores completed tasks when detecting conflicts. This last rule and completed items in month cells still need confirmation.

## Accessibility Floor

Use semantic buttons, checkboxes, labels and headings; expose selected date, today, completion and expanded state to assistive technology. Keyboard users must be able to add, edit, complete, expand and delete. Focus enters the title when editor opens and returns to the date/add control after save; error feedback is announced. Do not copy the prototype's full-DOM rerender focus loss into the app.

Names accompany category colours; conflict and completion also have text/control cues. Use the contrast targets in DESIGN.md. Support browser zoom without losing access to any tasks or controls. No essential actions rely solely on hover or colour. Time entries support minutes even if timetable labels use hours.

## Responsive & Platform

Desktop browser is the agreed target. Preserve left overview, main calendar and selected-day untimed panel on its right at the supported desktop width. The sketch stacks panels and hides month task cards at narrow widths; those are prototype fallbacks, not approved mobile requirements. Do not hide task access during zoom: a date must still open its full task list. Supported minimum width and handling of a crowded day need implementation verification.

## Key Flows

### Morning overview — Matthew

1. Matthew opens the local app and finds the marked current date.
2. He reads I dag, then remaining-this-week and upcoming sections.
3. He expands “Vis mer” in I dag to see all today's tasks.
4. **Climax:** His family, school and work tasks are visible together without checking separate notes.

Empty day: show a calm empty state, retain all navigation. Storage read failure: explain failure rather than show a false empty calendar.

### Add or revise a timed task — Matthew

1. Matthew clicks a day's plus, or opens a day and clicks a time.
2. The inline editor has that date and, for a time click, that start time.
3. He supplies title, optional description, category and desired end time; saves.
4. **Climax:** The day collapses and the saved task appears on its date and appropriate sidebar period.
5. To revise it, he clicks the task, changes its values and saves the same record.

Validation or storage failure keeps the editor and entered text intact. Reopening the browser in the same environment must retain saved data (FR-1, FR-2, FR-4–6).

### Untimed task and conflict resolution — Matthew

1. Matthew opens the selected day; tasks without time are on its right.
2. He opens one, adds start and end and saves; it moves into the timetable.
3. Two overlapping tasks now have red titles and the proposed “Overlapper” cue.
4. He edits one interval manually.
5. **Climax:** The overlap indication disappears once the intervals no longer conflict; categories remain recognisable.

An invalid interval retains the draft. No automatic move occurs. Timetable range must not make a valid early/late task unreachable.

### Complete, reopen or delete — Matthew

1. Matthew checks a task in the timetable or a sidebar.
2. **Climax:** It remains in place with a check and strikethrough, so he sees progress without losing the day's overview.
3. Unchecking restores unfinished status; deletion instead requires opening the editor and confirming.

Cancel deletion preserves the task; a storage failure is reported and must not appear successful (FR-2–4).

### Unmocked follow-on flows — Matthew

1. Matthew needs an undated task or an unfinished task from an earlier date (FR-7); an explicit entry must lead to a list and editor without inventing a date.
2. He filters by category and clears the filter (FR-8).
3. In Stage 2 he requests, checks and accepts or rejects an AI category suggestion (FR-9–10).
4. **Climax:** Tasks remain findable and under his control regardless of date, category or AI availability.

These are required flow coverage notes, not approved surface designs. Confirm their entry points and whether a visual reference is needed before implementing them. AI failure must not block local editing.

## Open Items Before Final UX Handoff

- Confirm coverage for undated and earlier unfinished tasks; editor host when no date is selected.
- Design the inherited custom-category and filtering controls, retained in revised FR-8. Revised FR-3 replaces the separate completed inventory with completion in place; no separate completed screen is required.
- Confirm proposed week boundary, overlap boundaries/completed-task participation, untimed ordering and month-cell completion visibility.
- Replace sample timetable hours with an accessible full-day strategy; clarify initial handling of overnight intervals and times without dates.
- Confirm unsaved-edit behavior when navigating away; prototype currently discards drafts and must not be copied silently.
- Offer optional reviewer lenses and explicit spine-only versus additional-mock choice. No final approval or reviewer validation is claimed here.
