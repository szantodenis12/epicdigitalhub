/* ============================================================================
   Vizitatorii site-ului, citiți din API-ul Vercel Web Analytics.

   Cifrele există deja în Vercel; le aducem aici ca panoul să fie singurul loc
   unde te uiți. Aceeași disciplină ca la meta-capi: fără token funcția nu face
   nimic (configured:false), iar o eroare de la Vercel se loghează și nu
   strică panoul (ok:false) - /admin se randează oricum.

   CACHE. Fiecare încărcare a panoului ar însemna 7 apeluri către Vercel, iar
   cifrele se mișcă încet. Folosim `unstable_cache` (10 minute) și NU `use
   cache`: în Next 16 documentația îl marchează ca înlocuit, dar `use cache`
   cere `cacheComponents: true`, adică o schimbare a randării întregului site,
   care nu e treaba acestui fișier. `unstable_cache` merge fără ea. Funcția
   din cache ARUNCĂ la eroare, iar cine o cheamă prinde: un răspuns eșuat nu
   se salvează, deci o întrerupere de un minut la Vercel nu ține panoul gol
   10 minute.
   ========================================================================= */

import "server-only";
import { unstable_cache } from "next/cache";
import {
  EMPTY_VISITOR_DATA,
  type VisitorData,
  type VisitorPoint,
  type VisitorSlice,
  type VisitorTotals,
} from "./types";

const API = "https://api.vercel.com/v1/query/web-analytics/visits";
const DAYS = 30;
const TOP_N = 8;
/** Maximul acceptat de API pentru `limit`. */
const MAX_LIMIT = 100;
const DAY_MS = 86_400_000;
/* Scurt intenționat: /admin îl așteaptă înainte să randeze, iar eșecurile nu
   se cachează. Dacă Vercel tace, panoul trebuie să se deschidă oricum repede,
   cu secțiunea de trafic goală - nu să stea după el la fiecare încărcare. */
const TIMEOUT_MS = 4000;

/** Fără token sau fără proiect nu avem ce interoga. */
export function visitorsConfigured(): boolean {
  return Boolean(
    process.env.VERCEL_ANALYTICS_TOKEN && process.env.VERCEL_ANALYTICS_PROJECT_ID,
  );
}

type Range = { since: number; until: number };

/* Intervalele se dau în milisecunde UTC, nu ca date: un șir „2026-11-27" poate
   fi citit de API în alt fus sau ca început de zi pentru `until`, iar atunci
   ultima zi ar lipsi sau s-ar dubla. Fiecare interval începe la 00:00 UTC și
   se termină cu o milisecundă înainte de începutul următorului, deci cele două
   perioade se ating fără să se suprapună și fără gol. Ziua curentă (parțială)
   intră în ultimele 30. */
function ranges(now = Date.now()): { last: Range; prev: Range; first: number } {
  const today = Math.floor(now / DAY_MS) * DAY_MS;
  const lastStart = today - (DAYS - 1) * DAY_MS;
  const prevStart = lastStart - DAYS * DAY_MS;
  return {
    last: { since: lastStart, until: today + DAY_MS - 1 },
    prev: { since: prevStart, until: lastStart - 1 },
    first: lastStart,
  };
}

async function call(path: string, params: Record<string, string | number>): Promise<unknown> {
  const url = new URL(`${API}/${path}`);
  url.searchParams.set("projectId", process.env.VERCEL_ANALYTICS_PROJECT_ID!);
  const team = process.env.VERCEL_ANALYTICS_TEAM_ID;
  if (team) url.searchParams.set("teamId", team);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.VERCEL_ANALYTICS_TOKEN}` },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    cache: "no-store", // cache-ul e la nivelul rezultatului, nu al fiecărui fetch
  });
  if (!res.ok) throw new Error(`${res.status}: ${(await res.text()).slice(0, 300)}`);
  const body = (await res.json()) as { data?: unknown };
  if (body?.data == null) throw new Error("răspuns fără `data`");
  return body.data;
}

const num = (v: unknown): number => {
  if (typeof v !== "number" || !Number.isFinite(v)) throw new Error("număr invalid în răspuns");
  return v;
};

async function totals(r: Range): Promise<VisitorTotals> {
  const d = (await call("count", r)) as Record<string, unknown>;
  return { pageviews: num(d.pageviews), visitors: num(d.visitors) };
}

async function rows(by: string, r: Range, limit?: number): Promise<Record<string, unknown>[]> {
  const d = await call("aggregate", { by, ...r, ...(limit ? { limit } : {}) });
  if (!Array.isArray(d)) throw new Error("`data` nu e listă");
  return d as Record<string, unknown>[];
}

async function top(dimension: string, r: Range): Promise<VisitorSlice[]> {
  const out: VisitorSlice[] = [];
  for (const row of await rows(dimension, r, TOP_N)) {
    const raw = row[dimension];
    /* „Others" e restul peste limită, nu o valoare reală: într-un top ar
       arăta ca o pagină sau o țară cu numele ăsta. */
    if (raw === "Others") continue;
    /* Referrer gol = a scris adresa direct sau a venit dintr-o aplicație. */
    const label = typeof raw === "string" && raw ? raw : "Direct";
    out.push({ label, pageviews: num(row.pageviews), visitors: num(row.visitors) });
  }
  return out;
}

/** Zilele lipsă din răspuns apar cu zero, ca graficul să nu sară peste ele. */
async function series(r: Range, first: number): Promise<VisitorPoint[]> {
  const byDay = new Map<string, VisitorTotals>();
  /* `limit` TREBUIE dat: implicitul API-ului e 10, iar restul zilelor ar veni
     strânse într-un rând „Others" pe care oricum îl aruncăm - adică un grafic
     de 30 de zile cu 10 zile în el. Cerem maximul, nu 30: dacă Vercel taie
     zilele în alt fus decât UTC, intervalul nostru poate atinge 31 de borne. */
  for (const row of await rows("day", r, MAX_LIMIT)) {
    if (typeof row.timestamp !== "string") throw new Error("rând fără timestamp");
    const t = Date.parse(row.timestamp);
    if (Number.isNaN(t)) throw new Error("timestamp invalid");
    byDay.set(new Date(t).toISOString().slice(0, 10), {
      pageviews: num(row.pageviews),
      visitors: num(row.visitors),
    });
  }
  return Array.from({ length: DAYS }, (_, i) => {
    const date = new Date(first + i * DAY_MS).toISOString().slice(0, 10);
    return { date, ...(byDay.get(date) ?? { pageviews: 0, visitors: 0 }) };
  });
}

/* Cheia include doar numele: intervalele se calculează înăuntru, iar
   `revalidate` limitează oricum cât de veche poate fi o cifră. */
const load = unstable_cache(
  async (): Promise<Omit<VisitorData, "configured" | "ok">> => {
    const { last, prev, first } = ranges();
    const [last30, prev30, s, topPages, topReferrers, topCountries, devices] = await Promise.all([
      totals(last),
      totals(prev),
      series(last, first),
      top("requestPath", last),
      top("referrerHostname", last),
      top("country", last),
      top("deviceType", last),
    ]);
    return { last30, prev30, series: s, topPages, topReferrers, topCountries, devices };
  },
  ["admin-visitors"],
  { revalidate: 600 },
);

/** Nu aruncă niciodată: panoul trebuie să se randeze și fără cifre. */
export async function getVisitorData(): Promise<VisitorData> {
  if (!visitorsConfigured()) return EMPTY_VISITOR_DATA;
  try {
    return { configured: true, ok: true, ...(await load()) };
  } catch (e) {
    console.error("[visitors] Vercel Analytics a eșuat:", e instanceof Error ? e.message : e);
    return { ...EMPTY_VISITOR_DATA, configured: true };
  }
}
