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
import { CONTAINER, GRID, PageHero, TEXT_COLS, TextSection } from "../_components/page-kit";
import { nn } from "../_components/format";
import { NicheBoard, NicheRule } from "../_components/niche-blocks";

/** The manifesto the closing links to. /exclusivity, which the handoff
    assumed, does not exist here — this article is the same argument. */
const MANIFESTO_SLUG = "un-singur-brand-pe-nisa";

export function nichesMetadata(locale: Locale) {
  const d = nichesContent[locale];
  return buildMetadata(locale, {
    path: NICHES_PATH,
    title: d.meta.title ? { absolute: d.meta.title } : d.kicker,
    description: d.meta.description,
  });
}

export function NichesPage({ locale }: { locale: Locale }) {
  const d = nichesContent[locale];

  return (
    <PageFrame locale={locale} path={NICHES_PATH}>
      {/* The rule is DEMONSTRATED beside the hero's copy rather than in a
          section of its own below it - the industry struck out, its niches
          not. It used to sit in a `max-w-[640px]` block on a full-width
          section, which left the whole right half of the page empty under a
          hero whose left column held nothing but a four-line summary of the
          section immediately below. The card measures ~640px and three columns
          of the grid are ~619px at the current container width, so it drops
          into the hero's aside slot almost exactly.

          `asideRight`, so the copy keeps the left: the sentence states the
          rule and the card is the worked example, which reads in that order.

          That summary (a `KeyList` of `d.how.blocks` titles) is gone with it:
          the same four titles are spelled out in full, with their bodies, in
          the `FeatureRows` section directly below - it was filling space by
          saying the same thing twice.

          Still hidden on a phone, where the board renders this same device
          inline rather than stacking two of them. */}
      <PageHero
        label={d.kicker}
        title={d.title}
        intro={[d.intro, d.heroSub]}
        asideRight
        aside={
          <div className="hidden max-w-[640px] md:block">
            <NicheRule
              board={defaultCity}
              locale={locale}
              kicker={d.exampleKicker}
              industryOpen={d.industryOpen}
              status={{ ocupat: d.checker.statusLabel.ocupat, liber: d.checker.statusLabel.liber }}
            />
          </div>
        }
      >
        <TrickButton href={localePath(locale, APPLY_PATH)} variant="orange">
          {d.closing.cta}
        </TrickButton>
      </PageHero>

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
      {/* `pt-0`: the section above is a `TextSection`, which carries its own
          `pb-28`. Two sections' paddings stacked put 224px of nothing between
          the last feature row and this section's rule - and with the left
          column empty down that whole band, there was nothing in it to read.
          One section's worth of space is enough to separate them. */}
      <section className="bg-[#F5F2F2] pt-0 pb-20 md:pb-28">
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
            <p className="max-w-[44em] text-lg leading-[1.5] text-[#1F1F1F]/80 md:text-xl">{d.checker.sub}</p>
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
