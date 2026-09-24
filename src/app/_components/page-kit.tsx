/* ============================================================================
   Page kit: the building blocks every subpage is laid out with.

   Nothing here is a new pattern. Each block is a type treatment the home page
   already uses, lifted as-is so a subpage reads as the same site:

     - the container      `max-w-[1440px] px-4`, as every home section
     - the 8-column grid  the About section's: label in columns 1-3, text in
                          columns 4-8
     - page titles        the Contact heading (uppercase, medium, -0.02em)
     - statements         the About statement (36px / 1.333, medium, -0.01em)
     - index labels       the Services accordion's `[ 01 ]`
     - list rows          the Services / Testimonials hairline rows

   Server components: they only lay out copy. Anything that animates is a
   client component imported from ./ui.
   ========================================================================= */

import Link from "next/link";
import { nn } from "./format";
import { GradientWaveText } from "./ui";
import { Reveal } from "./blocks";

export const CONTAINER = "mx-auto w-full max-w-[1440px] px-4";
export const GRID = "grid grid-cols-1 gap-x-1 gap-y-10 md:grid-cols-8";
/** Columns 4-8 of the grid, where the reading text sits. */
export const TEXT_COLS = "md:col-span-5 md:col-start-4";

/** The small uppercase label that heads the left three columns. */
export function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-[11px] uppercase tracking-[0.02em] text-[#1F1F1F]/70 md:col-span-3 ${className}`}>
      {children}
    </p>
  );
}

/** "← All services" style link back to a listing. */
export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 text-xs tracking-[0.05em] uppercase"
    >
      <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
      {children}
    </Link>
  );
}

/** A headline whose words rise out of their own masks on arrival - the home
    hero's `.intro-rise` entrance, per word because a subpage title wraps
    unpredictably. CSS only (globals.css), released by the `intro-done` class
    PageFrame sets on mount, and shown immediately under reduced motion. */
export function RiseTitle({
  text,
  className = "",
  delay = 0.1,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const words = text.split(" ");
  return (
    <h1 className={className}>
      {words.map((word, i) => (
        <span key={i}>
          <span className="rise-word">
            <span
              className="intro-rise"
              style={{ "--intro-delay": `${delay + i * 0.045}s` } as React.CSSProperties}
            >
              {word}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </h1>
  );
}

/** A subpage's opening block: label, the page's single H1, intro copy.
    `aside` fills columns 1-3 beside the intro, where the About section keeps
    its showreel box. */
export function PageHero({
  label,
  title,
  intro = [],
  back,
  aside,
  children,
}: {
  label: React.ReactNode;
  title: string;
  intro?: string[];
  back?: { href: string; label: string };
  aside?: React.ReactNode;
  /** CTAs, rendered under the intro */
  children?: React.ReactNode;
}) {
  return (
    <section className="bg-[#F5F2F2] pt-36 pb-24 md:pt-44">
      <div className={CONTAINER}>
        {back && (
          <div className="intro-fade mb-12" style={{ "--intro-delay": "0.05s" } as React.CSSProperties}>
            <BackLink href={back.href}>{back.label}</BackLink>
          </div>
        )}
        <Label className="intro-fade mb-8">{label}</Label>
        <RiseTitle
          text={title}
          className="max-w-[20ch] text-[9vw] font-medium leading-[0.98] tracking-[-0.025em] uppercase md:text-[5.6vw]"
        />
        {(intro.length > 0 || children || aside) && (
          <div className={`mt-16 ${GRID}`}>
            {/* after the copy on a phone, beside it from md up */}
            {aside && <div className="order-last md:order-none md:col-span-3 md:self-end">{aside}</div>}
            <div
              className={`intro-fade ${TEXT_COLS}`}
              style={{ "--intro-delay": "0.45s" } as React.CSSProperties}
            >
              {intro.map((p, i) => (
                <p
                  key={i}
                  className={`text-lg leading-[1.5] text-[#1F1F1F]/85 md:text-[22px] ${i > 0 ? "mt-6" : ""}`}
                >
                  {p}
                </p>
              ))}
              {children && <div className="mt-10 flex flex-wrap gap-3">{children}</div>}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/** The hero's left column: a short list of plain lines, the way the About
    section fills its first three columns ("One plan. One team. One report."). */
export function KeyList({ items, label }: { items: string[]; label?: string }) {
  return (
    <div className="intro-fade" style={{ "--intro-delay": "0.35s" } as React.CSSProperties}>
      {label && (
        <p className="mb-5 text-[11px] tracking-[0.1em] text-[#1F1F1F]/40 uppercase">{label}</p>
      )}
      <ul className="flex flex-col gap-1 text-[15px] leading-snug text-[#1F1F1F]/70">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

/** Label on the left, statement + body copy on the right. The statement takes
    the About section's gradient-wave reveal and the copy under it fades up, so
    every text block on a subpage arrives the way the home page's do. */
export function TextSection({
  index,
  label,
  heading,
  paragraphs = [],
  children,
  sidebar,
  dark = false,
}: {
  index?: number;
  label: string;
  heading?: string;
  paragraphs?: string[];
  children?: React.ReactNode;
  /** extra content for the left column, under the index */
  sidebar?: React.ReactNode;
  dark?: boolean;
}) {
  const line = dark ? "border-white/15" : "border-[#1F1F1F]/15";
  return (
    <section
      className={dark ? "bg-[#0F0F0F] py-20 text-[#F5F2F2] md:py-28" : "bg-[#F5F2F2] py-20 text-[#1F1F1F] md:py-28"}
    >
      <div className={`${CONTAINER} ${GRID} border-t ${line} pt-10`}>
        {/* The left three columns carry the section's number at display size,
            the way the work cards carry "(01)" - a small label alone left the
            column reading as empty space. Sticky, so it stays with the copy
            on a long section. */}
        <div className="md:col-span-3 md:sticky md:top-28 md:self-start">
          {index !== undefined && (
            <p
              className={`text-[32px] leading-none font-medium tracking-[-0.02em] md:text-[44px] ${dark ? "text-white/25" : "text-[#1F1F1F]/20"}`}
            >
              {nn(index)}
            </p>
          )}
          {label && (
            <p
              className={`text-[11px] tracking-[0.02em] uppercase ${index !== undefined ? "mt-5" : ""} ${dark ? "text-white/50" : "text-[#1F1F1F]/70"}`}
            >
              {label}
            </p>
          )}
          {sidebar && <div className={`mt-8 border-t ${line} pt-6`}>{sidebar}</div>}
        </div>
        <div className={TEXT_COLS}>
          {heading && (
            <h2 className="text-[30px] leading-[1.18] font-medium tracking-[-0.02em] md:text-[48px]">
              <GradientWaveText paragraphs={[heading]} dark={dark} inline />
            </h2>
          )}
          {paragraphs.length > 0 && (
            <Reveal className={heading ? "mt-10" : ""}>
              {paragraphs.map((p, i) => (
                <p
                  key={i}
                  className={`text-lg leading-[1.5] md:text-xl ${dark ? "text-white/70" : "text-[#1F1F1F]/80"} ${i > 0 ? "mt-6" : ""}`}
                >
                  {p}
                </p>
              ))}
            </Reveal>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}

/** One row of a listing: `[ 01 ]`, title, supporting line, whole row a link. */
export function ListRow({
  index,
  href,
  title,
  body,
  meta,
}: {
  index: number;
  href: string;
  title: string;
  body?: string;
  meta?: string;
}) {
  return (
    <li className="border-b border-[#1F1F1F]/15">
      <Link href={href} className="group relative grid gap-4 py-8 md:grid-cols-8 md:gap-x-1">
        {/* Emerald sweep along the bottom edge - the Testimonials row hover. */}
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-px left-0 h-0.5 w-full origin-left scale-x-0 bg-[#1FDB93] transition-transform duration-500 ease-out group-hover:scale-x-100"
        />
        <span className="text-sm text-[#1F1F1F]/50 md:col-span-1">[ {nn(index)} ]</span>
        <span className="md:col-span-7 md:col-start-2">
          <span className="block text-[22px] font-medium tracking-[-0.02em] md:text-[36px]">
            {title}
          </span>
          {body && (
            <span className="mt-3 block max-w-[62ch] text-sm leading-relaxed text-[#1F1F1F]/70 md:text-base">
              {body}
            </span>
          )}
          {meta && (
            <span className="mt-4 block text-[11px] uppercase tracking-[0.1em] text-[#1F1F1F]/50">
              {meta}
            </span>
          )}
        </span>
      </Link>
    </li>
  );
}

/** Bulleted list in the reading column: title in medium, body after it. */
export function BulletList({ items }: { items: { title?: string; body: string }[] }) {
  return (
    <ul className="mt-8 border-t border-[#1F1F1F]/15">
      {items.map((item, i) => (
        <li key={i} className="flex gap-5 border-b border-[#1F1F1F]/15 py-5 text-base leading-relaxed md:text-lg">
          <span aria-hidden className="mt-[0.6em] h-1.5 w-1.5 shrink-0 bg-[#1FDB93]" />
          <span className="text-[#1F1F1F]/75">
            {item.title && <strong className="font-medium text-[#1F1F1F]">{item.title}</strong>}{" "}
            {item.body}
          </span>
        </li>
      ))}
    </ul>
  );
}
