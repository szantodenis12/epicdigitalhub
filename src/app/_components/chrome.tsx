"use client";

/* ============================================================================
   Site chrome: the header (with its mobile menu), smooth scrolling, and the
   contact + footer block that closes every page.

   Moved out of site.tsx unchanged so the home page and every subpage share
   one implementation. The only thing that varies is where links point: a nav
   entry that is a home section (`#about`) stays an anchor on the home page and
   becomes `/#about` / `/ro#about` on a subpage; a page entry (`/services`)
   gets the current locale's prefix everywhere.
   ========================================================================= */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { LogoLockup } from "../logo";
import { type Locale, localeHref, localePath } from "../content";
import { APPLY_PATH } from "../routes";
import { gsap, ScrollTrigger } from "./gsap";
import { SiteProviders, useCopy, useLocale, usePagePath, usePrefersReducedMotion } from "./context";
import { EyebrowMarquee, LocaleToggle, NavLink, Parallax, TrickButton } from "./ui";

/* ============================================================================
   SMOOTH SCROLL + NAV HIDE/SHOW
   ========================================================================= */

/** Lenis on desktop, plus the header's hide-on-scroll-down state. Returns the
    Lenis instance so the home page can hold it while the intro runs. */
export function useSmoothScrollNav(reduceMotion: boolean) {
  const lenisRef = useRef<import("lenis").default | null>(null);

  /* Nav hide-on-scroll-down / show-on-scroll-up.
     Source `.willen-nav` is position:fixed and animates `top` (NOT transform)
     between 16px (shown) and -100px (hidden), with
     `transition: top 0.45s cubic-bezier(0.22, 1, 0.36, 1)`. */
  const [navHidden, setNavHidden] = useState(false);

  /* Nav direction from native scroll. Used whenever Lenis is NOT running -
     reduced motion, and every touch device (see the Lenis effect below).
     When Lenis IS running it drives this from its own per-frame `scroll`
     callback instead, because Lenis coalesces native scroll events down to
     roughly one per gesture and this listener could not read direction. */
  useEffect(() => {
    const coarse =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    if (!reduceMotion && !coarse) return;
    let last = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        const delta = y - last;
        if (Math.abs(delta) < 6) return;
        setNavHidden(delta > 0 && y > 120);
        last = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduceMotion]);

  /* Lenis smooth scroll, synced with ScrollTrigger.

     Desktop only, deliberately. Lenis smooths WHEEL input; with the default
     `syncTouch: false` it does not touch touch-scrolling at all, so on a phone
     it changes nothing visible while still running a rAF loop every frame and
     pushing a ScrollTrigger.update through the main thread on every scroll
     event. Native mobile scrolling is already compositor-driven and smooth.
     Skipping it on coarse pointers is free on mobile and leaves desktop
     byte-for-byte identical. */
  useEffect(() => {
    if (reduceMotion) return;
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;
    let lenisInstance: import("lenis").default | null = null;
    let tickerFn: ((time: number) => void) | null = null;
    let cancelled = false;

    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      // lerp-based (Lenis default) rather than duration-based: frame-rate
      // independent and noticeably less stuttery under ScrollTrigger scrubs
      // than `duration`, which re-tweens on every wheel event.
      const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      lenisInstance = lenis;
      lenisRef.current = lenis;
      // Lenis loads async, so it can come up either during or after the
      // intro. `intro-lock` is present only while the preloader is running,
      // which makes this correct in both orders.
      if (document.documentElement.classList.contains("intro-lock")) lenis.stop();
      lenis.on("scroll", ScrollTrigger.update);

      // Nav hide/show. Lenis coalesces native `scroll` events down to roughly
      // one per gesture, so a window scroll listener cannot read direction.
      // ScrollTrigger is already synced to Lenis above and exposes a reliable
      // `direction` (1 = down, -1 = up), so drive it from there.
      // Nav hide/show is driven off Lenis's own per-event `direction`.
      //
      // Do NOT route this through ScrollTrigger.getVelocity(): GSAP computes
      // velocity against a MODULE-LEVEL timestamp shared by every
      // ScrollTrigger on the page, refreshed only every >=50ms. This page runs
      // five concurrent triggers (2 curved dividers, the showreel Flip, the
      // process-card reveal, and this one), so under a continuous ~16ms scroll
      // cadence the reading starves toward zero and the nav simply freezes in
      // whatever state it started in. Lenis's `direction` is per-instance and
      // has no such contention.
      lenis.on("scroll", ({ scroll, direction }: { scroll: number; direction: number }) => {
        if (scroll <= 120) {
          setNavHidden(false);
          return;
        }
        if (direction === 1) setNavHidden(true);
        else if (direction === -1) setNavHidden(false);
      });
      tickerFn = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tickerFn);
      gsap.ticker.lagSmoothing(0);
    });

    return () => {
      cancelled = true;
      if (tickerFn) gsap.ticker.remove(tickerFn);

      lenisInstance?.destroy();
    };
  }, [reduceMotion]);

  return { navHidden, lenisRef };
}

/* ============================================================================
   HEADER
   ========================================================================= */

export function SiteHeader({ navHidden, home }: { navHidden: boolean; home: boolean }) {
  const copy = useCopy();
  const locale = useLocale();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  /* Nav entrance, staggered in behind the intro. Class + inline delay only -
     the transition itself lives in globals.css.
     Note: Tailwind v4 emits `-translate-x-1/2` as the standalone `translate`
     property rather than `transform`, so `.intro-fade`'s transform composes
     with it instead of overwriting the links' centring. */
  /* Section anchors live on the home page. From a subpage they have to go
     back there first. */
  const linkBase = home ? "" : localeHref(locale);
  /* A nav entry is either a home section (`#about`) or a page (`/services`),
     which takes the current locale's prefix. */
  const navHref = (href: string) =>
    href.startsWith("#") ? `${linkBase}${href}` : localePath(locale, href);

  return (
    <>
      {/* ============================================================
          NAV
          ============================================================ */}
      {/* Source `.willen-nav` carries position:fixed, z-index AND
          mix-blend-mode on ONE element. Splitting them (fixed+z on a wrapper,
          blend on a child) makes the wrapper a stacking context that isolates
          the child's blend from the page backdrop — the nav then blends only
          against its own group and opaque fills render flat. Keep all three
          together here. */}
      <header
        /* `mix-blend-mode: difference` MUST sit on this element, not on a
           child: `position: fixed` always creates a stacking context, so a
           blended child would composite against the header's own (transparent)
           group instead of the page behind it.

           Hide/show animates `transform`, not `top`. The source animates `top`,
           but on a blended fixed element that forces layout + a full re-blend
           every frame of the transition; a transform stays on the compositor.
           This is the one optimisation available that does not cost the
           negative-space effect. */
        className="fixed inset-x-0 top-4 z-[99999] mix-blend-difference transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: navHidden ? "translateY(-116px)" : "translateY(0)" }}
      >
        <nav className="relative mx-auto flex h-14 max-w-[1440px] items-center justify-between px-4 md:px-8">
          {/* Full logo lockup, inlined as OUTLINED paths — mark, rule,
              "Epic Digital Hub" wordmark and the "CREATIVE STUDIO" tagline.

              The supplied edh-logo.svg carries the wordmark as a live <text>
              in Unbounded and the tagline in Space Grotesk. An SVG only NAMES
              a font, it does not embed it, so that file renders correctly only
              on machines with both fonts installed and falls back to a serif
              everywhere else. The text is converted to paths here from the same
              TTFs (verified against a font-rendered reference), so it is
              correct on every device with no webfont to load.

              `fill="currentColor"` is load-bearing: it is what lets the
              header's `mix-blend-mode: difference` treat the logo as a
              silhouette, exactly as it treated the text it replaced. An <img>
              would blend as an opaque rectangle and kill the effect.

              The crop is set by the divider rule (y 45..255), which is taller
              than both the mark and the tagline — so the tagline costs no extra
              height. Editable master: public/brand/edh-logo-editable.svg. */}
          <a
            href={home ? "#top" : linkBase}
            aria-label={copy.nav.home}
            className="flex items-center text-white intro-fade"
            style={{ "--intro-delay": "0.1s" } as React.CSSProperties}
          >
            <LogoLockup className="h-9 w-auto shrink-0 lg:h-11" />
          </a>
          <ul
            className="intro-fade absolute top-0 left-1/2 hidden h-full -translate-x-1/2 items-center gap-10 text-white lg:flex"
            style={{ "--intro-delay": "0.3s" } as React.CSSProperties}
          >
            {copy.nav.links.map((n) => (
              <li key={n.label}>
                <NavLink label={n.label} href={navHref(n.href)} />
              </li>
            ))}
          </ul>
          <div
            className="intro-fade flex items-center gap-3"
            style={{ "--intro-delay": "0.5s" } as React.CSSProperties}
          >
            {/* `lg:mr-7` on top of the row's own gap-3 puts 40px between the
                toggle and the Apply button — the same rhythm as the nav links
                beside it. At the bare 12px gap the toggle read as part of the
                button rather than as a peer of the nav. Margin rather than a
                bigger row gap, so the mobile hamburger spacing is untouched. */}
            <LocaleToggle className="hidden text-xs text-white lg:mr-7 lg:flex" />
            <div className="hidden lg:block">
              <TrickButton href={localePath(locale, APPLY_PATH)} variant="base" className="h-11 md:h-14">
                {copy.nav.apply}
              </TrickButton>
            </div>
            <button
              type="button"
              aria-label={mobileNavOpen ? copy.nav.closeMenu : copy.nav.openMenu}
              onClick={() => setMobileNavOpen((v) => !v)}
              className="relative z-[60] flex h-10 w-10 flex-col items-center justify-center gap-1.5 text-white lg:hidden"
            >
              <span
                className={`h-px w-6 bg-current transition-transform duration-300 ${mobileNavOpen ? "translate-y-[3.5px] rotate-45" : ""}`}
              />
              <span
                className={`h-px w-6 bg-current transition-transform duration-300 ${mobileNavOpen ? "-translate-y-[3.5px] -rotate-45" : ""}`}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile hamburger overlay — off-canvas panel; source green #1B372E retuned to brand emerald #10412F */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
            className="fixed inset-0 z-50 flex flex-col justify-center gap-8 bg-[#10412F] px-8 text-[#F5F2F2] lg:hidden"
          >
            {copy.nav.links.map((n) => (
              <a
                key={n.href}
                href={navHref(n.href)}
                onClick={() => setMobileNavOpen(false)}
                className="text-4xl font-medium uppercase tracking-[-0.02em]"
              >
                {n.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMobileNavOpen(false)}
              className="mt-4 text-4xl font-medium uppercase tracking-[-0.02em] text-[#1FDB93]"
            >
              {copy.eyebrow.letsTalk}
            </a>
            {/* The header toggle is hidden below lg — at 390px the logo lockup
                is 234px wide and left only 4px before it, with "Hub" touching
                "RO". The menu is where it belongs on a phone anyway. */}
            <LocaleToggle className="mt-8 gap-3 text-2xl text-[#F5F2F2]" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ============================================================================
   CONTACT — cursor-tracked orange spotlight duplicate over the eyebrow row
   ========================================================================= */

function ContactSpotlightEyebrow() {
  const copy = useCopy();
  const wrapRef = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const xp = ((e.clientX - rect.left) / rect.width) * 100;
    const yp = ((e.clientY - rect.top) / rect.height) * 100;
    wrapRef.current?.style.setProperty("--xpercent", `${xp}%`);
    wrapRef.current?.style.setProperty("--ypercent", `${yp}%`);
  };
  return (
    <div ref={wrapRef} onMouseMove={onMove} className="relative">
      <EyebrowMarquee label={copy.eyebrow.letsTalk} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 text-[#1FDB93]"
        style={{
          WebkitMaskImage:
            "radial-gradient(circle at var(--xpercent,50%) var(--ypercent,50%), #000 20%, transparent 25%)",
          maskImage:
            "radial-gradient(circle at var(--xpercent,50%) var(--ypercent,50%), #000 20%, transparent 25%)",
        }}
      >
        <EyebrowMarquee label={copy.eyebrow.letsTalk} />
      </div>
    </div>
  );
}

/* ============================================================================
   CONTACT + FOOTER
   ========================================================================= */

export function ContactFooter({ reduceMotion }: { reduceMotion: boolean }) {
  const copy = useCopy();
  const locale = useLocale();
  const path = usePagePath();
  const [phase, setPhase] = useState<"idle" | "sending" | "sent" | "error">("idle");

  /* Stored and emailed by /api/contact. The button label carries the state,
     as it did when this form was a placeholder. */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setPhase("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          page: localePath(locale, path),
          locale,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setPhase("sent");
      window.setTimeout(() => setPhase("idle"), 2500);
    } catch {
      setPhase("error");
    }
  };

  const label =
    phase === "sending"
      ? copy.contact.sending
      : phase === "sent"
        ? copy.contact.submitted
        : phase === "error"
          ? copy.contact.failed
          : copy.contact.submit;

  return (
      <section id="contact" data-nav-bg="dark" className="bg-[#0F0F0F] pt-16 pb-10 text-[#F1F1F1]">
        <div className="mx-auto max-w-[1440px] px-4">
          <ContactSpotlightEyebrow />

          {/* Plain flowing heading. The previous version forced the line
              breaks with `flex-wrap` + `w-full` spans and carried an inline
              image borrowed from the source's layout — the image had no reason
              to exist here, and the forced breaks plus 6.5vw made four lines
              that overwhelmed the section. 4.6vw with a `ch`-based measure lets
              it set naturally. */}
          <Parallax reduceMotion={reduceMotion} distance={56}>
            <h2 className="mt-16 max-w-[24ch] text-[8vw] font-medium leading-[1.02] tracking-[-0.02em] uppercase md:text-[4.6vw]">
              {copy.contact.headingLead}{" "}
              <span className="text-[#1FDB93]">{copy.contact.headingAccent}</span>
            </h2>
          </Parallax>

          <form onSubmit={handleSubmit} className="mt-16 flex flex-col gap-3 md:flex-row">
            <input
              type="text"
              name="name"
              required
              autoComplete="name"
              aria-label={copy.contact.namePlaceholder}
              placeholder={copy.contact.namePlaceholder}
              className="h-16 flex-1 border-0 bg-white/5 px-5 text-sm placeholder:text-white/40 focus:bg-white/10 focus:outline-none"
            />
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              aria-label={copy.contact.emailPlaceholder}
              placeholder={copy.contact.emailPlaceholder}
              className="h-16 flex-1 border-0 bg-white/5 px-5 text-sm placeholder:text-white/40 focus:bg-white/10 focus:outline-none"
            />
            <button
              type="submit"
              disabled={phase === "sending"}
              className="flex h-16 items-center justify-between gap-4 bg-[#F5F2F2] px-6 text-sm font-medium text-[#1F1F1F] disabled:cursor-wait disabled:opacity-60 md:w-56"
            >
              <span aria-live="polite">{label}</span>
              <span aria-hidden>↵</span>
            </button>
          </form>

          <div className="mt-24 grid grid-cols-1 gap-10 border-t border-white/10 pt-12 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.1em] text-white/40">{copy.contact.follow}</p>
              <div className="mt-4 flex gap-3">
                {[
                  { src: "/icons/social-webflow.svg", w: 19, h: 12 },
                  { src: "/icons/social-instagram.svg", w: 16, h: 16 },
                  { src: "/icons/social-linkedin.svg", w: 16, h: 16 },
                ].map((icon) => (
                  <a
                    key={icon.src}
                    href="#"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                  >
                    <Image src={icon.src} alt="" width={icon.w} height={icon.h} className="invert" />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.1em] text-white/40">{copy.contact.write}</p>
              <a href="mailto:hello.epicdigitalhub@gmail.com" className="footer-email relative mt-3 inline-block text-[28px] tracking-[-0.01em] md:text-[36px]">
                hello.epicdigitalhub@gmail.com
                <span className="footer-email-underline absolute left-0 -bottom-1 h-1 w-full origin-right scale-x-0 bg-current transition-transform duration-300 ease-out" />
              </a>
            </div>
          </div>

          <div className="mt-16 flex flex-col gap-2 text-xs text-[#5F5F5F] md:flex-row md:items-center md:justify-between">
            <span>{copy.contact.footerLine}</span>
            <span>{copy.contact.footerBased}</span>
          </div>
        </div>
      </section>
  );
}

/* ============================================================================
   PAGE FRAME — the chrome around a subpage
   ========================================================================= */

/**
 * Wraps a subpage in the same header, scroll behaviour and footer as the home
 * page. Subpages have no preloader, so the header's `.intro-fade` entrance is
 * released on mount instead of by the intro handoff.
 */
export function PageFrame({
  locale,
  path,
  children,
}: {
  locale: Locale;
  /** locale-independent path, e.g. "/services/seo-geo" */
  path: string;
  children: React.ReactNode;
}) {
  return (
    <SiteProviders locale={locale} path={path}>
      <Frame>{children}</Frame>
    </SiteProviders>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  const reduceMotion = usePrefersReducedMotion();
  const { navHidden } = useSmoothScrollNav(reduceMotion);

  useEffect(() => {
    // rAF so the hidden start state is painted first; adding the class in the
    // frame the header first renders would skip the transition.
    const id = requestAnimationFrame(() => {
      document.documentElement.classList.add("intro-done");
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <main className="relative w-full overflow-x-clip bg-[#F5F2F2] text-[#1F1F1F]">
      <SiteHeader navHidden={navHidden} home={false} />
      {children}
      <ContactFooter reduceMotion={reduceMotion} />
    </main>
  );
}
