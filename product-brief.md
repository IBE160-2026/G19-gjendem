# Product Brief: Smart To-Do — Tasks in One Calendar

**Course:** IBE160 Programming with AI  
**Student:** Matthew Ryan Gjendem | **Group:** G19  
**Date:** 13 September 2026 | **Updated:** 6 October 2026 | **Status:** Final product brief<br>
**Working name:** Smart To-Do

## Executive Summary

Smart To-Do is a personal task-management application for people balancing responsibilities across work, family and studies. Its main purpose is to provide one overview of unfinished tasks and upcoming dates. A calendar is the main view, bringing these responsibilities together while categories help users distinguish between them.

The idea comes from the project owner's experience balancing family, work and studies, with tasks spread across notes, a mobile calendar and memory. Using project proposal 6, To-Do List with Smart Labels, and the BMAD method in IBE160, development starts with reliable task management and a calendar, followed by AI category suggestions.

## The Problem

The project owner currently checks different places to understand what needs doing. Work notes show one set of responsibilities, the mobile calendar shows another, and tasks held in memory do not appear in either. This makes it difficult to see the complete picture across different parts of life.

This problem is based on the project owner's reported experience. Whether other people share the same need remains to be checked. The initial goal is to reduce the need to consult separate task records by making unfinished tasks and their dates visible together.

## The Solution

The user adds a task with a title, optional description, one category and an optional date labelled "Dato". The default categories are Jobb (blue), Skole (yellow), Familie (green) and Ellers (light brown); Ellers is selected by default. There is one task type: the user can use the optional description to explain whether it represents planned work, an appointment or a deadline. Tasks can be edited, deleted and marked complete, and saved information remains available in the same browser.

The month calendar shows tasks on their dates and marks today. Selecting a day opens a timetable and a separate panel for that day's tasks without times. Optional start and end times must both be supplied and fall within the same day, with end later than start. Overlapping unfinished tasks have red text and a conflict label; touching intervals do not conflict. The user can save a conflict and change the plan manually.

The left sidebar groups tasks into today, the rest of this week and next week onwards. "Uten dato" holds tasks until the user chooses a date. Completed tasks remain visible with strikethrough until "Rydd side" hides them from the overview without deleting them. "Fullført" lists all completed tasks and allows reopening. A separate overview of past unfinished tasks, category filtering and additional categories remain planned Stage 1 work.

After the basic version works, AI will suggest an existing category from task text for the user to accept, reject or change. The core app must remain usable if AI is unavailable. Before Stage 2, the project must choose a service, document server-side credentials kept outside committed code, define costs and data handling, and prepare a clearly labelled fixed-suggestion test mode for assessment without the owner's key. These decisions and the test mode are not yet implemented.

## What Makes This Different

Work notes and a mobile calendar already serve parts of the project owner's needs. The intended benefit is to bring personal tasks from different areas into one calendar with completion status, instead of checking separate records. AI category suggestions could make organising new tasks easier.

Existing calendars and task planners are valid alternatives. This project makes no claim of a unique invention. Its value depends on whether the workflow gives the project owner, and eventually similar users, a clearer overview. First-version tasks will be entered manually.

## Who This Serves

The primary audience is people managing their own tasks across work, family and education. The first version is a local browser app on a PC, with Norwegian Bokmål controls and no login. The project owner is the first user and will test it against everyday needs. Workplace use means organising personal tasks rather than assigning work within a team.

## Success Criteria

These are proposed targets to verify during development, not completed results:

- A test set of ten tasks across Jobb, Skole, Familie and Ellers appears correctly on chosen dates or in the undated list. Editing, completion and saved data remain correct after reopening the app.
- The project owner can identify upcoming tasks across all categories, find past unfinished and undated tasks, and filter by category without consulting separate task notes for the same test tasks.
- Two additional users can each add a dated task, find it in the calendar and mark it complete without step-by-step assistance. Difficulties are recorded and addressed.
- After AI category suggestions are added, at least 16 of 20 predefined, unambiguous tasks receive a category suggestion that meets written criteria. Suggestions can be corrected, and simulated AI failure does not prevent normal task management.
- The project owner can demonstrate the app and explain its core behaviour. GitHub documentation records setup, tests, AI assistance and known limitations.

## Scope

**Stage 1 target:** Personal task management with optional dates, descriptions and same-day times; categories; completion status; local browser storage; a month calendar, day timetable, conflict cues, upcoming sidebar, undated list and recoverable completed-task cleanup. Category filtering, additional categories and a separate past-unfinished overview are still planned, not delivered. Tests must cover date boundaries, time conflicts and saved-data retention.

**Stage 2:** AI category suggestions after Stage 1 is tested and understood. Before implementation, create epics and stories, select the AI service and prepare 20 fictional test tasks with written expected-category criteria. The assessor must be able to try a clearly labelled test mode without a paid account or the project owner's key; this verifies the workflow, not live model accuracy. Live AI accuracy and failure handling must be evaluated separately.

**Not included in the first version:** Task sharing, team administration, account synchronisation, external calendar connections, automatic reminders, recurring tasks and automatic rescheduling. These limits keep the project manageable for one developer.

## Change Note — 6 October 2026

Following the teacher's feedback and the user's approved calendar decisions, this brief replaces deadline-only language with one optional date, adopts the four Norwegian category names and records manual start/end times with conflict warnings. The changes support the owner's need to organise work, family and studies without separate work-period and deadline task types. Manual times are therefore no longer excluded. Local PC-browser use and the later user-requested cleanup/completed views are now explicit. See the [PRD](./_bmad-output/planning-artifacts/prds/prd-smart-to-do-2026-09-27/prd.md) for requirements and [implementation records](./_bmad-output/implementation-artifacts/) for subsequent decisions; older PRD wording about completion and pending time rules still needs reconciliation. Success criteria remain targets, not claims that user trials or AI evaluation have been completed.

## Vision

Over two to three years, Smart To-Do could become a personal planner that helps people maintain an overview across changing responsibilities. Feedback could guide additions such as recurring tasks or reminders. Possible AI extensions include priority suggestions, concise summaries or interpreting free text into a proposed title, date and category for user approval. Free-text interpretation is an option to assess after category suggestions work, not a committed feature. These are possible future directions, rather than commitments for the course project.
