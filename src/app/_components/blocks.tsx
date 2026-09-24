"use client";

/* ============================================================================
   Client blocks for subpages: scroll reveals, the feature rows and the FAQ.

   Each one is an existing home-page idiom, not a new one:
     - Reveal       the Testimonials `whileInView` fade-up (motion, not a GSAP
                    ScrollTrigger - see the note in site.tsx's Testimonials on
                    why ScrollTrigger positions go stale below pinned sections)
     - FeatureRows  the Testimonials supporting-quote rows: emerald label on
                    the left, copy on the right, emerald sweep + indent on hover
     - FaqList      the Services accordion's hairline rows and `[ 01 ]` index,
                    opened by click (a FAQ is read, not scanned)
   ========================================================================= */

import { useId, useState } from "react";
import { motion } from "motion/react";
import { usePrefersReducedMotion } from "./context";
import { nn } from "./format";

const EASE = [0.16, 1, 0.3, 1] as const;

function useReveal() {
  const reduceMotion = usePrefersReducedMotion();
  return (i = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-8% 0px" },
          transition: { duration: 0.75, delay: i * 0.08, ease: EASE },
        };
}

/** Fades its content up into place the first time it scrolls into view. */
export function Reveal({
  children,
  className = "",
  index = 0,
}: {
  children: React.ReactNode;
  className?: string;
  /** stagger position within a group */
  index?: number;
}) {
  const reveal = useReveal();
  return (
    <motion.div {...reveal(index)} className={className}>
      {children}
    </motion.div>
  );
}

/** Label/body rows. `light` for use on the cream sections. */
export function FeatureRows({
  items,
  light = false,
}: {
  items: { title: string; body: string }[];
  light?: boolean;
}) {
  const reveal = useReveal();
  const line = light ? "border-[#1F1F1F]/15" : "border-white/15";
  return (
    <ul className={`border-t ${line}`}>
      {items.map((item, i) => (
        <motion.li
          key={item.title}
          {...reveal(i)}
          className={`group relative grid cursor-default gap-4 border-b ${line} py-8 transition-[padding] duration-500 ease-out md:grid-cols-8 md:gap-8 md:hover:pl-6`}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-px left-0 h-0.5 w-full origin-left scale-x-0 bg-[#1FDB93] transition-transform duration-500 ease-out group-hover:scale-x-100"
          />
          <p
            className={`text-xs tracking-[0.15em] uppercase opacity-70 transition-opacity duration-300 ease-out group-hover:opacity-100 md:col-span-3 ${light ? "text-[#1F1F1F]" : "text-[#1FDB93]"}`}
          >
            <span className={`mr-3 ${light ? "text-[#1F1F1F]/40" : "text-white/40"}`}>[ {nn(i)} ]</span>
            {item.title}
          </p>
          <p
            className={`text-sm leading-relaxed transition-colors duration-300 ease-out md:col-span-5 md:text-base ${light ? "text-[#1F1F1F]/65 group-hover:text-[#1F1F1F]" : "text-white/60 group-hover:text-white/95"}`}
          >
            {item.body}
          </p>
        </motion.li>
      ))}
    </ul>
  );
}

/** Single-open question list. Height animates with the grid-rows 0fr -> 1fr
    technique, so there is no JS measuring and any answer length works. */
export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const uid = useId();

  return (
    <div className="border-t border-[#1F1F1F]/15">
      {items.map((item, i) => {
        const isOpen = open === i;
        const buttonId = `${uid}-q-${i}`;
        const panelId = `${uid}-a-${i}`;
        return (
          <div key={item.q} className="border-b border-[#1F1F1F]/15">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full cursor-pointer items-baseline gap-6 py-7 text-left"
              >
                <span className="w-14 shrink-0 text-sm text-[#1F1F1F]/50">[ {nn(i)} ]</span>
                <span className="flex-1 text-[20px] font-medium leading-snug tracking-[-0.01em] md:text-[26px]">
                  {item.q}
                </span>
                {/* plus -> cross, in currentColor like the rest of the chrome */}
                <span
                  aria-hidden
                  className={`relative h-3.5 w-3.5 shrink-0 self-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? "rotate-45" : ""}`}
                >
                  <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-current" />
                  <span className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-current" />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!isOpen}
              className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden">
                <p className="max-w-[62ch] pb-8 text-base md:pl-20 leading-relaxed text-[#1F1F1F]/75">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
