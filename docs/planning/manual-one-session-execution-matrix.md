# One-Session Manual Execution Matrix (iPhone + iPad Safari)

## Scope and timebox
- Target duration: 45-60 minutes total.
- Goal: validate highest-risk discovery -> detail -> trailhead handoff flows, plus orientation/split-view stability.

## Device/browser matrix

| ID | Device | Safari Context | Orientation / Layout | Why it matters | Status | Notes |
|---|---|---|---|---|---|---|
| M1 | iPhone (primary test phone) | Safari, standalone tab/PWA-like run | Portrait | Primary production path | [ ] Pass [ ] Fail |  |
| M2 | iPhone (same) | Safari | Landscape | Card/detail layout stress + touch target changes | [ ] Pass [ ] Fail |  |
| M3 | iPad (primary test iPad) | Safari full screen | Portrait | iPad enhancement baseline | [ ] Pass [ ] Fail |  |
| M4 | iPad (same) | Safari full screen | Landscape | Wider layout + state persistence | [ ] Pass [ ] Fail |  |
| M5 | iPad (same) | Safari split view | 50/50 split and 1/3 split | Responsive behavior under constrained width | [ ] Pass [ ] Fail |  |

## High-risk flow checklist (run once unless device-specific is noted)

| Flow ID | Journey | Run on | Pass/Fail | Notes |
|---|---|---|---|---|
| F1 | Launch -> set manual base location -> see nearby list | M1, M3 | [ ] Pass [ ] Fail |  |
| F2 | Launch -> deny location permission -> recover using manual location | M1 | [ ] Pass [ ] Fail |  |
| F3 | Open hike detail from list -> verify key fields load (distance, duration, difficulty, trailhead) | M1, M3 | [ ] Pass [ ] Fail |  |
| F4 | Add shortlist from list, remove from detail (state stays in sync) | M1 | [ ] Pass [ ] Fail |  |
| F5 | Open trailhead preview/map context from detail | M1, M3 | [ ] Pass [ ] Fail |  |
| F6 | Open in Google Maps when app is installed | M1 | [ ] Pass [ ] Fail |  |
| F7 | Open in Google Maps browser fallback when app is not installed/available | M3 | [ ] Pass [ ] Fail |  |
| F8 | Apply restrictive filters -> zero results -> reset/clear recovers list | M1 | [ ] Pass [ ] Fail |  |
| F9 | Rotate during active session (list/detail selected) and verify no critical state loss | M2, M4 | [ ] Pass [ ] Fail |  |
| F10 | On iPad split view (50/50 then 1/3), validate usability and no blocked CTA/tap targets | M5 | [ ] Pass [ ] Fail |  |

## Fast execution order
1. M1: F1 -> F3 -> F4 -> F5 -> F6 -> F8
2. M2: F9 (iPhone rotation check)
3. M3: F1 -> F3 -> F5 -> F7
4. M4: F9 (iPad full-screen rotation check)
5. M5: F10 (split-view checks)
6. M1: F2 (permission-denied recovery, last so you can reset permissions once)

## Release-impact rubric
- Ship ready: all flows pass, or only cosmetic issues with documented workaround.
- Conditional ship: one non-blocking functional fail with accepted mitigation and owner/date.
- No ship: any failure in manual-location recovery, shortlist consistency, trailhead handoff, or orientation/split-view state retention.

## Defect log (same session)

| Defect ID | Matrix Ref | Device/Context | Repro steps (short) | Expected | Actual | Severity | Owner |
|---|---|---|---|---|---|---|---|
| D-01 |  |  |  |  |  |  |  |
| D-02 |  |  |  |  |  |  |  |
| D-03 |  |  |  |  |  |  |  |
