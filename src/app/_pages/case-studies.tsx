/* ============================================================================
   /case-studies and /case-studies/[slug], for both locales.
   Copy: _content/case-studies.ts.
   ========================================================================= */

import Image from "next/image";
import { notFound } from "next/navigation";
import { type Locale, localePath } from "../content";
import { buildMetadata } from "../shell";
import { caseStudiesContent, getCaseStudy } from "../_content/case-studies";
import { APPLY_PATH, AUDIT_PATH, CASE_STUDIES_PATH, caseStudyPath } from "../routes";
import { caseStudyParams } from "../route-params";
import { PageFrame } from "../_components/chrome";
import Link from "next/link";
import { Parallax, TrickButton } from "../_components/ui";
import { Reveal } from "../_components/blocks";
import { nn } from "../_components/format";
import { CONTAINER, KeyList, PageHero, TextSection } from "../_components/page-kit";

export { caseStudyParams };

/* ----------------------------------------------------------------------------
   LISTING
   ------------------------------------------------------------------------- */

export function caseStudiesMetadata(locale: Locale) {
  const d = caseStudiesContent[locale];
  return buildMetadata(locale, { path: CASE_STUDIES_PATH, title: d.kicker, description: d.intro });
}

export function CaseStudiesIndex({ locale }: { locale: Locale }) {
  const d = caseStudiesContent[locale];
  return (
    <PageFrame locale={locale} path={CASE_STUDIES_PATH}>
      <PageHero
        label={d.kicker}
        title={d.title}
        intro={[d.intro]}
        aside={<KeyList items={d.studies.map((study) => study.vertical)} />}
      />

      {/* Picture-led, alternating sides, each image drifting on the page’s
          own parallax - the treatment the work cards get on the home page,
          without their sticky stack. */}
      <section className="bg-[#F5F2F2] pb-28">
        <div className={`${CONTAINER} flex flex-col gap-24 md:gap-32`}>
          {d.studies.map((study, i) => (
            <Link
              key={study.slug}
              href={localePath(locale, caseStudyPath(study.slug))}
              className={`group grid items-center gap-8 md:grid-cols-2 md:gap-16 ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}
            >
              <Parallax distance={i % 2 === 0 ? 40 : -40}>
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={study.img}
                    alt={study.title}
                    fill
                    sizes="(min-width: 768px) 45vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                  />
                </div>
              </Parallax>
              <Reveal index={i}>
                <div className="flex items-baseline gap-4">
                  <span className="text-sm text-[#1F1F1F]/50">[ {nn(i)} ]</span>
                  <span className="text-xs tracking-[0.15em] text-[#1F1F1F]/60 uppercase transition-colors duration-500 group-hover:text-[#21976A]">
                    {study.vertical}
                  </span>
                </div>
                <h2 className="mt-5 text-[34px] font-medium leading-[1.05] tracking-[-0.02em] uppercase md:text-[3.2vw]">
                  {study.title}
                </h2>
                <p className="mt-6 max-w-[48ch] text-lg leading-[1.5] text-[#1F1F1F]/80">
                  {study.summary}
                </p>
                <span className="mt-8 inline-flex items-center gap-2 text-xs tracking-[0.05em] uppercase">
                  {d.detailKicker}
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Reveal>
            </Link>
          ))}
        </div>
        <p className={`${CONTAINER} mt-20 text-[11px] uppercase tracking-[0.1em] text-[#1F1F1F]/50`}>
          {d.note}
        </p>
      </section>
    </PageFrame>
  );
}

/* ----------------------------------------------------------------------------
   ONE CASE STUDY
   ------------------------------------------------------------------------- */

export function caseStudyMetadata(locale: Locale, slug: string) {
  const study = getCaseStudy(locale, slug);
  if (!study) return {};
  return buildMetadata(locale, {
    path: caseStudyPath(slug),
    title: study.title,
    description: study.summary,
  });
}

export function CaseStudyPage({ locale, slug }: { locale: Locale; slug: string }) {
  const d = caseStudiesContent[locale];
  const study = getCaseStudy(locale, slug);
  if (!study) notFound();

  return (
    <PageFrame locale={locale} path={caseStudyPath(slug)}>
      <PageHero
        label={`${d.detailKicker} / ${study.vertical}`}
        title={study.title}
        intro={[study.intro]}
        back={{ href: localePath(locale, CASE_STUDIES_PATH), label: d.backLabel }}
      />

      <section className="bg-[#F5F2F2]">
        <div className={CONTAINER}>
          <div className="relative aspect-[3/2] w-full overflow-hidden md:aspect-[21/9]">
            <Image
              src={study.img}
              alt={study.title}
              fill
              priority
              sizes="(min-width: 1440px) 1408px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {study.sections.map((section, i) => (
        <TextSection key={section.title} index={i} label={section.title} paragraphs={section.paragraphs}>
          {study.result && i === study.sections.length - 1 && (
            <p className="mt-12 text-[30px] leading-[1.1] font-medium tracking-[-0.02em] text-[#21976A] md:text-[44px]">
              {study.result}
            </p>
          )}
        </TextSection>
      ))}

      <TextSection label={study.title} heading={d.ctaTitle}>
        <div className="mt-10 flex flex-wrap gap-3">
          <TrickButton href={localePath(locale, APPLY_PATH)} variant="orange">
            {d.ctaApply}
          </TrickButton>
          <TrickButton href={localePath(locale, AUDIT_PATH)} variant="solid">
            {d.ctaAudit}
          </TrickButton>
        </div>
      </TextSection>
    </PageFrame>
  );
}
