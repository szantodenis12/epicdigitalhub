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
  const disallow = ["/api/", "/admin"];

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/", disallow })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
