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

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { LogoMark, LogoWordmark } from "./logo";
import { COPY, type Locale, localePath } from "./content";
import { APPLY_PATH, servicePath } from "./routes";
import { motion, useScroll, useTransform } from "motion/react";
import { gsap, ScrollTrigger } from "./_components/gsap";
import { Flip } from "gsap/Flip";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { SiteProviders, useCopy, useLocale, usePrefersReducedMotion } from "./_components/context";
import { EyebrowMarquee, GradientWaveText, Parallax, StatsMarquee, TrickButton } from "./_components/ui";
import { nn } from "./_components/format";
import { HoverAccordion, MEDIA_H, MEDIA_W, mediaMotion } from "./_components/hover-accordion";
import { ContactFooter, SiteHeader, useSmoothScrollNav } from "./_components/chrome";
import { CurvedDivider } from "./_components/curved-divider";

if (typeof window !== "undefined") {
  // ScrollTrigger itself is registered (and configured) in _components/gsap.
  gsap.registerPlugin(Flip, InertiaPlugin);
}

/* ============================================================================
   DATA
   ========================================================================= */

/* Copy lives in content.ts, keyed by locale. What stays here is the data that
   is NOT language-dependent - colours, images and ordering - merged with the
   copy by index at render time. Keeping them separate means a translation can
   never accidentally change a brand colour or drop an image. */

const WORK_VISUALS = [
  { bg: "#1FDB93", fg: "#1F1F1F", img: "/images/work-auto.webp" },
  { bg: "#1F1F1F", fg: "#F5F2F2", img: "/images/work-dental.webp" },
  { bg: "#D2F9EA", fg: "#1F1F1F", img: "/images/work-agro.webp" },
  { bg: "#DB641F", fg: "#1F1F1F", img: "/images/work-hotel.webp" },
  { bg: "#E2B736", fg: "#1F1F1F", img: "/images/work-events.webp" },
  { bg: "#21976A", fg: "#F5F2F2", img: "/images/work-industrial.webp" },
];

const SERVICE_IMAGES = [
  "/images/about-strategy.webp",
  "/images/about-design.webp",
  "/images/hero-laptop.webp",
  "/images/exclusivity-door.webp",
  "/images/about-production.webp",
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

/* Big box 1408x792 (16:9), anchored to the container's LEFT edge (x=241, same
   as the small box). Section pb 96px.
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
      <div className="mx-auto w-full max-w-[1440px] px-4">
        <div
          ref={bigRef}
          /* 218px is the desktop figure derived from the source. On mobile
             that reserved ~550px of mostly-empty scroll, so the gap is much
             tighter there while the morph itself is preserved. */
          className="mt-24 aspect-video w-full max-w-[1408px] md:mt-[218px]"
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
      <div className="mx-auto max-w-[1440px] px-4">
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
              className="group relative grid cursor-default gap-4 border-b border-white/15 py-8 transition-[padding] duration-500 ease-out md:grid-cols-8 md:gap-8 md:hover:pl-6"
            >
              {/* Emerald sweep along the row's bottom edge — the same
                  origin-left scaleX idiom as the footer email underline, so the
                  hover reads as part of the same site. */}
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-px left-0 h-0.5 w-full origin-left scale-x-0 bg-[#1FDB93] transition-transform duration-500 ease-out group-hover:scale-x-100"
              />
              <p className="text-xs tracking-[0.15em] text-[#1FDB93] uppercase opacity-70 transition-opacity duration-300 ease-out group-hover:opacity-100 md:col-span-3">
                {t.name}
              </p>
              <p className="text-sm leading-relaxed text-white/60 transition-colors duration-300 ease-out group-hover:text-white/95 md:col-span-5">
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
   WORK — stacked case slides

   Source mechanism (measured live on nbnzia.com):
   `.section-case` (overflow hidden, 5 x 100vh) holds five `.case-slide`s. Each
   slide's `.case-content-wrapper` is GSAP-pinned for exactly one viewport
   height (its pin-spacer is 2160 = 2 x 1080), and while pinned the inner
   `.case-content` is scrubbed DOWN in scale so the card recedes into the
   background as the next slide rides over it:

       progress 0.00 -> scale 1.0     (holds through ~0.25)
       progress 0.48 -> scale 0.9979
       progress 0.72 -> scale 0.9888
       progress 1.00 -> scale 0.9667   (at unpin)

   That hold-then-accelerate shape is ~`power3.in`.

   Reproduced here with native `position: sticky` for the pinning (smoother
   and cheaper than a GSAP pin, and it avoids adding five more pinned
   ScrollTriggers to a page that already contends over GSAP's shared update
   state) plus one scrubbed tween per card for the scale.
   ========================================================================= */

function WorkStack({ reduceMotion }: { reduceMotion: boolean }) {
  const copy = useCopy();
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (reduceMotion) return;
    const tweens: gsap.core.Tween[] = [];
    const revealTls: gsap.core.Timeline[] = [];
    // Everything the reveal writes inline, so cleanup can hand the DOM back
    // untouched — otherwise a re-run reads the hidden state as the resting one.
    const revealEls: HTMLElement[] = [];
    const lastIndex = cardRefs.current.length - 1;

    cardRefs.current.forEach((inner, i) => {
      if (!inner) return;
      const slide = inner.parentElement;
      if (!slide) return;
      const isLast = i === lastIndex;

      // The card does NOT merely scale — it tilts away in 3D. Decomposing the
      // source's matrix3d at rest gives a uniform scale of ~0.70 combined with
      // rotateX ~40deg (its rendered height collapses 1080 -> 634) and a slight
      // rotateZ ~2deg. Perspective (4762.5px = 250vw) sits on the wrapper and
      // the pivot is `center 10%`, near the card's top edge, so it hinges
      // backwards rather than shrinking toward its middle.
      tweens.push(
        gsap.fromTo(
          inner,
          { scale: 1, rotateX: 0, rotateZ: 0 },
          {
            scale: 0.7,
            rotateX: 40,
            rotateZ: 2,
            ease: "power2.in",
            scrollTrigger: {
              trigger: slide,
              start: "top top",
              end: isLast ? "+=200%" : "+=150%",
              scrub: true,
              invalidateOnRefresh: true,
              // promote only while this card is actually being scrubbed
              onToggle: (self) => {
                inner.style.willChange = self.isActive ? "transform" : "auto";
              },
            },
          }
        )
      );

      /* Entrance reveal, measured off the source's `.case-content`:

           .case-content_image-warpper  clip-path: inset(0% 0% 100%) -> inset(0%)
           .case-content_image          translateY(-72.075px) -> 0
                                        (-72.075 / 601 tall = -12%)
           .case-text / copy / link     translateY(50px), opacity 0 -> 0, 1

         The image is NOT a fade or a slide: the wrapper unclips downward while
         the picture itself counter-moves down into place, so the frame opens
         top-to-bottom and the image settles rather than travelling. The
         counter-move is what stops it reading as a slide.

         The counter-move can never expose a gap at the bottom edge: at
         progress p the frame is open to p*H while the image covers to
         H*(1 - 0.12*(1-p)), and 1 - 0.12 + 0.12p >= p holds for all p <= 1.

         Timings from the source's own run (~1.06s end to end): elements settle
         at 9511 / 9657 / 9803 / 9949ms - an even ~145ms stagger - with the
         image finishing alongside the last of the text.

         One-shot, not scrubbed: the recording shows it playing out on its own
         timeline while the scroll position sat still. */
      const texts = inner.querySelectorAll<HTMLElement>("[data-reveal-text]");
      const imgWrap = inner.querySelector<HTMLElement>("[data-reveal-image]");
      const img = imgWrap?.querySelector("img") ?? null;

      /* Resting opacity is DECLARED per element (`data-reveal-opacity`), not
         read back from computed style.

         The tag and body carry Tailwind `opacity-60` / `opacity-90`, so a
         blanket tween to opacity 1 would animate those muted paragraphs up to
         full strength and quietly change the design. Reading the value live
         looks like the fix and is not: React double-invokes effects in dev, so
         the second pass reads the ALREADY-HIDDEN element and gets "0" - and
         `parseFloat("0") || 1` is 1, because 0 is falsy. Both paragraphs
         silently ended up fully opaque. An attribute cannot drift out from
         under the animation like that. */
      const items = Array.from(texts).map((el) => {
        const raw = el.dataset.revealOpacity;
        return { el, to: raw == null ? 1 : Number(raw) };
      });
      items.forEach(({ el }) => gsap.set(el, { y: 50, opacity: 0 }));
      revealEls.push(...items.map((it) => it.el));
      if (imgWrap) revealEls.push(imgWrap);
      if (img) revealEls.push(img);

      if (imgWrap) {
        gsap.set(imgWrap, { clipPath: "inset(0% 0% 100% 0%)" });
        if (img) gsap.set(img, { yPercent: -12 });
      }

      const revealTl = gsap.timeline({
        scrollTrigger: {
          trigger: slide,
          // as the card climbs into view, before it pins at the top
          start: "top 75%",
          once: true,
          invalidateOnRefresh: true,
        },
      });
      items.forEach(({ el, to }, k) => {
        revealTl.to(
          el,
          { y: 0, opacity: to, duration: 0.9, ease: "power3.out" },
          0.145 * k
        );
      });
      if (imgWrap) {
        revealTl.to(
          imgWrap,
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.05, ease: "power3.out" },
          0.15
        );
        if (img) {
          revealTl.to(img, { yPercent: 0, duration: 1.05, ease: "power3.out" }, 0.15);
        }
      }
      revealTls.push(revealTl);

      // The last card is never covered by another, so on the source it also
      // fades out (opacity 1 -> ~0.2 while scaling to ~0.77) and dissolves
      // into the cream page background before the next section arrives.
      if (isLast) {
        tweens.push(
          gsap.fromTo(
            inner,
            { opacity: 1 },
            {
              // Nothing covers the last card, so it has to leave on its own —
              // fade it out completely rather than leaving a ghost behind.
              opacity: 0,
              ease: "power1.in",
              scrollTrigger: {
                trigger: slide,
                start: "top top",
                end: "+=200%",
                scrub: true,
                invalidateOnRefresh: true,
              },
            }
          )
        );
      }
    });

    return () => {
      tweens.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
      revealTls.forEach((tl) => {
        tl.scrollTrigger?.kill();
        tl.kill();
      });
      if (revealEls.length) gsap.set(revealEls, { clearProps: "all" });
    };
  }, [reduceMotion]);

  return (
    <section id="work" className="relative">
      {copy.work.items.map((w, i) => {
        const v = WORK_VISUALS[i];
        return (
        <div
          key={w.name}
          /* Source `.case-content-wrapper`: #F5F2F3 (what shows through as the
             card recedes) and `perspective: 4762.5px` on a 1905px viewport —
             i.e. 250vw. Overflow stays visible so the tilted card isn't
             clipped. */
          data-nav-bg={v.fg === "#1F1F1F" ? "light" : "dark"}
          className="sticky top-0 h-[100svh] w-full bg-[#F5F2F3] [perspective:250vw]"
        >
          <div
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            /* Source pivot is `952.5px 108px` on a 1905x1080 card = center 10%,
               so the card hinges from near its top edge. */
            /* No permanent `will-change` — it is set by the tilt's own
               ScrollTrigger while that card is being scrubbed (see onToggle in
               the effect above). Six full-screen 3D layers held promoted for
               the whole page is ~1170x2532px of compositor memory each at
               DPR 3, which is what made mobile stutter. */
            className="grid h-full w-full grid-cols-1 items-center gap-10 px-4 py-16 [transform-origin:center_10%] [transform-style:preserve-3d] md:grid-cols-2 md:px-10"
            style={{ backgroundColor: v.bg, color: v.fg }}
          >
            <div className="flex h-full flex-col justify-between py-8">
              <div className="flex items-start justify-between">
                <h3
                  data-reveal-text
                  className="text-[40px] font-medium tracking-[-0.02em] uppercase md:text-[48px]"
                >
                  {w.name}
                </h3>
                <span data-reveal-text className="text-2xl md:text-[32px]">
                  ({nn(i)})
                </span>
              </div>
              <p
                data-reveal-text
                data-reveal-opacity="0.6"
                className="mt-3 text-xs tracking-[0.15em] uppercase opacity-60"
              >
                {w.tag}
              </p>
              <p
                data-reveal-text
                data-reveal-opacity="0.9"
                className="max-w-[420px] text-sm leading-relaxed whitespace-pre-line opacity-90"
              >
                {w.body}
              </p>
              <a
                href="#"
                data-reveal-text
                className="group inline-flex w-fit items-center gap-2 text-sm tracking-[0.05em] uppercase"
              >
                {copy.work.visit}
                <span className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
                  ↗
                </span>
              </a>
            </div>
            <div
              data-reveal-image
              className="relative aspect-[4/3] w-full overflow-hidden md:w-[90%] md:justify-self-end"
            >
              {/* NO parallax here. These cards are `position: sticky`, so once
                  a card pins, nothing inside it moves relative to the viewport
                  and scroll progress freezes — measured -15px then 0, 0. Sticky
                  and parallax cannot coexist. The cards already have the 3D
                  recede, which is the depth cue for this section. */}
              <Image
                src={v.img}
                alt={`${w.name} project preview`}
                fill
                sizes="(min-width: 768px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
        );
      })}
      {/* Extra scroll room so the last card can recede and fade out IN PLACE
          against the cream background, instead of just scrolling away — the
          source keeps animating it well past the end of `.section-case`. */}
      <div className="h-[100svh] w-full bg-[#F5F2F3]" aria-hidden />
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
      <div className="mx-auto max-w-[1440px] px-4">
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
  const lastPoint = useRef<Record<number, { x: number; y: number; t: number }>>({});

  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!cards.length) return;

    cards.forEach((el, i) => {
      gsap.set(el, restPose(i));
    });

    if (reduceMotion) return;

    const tween = gsap.from(cards, {
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

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [reduceMotion]);

  const handleMove = useCallback(
    (i: number) => (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduceMotion) return;
      const el = cardRefs.current[i];
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const offsetX = e.clientX - (rect.left + rect.width / 2);
      const offsetY = e.clientY - (rect.top + rect.height / 2);
      const now = performance.now();
      const prev = lastPoint.current[i];
      let velX = 0;
      let velY = 0;
      if (prev) {
        const dt = Math.max((now - prev.t) / 1000, 1 / 120);
        velX = (e.clientX - prev.x) / dt;
        velY = (e.clientY - prev.y) / dt;
      }
      lastPoint.current[i] = { x: e.clientX, y: e.clientY, t: now };

      const rest = restPose(i);
      const torque = (offsetX * velY - offsetY * velX) / 6000;

      gsap.to(el, {
        inertia: {
          resistance: 130,
          rotation: {
            velocity: torque,
            min: rest.rotation - 55,
            max: rest.rotation + 55,
          },
          x: {
            velocity: velX / 8,
            min: rest.x - 320,
            max: rest.x + 320,
          },
          y: {
            velocity: velY / 8,
            min: rest.y - 320,
            max: rest.y + 320,
          },
        },
        onComplete: () => {
          gsap.to(el, { ...rest, duration: 0.8, ease: "power3.out" });
        },
      });
    },
    [reduceMotion]
  );

  const handleLeave = useCallback(
    (i: number) => () => {
      lastPoint.current[i] = undefined as unknown as { x: number; y: number; t: number };
      if (reduceMotion) return;
      const el = cardRefs.current[i];
      if (!el) return;
      gsap.to(el, {
        ...restPose(i),
        duration: 1,
        ease: "elastic.out(1, 0.6)",
      });
    },
    [reduceMotion]
  );

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
          onMouseMove={handleMove(i)}
          onMouseLeave={handleLeave(i)}
          /* `will-change` only under hover: the tilt is pointer-driven, so on
             touch it would be a permanently promoted layer for an effect that
             can never fire. */
          className="relative flex h-[520px] w-full max-w-[380px] shrink-0 flex-col justify-between rounded-2xl bg-white p-8 text-[#1F1F1F] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.25)] hover:[will-change:transform] md:w-[340px]"
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
      <SiteHeader navHidden={navHidden} home />

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
        <h1 className="absolute inset-x-0 top-1/2 mx-auto max-w-[1080px] -translate-y-1/2 px-4 text-center text-[10.5vw] font-normal leading-[1.02] uppercase tracking-[-0.03em] text-white md:px-10 md:text-[96px] md:leading-[1]">
          {[copy.hero.line1, copy.hero.line2].map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <span
                className="intro-rise block"
                style={{ "--intro-delay": `${0.08 + i * 0.2}s` } as React.CSSProperties}
              >
                {line}
              </span>
            </span>
          ))}
        </h1>

        {/* Entity paragraph, required by the SEO/GEO brief: the first indexable
            paragraph must state plainly what the company is and where. Kept
            visible (not sr-only — hidden keyword text is a cloaking risk) and
            sat low in the hero so the centred headline is unaffected. */}
        <p className="absolute inset-x-0 bottom-6 mx-auto max-w-[46ch] px-6 text-center text-[11px] leading-relaxed tracking-[0.02em] text-white/55 md:bottom-8 md:text-xs">
          {copy.hero.entity}
        </p>
      </section>

      {/* ============================================================
          ABOUT — statement + CTAs
          ============================================================ */}
      <section id="about" data-nav-bg="light" className="bg-[#F5F2F2] py-24">
        {/* Source `.article-wrapper` is an 8-column grid (172.5px cols, 4px
            gap) with the statement sitting at `grid-column: 4 / 9` — the right
            five columns — and the eyebrow list in the first three. */}
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-x-1 gap-y-10 px-4 md:grid-cols-8">
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
      <WorkStack reduceMotion={reduceMotion} />

      {/* ============================================================
          TESTIMONIALS
          ============================================================ */}
      <Testimonials reduceMotion={reduceMotion} />

      {/* ============================================================
          CURVED DIVIDER 2 — sits before Process
          ============================================================ */}
      <CurvedDivider
        text={copy.dividers.beforeProcess}
        reduceMotion={reduceMotion}
        idSuffix="b"
      />

      {/* ============================================================
          PROCESS — fanned playing cards
          ============================================================ */}
      <section id="process" className="bg-[#F5F2F2] pt-24">
        <div className="mx-auto max-w-[1440px] px-4">
          <EyebrowMarquee label={copy.eyebrow.process} />
        </div>
        <ProcessCards reduceMotion={reduceMotion} />
      </section>

      <ContactFooter reduceMotion={reduceMotion} />
    </main>
    </SiteProviders>
  );
}
