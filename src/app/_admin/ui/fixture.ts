/* ============================================================================
   FIXTURĂ DE DEZVOLTARE - date inventate, pentru dezvoltare și capturi.

   NU e folosită în producție. Pagina o cere numai când rulează `next dev` ȘI
   adresa are `?demo=1` (vezi src/app/admin/page.tsx); în build de producție
   ramura nici nu se poate atinge. Există pentru că baza locală are de obicei
   două lead-uri de test, iar un grafic cu două bare nu arată dacă desenul
   rezistă la nouăzeci.

   Două reguli pe care le respectă, și amândouă contează:

   1. E DETERMINISTĂ. Generatorul e un LCG cu sămânță fixă, nu `Math.random`.
      Fixtura e produsă pe server și trimisă ca props, dar o valoare aleatoare
      ar face ca două randări ale aceleiași pagini (sau o re-randare la
      hidratare) să nu mai coincidă, iar diferența s-ar citi ca o eroare de
      hidratare într-un ecran de dezvoltare.

   2. E CONSISTENTĂ CU SINE. Totalurile sunt SUMATE din serie, nu scrise
      separat, iar `recent` e construit din aceleași zile. O fixtură în care
      cardul spune 412 și graficul însumează 380 ar face imposibil de văzut
      exact lucrul pentru care se uită cineva la ea: dacă graficul minte.
   ========================================================================= */

import type { AdminData, Lead, LeadKind, SeriesPoint, Slice, Totals } from "../types";

/** LCG (numeric recipes). Nu are nevoie de calități statistice - are nevoie
    să dea mereu aceeași secvență. */
function rng(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1_664_525 + 1_013_904_223) >>> 0;
    return state / 4_294_967_296;
  };
}

const NAMES = [
  "Andrei Pop", "Ioana Mureșan", "Vlad Chiriac", "Raluca Barbu", "Cristian Lazăr",
  "Alexandra Stan", "Mihai Ardelean", "Diana Cîmpean", "Sergiu Bodea", "Elena Tătar",
  "Bogdan Nicoară", "Carmen Pașca", "Radu Someșan", "Larisa Covaci", "Dorin Ghiță",
  "Simona Hodiș", "Paul Bejan", "Anca Trifan", "Ovidiu Marcu", "Teodora Rus",
];

const CITIES = ["Oradea", "Cluj-Napoca", "Timișoara", "Arad", "Satu Mare", "Salonta", "Beiuș", "București"];

const NICHES = [
  "stomatologie", "dealer auto", "cafenea", "hotel", "agricultură",
  "construcții", "sală de fitness", "imobiliare",
];

const BUDGETS = [
  "1.000 - 2.500 €/lună",
  "sub 1.000 €/lună",
  "2.500 - 5.000 €/lună",
  "peste 5.000 €/lună",
  "nespecificat",
];

const DOMAINS = [
  "cabinet-dentar-oradea.ro", "autohaus-bihor.ro", "cafeneaua-centrala.ro",
  "pensiunea-apuseni.ro", "agro-crisana.ro", "termo-construct.ro",
  "fitzone-oradea.ro", "imobil-nord.ro",
];

const PAGES = ["/", "/ro", "/ro/servicii", "/services", "/ro/case-studies", "/ro/niches", "/audit"];

const KINDS: LeadKind[] = ["contact", "audit", "apply"];

/** Ziua `i` zile în urmă, ca AAAA-LL-ZZ. Ancorată la ora 12:00 UTC, exact cum
    face data.ts, ca o trecere la ora de vară să nu sară sau să repete o zi. */
function dayBack(anchor: number, i: number): string {
  return new Date(anchor - i * 86_400_000).toISOString().slice(0, 10);
}

export function buildFixtureAdminData(now = new Date()): AdminData {
  const random = rng(20_261_126);
  const anchor = Date.parse(`${now.toISOString().slice(0, 10)}T12:00:00Z`);

  /* Serie cu două lucruri care se văd: ritm săptămânal (sâmbăta și duminica
     aproape nimic) și o creștere lentă spre prezent, ca să aibă ce arăta
     comparația dintre cele două perioade de 30 de zile. */
  const series: SeriesPoint[] = [];
  for (let i = 89; i >= 0; i--) {
    const date = dayBack(anchor, i);
    const weekday = new Date(`${date}T12:00:00Z`).getUTCDay();
    const weekend = weekday === 0 || weekday === 6;
    const trend = 0.55 + (89 - i) / 120;
    const scale = weekend ? 0.18 : 1;
    const draw = (peak: number) => Math.round(random() * peak * trend * scale);
    series.push({
      date,
      contact: draw(2.6),
      audit: draw(4.2),
      apply: draw(1.9),
    });
  }

  const sum = (from: number, until: number): Totals => {
    const t: Totals = { all: 0, contact: 0, audit: 0, apply: 0 };
    for (const point of series.slice(from, until)) {
      t.contact += point.contact;
      t.audit += point.audit;
      t.apply += point.apply;
      t.all += point.contact + point.audit + point.apply;
    }
    return t;
  };

  const last30 = sum(60, 90);
  const prev30 = sum(30, 60);
  const inSeries = sum(0, 90);

  /* Lead-uri mai vechi de 90 de zile: totalul de pe carduri e "de la început",
     deci trebuie să fie mai mare decât suma graficului - altfel nu s-ar vedea
     niciodată dacă cardul arată totalul sau fereastra. */
  const older: Totals = { all: 143, contact: 38, audit: 79, apply: 26 };
  const totals: Totals = {
    all: inSeries.all + older.all,
    contact: inSeries.contact + older.contact,
    audit: inSeries.audit + older.audit,
    apply: inSeries.apply + older.apply,
  };

  /* `recent`: ultimele 50, construite mergând înapoi prin serie și emițând
     exact atâtea lead-uri pe zi câte are ziua. Așa lista și graficul spun
     același lucru despre ultimele zile. */
  const recent: Lead[] = [];
  let seq = 0;
  for (let i = series.length - 1; i >= 0 && recent.length < 50; i--) {
    const point = series[i];
    for (const kind of KINDS) {
      for (let k = 0; k < point[kind] && recent.length < 50; k++) {
        /* Ora, plafonata la "acum". Fara plafon, ziua de azi primea ore
           din tot programul (8-20), deci la o captura facuta dimineata
           jumatate din lead-uri erau datate in viitor si fluxul scria
           "peste 10 ore" - o fixtura care arata un bug inexistent. */
        const dayStart = Date.parse(`${point.date}T00:00:00Z`);
        const until = Math.min(dayStart + 20 * 3_600_000, now.getTime());
        const from = Math.min(dayStart + 8 * 3_600_000, until - 60_000);
        const createdAt = new Date(from + random() * (until - from)).toISOString();
        const name = NAMES[seq % NAMES.length];
        const slug = name.toLowerCase().replace(/[^a-z]+/g, ".");
        const locale = random() < 0.78 ? "ro" : "en";
        const base = { id: `fix-${seq}`, createdAt, kind, name, locale };
        if (kind === "contact") {
          recent.push({ ...base, email: `${slug}@gmail.com`, page: PAGES[seq % PAGES.length] });
        } else if (kind === "audit") {
          recent.push({
            ...base,
            email: `${slug}@${DOMAINS[seq % DOMAINS.length]}`,
            url: `https://${DOMAINS[seq % DOMAINS.length]}`,
          });
        } else {
          recent.push({
            ...base,
            /* Aplicațiile NU au email - /api/apply nu îl cere. Fixtura
               păstrează lipsa, pentru că exact ea trebuie să arate bine în
               tabel. */
            email: "",
            business: `${NICHES[seq % NICHES.length]} ${CITIES[seq % CITIES.length]}`,
            city: CITIES[seq % CITIES.length],
            niche: NICHES[seq % NICHES.length],
            website: seq % 3 === 0 ? `https://${DOMAINS[seq % DOMAINS.length]}` : "",
            goal: "mai multe cereri de ofertă",
            budget: BUDGETS[seq % BUDGETS.length],
            status: seq % 7 === 0 ? "niche-taken" : "received",
          });
        }
        seq++;
      }
    }
  }
  recent.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  /* Topurile: distribuții descrescătoare plauzibile, nu numărate din `recent`
     (care are doar 50 de rânduri), pentru că panoul le arată pe tot istoricul. */
  const top = (labels: string[], head: number, step: number): Slice[] =>
    labels.map((label, i) => ({ label, value: Math.max(1, head - i * step) })).slice(0, 8);

  return {
    totals,
    last30,
    prev30,
    series,
    byLocale: [
      { label: "ro", value: Math.round(totals.all * 0.79) },
      { label: "en", value: totals.all - Math.round(totals.all * 0.79) },
    ],
    topNiches: top(NICHES, 31, 4),
    topCities: top(CITIES, 44, 6),
    budgets: top(BUDGETS, 38, 8),
    topAuditDomains: top(DOMAINS, 12, 1),
    recent,
    nicheTaken: Math.round(totals.apply * 0.17),
    storageOk: true,
  };
}
