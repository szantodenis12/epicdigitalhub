/* ============================================================================
   Unde stau aplicațiile și lead-urile, plus limitarea pe IP.

   Producție (Vercel): Postgres, în proiectul Supabase al echipei - același pe
   care rulează platforma de tichete. Schema e în `supabase/0001_site_leads.sql`
   și aia e sursa de adevăr; aici doar se scrie și se citește.

   DE CE Postgres și nu Redis, cum era până în noiembrie 2026: baza Upstash a
   fost ștearsă și nu a putut fi recuperată. Fusese creată prin integrarea
   Vercel Marketplace, deci nu se vedea din consola Upstash, iar Vercel o arăta
   în continuare „connected" după ce dispăruse. Toate lead-urile scrise acolo
   s-au pierdut. Postgres are backup și stă într-un proiect pe care echipa îl
   deschide zilnic, deci dispariția lui s-ar vedea în aceeași zi.

   Dev local fără credențiale: fișiere JSON în /data (gitignored) și o limitare
   ținută în memoria procesului, exact ca în pachetul de handoff, ca formularele
   să poată fi încercate fără niciun cont configurat. Pe Vercel fără credențiale
   nu există unde scrie durabil, deci se loghează și se răspunde „nu s-a
   stocat" - vezi `saveRecord`.

   Harta Postgres
     site_leads        un rând per lead, coloana `kind` = contact|audit|apply.
                       Câmpurile fără coloană intră în `extra` (jsonb).
     site_rate_limits  contoarele pe fereastră fixă, prin RPC `site_rate_hit`.
     taken_niches      nișele ocupate. Gol = se folosește seed-ul din
                       taken-niches.json, ca înainte cu cheia nesetată din
                       Redis: lista se poate schimba din Supabase, fără deploy.

   Toate trei au RLS pornit și nicio politică, deci se poate ajunge la ele
   numai cu cheia de service - de aceea clientul de aici nu are voie să ajungă
   niciodată în browser.
   ========================================================================= */

import { promises as fs } from "fs";
import path from "path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import seedTakenNiches from "./taken-niches.json";

export type RecordKind = "applications" | "audit-leads" | "contact-leads";

/** One category is either open or taken. `client` is internal - it is never
    sent to the browser. */
export type TakenNiche = { city: string; niche: string; client: string };

/* Numele listelor din Redis au rămas în aplicație (rutele și panoul le
   folosesc), dar în Postgres un lead e un rând cu `kind` scurt. Traducerea
   stă aici, într-un singur loc, ca redenumirea uneia să nu ceară atingerea
   rutelor. */
const KIND_COLUMN: Record<RecordKind, "contact" | "audit" | "apply"> = {
  applications: "apply",
  "audit-leads": "audit",
  "contact-leads": "contact",
};

/* Coloanele în care se pun câmpurile formularelor. Ce nu e în listă merge în
   `extra`: un câmp nou în formular nu are voie să piardă lead-ul, iar o
   migrație uitată e exact felul în care s-ar pierde. */
const LEAD_COLUMNS = [
  "name",
  "email",
  "locale",
  "page",
  "url",
  "business",
  "city",
  "niche",
  "website",
  "goal",
  "budget",
  "status",
] as const;

const isLeadColumn = (key: string): boolean => (LEAD_COLUMNS as readonly string[]).includes(key);

/* Clientul se construiește la prima folosire, nu la încărcarea modulului:
   `next build` importă fișierul ca să randeze paginile, iar o variabilă de
   mediu lipsită la build nu are voie să rupă build-ul - exact motivul pentru
   care `redisFromEnv()` era o funcție și nu o constantă. Odată construit, e
   ținut: un client per proces, nu unul per cerere.

   `persistSession: false` pentru că nu există utilizator de autentificat aici;
   cheia de service e tot ce ne trebuie, iar scrierea unei sesiuni pe disc
   într-o funcție serverless n-ar avea nici unde, nici de ce. */
let cachedClient: SupabaseClient | null = null;

function supabaseFromEnv(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  cachedClient ??= createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cachedClient;
}

/** Pe Vercel fără bază de date nu există nimic durabil de scris. */
const canUseFiles = !process.env.VERCEL;

const DATA_DIR = path.join(process.cwd(), "data");

async function readJsonFile<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8")) as T;
  } catch {
    return fallback; // not created yet
  }
}

/* Un lead, pregătit pentru insert. Numai string-urile ajung în coloane: toate
   sunt `text`, iar o valoare de alt tip (dacă vreodată un formular trimite un
   număr sau o bifă) e mai bine păstrată în `extra` decât convertită în
   liniște. `id` și `created_at` nu se trimit - le pune Postgres, ca ora să fie
   a bazei, nu a ceasului funcției. */
function toRow(kind: RecordKind, record: Record<string, unknown>): Record<string, unknown> {
  const row: Record<string, unknown> = { kind: KIND_COLUMN[kind] };
  const extra: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(record)) {
    if (value === undefined || value === null) continue;
    if (isLeadColumn(key) && typeof value === "string") row[key] = value;
    else extra[key] = value;
  }
  row.extra = extra; // coloana e `not null default '{}'`, deci niciodată null
  return row;
}

/**
 * Stores one record. Returns whether it was stored durably, so a caller that
 * also emails the record can tell whether the email is the only copy.
 * Never throws: a storage failure must not lose the visitor's submission
 * before the email has had its chance.
 */
export async function saveRecord(kind: RecordKind, record: Record<string, unknown>): Promise<boolean> {
  try {
    const db = supabaseFromEnv();
    if (db) {
      const { error } = await db.from("site_leads").insert(toRow(kind, record));
      if (error) {
        console.error(`[store] saving ${kind} failed:`, error.message);
        return false;
      }
      return true;
    }
    if (canUseFiles) {
      /* Fișierul păstrează forma veche (`id` + `createdAt` în entry), ca
         panoul să citească local la fel ca din bază. */
      const entry = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...record };
      await fs.mkdir(DATA_DIR, { recursive: true });
      const file = path.join(DATA_DIR, `${kind}.json`);
      const list = await readJsonFile<unknown[]>(file, []);
      list.unshift(entry);
      await fs.writeFile(file, JSON.stringify(list, null, 2), "utf8");
      return true;
    }
    console.error(`[store] no database configured on Vercel; ${kind} record not stored`);
  } catch (err) {
    console.error(`[store] saving ${kind} failed:`, err);
  }
  return false;
}

/* O intrare din fișierele locale e scrisă ca JSON, dar poate veni și ca obiect
   gata făcut. Le acceptăm pe amândouă, iar ce nu se poate citi e sărit: o
   singură intrare stricată nu are voie să golească tot panoul. */
function parseEntry(value: unknown): Record<string, unknown> | null {
  if (typeof value === "string") {
    try {
      const parsed: unknown = JSON.parse(value);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed)
        ? (parsed as Record<string, unknown>)
        : null;
    } catch {
      return null;
    }
  }
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

/* Un rând din `site_leads` înapoi în forma pe care o așteaptă panoul: aceleași
   chei ca intrările scrise altădată în Redis, ca `_admin/data.ts` să nu știe
   din ce stocare a venit lead-ul.

   Două detalii care contează:
   - `created_at` devine `createdAt` normalizat prin `toISOString()`. Postgres
     dă „+00:00", iar panoul sortează lead-urile comparând șirurile ISO direct;
     un singur rând cu alt format ar strica ordinea listei „cele mai noi".
   - `extra` se întinde înapoi la nivelul de sus, înaintea coloanelor reale, ca
     o coloană adevărată să câștige dacă vreodată un câmp apare în amândouă. */
function rowToRecord(row: Record<string, unknown>): Record<string, unknown> {
  const record: Record<string, unknown> = {};

  const extra = row.extra;
  if (extra && typeof extra === "object" && !Array.isArray(extra)) {
    Object.assign(record, extra as Record<string, unknown>);
  }

  record.id = typeof row.id === "string" ? row.id : "";

  const createdAt = row.created_at;
  const parsed = typeof createdAt === "string" ? Date.parse(createdAt) : NaN;
  record.createdAt = Number.isNaN(parsed) ? "" : new Date(parsed).toISOString();

  for (const column of LEAD_COLUMNS) {
    const value = row[column];
    if (value !== null && value !== undefined) record[column] = value;
  }
  return record;
}

/** Rezultatul unei citiri. `source` nu e statistică, e diagnostic: panoul
    trebuie să deosebească "încă nu sunt lead-uri" de "nu există de unde citi",
    pentru că zerourile arată la fel în amândouă cazurile. "none" acoperă și
    citirea picată, nu doar lipsa configurării.

    Distincția asta e singurul motiv pentru care s-a observat că baza Upstash
    dispăruse; de aceea rămâne. */
export type RecordsRead = {
  records: Record<string, unknown>[];
  source: "supabase" | "files" | "none";
};

/**
 * Citește o listă, cea mai nouă înregistrare prima - oglinda lui `saveRecord`,
 * pentru panoul de administrare. Postgres în producție, aceleași fișiere din
 * /data în dev, ca panoul să aibă ce arăta și local.
 *
 * Nu aruncă niciodată, din același motiv ca `saveRecord`: panoul preferă o
 * listă goală plus un avertisment unui 500, iar `source` spune care din două e.
 */
export async function readRecords(kind: RecordKind, limit = 1_000): Promise<RecordsRead> {
  try {
    const db = supabaseFromEnv();
    if (db) {
      /* `created_at desc` ține ordinea pe care o dădea `lrange` peste o listă
         scrisă cu `lpush`: cea mai nouă prima. Panoul se bazează pe ea. */
      const { data, error } = await db
        .from("site_leads")
        .select("*")
        .eq("kind", KIND_COLUMN[kind])
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) {
        console.error(`[store] reading ${kind} failed:`, error.message);
        return { records: [], source: "none" };
      }
      return { records: (data ?? []).map(rowToRecord), source: "supabase" };
    }
    if (canUseFiles) {
      /* Nu prin `readJsonFile`: acolo fișierul lipsă și fișierul stricat dau
         amândouă [], iar aici diferența dintre ele e tocmai ce ne interesează. */
      const text = await fs.readFile(path.join(DATA_DIR, `${kind}.json`), "utf8");
      const list: unknown = JSON.parse(text);
      if (!Array.isArray(list)) return { records: [], source: "none" };
      return {
        records: list
          .slice(0, limit)
          .map(parseEntry)
          .filter((r): r is Record<string, unknown> => r !== null),
        source: "files",
      };
    }
  } catch (err) {
    // Fișierul care încă nu există nu e o eroare: nimeni nu a trimis nimic.
    if ((err as { code?: string }).code === "ENOENT") return { records: [], source: "none" };
    console.error(`[store] reading ${kind} failed:`, err);
  }
  return { records: [], source: "none" };
}

/* Tabelul gol nu înseamnă „nicio nișă ocupată", înseamnă „lista n-a fost
   populată" - la fel ca pe vremea cheii nesetate din Redis - deci se cade pe
   seed. O nișă chiar eliberată se șterge din seed, nu din tabel. */
export async function getTakenNiches(): Promise<TakenNiche[]> {
  try {
    const db = supabaseFromEnv();
    if (db) {
      const { data, error } = await db.from("taken_niches").select("city, niche, client");
      if (error) throw new Error(error.message);
      if (data && data.length > 0) {
        return data.map((row) => ({
          city: String(row.city ?? ""),
          niche: String(row.niche ?? ""),
          client: String(row.client ?? ""),
        }));
      }
    }
  } catch (err) {
    console.error("[store] reading taken_niches failed, using the seed:", err);
  }
  return seedTakenNiches;
}

/* In-memory fallback for local dev only. */
const memoryHits = new Map<string, number[]>();

/** Cât de des se mătură contoarele vechi. Funcția `site_rate_sweep()` din
    migrație e gândită să fie chemată rar, din aplicație, ca să nu fie nevoie
    de un cron pentru trei rânduri. */
const SWEEP_CHANCE = 0.01;

/**
 * Fixed-window rate limit. Returns true when this call is over the limit.
 * Numărarea se face în baza de date, prin `site_rate_hit`: incrementează și
 * spune dacă s-a depășit, într-un singur apel, pentru că între o citire și o
 * scriere separate încap două cereri care trec amândouă.
 *
 * Cade DESCHIS (lasă cererea să treacă) dacă baza dă eroare. E o alegere
 * deliberată, moștenită de pe vremea Redis, nu o scăpare: o bază căzută nu are
 * voie să închidă auditul și formularele, iar limita de cheltuială a cheii
 * Anthropic e plasa de siguranță pentru singurul endpoint care costă bani.
 */
export async function isRateLimited(
  bucket: string,
  id: string,
  max: number,
  windowSeconds: number,
): Promise<boolean> {
  const db = supabaseFromEnv();
  if (db) {
    try {
      const { data, error } = await db.rpc("site_rate_hit", {
        p_bucket: bucket,
        p_ip: id,
        p_max: max,
        p_window_seconds: windowSeconds,
      });
      if (error) throw new Error(error.message);

      if (Math.random() < SWEEP_CHANCE) {
        /* Așteptat, nu „fire and forget": într-o funcție serverless procesul
           poate îngheța imediat după răspuns, iar o promisiune neașteptată
           n-ar ajunge niciodată la bază. Costă o cerere la o sută. */
        const { error: sweepError } = await db.rpc("site_rate_sweep");
        if (sweepError) console.error("[store] rate limit sweep failed:", sweepError.message);
      }

      return data === true;
    } catch (err) {
      console.error("[store] rate limit check failed, allowing:", err);
      return false;
    }
  }
  const key = `rl:${bucket}:${id}`;
  const now = Date.now();
  const recent = (memoryHits.get(key) ?? []).filter((t) => now - t < windowSeconds * 1000);
  recent.push(now);
  memoryHits.set(key, recent);
  return recent.length > max;
}
