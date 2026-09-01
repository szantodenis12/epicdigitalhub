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
