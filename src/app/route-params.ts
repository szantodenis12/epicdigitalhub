/* The slugs every dynamic route accepts, read from the copy. Server-only
   (generateStaticParams, the sitemap) - see the note in routes.ts. */

import { servicesContent } from "./_content/services";
import { caseStudySlugs, draftCaseStudySlugs } from "./_content/case-studies";
import { articlesContent } from "./_content/articles";

export const serviceParams = () => servicesContent.en.services.map((s) => ({ slug: s.slug }));
/* Routes are generated for the drafts too - the page has to exist for the
   client to review it. The SITEMAP uses `publishedCaseStudyParams` instead, so
   a draft is reachable by URL and invisible to everything else. */
export const caseStudyParams = () =>
  [...caseStudySlugs, ...draftCaseStudySlugs].map((slug) => ({ slug }));

export const publishedCaseStudyParams = () => caseStudySlugs.map((slug) => ({ slug }));
export const articleParams = () => articlesContent.en.articles.map((a) => ({ slug: a.slug }));
