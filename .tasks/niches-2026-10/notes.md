# /niches — the niche map (2026-10-07)

Source: `transfer-01a11751/EPIC_NICHES_DENIS_2026-10`, README dated 07.10.2026.
A single route: the industry-vs-niche explainer plus a self-serve availability
board.

## The handoff was written for a different build, again

Same story as the case studies package. Its README says "copiezi folderul
niches/ în src/app/niches/ ... atât", and that would have dropped a second
design system into the tree:

| handoff | this project |
|---|---|
| `src/app/niches/`, single locale | two route groups: en at `/`, ro at `/ro` |
| `useLang` from `@/lib/i18n` | `useCopy` / `useLocale` from `_components/context` |
| `bg-ink`, `text-bone`, `text-moss`, `emerald-dim` | hex: `#F5F2F2`, `#1F1F1F`, `#1FDB93`, `#21976A` |
| `display`, `label-mono`, `reveal-line` | do not exist here |
| `/exclusivity` for the manifesto link | no such page — the article `un-singur-brand-pe-nisa` is the same argument |
| `gsap.registerPlugin` per component | one `_components/gsap` |

So the mechanics came over and the surface is this site's: `PageHero`,
`TextSection`, `FeatureRows`, `TrickButton`, hairlines, square corners.

## Multi-city, which the handoff did not have

The package shipped `cities: CityBoard[]` with Oradea as the only entry and a
`defaultCity = cities[0]` that the whole UI read directly. The user asked for
every city in the country, in a dropdown.

**Data.** `_content/ro-cities.ts` — all 320 cities and municipalities with
their counties, built by joining the `romanian-cities` npm list (the right
granularity: communes and villages are not markets we sell a position in)
against the diacritic spellings in
github.com/catalin87/baza-de-date-localitati-romania, with five fixed by hand
where the join missed: Piatra Neamț, Roșiorii de Vede, Lehliu Gară, Slănic
Moldova, Miercurea Ciuc. That dataset ships the cedilla forms ş/ţ, which are
NOT the Romanian letters — normalised to the comma-below ș/ț. Counties are
written out in the generator, since both datasets strip their diacritics and
there are only 42.

**Statuses are positional, not per board.** Hand-writing 320 boards was never
an option and would have rotted the first time a niche was added, so
`boardFor(cityId)` builds a board from the taxonomy at call time:

- `NATIONAL` — Agro Salso holds agro machinery everywhere, because it sells
  nationally;
- `BIHOR` — plus Harmony Garden on the event garden, county-wide, because it
  is in Valea lui Mihai and draws all of Bihor;
- `ORADEA` — plus Origins, Hotel Maxim, DentalNet and KGM · Chery, and the two
  cleaning niches in talks.

Both rules were the user's call. Verified: Oradea 6 taken / 2 in talks / 28
open, Beiuș 2/0/34, Timișoara and București 1/0/35.

**A native `<select>`, grouped into 42 optgroups.** Nine cities already wrapped
the button row onto three lines; 320 needed a different control. Native gets
the phone's own wheel picker, keyboard type-ahead and screen-reader support
for free, and only the box is styled.

## Still draft

Every status in `_content/niches.ts` needs Roland's confirmation before this
goes live, exactly as the handoff states. The board prints its `updated` date
from the data.

## Verified

tsc, eslint and build clean; `/niches` and `/ro/niches` prerender, and the
sitemap picked them up from `routes.ts`. In the browser at 1440x900 and
390x844: 320 options in 42 groups with diacritics, the counters count up and
land on the right numbers per city, the city line shows county and date,
search finds "Curățătorie" from "curatatorie" and "barbershop" across
industries, the empty state appears, no 4xx, no console errors, no horizontal
scroll.

## Rejected: a moving background

The user asked for subtle animated brand-coloured SVG in the background of the
light subpages, then turned down three attempts: drifting sine waves ("prea
comune"), a grid of plus marks with a claimed cell migrating ("tot comun pare,
si nici nu se misca" — and at a subtle opacity it genuinely was not visible),
and a travelling emerald band ("nu un swipe"). A fourth, blocks using the
site's own `mix-blend-mode: difference` to invert the cream rather than tint
it, did not read as a concept either. Reverted to plain cream on the user's
call: "hai sa pastram pe alb deocamdata".

Two findings worth keeping for whenever this comes back:

- **A negative z-index layer needs a stacking context on the frame.** Without
  `isolate` on `PageFrame`'s `<main>`, `-z-10` resolves against the root
  element and the layer paints BELOW main's own cream background: mounted,
  animated, completely invisible.
- **`filter` and `mix-blend-mode` cannot share an element.** A filter makes its
  element a backdrop root, so the blend resolves against that isolated group
  instead of the page. Measured: blocks meant to invert the cream composited
  normally and tinted it pink (240,207,218 — the source colour at 16%) instead
  of the intended mint. The blend has to sit on an outer element and the blur
  on an inner one. Same rule the header's CTA hit earlier in this project.

## Less empty page (8 Oct 2026)

The top of /niches had two holes feeding each other: the hero's left column
held nothing but a four-line summary of the section immediately below it, and
the rule demonstration sat in a `max-w-[640px]` block on its own full-width
section, leaving the entire right half of the page blank.

Both are gone in one move. The `NicheRule` card is now the hero's `aside`:
it measures ~640px and columns 1-3 of the grid are ~619px at the current
container width, so it drops into that slot almost exactly, and the section it
used to own - plus its padding - comes out of the page.

The summary went with it. It was a `KeyList` of `d.how.blocks` titles, and the
same four titles are spelled out in full, with their bodies, in the
`FeatureRows` section directly below: it was filling space by saying the same
thing twice.

Phones are unchanged in substance - the card is still `hidden md:block` there,
because the board renders the same device inline further down and two of them
stacked was never the intent.

What is left, and deliberately not touched: the "01 / HOW IT WORKS" section
still has a wide, near-empty left column. That is `TextSection`'s standing
idiom - label in columns 1-3, content in 4-8 - and it is the same on
/services, /case-studies, /audit and every article. Tightening it (say 2+6
instead of 3+5 above some width) is a site-wide type decision, not a fix for
this page, so it should be made deliberately rather than smuggled in here.

### Copy left, card right (and the band between the sections)

The swap is an opt-in prop on `PageHero` - `asideRight` - not a change to the
component's default, because every other subpage's hero uses the same
component and the aside there is a small companion to the text. Measured after:
/services, /case-studies, /articles, /audit and the detail pages all still put
their copy at 756..1636 and their aside at 136..752. Only /niches moved.

It takes effect at **xl, not md**, and that is the interesting part. Three of
eight columns is 615px at 1920 and 525px at 1440, which the card wants, but
369px at 1024 and 293px at 820 - and measured at 820, the niche names wrapped
onto three lines and "TAKEN - HOTEL MAXIM" ran into the right edge. Exactly the
failure the board hit when it was first put in the reading column. So under
1280 the card stacks below the copy at full width, capped at its own 640px so
it does not stretch.

The empty band between the feature rows and the board section was two
sections' paddings stacked: `TextSection`'s `pb-28` plus the board section's
`py-28`, 224px of nothing with an empty left column beside it. The board
section now takes `pt-0`, so one section's worth separates them - the junction
went from ~300px to 189px, of which the visible empty band is 112px.

Worth noting for later: that doubling is site-wide, not specific to this page -
any two stacked sections have it, and it only reads as a hole here because the
left column has nothing in it down that whole band.
