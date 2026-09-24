/* ============================================================================
   /services and /services/[slug], for both locales.

   The route files under (en)/ and (ro)/ro/ are one-liners that call into
   here, so the two languages cannot drift apart. Copy: _content/services.ts.

   Built only from the home page's vocabulary:
     - cream #F5F2F2 sections alternating with #0F0F0F panels
     - the `{ LABEL ♥ LABEL }` eyebrow marquee to open each dark panel
     - the Services hover accordion for the list of services
     - the About section's gradient-wave statements and 8-column grid
     - the Testimonials rows for deliverables
     - the Contact heading type for closing statements, on the same Parallax
     - the #1FDB93 work-card panel for the exclusivity block
   plus the handoff's one graphic, the 23.6° device, recoloured to the brand.
   ========================================================================= */

import { notFound } from "next/navigation";
import { type Locale, localePath } from "../content";
import { buildMetadata } from "../shell";
import { APPLY_PATH, SERVICES_PATH, applyPath, servicePath } from "../routes";
import { serviceParams } from "../route-params";
import { servicesContent } from "../_content/services";
import { PageFrame } from "../_components/chrome";
import { EyebrowMarquee, Parallax, StatsMarquee, TrickButton } from "../_components/ui";
import { nn } from "../_components/format";
import { FaqList, FeatureRows, Reveal } from "../_components/blocks";
import { DeviceBand } from "../_components/service-device";
import { ServiceList } from "../_components/service-list";
import { CONTAINER, GRID, KeyList, PageHero, TEXT_COLS, TextSection } from "../_components/page-kit";

export { serviceParams };

/** The hub has no service of its own, so its band borrows the heaviest beam
    in the set - the one the consulting page uses. */
const BAND_SLUG = "consultanta-marketing";

const findService = (locale: Locale, slug: string) =>
  servicesContent[locale].services.find((s) => s.slug === slug);

/** The Contact section's heading treatment, drifting on the same Parallax. */
function ClosingStatement({
  heading,
  line,
  cta,
  href,
}: {
  /** omitted when a curved divider just carried the same line */
  heading?: string;
  line?: string;
  cta: string;
  href: string;
}) {
  return (
    <section className="bg-[#F5F2F2] pt-16 pb-32">
      <div className={CONTAINER}>
        {heading && (
          <Parallax distance={56}>
            <h2 className="max-w-[22ch] text-[9vw] font-medium leading-[0.98] tracking-[-0.025em] uppercase md:text-[5.2vw]">
              {heading}
            </h2>
          </Parallax>
        )}
        <div className={`${heading ? "mt-16" : ""} ${GRID}`}>
          <Reveal className={TEXT_COLS}>
            {line && (
              <p className="text-lg leading-[1.5] text-[#1F1F1F]/85 md:text-[22px]">{line}</p>
            )}
            <div className={line ? "mt-10" : ""}>
              <TrickButton href={href} variant="orange">
                {cta}
              </TrickButton>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
   HUB
   ------------------------------------------------------------------------- */

export function servicesHubMetadata(locale: Locale) {
  const hub = servicesContent[locale].hub;
  return buildMetadata(locale, {
    path: SERVICES_PATH,
    // the copy's meta titles already end in "| Epic Digital Hub"
    title: { absolute: hub.meta.title },
    description: hub.meta.description,
  });
}

export function ServicesHub({ locale }: { locale: Locale }) {
  const d = servicesContent[locale];
  const { hub } = d;

  return (
    <PageFrame locale={locale} path={SERVICES_PATH}>
      <PageHero
        label={hub.kicker}
        title={hub.h1}
        intro={hub.paragraphs}
        aside={<KeyList label={hub.steps.kicker} items={hub.steps.items.map((s) => s.title)} />}
      >
        <TrickButton href={localePath(locale, APPLY_PATH)} variant="orange">
          {hub.ctaPrimary}
        </TrickButton>
        <TrickButton href="#services-list" variant="solid">
          {hub.ctaSecondary}
        </TrickButton>
      </PageHero>

      <StatsMarquee />

      <TextSection
        index={0}
        label={hub.start.kicker}
        heading={hub.start.heading}
        paragraphs={hub.start.paragraphs}
      />

      <section
        id="services-list"
        data-nav-bg="dark"
        className="scroll-mt-4 bg-[#0F0F0F] py-24 text-[#F5F2F2]"
      >
        <div className={CONTAINER}>
          <EyebrowMarquee label={hub.listKicker} />
          <ServiceList
            items={d.services.map((s) => ({
              slug: s.slug,
              name: s.name,
              description: s.hubDescription,
              href: localePath(locale, servicePath(s.slug)),
              linkLabel: s.hubLink,
            }))}
          />
        </div>
      </section>

      <TextSection index={2} label={hub.steps.kicker} heading={hub.steps.heading} />
      <section className="bg-[#F5F2F2] pb-24">
        <ol className={`${CONTAINER} grid gap-1 md:grid-cols-3`}>
          {hub.steps.items.map((step, i) => (
            <li key={step.title}>
              <Reveal index={i} className="h-full border-t border-[#1F1F1F]/15 pt-8 md:pr-10">
                <span className="text-sm text-[#1F1F1F]/50">[ {nn(i)} ]</span>
                <h3 className="mt-6 text-[22px] font-medium tracking-[-0.02em] md:text-[28px]">
                  {step.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-[#1F1F1F]/75">{step.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* The page’s one set piece, carrying the closing statement so the
          block below is just the ask.

          The home page's pinned curved line was the other candidate. This is
          the same device the ten service pages close on, which is what makes
          the section read as one set, and it costs none of the pin's ~4300px
          of scroll for a single sentence. */}
      <DeviceBand
        slug={BAND_SLUG}
        label={hub.kicker}
        title={hub.closing.heading}
      />

      <ClosingStatement
        line={hub.closing.line}
        cta={hub.closing.cta}
        href={localePath(locale, APPLY_PATH)}
      />
    </PageFrame>
  );
}

/* ----------------------------------------------------------------------------
   ONE SERVICE
   ------------------------------------------------------------------------- */

export function serviceMetadata(locale: Locale, slug: string) {
  const service = findService(locale, slug);
  if (!service) return {};
  return buildMetadata(locale, {
    path: servicePath(slug),
    title: { absolute: service.meta.title },
    description: service.meta.description,
  });
}

export function ServicePage({ locale, slug }: { locale: Locale; slug: string }) {
  const d = servicesContent[locale];
  const service = findService(locale, slug);
  if (!service) notFound();
  // Every CTA on a service page opens the form with this service preselected.
  const applyHref = localePath(locale, applyPath(slug));

  return (
    <PageFrame locale={locale} path={servicePath(slug)}>
      <PageHero
        label={`${d.hub.kicker} / ${service.name}`}
        title={service.hero.h1}
        intro={service.hero.paragraphs}
        back={{ href: localePath(locale, SERVICES_PATH), label: d.backLabel }}
        aside={
          <KeyList
            label={service.deliverablesTitle}
            items={service.deliverables.map((item) => item.title)}
          />
        }
      >
        <TrickButton href={applyHref} variant="orange">
          {service.hero.cta}
        </TrickButton>
      </PageHero>

      <TextSection
        index={0}
        label={service.direction.kicker}
        heading={service.direction.heading}
        paragraphs={service.direction.paragraphs}
      />

      {/* Chapter break: the 23.6° cut at full width, the service’s name over
          it, running straight into what the work actually is. */}
      <DeviceBand slug={slug} label={`${nn(1)} / ${service.deliverablesTitle}`} title={service.name} />

      <section data-nav-bg="dark" className="bg-[#0F0F0F] pt-16 pb-24 text-[#F5F2F2] md:pb-28">
        <div className={CONTAINER}>
          <FeatureRows items={service.deliverables} />
        </div>
      </section>

      <TextSection
        index={2}
        label={service.how.kicker}
        heading={service.how.heading}
        paragraphs={service.how.paragraphs}
      />

      <TextSection index={3} label={d.faqTitle}>
        <FaqList items={service.faq} />
      </TextSection>

      {/* The exclusivity promise, on the emerald the first work card uses -
          the one block on the page meant to stop the scroll. */}
      <section className="bg-[#1FDB93] py-24 text-[#1F1F1F]">
        <div className={CONTAINER}>
          <Parallax distance={40}>
            <h2 className="max-w-[20ch] text-[9vw] font-medium leading-[0.98] tracking-[-0.025em] uppercase md:text-[4.8vw]">
              {d.exclusivity.heading}
            </h2>
          </Parallax>
          <div className={`mt-16 ${GRID}`}>
            <Reveal className={TEXT_COLS}>
              {d.exclusivity.paragraphs.map((p, i) => (
                <p key={i} className={`text-lg leading-[1.5] md:text-xl ${i > 0 ? "mt-6" : ""}`}>
                  {p}
                </p>
              ))}
              <a
                href={applyHref}
                className="group mt-10 inline-flex items-center gap-2 text-sm tracking-[0.05em] uppercase"
              >
                {d.exclusivity.cta}
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      <ClosingStatement
        heading={service.closing.heading}
        line={service.closing.line}
        cta={service.closing.cta}
        href={applyHref}
      />
    </PageFrame>
  );
}
