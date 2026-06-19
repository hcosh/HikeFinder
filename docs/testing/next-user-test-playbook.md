# Next User Test Playbook (All Features)

## Purpose
Run one moderated session where a tester can exercise all user-facing features and leave structured, actionable feedback.

## Session Setup
- Timebox: 45-60 minutes
- Devices:
  - iPhone Safari (portrait then landscape)
  - iPad Safari (portrait, landscape, then split view)
- Network states:
  - Start online
  - Briefly simulate weak/offline near the end for recovery checks

## Coverage Matrix
- iPhone portrait: primary core flow
- iPhone landscape: quick layout/touch validation
- iPad portrait: full feature pass
- iPad landscape: state retention while rotating
- iPad split view (50/50 and 1/3): responsive behavior and tap ergonomics

## Moderator Script (In Order)
1. Open app and describe first impression.
2. Set base location manually.
3. Try current location.
4. Use a recent location chip.
5. Adjust filters (difficulty, min rating, max hours, max distance).
6. Use trail count controls (3, 5 when available, All).
7. Open a hike card and validate detail info.
8. Trigger Google Maps handoff.
9. Add two hikes to shortlist, remove one.
10. Rotate device and ensure current state remains coherent.
11. On iPad, test split view while moving between tabs.
12. Open Release QA tab.
13. Toggle checklist items and use Mark all complete.
14. Log QA runs (pass, fail with notes, blocked).
15. Edit one run and delete one run.
16. Filter runs to fail only and copy failed runs.
17. Run Distance compliance audit and read the result.
18. Copy QA summary and export QA runs JSON.
19. Use Clear local data and verify reset.
20. Brief weak/offline retry check: confirm recovery path is usable.

## Feature Pass/Fail Criteria
- Base location:
  - Pass: manual/current/recent all work without dead ends.
  - Fail: any path blocks progress.
- Filters and trail counts:
  - Pass: list updates correctly, count text matches visible cards.
  - Fail: stale or inconsistent results.
- Hike detail and maps:
  - Pass: details are complete and handoff opens correct destination.
  - Fail: missing critical trailhead handoff path.
- Shortlist:
  - Pass: add/remove reflects across tabs and orientation changes.
  - Fail: state mismatch or silent loss.
- Release QA workflow:
  - Pass: checklist and run-log actions work (add/edit/delete/filter/copy).
  - Fail: key controls are non-functional or confusing.
- Distance audit:
  - Pass: result state is clear (pass/fail/unavailable) and understandable.
  - Fail: ambiguous or inconsistent output.
- Data reset:
  - Pass: local shortlist/QA/recent state clears reliably.
  - Fail: stale state persists.

## Feedback Template (Use One Entry Per Issue)
- Title:
- Feature area:
- Severity: Critical | High | Medium | Low
- Device/context: iPhone/iPad, orientation, split view yes/no
- Browser:
- Preconditions:
- Steps to reproduce:
- Expected result:
- Actual result:
- Repro frequency: Always | Often | Sometimes | Once
- Network state: Online | Weak | Offline
- Evidence: screenshot/video/file
- Suggested fix or workaround:

## Debrief Prompts
- What felt most reliable?
- What felt confusing or untrustworthy?
- Which one issue should be fixed before next test round?
- Overall confidence for trip use (1-5):
