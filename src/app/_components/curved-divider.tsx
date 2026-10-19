"use client";

/* Moved out of site.tsx unchanged. Only the home page renders one now - the
   second divider and the one on /services are both gone, verified by querying
   for a `textPath` on each page in both motion modes - but it stays its own
   module so a page can mount one without pulling in site.tsx. `reduceMotion`
   is optional: the home page passes the value it already holds, a subpage
   would let it read the preference itself. */

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "./gsap";
import { useCopy, usePrefersReducedMotion } from "./context";
import { EyebrowMarquee } from "./ui";

/* The visible arc is the source's own curve, from x=-700 to x=2216. The long
   straight segment in front of it is ours, and it exists for Safari.

   WebKit does not render a NEGATIVE `startOffset` on a textPath: it clamps the
   offset to 0, so the text stops dead the instant the value crosses zero and
   every frame after that paints it in the same place. Measured in Playwright's
   WebKit against the live site - while the offset was positive the first
   glyph tracked 457 -> 288 -> 119 -> -48 -> -715 CSS px, and from the first
   negative value it read exactly 0 forever. Chromium extrapolates backwards off
   the start of the path instead, which is why every emulated phone was fine and
   a real iPhone was not. The sentence froze around "when you can".

   So the sweep must never ask for a negative offset. The lead-in gives it
   12000 user units of runway BEFORE the curve to travel through, which puts the
   whole range comfortably positive. It continues the curve's own opening slope
   (-52/230) so the join is tangent, and it lives at x -12700..-700, far off the
   left of a viewport that only shows x 69..1447 - the sticky wrapper's
   `overflow-hidden` keeps it out of sight. The offsets are derived from it at
   runtime rather than hardcoded, so editing this `d` cannot silently desync
   them. */
const CURVE_PATH =
  "M -12700 2964 L -700 252 C -470 200 -230 145 0 92.0674 C 528.5 -28.9327 977.5 -32.4328 1516.5 92.0674 C 1745 145 1980 200 2216 252";

/** Where the lead-in ends and the source's own curve begins. */
const CURVE_START_X = -700;

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

      const totalLength = path.getTotalLength();

      /* Everything below is in USER UNITS, not percentages, and every value is
         positive - see CURVE_PATH for why. `leadIn` is the length of the
         off-screen runway, found by bisecting for the x where the source's own
         curve begins, so it is read off the geometry instead of trusted. */
      const pointAt = (len: number) => path.getPointAtLength(len);
      let lo = 0;
      let hi = totalLength;
      for (let i = 0; i < 40; i++) {
        const mid = (lo + hi) / 2;
        if (pointAt(mid).x < CURVE_START_X) lo = mid;
        else hi = mid;
      }
      const leadIn = lo;
      const curveLength = totalLength - leadIn;
      /* Measured on a throwaway <text>, NOT on the textPath.

         WebKit's `getComputedTextLength()` on a textPath reports only the
         glyphs currently sitting on the path, so it changes with the scroll
         position: parked at the start of the sweep it returned 562 user units
         for a sentence Chromium measures at 7283. Feed that into the end offset
         and the sweep comes out a quarter of its proper length - the same
         "stops in the middle" symptom, arriving by a different route, and it
         would surface only when a rebuild happened to run at the wrong moment.

         A plain <text> is not on a path, so nothing is clipped out of the
         measurement and both engines agree. `visibility: hidden` rather than
         `display: none`, because a display:none element is not laid out and
         measures 0. */
      const measurer = document.createElementNS("http://www.w3.org/2000/svg", "text");
      measurer.setAttribute("class", textPath.getAttribute("class") ?? "");
      measurer.setAttribute("visibility", "hidden");
      measurer.setAttribute("x", "0");
      measurer.setAttribute("y", "0");
      measurer.textContent = text;
      textPath.ownerSVGElement?.appendChild(measurer);
      const measured = measurer.getComputedTextLength();
      measurer.remove();
      const textLength = measured > 0 ? measured : totalLength;

      /* One user unit renders as `unit` CSS px - the SVG is squeezed to fit the
         width, so this is 1.045 on a desktop and 0.28 on a phone. Everything
         below that wants to be a real on-screen distance goes through it. */
      const unit = (textPath.ownerSVGElement?.getBoundingClientRect().width ?? VIEWBOX_W) / VIEWBOX_W;

      /* No safety margin, verified by counting dark pixels in the arc's band
         rather than by reading a box. A margin here only buys empty scroll at
         the tail.

         Worth knowing if this ever needs re-checking: `getBoundingClientRect`
         on a `<textPath>` does NOT track the glyphs. It reported the same
         `-63..26` box at both ends of the sweep, which read as "26px of the
         last letter is still on screen" and sent me adding a clearance that
         was not needed. Count pixels. */
      /* ...and it stops when the trailing glyph leaves the SCREEN, not when it
         reaches the start of the path. Those are far apart: even without the
         lead-in the curve runs from x=-700, so its first ~770 units are off the
         left edge by construction. Ending on the path start spent them as empty
         scroll - counted in ink, the phone's screen was blank from 85% of the
         pin onwards. `getScreenCTM` is what makes this exact rather than
         arithmetic on the width: it already carries the squeeze AND the scale
         on `.curved-arc`, so the same derivation holds on a desktop (where it
         trims a smaller tail) and at any width in between. */
      const ctm = path.getScreenCTM();
      let offLeft = leadIn;
      if (ctm) {
        const screenX = (len: number) => {
          const pt = pointAt(len);
          return pt.x * ctm.a + pt.y * ctm.c + ctm.e;
        };
        // bisect for the length at which the path crosses the left edge; the
        // lead-in is entirely off-screen, so the crossing is after it
        let a = leadIn;
        let z = totalLength;
        for (let i = 0; i < 40; i++) {
          const mid = (a + z) / 2;
          if (screenX(mid) < 0) a = mid;
          else z = mid;
        }
        offLeft = a;
      }

      /* Start: the source's own 82.7%, measured across its curve - the text
         parks just off the right edge and the lead-in trigger walks it in. It
         is 82.7% OF THE CURVE, placed after the runway, not of the whole path.

         End: derived from THIS string, not hardcoded. The trailing glyph has
         left the screen once the text's start has travelled back to
         `offLeft - textLength`. Clamped at 0 because that is the floor WebKit
         enforces anyway; if a sentence ever got long enough to need a negative
         value the lead-in is too short, and it should grow rather than the
         sweep silently stalling. */
      const startOffset = leadIn + 0.827 * curveLength;
      const endOffset = Math.max(0, offLeft - textLength);
      textPath.setAttribute("startOffset", `${startOffset}`);

      if (reduceMotion || !pinRef.current || !stickyRef.current) return;

      // the pin's length, derived from the travel rather than fixed
      const travel = (startOffset - endOffset) * unit;
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
        // refresh BEFORE the scrub trigger below, which reads this one's `end`.
        // Higher priority refreshes first; the scrub starts earlier on the page,
        // so without this it would refresh first and read a stale value.
        refreshPriority: 1,
      });

      /* The scrub ends exactly where the PIN ends - the same absolute scroll
         position, read off the pin itself rather than recomputed.

         This used to be `+=${pinDistance + LEAD}` from a start a quarter of a
         viewport earlier, and that arithmetic does not land on the pin's end:
         starting 0.75vh early and running pinDistance + 0.25vh finishes 0.5vh
         BEFORE the pin releases. On a 844px phone that is 422px of a 1131px
         pin - 37% - so the sentence stopped around "when you" and the section
         then scrolled away with the rest never shown. Reported exactly that way
         from a phone, in both locales.

         It looked correct in Chromium because GSAP reconciles the two triggers
         when the pin inserts its spacer, which shifts the scrub's measured
         start. Depending on that reconciliation is the bug: it is internal
         behaviour, sensitive to refresh order and engine. A function `end`
         returning the pin's own `end` is the same instant by construction, so
         the sweep cannot finish early on any engine. */
      const textST = ScrollTrigger.create({
        trigger: pinRef.current,
        start: "top 25%",
        end: () => pinST.end,
        scrub: true,
        onUpdate: (self) => {
          const val = gsap.utils.interpolate(startOffset, endOffset, self.progress);
          textPath.setAttribute("startOffset", `${val}`);
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

  /* REDUCED MOTION gets the sentence, not the arc.

     The arc is driven entirely by scroll: `startOffset` parks at 82.7%, which
     is just off the RIGHT edge, and the scrub walks it left. With no scrub
     there is no walk, so the section rendered as a full-height empty screen
     with the sentence sitting off-canvas - measured at 844px tall with
     startOffset stuck at 82.7% through the whole section. A client reported it
     as "the text doesn't scroll to the end, it stays stuck somewhere", in both
     locales, which is exactly what this looks like from the outside.

     Phones are where this bites: iOS "Reduce Motion", Android "Remove
     animations" and Chrome's battery saver all set the query, so this is not a
     rare path. The honest answer is not a slower sweep - it is the words,
     readably, with no motion at all. The arc was always decoration. */
  if (reduceMotion) {
    return (
      <div data-nav-bg="light" className="relative flex min-h-screen flex-col items-center justify-center bg-[#F5F2F2] px-4 text-[#1F1F1F]">
        <div className="absolute top-16 w-full px-4">
          <EyebrowMarquee label={eyebrow ?? copy.eyebrow.process} />
        </div>
        <p className="ro-leading max-w-[18ch] text-center text-[9vw] font-medium leading-[0.98] tracking-[-0.025em] uppercase md:text-[5.2vw]">
          {text}
        </p>
      </div>
    );
  }

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
