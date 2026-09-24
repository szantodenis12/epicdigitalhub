/* ---------------------------------------------------------------------------
   Every subpage's locale-independent path, in one plain module.

   Pages, the home page's links, the language toggle and the sitemap all build
   URLs from here - wrap a path in `localePath(locale, path)` (content.ts) to
   get the real URL. Slugs are shared by both locales.

   Deliberately imports no copy: the home page is a client component and pulls
   this in, and the page copy (~90KB for services alone) must not ride along.
   The slug lists live in route-params.ts, which only server code imports.
   ------------------------------------------------------------------------ */

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

export const AUDIT_PATH = "/audit";
