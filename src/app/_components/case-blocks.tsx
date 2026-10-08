"use client";

/* ============================================================================
   The blocks a case study needs on top of the text sections: the results
   strip, the post gallery, the "this is live" site cards and the reels.

   Everything here is the site's existing language, not the handoff's. The
   package these came from was drawn for a dark, rounded, glowing treatment
   (`bg-ink`, `rounded-[2rem]`, `shadow-[0_0_44px_...]`). This site is cream
   #F5F2F2 with #1F1F1F copy, square corners everywhere, 1px hairlines, and
   emerald used as a sweep or an indent on hover — so that is what these use.
   The behaviour is the handoff's; the surface is the site's.
   ========================================================================= */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "./gsap";
import { usePrefersReducedMotion } from "./context";
import { Reveal } from "./blocks";

const EASE_CSS = "cubic-bezier(0.22,1,0.36,1)";

/* ----------------------------------------------------------------------------
   CLIP REVEAL — the frame opens top-to-bottom as it arrives

   The work cards' entrance, factored out: the source's
   `clip-path: inset(0% 0% 100%) -> inset(0%)`.

   TWO ELEMENTS, and it has to stay that way. Chromium counts a target's own
   clip-path when it computes intersection, so an element hidden by
   `inset(0% 0% 100%)` reports `isIntersecting: false, ratio: 0` while sitting
   whole in the middle of the viewport — measured, with a bare observer: rect
   top 148, height 440, viewport 900, ratio 0. Observe the clipped element and
   it waits forever to see something the clip is hiding. So the observer sits
   on the outer element and the clip on the inner one.
   ------------------------------------------------------------------------- */

function ClipReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  /** on the OUTER element — give it the aspect ratio */
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduceMotion) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setOpen(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduceMotion]);

  const clipped = !reduceMotion && !open;

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div
        style={{
          clipPath: clipped ? "inset(0% 0% 100% 0%)" : "inset(0% 0% 0% 0%)",
          transition: `clip-path 1050ms ${EASE_CSS} ${delay}ms`,
        }}
        className="absolute inset-0 overflow-hidden"
      >
        {children}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------
   RESULTS STRIP — numbers that count up once, on arrival
   ------------------------------------------------------------------------- */

export type StatItem = { value: string; label: string; source?: string };

/** One number. Counts up from zero on arrival; a value with no digits in it
    (or reduced motion) simply sits there. */
function StatTile({ item }: { item: StatItem }) {
  const el = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = el.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const match = item.value.match(/^([^0-9]*)(\d+)(.*)$/);
    if (!match) return;

    const [, prefix, digits, suffix] = match;
    const target = parseInt(digits, 10);
    const counter = { n: 0 };
    node.textContent = `${prefix}0${suffix}`;

    const tween = gsap.to(counter, {
      n: target,
      duration: 1.6,
      ease: "power3.out",
      snap: { n: 1 },
      scrollTrigger: { trigger: node, start: "top 88%", once: true },
      onUpdate: () => {
        node.textContent = `${prefix}${Math.round(counter.n)}${suffix}`;
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      // Hand the DOM back with the real value, never a half-counted one.
      node.textContent = item.value;
    };
  }, [item.value]);

  return (
    <div>
      {/* The animated node is hidden from assistive tech and the true value
          sits beside it: a screen reader that reaches the tile mid-count would
          otherwise read whatever number the tween happens to be on. */}
      <p className="text-[40px] leading-none font-medium tracking-[-0.02em] text-[#21976A] md:text-[52px]">
        <span ref={el} aria-hidden>
          {item.value}
        </span>
        <span className="sr-only">{item.value}</span>
      </p>
      <p className="mt-4 text-[13px] tracking-[0.02em] text-[#1F1F1F]/70 uppercase">{item.label}</p>
      {item.source && (
        <p className="mt-2 text-sm leading-relaxed text-[#1F1F1F]/55">{item.source}</p>
      )}
    </div>
  );
}

/** #21976A, not the #1FDB93 accent: brand.md measured the accent at 1.81:1 on
    white, which fails even for display type. The deep emerald is 3.68:1, which
    clears AA's 3.0 for text this size — and these are 40px and up. */
export function StatStrip({ items }: { items: StatItem[] }) {
  return (
    <ul className="grid gap-10 border-t border-[#1F1F1F]/15 pt-10 sm:grid-cols-3 md:gap-8">
      {items.map((item, i) => (
        <li key={item.label}>
          <Reveal index={i}>
            <StatTile item={item} />
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

/* ----------------------------------------------------------------------------
   GALLERY — real posts, in their native 4:5
   ------------------------------------------------------------------------- */

export function CaseGallery({ items }: { items: { src: string; alt: string }[] }) {
  return (
    <ul className="grid grid-cols-2 gap-4 md:gap-6">
      {items.map((item, i) => (
        <li key={item.src}>
          <ClipReveal className="aspect-[4/5] w-full" delay={i * 90}>
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(min-width: 768px) 28vw, 45vw"
              className="object-cover"
            />
          </ClipReveal>
        </li>
      ))}
    </ul>
  );
}

/* ----------------------------------------------------------------------------
   SITE CARDS — a browser bar, the real screenshot, one green button

   The bar is what says "this is live, go and look" rather than "here is
   another picture". Some of these open a flipbook in /public instead of a
   client's domain, which is why the label comes from the content, not from
   the URL.
   ------------------------------------------------------------------------- */

export type SiteItem = {
  url: string;
  domain: string;
  shot: string;
  label: string;
  cta: string;
};

export function CaseSites({ items }: { items: SiteItem[] }) {
  return (
    <ul className="flex flex-col gap-6">
      {items.map((site, i) => (
        <li key={site.url}>
          <Reveal index={i}>
            <a
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block border border-[#1F1F1F]/15 transition-colors duration-500 hover:border-[#21976A]"
            >
              <div className="flex items-center gap-3 border-b border-[#1F1F1F]/15 bg-[#1F1F1F]/[0.03] px-4 py-2.5">
                <span className="flex gap-1.5" aria-hidden>
                  <i className="h-2 w-2 rounded-full bg-[#1F1F1F]/15" />
                  <i className="h-2 w-2 rounded-full bg-[#1F1F1F]/15" />
                  <i className="h-2 w-2 rounded-full bg-[#1FDB93]" />
                </span>
                <span className="truncate text-[11px] tracking-[0.02em] text-[#1F1F1F]/60 uppercase">
                  {site.label}
                </span>
              </div>
              <div className="overflow-hidden">
                <div className="relative aspect-[16/10] w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]">
                  <Image
                    src={site.shot}
                    alt={site.domain}
                    fill
                    sizes="(min-width: 768px) 56vw, 100vw"
                    className="object-cover object-top"
                  />
                </div>
              </div>
              {/* The emerald sweep the feature rows and the footer email use,
                  so a hover here reads as the same site. */}
              <div className="relative flex items-center justify-between gap-4 px-5 py-4">
                <span
                  aria-hidden
                  className="pointer-events-none absolute top-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-[#1FDB93] transition-transform duration-500 ease-out group-hover:scale-x-100"
                />
                <span className="text-[11px] tracking-[0.02em] text-[#1F1F1F]/60 uppercase">
                  {site.domain}
                </span>
                <span className="inline-flex items-center gap-2.5 bg-[#1FDB93] px-5 py-2.5 text-xs tracking-[0.05em] text-[#1F1F1F] uppercase">
                  {site.cta}
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </a>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

/* ----------------------------------------------------------------------------
   REELS — hover previews silently, click brings the sound
   ------------------------------------------------------------------------- */

function formatTime(t: number) {
  if (!Number.isFinite(t) || t <= 0) return "";
  const m = Math.floor(t / 60);
  const s = Math.round(t % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** One reel.

    `preload="none"` and no `autoPlay`, like the hero loop and the showreel:
    a page with four of these must not pull four videos down before anyone
    asks. The poster carries the frame until something plays, and the duration
    only appears once metadata has arrived — that is the deliberate trade for
    not fetching 4MB per card on load.

    A button, not a div with onClick, so the sound is reachable from the
    keyboard. Hover preview is pointer-only: on touch there is no hover, and
    the first tap should bring sound rather than a silent preview. */
function ReelCard({
  src,
  poster,
  title,
  soundHint,
  index,
}: {
  src: string;
  poster: string;
  title: string;
  soundHint: string;
  index: number;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [engaged, setEngaged] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState("");

  const preview = (on: boolean) => {
    const v = video.current;
    if (!v || engaged) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (on) {
      v.muted = true;
      v.play().catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0;
    }
  };

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (!engaged || v.paused) {
      setEngaged(true);
      /* Start MUTED, unmute once playback is actually running.

         Unmuting first is what broke these on a phone: tap, a frame or two,
         then it stopped on its own. Measured in a mobile context -
         `v.muted = false; v.play()` leaves the promise unsettled with
         `readyState` 0 and `paused` true, nothing playing and no error to
         catch. The autoplay policy will not grant audio to an element that
         holds no data yet (`preload="none"` here, deliberately), and the
         gesture that would have authorised it is spent by the time the first
         bytes land.

         Muted playback is always permitted, and unmuting an element that is
         already playing is not a new playback request, so it survives. Same
         four trials in the same context: muted-then-unmute reached 1.8s and
         kept going, unmuted-first never left 0.

         `.catch()` keeps a refused play from becoming an unhandled rejection -
         it can still happen, e.g. in a background tab. */
      v.muted = true;
      v.play()
        .then(() => {
          v.muted = false;
        })
        .catch(() => {});
    } else {
      v.pause();
    }
  };

  const live = engaged && playing;

  return (
    <figure className="group">
      <ClipReveal className="aspect-[9/16] w-full" delay={index * 90}>
        <button
          type="button"
          onClick={toggle}
          onMouseEnter={() => preview(true)}
          onMouseLeave={() => preview(false)}
          aria-label={`${title} — ${soundHint}`}
          className="relative block h-full w-full cursor-pointer bg-[#0F0F0F] text-left"
        >
          <video
            ref={video}
            src={src}
            poster={poster}
            loop
            playsInline
            preload="none"
            tabIndex={-1}
            className="h-full w-full object-cover"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onLoadedMetadata={(e) => setDuration(formatTime(e.currentTarget.duration))}
            onTimeUpdate={(e) => {
              const v = e.currentTarget;
              setProgress(v.duration ? v.currentTime / v.duration : 0);
            }}
          />

          {/* scrim, so the play mark and the labels read on any footage */}
          <span
            aria-hidden
            className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0F0F0F]/70 via-transparent to-[#0F0F0F]/25 transition-opacity duration-500 ${
              live ? "opacity-0" : "opacity-100"
            }`}
          />

          <span
            aria-hidden
            className={`pointer-events-none absolute inset-0 grid place-items-center transition-opacity duration-300 ${
              live ? "opacity-0" : "opacity-100"
            }`}
          >
            <span className="grid h-14 w-14 place-items-center rounded-full bg-[#1FDB93] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110">
              <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 fill-[#1F1F1F]">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>

          {duration && (
            <span
              aria-hidden
              className="pointer-events-none absolute top-3 right-3 bg-[#0F0F0F]/60 px-2 py-1 text-[11px] tracking-[0.02em] text-[#F5F2F2] uppercase"
            >
              {duration}
            </span>
          )}

          {/* only while the silent preview is running */}
          <span
            aria-hidden
            className={`pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] tracking-[0.1em] text-[#1FDB93] uppercase transition-opacity duration-300 ${
              playing && !engaged ? "opacity-100" : "opacity-0"
            }`}
          >
            {soundHint}
          </span>

          <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 bg-[#1FDB93]/20">
            <span
              className="block h-full bg-[#1FDB93] transition-[width] duration-200 ease-linear"
              style={{ width: `${progress * 100}%` }}
            />
          </span>
        </button>
      </ClipReveal>
      <figcaption className="mt-4 text-[11px] tracking-[0.02em] text-[#1F1F1F]/60 uppercase transition-colors duration-500 group-hover:text-[#21976A]">
        {title}
      </figcaption>
    </figure>
  );
}

export function ReelGrid({
  items,
  soundHint,
}: {
  items: { src: string; poster: string; title: string }[];
  soundHint: string;
}) {
  return (
    /* One per row on a phone, two from `sm` up. Two 9:16 frames side by side
       at 390px came out 169px wide each — too small to watch, and these are
       the one block on the page whose whole point is being watched. The posts
       in the gallery stay two-up, because a still reads fine at that size. */
    <ul
      className={`grid gap-5 md:gap-8 ${items.length > 1 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:max-w-[320px]"}`}
    >
      {items.map((item, i) => (
        /* Every second one rides lower, the same offset idea the work cards on
           the home page use, so a pair of reels is not a flat row. */
        <li key={item.src} className={i % 2 === 1 ? "md:mt-14" : ""}>
          <ReelCard
            src={item.src}
            poster={item.poster}
            title={item.title}
            soundHint={soundHint}
            index={i}
          />
        </li>
      ))}
    </ul>
  );
}
