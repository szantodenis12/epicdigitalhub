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
    en: "HoReCa",
    ro: "HoReCa",
    niches: [
      { id: "cafenea", en: "Coffee shop / specialty coffee", ro: "Cafenea / specialty coffee" },
      { id: "hotel", en: "Hotel", ro: "Hotel" },
      { id: "restaurant", en: "Restaurant", ro: "Restaurant" },
      { id: "pub-bar", en: "Pub / bar", ro: "Pub / bar" },
      { id: "pensiune", en: "Guesthouse / rural tourism", ro: "Pensiune / turism rural" },
      { id: "catering", en: "Catering", ro: "Catering" },
      { id: "cofetarie", en: "Pastry / confectionery", ro: "Cofetărie / patiserie" },
    ],
  },
  {
    id: "medical",
    en: "Medical & health",
    ro: "Medical & sănătate",
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
    en: "Auto & moto",
    ro: "Auto & moto",
    niches: [
      { id: "showroom-auto", en: "Car showroom / dealership", ro: "Showroom / dealer auto" },
      { id: "service-auto", en: "Car service", ro: "Service auto" },
      { id: "detailing-auto", en: "Car detailing", ro: "Detailing / cosmetică auto" },
      { id: "anvelope", en: "Tyres / tyre shop", ro: "Anvelope / vulcanizare" },
    ],
  },
  {
    id: "agro-industrie",
    en: "Agro & industry",
    ro: "Agro & industrie",
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
    en: "Events & entertainment",
    ro: "Evenimente & entertainment",
    niches: [
      { id: "garden-evenimente", en: "Event venue / garden", ro: "Local de evenimente / garden" },
      { id: "sala-evenimente", en: "Private events hall", ro: "Sală de evenimente private" },
      { id: "foto-video-evenimente", en: "Event photo / video", ro: "Fotografie / video evenimente" },
    ],
  },
  {
    id: "servicii-profesionale",
    en: "Professional services",
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
    en: "Beauty & lifestyle",
    ro: "Beauty & lifestyle",
    niches: [
      { id: "salon-infrumusetare", en: "Beauty salon", ro: "Salon de înfrumusețare" },
      { id: "fitness", en: "Gym", ro: "Sală de fitness" },
      { id: "barbershop", en: "Barbershop", ro: "Barbershop" },
      { id: "florarie", en: "Flower shop", ro: "Florărie" },
    ],
  },
  {
    id: "curatenie",
    en: "Cleaning & maintenance",
    ro: "Curățenie & întreținere",
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
  meta: { description: string };
};

const en: NichesCopy = {
  kicker: "The niche map",
  title: "We don't lock industries. We lock niches.",
  intro:
    "Origins is a coffee shop. That takes the coffee shop position in Oradea, nothing more. A restaurant, a pub or a guesthouse can still sign.",
  heroSub: "Pick your city, find your niche, see whether the position is still open.",
  exampleKicker: "The rule, on real examples",
  industryOpen: "the industry stays open",
  how: {
    kicker: "How it works",
    blocks: [
      {
        title: "What counts as a niche",
        body: "A niche is exactly what you do, not the field you operate in. Coffee shop does not mean HoReCa. Hotel Maxim holds the hotel position, not the city's entire tourism. The sharper the position, the more your exclusivity is worth.",
      },
      {
        title: "One niche, one city, one brand",
        body: "In every city we sign a single brand per niche. While we work together, your direct competitor does not get in. Not at double the price either.",
      },
      {
        title: "When the niche is taken",
        body: "Two options: you join the waiting list, or, if you are in another city, your position is most likely still open. The rule applies per city, not per country.",
      },
      {
        title: "How you check",
        body: "Pick your city, then an industry, or search your niche directly. If it is open, you apply on the spot. If it is not on the list, tell us and we add it.",
      },
    ],
  },
  checker: {
    kicker: "Check your niche",
    sub: "Pick a city and an industry to see where every niche stands, or search yours directly.",
    cityLabel: "City",
    searchPlaceholder: "Search your niche (barbershop, car service, law firm...)",
    searchEmpty: "Nothing by that name on the list.",
    counters: { ocupat: "Taken", in_discutie: "In talks", liber: "Open" },
    statusLabel: { ocupat: "Taken", in_discutie: "In talks", liber: "Open" },
    reserve: "Claim the position",
    notListed: "Your niche is not on the list?",
    notListedCta: "Tell us about it",
    namesNote:
      "Brand names appear only for active clients. Two positions reach beyond their own town: agro machinery is held nationally, and the event garden across Bihor.",
    updated: "Updated",
    openOfTotal: "open / total",
  },
  closing: {
    heading: "One position per niche. If yours is open, we can talk this week.",
    cta: "Apply for your niche",
    manifesto: "Read the manifesto: one brand per niche",
  },
  meta: {
    description:
      "The niche map: which positions are taken and which are open, city by city. We lock niches, not industries — one brand per niche, per city.",
  },
};

const ro: typeof en = {
  kicker: "Harta nișelor",
  title: "Nu blocăm industrii. Blocăm nișe.",
  intro:
    "Origins e cafenea. Asta ocupă poziția de cafenea în Oradea, atât. Un restaurant, un pub sau o pensiune poate semna oricând.",
  heroSub: "Alege orașul, caută nișa ta și vezi dacă poziția e încă liberă.",
  exampleKicker: "Regula, pe exemple reale",
  industryOpen: "industria rămâne deschisă",
  how: {
    kicker: "Cum funcționează",
    blocks: [
      {
        title: "Ce înseamnă o nișă",
        body: "Nișa e exact ce faci tu, nu domeniul în care activezi. Cafenea nu înseamnă HoReCa. Hotel Maxim ocupă poziția de hotel, nu tot turismul din oraș. Cu cât poziția e definită mai precis, cu atât exclusivitatea ta valorează mai mult.",
      },
      {
        title: "O nișă, un oraș, un brand",
        body: "În fiecare oraș semnăm un singur brand pe nișă. Cât timp lucrăm împreună, concurentul tău direct nu intră. Nici la preț dublu.",
      },
      {
        title: "Când nișa e luată",
        body: "Ai două variante: intri pe lista de așteptare sau, dacă ești în alt oraș, poziția ta e cel mai probabil liberă. Regula se aplică pe oraș, nu pe țară.",
      },
      {
        title: "Cum verifici",
        body: "Alege orașul, apoi industria, sau caută direct nișa ta. Dacă e liberă, aplici pe loc. Dacă nu apare în listă, scrie-ne și o adăugăm.",
      },
    ],
  },
  checker: {
    kicker: "Verifică nișa ta",
    sub: "Alege orașul și industria ca să vezi statusul fiecărei nișe, sau caut-o direct pe a ta.",
    cityLabel: "Oraș",
    searchPlaceholder: "Caută nișa ta (barbershop, service auto, avocatură...)",
    searchEmpty: "Nimic cu numele ăsta în listă.",
    counters: { ocupat: "Ocupate", in_discutie: "În discuție", liber: "Libere" },
    statusLabel: { ocupat: "Ocupat", in_discutie: "În discuție", liber: "Liber" },
    reserve: "Rezervă poziția",
    notListed: "Nișa ta nu e în listă?",
    notListedCta: "Scrie-ne despre ea",
    namesNote:
      "Numele de brand apar doar la clienții activi. Două poziții trec dincolo de orașul lor: utilajele agricole sunt ocupate la nivel național, iar gardenul de evenimente în tot Bihorul.",
    updated: "Actualizat",
    openOfTotal: "libere / total",
  },
  closing: {
    heading: "O singură poziție pe nișă. Dacă a ta e liberă, putem vorbi săptămâna asta.",
    cta: "Aplică pentru nișa ta",
    manifesto: "Citește manifestul: un singur brand pe nișă",
  },
  meta: {
    description:
      "Harta nișelor: ce poziții sunt ocupate și care sunt libere, oraș cu oraș. Blocăm nișe, nu industrii — un singur brand pe nișă, pe oraș.",
  },
};

export const nichesContent: Record<Locale, NichesCopy> = { en, ro };
