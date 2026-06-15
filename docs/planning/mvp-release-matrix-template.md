# MVP Release Matrix Template

## Targets

- iPhone Safari (portrait) - required
- iPhone Safari (landscape) - required
- iPad Safari (portrait) - required
- iPad Safari (landscape + split view) - required
- Google Maps app installed - required
- Google Maps app not installed (browser fallback) - required

## Core Flow Checks

1. Set base location manually with OK button.
2. Set base location using current location.
3. Browse nearby hikes and open detail.
4. Add/remove shortlist from list and detail.
5. Open trailhead preview.
6. Open in Google Maps handoff.

## Error/Recovery Checks

- Denied location permission path
- No results after restrictive filters + reset recovery
- Missing/invalid trailhead coordinates fallback (copy coordinates)
- Weak network loading state and retry behavior

## Security/Quality Checks

- Outbound link host allowlist enforced
- Invalid coordinate handoff blocked
- Trailhead quality confidence visible in detail
- Data source attribution visible in detail

## Signoff Table

| Area | Owner | Status | Notes |
|---|---|---|---|
| iPhone portrait flow |  |  |  |
| iPhone landscape flow |  |  |  |
| iPad portrait flow |  |  |  |
| iPad landscape/split flow |  |  |  |
| Google Maps installed path |  |  |  |
| Google Maps browser fallback |  |  |  |
| Error/recovery scenarios |  |  |  |
| Security checks |  |  |  |
