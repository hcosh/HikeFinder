# MVP Parallel Lanes (1-2 Weeks)

## Current Status

- App scaffold is live in `app/`.
- Build passes.
- Core flow implemented: base location input, ranked hikes, filters, detail view, shortlist, trailhead preview, Google Maps handoff.

## Lane A: Core UX and Data Reliability (highest priority)

- Add provider abstraction for hike data source switching.
- Add trailhead data-quality flags and confidence labels.
- Add explicit no-results and missing-data recovery UX copy.
- Add loading states for data hydration and location updates.

## Lane B: Mobile and iPad Responsiveness

- Improve iPhone portrait spacing and sticky CTA behavior.
- Add iPhone landscape guardrails (single-column, no cramped controls).
- Improve iPad split-view state persistence and pane behavior.
- Add tap target and keyboard-overlap QA fixes.

## Lane C: Google Maps Handoff Hardening

- Centralize URL validation/allowlist for Google Maps links.
- Track handoff success/failure events.
- Add offline fallback UX with copy destination action.
- Add tests for malformed coordinates and bad payloads.

## Lane D: Quality and Release Gates

- Add unit tests for filter logic and shortlist store.
- Add smoke tests for flow: browse -> detail -> handoff.
- Add release checklist execution log for iPhone/iPad scenarios.
- Add basic performance budget checks for bundle size and interaction speed.

## Suggested Parallel Assignment

- Engineer 1: Lane A
- Engineer 2: Lane B
- Engineer 3: Lane C
- Engineer 4 or shared: Lane D

## Sequencing

1. Complete Lane A and C in parallel first.
2. Run Lane B fixes on top of Lane A screens.
3. Run Lane D continuously as other lanes land.