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
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
