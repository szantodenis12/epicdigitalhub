/* ============================================================================
   Where applications and leads are kept, and the rate limiter.

   Production (Vercel): Upstash Redis, connected through the Vercel
   Marketplace integration. A serverless function has no disk that survives
   the request and no memory shared between instances, so neither the JSON
   files nor the in-memory throttle from the handoff package work there.

   Local dev without Redis credentials: JSON files under /data (gitignored)
   and an in-memory throttle, exactly as the handoff package did it, so the
   forms can be tried out with no account set up.

   Redis layout
     applications      list, newest first, one JSON record per entry
     audit-leads       list, same
     contact-leads     list, same (the footer form)
     taken-niches      JSON array of { city, niche, client }. Optional: when
                       unset, the seed in taken-niches.json is used. Setting
                       it in the Upstash console updates the list without a
                       deploy.
     rl:<bucket>:<id>  rate-limit counters, expiring with their window
   ========================================================================= */

import { promises as fs } from "fs";
import path from "path";
import { Redis } from "@upstash/redis";
import seedTakenNiches from "./taken-niches.json";

export type RecordKind = "applications" | "audit-leads" | "contact-leads";

/** One category is either open or taken. `client` is internal - it is never
    sent to the browser. */
export type TakenNiche = { city: string; niche: string; client: string };

/* The Vercel Upstash integration has shipped under two env-var names; accept
   either so reconnecting the integration never silently drops storage. */
function redisFromEnv(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  return url && token ? new Redis({ url, token }) : null;
}

const redis = redisFromEnv();

/** On Vercel without Redis there is nowhere durable to write. */
const canUseFiles = !process.env.VERCEL;

const DATA_DIR = path.join(process.cwd(), "data");

async function readJsonFile<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8")) as T;
  } catch {
    return fallback; // not created yet
  }
}

/**
 * Stores one record. Returns whether it was stored durably, so a caller that
 * also emails the record can tell whether the email is the only copy.
 * Never throws: a storage failure must not lose the visitor's submission
 * before the email has had its chance.
 */
export async function saveRecord(kind: RecordKind, record: Record<string, unknown>): Promise<boolean> {
  const entry = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...record };
  try {
    if (redis) {
      await redis.lpush(kind, JSON.stringify(entry));
      return true;
    }
    if (canUseFiles) {
      await fs.mkdir(DATA_DIR, { recursive: true });
      const file = path.join(DATA_DIR, `${kind}.json`);
      const list = await readJsonFile<unknown[]>(file, []);
      list.unshift(entry);
      await fs.writeFile(file, JSON.stringify(list, null, 2), "utf8");
      return true;
    }
    console.error(`[store] no Redis configured on Vercel; ${kind} record not stored`);
  } catch (err) {
    console.error(`[store] saving ${kind} failed:`, err);
  }
  return false;
}

export async function getTakenNiches(): Promise<TakenNiche[]> {
  try {
    if (redis) {
      // @upstash/redis parses JSON values itself
      const stored = await redis.get<TakenNiche[]>("taken-niches");
      if (Array.isArray(stored)) return stored;
    }
  } catch (err) {
    console.error("[store] reading taken-niches failed, using the seed:", err);
  }
  return seedTakenNiches;
}

/* In-memory fallback for local dev only. */
const memoryHits = new Map<string, number[]>();

/**
 * Fixed-window rate limit. Returns true when this call is over the limit.
 * Fails OPEN if Redis errors: a Redis outage should not take the audit down,
 * and the API key's own spend limit is the backstop.
 */
export async function isRateLimited(
  bucket: string,
  id: string,
  max: number,
  windowSeconds: number,
): Promise<boolean> {
  const key = `rl:${bucket}:${id}`;
  if (redis) {
    try {
      const count = await redis.incr(key);
      if (count === 1) await redis.expire(key, windowSeconds);
      return count > max;
    } catch (err) {
      console.error("[store] rate limit check failed, allowing:", err);
      return false;
    }
  }
  const now = Date.now();
  const recent = (memoryHits.get(key) ?? []).filter((t) => now - t < windowSeconds * 1000);
  recent.push(now);
  memoryHits.set(key, recent);
  return recent.length > max;
}
