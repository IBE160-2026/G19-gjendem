---
type: feature
created: 2026-10-18
status: done
route: oneshot
---

# Category filtering and custom categories

<frozen-after-approval>
## Intent

Deliver approved Epic 2 stories 2.1 and 2.2: filter the calendar by category and create named categories with colours. Preserve all existing tasks. The user explicitly authorised both improvements. Renaming/recolouring existing categories (2.3) remains a separate increment.

## Acceptance

- A labelled filter and Vis alle apply to month, expanded day, upcoming sidebar, undated and completed lists. Filtering changes no saved records. Reload starts with all categories visible.
- Unfinished time conflicts use every category, including hidden tasks. Cleanup continues to archive all completed tasks, explained next to its button.
- Create a trimmed name of 1–40 characters and a colour. Reject duplicate names (case-insensitive, Unicode-normalised) and invalid colours. Display names safely as text and use pale tinted cards for legibility.
- New categories appear in the filter, legend and task editor and survive reload. Ellers remains the default. Saving a task into another category adjusts an active filter to keep the saved task visible.
- Legacy tasks, task drafts and concurrent saved changes remain intact. Failed category writes retain the entered fields and show a useful error.
</frozen-after-approval>

## Implementation notes

Use optional customCategories in the existing version-1 envelope, without eagerly rewriting legacy storage. Names remain immutable references in this increment; story 2.3 must address stable identity/migration before rename support. Task mutations read and preserve the latest envelope. The existing Web Lock coordinates writes. Custom colours are accents with a light tint, not arbitrary text colours.

## Verification and review

Passed 16 model tests and all eight isolated Edge browser suites: categories, core lifecycle, timetable, sidebar, time picker, descriptions, completion/cleanup and undated tasks. Category coverage includes all display surfaces, hidden-category conflicts, duplicate validation, failed writes, exact colours, black/white tints, forty-character names at a 520px viewport, full editor drafts during creation, concurrent unique/duplicate category writes and unload warnings. Visually inspected the desktop screenshot. Existing core suite needed a more specific category selector now that a second select exists.

No user browser data was used. Local server and Edge checks required execution outside the restricted sandbox; no machine-wide permission changes were made. New categories persist; the display filter deliberately resets on reload. Existing category edits remain story 2.3.

## Review Triage Log

Independent context-free review returned five substantiated improvements (requested floor seven; reviewer declined to invent further findings). All addressed; no deferred findings.

- Medium, patched: maximum-length unbroken names could overflow the legend/filter. Added wrapping and flex minimum-width constraints; narrow viewport check passes.
- Low, patched: category drafts were absent from beforeunload protection. Added separate dirty state, cleared on save/explicit cancel; browser test confirms warning.
- Low, patched: colour assertions previously checked only a CSS class. Now assert exact saved accent and computed tint after reload, including black/white choices.
- Low, patched: creation while editing a task was untested. Verify title, description, date, category and both times survive category creation and the task saves successfully.
- Low, patched: browser-level category concurrency was untested. Two pages submit equivalent names and unique names concurrently; duplicates are rejected and both successful categories plus all six tasks survive.
