/* ============================================================================
   /apply and /audit, for both locales.
   Copy: _content/apply.ts, _content/audit.ts. APIs: app/api/apply, app/api/audit.
   ========================================================================= */

import { type Locale, localePath } from "../content";
import { buildMetadata } from "../shell";
import { APPLY_PATH, AUDIT_PATH } from "../routes";
import { applyContent } from "../_content/apply";
import { auditContent } from "../_content/audit";
import { servicesContent } from "../_content/services";
import { PageFrame } from "../_components/chrome";
import { EyebrowMarquee, TrickButton } from "../_components/ui";
import { FeatureRows } from "../_components/blocks";
import { ApplyForm } from "../_components/apply-form";
import { AuditForm } from "../_components/audit-form";
import { CONTAINER, PageHero, TextSection } from "../_components/page-kit";

/* ----------------------------------------------------------------------------
   APPLY
   ------------------------------------------------------------------------- */

export function applyMetadata(locale: Locale) {
  const d = applyContent[locale];
  return buildMetadata(locale, { path: APPLY_PATH, title: d.kicker, description: d.intro });
}

export function ApplyPage({ locale }: { locale: Locale }) {
  const d = applyContent[locale];
  const services = servicesContent[locale];
  // Only the names travel to the browser, not the whole services copy.
  const serviceNames = Object.fromEntries(services.services.map((s) => [s.slug, s.name]));

  return (
    <PageFrame locale={locale} path={APPLY_PATH}>
      <PageHero label={d.kicker} title={d.title} intro={[d.intro]} />
      <section data-nav-bg="dark" className="bg-[#0F0F0F] py-24 text-[#F5F2F2]">
        <div className={CONTAINER}>
          <EyebrowMarquee label={d.kicker} />
          <div className="mt-16">
            <ApplyForm
              copy={d}
              locale={locale}
              serviceNames={serviceNames}
              prefillPrefix={services.applyPrefill}
            />
          </div>
        </div>
      </section>
    </PageFrame>
  );
}

/* ----------------------------------------------------------------------------
   AUDIT
   ------------------------------------------------------------------------- */

export function auditMetadata(locale: Locale) {
  const d = auditContent[locale];
  return buildMetadata(locale, { path: AUDIT_PATH, title: d.kicker, description: d.intro });
}

export function AuditPage({ locale }: { locale: Locale }) {
  const d = auditContent[locale];
  return (
    <PageFrame locale={locale} path={AUDIT_PATH}>
      <PageHero label={d.kicker} title={d.title} intro={[d.intro]} />

      <TextSection index={0} label={d.what.kicker}>
        <FeatureRows light items={d.what.items.map((item) => ({ title: item.t, body: item.d }))} />
      </TextSection>

      <AuditForm copy={d} />

      <TextSection label={d.closing.kicker} paragraphs={[d.closing.body]}>
        <div className="mt-10">
          <TrickButton href={localePath(locale, APPLY_PATH)} variant="orange">
            {d.closing.cta}
          </TrickButton>
        </div>
      </TextSection>
    </PageFrame>
  );
}
