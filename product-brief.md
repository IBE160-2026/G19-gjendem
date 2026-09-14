# Product Brief: Smart To-Do — Tasks and Deadlines in One Calendar

**Course:** IBE160 Programming with AI  
**Student:** Matthew Ryan Gjendem | **Group:** G19  
**Date:** 13 September 2026 | **Updated:** 14 September 2026 | **Status:** Final product brief  
**Working name:** Smart To-Do

## Executive Summary

Smart To-Do is a personal task-management application for people balancing responsibilities across work, family and studies. Its main purpose is to provide one overview of unfinished tasks and approaching deadlines. A calendar is the main view, bringing these responsibilities together while categories help users distinguish between them.

The idea comes from the project owner's experience balancing family, work and studies, with tasks spread across notes, a mobile calendar and memory. Using project proposal 6, To-Do List with Smart Labels, and the BMAD method in IBE160, development starts with reliable task management and a calendar, followed by AI label suggestions.

## The Problem

The project owner currently checks different places to understand what needs doing. Work notes show one set of responsibilities, the mobile calendar shows another, and tasks held in memory do not appear in either. This makes it difficult to see the complete picture across different parts of life.

This problem is based on the project owner's reported experience. Whether other people share the same need remains to be checked. The initial goal is to reduce the need to consult separate task records by making unfinished work and its deadlines visible together.

## The Solution

The user adds a task with a title, optional notes, a category and an optional deadline date. Categories such as Work, Family and Studies organise tasks, and users can create their own. Tasks can be edited, deleted and marked complete. Saved information remains available after reopening the app.

The proposed calendar starts with a month view showing task titles on their deadline dates. Selecting a day opens its tasks and allows the user to add or edit them. Colours and category names distinguish different responsibilities. Filters provide a focused view, while a separate list keeps tasks without deadlines visible. Unfinished tasks with past deadlines remain accessible and are clearly marked overdue. A deadline means the day by which a task should be finished; it does not reserve time to work on it.

After the basic version works, AI will suggest labels from task text for the user to accept or change. Priority suggestions and short task summaries are possible subsequent improvements. The user sets deadlines, and the core app remains usable if AI is unavailable. Technology choices will be made during subsequent planning.

## What Makes This Different

Work notes and a mobile calendar already serve parts of the project owner's needs. The intended benefit is to bring personal tasks from different areas into one calendar with completion status, instead of checking separate records. AI labels could make organising new tasks easier.

Existing calendars and task planners are valid alternatives. This project makes no claim of a unique invention. Its value depends on whether the workflow gives the project owner, and eventually similar users, a clearer overview. First-version tasks will be entered manually.

## Who This Serves

The primary audience is people managing their own tasks across work, family and education. The project owner is the first user and will test the app against everyday needs. Workplace use means organising personal tasks rather than assigning work within a team.

## Success Criteria

These are proposed targets to verify during development, not completed results:

- A test set of ten tasks across Work, Family and Studies appears correctly on deadline dates or in the undated list. Editing, completion and saved data remain correct after reopening the app.
- The project owner can identify upcoming deadlines across all categories, find overdue and undated tasks, and filter by category without consulting separate task notes for the same test tasks.
- Two additional users can each add a dated task, find it in the calendar and mark it complete without step-by-step assistance. Difficulties are recorded and addressed.
- After AI labels are added, at least 16 of 20 predefined, unambiguous tasks receive a label suggestion that meets written criteria. Suggestions can be corrected, and simulated AI failure does not prevent normal task management.
- The project owner can demonstrate the app and explain its core behaviour. GitHub documentation records setup, tests, AI assistance and known limitations.

## Scope

**First working version:** Personal task management with optional deadline dates, notes, categories, completion status and persistent storage. The calendar is the main view, with day details, category filtering and visible access to undated and overdue tasks.

**Next stage within the planned course project:** AI label suggestions, added after the first version has been tested and understood. Priority suggestions and short task summaries are potential improvements after that stage works.

**Not included in the first version:** Sharing tasks between users, team administration, syncing accounts or connecting to external calendars, automatic reminders, recurring tasks and scheduling time to work on tasks. These limits keep the first version manageable for one developer.

## Vision

Over two to three years, Smart To-Do could become a personal planner that helps people maintain an overview across changing responsibilities. Feedback could guide additions such as recurring tasks, reminders or planned work times. AI could help organise tasks through priority suggestions and concise summaries while users retain control. These are possible future directions, rather than commitments for the course project.
