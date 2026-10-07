# Case studies — handoff integrated (2026-10-07)

Source: `HANDOFF_CASE_STUDIES_2026-10` (README_DENIS.md, 05.10.2026). Seven
clients with final copy, galleries, reels, flipbooks and FAQ schema.

## The handoff was NOT 1:1 with this project

Its README says "structura fișierelor e 1:1 cu proiectul Next.js; copiezi căile
exact cum sunt". It is not — the package was drawn against a different build of
the site, and copying it in would have dropped a second design system into the
tree:

| handoff | this project |
|---|---|
| `src/app/case-studies/...`, single locale | two route groups: en at `/`, ro at `/ro` |
| `useLang` from `@/lib/i18n` | `useCopy` / `useLocale` from `_components/context` |
| `ImagePanel`, `Lines`, `PageHeader` | `PageHero`, `TextSection`, `Reveal`, `FaqList` |
| `bg-ink`, `text-bone`, `text-moss`, `text-emerald` | hex: `#F5F2F2`, `#1F1F1F`, `#1FDB93`, `#21976A` |
| `display`, `label-mono` utility classes | do not exist here (0 hits in globals.css) |
| `rounded-[2rem]`, `shadow-[0_0_44px_...]` glows | square corners, 1px hairlines, emerald sweep |
| `/img/`, `/video/` | `/images/`, `/videos/` |
| `gsap.registerPlugin` per component | one `_components/gsap`, with `ignoreMobileResize` |

So the BEHAVIOUR came over and the SURFACE did not, per the user: "adaptat
exact structurii și schemei de design ce e prezentă ACTUAL in site, fără să
schimbăm cum arată, pentru că it defeats the purpose."

The content file was the exception: same types, same `Record<Locale, ...>`
shape as `_content/case-studies.ts`, a superset of it. It went in with two
changes — the `Locale` import and the asset path prefixes.

## What changed

- `_content/case-studies.ts` — 3 studies -> 7 (kgm-chery-oradea,
  harmony-garden, origins-cafe, thermx), plus `caseStats`, `caseGalleries`,
  `caseSites`, `caseVideos`, `caseFaqs`. The three existing studies' copy is
  the handoff's rewrite, not the old text.
- `_components/case-blocks.tsx` — new: `StatStrip`, `CaseGallery`,
  `CaseSites`, `ReelGrid`, and a shared `ClipReveal`.
- `_pages/case-studies.tsx` — results strip above the story, then gallery +
  site cards, reels and FAQ as numbered `TextSection`s (04/05/06), plus
  Article + BreadcrumbList + FAQPage JSON-LD per locale.
- `content.ts` — testimonials replaced from the handoff's `dictionaries.ts`
  (featured DentalNet rewritten, Agro Salso rewritten, Origins added); the old
  "website and CRM" / "booking system" quotes are gone, as the README required.
  Home card six is Origins Coffee & Drinks. New `work.caseStudy` label.
- `site.tsx` — `WORK_VISUALS` carries `case` and optional `site`; the cards'
  links are real.
- `robots.ts` — the two flipbooks disallowed.
- assets — 22 gallery webp, 12 reels + posters, both flipbooks, and
  `work-cafe.webp` (see below).

## Decisions worth keeping

**The work images WERE replaced, on a second pass.** First pass kept the
project's own 900x1206 portrait set and only added a portrait crop of the new
café photo, on the reading that replacing them would change how the home page
looks. The user then asked for them changed — correctly: the frames they sit in
are landscape (`aspect-[4/3]` on the cards and the index, `21/9` on a study
hero), so a portrait source was being cropped to about half its picture. All
seven are now the handoff's 1448x1086, and the photos are the clients' own —
the Chery in its showroom, the DentalNet surgery with the logo on the glass,
the Origins menu board — instead of a hard crop of a portrait frame.

Copied as delivered, 175-422KB, NOT re-encoded: every one of these is served
through `next/image`, which generates the delivered widths itself, so the
source weight is a git concern only (~2MB for the seven) and a second lossy
pass would cost quality for nothing.

`sizes` on the home cards was wrong for the new shape and is now
`(min-width: 1440px) 780px, (min-width: 768px) 46vw, 100vw`: the container
caps at 1440, so past that a card stops growing at about 660px and a bare `vw`
hint kept asking for wider files on wider screens. The 1.18 scale the parallax
drifts inside is part of the width the browser really needs.

**Next's dev image cache does not notice a changed source file.** After
overwriting the seven files, every card still served the old picture —
`naturalWidth` 780x1045, i.e. the portrait source resized. The optimizer keys
on the request URL, which did not change. `.next/dev/cache/images` has to be
deleted (`.next/cache/images` in a production build); a page reload will not do
it. Worth remembering the next time an image is replaced in place and the site
seems to ignore it.

**Three of six home cards have no client site.** DentalNet's public asset is
the ZEN booklet, and KGM and Harmony Garden have no site of their own. Those
cards link to the case study with their own label rather than pointing at a
dead `#`, which is what they did before. The Romanian `work.visit` was "Vezi
proiectul" while the English said "Visit website"; now it is "Vezi site-ul",
with "Vezi studiul de caz" for the internal three.

**ThermX keeps its study but leaves the home page.** Origins took card six on
the user's instruction, so the home page still shows six verticals.

**Reels: `preload="none"`, no autoplay.** The handoff had `preload="metadata"`
on up to four 4MB videos per page. This project already learned that lesson on
the hero loop and the showreel. The cost is that the duration badge only
appears once something plays, which is the right trade.

**Reels are a button, not a div with onClick.** The handoff's frame was not
reachable from a keyboard, so the sound could not be turned on without a
mouse.

**One reel per row on a phone.** Two 9:16 frames side by side at 390px
measured 169px wide — too small for the one block whose point is being
watched. The gallery stays two-up; a still reads fine at that size.

**Stat numbers are `#21976A`, not the `#1FDB93` accent.** brand.md measured
the accent at 1.81:1 on white. The deep emerald is 3.68:1, which clears AA's
3.0 for text at 40px+.

**The counting number is `aria-hidden`, with the real value beside it in
`sr-only`.** The tween rewrites `textContent`; a screen reader arriving
mid-count would otherwise read whatever number it was on. Cleanup also restores
the true value.

**`ClipReveal` is two elements on purpose.** Chromium counts a target's own
clip-path when it computes intersection, so an element hidden by
`inset(0% 0% 100%)` reports `isIntersecting: false, ratio: 0` while sitting
whole in the viewport — measured here as rect top 148, height 440, viewport
900, ratio 0. Observe the clipped element and the reveal waits forever to see
what the clip is hiding. Same trap as the work cards on the home page.

## SEO

- Sitemap needed no edit: it builds from `caseStudyParams()`, which reads
  `caseStudySlugs`, so all seven appear in both locales — verified, 7 slugs x 8
  entries in the served sitemap.
- JSON-LD references the organisation by `@id` (`${SITE_URL}/#organization`)
  rather than describing it again; shell.tsx already emits that node.
- FAQPage reads the same `caseFaqs` the page renders, so the markup and the
  visible answers cannot drift apart.
- The flipbooks are disallowed in robots: no title, no canonical, no hreflang,
  and the Agro catalogue is a single 17MB HTML file.

## Verified

tsc, eslint and `npm run build` clean. In the browser (Edge, 1440x900 and
390x844):

- all 55 asset references in the content resolve on disk, nothing unused
- `/case-studies` lists all seven; each study renders stats, gallery, site
  card, reels and FAQ
- JSON-LD on a study page: Organization, Article, BreadcrumbList, FAQPage
- reel hover -> playing and muted; click -> playing and unmuted
- `/ro/...` serves `lang="ro"`, Romanian CTAs, and the Agro flipbook link
- no 4xx/5xx, no console errors, no horizontal scroll at either width
- `reducedMotion: "reduce"`: nothing clipped, nothing at opacity 0, stats show
  their real values, every picture decodes

## Open

- 70MB of new assets went into git directly (53MB reels, 17MB Agro catalogue).
  Clones get heavier; LFS or external hosting was offered and not chosen yet.
- The handoff's `dictionaries.ts` carries four long strings that differ from
  this project's copy outside the testimonials (a footer line, a CTA, a line of
  web-page copy, one exclusivity line). They read as the other build's variants
  rather than corrections, so they were left alone.
- `public/videos/cases/README.md` still points at
  `src/app/case-studies/content.ts` for the `caseVideos` table; the real path
  here is `src/app/_content/case-studies.ts`.

## FAQ set replaced from the PDF handoff (2026-10-07)

`FAQ_CASE_STUDIES_2026-10.pdf`, 14 pages: seven clients x seven questions, RO
on pages 1-7 and EN on 8-14, headed "Textele finale publicate pe paginile
/case-studies". So it supersedes rather than extends — `caseFaqs` went from 3
per study to 7, 42 strings to 98.

Only 14 of the old 42 questions survived verbatim (the exclusivity one, in both
locales); the rest were rephrased, e.g. "Ce face Epic Digital Hub pentru Hotel
Maxim?" became "Ce servicii de marketing gestionează Epic Digital Hub pentru
Hotel Maxim?".

### Extracting it

No poppler on this machine, so `pypdf` text extraction, parsed by the shape of
the page: a client heading from the known set, then questions as the lines
ending in `?` and each answer as the lines after it. Footer and running-head
lines were dropped by prefix.

Two classes of artifact had to be repaired, and both are worth knowing about
for the next PDF handoff:

- **Ligatures.** The PDF carries `U+FB01`/`U+FB02` glyphs, so extraction yields
  "proﬁl", "ﬁecare", "conﬁrmat" — single characters that are not `fi`/`fl` and
  would not match a search, a diff or a crawler's index. Mapped back.
- **Line-break hyphenation.** "spray-\napplied" extracts as "spray- applied".
  Two occurrences, both real ("patient-facing", "spray-applied"), fixed by
  hand rather than by a blanket regex, since `\w- \w` also matches legitimate
  constructions.

Checked after import: 0 ligature characters, 0 double spaces, 0 hyphen-space
pairs, 0 answers under 40 characters, 98 questions and 98 answers.

### Verified in the browser

All fourteen pages (7 slugs x 2 locales): 7 questions rendered, 7 in the
FAQPage schema, same strings in the same order, every answer present, correct
`<html lang>`. The accordion opens the seventh item (110px panel), so nothing
about the longer list breaks it.

The page and the schema read the same `caseFaqs`, which is what keeps them from
drifting — a FAQPage claiming answers the page does not show is cloaking.

tsc, eslint and build clean.
