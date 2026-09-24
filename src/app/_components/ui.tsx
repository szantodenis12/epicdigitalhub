"use client";

/* ============================================================================
   Shared UI primitives, used by the home page and every subpage.

   Moved out of site.tsx unchanged, so a subpage is built from exactly the same
   buttons, eyebrows and motion as the landing page rather than look-alikes.
   ========================================================================= */

import { Fragment, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { LogoGlyph } from "../logo";
import { LOCALES, localePath } from "../content";
import { useCopy, useLocale, usePagePath, usePrefersReducedMotion } from "./context";
import { gsap } from "./gsap";

/* ============================================================================
   SMALL SHARED PIECES
   ========================================================================= */

/** Heart-shaped eyebrow glyph — real asset, `fill: currentColor`. */
/** Two tiny quarter-arc corner brackets — the real button "arrow-wrap" markup. */
export function CornerBrackets() {
  return (
    /* Source geometry (measured live): both arcs are 8x8, position absolute,
       transform-origin center. .arrow-top sits at top:4px left:4px and slides
       +9.7rem to the RIGHT on hover; .arrow-bottom sits at bottom:4px
       right:4px and slides -9.7rem to the LEFT. They swap corners ALONG the
       button edges and stay inside it — anchoring them the other way round
       makes them fly outwards, which is wrong. */
    <span aria-hidden className="pointer-events-none absolute inset-0 z-10">
      <svg
        viewBox="0 0 8 8"
        className="btn-arrow-top absolute top-1 left-1 h-2 w-2 origin-center"
      >
        <path d="M0 0H8V0.67C3.95 0.67 0.67 3.95 0.67 8H0V0Z" fill="currentColor" />
      </svg>
      <svg
        viewBox="0 0 8 8"
        className="btn-arrow-bottom absolute right-1 bottom-1 h-2 w-2 origin-center"
      >
        <path d="M8 8L0 8L0 7.33C4.05 7.33 7.33 4.05 7.33 0L8 0Z" fill="currentColor" />
      </svg>
    </span>
  );
}

/** Duplicate stacked text nodes -> clip + translateY(-100%) label-flip on hover. */
export function LabelFlip({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    /* Source .button-text_wrap: overflow hidden, height 20px (12px/20px text) */
    <span className={`relative block h-5 overflow-hidden ${className}`}>
      {/* Source .button-text: transition all 0.3s `ease` (not ease-out) */}
      <span className="btn-label block transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]">
        {children}
      </span>
      <span className="btn-label absolute inset-0 block translate-y-full transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]">
        {children}
      </span>
    </span>
  );
}

export function TrickButton({
  children,
  href = "#",
  variant = "base",
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  href?: string;
  variant?: "base" | "orange" | "solid";
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}) {
  const base =
    variant === "orange"
      ? "bg-[#1FDB93] text-white border-black hover:border-[#21976A]"
      : variant === "solid"
        ? // for use on light backdrops, where the blended white pill vanishes
          "bg-[#1F1F1F] text-[#F5F2F2] border-transparent"
        : "bg-white text-black mix-blend-difference border-transparent";
  return (
    <a
      href={href}
      onClick={onClick}
      /* Source: height 56px, padding 16px 24px, font-size 12px/20px,
         border-radius 2.08px, transition 0.3s, and crucially
         `overflow: visible` — the corner arcs travel +/-9.7rem OUTSIDE the
         button on hover, so clipping here kills the whole effect. */
      className={`btn group relative inline-flex h-14 min-w-[172px] items-center justify-center rounded-[0.13rem] border px-6 text-xs leading-5 tracking-[0em] transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${base} ${className}`}
    >
      <CornerBrackets />
      <LabelFlip className="pointer-events-none">{children}</LabelFlip>
    </a>
  );
}

/* Language toggle.

   Deliberately drawn in `currentColor`, not the emerald accent. It sits inside
   the header, which is on `mix-blend-mode: difference` — under that blend
   #1FDB93 over the cream sections resolves to a magenta (214, 23, 95), which
   is not in the palette at all. White-on-difference is the header's own
   treatment, so the toggle reads as part of it rather than as a bolted-on
   widget, and the active language is marked with a rule instead of a colour.

   Real <a> elements, not a JS switcher: each locale is its own URL, so the
   toggle is also how a crawler follows the alternate. `hrefLang` and `lang`
   tell it (and a screen reader) what it is pointing at. Each link goes to the
   SAME page in the other language, not to its home page. */
export function LocaleToggle({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const copy = useCopy();
  const path = usePagePath();
  return (
    <div
      className={`flex items-center gap-1.5 tracking-[0.02em] uppercase ${className || "text-xs text-white"}`}
    >
      {LOCALES.map((l, i) => (
        <Fragment key={l}>
          {i > 0 && (
            <span aria-hidden className="opacity-30">
              /
            </span>
          )}
          {l === locale ? (
            <span aria-current="true" className="relative">
              {l}
              <span aria-hidden className="absolute -bottom-1 left-0 h-px w-full bg-current" />
            </span>
          ) : (
            <a
              href={localePath(l, path)}
              hrefLang={l}
              lang={l}
              title={copy.switchTitle}
              className="opacity-45 transition-opacity duration-300 hover:opacity-100"
            >
              {l}
            </a>
          )}
        </Fragment>
      ))}
    </div>
  );
}

export function NavLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      className="group relative block h-4 overflow-hidden text-xs uppercase tracking-[0.02em]"
    >
      <span className="block transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-full">
        {label}
      </span>
      <span className="absolute inset-0 block translate-y-full transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:translate-y-0">
        {label}
      </span>
    </a>
  );
}

/** "{ LABEL ♥ LABEL }" repeating eyebrow row used by Services / Contact / dividers. */
export function EyebrowMarquee({ label }: { label: string }) {
  // Repeat count is sized so ONE half is wider than the viewport — otherwise
  // the track runs out of content on the right partway through the cycle and a
  // blank gap appears. 6 repeats measured ~1013px against a 1920px viewport.
  //
  // Two IDENTICAL halves, and the spacing lives on each item as a margin
  // rather than as a flex `gap` on the track. `translateX(-50%)` only loops
  // seamlessly if the two halves are exactly equal in width — a `gap` adds one
  // extra space between the halves that isn't inside either of them, which put
  // the loop out by one gap every cycle and made it visibly jump.
  const half = (
    <div className="flex shrink-0 items-center">
      {Array.from({ length: 16 }).map((_, i) => (
        <span key={i} className="flex shrink-0 items-center">
          <span className="whitespace-nowrap">{label}</span>
          <LogoGlyph className="mx-8 h-3 w-auto md:mx-12" />
        </span>
      ))}
    </div>
  );
  return (
    <div className="relative flex w-full items-center overflow-hidden text-[10px] uppercase tracking-[0.15em]">
      {/* Braces sit ON the edges rather than as flex siblings of the track —
          as siblings, the `w-max` track pushed them out of the row and then
          slid across them. */}
      <span className="pointer-events-none absolute left-0 z-10 px-4 md:px-6">{"{"}</span>
      <div className="marquee-track flex w-max shrink-0 items-center">
        {half}
        <div aria-hidden className="flex shrink-0 items-center">
          {Array.from({ length: 16 }).map((_, i) => (
            <span key={i} className="flex shrink-0 items-center">
              <span className="whitespace-nowrap">{label}</span>
              <LogoGlyph className="mx-8 h-3 w-auto md:mx-12" />
            </span>
          ))}
        </div>
      </div>
      <span className="pointer-events-none absolute right-0 z-10 px-4 md:px-6">{"}"}</span>
    </div>
  );
}


/* ============================================================================
   PARALLAX

   Deliberately narrow in scope. This page is already dense with scroll-driven
   motion (3D card stacking, scrubbed curved text, the Flip video morph, the
   gradient wave), so parallax is applied ONLY where it adds depth without
   competing:

     - the hero image, drifting slower than the page as you leave it
     - the image inside each work card, drifting within its own frame
     - the process-card deck as a whole

   Deliberately NOT applied to: the showreel (its transform is owned by
   Flip.fit), the pinned curved dividers (their content is fixed while pinned),
   the process CARDS themselves (GSAP owns those transforms), or the services
   media (hover-driven). Adding parallax to any of those fights an existing
   animation for the same property.

   Uses motion's `useScroll` rather than another ScrollTrigger: this page has
   repeatedly hit stale cached positions from GSAP triggers created around
   pinned sections, and motion's scroll tracking does not suffer that.
   ========================================================================= */

export function Parallax({
  children,
  className = "",
  distance = 60,
  reduceMotion: reduceMotionProp,
}: {
  children: React.ReactNode;
  className?: string;
  /** total px travelled across the element's whole pass through the viewport */
  distance?: number;
  /** omit to read the user's preference here (subpages); the home page
      passes the value it already holds */
  reduceMotion?: boolean;
}) {
  const reduceMotionPref = usePrefersReducedMotion();
  const reduceMotion = reduceMotionProp ?? reduceMotionPref;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-distance / 2, distance / 2]);

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

/* ============================================================================
   GRADIENT WAVE TEXT — scroll-scrubbed per-character reveal

   Source marks this block `data-gradient-wave-text` and splits it into words,
   each word holding one <div> per character. As the block travels up the
   viewport each character runs through a colour wave, staggered left-to-right:

       rgba(255,255,255,0.2)  invisible against the cream background
       -> rgb(31,219,147)      orange crest
       -> rgb(31,31,31)       settled body colour

   It is scrubbed, not triggered, so scrolling back up plays it in reverse.
   ========================================================================= */

export function GradientWaveText({
  paragraphs,
  className = "",
  reduceMotion: reduceMotionProp,
  dark = false,
  inline = false,
}: {
  paragraphs: string[];
  className?: string;
  /** render spans instead of div/p, for use inside a heading */
  inline?: boolean;
  /** omit to read the user's preference here */
  reduceMotion?: boolean;
  /** On a dark panel the wave must settle to the light body colour —
      settling to #1F1F1F would leave the text invisible. */
  dark?: boolean;
}) {
  const reduceMotionPref = usePrefersReducedMotion();
  const reduceMotion = reduceMotionProp ?? reduceMotionPref;
  const rootRef = useRef<HTMLElement>(null);
  const Root = inline ? "span" : "div";
  const Para = inline ? "span" : "p";

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduceMotion) return;
    const chars = root.querySelectorAll<HTMLElement>("[data-wave-char]");
    if (!chars.length) return;

    const tween = gsap.fromTo(
      chars,
      { color: "rgba(255,255,255,0.2)" },
      {
        keyframes: [
          { color: "rgb(31,219,147)" },
          { color: dark ? "rgb(245,242,242)" : "rgb(31,31,31)" },
        ],
        ease: "power1.inOut",
        // The source is a broad GRADIENT, not a moving edge. Sampling it
        // mid-scroll shows the start of the block near-solid, the middle
        // part-way through, and the end untouched — i.e. most of the text is
        // in transition at once. duration 60 against a 0.5 stagger keeps
        // ~120 characters in flight simultaneously, which reads as a soft
        // sweep rather than the hard boundary a short duration produced.
        duration: 60,
        stagger: { each: 0.5 },
        scrollTrigger: {
          trigger: root,
          start: "top 90%",
          end: "bottom 40%",
          // numeric scrub adds inertia so the wave glides instead of snapping
          // frame-to-frame with the wheel
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [paragraphs, reduceMotion, dark]);

  return (
    <Root ref={rootRef as React.RefObject<HTMLDivElement>} className={className}>
      {paragraphs.map((para, pi) => (
        <Para key={pi} className={inline ? "block" : pi > 0 ? "mt-8" : undefined}>
          {/* words kept whole so they never break mid-word, then split to chars */}
          {para.split(" ").map((word, wi, arr) => (
            <Fragment key={`${word}-${wi}`}>
              <span className="relative inline-block">
                {Array.from(word).map((ch, ci) => (
                  <span
                    key={ci}
                    data-wave-char
                    className="inline-block"
                    style={
                      reduceMotion ? undefined : { color: "rgba(255,255,255,0.2)" }
                    }
                  >
                    {ch}
                  </span>
                ))}
              </span>
              {/* The separator must sit BETWEEN the word boxes, not inside
                  them: trailing whitespace at the end of an inline-block is
                  collapsed, which ran every word together. As a text node here
                  it renders as a real space and still allows line wrapping. */}
              {wi < arr.length - 1 ? " " : null}
            </Fragment>
          ))}
        </Para>
      ))}
    </Root>
  );
}

/* ============================================================================
   STATS STRIP - the home page's marquee of what the studio has shipped.
   ========================================================================= */

export function StatsMarquee() {
  const copy = useCopy();
  return (
    <section className="overflow-hidden border-y border-[#1F1F1F]/10 bg-[#F5F2F2] py-6">
      {/* The full sequence is repeated TWICE: `translateX(-50%)` only loops
          seamlessly if the two halves are identical. Spacing is a per-item
          margin, not a flex gap, for the same reason as the eyebrow marquee. */}
      <div className="marquee-track flex w-max items-center">
        {[0, 1].map((dup) => (
          <div key={dup} aria-hidden={dup === 1} className="flex shrink-0 items-center">
            {copy.marquee.map((m, i) => (
              <span key={`${m}-${i}`} className="flex shrink-0 items-center text-sm">
                <span className="whitespace-nowrap">{m}</span>
                <LogoGlyph className="mx-8 h-3.5 w-auto" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
