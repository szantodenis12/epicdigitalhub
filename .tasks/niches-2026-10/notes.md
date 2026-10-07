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
