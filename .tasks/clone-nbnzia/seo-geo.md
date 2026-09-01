# SEO + GEO implementation

Against the brief for epicdigitalhub.ro. Implemented on the existing structure;
no design, copy or animation was changed except the one paragraph the brief
explicitly requires in the HTML.

## Done

| Brief item | Status |
|---|---|
| `src/app/robots.ts` | Done. `*` plus explicit GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-Web, Google-Extended, PerplexityBot, CCBot, Applebot-Extended. Disallows `/api/`, `/admin`, `/clone`. Sitemap + host declared. |
| `src/app/sitemap.ts` | Done — one URL (see deviation below). |
| `public/llms.txt` | Done. 49 lines: who we are, the one-niche-one-city rule, what we build, verticals, the receipts numbers, how to start, contact. |
| JSON-LD | Done. `Organization` in `layout.tsx` with name, url, description, email, Oradea/Bihor/RO address, `areaServed`, `knowsAbout`. |
| Per-page `generateMetadata` | Adapted — single page, so the root metadata carries title template, description, `alternates.canonical`, openGraph and Twitter card. `metadataBase` set. |
| Dynamic `lang` | NOT done — see deviation. |
| Entity phrase | Done. Visible paragraph low in the hero: "Epic Digital Hub is a strategy and brand systems studio in Oradea, Romania, working with a single brand per niche, per city." |
| FAQPage schema | NOT done — see blocked. |

Verified served: `/robots.txt`, `/sitemap.xml`, `/llms.txt`, JSON-LD parses as
`Organization`, canonical + og:title + og:image present, entity phrase in HTML.

## RESOLVED — the homepage now serves the real site

`/` previously rendered the abandoned first reconstruction (the nbnzia clone
with placeholder content) while the real Epic site sat at `/clone`.

Done (2026-08-31):
- `src/app/clone/page.tsx` (1896 lines, the real site) moved to
  `src/app/page.tsx`.
- The old `src/app/page.tsx` (701 lines, placeholder reconstruction) deleted.
  A copy was kept at
  `<scratchpad>/backup/abandoned-reconstruction-page.tsx` — neither file was
  tracked in git, so `git checkout` could not have recovered it.
- The `/clone` disallow removed from `robots.ts`; the route no longer exists.

Verified: build routes are `/`, `/_not-found`, `/robots.txt`, `/sitemap.xml`.
`/` returns 200 and serves the Epic page (title "Epic Digital Hub — growth
studio in Oradea", wordmark EPIC DIGITAL HUB, h1 "YOUR COMPETITORS CAN'T HIRE
US", clients section present, 15 images, zero console errors, no placeholder
strings anywhere in the body). `/clone` returns 404. Canonical resolves to
`https://epicdigitalhub.ro/`. JSON-LD and the entity paragraph both present at
the root.

## Deviations from the brief, and why

1. **Sitemap has one URL, not eight.** The brief lists `/services`, `/system`,
   `/web`, `/work`, `/about`, `/exclusivity`, `/apply`. Those are routes on the
   epicdigitalhub-v2 demo. THIS build is a single page whose sections are
   anchors, so listing them would put seven 404s in the sitemap.
2. **`lang` left as `en`.** The brief specifies `ro` by default via
   `LanguageProvider`. The shipped copy here is English and there is no language
   provider in this build. Declaring `lang="ro"` over English text would be
   worse than leaving it — it misleads both browsers and crawlers.
3. **`sameAs` omitted from the schema.** The footer's social links are still
   `href="#"`. Asserting Facebook/Instagram/LinkedIn URLs we do not have would
   be a false claim in structured data. Add them the moment the real URLs exist.
4. **`Organization`, not `ProfessionalService`.** The brief offered either.
   `ProfessionalService` inherits `LocalBusiness`, which is expected to carry a
   street address and opening hours; there is no public storefront here, so
   `Organization` with an explicit `areaServed` is the honest fit.
5. **OG image is a reused site image**, not a purpose-made card. It will crop
   badly in some previews. A real 1200x630 asset is needed.

## Blocked on missing input

- **FAQPage schema.** The brief says three frequent questions become the
  FAQPage schema, and that the SEO/GEO copy goes into the `/services` accordion
  and step 06 of `/system`. The page supplied cuts off mid-sentence at
  "Doua variante:" — the actual questions, answers and the two SEO-copy
  variants are not in what was shared. Nothing was invented.

## Not addressed (outside this brief)
The `/services` accordion copy rewrite and the `/system` step 06 change both
target routes that do not exist in this build.

## Bilingual (2026-09-01)

Romanian is now the default locale at `/`; English at `/en`. Copy lives in
`src/app/content.ts`, lifted from the project's own bilingual deck
(`F:\epicdigitalhub-v2\src\lib\dictionaries.ts`) and mapped onto this site's
sections using content-mapping.md - not translated here.

### Why route groups rather than a client-side toggle

`<html lang>` has to be correct in the SERVER-rendered markup, and a single
shared root layout cannot vary it per route. Next.js allows one root layout per
route group, so:

```
src/app/(ro)/layout.tsx        <html lang="ro">   ->  /
src/app/(ro)/page.tsx
src/app/(en)/layout.tsx        <html lang="en">   ->  /en
src/app/(en)/en/page.tsx
```

`src/app/layout.tsx` is gone - with multiple root layouts there cannot be one.
Icon conventions (`icon.svg`, `icon.png`, `apple-icon.png`) still resolve from
`src/app/` and were verified in the built output.

The documented trade-off is that moving between the two groups is a full page
load, not a client transition. For a language switch that is correct anyway:
the whole document, `lang` included, has to change.

A client-side toggle was rejected: Google would only ever see one language, and
the Romanian copy - the language of the actual audience - would be invisible to
search.

### Verified in the built output

| | `/` | `/en` |
|--|-----|-------|
| `<html lang>` | ro | en |
| canonical | epicdigitalhub.ro | epicdigitalhub.ro/en |
| og:locale | ro_RO | en_US |
| h1 | CONCURENȚII TĂI NU NE POT ANGAJA | YOUR COMPETITORS CAN'T HIRE US |

hreflang on both pages: `ro`, `en`, `x-default` (-> Romanian). The sitemap
lists both URLs, and each entry carries the FULL alternates set including
itself - the spec requires every member of a group to list every member,
itself included, or the cluster is discarded.

### Copy typing

`const ro: typeof en` in content.ts keeps the two locales structurally
identical, so a missing or misspelled Romanian key is a compile error rather
than a silent English fallback.

Language-independent data (work card colours, images, ordering) stays in
site.tsx and is merged with the copy by index, so a translation can never
change a brand colour or drop an image.
