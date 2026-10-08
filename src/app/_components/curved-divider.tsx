"use client";

/* Moved out of site.tsx unchanged, so the home page's two dividers and the
   one on /services are the same component. `reduceMotion` is optional: the
   home page passes the value it already holds, a subpage lets it read the
   preference itself. */

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "./gsap";
import { useCopy, usePrefersReducedMotion } from "./context";
import { EyebrowMarquee } from "./ui";

const CURVE_PATH =
  "M -700 252 C -470 200 -230 145 0 92.0674 C 528.5 -28.9327 977.5 -32.4328 1516.5 92.0674 C 1745 145 1980 200 2216 252";

/** The SVG's own viewBox width - what one user unit is measured against. */
const VIEWBOX_W = 1516;

/* How fast the text crosses the screen, in CSS pixels of text per pixel of
   scroll. This is the one number that sets the feel, and it is the source's
   own: 3240px of pin carried 7271px of text travel on a 1440 desktop, so 2.24.

   The pin distance is DERIVED from it rather than hardcoded, because the travel
   is not a constant - it is the length of the sentence in the current font size
   at the current render scale. A fixed 3240 was fine while the only case was a
   desktop, but on a phone the type is 340px against a 0.26 render scale, so the
   same sentence has 3879px of travel instead of 7271 and the identical pin made
   it crawl: the section ran out of scroll with the sentence still mid-screen.
   Deriving it gives the phone ~1730px, which both matches the desktop's speed
   and takes 1500px of scroll out of the page. */
const TEXT_PX_PER_SCROLL_PX = 2.24;



/* ============================================================================
   CURVED TEXT DIVIDER — SVG textPath, GSAP ScrollTrigger scrub on startOffset
   ========================================================================= */

export function CurvedDivider({
  text,
  reduceMotion: reduceMotionProp,
  idSuffix,
  eyebrow,
}: {
  text: string;
  /** omit to read the user preference here */
  reduceMotion?: boolean;
  idSuffix: string;
  /** label for the strip above the curve; defaults to the "Process" eyebrow */
  eyebrow?: string;
}) {
  const copy = useCopy();
  const reduceMotionPref = usePrefersReducedMotion();
  const reduceMotion = reduceMotionProp ?? reduceMotionPref;
  const pinRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const textPathRef = useRef<SVGTextPathElement>(null);
  const pathId = `mwg032-path-${idSuffix}`;

  /* Width only: a phone firing `resize` as its address bar hides must not
     rebuild the pin mid-gesture. Rotation changes the width, so it is covered. */
  const [widthKey, setWidthKey] = useState(0);
  useEffect(() => {
    let t = 0;
    let last = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth === last) return;
      last = window.innerWidth;
      window.clearTimeout(t);
      t = window.setTimeout(() => setWidthKey((k) => k + 1), 200);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);

  useEffect(() => {
    const path = pathRef.current;
    const textPath = textPathRef.current;
    if (!path || !textPath) return;

    let cancelled = false;
    let built: ScrollTrigger[] = [];

    const build = () => {
      if (cancelled) return;
      // a rebuild replaces the previous pin rather than stacking a second one
      built.forEach((st) => st.kill());
      built = [];

      // Measured off the source across a full pin: startOffset runs
      // 82.7% -> -150.87%. It does NOT start off-path - at progress 0 the text
      // is already on screen (its left edge sits at x~33 on a 1905px viewport)
      // and it simply travels left from there.
      //
      // Start: 82.7 is the source's own measured value - it parks the text just
      // off the right edge, and the lead-in trigger below walks it into view as
      // the section approaches.
      const startOffset = 82.7;

      // End: MUST be derived from THIS string's length, not hardcoded. -150.87
      // was measured off the source and only ever cleared the source's own
      // sentence; with our (longer) copy the text stopped with ~700px still on
      // screen, froze there, and then dragged down over the next section.
      // -(textLength / pathLength) * 100 is exactly the point at which the
      // trailing glyph passes the start of the path, whatever the copy says.
      const totalLength = path.getTotalLength();
      const textLength =
        typeof textPath.getComputedTextLength === "function"
          ? textPath.getComputedTextLength()
          : totalLength;

      /* One user unit renders as `unit` CSS px - the SVG is squeezed to fit the
         width, so this is 1.045 on a desktop and 0.28 on a phone. Everything
         below that wants to be a real on-screen distance goes through it. */
      const unit = (textPath.ownerSVGElement?.getBoundingClientRect().width ?? VIEWBOX_W) / VIEWBOX_W;

      /* The bare ratio, no safety margin, verified by counting dark pixels in
         the arc's band rather than by reading a box: the screen is empty from
         ~97% of the pin on a phone, and from ~95% on a desktop. A margin here
         only buys more empty scroll at the tail.

         Worth knowing if this ever needs re-checking: `getBoundingClientRect`
         on a `<textPath>` does NOT track the glyphs. It reported the same
         `-63..26` box at both ends of the sweep, which read as "26px of the
         last letter is still on screen" and sent me adding a clearance that
         was not needed. Count pixels. */
      const endOffset = -((textLength / totalLength) * 100);
      textPath.setAttribute("startOffset", `${startOffset}%`);

      if (reduceMotion || !pinRef.current || !stickyRef.current) return;

      // the pin's length, derived from the travel rather than fixed
      const travel = ((startOffset - endOffset) / 100) * totalLength * unit;
      const pinDistance = Math.max(600, Math.round(travel / TEXT_PX_PER_SCROLL_PX));

      // TWO triggers, because the pin and the text animation do NOT start at the
      // same point on the source.
      //
      // Measured on nbnzia.com, offsets relative to its pin top:
      //   -300 -> 82.70%   (not yet moving)
      //   -100 -> 74.91%   (already animating, BEFORE the pin engages)
      //      0 -> 67.70%   (pin starts, text already well into its travel)
      //   +150 -> 56.89%
      //
      // Driving both from one `start: "top top"` trigger left the text frozen in
      // place while the section scrolled into view - it just sat there rather
      // than animating in. The pin must still engage at "top top" (otherwise the
      // section freezes before it fills the screen), so the scrub gets its own
      // trigger that starts a quarter-viewport earlier.
      const pinST = ScrollTrigger.create({
        trigger: pinRef.current,
        start: "top top",
        end: `+=${pinDistance}`,
        pin: stickyRef.current,
        scrub: true,
      });

      const LEAD = Math.round(window.innerHeight * 0.25);
      const textST = ScrollTrigger.create({
        trigger: pinRef.current,
        start: "top 25%",
        end: `+=${pinDistance + LEAD}`,
        scrub: true,
        onUpdate: (self) => {
          const val = gsap.utils.interpolate(startOffset, endOffset, self.progress);
          textPath.setAttribute("startOffset", `${val}%`);
        },
      });

      built = [pinST, textST];
      // the pin spacer just changed the document's height
      ScrollTrigger.refresh();
    };

    /* Build NOW, and build again when the webfont lands.

       Both halves matter. The measurement is worthless until the font is in -
       `getComputedTextLength` against a fallback face returns a different
       advance, and at 340px that error is hundreds of user units, enough to
       leave the sentence frozen mid-screen when the pin runs out. But waiting
       for the font before the FIRST build means the pin-spacer (and with it
       ~3000px of this page's height) appears late, and anything holding a
       cached page height - Lenis, notably - is then wrong about where the page
       ends. So the pin exists from the first frame on a fallback measurement,
       and is rebuilt once with the real one. */
    build();
    if (document.fonts && document.fonts.status !== "loaded") {
      void document.fonts.ready.then(build);
    }

    return () => {
      cancelled = true;
      built.forEach((st) => st.kill());
    };
  }, [text, reduceMotion, widthKey]);

  return (
    /* NO explicit height here. GSAP's pin creates its own pin-spacer
       (element height 1080 + pin distance 3240 = 4320), which is exactly what
       the source's spacer measures. Setting height:4320 as well double-counted
       the scroll — the section ate ~7560px and left a long empty tail after
       the text had finished animating. */
    <div ref={pinRef} data-nav-bg="light" className="relative bg-[#F5F2F2] text-[#1F1F1F]">
      <div
        ref={stickyRef}
        className="flex h-screen flex-col items-center justify-center overflow-hidden"
      >
        <div className="absolute top-16 w-full px-4">
          <EyebrowMarquee label={eyebrow ?? copy.eyebrow.process} />
        </div>
        <svg
          width="1516"
          height="300"
          viewBox="0 -208 1516 300"
          /* Do NOT stretch this to the container width. The source's SVG
             renders at its intrinsic viewBox width (1516) and is then scaled
             1.1 -> 1668px inside a 1905px viewport. `w-full` stretched it to
             1905 -> 2096px, running the path past the right edge so the text
             sat off-screen for the first stretch of the pin — which read as a
             long blank scroll before anything appeared. */
          /* `curved-arc` carries the transform, and `curved-textpath-size` the
             font size, both in globals.css for the same reason: a phone needs
             different values for each, and an inline style cannot be put
             behind a media query (nor could a class outrank it if it were). */
          className="curved-arc w-[1516px] max-w-full shrink-0 overflow-visible"
          aria-hidden={false}
        >
          <path ref={pathRef} d={CURVE_PATH} id={pathId} fill="none" />
          <text>
            <textPath
              ref={textPathRef}
              href={`#${pathId}`}
              /* Size lives entirely in globals.css - an inline style would
                 outrank the class and reintroduce the quadratic shrink. */
              className="curved-textpath-size fill-current uppercase"
            >
              {text}
            </textPath>
          </text>
        </svg>
      </div>
    </div>
  );
}
