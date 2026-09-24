/* ============================================================================
   /articles and /articles/[slug], for both locales.
   Copy: _content/articles.ts.
   ========================================================================= */

import { notFound } from "next/navigation";
import { type Locale, localePath } from "../content";
import { buildMetadata } from "../shell";
import { articlesContent } from "../_content/articles";
import { APPLY_PATH, ARTICLES_PATH, AUDIT_PATH, articlePath } from "../routes";
import { articleParams } from "../route-params";
import { PageFrame } from "../_components/chrome";
import { TrickButton } from "../_components/ui";
import { CONTAINER, KeyList, ListRow, PageHero, TextSection } from "../_components/page-kit";

export { articleParams };

const findArticle = (locale: Locale, slug: string) =>
  articlesContent[locale].articles.find((a) => a.slug === slug);

const articleMeta = (a: { category: string; date: string; readingTime: string }) =>
  [a.category, a.date, a.readingTime].join(" · ");

/* ----------------------------------------------------------------------------
   LISTING
   ------------------------------------------------------------------------- */

export function articlesMetadata(locale: Locale) {
  const d = articlesContent[locale];
  return buildMetadata(locale, { path: ARTICLES_PATH, title: d.kicker, description: d.intro });
}

export function ArticlesIndex({ locale }: { locale: Locale }) {
  const d = articlesContent[locale];
  return (
    <PageFrame locale={locale} path={ARTICLES_PATH}>
      <PageHero
        label={d.kicker}
        title={d.title}
        intro={[d.intro]}
        aside={<KeyList items={d.articles.map((a) => a.category)} />}
      />

      <section className="bg-[#F5F2F2] pb-24">
        <div className={CONTAINER}>
          <ul className="border-t border-[#1F1F1F]/15">
            {d.articles.map((article, i) => (
              <ListRow
                key={article.slug}
                index={i}
                href={localePath(locale, articlePath(article.slug))}
                title={article.title}
                body={article.dek}
                meta={articleMeta(article)}
              />
            ))}
          </ul>
        </div>
      </section>
    </PageFrame>
  );
}

/* ----------------------------------------------------------------------------
   ONE ARTICLE
   ------------------------------------------------------------------------- */

export function articleMetadata(locale: Locale, slug: string) {
  const article = findArticle(locale, slug);
  if (!article) return {};
  return buildMetadata(locale, {
    path: articlePath(slug),
    title: article.title,
    description: article.dek,
  });
}

export function ArticlePage({ locale, slug }: { locale: Locale; slug: string }) {
  const d = articlesContent[locale];
  const article = findArticle(locale, slug);
  if (!article) notFound();

  return (
    <PageFrame locale={locale} path={articlePath(slug)}>
      <PageHero
        label={articleMeta(article)}
        title={article.title}
        intro={[article.dek]}
        back={{ href: localePath(locale, ARTICLES_PATH), label: d.backLabel }}
        /* What the piece covers, in its own headings. */
        aside={<KeyList items={article.sections.map((section) => section.heading)} />}
      />

      <article>
        {article.sections.map((section, i) => (
          <TextSection
            key={section.heading}
            index={i}
            label=""
            heading={section.heading}
            paragraphs={section.paragraphs}
          >
            {section.bullets && (
              <ul className="mt-6 space-y-3">
                {section.bullets.map((b) => (
                  <li key={b} className="flex gap-4 text-base leading-relaxed text-[#1F1F1F]/75 md:text-lg">
                    <span aria-hidden className="mt-[0.6em] h-1.5 w-1.5 shrink-0 bg-[#1FDB93]" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
            {section.quote && (
              <blockquote className="mt-10 border-l-2 border-[#1FDB93] pl-6">
                <p className="text-[22px] leading-[1.3333] font-medium tracking-[-0.01em] md:text-[28px]">
                  {section.quote}
                </p>
              </blockquote>
            )}
          </TextSection>
        ))}
      </article>

      <section className="bg-[#F5F2F2] pb-24">
        <div className={`${CONTAINER} border-t border-[#1F1F1F]/15 pt-10`}>
          <p className="max-w-[62ch] text-base leading-relaxed text-[#1F1F1F]/75 md:text-lg">{d.ctaBody}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <TrickButton href={localePath(locale, AUDIT_PATH)} variant="orange">
              {d.ctaAudit}
            </TrickButton>
            <TrickButton href={localePath(locale, APPLY_PATH)} variant="solid">
              {d.ctaApply}
            </TrickButton>
          </div>
        </div>
      </section>
    </PageFrame>
  );
}
