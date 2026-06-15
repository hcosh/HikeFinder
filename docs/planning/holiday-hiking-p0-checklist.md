# Holiday Hiking P0 Build Checklist

## Goal
Ship a reliable iPhone-first (iPad-enhanced) planning experience that gets users from nearby hike discovery to Google Maps trailhead handoff quickly and safely.

## P0 Tasks

1. Define canonical schema for `hike` and `trailhead`.
- Include: name, rating, distance, duration, difficulty, highlights, trailhead coordinates, trailhead label/address, source metadata, freshness timestamp.

2. Define normalized scoring/ranking contract.
- Specify how highly rated nearby hikes are computed and tie-breaks are applied.

3. Implement launch/permission flow.
- Include location permission request plus immediate manual base-location entry fallback.

4. Implement base-location management.
- Current location, manual search/select, recents, and one-tap location edit from browse screens.

5. Build iPhone-first browse list.
- Ranked cards with required decision fields and touch-safe interactions.

6. Implement filters and sort with recovery.
- Add clear/reset and explicit zero-results recovery actions.

7. Build hike detail view.
- Show summary, stats, highlights, trailhead info, shortlist action, and primary handoff CTA.

8. Implement shortlist persistence.
- Add/remove from list and detail, with local persistence and consistent state updates.

9. Implement trailhead preview.
- Lightweight map context only; no in-app on-trail navigation behavior.

10. Implement canonical Google Maps handoff contract.
- Use universal URL builder, strict parameter validation, and explicit installed/uninstalled behavior.

11. Add outbound URL security controls.
- Domain allowlist, encoded parameters, and tests for malformed/tampered links.

12. Add provider payload trust boundary.
- Schema validation and sanitization for third-party hike content before rendering.

13. Add privacy-safe local storage policy.
- Do not persist precise location/history by default; add clear-all local data action.

14. Implement critical empty/error states.
- No results, denied location, weak network, missing trailhead data, and handoff failure.

15. Run P0 release matrix.
- Devices: iPhone Safari baseline plus iPad Safari enhancement.
- Scenarios: portrait/landscape, split view on iPad, location denied, weak network, Google Maps installed/uninstalled.

## P0 Release Gates

1. Core flow passes on iPhone portrait: open app -> choose hike -> open Google Maps.
2. Google Maps handoff succeeds for installed and browser fallback paths.
3. Trailhead destination sample passes accuracy QA threshold.
4. Manual base-location flow works when location permission is denied.
5. No critical state loss across iPad rotation/split-view transitions.
6. Empty/error states always provide a usable recovery path.
7. Security checks pass for outbound links and untrusted provider payloads.

## Suggested Owners

- Product/UX: tasks 3-8, 14
- Data/Backend: tasks 1-2, 12
- Frontend: tasks 5-11, 13
- QA: task 15 and release gates
