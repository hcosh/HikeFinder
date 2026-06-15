# Holiday Hiking Screen Map

## Screen Inventory

1. Launch / Permission Gate
- Explain value quickly.
- Ask for location only if needed.
- Offer manual place entry immediately.

2. Set Base Location
- Current location, searched place, or recent place.

3. Nearby Hikes Browse
- Ranked nearby hikes.
- Visible base location.
- Filters, sort, shortlist toggle.

4. Filter And Sort Sheet
- Distance radius.
- Difficulty.
- Hike length.
- Estimated duration.
- Minimum rating.

5. Hike Detail
- Hero image.
- Rating and reviews.
- Trail stats.
- Short description.
- Selling points.
- Trailhead distance from base.
- Shortlist toggle.
- Preview Trailhead.
- Open in Google Maps.

6. Shortlist
- Saved candidates for quick comparison.
- Open detail.
- Remove.
- Preview Trailhead.
- Open in Google Maps.

7. Trailhead Preview
- Lightweight map.
- Trailhead label and coordinates/address.
- Drive time from base if available.
- Open in Google Maps.

8. Empty / Error States
- No results.
- Denied location.
- Weak network.
- Missing trailhead data.

## iPhone Flow

1. Open app.
2. Choose current location or set a base.
3. Land on nearby hikes browse view.
4. Apply filters or sort if needed.
5. Open a hike detail.
6. Optionally add it to shortlist.
7. Preview the trailhead.
8. Open Google Maps.

Recommended navigation:
- Bottom navigation with Browse and Shortlist.
- Base location visible in the browse header.
- Filters and sort in bottom sheets.

## iPad Enhancements

- Two-pane layout in landscape: hike list plus selected hike detail.
- Wider filter popovers or a light filter rail.
- Side-by-side shortlist review.
- Contained trailhead preview pane next to hike detail.
- Strong state preservation across rotation and split view.

## Orientation Notes

### iPhone Portrait

- Single-column primary flow.
- Bottom sheets for filters and sort.
- Compact but explicit base location control.

### iPhone Landscape

- Keep one primary column.
- Avoid pseudo-tablet multi-pane layouts.
- Protect the primary CTA from keyboard and sticky UI overlap.

### iPad Portrait

- Stacked flow is acceptable.
- Use denser cards and faster return to the selected hike.

### iPad Landscape

- Default to list + detail.
- Promote trailhead preview into a companion pane when space allows.
- Preserve filters, shortlist, and selected hike while switching panes.

## Critical UX Rules

1. Base location must always be visible and editable.
2. Browsing should begin with highly rated nearby hikes by default.
3. Filters must be easy to reset and should never trap the user in zero-result confusion.
4. Trailhead preview should build confidence, not become an in-app navigation tool.
5. Shortlisting must be fast, reversible, and available from both list and detail views.