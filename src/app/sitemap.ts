import type { MetadataRoute } from "next";
import { SITE_URL } from "./robots";
import { LOCALES, type Locale, localePath } from "./content";
import {
  APPLY_PATH,
  ARTICLES_PATH,
  AUDIT_PATH,
  CASE_STUDIES_PATH,
  SERVICES_PATH,
  articlePath,
  caseStudyPath,
  servicePath,
} from "./routes";
import { articleParams, caseStudyParams, serviceParams } from "./route-params";

/**
 * Every real, indexable URL, in both locales.
 *
 * Each entry carries the full `alternates.languages` set INCLUDING itself —
 * that is what the spec requires: every alternate in a group must list every
 * member of the group, itself included, or Google discards the cluster and
 * treats the pages as duplicates.
 *
 * Paths come from routes.ts and route-params.ts, the same place the pages build their URLs from,
 * so a page cannot exist without being listed here or vice versa.
 */

/** Locale-independent path -> priority for the English (default) version. */
const PAGES: [path: string, priority: number][] = [
  ["", 1],
  [SERVICES_PATH, 0.8],
  ...serviceParams().map(({ slug }) => [servicePath(slug), 0.7] as [string, number]),
  [CASE_STUDIES_PATH, 0.7],
  ...caseStudyParams().map(({ slug }) => [caseStudyPath(slug), 0.6] as [string, number]),
  [ARTICLES_PATH, 0.6],
  ...articleParams().map(({ slug }) => [articlePath(slug), 0.5] as [string, number]),
  [AUDIT_PATH, 0.7],
  [APPLY_PATH, 0.6],
];

// English is the default locale, so Romanian is deliberately a notch lower
// rather than an equal-weight duplicate.
const LOCALE_WEIGHT: Record<Locale, number> = { en: 0, ro: -0.2 };

const url = (locale: Locale, path: string) => {
  const p = localePath(locale, path);
  return p === "/" ? SITE_URL : `${SITE_URL}${p}`;
};

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return PAGES.flatMap(([path, priority]) => {
    const languages = {
      en: url("en", path),
      ro: url("ro", path),
      "x-default": url("en", path),
    };
    return LOCALES.map((locale) => ({
      url: url(locale, path),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: Math.round((priority + LOCALE_WEIGHT[locale]) * 10) / 10,
      alternates: { languages },
    }));
  });
}
