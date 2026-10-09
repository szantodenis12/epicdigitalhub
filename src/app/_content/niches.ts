import type { Locale } from "../content";
import { roCities, type RoCity } from "./ro-cities";

/* ============================================================================
   /niches — the industry vs. niche taxonomy behind the exclusivity rule, and
   the availability board per city.

   DRAFT STATUSES. Every position here needs Roland's confirmation before it
   goes live, exactly as the handoff states. Brand names appear ONLY for
   currently active clients (DentalNet, Hotel Maxim, Origins, Agro Salso,
   KGM · Chery Oradea, Harmony Garden); archived ex-clients occupy nothing.

   Rules baked into the data:

   - A client occupies a NARROW niche, never a whole industry. Origins is a
     coffee shop, so "Cafenea" is taken and the rest of HoReCa stays open.
   - One board per city, and the rule applies per city, not per country —
     which is the entire reason this page has a city switcher.
   - Two clients reach past their own town, so they occupy in more than one
     board: Agro Salso sells machinery nationally, and Harmony Garden draws
     the whole county to Valea lui Mihai. Everything else is Oradea-only.

   The taxonomy is declared ONCE and each city is built from it with a map of
   overrides. Nine copies of thirty-five niches would be nine places to edit
   every time a niche is added, and eight of them would silently rot.
   ========================================================================= */

export type NicheStatus = "ocupat" | "in_discutie" | "liber";

export type Niche = {
  id: string;
  label: { en: string; ro: string };
  status: NicheStatus;
  /** Shown publicly next to "Taken" — active clients only. */
  brand?: string;
  note?: { en: string; ro: string };
};

export type Industry = {
  id: string;
  label: { en: string; ro: string };
  niches: Niche[];
};

export type CityBoard = {
  id: string;
  city: string;
  county: string;
  updated: string; // DD.MM.YYYY
  industries: Industry[];
};

const UPDATED = "07.10.2026";

/* ----------------------------------------------------------------------------
   THE TAXONOMY — 8 industries, 35 niches, everything open by default
   ------------------------------------------------------------------------- */

type NicheSeed = { id: string; en: string; ro: string };
type IndustrySeed = { id: string; en: string; ro: string; niches: NicheSeed[] };

const TAXONOMY: IndustrySeed[] = [
  {
    id: "horeca",
    en: "Hospitality & Food",
    ro: "HoReCa",
    niches: [
      { id: "cafenea", en: "Coffee shop / Specialty coffee", ro: "Cafenea / Cafea de specialitate" },
      { id: "hotel", en: "Hotel", ro: "Hotel" },
      { id: "restaurant", en: "Restaurant", ro: "Restaurant" },
      { id: "pub-bar", en: "Pub / Bar", ro: "Pub / Bar" },
      { id: "pensiune", en: "Guesthouse / Rural tourism", ro: "Pensiune / Turism rural" },
      { id: "catering", en: "Catering", ro: "Catering" },
      { id: "cofetarie", en: "Bakery / Patisserie", ro: "Cofetărie / Patiserie" },
    ],
  },
  {
    id: "medical",
    en: "Medical & Healthcare",
    ro: "Medical și sănătate",
    niches: [
      { id: "stomatologie", en: "Dental clinic", ro: "Stomatologie" },
      { id: "clinica-medicala", en: "Medical clinic", ro: "Clinică medicală" },
      { id: "optica", en: "Optics", ro: "Optică" },
      { id: "fizioterapie", en: "Physiotherapy / recovery", ro: "Fizioterapie / recuperare" },
      { id: "farmacie", en: "Pharmacy", ro: "Farmacie" },
    ],
  },
  {
    id: "auto",
    en: "Automotive & Mobility",
    ro: "Auto și moto",
    niches: [
      { id: "showroom-auto", en: "Car showroom / dealership", ro: "Showroom / dealer auto" },
      { id: "service-auto", en: "Car service", ro: "Service auto" },
      { id: "detailing-auto", en: "Car detailing", ro: "Detailing / cosmetică auto" },
      { id: "anvelope", en: "Tyres / tyre shop", ro: "Anvelope / vulcanizare" },
    ],
  },
  {
    id: "agro-industrie",
    en: "Agriculture & Industry",
    ro: "Agricultură și industrie",
    niches: [
      { id: "utilaje-agricole", en: "Agro machinery", ro: "Utilaje agricole" },
      { id: "constructii", en: "Construction", ro: "Construcții" },
      { id: "izolatii-termice", en: "Thermal insulation", ro: "Izolații termice" },
      { id: "amenajari-interioare", en: "Interior fit-out", ro: "Amenajări interioare" },
      { id: "mobila", en: "Furniture / manufacturing", ro: "Mobilă / producție" },
    ],
  },
  {
    id: "evenimente",
    en: "Events & Entertainment",
    ro: "Evenimente și divertisment",
    niches: [
      { id: "garden-evenimente", en: "Event venue / garden", ro: "Local de evenimente / garden" },
      { id: "sala-evenimente", en: "Private events hall", ro: "Sală de evenimente private" },
      { id: "foto-video-evenimente", en: "Event photo / video", ro: "Fotografie / video evenimente" },
    ],
  },
  {
    id: "servicii-profesionale",
    en: "Professional Services",
    ro: "Servicii profesionale",
    niches: [
      { id: "avocatura", en: "Law firm", ro: "Avocatură" },
      { id: "contabilitate", en: "Accounting", ro: "Contabilitate" },
      { id: "imobiliare", en: "Real estate", ro: "Imobiliare" },
      { id: "it-software", en: "Local IT / software", ro: "IT / software local" },
      { id: "educatie-privata", en: "Private education", ro: "Educație / școală privată" },
    ],
  },
  {
    id: "beauty-lifestyle",
    en: "Beauty & Lifestyle",
    ro: "Beauty și lifestyle",
    niches: [
      { id: "salon-infrumusetare", en: "Beauty salon", ro: "Salon de înfrumusețare" },
      { id: "fitness", en: "Gym", ro: "Sală de fitness" },
      { id: "barbershop", en: "Barbershop", ro: "Barbershop" },
      { id: "florarie", en: "Flower shop", ro: "Florărie" },
    ],
  },
  {
    id: "curatenie",
    en: "Cleaning & Maintenance",
    ro: "Curățenie și întreținere",
    niches: [
      { id: "curatatorie-haine", en: "Dry cleaning", ro: "Curățătorie haine" },
      { id: "curatare-incaltaminte", en: "Sneaker cleaning", ro: "Curățare încălțăminte" },
      { id: "detergenti", en: "Cleaning products", ro: "Detergenți / produse curățenie" },
    ],
  },
];

/* ----------------------------------------------------------------------------
   PER-CITY OVERRIDES
   ------------------------------------------------------------------------- */

type Override = { status: NicheStatus; brand?: string; note?: { en: string; ro: string } };

const toConfirm = { en: "to be confirmed", ro: "de confirmat" };

/** Nationwide: Agro Salso sells machinery across Romania. */
const NATIONAL: Record<string, Override> = {
  "utilaje-agricole": { status: "ocupat", brand: "Agro Salso" },
};

/** County-wide: Harmony Garden is in Valea lui Mihai and draws all of Bihor. */
const BIHOR: Record<string, Override> = {
  ...NATIONAL,
  "garden-evenimente": { status: "ocupat", brand: "Harmony Garden" },
};

/** Oradea is where six of the seven active clients hold their position. */
const ORADEA: Record<string, Override> = {
  ...BIHOR,
  cafenea: { status: "ocupat", brand: "Origins" },
  hotel: { status: "ocupat", brand: "Hotel Maxim" },
  stomatologie: { status: "ocupat", brand: "DentalNet" },
  "showroom-auto": { status: "ocupat", brand: "KGM · Chery Oradea" },
  "curatare-incaltaminte": { status: "in_discutie", note: toConfirm },
  detergenti: { status: "in_discutie", note: toConfirm },
};

/* Which overrides a city gets. The rule is positional, not a list of boards:
   every city in the country is on the picker, so hand-writing 320 boards was
   never an option — and would have rotted the moment a niche was added. */
const overridesFor = (city: RoCity): Record<string, Override> => {
  if (city.id === "oradea") return ORADEA;
  if (city.county === "Bihor") return BIHOR;
  return NATIONAL;
};

/** The board for one city, built from the taxonomy at call time. */
export function boardFor(cityId: string): CityBoard {
  const city = roCities.find((c) => c.id === cityId) ?? ORADEA_CITY;
  const overrides = overridesFor(city);
  return {
    id: city.id,
    city: city.city,
    county: city.county,
    updated: UPDATED,
    industries: TAXONOMY.map((ind) => ({
      id: ind.id,
      label: { en: ind.en, ro: ind.ro },
      niches: ind.niches.map((n) => ({
        id: n.id,
        label: { en: n.en, ro: n.ro },
        status: overrides[n.id]?.status ?? "liber",
        brand: overrides[n.id]?.brand,
        note: overrides[n.id]?.note,
      })),
    })),
  };
}

const ORADEA_CITY: RoCity = roCities.find((c) => c.id === "oradea")!;

export const DEFAULT_CITY_ID = "oradea";
export const defaultCity = boardFor(DEFAULT_CITY_ID);

/* ----------------------------------------------------------------------------
   COPY
   ------------------------------------------------------------------------- */

export type NichesCopy = {
  kicker: string;
  title: string;
  intro: string;
  heroSub: string;
  exampleKicker: string;
  industryOpen: string;
  how: { kicker: string; blocks: { title: string; body: string }[] };
  checker: {
    kicker: string;
    sub: string;
    cityLabel: string;
    searchPlaceholder: string;
    searchEmpty: string;
    counters: Record<NicheStatus, string>;
    statusLabel: Record<NicheStatus, string>;
    reserve: string;
    notListed: string;
    notListedCta: string;
    namesNote: string;
    updated: string;
    openOfTotal: string;
  };
  closing: { heading: string; cta: string; manifesto: string };
  meta: { title?: string; description: string };
};

const en: NichesCopy = {
  kicker: "The Niche Map",
  title: "We don't lock industries. We lock niches.",
  intro: "Exclusivity is specific. Here's how it works in Oradea.",
  heroSub:
    "Origins holds the coffee shop niche in Oradea. Not the entire hospitality industry. Restaurants, pubs and guesthouses remain eligible to work with us. Find your city. Check your niche. If it's available, the position could be yours.",
  exampleKicker: "The rule, on real examples",
  industryOpen: "the industry stays open",
  how: {
    kicker: "How exclusivity works",
    blocks: [
      {
        title: "Your niche, not your entire industry.",
        body: "We define niches by what a business actually does, not by broad industry labels. A coffee shop isn't the same as a restaurant. A hotel isn't the same as a guesthouse. Exclusivity applies to your specific market position.",
      },
      {
        title: "One niche. One city. One client.",
        body: "We partner with only one brand in each niche, in each city. While our partnership is active, we won't work with a direct local competitor. No exceptions. No competing offers.",
      },
      {
        title: "What if your niche is taken?",
        body: "You can join the waiting list or check availability in another city. Exclusivity is location-specific. A niche that's taken in Oradea may still be available in Cluj-Napoca, Timișoara or elsewhere.",
      },
      {
        title: "How to check availability",
        body: "Select your city and industry, or search for your niche directly. If it's available, you can apply immediately. If you can't find your niche, let us know and we'll review it.",
      },
    ],
  },
  checker: {
    kicker: "Find your niche",
    sub: "See which positions are taken, which are available and where your brand could fit.",
    cityLabel: "City",
    searchPlaceholder: "Search for your niche...",
    searchEmpty: "Nothing by that name on the list.",
    counters: { ocupat: "Taken", in_discutie: "In talks", liber: "Open" },
    statusLabel: { ocupat: "Taken", in_discutie: "In talks", liber: "Open" },
    reserve: "Claim the position",
    notListed: "Can't find your niche?",
    notListedCta: "Request a niche review",
    namesNote:
      "Client names are displayed only for active partnerships. Some exclusivity agreements extend beyond individual cities: agricultural machinery across Romania and event gardens throughout Bihor County.",
    updated: "Last updated",
    openOfTotal: "open / total",
  },
  closing: {
    heading: "Your market. Your position. If your niche is still available, let's discuss what we could build together.",
    cta: "Apply for your niche",
    manifesto: "Read our exclusivity manifesto",
  },
  meta: {
    title: "The Niche Map | Exclusive Marketing Partnerships | Epic Digital Hub",
    description:
      "Check which business niches are available in your city. Epic Digital Hub works with one brand per niche, per city. Find out if yours is open.",
  },
};

const ro: typeof en = {
  kicker: "Harta nișelor",
  title: "Strategia ta nu ajunge și la concurență.",
  intro:
    "Lucrăm cu un singur brand din fiecare nișă, în fiecare oraș. Asta înseamnă că, pe durata colaborării, nu preluăm proiecte pentru concurenții tăi direcți.",
  heroSub:
    "Colaborarea cu o cafenea din Oradea nu ne împiedică să lucrăm cu un restaurant, un pub sau o pensiune din același oraș. Exclusivitatea privește concurența directă, nu întregul domeniu HoReCa. Verifică dacă nișa ta este disponibilă.",
  exampleKicker: "Cum arată asta în practică?",
  industryOpen: "industria rămâne deschisă",
  how: {
    kicker: "Cum funcționează",
    blocks: [
      {
        title: "Definim nișa, nu doar industria.",
        body: "Nu tratăm toate afacerile dintr-un domeniu ca fiind concurente. O cafenea și un restaurant fac parte din HoReCa, dar nu concurează neapărat pentru aceiași clienți. Stabilim nișa în funcție de activitatea afacerii, oferta comercială și piața în care activează.",
      },
      {
        title: "Un singur brand. O singură nișă. Un singur oraș.",
        body: "În fiecare oraș, colaborăm cu un singur brand din aceeași nișă. Pe durata contractului, nu acceptăm proiecte de la concurenții săi direcți. Exclusivitatea nu este negociabilă, indiferent de bugetul oferit.",
      },
      {
        title: "Ce se întâmplă dacă nișa este ocupată?",
        body: "Te poți înscrie pe lista de așteptare. Dacă activezi într-un alt oraș, putem verifica separat disponibilitatea. Exclusivitatea este locală, cu excepția categoriilor pentru care stabilim o acoperire regională sau națională.",
      },
      {
        title: "Cum verifici disponibilitatea?",
        body: "Selectează orașul și domeniul de activitate sau caută direct nișa care te interesează. Dacă este disponibilă, poți trimite o solicitare. Dacă nu o găsești în listă, contactează-ne pentru verificare.",
      },
    ],
  },
  checker: {
    kicker: "Verifică disponibilitatea nișei tale",
    sub: "Alege orașul și domeniul de activitate sau caută direct nișa.",
    cityLabel: "Oraș",
    searchPlaceholder: "Ex.: restaurant, clinică veterinară, salon de înfrumusețare",
    searchEmpty: "Nimic cu numele ăsta în listă.",
    counters: { ocupat: "Ocupate", in_discutie: "În discuție", liber: "Libere" },
    statusLabel: { ocupat: "Ocupată", in_discutie: "În discuție", liber: "Disponibilă" },
    reserve: "Rezervă poziția",
    notListed: "Nu găsești nișa ta?",
    notListedCta: "Scrie-ne despre ea",
    namesNote:
      "Numele brandurilor sunt afișate doar pentru clienții activi. În cazul utilajelor agricole, exclusivitatea se aplică la nivel național, iar pentru categoria cluburilor de tip garden, la nivelul județului Bihor.",
    updated: "Situația din",
    openOfTotal: "Nișe disponibile / Total",
  },
  closing: {
    heading: "O singură poziție pentru fiecare nișă. Dacă nișa ta este disponibilă, putem discuta despre o colaborare.",
    cta: "Aplică pentru nișa ta",
    manifesto: "Citește manifestul nostru despre exclusivitate",
  },
  meta: {
    title: "Harta nișelor | Epic Digital Hub",
    description:
      "Verifică disponibilitatea nișei tale în orașul în care activezi. Epic Digital Hub colaborează cu un singur brand din fiecare nișă, oferind exclusivitate față de concurenții direcți.",
  },
};

export const nichesContent: Record<Locale, NichesCopy> = { en, ro };
