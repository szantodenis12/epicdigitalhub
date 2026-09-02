import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { COPY, LOCALES, type Locale, localeHref } from "./content";
import { SITE_URL } from "./robots";

/* ---------------------------------------------------------------------------
   Shared root shell.

   The site has TWO root layouts - one per locale route group - because
   `<html lang>` has to be correct in the server-rendered markup, and a single
   shared root layout cannot vary it per route. Everything they have in common
   lives here so the two layouts stay one-liners and cannot drift apart.
   ------------------------------------------------------------------------ */

/* The source's actual typeface, pulled from the Webflow CDN.
   NOTE: BDO Grotesk is a commercially licensed font. Fine for local
   fidelity work; you need a license from the foundry to ship it. */
const grotesk = localFont({
  variable: "--font-grotesk",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
  src: [
    { path: "../../public/fonts/BDOGrotesk-Light.woff2", weight: "300", style: "normal" },
    { path: "../../public/fonts/BDOGrotesk-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/BDOGrotesk-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/BDOGrotesk-DemiBold.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/BDOGrotesk-Bold.woff2", weight: "700", style: "normal" },
  ],
});

/** Absolute URL for a locale's page. */
export const localeUrl = (locale: Locale) =>
  locale === "ro" ? SITE_URL : `${SITE_URL}${localeHref(locale)}`;

export function buildMetadata(locale: Locale): Metadata {
  const m = COPY[locale].meta;
  return {
    // makes every relative URL below (canonical, OG image) absolute
    metadataBase: new URL(SITE_URL),
    /* Browser tab / SERP title. Matches the logo lockup, which reads
       "Epic Digital Hub" over "CREATIVE STUDIO".
       NOTE: this drops "Oradea" from the title tag - the strongest single
       on-page signal for local search. The location is still carried by the
       description below, the hero's entity paragraph and the Organization
       schema's postal address, but not by the title itself. See
       .tasks/clone-nbnzia/seo-geo.md. */
    title: { default: m.title, template: m.template },
    description: m.description,
    alternates: {
      canonical: localeHref(locale),
      /* hreflang. Without these the two locales look like duplicate content
         and Google picks one; with them it serves the right language per
         user. `x-default` points at Romanian, which is the default here. */
      languages: {
        ro: "/",
        en: "/en",
        "x-default": "/",
      },
    },
    openGraph: {
      type: "website",
      url: localeUrl(locale),
      siteName: "Epic Digital Hub",
      title: m.title,
      description: m.ogDescription,
      locale: m.ogLocale,
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => COPY[l].meta.ogLocale),
      // Cut to 1200x630 from the hero loop's first frame, so the share card is
      // actually that shape rather than a site image cropped at random.
      images: [{ url: "/images/og-hero.webp", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: m.title,
      description: m.twitterDescription,
      images: ["/images/og-hero.webp"],
    },
    robots: { index: true, follow: true },
  };
}

/**
 * Organization schema.
 *
 * `ProfessionalService` was the alternative in the brief; `Organization` with
 * an explicit `areaServed` is the safer choice while the business has no
 * public storefront address, and it still carries the identity signals that
 * matter (name, logo, region, contact).
 *
 * `sameAs` is intentionally absent: the footer's social links are still
 * `href="#"`, and asserting profile URLs we do not have would be a false claim
 * in structured data. Add them here the moment the real URLs exist.
 *
 * One @id shared by both locales, because it is ONE organisation. Only the
 * human-readable description is localised.
 */
function organizationSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Epic Digital Hub",
    url: SITE_URL,
    description: COPY[locale].meta.schemaDescription,
    email: "hello.epicdigitalhub@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Oradea",
      addressRegion: "Bihor",
      addressCountry: "RO",
    },
    areaServed: [
      { "@type": "AdministrativeArea", name: "Bihor" },
      { "@type": "Country", name: "Romania" },
    ],
    knowsAbout: [
      "Marketing strategy",
      "Brand identity",
      "Web design and development",
      "Paid advertising",
      "Search engine optimisation",
      "Photo and video production",
    ],
  };
}

export function Shell({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <html
      lang={locale}
      className={`${grotesk.variable} h-full antialiased`}
      /* The pre-paint script below stamps `data-intro` on this element
         before React hydrates, so the client <html> legitimately carries an
         attribute the server markup does not. That is the whole point of
         running it early; suppress the expected mismatch warning. */
      suppressHydrationWarning
    >
      <head>
        {/* Decides BEFORE first paint whether the intro preloader runs, by
            stamping `data-intro="play"` on <html>. globals.css keeps the
            overlay `display:none` unless that attribute is present, which
            means:
              - repeat visits in the same session never flash the loader,
              - `prefers-reduced-motion` never sees it,
              - with JS disabled the attribute is never set, so the overlay
                can never sit on top of the page with nothing to dismiss it.
            It has to be inline and synchronous: a deferred script would run
            after paint and the loader would flash on every repeat view.

            Testing hatch: `?intro=1` replays the intro on every load, `?intro=0`
            skips it. Neither overrides prefers-reduced-motion. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var p=new URLSearchParams(location.search);" +
              "var m=matchMedia('(prefers-reduced-motion: reduce)').matches;" +
              "var seen=sessionStorage.getItem('edh:intro-played');" +
              "var forced=p.get('intro')==='1',skipped=p.get('intro')==='0';" +
              "if(!m&&!skipped&&(forced||!seen)){document.documentElement.dataset.intro='play'}" +
              "sessionStorage.setItem('edh:intro-played','1')}catch(e){}",
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema(locale)) }}
        />
        {children}
      </body>
    </html>
  );
}
