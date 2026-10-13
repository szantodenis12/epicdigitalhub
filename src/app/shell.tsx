import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { COPY, LOCALES, type Locale, localeHref, localePath } from "./content";
import { GoogleTagManager } from "@next/third-parties/google";
import { SITE_URL } from "./robots";
import { ConsentDefault } from "./_components/consent";
import { CookieBanner } from "./_components/cookie-banner";
import { Analytics } from "@vercel/analytics/next";

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
export const localeUrl = (locale: Locale, path = "") =>
  path || locale !== "en" ? `${SITE_URL}${localePath(locale, path)}` : SITE_URL;

/** What a subpage overrides. `title` is either a plain title that the root
    template suffixes ("%s | Epic Digital Hub"), or `{ absolute }` for copy that
    already carries the brand - the service pages' meta titles do. */
export type PageMeta = {
  path: string;
  /** Only for a page whose slug differs per locale (the legal pages): the path
      in EVERY locale, so the hreflang set points at URLs that exist. Without
      it the alternates are built from `path` in both locales, which is right
      for every page that shares its slug and wrong for the ones that do not. */
  paths?: Record<Locale, string>;
  title: string | { absolute: string };
  description: string;
  /** keep this page out of the index - used by draft case studies */
  noindex?: boolean;
};

/**
 * Metadata for the home page (no `page`) or a subpage.
 *
 * Subpages must go through here rather than returning a partial object:
 * Next.js merges metadata SHALLOWLY per top-level key, so a page that set only
 * `openGraph.title` would drop the layout's OG image, locale and site name.
 */
export function buildMetadata(locale: Locale, page?: PageMeta): Metadata {
  const m = COPY[locale].meta;
  const path = page?.path ?? "";
  const plainTitle = page
    ? typeof page.title === "string"
      ? page.title
      : page.title.absolute
    : m.title;
  const description = page?.description ?? m.description;
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
    title: page ? page.title : { default: m.title, template: m.template },
    description,
    alternates: {
      canonical: localePath(locale, path),
      /* hreflang. Without these the two locales look like duplicate content
         and Google picks one; with them it serves the right language per
         user. `x-default` points at English, which is the default here. */
      languages: {
        en: localePath("en", page?.paths?.en ?? path),
        ro: localePath("ro", page?.paths?.ro ?? path),
        "x-default": localePath("en", page?.paths?.en ?? path),
      },
    },
    openGraph: {
      type: "website",
      url: localeUrl(locale, path),
      siteName: "Epic Digital Hub",
      title: plainTitle,
      description: page ? description : m.ogDescription,
      locale: m.ogLocale,
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => COPY[l].meta.ogLocale),
      // Cut to 1200x630 from the hero loop's first frame, so the share card is
      // actually that shape rather than a site image cropped at random.
      images: [{ url: "/images/og-hero.webp", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: plainTitle,
      description: page ? description : m.twitterDescription,
      images: ["/images/og-hero.webp"],
    },
    robots: page?.noindex ? { index: false, follow: false } : { index: true, follow: true },
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
 * `sameAs` lists the three profiles the footer links to. Keep it in step with
 * those links: a profile asserted here that the site does not link to (or the
 * reverse) is the kind of mismatch that makes entity matching distrust both.
 *
 * `logo` is a raster built for this field and nothing else, by
 * scratchpad/logo2.mjs: it rasterises the site's own LogoLockup paths (ink on
 * white, 1280x265, so both sides clear Google's 112px floor). It is NOT
 * nav-logo.svg, which this once pointed at - that file is the template's
 * "NBNZIA" wordmark, white with mix-blend-mode:difference, so it was both the
 * wrong brand and invisible on a white background. Regenerate it from
 * logo.tsx if the lockup ever changes; the SVGs under /icons are unsuitable
 * (one is the template's, the other depends on webfonts a crawler lacks).
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
    email: "contact@epicdigitalhub.ro",
    telephone: "+40755473154",
    logo: `${SITE_URL}/icons/organization-logo.png`,
    sameAs: [
      "https://www.facebook.com/epicdigitalhub.ro",
      "https://www.instagram.com/epicdigitalhub.ro",
      "https://www.linkedin.com/company/epicdigitalhub",
    ],
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
            skips it. Neither overrides prefers-reduced-motion.

            Home pages only. Subpages have no preloader, and landing on one
            first must not mark the intro as played - otherwise a visitor who
            arrives on /services from search never sees it on the home page. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              `try{var h=${JSON.stringify(LOCALES.map((l) => localeHref(l)))};` +
              "if(h.indexOf(location.pathname.replace(/\\/+$/,'')||'/')>-1){" +
              "var p=new URLSearchParams(location.search);" +
              "var m=matchMedia('(prefers-reduced-motion: reduce)').matches;" +
              "var seen=sessionStorage.getItem('edh:intro-played');" +
              "var forced=p.get('intro')==='1',skipped=p.get('intro')==='0';" +
              "if(!m&&!skipped&&(forced||!seen)){document.documentElement.dataset.intro='play'}" +
              "sessionStorage.setItem('edh:intro-played','1')}}catch(e){}",
          }}
        />

        {/* Consent Mode v2's default state. It MUST come before the container:
            a tag that fires before any default is set reads "no signal", which
            Google treats as permission rather than as refusal. */}
        <ConsentDefault />
      </head>

      {/* Google Tag Manager, GTM-TPN89TBF. GA4 and the Meta Pixel are tags
          INSIDE this container, not code in this repo, so Epic can change what
          is measured without a deploy. The one include here covers both
          locales, because both root layouts render this shell. */}
      <GoogleTagManager gtmId="GTM-TPN89TBF" />
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema(locale)) }}
        />
        {children}
        {/* Vercel Web Analytics. It renders nothing and injects its script
            itself, so it sits at the end of <body> in the one shell both
            locales share - one include covers /, /ro and every subpage. */}
        <Analytics />

        {/* Last in the body, and reopenable from the footer's "Cookie
            settings" - see _components/cookie-banner.tsx. */}
        <CookieBanner />
      </body>
    </html>
  );
}
