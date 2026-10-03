import 'server-only';

// Simple in-memory sliding window (CLAUDE.md §6.7: 5 requests / hour / IP).
// Per serverless instance only: good enough with Turnstile in front; move to a shared
// store (e.g. Upstash) if spam ever gets through.

const WINDOW_MS = 60 * 60 * 1000;
const hits = new Map<string, number[]>();

export function rateLimit(key: string, limit = 5) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);

  // Keep the map from growing forever on a long-lived instance.
  if (hits.size > 5000) {
    for (const [k, times] of hits) if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  }
  return true;
}
