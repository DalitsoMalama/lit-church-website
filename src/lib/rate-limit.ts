import "server-only";
import { headers } from "next/headers";

/**
 * Best-effort, in-memory sliding-window rate limiter keyed by client IP.
 * It stops casual flooding of the public forms and PIN guessing. Memory is per
 * server instance, so for stronger protection also add a Vercel Firewall rate-limit
 * rule (see SECURITY.md).
 */
const buckets = new Map<string, number[]>();
const MAX_KEYS = 10_000;

export async function clientIp() {
  const h = await headers();
  return (
    h.get("x-real-ip") ??
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

/** Returns true if the action may proceed; records the attempt. */
export async function rateLimit(scope: string, limit: number, windowMs: number) {
  const key = `${scope}:${await clientIp()}`;
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    buckets.set(key, recent);
    return false;
  }
  recent.push(now);
  buckets.set(key, recent);
  if (buckets.size > MAX_KEYS) buckets.delete(buckets.keys().next().value!); // bound memory
  return true;
}
