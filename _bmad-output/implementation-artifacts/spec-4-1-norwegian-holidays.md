---
title: Norwegian holiday labels and red flags
type: feature
created: 2026-10-18
status: done
route: oneshot
---

<frozen-after-approval>
## Intent

Show named Norwegian public holidays in the selected calendar year: red date, holiday names immediately below the date heading, and one small red flag at the bottom-right of the cell, as the user requested. Preserve ordinary task entry/editing, category filtering, today marking, colours/photos and accessibility. Holidays are computed information, never saved as tasks. Retain both names when dates coincide.
</frozen-after-approval>

## Implementation Notes

Small reversible addition to model/main/CSS; no intent gaps or data migration. Scope is 12 named annual holidays (five fixed dates and seven Easter-relative dates), not all ordinary Sundays, holiday eves or all official flag days. Supported holiday years 1900–2099, applying current rules rather than historical legislation; calendar navigation remains unrestricted and shows an explanatory notice outside that range. Gregorian Easter uses USNO's Oudin integer algorithm and UTC date-only offset arithmetic, independent of local DST. Display names use Norwegian Bokmål. Opaque white labels/flag backing preserve contrast over photos and custom colours; cell padding reserves flag space.

Sources checked 2026-10-18:
- https://lovdata.no/dokument/NL/lov/1995-02-24-12 (section 2; direct fetch blocked, indexed statutory text inspected)
- https://www.arbeidstilsynet.no/regelverk/lover/lov-om-1-og-17-mai//
- https://aa.usno.navy.mil/faq/easter (Gregorian Easter algorithm, Oudin 1940)
- https://www.timeanddate.no/merkedag/norge/2026 and https://www.timeanddate.no/merkedag/norge/2027 (independent dated fixtures, including 17 May/Pentecost collision).

## Verification

- All 24 model, appearance and holiday unit tests passed; main.js syntax and diff whitespace checks passed.
- Holiday browser check passed: coincident holidays, today marker, task creation/filtering, expanded day, persistence, photo/colour contrast and bottom-right flag placement.
- Existing core browser checks passed, including editing, completion, deletion, reload, storage failures, cross-tab updates and focus handling.
- Visually inspected the holiday screenshot with a dark calendar and red grid image; labels and flags remain readable without covering task cards.

## Independent Review and Triage

The independent reviewer reported no actionable findings (review target N=4 from 13.52 kB). They also compared Easter against the independent Meeus/Jones/Butcher algorithm for every supported year, 1900–2099, with all dates matching. No fixes were required. Browser verification above was performed by the implementing agent, not independently repeated by the reviewer.
