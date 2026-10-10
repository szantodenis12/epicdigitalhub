# Copy deck V2 — implementation log (9 Oct 2026)

Source: `IMPLEMENTARE_COPY_V2_DENIS.md`, 6145 lines, 8 RO sections + 8 EN
sections, dated 08.10.2026. The deck replaces the site's copy entirely. Its own
rules (lines 14–42) govern this work: text goes in verbatim with diacritics
intact, TITLE/META go to page metadata and not into the body, RO and EN are a
pair, anything marked "de cerut de la client" stays out, and large structural
changes get flagged rather than invented.

## What the slugs saved us

The deck's service slugs (`campanii-ppc`, `seo-geo`, `social-media-management`,
`continut-video`, `magazine-online`, `website-uri-prezentare`, `design-grafic`,
`email-marketing`, `tracking-date`, `consultanta-marketing`) and its four
article slugs already matched the repo exactly. No routing changed, no redirects
were needed, and the sitemap is unaffected. The one exception is the automotive
case study — see below.

## Coverage, measured rather than asserted

`scratchpad/audit.py` pulls every string literal of 40+ characters out of the
seven content files, normalises whitespace and quote glyphs, and checks it
appears in the deck:

    1735 strings checked
    1577 found verbatim in the deck
     158 not found

All 158 are accounted for, and every one of them is a field the deck does not
cover:

| file | misses | what they are |
|---|---|---|
| case-studies.ts | 103 | 29 are the untouched `kgm-chery-oradea` entry; the rest are gallery alt texts, section labels and CTA strings the deck never gives |
| content.ts | 18 | marquee figures, the two curved dividers, footer line, og/twitter/schema descriptions, the nav's aria label |
| services.ts | 15 | the RO service-card descriptions (the deck has EN ones only), the exclusivity block, three RO closing CTAs |
| audit.ts | 13 | form states and error messages |
| apply.ts | 7 | form states and error messages |
| articles.ts | 2 | `ctaBody`, RO and EN |
| niches.ts | 0 | every string on the page came from the deck |

## Structural work, beyond swapping strings

- **Metadata got real fields.** The deck gives a TITLE and META for nearly every
  page; several page types had nowhere to put them, so their metadata was built
  from a kicker and a body string. Optional `meta` fields were added to the
  articles index, apply, audit, niches and case studies, plus `metaTitle` and
  `cardBody` on an article. The builders use `{ absolute: ... }`, because
  content.ts sets a `"%s | Epic Digital Hub"` template and every deck title
  already ends with that suffix — a plain string doubles it.
- **`cardBody` on an article** exists because `dek` was doing three jobs at once
  (index card, page lead, meta description) and the deck gives different text
  for the card and the description.
- **The closing paragraph** of the home page ("Spune-ne câteva lucruri despre
  afacerea ta…") had no slot; `contact.body` was added and rendered between the
  heading and the form, where the deck puts it.
- **Paragraph joining.** Where the deck gives more paragraphs than a block
  renders, they are joined in the deck's own order and never cut. The About
  statement is the one to watch: the deck's heading plus four paragraphs became
  a heading and two joined pairs.

## The Romanian home page now carries the ENGLISH headline

The deck states it twice — "Versiunea în română, cu headline-ul principal în
engleză" and again as the visible H1 — so `hero.line1/line2` is the same string
in both locales and the accent word is "can't" on both. This is the most visible
single change in the implementation and the one most worth a second opinion.

## Flagged, not done

- **Hero kicker and second CTA.** The deck's hero has a kicker line
  ("EPIC DIGITAL HUB · MARKETING STUDIO") and two buttons ("Verifică
  disponibilitatea · Vezi proiectele"); the built hero has neither slot. Not
  invented — the hero was rebuilt recently and its layout is deliberate.
- **Section headings for Work and Services on the home page** ("Proiecte și
  colaborări", "De la strategie la execuție") have no heading element in those
  sections, which lead with an eyebrow marquee instead.
- **Four short hero statements** ("O singură strategie." …) went into the About
  section's list, the nearest existing slot, not into the hero.

## Awaiting other people

- **Hotel Maxim "+20% rezervări"** is implemented and live in the copy, in the
  result line, the stat tile and the FAQ. The deck says it needs the client's
  written confirmation first.
- **Testimonials** are editorial adaptations by the deck's own admission and
  need each client's approval before they run as quotations.
- **Article dates** were deliberately left as they were — the deck says to
  verify them with Roland before publishing.

## Known stale spots, where the deck gives nothing

- RO service-card descriptions on /services (10 of them) are the old copy; the
  deck only writes the EN ones.
- Three RO service pages keep "Discută cu Epic" as the closing CTA, and RO
  `magazine-online` keeps "Hai să proiectăm traseul complet." under a new
  heading.
- Agro Salso and Harmony Garden stat tiles keep old-deck items ("0 superlative",
  "0 weekenduri sărite") because the deck's RO and EN stat lists differ in
  length and content and the tile's value is a single shared field.
- The EN ThermX tile reads "12 / month strategy", from splitting the deck's
  "12-month strategy" into a value and a label.
- The case-studies index intro still says "seven of the brands" while the deck's
  index lists eight cards — it will be right again if the automotive split goes
  ahead.

## The automotive split (done, 9 Oct)

Denis asked for it, Jeep included. `kgm-chery-oradea` became three pages:

- **`/case-studies/kgm-oradea`** and **`/case-studies/chery-oradea`**, published
  in both locales, with the deck's own copy, FAQs and index cards.
- **`/case-studies/jeep-oradea`**, published. It was built as a draft first,
  because the deck is explicit that it must not go live before the first
  materials are delivered; Denis asked for it live anyway, twice, after that was
  explained, so it is in the listing, the sitemap and indexable. The machinery
  stays in place: putting a slug into `draftCaseStudySlugs` keeps its page and
  route while dropping it from the listing and the sitemap and serving
  `noindex, nofollow`. `draftCaseStudySlugs` is empty right now.

The copy was parsed out of the deck rather than retyped, so it is verbatim by
construction. The verbatim audit went from 103 unmatched strings in this file to
50, and the 29 that were the old combined study are gone.

**The old URL still works.** `/case-studies/kgm-chery-oradea` was live, so
next.config.ts now redirects it permanently to the KGM page, in both locales.
Verified: 308 to `/case-studies/kgm-oradea`.

**The assets split cleanly by brand**, which is why this was safe to do:

| was | is | what it is |
|---|---|---|
| kgm-chery-oradea-3/4.webp | kgm-oradea-1/2.webp | KGM brand history, KGM Actyon trims |
| kgm-chery-oradea-1/2.webp | chery-oradea-1/2.webp | Tiggo range sizes, Tiggo 7 HEV pricing |
| kgm-chery-oradea-1.mp4 | kgm-oradea-1.mp4 | the Rexton reel |
| kgm-chery-oradea-2/3.mp4 | chery-oradea-1/2.mp4 | the "chinezească?" reel, the Tiggo 8 CSH reel |

The third reel was titled "caravană pe șosea" and the deck's Chery list has
"Reel: Tiggo 8 CSH" as its second reel, with two Chery reels on each side. They
are taken to be the same clip; worth a glance before publishing.

**Imagery is the weak point, and it is a content problem, not a code one.** The
shared `work-auto.webp` is a photograph of a Chery, so it stays on the Chery
page and cannot front the other two:

- KGM now has `work-kgm.webp`: the Actyon itself, cut out of the trim carousel
  at y 898-1340 and padded back to 4:3 by stretching the studio backdrop's own
  top and bottom rows. A flat fill banded, because that backdrop is a gradient
  with a vignette; stretching its edge rows carries the gradient into the
  padding and the join is invisible. 57KB.
- Jeep had NO imagery of its own and ran on the EDH brand frame, which on a car
  brand's case study read as a missing image. **Resolved 10 Oct**: the client
  sent a Compass studio shot and a 91-second off-road reel.
  `work-jeep.webp` is the 3:2 source cropped to the 1448x1086 every other
  work-\*.webp uses, trimmed from the left where there is only empty floor so the
  car keeps its place. The reel is `jeep-oradea-1.mp4`, 720x1280 at CRF 34 —
  14.4MB against the other reels' 3.5-5MB, because it is three times longer;
  per second of footage it is on the same ladder, and off-road footage of
  motion and foliage compresses far worse than a showroom. Nothing downloads
  until someone taps the card (`preload="none"`).

**The combined stat tile went.** "2 mărci, zero reciclare între ele" was true of
the pair and false on either page alone; the two that hold per brand (the 40s
script format, the verified-pricing rule) are on both pages.

Jeep has two sections, not three: the deck's third is an instruction to the
implementer ("Secțiune de completat după livrarea…"), not copy, so it was not
pasted in as if it were.
