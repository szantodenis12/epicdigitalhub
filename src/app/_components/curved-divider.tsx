"use client";

/* Moved out of site.tsx unchanged, so the home page's two dividers and the
   one on /services are the same component. `reduceMotion` is optional: the
   home page passes the value it already holds, a subpage lets it read the
   preference itself. */

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "./gsap";
import { useCopy, usePrefersReducedMotion } from "./context";
import { EyebrowMarquee } from "./ui";

const CURVE_PATH =
  "M -700 252 C -470 200 -230 145 0 92.0674 C 528.5 -28.9327 977.5 -32.4328 1516.5 92.0674 C 1745 145 1980 200 2216 252";


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

  useEffect(() => {
    const path = pathRef.current;
    const textPath = textPathRef.current;
    if (!path || !textPath) return;

    // Measured off the source across a full pin: startOffset runs
    // 82.7% -> -150.87%. It does NOT start off-path — at progress 0 the text
    // is already on screen (its left edge sits at x~33 on a 1905px viewport)
    // and it simply travels left from there.
    //
    // The previous formula started at `100 + (textWidth/pathLen)*100` (~184%),
    // parking the text entirely off the path so the first chunk of the 3240px
    // pin rendered as blank background before anything appeared.
    // Start: 82.7 is the source's own measured value — it parks the text just
    // off the right edge, and the lead-in trigger below walks it into view as
    // the section approaches.
    const startOffset = 82.7;

    // End: MUST be derived from THIS string's length, not hardcoded. -150.87
    // was measured off the source and only ever cleared the source's own
    // sentence; with our (longer) copy the text stopped with ~700px still on
    // screen, froze there, and then dragged down over the next section.
    // -(textLength / pathLength) * 100 is exactly the point at which the
    // trailing glyph passes the start of the path, whatever the copy says.
    // No safety margin: an extra 6% here pushed the text off ~240px before the
    // pin ended and reintroduced dead scroll at the tail. The viewport is
    // narrower than the path, so the text is out of SIGHT slightly before this
    // value anyway — the bare ratio lands it just as the pin finishes.
    const totalLength = path.getTotalLength();
    const textLength =
      typeof textPath.getComputedTextLength === "function"
        ? textPath.getComputedTextLength()
        : totalLength;
    const endOffset = -((textLength / totalLength) * 100);
    textPath.setAttribute("startOffset", `${startOffset}%`);

    if (reduceMotion || !pinRef.current || !stickyRef.current) return;

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
    // place while the section scrolled into view — it just sat there rather
    // than animating in. The pin must still engage at "top top" (otherwise the
    // section freezes before it fills the screen), so the scrub gets its own
    // trigger that starts a quarter-viewport earlier.
    const pinST = ScrollTrigger.create({
      trigger: pinRef.current,
      start: "top top",
      end: "+=3240",
      pin: stickyRef.current,
      scrub: true,
    });

    const LEAD = Math.round(window.innerHeight * 0.25);
    const textST = ScrollTrigger.create({
      trigger: pinRef.current,
      start: "top 25%",
      end: `+=${3240 + LEAD}`,
      scrub: true,
      onUpdate: (self) => {
        const val = gsap.utils.interpolate(startOffset, endOffset, self.progress);
        textPath.setAttribute("startOffset", `${val}%`);
      },
    });

    return () => {
      pinST.kill();
      textST.kill();
    };
  }, [text, reduceMotion]);

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
          className="w-[1516px] max-w-full shrink-0 overflow-visible"
          /* Source CSS is translate(0, -100%) scale(1.1), but the source's
             container is not vertically centred the way this one is, so a
             literal -100% lands the text ~200px too high. -30% puts the arc at
             the same on-screen y (~280px) as the original. */
          style={{ transform: "translate(0, -30%) scale(1.1)" }}
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
