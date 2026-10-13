"use client";

/* ---------------------------------------------------------------------------
   The cookie banner.

   Separate from `consent.tsx` on purpose: the default-state script there is a
   server-rendered inline <script> that must run before anything else, and this
   is a client component with state. Putting both behind one "use client" would
   hand that script to React, which does not execute scripts it injects.

   Two behaviours worth keeping:

   - It waits for the preloader. On a first visit the home page runs an intro
     behind `intro-lock` on <html>; a consent dialog sliding in over it is the
     one thing guaranteed to spoil that. The banner waits for `intro-done`.
   - It can be reopened. GDPR requires consent be withdrawable, so the footer's
     "Cookie settings" dispatches an event this listens for — which is also why
     the choice is not only in localStorage but re-applied through
     `applyConsent` whenever it changes.
   ------------------------------------------------------------------------ */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { COOKIE_SETTINGS_EVENT, readConsent, saveConsent, type ConsentChoice } from "../analytics";
import { CONSENT_COPY } from "./consent";

export function CookieBanner() {
  const pathname = usePathname();
  const t = pathname?.startsWith("/ro") ? CONSENT_COPY.ro : CONSENT_COPY.en;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    let cancelled = false;

    const show = () => {
      if (!cancelled && readConsent() === null) setOpen(true);
    };

    /* `intro-lock` is on <html> only while the preloader is running, and
       `intro-done` lands when the handover finishes. On every page but a first
       visit to the home page neither applies and this is immediate. */
    if (html.classList.contains("intro-lock")) {
      const observer = new MutationObserver(() => {
        if (html.classList.contains("intro-done") || !html.classList.contains("intro-lock")) {
          observer.disconnect();
          show();
        }
      });
      observer.observe(html, { attributes: true, attributeFilter: ["class"] });
      const reopen = () => setOpen(true);
      window.addEventListener(COOKIE_SETTINGS_EVENT, reopen);
      return () => {
        cancelled = true;
        observer.disconnect();
        window.removeEventListener(COOKIE_SETTINGS_EVENT, reopen);
      };
    }

    show();
    const reopen = () => setOpen(true);
    window.addEventListener(COOKIE_SETTINGS_EVENT, reopen);
    return () => {
      cancelled = true;
      window.removeEventListener(COOKIE_SETTINGS_EVENT, reopen);
    };
  }, []);

  if (!open) return null;

  const choose = (choice: ConsentChoice) => {
    saveConsent(choice);
    setOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t.label}
      /* z above the header (z-[99999]) so it cannot be covered by it. */
      className="fixed inset-x-4 bottom-4 z-[100000] mx-auto max-w-[32rem] border border-white/15 bg-[#0F0F0F] p-6 text-[#F5F2F2] shadow-[0_24px_60px_rgba(0,0,0,0.5)] md:inset-x-auto md:right-6 md:left-auto"
    >
      <p className="max-w-[44em] text-sm leading-relaxed text-white/70">
        {t.text}{" "}
        <Link href={t.href} className="text-[#1FDB93] underline underline-offset-2 hover:text-white">
          {t.policy}
        </Link>
      </p>
      {/* Same button, twice: equal weight is the handoff's one styling rule. */}
      <div className="mt-6 flex gap-3">
        {([
          ["denied", t.reject],
          ["granted", t.accept],
        ] as const).map(([choice, label]) => (
          <button
            key={choice}
            type="button"
            onClick={() => choose(choice)}
            className="flex-1 cursor-pointer border border-white/25 px-4 py-3 text-[11px] tracking-[0.1em] uppercase transition-colors duration-300 hover:bg-[#F5F2F2] hover:text-[#1F1F1F]"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
