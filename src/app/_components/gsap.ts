"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* One place that registers ScrollTrigger and its site-wide config, imported by
   every module that uses it, so a subpage gets the same behaviour as the home
   page without depending on the home page's module having loaded. */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);

  /* On a phone, scrolling hides and shows the browser address bar, which fires
     `resize` with a changed viewport HEIGHT. Left alone, ScrollTrigger treats
     that as a real resize and refreshes every trigger on the page - a full
     synchronous re-measure of six work cards, two pinned dividers, the
     showreel Flip, services and the process cards - in the middle of a scroll
     gesture. That is what "it stutters and blocks the scroll" on mobile
     actually is. `ignoreMobileResize` makes it ignore height-only changes.

     No effect on desktop, where the address bar does not move. */
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger };
