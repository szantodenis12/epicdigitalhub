/* Contractul dintre partea de server a panoului și interfața lui.

   Există ca fișier separat, scris înaintea celorlalte două, pentru că panoul a
   fost construit în paralel: cine citește din baza de date și cine desenează graficele
   trebuie să fie de acord asupra formei datelor fără să se aștepte unul pe
   celălalt. Orice schimbare aici le atinge pe amândouă. */

export type LeadKind = "contact" | "audit" | "apply";

export const LEAD_LABEL: Record<LeadKind, string> = {
  contact: "Contact",
  audit: "Audit",
  apply: "Aplicație",
};

/* Un lead, indiferent din ce formular vine.

   Câmpurile comune sunt obligatorii, restul sunt ale unui singur formular -
   `url` doar la audit, `niche`/`city`/`budget` doar la aplicații. Un singur tip
   în loc de trei pentru că tot panoul le arată amestecate, în aceeași listă și
   în aceleași totaluri; un tip per formular ar însemna un `switch` la fiecare
   rând desenat. */
export type Lead = {
  id: string;
  createdAt: string;
  kind: LeadKind;
  name: string;
  email: string;
  /** Doar formularul de aplicație îl cere, și acolo e opțional. */
  phone?: string;
  locale: string;
  /** contact: pagina de pe care a scris */
  page?: string;
  /** audit: site-ul analizat */
  url?: string;
  /** aplicații */
  business?: string;
  city?: string;
  niche?: string;
  website?: string;
  goal?: string;
  budget?: string;
  /** aplicații: `received` sau `niche-taken` */
  status?: string;
};

export type Totals = { all: number; contact: number; audit: number; apply: number };

/** O zi din grafic. Zilele fără lead-uri sunt prezente, cu zero. */
export type SeriesPoint = { date: string; contact: number; audit: number; apply: number };

export type Slice = { label: string; value: number };

export type AdminData = {
  /** De la început. */
  totals: Totals;
  /** Ultimele 30 de zile și cele 30 dinainte, ca să se poată arăta diferența. */
  last30: Totals;
  prev30: Totals;
  /** Zilnic, ultimele 90 de zile, cronologic. */
  series: SeriesPoint[];
  byLocale: Slice[];
  topNiches: Slice[];
  topCities: Slice[];
  budgets: Slice[];
  topAuditDomains: Slice[];
  /** Cele mai noi, pentru listă. */
  recent: Lead[];
  /** Aplicații respinse pentru că nișa era ocupată. */
  nicheTaken: number;
  /** false când baza de date nu e configurată: panoul arată asta în loc de zerouri. */
  storageOk: boolean;
};

export const EMPTY_ADMIN_DATA: AdminData = {
  totals: { all: 0, contact: 0, audit: 0, apply: 0 },
  last30: { all: 0, contact: 0, audit: 0, apply: 0 },
  prev30: { all: 0, contact: 0, audit: 0, apply: 0 },
  series: [],
  byLocale: [],
  topNiches: [],
  topCities: [],
  budgets: [],
  topAuditDomains: [],
  recent: [],
  nicheTaken: 0,
  storageOk: false,
};

/* ----------------------------------------------------------------------------
   VIZITATORI (Vercel Web Analytics)

   Cifrele există deja în Vercel; aici intră ca să nu mai fie nevoie de două
   locuri pentru a răspunde la „câți au intrat și de unde". Sursa e API-ul
   oficial Vercel, interogat pe server cu un token - deci numerele sunt
   aceleași cu cele din Vercel, nu o a doua măsurătoare care ar diverge.

   Vercel numără `pageviews` (afișări) și `visitors` (oameni). Le purtăm pe
   amândouă peste tot: raportul dintre ele spune dacă lumea citește o pagină
   sau trece prin ea.
   -------------------------------------------------------------------------- */

export type VisitorTotals = { pageviews: number; visitors: number };

/** O zi din grafic. Zilele fără trafic sunt prezente, cu zero. */
export type VisitorPoint = { date: string } & VisitorTotals;

/** Un rând dintr-un top: pagină, sursă, țară, tip de dispozitiv. */
export type VisitorSlice = { label: string } & VisitorTotals;

export type VisitorData = {
  /** false când lipsește tokenul: panoul spune asta, nu arată zerouri. */
  configured: boolean;
  /** false când Vercel a răspuns cu eroare - altă poveste decât „nesetat". */
  ok: boolean;
  last30: VisitorTotals;
  prev30: VisitorTotals;
  /** Zilnic, ultimele 30 de zile, cronologic. */
  series: VisitorPoint[];
  topPages: VisitorSlice[];
  topReferrers: VisitorSlice[];
  topCountries: VisitorSlice[];
  devices: VisitorSlice[];
};

const NO_TOTALS: VisitorTotals = { pageviews: 0, visitors: 0 };

export const EMPTY_VISITOR_DATA: VisitorData = {
  configured: false,
  ok: false,
  last30: NO_TOTALS,
  prev30: NO_TOTALS,
  series: [],
  topPages: [],
  topReferrers: [],
  topCountries: [],
  devices: [],
};
