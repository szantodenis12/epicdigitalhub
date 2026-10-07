/* ============================================================================
   /niches, for both locales.
   Copy and data: _content/niches.ts. The interactive board: _components/niche-blocks.
   ========================================================================= */

import Link from "next/link";
import { type Locale, localePath } from "../content";
import { buildMetadata } from "../shell";
import { nichesContent, defaultCity } from "../_content/niches";
import { APPLY_PATH, NICHES_PATH, articlePath } from "../routes";
import { PageFrame } from "../_components/chrome";
import { TrickButton } from "../_components/ui";
import { FeatureRows } from "../_components/blocks";
import { CONTAINER, GRID, KeyList, PageHero, TEXT_COLS, TextSection } from "../_components/page-kit";
import { nn } from "../_components/format";
import { NicheBoard, NicheRule } from "../_components/niche-blocks";

/** The manifesto the closing links to. /exclusivity, which the handoff
    assumed, does not exist here — this article is the same argument. */
const MANIFESTO_SLUG = "un-singur-brand-pe-nisa";

export function nichesMetadata(locale: Locale) {
  const d = nichesContent[locale];
  return buildMetadata(locale, {
    path: NICHES_PATH,
    title: d.kicker,
    description: d.meta.description,
  });
}

export function NichesPage({ locale }: { locale: Locale }) {
  const d = nichesContent[locale];

  return (
    <PageFrame locale={locale} path={NICHES_PATH}>
      <PageHero
        label={d.kicker}
        title={d.title}
        intro={[d.intro, d.heroSub]}
        aside={<KeyList items={d.how.blocks.map((b) => b.title)} label={d.how.kicker} />}
      >
        <TrickButton href={localePath(locale, APPLY_PATH)} variant="orange">
          {d.closing.cta}
        </TrickButton>
      </PageHero>

      {/* The rule, demonstrated before it is explained: the industry gets
          struck out, its niches do not. Hidden on a phone, where the board
          renders the same device inline instead of stacking two of them. */}
      <section className="bg-[#F5F2F2] pb-20 md:pb-28">
        <div className={`${CONTAINER} hidden md:block`}>
          <div className="md:max-w-[640px]">
            <NicheRule
              board={defaultCity}
              locale={locale}
              kicker={d.exampleKicker}
              industryOpen={d.industryOpen}
              status={{ ocupat: d.checker.statusLabel.ocupat, liber: d.checker.statusLabel.liber }}
            />
          </div>
        </div>
      </section>

      {/* The rule in four steps, on the Testimonials row idiom. */}
      <TextSection index={0} label={d.how.kicker}>
        <FeatureRows
          light
          items={d.how.blocks.map((b) => ({ title: b.title, body: b.body }))}
        />
      </TextSection>

      {/* The board. Everything from here down is driven by the city picker.

          It sits in its own full-width section rather than inside the text
          section above: `TextSection` puts its children in columns 4-8, which
          is right for reading copy and wrong for a 36-row ledger with a nine
          city switcher — measured there, the niche names wrapped and the
          status labels crowded the right edge. */}
      <section className="bg-[#F5F2F2] py-20 md:py-28">
        <div className={`${CONTAINER} ${GRID} border-t border-[#1F1F1F]/15 pt-10`}>
          <div className="md:col-span-3">
            <p className="text-[32px] leading-none font-medium tracking-[-0.02em] text-[#1F1F1F]/20 md:text-[44px]">
              {nn(1)}
            </p>
            <p className="mt-5 text-[11px] tracking-[0.02em] text-[#1F1F1F]/70 uppercase">
              {d.checker.kicker}
            </p>
          </div>
          <div className={TEXT_COLS}>
            <p className="text-lg leading-[1.5] text-[#1F1F1F]/80 md:text-xl">{d.checker.sub}</p>
          </div>
        </div>
        <div className={`${CONTAINER} mt-14`}>
          <NicheBoard
            d={d.checker}
            locale={locale}
            applyHref={localePath(locale, APPLY_PATH)}
            exampleKicker={d.exampleKicker}
            industryOpen={d.industryOpen}
            showRule
          />
        </div>
      </section>

      <TextSection label={d.kicker} heading={d.closing.heading}>
        <div className="mt-10 flex flex-wrap gap-3">
          <TrickButton href={localePath(locale, APPLY_PATH)} variant="orange">
            {d.closing.cta}
          </TrickButton>
        </div>
        <p className="mt-10">
          <Link
            href={localePath(locale, articlePath(MANIFESTO_SLUG))}
            className="group inline-flex items-center gap-2 text-xs tracking-[0.05em] uppercase"
          >
            {d.closing.manifesto}
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </p>
      </TextSection>
    </PageFrame>
  );
}
