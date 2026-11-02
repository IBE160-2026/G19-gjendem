# PRD input reconciliation — 2 November 2026

Inputs: the user's approved November update list, October Epic 1 overview, current `app/main.js`, `app/model.js`, `app/appearance.js`, and the PRD/addendum revision.

## Outcome

The approved changes are covered: local and published use, per-origin browser storage, delivered category editing/filtering, appearance previews and images, Norwegian holiday flags, approved but pending past-unfinished review, differentiated test evidence and dated change history. AI remains deferred. Google Calendar-inspired ideas remain explicitly unapproved rather than new delivery commitments.

Code inspection supports the delivered/pending split: category and holiday rendering and appearance persistence exist; the separate past-unfinished review window is not present. The 24-test result is labelled historical, while production persistence is attributed to the user; neither is presented as completed external acceptance.

## Clarification to apply

- FR-17 should state that the opening notice appears only when at least one qualifying task exists, matching Epic 1.1. The current wording can be read as requiring a zero-count notice.

No other material input gaps found. The technical addendum now records the static Vercel configuration and separate origins. This reconciliation did not rerun application tests or verify the live deployment.

Resolution: FR-17 now explicitly requires qualifying tasks before showing the notice.
