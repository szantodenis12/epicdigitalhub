"use client";

/* ============================================================================
   HOVER ACCORDION — one row open at a time, media sliding up on the right.

   The home page's Services section, lifted out so /services lists its ten
   services with exactly the same behaviour. Callers own the section around it
   (panel colour, eyebrow) and what each row's media is.
   ========================================================================= */

import { useEffect, useRef, useState } from "react";
import { nn } from "./format";

// Source geometry, measured live on nbnzia.com:
//   .mwg035-li        height 96px collapsed / 244px open, overflow hidden
//   .accordion-content  height 0 -> 112px, overflow hidden
//   .mwg035-medias    349 x 196, position absolute, overflow hidden — ONE PER ROW
//   .mwg035-media     slides translateY(196) -> translateY(0), i.e. up from
//                     below its own clipping box. Not an opacity crossfade.
const ROW_CLOSED = 96;
const ROW_OPEN = 244;
const CONTENT_H = 112;
export const MEDIA_W = 350;
export const MEDIA_H = 196;

/** Class + style for the element that slides inside a row's media box.
    The source drives this with GSAP (its CSS transition-duration is 0s), so
    the easing here is an expo-out approximation of that tween. */
export function mediaMotion(isActive: boolean) {
  return {
    className:
      "h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
    style: {
      transform: isActive ? "translateY(0)" : "translateY(100%)",
      // promoted only while this row is the open one, so it is one layer at a
      // time instead of one per row held permanently
      willChange: isActive ? "transform" : "auto",
    } as React.CSSProperties,
  };
}

export type HoverAccordionItem = {
  key: string;
  title: string;
  body: React.ReactNode;
  /** "See the service →" at the foot of the open row */
  link?: { href: string; label: string };
};

export function HoverAccordion({
  items,
  media,
}: {
  items: HoverAccordionItem[];
  /** The row's picture. Apply `mediaMotion(isActive)` to it. */
  media: (index: number, isActive: boolean) => React.ReactNode;
}) {
  const [active, setActive] = useState(0);

  /* CONTENT_H is the source's measured 112px and stays the floor. But copy
     length is not fixed - the Romanian service descriptions are longer than
     the English ones, and at 390px "Website-uri și sisteme digitale" ran 49px
     past the box and lost two lines behind `overflow: hidden`.

     So each row is measured and opens to whatever its own copy needs, never
     less than 112. Rows whose text already fits are pixel-identical to before;
     only a row that would otherwise hide text grows. A ResizeObserver re-reads
     them because the wrap changes with width. */
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [contentHeights, setContentHeights] = useState<number[]>([]);

  useEffect(() => {
    const measure = () =>
      setContentHeights(contentRefs.current.map((el) => el?.offsetHeight ?? 0));
    measure();
    const ro = new ResizeObserver(measure);
    contentRefs.current.forEach((el) => el && ro.observe(el));
    return () => ro.disconnect();
  }, []);

  return (
    <div className="mt-16 border-t border-white/15">
      {items.map((item, i) => {
        const isActive = active === i;
        const openH = Math.max(CONTENT_H, contentHeights[i] ?? 0);
        return (
          <div
            key={item.key}
            onMouseEnter={() => setActive(i)}
            onClick={() => setActive(i)}
            className="relative flex cursor-pointer flex-col justify-center overflow-hidden border-b border-white/15 transition-[min-height] duration-500 ease-in-out"
            /* No `will-change` here: min-height is a layout property, so
               the hint cannot buy compositing and only forces a layer.
               Measured on a DPR-3 mobile profile at 6x CPU throttle, these
               layout hints were the largest single cause of scroll jank. */
            style={{
              minHeight: isActive ? ROW_OPEN + (openH - CONTENT_H) : ROW_CLOSED,
            }}
          >
            <div className="flex items-baseline gap-6">
              <span className="w-14 shrink-0 text-sm text-white/50">[ {nn(i)} ]</span>
              <h3 className="text-[22px] font-medium tracking-[-0.02em] md:text-[36px]">
                {item.title}
              </h3>
            </div>

            {/* Source `.accordion-content`: overflow hidden, height 0 -> 112.
                Keeps the collapsed row at exactly 96px while the copy stays
                mounted (no reconciliation churn on hover). */}
            <div
              className="overflow-hidden transition-[height] duration-500 ease-in-out"
              /* Same as the row above - `height` is not compositable. */
              style={{ height: isActive ? openH : 0 }}
            >
              <div
                ref={(el) => {
                  contentRefs.current[i] = el;
                }}
                /* 50% is a desktop measure — the media sits in the other
                   half. On mobile the media is hidden, so constraining to
                   half the width made the copy wrap far more and get
                   clipped mid-sentence by the fixed content height. */
                className="max-w-none pt-6 pl-0 text-sm leading-relaxed text-white/70 transition-opacity duration-400 ease-out md:max-w-[50%] md:pl-[4.5rem]"
                style={{ opacity: isActive ? 1 : 0 }}
              >
                {item.body}
                {/* Inside the measured box, so the row opens tall enough
                    for it. Same arrow idiom as the work cards' link. */}
                {item.link && (
                  <a
                    href={item.link.href}
                    className="group mt-4 flex w-fit items-center gap-2 text-xs tracking-[0.05em] text-[#F5F2F2] uppercase"
                  >
                    {item.link.label}
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </a>
                )}
              </div>
            </div>

            {/* Source `.mwg035-medias`: its own absolutely-positioned,
                overflow-hidden box per row. The media inside slides up from
                translateY(100%) to translateY(0). */}
            <div
              aria-hidden
              className="pointer-events-none absolute top-1/2 right-0 hidden -translate-y-1/2 overflow-hidden md:block"
              style={{ width: MEDIA_W, height: MEDIA_H }}
            >
              {media(i, isActive)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
