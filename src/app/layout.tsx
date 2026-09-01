import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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

const SITE_URL = "https://epicdigitalhub.ro";

export const metadata: Metadata = {
  // makes every relative URL below (canonical, OG image) absolute
  metadataBase: new URL(SITE_URL),
  /* Browser tab / SERP title. Matches the logo lockup, which reads
     "Epic Digital Hub" over "CREATIVE STUDIO".
     NOTE: this drops "Oradea" from the title tag - the strongest single
     on-page signal for local search. The location is still carried by the
     description below, the hero's entity paragraph and the Organization
     schema's postal address, but not by the title itself. See
     .tasks/clone-nbnzia/seo-geo.md. */
  title: {
    default: "Epic Digital Hub | Creative Studio",
    template: "%s | Epic Digital Hub",
  },
  description:
    "One brand per niche, per city. Strategy, design, web, ads and production for a single brand in your category. Based in Oradea, Romania.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Epic Digital Hub",
    title: "Epic Digital Hub | Creative Studio",
    description:
      "One brand per niche, per city. We build and operate the full digital system behind a brand.",
    locale: "en_US",
    // TODO: replace with a purpose-made 1200x630 card. This is a reused site
    // image, so it will crop badly in some previews.
    images: [{ url: "/images/hero-atmosphere.webp", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Epic Digital Hub | Creative Studio",
    description: "One brand per niche, per city.",
    images: ["/images/hero-atmosphere.webp"],
  },
  robots: { index: true, follow: true },
};

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
 */
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Epic Digital Hub",
  url: SITE_URL,
  description:
    "Growth studio in Oradea. Strategy, identity, website, content, ads and photo-video for one brand per niche, per city.",
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    /* lang stays "en" because the shipped copy is English. The brief specifies
       ro as default — that belongs with the Romanian copy and a language
       switcher, neither of which exist in this build yet. Setting lang="ro"
       over English text would be worse than leaving it. */
    <html
      lang="en"
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
              // ?intro=1 replays it on every load (for review); ?intro=0 skips
              // it. Neither overrides prefers-reduced-motion.
              "var forced=p.get('intro')==='1',skipped=p.get('intro')==='0';" +
              "if(!m&&!skipped&&(forced||!seen)){document.documentElement.dataset.intro='play'}" +
              "sessionStorage.setItem('edh:intro-played','1')}catch(e){}",
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
