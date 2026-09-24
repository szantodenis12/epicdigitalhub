/* The slugs every dynamic route accepts, read from the copy. Server-only
   (generateStaticParams, the sitemap) - see the note in routes.ts. */

import { servicesContent } from "./_content/services";
import { caseStudySlugs } from "./_content/case-studies";
import { articlesContent } from "./_content/articles";

export const serviceParams = () => servicesContent.en.services.map((s) => ({ slug: s.slug }));
export const caseStudyParams = () => caseStudySlugs.map((slug) => ({ slug }));
export const articleParams = () => articlesContent.en.articles.map((a) => ({ slug: a.slug }));
