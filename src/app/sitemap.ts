import type { MetadataRoute } from "next";
import { SITE_URL } from "./robots";

/**
 * The brief lists /services, /system, /web, /work, /about, /exclusivity and
 * /apply. Those are routes on the epicdigitalhub-v2 demo — THIS build is a
 * single page whose sections are anchors (#services, #work, #clients, #about,
 * #contact), so listing them would put 404s in the sitemap.
 *
 * Only real, indexable URLs belong here. When the site grows to separate
 * routes, add them.
 *
 * Two entries now, one per locale. Each carries the full `alternates.languages`
 * set INCLUDING itself — that is what the spec requires: every alternate in a
 * group must list every member of the group, itself included, or Google
 * discards the cluster and treats the pages as duplicates.
 */
const languages = {
  ro: SITE_URL,
  en: `${SITE_URL}/en`,
  "x-default": SITE_URL,
};

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages },
    },
    {
      url: `${SITE_URL}/en`,
      lastModified,
      changeFrequency: "monthly",
      // Romanian is the default locale and the primary audience, so English is
      // deliberately a notch lower rather than an equal-weight duplicate.
      priority: 0.8,
      alternates: { languages },
    },
  ];
}
