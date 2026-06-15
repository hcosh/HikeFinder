# MVP Release Verify Command

> Badge template for your repo README:
>
> `![Verify Release](https://github.com/<OWNER>/<REPO>/actions/workflows/verify-release.yml/badge.svg)`

Use this command before cutting a release candidate:

```bash
cd app
npm run verify:release
```

What it checks:
- Smoke flow: manual base location path, provider load, selected-hike handoff URL path.
- Production build: TypeScript compile and Vite bundle generation.

Expected result:
- Exit code `0`.
- Smoke test passes.
- Build completes with generated `dist/` artifacts.

Telemetry QA summary:

```bash
cd app
npm run qa:telemetry < telemetry-events.json
```

Input format:
- `telemetry-events.json` must be a JSON array matching entries from localStorage key `holiday-hiking-telemetry-events`.
