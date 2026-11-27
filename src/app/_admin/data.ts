/* ============================================================================
   Agregarea pentru panou: din cele trei liste din store, un singur AdminData.

   Se cheamă o dată, pe server, la randarea paginii. Toate calculele sunt în
   memorie, pe listele întregi, nu prin interogări - sunt sute de înregistrări,
   nu milioane, iar o citire pe lună e mai ieftină decât trei agregări în
   Postgres plus codul care le ține sincronizate cu graficul. Dacă vreodată
   devin zeci de mii, aici se pune o limită, nu în store.

   Fișierul nu are "server-only" pentru că pachetul nu e folosit nicăieri în
   proiect; e importat exclusiv din componente de server (src/app/admin).
   ========================================================================= */

import { readRecords, type RecordKind } from "../_server/store";
import {
  EMPTY_ADMIN_DATA,
  type AdminData,
  type Lead,
  type LeadKind,
  type SeriesPoint,
  type Slice,
  type Totals,
} from "./types";

/* Câte zile arată graficul și cât ține o "lună" în comparația celor două
   perioade. Separate, ca schimbarea graficului să nu miște totalurile. */
const SERIES_DAYS = 90;
const PERIOD_DAYS = 30;
/** Cât de lungi sunt listele de top. Mai mult nu încape pe ecran oricum. */
const TOP_N = 8;
/** Câte lead-uri intră în lista "cele mai noi". */
const RECENT_N = 50;

/* Ziua se socotește după ceasul din Oradea, nu după UTC: un lead venit la
   01:00 noaptea e al zilei în care omul l-a trimis, nu al celei dinainte, și
   altfel graficul nu s-ar potrivi cu ce-și amintește cine l-a primit.
   "en-CA" dă exact AAAA-LL-ZZ, formatul cheilor din serie. */
const dayFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Bucharest",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const dayKey = (date: Date) => dayFormatter.format(date);

const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");

/* ---------------------------------------------------------------------------
   Normalizarea. Fiecare formular salvează alte câmpuri (vezi rutele din
   src/app/api), așa că traducerea lor în `Lead` se face o singură dată, aici,
   iar restul fișierului nu mai știe din ce rută a venit ce.
   ------------------------------------------------------------------------ */

/** Comun celor trei. `createdAt` ajunge "" dacă lipsește sau nu se parsează:
    lead-ul se numără în totaluri, dar nu intră în nicio zi din grafic - e mai
    cinstit decât să-l pună într-o zi inventată. */
function base(raw: Record<string, unknown>, kind: LeadKind): Lead {
  const createdAt = str(raw.createdAt);
  return {
    id: str(raw.id),
    createdAt: Number.isNaN(Date.parse(createdAt)) ? "" : createdAt,
    kind,
    name: str(raw.name),
    email: str(raw.email),
    locale: str(raw.locale),
  };
}

function fromContact(raw: Record<string, unknown>): Lead {
  return { ...base(raw, "contact"), page: str(raw.page) };
}

function fromAudit(raw: Record<string, unknown>): Lead {
  return { ...base(raw, "audit"), url: str(raw.url) };
}

/* Atenție: email-ul și telefonul au fost adăugate formularului de aplicație
   mai târziu, deci aplicațiile vechi nu le au. Rămân "", iar panoul trebuie să
   afișeze gol, nu "undefined". Telefonul e opțional și pentru cele noi. */
function fromApplication(raw: Record<string, unknown>): Lead {
  return {
    ...base(raw, "apply"),
    phone: str(raw.phone),
    business: str(raw.business),
    city: str(raw.city),
    niche: str(raw.niche),
    website: str(raw.website),
    goal: str(raw.goal),
    budget: str(raw.budget),
    status: str(raw.status),
  };
}

/* ---------------------------------------------------------------------------
   Numărători
   ------------------------------------------------------------------------ */

function totalsOf(leads: Lead[]): Totals {
  const totals: Totals = { all: 0, contact: 0, audit: 0, apply: 0 };
  for (const lead of leads) {
    totals.all += 1;
    totals[lead.kind] += 1;
  }
  return totals;
}

/** Feliile unui câmp, cele mai multe primele. La egalitate, alfabetic, ca două
    randări ale aceloraşi date să nu dea două ordini diferite. */
function slices(values: string[], limit = TOP_N): Slice[] {
  const counts = new Map<string, number>();
  for (const value of values) {
    if (!value) continue;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label, "ro"))
    .slice(0, limit);
}

/** Domeniul site-ului auditat. Fără schemă, fără www, fără cale: altfel
    "https://x.ro/" și "x.ro" ar fi două rânduri diferite în același top. */
function hostOf(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "";
  }
}

/** Zilele ultimelor SERIES_DAYS, cronologic, inclusiv azi.
    Ancora e ora 12:00 UTC a zilei de azi (după ceasul din Oradea): la amiază,
    data UTC și cea locală coincid, deci scăderea de câte 24h nu sare și nu
    repetă o zi când se schimbă ora de vară. */
function emptySeries(now: Date): SeriesPoint[] {
  const anchor = Date.parse(`${dayKey(now)}T12:00:00Z`);
  const days: SeriesPoint[] = [];
  for (let i = SERIES_DAYS - 1; i >= 0; i--) {
    const date = new Date(anchor - i * 86_400_000).toISOString().slice(0, 10);
    days.push({ date, contact: 0, audit: 0, apply: 0 });
  }
  return days;
}

/* ---------------------------------------------------------------------------
   Punctul de intrare
   ------------------------------------------------------------------------ */

export async function getAdminData(): Promise<AdminData> {
  const kinds: [RecordKind, (raw: Record<string, unknown>) => Lead][] = [
    ["contact-leads", fromContact],
    ["audit-leads", fromAudit],
    ["applications", fromApplication],
  ];

  const reads = await Promise.all(kinds.map(([kind]) => readRecords(kind)));

  /* storageOk răspunde la o singură întrebare: are panoul de unde citi? Dacă
     nici una din cele trei liste nu a putut fi citită (Supabase neconfigurat
     sau picat și niciun fișier local), zerourile de mai jos nu înseamnă "n-au
     venit lead-uri", ci "panoul e orb" - și trebuie spus, nu desenat ca grafic
     gol. O listă citită, chiar goală, e de ajuns: stocarea există.

     Se uită la `source`, nu la numărul de înregistrări, și de-asta a ieșit la
     iveală că baza Upstash fusese ștearsă: o citire picată dă "none", iar una
     reușită peste un tabel gol dă "supabase". Zerourile sunt identice, cauza
     nu. Verificarea rămâne pe `!== "none"`, deci nu-i pasă cum se numește
     stocarea de dedesubt. */
  const storageOk = reads.some((read) => read.source !== "none");
  if (!storageOk) return { ...EMPTY_ADMIN_DATA, series: emptySeries(new Date()) };

  const leads: Lead[] = reads.flatMap((read, index) => read.records.map(kinds[index][1]));
  const applications = leads.filter((lead) => lead.kind === "apply");
  const audits = leads.filter((lead) => lead.kind === "audit");

  const now = new Date();
  const periodMs = PERIOD_DAYS * 86_400_000;
  const since30 = now.getTime() - periodMs;
  const since60 = now.getTime() - 2 * periodMs;

  const inWindow = (lead: Lead, from: number, until: number) => {
    const at = Date.parse(lead.createdAt);
    return !Number.isNaN(at) && at >= from && at < until;
  };

  const series = emptySeries(now);
  const byDate = new Map(series.map((point) => [point.date, point]));
  for (const lead of leads) {
    const at = Date.parse(lead.createdAt);
    if (Number.isNaN(at)) continue;
    const point = byDate.get(dayKey(new Date(at)));
    if (point) point[lead.kind] += 1; // mai vechi de 90 de zile: nu e în grafic
  }

  return {
    totals: totalsOf(leads),
    last30: totalsOf(leads.filter((lead) => inWindow(lead, since30, Infinity))),
    prev30: totalsOf(leads.filter((lead) => inWindow(lead, since60, since30))),
    series,
    byLocale: slices(leads.map((lead) => lead.locale)),
    topNiches: slices(applications.map((lead) => lead.niche ?? "")),
    topCities: slices(applications.map((lead) => lead.city ?? "")),
    /* Bugetul e câmp liber și opțional în formular, deci "nespecificat" e un
       răspuns în sine - și de obicei cel mai frecvent. */
    budgets: slices(applications.map((lead) => lead.budget || "nespecificat")),
    topAuditDomains: slices(audits.map((lead) => hostOf(lead.url ?? ""))),
    /* Sortarea e pe șirul ISO direct: toate vin din `new Date().toISOString()`,
       deci ordinea lexicografică e ordinea cronologică. "" ajunge la coadă. */
    recent: [...leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, RECENT_N),
    nicheTaken: applications.filter((lead) => lead.status === "niche-taken").length,
    storageOk,
  };
}
