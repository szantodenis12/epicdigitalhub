"use client";

/* ---------------------------------------------------------------------------
   The legal band at the foot of every page.

   From the tracking handoff of 12.10.2026: the three legal pages, the cookie
   settings link that re-opens the consent banner (GDPR requires consent be
   withdrawable), the company's registration details, and the two things
   Romanian law asks a trader's site to show — the official ANPC SAL pictogram
   and the consumer helpline.

   Three details that are requirements, not choices:

   - The pictogram is the official file, saved locally at
     public/legal/anpc-sal.png rather than hotlinked from anpc.ro, at its
     native 201x50. `unoptimized` keeps it byte-identical: it must not be
     stretched or recoloured, and an optimiser would re-encode it.
   - It has a white background of its own, which is why it sits on a white
     plate here instead of being inverted into the dark footer.
   - The SOL pictogram is deliberately absent. That European platform closed
     and ANPC dropped it from the requirements in 2026.

   The routes come from LEGAL_PATHS so the Romanian slugs
   (/ro/confidentialitate, /ro/termeni) live in exactly one place.
   ------------------------------------------------------------------------ */

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { openCookieSettings } from "../analytics";
import { localePath } from "../content";
import { LEGAL_PATHS } from "../routes";

const COPY = {
  ro: {
    /* `localePath`, not the bare path: LEGAL_PATHS holds the
       locale-INDEPENDENT slug like every other route here, so the /ro prefix
       is added at the point of use. */
    links: [
      { href: localePath("ro", LEGAL_PATHS.privacy.ro), label: "Politica de confidențialitate" },
      { href: localePath("ro", LEGAL_PATHS.cookies.ro), label: "Politica de cookie-uri" },
      { href: localePath("ro", LEGAL_PATHS.terms.ro), label: "Termeni și condiții" },
    ],
    cookies: "Setări cookie",
    phone: "Telefonul Consumatorului ANPC",
    company: "EPIC DIGITAL HUB S.R.L. · CUI 51214505 · J2025006853005",
    salAlt: "ANPC — Soluționarea alternativă a litigiilor",
  },
  en: {
    links: [
      { href: localePath("en", LEGAL_PATHS.privacy.en), label: "Privacy policy" },
      { href: localePath("en", LEGAL_PATHS.cookies.en), label: "Cookie policy" },
      { href: localePath("en", LEGAL_PATHS.terms.en), label: "Terms" },
    ],
    cookies: "Cookie settings",
    phone: "ANPC Consumer Helpline",
    company: "EPIC DIGITAL HUB S.R.L. · CUI 51214505 · J2025006853005",
    salAlt: "ANPC — Alternative dispute resolution",
  },
} as const;

export function FooterLegal() {
  const pathname = usePathname();
  const t = pathname?.startsWith("/ro") ? COPY.ro : COPY.en;

  return (
    <div className="mt-12 flex flex-col gap-8 border-t border-white/10 pt-8 text-[11px] tracking-[0.02em] text-white/50 md:flex-row md:items-start md:justify-between">
      <div className="flex flex-col gap-3">
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          {t.links.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-white">
              {l.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={openCookieSettings}
            className="cursor-pointer text-left transition-colors hover:text-white"
          >
            {t.cookies}
          </button>
        </nav>
        <p className="text-white/40">{t.company}</p>
      </div>

      <div className="flex flex-wrap items-center gap-5">
        <a
          href="https://reclamatiisal.anpc.ro"
          target="_blank"
          rel="noreferrer"
          aria-label={t.salAlt}
          className="shrink-0"
        >
          <Image
            src="/legal/anpc-sal.png"
            alt={t.salAlt}
            width={201}
            height={50}
            unoptimized
          />
        </a>
        <a
          href="https://www.anpc.ro"
          target="_blank"
          rel="noreferrer"
          className="leading-relaxed transition-colors hover:text-white"
        >
          {t.phone}
          <br />
          <span className="text-white/80">021 9551</span>
        </a>
      </div>
    </div>
  );
}
