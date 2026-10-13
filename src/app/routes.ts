/* ---------------------------------------------------------------------------
   Every subpage's locale-independent path, in one plain module.

   Pages, the home page's links, the language toggle and the sitemap all build
   URLs from here - wrap a path in `localePath(locale, path)` (content.ts) to
   get the real URL. Slugs are shared by both locales.

   Deliberately imports no copy: the home page is a client component and pulls
   this in, and the page copy (~90KB for services alone) must not ride along.
   The slug lists live in route-params.ts, which only server code imports.
   ------------------------------------------------------------------------ */

import type { Locale } from "./content";

export const SERVICES_PATH = "/services";
export const servicePath = (slug: string) => `${SERVICES_PATH}/${slug}`;

export const CASE_STUDIES_PATH = "/case-studies";
export const caseStudyPath = (slug: string) => `${CASE_STUDIES_PATH}/${slug}`;

export const ARTICLES_PATH = "/articles";
export const articlePath = (slug: string) => `${ARTICLES_PATH}/${slug}`;

export const APPLY_PATH = "/apply";
/** The apply form, with a service preselected (the form reads `?service=`). */
export const applyPath = (serviceSlug?: string) =>
  serviceSlug ? `${APPLY_PATH}?service=${serviceSlug}` : APPLY_PATH;

/* The niche map: industry vs. niche, and which positions are open per city. */
export const NICHES_PATH = "/niches";

export const AUDIT_PATH = "/audit";

/* The legal pages, and the ONE place in the site where a slug differs between
   the locales: "privacy" is "confidentialitate" and "terms" is "termeni" in
   Romanian, because a legal page is found by its Romanian name. Everything
   else shares a slug (see the note on `localePath` in content.ts).

   A page with a localised slug has to hand `buildMetadata` the whole `paths`
   map, or its hreflang pair would point at a URL that does not exist. */
export const LEGAL_PATHS = {
  privacy: { en: "/privacy", ro: "/confidentialitate" },
  cookies: { en: "/cookies", ro: "/cookies" },
  terms: { en: "/terms", ro: "/termeni" },
} as const satisfies Record<string, Record<Locale, string>>;

export type LegalKey = keyof typeof LEGAL_PATHS;

export const legalPath = (locale: Locale, key: LegalKey) => LEGAL_PATHS[key][locale];
