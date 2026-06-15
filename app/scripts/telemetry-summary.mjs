#!/usr/bin/env node

import fs from "node:fs";

function summarize(events) {
  const byName = events.reduce((acc, event) => {
    const name = typeof event?.name === "string" ? event.name : "unknown";
    acc[name] = (acc[name] ?? 0) + 1;
    return acc;
  }, {});

  const totalEvents = events.length;
  const fallbackUsedCount = byName.provider_fallback_used ?? 0;
  const mapsHandoffCount = byName.maps_handoff_opened ?? 0;
  const fallbackRatePercent = totalEvents === 0 ? 0 : Number(((fallbackUsedCount / totalEvents) * 100).toFixed(1));

  return {
    totalEvents,
    fallbackUsedCount,
    mapsHandoffCount,
    fallbackRatePercent,
    byName
  };
}

function format(summary) {
  const entries = Object.entries(summary.byName)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, count]) => `- ${name}: ${count}`)
    .join("\n");

  return [
    "Telemetry QA Summary",
    `Total events: ${summary.totalEvents}`,
    `Fallback used: ${summary.fallbackUsedCount}`,
    `Maps handoff opened: ${summary.mapsHandoffCount}`,
    `Fallback rate: ${summary.fallbackRatePercent}%`,
    "Event counts:",
    entries || "- (none)"
  ].join("\n");
}

function parseInput(raw) {
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error("Input must be a JSON array of telemetry events.");
  }
  return parsed;
}

try {
  const filePath = process.argv[2];
  const raw = filePath ? fs.readFileSync(filePath, "utf8") : fs.readFileSync(0, "utf8");
  const events = parseInput(raw);
  const summary = summarize(events);
  process.stdout.write(`${format(summary)}\n`);
} catch (error) {
  const message = error instanceof Error ? error.message : "Unknown error";
  process.stderr.write(`Failed to summarize telemetry: ${message}\n`);
  process.exit(1);
}
