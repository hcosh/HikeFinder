# Holiday Hiking Scope Pack

## Product Brief

This product should be a phone-first, tablet-enhanced hiking planning app for holiday mornings. The core job is to help a traveler quickly choose a nearby, highly rated hike, understand whether it fits the day, and launch directions to the trailhead in Google Maps.

The product is not an on-hike companion. It should feel calm, attractive, and decision-oriented rather than technical or navigation-heavy.

Primary user:
- A traveler using an iPhone or iPad in the morning before leaving for the day.

Primary value:
- Reduce decision fatigue.
- Surface the best nearby hike options.
- Make the choice feel informed and low-risk.
- Hand off cleanly to Google Maps for the drive to the trailhead.

## Scope Proposal

### MVP

- Nearby hike discovery based on current location or a chosen base.
- Ranked shortlist of highly rated hikes.
- Hike cards with rating, distance from base, hike length, difficulty, estimated duration, and selling points.
- Hike detail view with description, key stats, trailhead context, and access notes.
- Simple filters and sort by difficulty, duration, distance, rating, and drive time.
- Small shortlist or saved-candidate flow.
- Trailhead map preview.
- One-tap Google Maps handoff.
- Manual location entry when device location is denied or unavailable.

### Explicitly Out Of MVP

- On-hike navigation.
- GPX editing or route authoring.
- Full offline trail use.
- Rich notes or journaling.
- General web search inside the app.
- Cross-device sync.
- Social/community features.
- Full itinerary planning.

### Post-MVP

- Weather-aware ranking.
- Better compare mode for couples or families.
- Richer logistics such as permits, parking, and seasonal alerts.
- Limited backup/export.
- Sync only if real multi-device use emerges.

## Architecture Implications

- Treat iPhone portrait as the baseline UX.
- Let iPad add denser browse and compare views rather than defining a separate product.
- Keep the map lightweight and contextual.
- Use Google Maps universal URLs as the canonical outbound navigation contract.
- Keep trailhead coordinates separate from richer internal trail geometry.
- Track the funnel from results view to detail to Google Maps handoff.

## Top Risks

- Trailhead accuracy: the most important action fails if coordinates are wrong.
- Mobile information density: too much tablet-style UI will slow phone use.
- Google Maps handoff behavior: installed-app and browser fallback paths must be deliberate.
- Location-permission dependency: the app must work well without current location.
- Content normalization: ratings, duration, and difficulty may vary by source.

## Revised Release Gates

- iPhone portrait flow is complete and usable on common phone sizes.
- iPad layout is additive, not required for task completion.
- Users can find a hike and launch Google Maps in under a few minutes.
- Google Maps handoff is reliable and tested with valid trailhead data.
- Manual location selection works when location is denied.
- Safari/WebKit passes on both iPhone and iPad.
- Launch content includes a validated sample of trailhead destinations.

## Updated Next Steps

1. Define the hike and trailhead schema, especially normalized stats and navigation metadata.
2. Choose the hike content and rating provider.
3. Specify the Google Maps handoff contract and fallback behavior.
4. Design the iPhone screen flow first, then layer on iPad enhancements.
5. Build a release matrix covering iPhone Safari, iPad Safari, Google Maps installed/uninstalled, denied location, and degraded network.