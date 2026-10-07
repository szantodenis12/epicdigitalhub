import type { MetadataRoute } from "next";

export const SITE_URL = "https://epicdigitalhub.ro";

/**
 * Explicit allow for AI crawlers alongside the normal `*` rule.
 *
 * Some of these (GPTBot, ClaudeBot, Google-Extended, PerplexityBot) are treated
 * as opt-in by their operators, so an unqualified `User-agent: *` is not
 * reliably read as consent. Naming them removes the ambiguity — which is the
 * point of the GEO side of this work.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "Google-Extended",
  "PerplexityBot",
  "CCBot",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  /* The two flipbooks are assets a visitor opens FROM a case study, not pages:
     the Agro catalogue is a single self-contained 17MB HTML file and the ZEN
     booklet is sixteen JPEGs behind a viewer. Neither has a title, a
     description, canonical or hreflang, and either one indexed would spend
     crawl budget that belongs to the case studies that link to them. They stay
     reachable by anyone with the link — this only keeps them out of the index.

     They are also absent from the sitemap, which lists routes built from
     routes.ts, and these are static files under /public. */
  const disallow = ["/api/", "/admin", "/carnet-zen/", "/brosura-agro/"];

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/", disallow })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
