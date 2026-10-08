"use client";

/* ============================================================================
   Epic Digital Hub — landing page.

   Layout, motion and interaction patterns were developed by studying
   nbnzia.com as a front-end exercise; all content, brand colour and imagery
   are Epic Digital Hub's own. Copy is lifted verbatim from the project's own
   dictionary (see .tasks/clone-nbnzia/content-mapping.md for the mapping).

   Font: "BDO Grotesk" is a commercially licensed typeface, currently shipped
   from public/fonts/. A licence is required before this goes to production —
   see .tasks/clone-nbnzia/brand.md.

   Brand accent #1FDB93 with the derived palette; black/white text and
   backgrounds intentionally left neutral.
   ========================================================================= */

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { LogoMark, LogoWordmark, MARK_PATHS_HERO } from "./logo";
import { COPY, type Locale, localePath } from "./content";
import { APPLY_PATH, caseStudyPath, servicePath } from "./routes";
import { motion, useInView, useScroll, useTransform, type MotionValue } from "motion/react";
import { gsap, ScrollTrigger } from "./_components/gsap";
import { Flip } from "gsap/Flip";
import { SiteProviders, useCopy, useLocale, usePrefersReducedMotion } from "./_components/context";
import { EyebrowMarquee, GradientWaveText, Parallax, StatsMarquee, TrickButton } from "./_components/ui";
import { nn } from "./_components/format";
import { HoverAccordion, MEDIA_H, MEDIA_W, mediaMotion } from "./_components/hover-accordion";
import { ContactFooter, SiteHeader, useSmoothScrollNav } from "./_components/chrome";
import { CurvedDivider } from "./_components/curved-divider";

if (typeof window !== "undefined") {
  // ScrollTrigger itself is registered (and configured) in _components/gsap.
  gsap.registerPlugin(Flip);
}

/* ============================================================================
   DATA
   ========================================================================= */

/* Copy lives in content.ts, keyed by locale. What stays here is the data that
   is NOT language-dependent - colours, images and ordering - merged with the
   copy by index at render time. Keeping them separate means a translation can
   never accidentally change a brand colour or drop an image. */

/* `case` is the study this card opens, and `site` the client's own address
   where there is a public one to send people to. Three of the six have none:
   DentalNet's public asset is the ZEN booklet rather than a site, and KGM and
   Harmony Garden have no site of their own — so those cards link to the study
   instead of pointing at a dead `#`. Both labels live in content.ts.

   Card six was "Construction systems" (ThermX). Origins took its slot on the
   user's call, so the home page still shows six verticals; ThermX keeps its
   case study at /case-studies/thermx. */
const WORK_VISUALS = [
  { bg: "#1FDB93", fg: "#1F1F1F", img: "/images/work-auto.webp", case: "kgm-chery-oradea" },
  { bg: "#1F1F1F", fg: "#F5F2F2", img: "/images/work-dental.webp", case: "dentalnet" },
  {
    bg: "#D2F9EA",
    fg: "#1F1F1F",
    img: "/images/work-agro.webp",
    case: "agro-salso",
    site: "https://agrosalso.ro",
  },
  {
    bg: "#DB641F",
    fg: "#1F1F1F",
    img: "/images/work-hotel.webp",
    case: "hotel-maxim",
    site: "https://www.hotel-maxim.ro",
  },
  { bg: "#E2B736", fg: "#1F1F1F", img: "/images/work-events.webp", case: "harmony-garden" },
  {
    bg: "#21976A",
    fg: "#F5F2F2",
    img: "/images/work-cafe.webp",
    case: "origins-cafe",
    site: "https://app.originscafe.ro",
  },
] satisfies { bg: string; fg: string; img: string; case: string; site?: string }[];

/* One per services row, in row order: strategy, brand, web, ads, photo-video.

   Delivered 1400x784, which is 16:9 — the same ratio as the accordion's
   350x196 media box, so they fill it with no crop. The set they replaced was
   3:2 (1600x1067) and was being cut on both sides. The masters that came with
   them (`-full.png`, 1916x821, about 9MB for the five) are not in the repo:
   `next/image` never serves them, so they would be weight in git for nothing.
   They are in the handoff folder if a different crop is ever needed. */
const SERVICE_IMAGES = [
  "/images/service-strategy.webp",
  "/images/service-brand.webp",
  "/images/service-web.webp",
  "/images/service-ads.webp",
  "/images/service-video.webp",
];

/* The dedicated page each home services row links to, by index. The home page
   keeps its five broad services; each one opens the service page that covers
   it. The other five pages are reached from the /services hub. */
const SERVICE_PAGES = [
  "consultanta-marketing", // Marketing strategy
  "design-grafic", // Brand & design
  "website-uri-prezentare", // Premium websites
  "campanii-ppc", // Paid ads
  "continut-video", // Photo-video
];

/* ============================================================================
   SHOWREEL — GSAP Flip morph from a small inline box to a full-bleed box
   ========================================================================= */

type ShowreelRefs = {
  scalingRef: React.RefObject<HTMLDivElement | null>;
  bigRef: React.RefObject<HTMLDivElement | null>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
};

/* The Flip's start and end targets live in different parts of the page — the
   small box sits inside the About grid, the big box after the marquee — so the
   refs are owned by the page and shared, rather than held by one component. */
function useShowreelFlip(
  { scalingRef, bigRef, videoRef }: ShowreelRefs,
  reduceMotion: boolean
) {
  /* `Flip.fit` BAKES a transform at creation time from the two boxes' rects.
     It does not track layout. Resize the window — or rotate a phone, or toggle
     device mode — and that stale transform persists: measured 1393px wide on a
     533px viewport (261% of the screen) after narrowing from 1440 without a
     reload. Bumping this key on resize tears the tween down and re-fits against
     the new geometry. */
  const [resizeKey, setResizeKey] = useState(0);
  useEffect(() => {
    let t = 0;
    /* WIDTH only.

       The address bar on a phone hides and shows as you scroll, firing
       `resize` with a new height over and over during an ordinary gesture.
       Every one of those used to bump `resizeKey`, which tears down the Flip
       tween, re-fits it, and calls ScrollTrigger.refresh() - re-measuring
       every trigger on the page, synchronously, mid-scroll. It was the main
       reason scrolling felt like it stuttered and caught on mobile.

       Only a width change (or an explicit orientationchange) can invalidate
       the baked Flip transform, so height is safe to ignore. */
    let lastWidth = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      window.clearTimeout(t);
      t = window.setTimeout(() => setResizeKey((k) => k + 1), 200);
    };
    const onOrientation = () => {
      lastWidth = window.innerWidth;
      window.clearTimeout(t);
      t = window.setTimeout(() => setResizeKey((k) => k + 1), 200);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onOrientation);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onOrientation);
      window.clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    const big = bigRef.current;
    const scaling = scalingRef.current;
    const video = videoRef.current;
    if (!big || !scaling || !video) return;

    // Some browsers only honour `muted` as a DOM property, not just the
    // attribute, and the autoplay policy rejects play() without it.
    video.muted = true;

    /* Play only while it is on screen. The reel is 50s and 4.8MB; decoding it
       while the visitor is three sections away is pure waste, and with
       `preload="none"` this is also what triggers the download in the first
       place. Same treatment as the hero loop. */
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0 }
    );
    io.observe(video);

    if (reduceMotion) return () => io.disconnect();

    // Source geometry (measured live off nbnzia.com):
    //   .scaling-element__small-box  320 x 180   (16:9)
    //   .scaling-element__big-box   1408 x 792   (16:9)
    // The big box now takes the site container's full width (--site-max), so
    // the scale factor rides along with it; Flip.fit reads live rects, so
    // nothing here is tied to those numbers.
    // Both are 16:9, so this is a pure ~4.4x scale — no aspect change.
    // Flip.fit animates a transform on .scaling-video toward the big box's
    // rect; the wrapper stays 320x180 in normal flow, nothing is pinned.
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scaling,
        start: "center center",
        endTrigger: big,
        end: "center center",
        scrub: 0.25,
        invalidateOnRefresh: true,
      },
    });
    // start from a clean slate: a transform left over from the previous
    // viewport would be folded into the new fit
    gsap.set(scaling, { clearProps: "transform" });

    const flipTween = Flip.fit(scaling, big, { duration: 1, ease: "none" });
    if (flipTween) tl.add(flipTween as gsap.core.Tween);

    // pins and scrubs elsewhere on the page cached their positions against the
    // old layout too
    ScrollTrigger.refresh();

    return () => {
      io.disconnect();
      tl.scrollTrigger?.kill();
      tl.kill();
      gsap.set(scaling, { clearProps: "transform" });
    };
  }, [reduceMotion, scalingRef, bigRef, videoRef, resizeKey]);
}

/* Source `.scaling-element__small-box`: 320x180, in the About grid's LEFT
   column with its BOTTOM aligned to the CTA row — measured on the source, the
   box and the buttons both end at y=1760. z-55 so the expanding video rides
   over the marquee below. */
function ShowreelSmall({
  scalingRef,
  videoRef,
}: Pick<ShowreelRefs, "scalingRef" | "videoRef">) {
  // Mobile starts at 58% width so the morph to full width is a real ~1.7x move.
  // It was briefly full-width here, which left nothing to animate.
  // Desktop keeps the source's 320x180.
  return (
    <div className="relative aspect-video w-[58%] md:aspect-auto md:h-[180px] md:w-[320px] md:max-w-full">
      <div
        ref={scalingRef}
        className="absolute inset-0 z-[55] overflow-hidden will-change-transform"
      >
        {/* The supplied reel is a 1080x1920 social export whose picture is
            letterboxed 16:9 inside it — 656px of black top and bottom. It is
            stored here already cropped to that band (1080x608), so `object-cover`
            fills this 16:9 box exactly instead of showing a narrow slice of a
            portrait frame.

            No `autoPlay`: it starts when it scrolls into view (see the
            observer in useShowreelFlip). `preload="none"` keeps 4.8MB off the
            wire until then — this box sits well below the fold. */}
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src="/videos/manifest-reel.mp4"
          poster="/images/reel-poster.webp"
          preload="none"
          muted
          loop
          playsInline
        />
      </div>
    </div>
  );
}

/* Big box: the site container's full width at 16:9, anchored to the
   container's LEFT edge, same as the small box. Section pb 96px.
   (The source's was 1408x792 — a hard cap at that width is what left the
   reel short of the container's right edge once the layout widened.)
   The source's `.scaling-element__big-box { margin-top: 384px }` is the TOTAL
   gap from the small box's bottom to the big box's top — the marquee sits
   inside that span, not on top of it. This is also the Flip's scrub distance
   (`ScrollTrigger` runs small-box-center -> big-box-center), so getting this
   wrong doesn't just misplace the box, it changes how long the expansion
   takes relative to how far the video has to travel to the viewport centre.
   Measured live: small-box-bottom -> marquee-top = 96px (the About section's
   own pb-24) and marquee-top -> marquee-bottom = 70px (the marquee's own
   py-6 + line height), neither of which is this box's concern. So this
   margin only needs to cover the remainder: 384 - 96 - 70 = 218px. */
function ShowreelBig({ bigRef }: Pick<ShowreelRefs, "bigRef">) {
  return (
    <section className="bg-[#F5F2F2] pb-24">
      <div className="mx-auto w-full max-w-[var(--site-max)] px-4">
        <div
          ref={bigRef}
          /* 218px is the desktop figure derived from the source. On mobile
             that reserved ~550px of mostly-empty scroll, so the gap is much
             tighter there while the morph itself is preserved. */
          className="mt-24 aspect-video w-full md:mt-[218px]"
        />
      </div>
    </section>
  );
}

/* ============================================================================
   TESTIMONIALS — client quotes

   Built from the existing vocabulary rather than as a new pattern: the dark
   `#0F0F0F` panel and `{ ... }` eyebrow marquee borrowed from Services, the
   featured quote reusing the gradient-wave reveal from the About statement so
   it reads as the same site, and the supporting quotes on the hairline
   `border-white/15` rows the Services accordion already uses. Names take the
   emerald accent.
   ========================================================================= */

function Testimonials({ reduceMotion }: { reduceMotion: boolean }) {
  const copy = useCopy();
  // Reveals use motion's `whileInView` (IntersectionObserver) rather than a
  // GSAP ScrollTrigger. This section sits after the sticky work stack and two
  // pinned dividers, so ScrollTrigger's cached start positions for it are
  // stale — a `gsap.from` here applied its from-state and never played,
  // leaving every row at opacity 0.
  const reveal = (i: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-8% 0px" },
          transition: {
            duration: 0.75,
            delay: i * 0.08,
            ease: [0.16, 1, 0.3, 1] as const,
          },
        };

  return (
    <section id="clients" data-nav-bg="dark" className="bg-[#0F0F0F] py-24 text-[#F5F2F2]">
      <div className="mx-auto max-w-[var(--site-max)] px-4">
        <EyebrowMarquee label={copy.eyebrow.clients} />

        <div className="mt-16 grid gap-x-1 gap-y-16 md:grid-cols-8">
          <p className="text-[11px] tracking-[0.02em] text-white/50 uppercase md:col-span-3">
            {copy.testimonials.title}
          </p>

          {/* Featured quote — same wave reveal as the About statement. */}
          <div className="text-[26px] leading-[1.3333] font-medium tracking-[-0.01em] md:col-span-5 md:col-start-4 md:text-[36px]">
            <GradientWaveText
              reduceMotion={reduceMotion}
              paragraphs={[`“${copy.testimonials.featured.quote}”`]}
              dark
            />
            {/* lands after the wave has swept the quote */}
            <motion.p
              {...reveal(3)}
              className="mt-6 text-sm tracking-[0.15em] text-[#1FDB93] uppercase"
            >
              {copy.testimonials.featured.name}
            </motion.p>
          </div>
        </div>

        <ul className="mt-24 border-t border-white/15">
          {copy.testimonials.items.map((t, i) => (
            <motion.li
              key={t.name}
              {...reveal(i)}
              /* The indent is a TRANSFORM on the two columns, not padding on
                 the row. `hover:pl-6` narrowed the row's content box for the
                 whole 500ms, so the quote re-wrapped while it moved — on the
                 longer quotes a line would jump to the next row and back, and
                 with the row height changing under the pointer the hover could
                 drop and re-fire. That is the chaos. A transform moves pixels
                 and touches no layout. */
              className="group relative grid cursor-default gap-4 border-b border-white/15 py-8 md:grid-cols-8 md:gap-8"
            >
              {/* Emerald sweep along the row's bottom edge — the same
                  origin-left scaleX idiom as the footer email underline, so the
                  hover reads as part of the same site. */}
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-px left-0 h-0.5 w-full origin-left scale-x-0 bg-[#1FDB93] transition-transform duration-500 ease-out group-hover:scale-x-100"
              />
              <p className="text-xs tracking-[0.15em] text-[#1FDB93] uppercase opacity-70 transition-[opacity,transform] duration-300 ease-out group-hover:opacity-100 md:col-span-3 md:group-hover:translate-x-1.5">
                {t.name}
              </p>
              <p className="max-w-[62em] text-sm leading-relaxed text-white/60 transition-[color,transform] duration-300 ease-out group-hover:text-white/95 md:col-span-5 md:group-hover:translate-x-1.5">
                “{t.quote}”
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ============================================================================
   WORK — two offset columns, parallax pictures

   REPLACED the stacked case slides (2026-09-30). Those followed the source
   exactly: six `position: sticky` slides of `100svh`, each scrubbing a 3D
   recede (scale 1 -> 0.7, rotateX 40deg) over 150% of its own height, plus a
   100svh tail so the last card could dissolve in place. Faithful, and it cost
   SEVEN viewports — around 7500px at 1080, the longest stretch on the page,
   for six cards.

   Now the cards sit in two columns that scroll normally. The right column
   starts a fifth of a viewport lower than the left, the cards carry uneven
   widths and small horizontal nudges, and each picture drifts inside its own
   frame as the card passes. Nothing pins, so the section costs a little over
   two viewports.

   Kept, because it is the section's identity: the per-vertical brand colour,
   the whole of the copy (name, number, tag, body, link), and the clip-path
   entrance where the frame unclips downward while the picture counter-moves
   into place.

   Dropped: the 3D recede. It needed a full viewport per card to read at all,
   which is precisely the scroll this section was spending.

   No GSAP here on purpose. This section sits immediately after a PINNED
   curved divider, and ScrollTrigger positions cached around pinned sections on
   this page have gone stale before — the testimonials reveal had to be moved
   off ScrollTrigger for exactly that reason. motion's `whileInView` and
   `useScroll` are IntersectionObserver-based and do not have that failure
   mode. It also takes five ScrollTriggers off a page that has already had one
   velocity-contention bug.
   ========================================================================= */

/* Per-card irregularity, applied from `md` up: a horizontal nudge in px plus a
   width. Six equal cards in two columns read as a grid however far apart they
   sit, and the point of this arrangement is that they do not. */
const WORK_CARD_SHAPE = [
  { nudge: 0, width: "md:w-full" },
  { nudge: 26, width: "md:w-[92%]" },
  { nudge: -20, width: "md:w-[97%]" },
  { nudge: 34, width: "md:w-[88%]" },
  { nudge: -14, width: "md:w-[95%]" },
  { nudge: 18, width: "md:w-full" },
];

/* Which card goes in which column. Left takes 1, 3, 5 and right takes 2, 4, 6,
   so reading order down the left column and then the right still follows the
   numbering on the cards. */
const WORK_COLUMNS = [
  [0, 2, 4],
  [1, 3, 5],
];

/* How far a picture drifts inside its frame across its whole pass, px each
   way. The frame scales its image to 1.18, so it holds (0.18 / 2) * height of
   hidden overhang — about 46px on a 380px-tall frame. Raise this past that and
   the drift pulls the frame's edge into view. */
const WORK_PARALLAX_Y = 44;

/* The frame: unclips on entry, and its picture drifts as the card travels.

   Three nested layers, each with one job, because they animate on different
   clocks: the frame's clip-path plays once on entry, the drift tracks scroll
   continuously, and the counter-move belongs to the entrance. Collapsing any
   two of them puts two animations on one transform, which is the fight the
   showreel already lost once against `Flip.fit`. */
function WorkCardMedia({
  src,
  alt,
  reduceMotion,
}: {
  src: string;
  alt: string;
  reduceMotion: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [-WORK_PARALLAX_Y, WORK_PARALLAX_Y]
  );

  const picture = (
    <Image
      src={src}
      alt={alt}
      fill
      /* The container caps at 1440, so from there up a card stops growing at
         about 660px and a `vw` hint would keep asking for wider files on a
         bigger screen. The 1.18 scale the parallax drifts inside is part of
         the width the browser actually needs. */
      sizes="(min-width: 1680px) 900px, (min-width: 768px) 46vw, 100vw"
      className="scale-[1.18] object-cover"
    />
  );

  if (reduceMotion) {
    return (
      <div ref={ref} className="relative aspect-[4/3] w-full overflow-hidden">
        {picture}
      </div>
    );
  }

  return (
    /* CLIP-PATH AND INTERSECTIONOBSERVER DO NOT MIX ON THE SAME ELEMENT.
       Chromium counts a target's own clip-path when it computes intersection,
       so an element hidden by `inset(0% 0% 100%)` reports `isIntersecting:
       false, ratio: 0` while sitting whole in the middle of the viewport.
       Measured with a bare observer in the page: rect top 148, height 440,
       viewport 900 — ratio 0. The entrance can then never fire, because the
       thing that would reveal it is waiting to see it.

       That is also why this worked under the old GSAP build and broke on the
       way to motion: ScrollTrigger reads scroll offsets, `whileInView` and
       `useInView` read an observer. Both motion attempts failed for one
       reason, and it was never the tween.

       So the observed element is this outer one, which is never clipped, and
       the clip lives on the layer inside it. `useScroll` can stay on the same
       outer ref — it measures rects, not visibility. */
    <div ref={ref} className="relative aspect-[4/3] w-full">
      {/* Source `.case-content_image-warpper`: clip-path inset(0% 0% 100%) ->
          inset(0%), i.e. the frame opens top to bottom. A CSS transition, so
          nothing has to interpolate an inset() in JS. */}
      <div
        style={{
          clipPath: inView ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
          transition: "clip-path 1050ms cubic-bezier(0.22,1,0.36,1) 150ms",
        }}
        className="absolute inset-0 overflow-hidden"
      >
        <motion.div style={{ y }} className="absolute inset-0">
          {/* Source `.case-content_image`: translateY(-72.075px) on a
              601px-tall picture = -12%, counter-moving down as the frame
              opens. Without it the image visibly travels and the whole thing
              reads as a slide. It can never expose the bottom edge: at
              progress p the frame is open to p*H while the picture covers to
              H*(1 - 0.12*(1-p)), and 1 - 0.12 + 0.12p >= p for all p <= 1.

              Its own element, so the entrance and the scroll drift never write
              the same transform. */}
          <div
            style={{
              transform: inView ? "translateY(0%)" : "translateY(-12%)",
              transition: "transform 1050ms cubic-bezier(0.22,1,0.36,1) 150ms",
            }}
            className="absolute inset-0"
          >
            {picture}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function WorkGrid({ reduceMotion }: { reduceMotion: boolean }) {
  const copy = useCopy();
  const locale = useLocale();

  /* Text entrance, from the source's own run: y 50 -> 0 with opacity, on a
     ~145ms stagger, ~1.06s end to end.

     `initial: false` under reduced motion, never `whileInView: undefined`. A
     motion element handed no target keeps whatever inline style it already
     has, and `usePrefersReducedMotion` returns false in the server snapshot —
     so the first client render applies the hidden state and then nothing ever
     clears it. That left the hero headline and the entire nav invisible for
     reduced-motion users once already. Reduced motion has to mean "no
     animation", not "no content".

     `opacity` is passed in per element rather than assumed to be 1: the tag
     and body rest at 0.6 and 0.9, and animating them to full strength would
     quietly redesign the card. */
  const reveal = (order: number, opacity = 1) =>
    reduceMotion
      ? /* `initial: false` AND an explicit resting target. Not one or the
           other: the server snapshot has `reduceMotion` false, so the markup
           ships with the hidden state inline, and a motion element given no
           target keeps whatever inline style it already carries. Measured on
           this very section before the `animate` was added — twelve elements
           across the six cards sat at opacity 0 for reduced-motion visitors,
           which is the same failure the hero headline and the nav had. */
        { initial: false as const, animate: { y: 0, opacity } }
      : {
          initial: { y: 50, opacity: 0 },
          whileInView: { y: 0, opacity },
          viewport: { once: true, amount: 0.4 },
          transition: {
            duration: 0.9,
            delay: 0.145 * order,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        };

  return (
    /* Cream (#F5F2F3) is the same resting canvas the sticky stack used to show
       through as a card receded: the cards keep their own brand colour, the
       gaps between them show the page. */
    <section id="work" data-nav-bg="light" className="bg-[#F5F2F3] py-20 md:py-28">
      <div className="mx-auto flex max-w-[var(--site-max)] flex-col gap-12 px-4 md:flex-row md:items-start md:gap-[clamp(24px,3vw,56px)] md:px-10">
        {WORK_COLUMNS.map((column, col) => (
          <div
            key={col}
            /* The right column starts a fifth of a viewport lower. This is the
               whole trick: with both columns flush at the top, three pairs of
               cards line up into three rows and the eye reads rows, not a
               stagger. */
            className={`flex flex-1 flex-col gap-12 md:gap-[clamp(48px,6vw,104px)] ${
              col === 1 ? "md:mt-[20vh]" : ""
            }`}
          >
            {column.map((i) => {
              const w = copy.work.items[i];
              const v = WORK_VISUALS[i];
              const shape = WORK_CARD_SHAPE[i];
              // The client's own site where there is one, our study where
              // there is not. Never a `#`.
              const site = "site" in v ? v.site : undefined;
              const href = site ?? localePath(locale, caseStudyPath(v.case));
              return (
                <article
                  key={w.name}
                  style={{
                    backgroundColor: v.bg,
                    color: v.fg,
                    ["--work-nudge" as string]: `${shape.nudge}px`,
                  }}
                  /* The nudge rides on a custom property so it can apply from
                     `md` up only — an inline transform cannot carry a media
                     query, and on a phone the cards are one column where a
                     sideways nudge just eats the gutter. */
                  className={`flex w-full flex-col gap-7 self-start p-7 md:gap-8 md:p-9 md:[transform:translateX(var(--work-nudge))] ${shape.width}`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <motion.h3
                        {...reveal(0)}
                        className="text-[30px] leading-[1.05] font-medium tracking-[-0.02em] uppercase md:text-[38px]"
                      >
                        {w.name}
                      </motion.h3>
                      <motion.span {...reveal(0)} className="text-xl md:text-2xl">
                        ({nn(i)})
                      </motion.span>
                    </div>
                    <motion.p
                      {...reveal(1, 0.6)}
                      className="mt-3 text-xs tracking-[0.15em] uppercase opacity-60"
                    >
                      {w.tag}
                    </motion.p>
                  </div>

                  <WorkCardMedia
                    src={v.img}
                    alt={`${w.name} project preview`}
                    reduceMotion={reduceMotion}
                  />

                  <div>
                    <motion.p
                      {...reveal(2, 0.9)}
                      className="text-sm leading-relaxed whitespace-pre-line opacity-90"
                    >
                      {w.body}
                    </motion.p>
                    <motion.div {...reveal(3)} className="mt-5">
                      <a
                        href={href}
                        {...(site ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="group inline-flex w-fit items-center gap-2 text-sm tracking-[0.05em] uppercase"
                      >
                        {site ? copy.work.visit : copy.work.caseStudy}
                        <span className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
                          ↗
                        </span>
                      </a>
                    </motion.div>
                  </div>
                </article>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
/* ============================================================================
   SERVICES — hover accordion, one row open at a time (_components/hover-accordion)
   ========================================================================= */

function Services() {
  const copy = useCopy();
  const locale = useLocale();

  return (
    <section id="services" data-nav-bg="dark" className="bg-[#0F0F0F] py-24 text-[#F5F2F2]">
      <div className="mx-auto max-w-[var(--site-max)] px-4">
        <EyebrowMarquee label={copy.eyebrow.whatWeDo} />
        <HoverAccordion
          items={copy.services.map((s, i) => ({
            key: s.title,
            title: s.title,
            body: s.body,
            link: {
              href: localePath(locale, servicePath(SERVICE_PAGES[i])),
              label: copy.serviceLink,
            },
          }))}
          media={(i, isActive) => {
            const m = mediaMotion(isActive);
            return (
              <Image
                src={SERVICE_IMAGES[i]}
                alt=""
                width={MEDIA_W}
                height={MEDIA_H}
                priority={i === 0}
                className={`object-cover ${m.className}`}
                style={m.style}
              />
            );
          }}
        />
      </div>
    </section>
  );
}

/* ============================================================================
   PROCESS — fanned cards + elastic reveal + mouse-inertia tilt
   ========================================================================= */

const FAN = { angle: 5, spread: 300, lift: 45 };

/* The card's resting pose in the fan. Defined ONCE and reused by the initial
   set, the inertia bounds, and both return tweens — previously the hover paths
   recomputed it as `dist * lift * dist * lift` (= dist^2 * lift^2 = 2025px for
   the outer cards) instead of `lift * dist^2` (= 45px), so hovering flung a
   card ~2000px down and out of view, and the inertia bounds were centred on
   that same wrong position. */
const restPose = (i: number) => {
  const dist = i - 1;
  return {
    rotation: FAN.angle * dist,
    x: FAN.spread * dist,
    y: FAN.lift * dist * dist,
  };
};

function ProcessCards({ reduceMotion }: { reduceMotion: boolean }) {
  const copy = useCopy();
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!cards.length) return;

    /* THE FAN IS DESKTOP-ONLY, and the whole effect lives inside matchMedia
       because of it.

       `restPose` spreads the cards 300px either side of centre. Applying it on
       a phone, where the deck is a `flex-col` of full-width cards, pushed card
       one to x -306 and card three to x 294 — i.e. one off the left edge and
       one 306px past the right, both rotated 5deg, overlapping each other and
       the section around them. (The overflow did not even register as
       horizontal page scroll, which is why it survived earlier passes: the
       cards were clipped, not scrollable.) The source fans them only in its
       `min-width: 992px` branch; below md here, they are three plain stacked
       cards with no transform at all.

       Nothing touch-driven is attached either: the tilt is a pointer effect,
       and `onMouseMove` on a React prop would ship to a phone that can never
       fire it. */
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      cards.forEach((el, i) => gsap.set(el, restPose(i)));
      if (reduceMotion) return;

      const entrance = gsap.from(cards, {
        rotation: 40,
        stagger: 0.07,
        ease: "elastic.out(1, 0.75)",
        duration: 1.5,
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      /* The tilt FOLLOWS the pointer; it is no longer an inertia flick.

         The flick was the reported chaos, and it had two causes. The bounds
         were enormous — plus or minus 320px of travel and 55 degrees — so a
         quick movement threw a card across its neighbours and elastically
         snapped it back. Worse, every `mousemove` started a FRESH inertia
         tween whose onComplete queued its own return tween, so a second of
         movement left dozens of competing tweens on one card, each with a
         different idea of where it should end up.

         `gsap.quickTo` writes to one property per card through a single
         reused tween, so there is nothing to stack. The pose is bounded by
         construction: 4 degrees and 10px around the resting fan, plus a 10px
         lift. It reads as a card leaning toward the cursor instead of being
         thrown by it. */
      const to = cards.map((el) => ({
        rotation: gsap.quickTo(el, "rotation", { duration: 0.5, ease: "power3.out" }),
        x: gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" }),
        y: gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" }),
      }));

      const cleanups = cards.map((el, i) => {
        const rest = restPose(i);
        const onMove = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          // -1 at one edge, 0 at the centre, +1 at the other
          const nx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
          const ny = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
          to[i].rotation(rest.rotation + nx * 4);
          to[i].x(rest.x + nx * 10);
          to[i].y(rest.y + ny * 10 - 10);
        };
        const onLeave = () => {
          to[i].rotation(rest.rotation);
          to[i].x(rest.x);
          to[i].y(rest.y);
        };
        el.addEventListener("mousemove", onMove);
        el.addEventListener("mouseleave", onLeave);
        return () => {
          el.removeEventListener("mousemove", onMove);
          el.removeEventListener("mouseleave", onLeave);
        };
      });

      return () => {
        entrance.scrollTrigger?.kill();
        entrance.kill();
        cleanups.forEach((fn) => fn());
        // Below md the cards must carry no transform at all.
        gsap.set(cards, { clearProps: "transform,rotate,translate,scale" });
      };
    });

    return () => mm.revert();
  }, [reduceMotion]);

  return (
    <Parallax
      reduceMotion={reduceMotion}
      distance={90}
      className="relative mx-auto max-w-[1200px] px-4 py-16 md:py-32"
    >
    <div ref={rootRef} className="relative mx-auto flex max-w-[1200px] flex-col items-center gap-10 md:h-[720px] md:flex-row md:justify-center md:gap-0">
      {copy.process.items.map((p, i) => (
        <div
          key={p.title}
          ref={(el) => {
            cardRefs.current[i] = el;
          }}
          /* `will-change` only under hover: the tilt is pointer-driven, so on
             touch it would be a permanently promoted layer for an effect that
             can never fire. */
          /* `md:-mx-[170px]` — half the card's own width, so the three
             occupy no width in the flex row and sit on one shared centre.
             The fan is what spreads them.

             Without it the row laid them out side by side at 340px centres
             AND the fan then pushed them another 300px apart, so the centres
             ended up 640px apart: the outer cards ran off both edges of a
             1440 viewport (measured left -112 and right 1508) and the
             overlapping hand-of-cards look was gone. */
          /* The 520px height is what makes three fanned cards the same size
             on desktop. On a phone they are stacked, nothing has to match,
             and the fixed height left between 50 and 220px of empty card
             under the copy depending on the locale — so there it hugs its
             content instead. */
          className="relative flex w-full max-w-[380px] shrink-0 flex-col justify-between gap-10 rounded-2xl bg-white p-8 text-[#1F1F1F] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.25)] hover:[will-change:transform] md:-mx-[170px] md:h-[520px] md:w-[340px] md:gap-0"
        >
          <div>
            <span className="text-xs font-medium tracking-[0.05em] text-[#1FDB93]">
              {`${copy.process.stepLabel} ${nn(i)}`}
            </span>
            <h3 className="mt-2 text-[36px] font-medium tracking-[-0.01em]">{p.title}</h3>
            <p className="mt-6 text-sm leading-relaxed text-[#1F1F1F]/80">{p.body}</p>
          </div>
          <ul className="flex flex-col gap-1 text-[11px] uppercase tracking-[0.05em]">
            {/* Alternates within the brand palette. The second colour was
                #1049CC — the old JACK3D blue left over from the clone, which is
                not in the Epic palette at all. See the contrast note in
                brand.md: both of these read low-contrast on a white card. */}
            {p.items.map((tag, ti) => (
              <li
                key={tag}
                className={ti % 2 === 0 ? "text-[#1FDB93]" : "text-[#21976A]"}
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    </Parallax>
  );
}

/* ============================================================================
   INTRO PRELOADER

   Adapted from nbnzia.com's loader (teardown + frames:
   .tasks/clone-nbnzia/loader-research.md).

   The idea worth taking is structural, not decorative: the image box is a
   sibling BETWEEN the two halves of the logotype, so it reads as a glyph
   inside the mark before it grows to fill the screen. EDH's lockup already has
   the seam for it - the vertical rule between the mark and the wordmark - so
   the slot opens exactly where the logo's own divider sits.

   What is deliberately NOT taken is the duration. The source runs 5.9s with
   scroll locked and replays in full on every visit (verified: both web
   storages empty, and a reload locked scroll for another 5.7s). Its
   full-screen image becomes the LCP element, so a loader that long directly
   inflates Core Web Vitals - working against the SEO work in
   .tasks/clone-nbnzia/seo-geo.md. This runs ~2.2s, once per session.
   ========================================================================= */

function Preloader({ onDone }: { onDone: () => void }) {
  /* Once the intro is over the overlay must leave the DOM entirely. Leaving it
     at opacity 0 looks finished but is still a full-screen, fixed,
     z-index 100000 element with `pointer-events: auto` - it would silently
     swallow every click on the page. */
  const [finished, setFinished] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const growRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const row = rowRef.current;
    const mark = markRef.current;
    const word = wordRef.current;
    const spacer = spacerRef.current;
    const grow = growRef.current;
    const html = document.documentElement;

    // The pre-paint script in layout.tsx is the single source of truth for
    // whether the intro runs at all. If it did not stamp the attribute
    // (repeat visit, reduced motion, storage blocked), hand off immediately.
    if (!root || !row || !mark || !word || !spacer || !grow || html.dataset.intro !== "play") {
      setFinished(true);
      onDone();
      return;
    }

    html.classList.add("intro-lock");

    /* The picture is ONE fixed, full-viewport layer; the slot in the logotype
       is only a clip window onto it. Growing an <img> inside the slot instead
       would re-crop and rescale it every frame, so the frame that lands at
       full size would not match the hero underneath. This way the final frame
       is pixel-identical to the hero and the handoff is invisible. */
    const syncClip = () => {
      const r = spacer.getBoundingClientRect();
      grow.style.clipPath = `inset(${r.top}px ${window.innerWidth - r.right}px ${
        window.innerHeight - r.bottom
      }px ${r.left}px)`;
    };

    let ctx: gsap.Context | null = null;

    const cleanup = () => {
      gsap.ticker.remove(syncClip);
      html.classList.remove("intro-lock");
    };

    ctx = gsap.context(() => {
      const markW = mark.offsetWidth;
      const wordW = word.offsetWidth;
      const slotH = Math.round(mark.offsetHeight * 0.72);
      const slotW = Math.round(Math.min(window.innerWidth * 0.17, 220));

      gsap.set(spacer, { width: 0, height: slotH });

      /* Re-declare the masked start position through GSAP rather than relying
         on the inline `translateY(115%)` in the markup.

         getComputedStyle resolves that percentage to a matrix, so GSAP reads
         it back as `y: 110.4px, yPercent: 0` - it cannot recover the fact that
         it was ever a percentage. Tweening `yPercent` to 0 would then animate
         0 -> 0 (a no-op) and leave the 110px offset in place, which keeps both
         halves clipped inside their masks for the whole intro. Setting
         yPercent explicitly (and zeroing y) hands GSAP the authoritative
         value; the rendered position is identical, so there is no jump. */
      gsap.set([mark.firstElementChild, word.firstElementChild], {
        yPercent: 115,
        y: 0,
      });

      syncClip();
      gsap.ticker.add(syncClip);

      const tl = gsap.timeline({
        onComplete: () => {
          cleanup();
          // onDone already fired at 1.72s; this only drops the overlay.
          setFinished(true);
        },
      });

      tl
        // 1. the two halves rise out of their masks, staggered
        .to(mark.firstElementChild, { yPercent: 0, duration: 0.75, ease: "expo.out" }, 0)
        .to(word.firstElementChild, { yPercent: 0, duration: 0.75, ease: "expo.out" }, 0.1)
        // 2. the seam opens into a window on the image
        .to(spacer, { width: slotW, duration: 0.42, ease: "power3.out" }, 0.72)
        // 3. the window grows to the full viewport, pushing the lockup off
        //    both edges.
        .to(
          spacer,
          {
            width: window.innerWidth,
            height: window.innerHeight,
            duration: 0.85,
            ease: "power3.inOut",
          },
          1.2
        )
        /* The mark and the wordmark are different widths (roughly 247 vs 471
           at full size), so the slot's centre sits (markW - wordW) / 2 away
           from the viewport centre. Without this correction the full-screen
           frame lands visibly off-centre and the handoff to the hero jumps. */
        .to(row, { x: (wordW - markW) / 2, duration: 0.85, ease: "power3.inOut" }, 1.2)
        .to(root, { opacity: 0, duration: 0.42, ease: "power2.out" }, 1.86)
        /* Release the page's own entrance BEFORE the cover has finished
           clearing, so the headline is already in motion as the last of it
           fades. Firing this on completion instead made arrival read as two
           separate events - cover goes, then text starts - which is most of
           what felt abrupt. */
        .add(onDone, 1.72);
    }, root);

    return () => {
      cleanup();
      ctx?.revert();
    };
  }, [onDone]);

  if (finished) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="intro-overlay fixed inset-0 z-[100000] items-center justify-center overflow-hidden bg-[#0F0F0F]"
    >
      {/* Full-viewport image, revealed only through the clip window above.
          The inline clip-path is a zero-size rect at the centre so the first
          painted frame is not the whole picture - the effect that installs
          syncClip runs after paint. */}
      <div
        ref={growRef}
        className="absolute inset-0"
        style={{ clipPath: "inset(50% 50% 50% 50%)" }}
      >
        <Image
          src="/images/hero-poster.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div ref={rowRef} className="relative flex w-full items-center justify-center">
        {/* Inline translateY matches the GSAP start value so the lockup is not
            visible at rest for the frame before the timeline is built. */}
        <div ref={markRef} className="shrink-0 overflow-hidden">
          <div style={{ transform: "translateY(115%)" }}>
            <LogoMark className="h-[8.5vw] max-h-[96px] w-auto text-[#F5F2F2]" />
          </div>
        </div>
        {/* The seam. Zero width at rest; becomes the image window. */}
        <div ref={spacerRef} className="shrink-0" style={{ width: 0 }} />
        <div ref={wordRef} className="shrink-0 overflow-hidden">
          <div style={{ transform: "translateY(115%)" }}>
            <LogoWordmark className="h-[4.6vw] max-h-[52px] w-auto text-[#F5F2F2]" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   HERO MARK — the loop, seen through the E-D-H mark

   THREE PASSES, and what each one got wrong.

   1. The mark as a near-black silhouette over the clip, which is literally
      what the reference board shows. The board works because its photo is
      bright; this loop is dark, so a dark shape on it had nothing to read
      against and only its outline showed.
   2. An SVG knockout with a 16% wash inside and an emerald rim on the cut.
      The rim was the problem: the user called it "liniile alea desenate", and
      they were right — it read as a wireframe drawing rather than a shape, and
      the whole thing looked soft.
   3. This. No strokes anywhere, and the shape is made of TWO CSS-masked
      layers over the video:

        - the dim: near-black across the whole hero with the mark excluded, so
          the footage only plays at full strength inside the shape;
        - the tint: the accent at 32% inside the mark on `mix-blend-mode:
          screen`, which LIGHTENS the footage toward emerald instead of
          glazing it. That is what makes the shape crisp on a dark frame — the
          board's inside is brighter than its outside, not just greener.

   CSS masks rather than an inline <svg> mask, because `mix-blend-mode` has to
   blend against the VIDEO, and an <svg> root isolates its own content: a
   blended rect inside the SVG would composite against the SVG's transparent
   group and do nothing. Out here the layers are ordinary divs above the video
   in the same stacking context, so screen blending reaches it.

   The mask is the mark's own path data from logo.tsx, inlined as a data URI,
   so there is no extra request and the geometry cannot drift from the header's.
   ========================================================================= */

/** The mark as an alpha mask: opaque inside the shape, transparent outside. */
const MARK_MASK = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 740 284"><g fill="#fff">${MARK_PATHS_HERO.map(
    (d) => `<path d="${d}"/>`
  ).join("")}</g></svg>`
)}")`;

function HeroMark({ reduceMotion, y }: { reduceMotion: boolean; y: MotionValue<number> }) {
  return (
    <div aria-hidden className="hero-mark pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="hero-mark-inner absolute inset-0"
        style={
          {
            ...(reduceMotion ? {} : { y }),
            "--mark-mask": MARK_MASK,
          } as React.CSSProperties
        }
      >
        <div className="hero-mark-dim absolute inset-0" />
        <div className="hero-mark-tint absolute inset-0" />
      </motion.div>
    </div>
  );
}

/* ============================================================================
   THE APPLY BUTTON'S HANDOFF
   ========================================================================= */

/* The button under the headline and the one in the header are the same
   `TrickButton` at the same size; which of the two is live is a single class on
   <html>, so crossing the threshold costs no render (state here re-renders the
   whole page, mid-scroll, which is the thing the class exists to avoid).

   Two earlier versions of this are worth not repeating:

   - A scrubbed flight, where the hero's button physically travelled 1400px
     into the header's slot. It worked exactly as built and was wrong for the
     site: far too much motion for a page whose whole vocabulary is short,
     quiet, eased moves.
   - A cross-fade whose two halves moved in OPPOSITE directions - the hero's
     button dropped 12px while the header's came down from above. Nothing tied
     them together, so it read as two buttons blinking at each other rather
     than as one changing place.

   What is left is the small version of the right idea: the pair swaps while
   both slots are still on screen, the leaving button exits UPWARD and the
   arriving one enters FROM BELOW - both in the direction of travel - on a
   stagger, so the eye joins them up on its own. All of that is in globals.css.

   The threshold is 70px rather than 140: the nav hides past 120px, and a
   handoff that happens after the nav has gone is a handoff nobody sees. */
const APPLY_SWAP_PX = 70;

function useApplySwap() {
  useEffect(() => {
    const root = document.documentElement;
    const apply = () => {
      root.classList.toggle("past-hero", window.scrollY > APPLY_SWAP_PX);
    };
    apply();
    window.addEventListener("scroll", apply, { passive: true });
    return () => {
      window.removeEventListener("scroll", apply);
      root.classList.remove("past-hero");
    };
  }, []);
}

/* ============================================================================
   PAGE
   ========================================================================= */

export default function Site({ locale }: { locale: Locale }) {
  const copy = COPY[locale];
  const reduceMotion = usePrefersReducedMotion();

  /* Intro handoff.

     Deliberately NOT React state. `introDone` as state re-rendered this whole
     component at the exact frame the hero headline and header began their
     entrance, costing two dropped frames (69ms and 63ms, measured) and making
     the arrival stutter. The reveal is CSS instead (see `.intro-rise` /
     `.intro-fade` in globals.css); all this does is flip a class and release
     the scroll hold, neither of which renders anything. */
  const { navHidden, lenisRef } = useSmoothScrollNav(reduceMotion);

  /* Hero loop playback.

     Two gates, both refs rather than state so neither re-renders the page:
       - the intro must have finished (otherwise the loop advances behind the
         preloader and the handoff jumps), and
       - the hero must be on screen. Decoding 1080p video while the rest of the
         page scrolls is pure waste, and this page is long. */
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const heroInView = useRef(true);
  const introFinished = useRef(false);

  /* Source selection. `media` on <source> inside <video> is not reliably
     honoured by browsers, so choose it here instead. 1080p is 2.8MB and 720p
     is 1.1MB — on a phone the element is ~390px wide behind a scrim, so the
     smaller cut is indistinguishable and halves what the visitor pays for. */
  useEffect(() => {
    const v = heroVideoRef.current;
    if (!v) return;
    const small = window.matchMedia("(max-width: 900px)").matches;
    v.src = small ? "/videos/hero-loop-mobile.mp4" : "/videos/hero-loop.mp4";
  }, [reduceMotion]);

  const playHeroVideo = useCallback(() => {
    const v = heroVideoRef.current;
    if (!v || !introFinished.current || !heroInView.current) return;
    // Some browsers only honour `muted` as a PROPERTY; without this the
    // autoplay policy can reject play() on a video that is muted in markup.
    v.muted = true;
    void v.play().catch(() => {});
  }, []);

  useEffect(() => {
    const section = heroRef.current;
    const video = heroVideoRef.current;
    if (!section || !video) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        heroInView.current = entry.isIntersecting;
        if (entry.isIntersecting) playHeroVideo();
        else video.pause();
      },
      { threshold: 0 }
    );
    io.observe(section);
    return () => io.disconnect();
  }, [playHeroVideo, reduceMotion]);

  const handleIntroDone = useCallback(() => {
    // rAF so the hidden start state is guaranteed to have been painted; adding
    // the class in the same frame it first renders would skip the transition.
    requestAnimationFrame(() => {
      document.documentElement.classList.add("intro-done");
    });
    lenisRef.current?.start();
    introFinished.current = true;
    playHeroVideo();
    // lenisRef is a stable ref from useSmoothScrollNav; listed only because the
    // linter cannot see that across the hook boundary.
  }, [playHeroVideo, lenisRef]);

  /* Hero image parallax. Tracked against the hero section so the drift is tied
     to leaving the hero, not to absolute page position. */
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroImageY = useTransform(heroProgress, [0, 1], [0, 160]);
  /* The mark drifts the other way, and less, so the two layers separate as you
     leave the hero instead of travelling together. */
  const heroMarkY = useTransform(heroProgress, [0, 1], [0, -70]);

  /* Which Apply button is live - under the headline, or in the header. */
  useApplySwap();

  /* NOTE: sections still carry `data-nav-bg="light|dark"`. Nothing reads them
     right now — the header went back to `mix-blend-difference`, which derives
     its colour from the backdrop on its own. They are left in place because
     they are the hook for class-based nav colouring if the blend ever has to
     come out again for performance. */

  // Showreel Flip refs live here: the small box renders inside the About grid
  // and the big box after the marquee, so the page owns both targets.
  const scalingRef = useRef<HTMLDivElement>(null);
  const bigRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  useShowreelFlip({ scalingRef, bigRef, videoRef }, reduceMotion);

  return (
    <SiteProviders locale={locale}>
      {/* Outside <main>: that element carries `overflow-x-clip`, which can
          clip fixed-position descendants. */}
      <Preloader onDone={handleIntroDone} />
    <main className="relative w-full overflow-x-clip bg-[#F5F2F2] text-[#1F1F1F]">
      <SiteHeader navHidden={navHidden} home applySwap />

      {/* ============================================================
          HERO
          ============================================================ */}
      <section ref={heroRef} id="top" data-nav-bg="dark" className="relative h-[100svh] w-full overflow-hidden">
        {/* The layer is 130% tall and offset -15%, so a 160px drift can never
            expose an edge. The headline does NOT move — the image sliding
            under a fixed headline is what reads as depth. */}
        <motion.div
          aria-hidden
          className="absolute inset-x-0 -top-[15%] h-[130%] will-change-transform"
          style={reduceMotion ? undefined : { y: heroImageY }}
        >
          {reduceMotion ? (
            /* Reduced motion gets the still. `autoplay` on a looping background
               is exactly the kind of unrequested movement the preference is
               asking us not to start. */
            <Image
              src="/images/hero-poster.webp"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            /* NOT `autoPlay`: playback starts from the intro handoff (see
               handleIntroDone) so the loop is still on frame 0 while the
               preloader's growing image — the same poster frame — settles into
               place. With autoplay the video would be ~2.2s in by then and the
               handoff would visibly jump.

               `poster` is that same frame, so first paint is instant and the
               LCP element is a 76KB image rather than 2.8MB of video. */
            <video
              ref={heroVideoRef}
              className="h-full w-full object-cover"
              poster="/images/hero-poster.webp"
              loop
              muted
              playsInline
              /* `preload="none"` and NO <source> in markup on purpose: the
                 effect below picks the 1080p or the 720p file and only then
                 assigns src, so a phone never starts fetching the 2.8MB
                 desktop cut before we have chosen. The poster covers the gap,
                 and if JS never runs the poster is simply what you see. */
              preload="none"
            />
          )}
        </motion.div>

        {/* Legibility scrims.

            The clip is a montage: it opens on a black-and-white interior with
            blown-out windows dead centre, then moves through brand-emerald
            scenes. The headline sits on `mix-blend-mode: difference`, so
            without help it would flip between black and white as the scenes
            cut — unstable and hard to read.

            Two layers, both non-interactive and below the headline in paint
            order so the blend composites against them:
              1. a vertical black gradient — strongest at the top (behind the
                 nav), again through the headline band, and at the bottom
                 (behind the entity paragraph);
              2. a low emerald wash that pulls the black-and-white opening
                 scenes back toward the brand, so the section does not read as
                 monochrome for its first few seconds. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.34)_20%,rgba(0,0,0,0.52)_46%,rgba(0,0,0,0.52)_58%,rgba(0,0,0,0.40)_74%,rgba(0,0,0,0.88)_100%)]"
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[#0B3B2C]/25" />

        {/* ------------------------------------------------------------------
            THE MARK, at hero scale

            The E-D-H mark as a graphic rather than a logo: tall enough to run
            past the top and bottom of the section and pushed right so the play
            device is cut by the edge of the screen, which is what stops it
            reading as "a big logo" and starts it reading as geometry. The loop
            plays around it and through its counters.

            Near-black fill rather than a knockout: the hero's legibility work
            (two scrims, solid white headline, measured against the montage's
            brightest frames) depends on the band behind the copy staying dark,
            and a mask that let the video through where the mark is would undo
            that on the frames that open bright.

            It paints after the scrims and before the headline, so the copy is
            always on top. `h-[150%]` with `-top-[25%]` means the breathe can
            never pull an edge into view.
            --------------------------------------------------------------- */}
        <HeroMark reduceMotion={reduceMotion} y={heroMarkY} />

        {/* Left vignette, over the mark and under the copy.

            The board has one too, and here it is load-bearing rather than
            decorative: with the mark lit, the brightest pixel inside the
            headline's own box measured rgb(59,181,134) — white on that is
            2.58:1, under AA's 3.0 for large text. This pulls the left of the
            frame back down so the copy always has its band, whatever frame of
            the loop is showing. Desktop only: on a phone the mark sits below
            the copy and there is nothing to cover. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(to_right,rgba(3,10,8,0.93)_0%,rgba(3,10,8,0.88)_38%,rgba(3,10,8,0.45)_64%,rgba(3,10,8,0)_86%)] md:block"
        />
        {/* The phone's equivalent. The mark runs across the lower third there,
            so the copy needs its band top-down rather than left-right: the
            entity paragraph measured 2.27:1 over the lit mark, against AA's
            4.5 for body text. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(3,10,8,0.8)_0%,rgba(3,10,8,0.86)_52%,rgba(3,10,8,0.6)_72%,rgba(3,10,8,0)_92%)] md:hidden"
        />

        {/* Headline centred in the viewport, each line rising out of its own
            clipping mask on load.

            NOT on `mix-blend-mode: difference` any more. That worked over the
            old still, but `difference` only reads over a backdrop that is
            decisively dark or bright, and this montage sits in the middle:
            measured against the brightest pixel in the headline band, the
            blend gave a contrast ratio of 1.15-1.17 in four of the five scenes
            — invisible, where WCAG AA wants 3.0 for large text. Solid white
            over the scrim measures 4.27-8.91 across the same scenes.

            The HEADER still blends; it sits in a thin strip with its own
            heavier scrim above, and it reads correctly there. */}
        {/* Left-aligned from md up, which is what puts the copy on the dimmed
            side of the frame and the mark on the lit one — the arrangement on
            the board. Centred on a phone, where there is no room for two
            columns and the mark sits behind the whole width.

            Max 15 characters of measure: the two lines break where they are
            written, not wherever 1080px happens to fall. */}
        <div className="absolute inset-x-0 top-1/2 mx-auto max-w-[var(--site-max)] -translate-y-1/2 px-4 md:px-10">
          {/* One line per written line, never re-wrapped: `nowrap` plus a
              `vw` size from md up, so "NU POT LUCRA CU NOI." — the longest of
              the two locales at 20 characters — always fits the container
              instead of breaking into three ragged lines.

              The first word of the second line carries the accent. In English
              that is "CAN'T" and in Romanian "NU": the negation is the whole
              point of the sentence, so it is the word that should be in the
              brand colour rather than a fixed index into the string. */}
          <h1 className="text-[12.5vw] font-medium leading-[1.02] tracking-[-0.03em] text-white uppercase md:text-[5.9vw] md:leading-[0.98] md:whitespace-nowrap lg:text-[5.6vw] xl:text-[88px]">
            {[copy.hero.line1, copy.hero.line2].map((line, li) => {
              const words = line.split(" ");
              return (
                <span key={line} className="block overflow-hidden">
                  {words.map((word, wi) => {
                    /* Per WORD, not per line. A whole line rising as one block
                       is the move every site makes; the words arriving in
                       sequence reads as the sentence being spoken, and it
                       gives the accent word somewhere to land. */
                    const accent = li === 1 && wi === 0;
                    const delay = 0.08 + li * 0.26 + wi * 0.055;
                    return (
                      <span
                        key={`${word}-${wi}`}
                        className="intro-rise inline-block"
                        style={{ "--intro-delay": `${delay}s` } as React.CSSProperties}
                      >
                        {accent ? (
                          /* The brand colour arrives AFTER the word does: a
                             white word rises, then the accent wipes across it
                             left to right, in step with the tint lighting the
                             mark. Two stacked copies, because a colour cannot
                             be clipped on its own. */
                          <span className="relative inline-block">
                            <span aria-hidden className="hero-accent-wipe absolute inset-0 text-[#1FDB93]">
                              {word}
                            </span>
                            {word}
                          </span>
                        ) : (
                          word
                        )}
                        {wi < words.length - 1 ? " " : null}
                      </span>
                    );
                  })}
                </span>
              );
            })}
          </h1>

          {/* The row under the headline: Apply, then the entity paragraph
              beside it behind a hairline rule, which is how the reference
              board sets it.

              The button and the paragraph are SEPARATE elements on purpose.
              Apply carries `hero-apply`, so it fades out when you scroll past
              the hero and the header's own button takes over; the paragraph
              must not fade with it. It is the SEO/GEO brief's entity
              paragraph — the first indexable sentence stating what the company
              is and where — and copy that animates to `opacity: 0` on scroll
              is exactly the pattern that reads as hidden text.

              Column on a phone (the headline is centred there and there is no
              room for two), row from md up: button, rule, paragraph, all on
              the same baseline. */}
          <div className="mt-8 flex flex-col items-start gap-5 md:mt-11 md:flex-row md:items-center md:gap-7">
            <div
              className="hero-apply intro-fade shrink-0"
              style={{ "--intro-delay": "0.62s" } as React.CSSProperties}
            >
              <TrickButton href={localePath(locale, APPLY_PATH)} variant="base" className="h-12 md:h-14">
                {copy.nav.apply}
              </TrickButton>
            </div>

            <p
              className="intro-fade max-w-[38ch] text-left text-xs leading-relaxed tracking-[0.02em] text-white/80 md:max-w-[42ch] md:text-white/60 md:border-l md:border-white/20 md:pl-7"
              style={{ "--intro-delay": "0.74s" } as React.CSSProperties}
            >
              {copy.hero.entity}
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          ABOUT — statement + CTAs
          ============================================================ */}
      <section id="about" data-nav-bg="light" className="bg-[#F5F2F2] py-24">
        {/* Source `.article-wrapper` is an 8-column grid (172.5px cols, 4px
            gap) with the statement sitting at `grid-column: 4 / 9` — the right
            five columns — and the eyebrow list in the first three. */}
        <div className="mx-auto grid max-w-[var(--site-max)] grid-cols-1 gap-x-1 gap-y-10 px-4 md:grid-cols-8">
          <ul className="flex flex-col gap-1 self-start text-[11px] uppercase tracking-[0.02em] text-[#1F1F1F]/70 md:col-span-3">
            {copy.about.list.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {/* Source h3: 36px / 48px line-height, weight 500, colour #1F1F1F */}
          <Parallax
            reduceMotion={reduceMotion}
            distance={48}
            className="text-[26px] leading-[1.3333] font-medium tracking-[-0.01em] md:col-span-5 md:col-start-4 md:text-[36px]"
          >
            {/* Drifts against the static eyebrow list beside it. Both are in
                normal flow, so the progress actually advances (unlike anything
                inside the sticky work cards). */}
            <GradientWaveText
              reduceMotion={reduceMotion}
              paragraphs={copy.about.paragraphs}
            />
          </Parallax>

          {/* Second row. On the source the video's small box and the CTA row
              share a row and their BOTTOMS line up exactly (both end at
              y=1760): the box is 180 tall in the left columns, the buttons 56
              tall in the right. `self-end` on both is what aligns them. */}
          {/* This top margin sets the row's height, and because both cells are
              `self-end` it therefore sets the statement -> CTA gap:
              gap = rowGap(40) + (180 + mt - 56). The source's gap is 192px,
              so mt = 28px (mt-7). Changing it moves the video and the buttons
              together — they stay bottom-aligned. */}
          <div className="self-end md:col-span-3 md:mt-7">
            <ShowreelSmall scalingRef={scalingRef} videoRef={videoRef} />
          </div>
          <div className="flex flex-wrap gap-3 self-end md:col-span-5 md:col-start-4">
            <TrickButton href={localePath(locale, APPLY_PATH)} variant="orange">
              {copy.about.ctaPrimary}
            </TrickButton>
            <TrickButton href="#work" variant="base">
              {copy.about.ctaSecondary}
            </TrickButton>
          </div>
        </div>
      </section>

      {/* ============================================================
          SHOWREEL — Flip morph, scroll-scrubbed
          ============================================================ */}
      {/* ============================================================
          MARQUEE — stats strip. The showreel video is z-55 and absolutely
          positioned, so as it expands it passes OVER this strip.
          ============================================================ */}
      <StatsMarquee />

      {/* ============================================================
          SHOWREEL — big box; the Flip target
          ============================================================ */}
      <ShowreelBig bigRef={bigRef} />

      {/* ============================================================
          SERVICES
          ============================================================ */}
      <Services />

      {/* ============================================================
          CURVED DIVIDER 1 — sits before Work (per source's own quirk)
          ============================================================ */}
      <CurvedDivider
        text={copy.dividers.beforeWork}
        reduceMotion={reduceMotion}
        idSuffix="a"
      />

      {/* ============================================================
          WORK
          ============================================================ */}
      <WorkGrid reduceMotion={reduceMotion} />

      {/* ============================================================
          TESTIMONIALS
          ============================================================ */}
      <Testimonials reduceMotion={reduceMotion} />

      {/* CURVED DIVIDER 2 — REMOVED (2026-09-30, user's call). It carried
          "The order matters." between the testimonials and Process, and cost
          4320px of pinned scroll: 1080 for the pinned section plus 3240 of
          scrub distance. Divider 1, before Work, is still in place — one of
          these is a signature, two in a row on a page this long is a toll.
          `copy.dividers.beforeProcess` is deliberately left in content.ts in
          both locales, so putting it back is one JSX block. */}

      {/* ============================================================
          PROCESS — fanned playing cards
          ============================================================ */}
      <section id="process" className="bg-[#F5F2F2] pt-24">
        <div className="mx-auto max-w-[var(--site-max)] px-4">
          <EyebrowMarquee label={copy.eyebrow.process} />
        </div>
        <ProcessCards reduceMotion={reduceMotion} />
      </section>

      <ContactFooter reduceMotion={reduceMotion} />
    </main>
    </SiteProviders>
  );
}
