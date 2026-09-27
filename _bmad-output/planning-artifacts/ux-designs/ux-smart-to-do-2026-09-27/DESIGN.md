---
name: Smart To-Do
description: A calm personal calendar with colour-coded tasks and expandable days.
status: draft
created: 2026-09-27
updated: 2026-09-27
sources:
  - ../../prds/prd-smart-to-do-2026-09-27/prd.md
  - ../../../../product-brief.md
  - .memlog.md
  - mockups/smart-todo-skisse.html
colors:
  canvas: '#F5F6F8'
  surface: '#FFFFFF'
  text: '#25313D'
  muted: '#5C6875'
  border: '#DCE1E6'
  today: '#386DB1'
  primary: '#2D4F74'
  primary-text: '#FFFFFF'
  conflict: '#AC1825'
  jobb: '#E0EDFF'
  jobb-stripe: '#4A7FC5'
  skole: '#FFF1B3'
  skole-stripe: '#B99A26'
  familie: '#DCEFDC'
  familie-stripe: '#538759'
  ellers: '#EAD8C4'
  ellers-stripe: '#A27C55'
typography:
  title:
    fontFamily: system-ui, sans-serif
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.45'
  heading:
    fontFamily: system-ui, sans-serif
    fontSize: 15px
    fontWeight: '600'
    lineHeight: '1.45'
  body:
    fontFamily: system-ui, sans-serif
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.45'
  meta:
    fontFamily: system-ui, sans-serif
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.45'
rounded:
  sm: 5px
  md: 7px
  lg: 9px
  xl: 14px
spacing:
  small: 8px
  field-gap: 10px
  card: 16px
  section: 20px
  header: 24px
  sidebar: 220px
  untimed: 190px
components:
  task:
    foreground: '{colors.text}'
    radius: '{rounded.sm}'
    conflict-foreground: '{colors.conflict}'
  calendar:
    background: '{colors.surface}'
    border: '{colors.border}'
    radius: '{rounded.lg}'
  editor:
    background: '{colors.canvas}'
    padding: '{spacing.card}'
  primary-button:
    background: '{colors.primary}'
    foreground: '{colors.primary-text}'
    radius: '{rounded.md}'
---

## Brand & Style

A practical calendar that makes today's tasks easy to find across Jobb, Skole, Familie and Ellers. Matthew approved the first interactive sketch as the design direction. This is a ready-for-review draft, not completed UX validation. The two spines take precedence over prototype behavior where they conflict; confirmed decisions take precedence over explicitly proposed defaults.

The [approved sketch](mockups/smart-todo-skisse.html) illustrates the month, left overview, expanded day, inline editor and untimed panel. It uses fictional data and has no permanent storage. It is not a working-app acceptance test.

## Colors

| Meaning | Surface / identifying stripe | Usage |
|---|---|---|
| Jobb | `{colors.jobb}` / `{colors.jobb-stripe}` | Blue task card and category marker |
| Skole | `{colors.skole}` / `{colors.skole-stripe}` | Yellow task card and category marker |
| Familie | `{colors.familie}` / `{colors.familie-stripe}` | Green task card and category marker |
| Ellers | `{colors.ellers}` / `{colors.ellers-stripe}` | Light brown; default category |
| Today | `{colors.today}` | Distinct day outline and visible today indication |
| Conflict | `{colors.conflict}` | Overlapping task titles; retain category fill |

The four colour families are confirmed. Exact light-theme shades are extracted from the approved sketch as implementation starting values. Category names accompany colour. Completion uses a checked checkbox and strikethrough, not a new category colour. Proposed conflict label: “Overlapper”.

Target at least 4.5:1 for normal text on all category backgrounds, including red conflict text, and 3:1 for essential control/focus boundaries. Verify rendered combinations before implementation acceptance; faint grid separators are not the only indication of a control. Do not reduce completed text opacity until unreadable. The sketch's automatic dark theme is a prototype option, not a separate approved theme contract.

## Typography

Use local system fonts. `{typography.title}` names the app; `{typography.heading}` identifies the month, selected day and sidebar sections. Task titles use `{typography.body}`; dates, category names and time ranges use `{typography.meta}`. Compact month cells may shorten a title visually, but must expose its full text when opened. The prototype's 11px task text is not a mandatory production size.

## Layout & Spacing

Desktop layout: a `{spacing.sidebar}` left sidebar beside a flexible seven-column month calendar. Each sidebar section shows two task rows, followed by “Vis mer” only when more exist. The selected day expands inline; its timetable sits beside a `{spacing.untimed}` right panel containing that day's untimed tasks. The editor is inside this expanded area, never a separate task-entry modal.

The sketch expands the selected day across the calendar width after its week row. This is the approved visual starting point, not a requirement that a single narrow cell hold the whole form. Use `{spacing.section}` between major areas and `{spacing.field-gap}` between fields. Keep the left sidebar visible during day expansion on the supported desktop width.

## Elevation & Depth

Use white surfaces, light grey canvas and thin dividers. Today receives an inset outline; the selected day receives a top accent. Avoid shadows that make the inline editor resemble a floating dialog.

## Shapes

Task cards use `{rounded.sm}`; buttons and inputs use `{rounded.md}`; calendar boundary uses `{rounded.lg}`. The application shell uses `{rounded.xl}`. Category markers are small rounded squares rather than decorative imagery.

## Components

| Component | Visual contract |
|---|---|
| Calendar toolbar | Month heading, previous/next buttons and “I dag”; category names and colour markers nearby. |
| Calendar day | Date and small plus at top; today outline remains distinguishable from selection; task overflow has a visible count/link. |
| Period section | “I dag”, “Denne uken” or “Kommende”, two task rows, inline expansion action below. |
| Task row | Category fill/stripe, independent checkbox, title, time and category text. Checked titles remain struck through. Conflicting titles turn red without removing category colour. |
| Expanded day | Full-width inline day heading and close control; timetable and right untimed panel beneath editor. |
| Timetable | Chronological labelled time rows with add affordance; task title and complete start–end range remain readable. |
| Untimed panel | “Uten klokkeslett” heading with task rows for selected date only. |
| Task editor | Persistent labels; title and description span width; date/category and start/end fields pair; Save, Cancel and edit-only Delete actions. |
| Feedback | Short text near affected control; error uses `{colors.conflict}` plus explicit message; success remains readable outside a collapsed editor. |
| Auxiliary task view | Reuse task rows for undated and past unfinished tasks; exact placement is unresolved and not illustrated. Completion is shown in place; no separate completed inventory is required. |
| Category control | Named category selector; Ellers selected by default. Filter/custom-category entry surfaces remain unmocked. |
| Delete confirmation | Explicit task name and cancel/delete choices; styling and inline placement remain proposed. |
| AI suggestion | Stage 2 only: labelled suggestion and explicit accept/reject/change actions; no approved visual yet. |

## Do's and Don'ts

- Keep the four named category colours consistent in calendar, timetable and sidebars.
- Keep task purpose in its title/description; do not introduce work-versus-deadline types.
- Preserve visible completion and conflict states together where applicable.
- Do not treat the prototype's fixed date, sample tasks, hours or responsive behavior as production requirements.
- Do not hide undated or earlier tasks merely because they are outside the pictured month.
