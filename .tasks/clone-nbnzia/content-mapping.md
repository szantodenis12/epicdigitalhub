# Epic Digital Hub copy → clone structure

Source: `F:\epicdigitalhub-v2\src\lib\dictionaries.ts` (596 lines, EN + RO, full parity).
Brand: **Epic Digital Hub**, growth studio, Oradea.
Core positioning: **one brand per niche, per city** — exclusivity is the whole pitch.

---

## Direct fits — these map 1:1, no compromise

### Nav
| slot | copy |
|---|---|
| wordmark | `EPIC DIGITAL HUB` (replaces the ILLUSIA placeholder) |
| links | System · Services · Work · About (`nav.*` also has Web, Exclusivity, Apply) |
| CTA | `Apply` — the full `hero.ctaPrimary` ("Apply for your city and niche") is too long for a 172px button |

### Hero
- kicker: `Epic Digital Hub — growth studio`
- **h1: "YOUR COMPETITORS CAN'T HIRE US"** (`hero.line1` + `hero.line2`)
- sub: `One brand per niche, per city. Marketing, design, web and production, working only for you.`
- CTAs: `Apply for your city and niche` / `See how it works`

The h1 is ~30 chars vs the current ~62, so it will set larger and on fewer lines.
It is a much stronger headline for a blend-mode treatment — short, declarative,
and it lands the differentiator immediately.

### About statement (the gradient-wave block — two paragraphs)
- P1: `manifesto.title` — "Most marketing fails because it is the same everywhere."
- P2: `manifesto.body` — the "ads chase clicks…" paragraph
- Closer: `manifesto.punch1` + `punch2` — "Epic Digital Hub connects them."

### About eyebrow list — EXACT 4-item fit
`forYou.items` titles map onto the existing four short lines:
`One plan` · `One team` · `One report` · `Your category, locked`

### Stats marquee — EXACT fit, and better than the placeholder
`receipts.stats` gives six real numbers:
- 6500+ hours worked inside client systems
- 40+ strategies & campaign plans written
- 1200+ pieces of content shipped
- 150+ videos filmed & edited
- 500+ graphics & designs delivered
- 7 verticals operated

Replaces `MARQUEE_A`/`MARQUEE_B` outright. Note the source site's A/B halves
deliberately disagreed (117+ vs 50+); with real numbers that quirk goes away.

### Footer — real contact details, no more placeholders
- `Epic Digital Hub — strategy, execution, operation.`
- `Based in Oradea, Romania`
- `hello.epicdigitalhub@gmail.com`

### Curved dividers (2)
- before Work: `Strategy becomes real when you can see the difference.` (`workPage.title`)
- before Process: `The order matters.` (`systemPage.closerTitle`) — or
  `We build the full system behind a brand.` (`system.title`)

---

## Fits with a decision needed

### Services accordion — 9 items available, 5 rows currently
`servicesPage.items`: Marketing strategy · Paid ads · SEO · Brand & design ·
Premium websites · Photo-video · Social & content · Email & retention ·
Campaign planning — each with a written description.

Options: expand the accordion to 9 rows (96px each = 864px collapsed, works
fine), or cut to the 5 strongest. Eyebrow becomes `{ WHAT WE DO }`.

### Work cards — 6 verticals available, 5 cards currently
`workPage.items` — each has title, description AND a tag:
| vertical | tag |
|---|---|
| Automotive retail | Auto / Oradea |
| Dental clinics | Medical / Oradea |
| Agro machinery | Agro / Bihor |
| Hotels & hospitality | Hospitality / Oradea |
| Events & nightlife | Events / Bihor |
| Construction systems | Industrial / RO |

**The "Visit Website ↗" link must go.** `workPage.note` says: *"Client names
shared on request — exclusivity works both ways."* There are no public case
study links by design. Replace the link with the tag, and put that note under
the section.

### Process cards — 3 slots, two candidate sources
- `forYou.steps` — "What happens when you apply": We check your category / You
  get a system preview / You decide. **Exactly 3, and it is the conversion path.**
- `exclusivityPage.how` — the availability check, also exactly 3.

Either fits the three-card fan. The current cards each carry a 5–6 item
checklist that neither source provides; those bullets could be drawn from
`systemPage.steps` (8 items, split 3/3/2) or the cards simplified to drop them.

### Contact form — 2 fields currently, 7 defined
`applyPage.fields`: name, business, **city**, **niche**, website, goal, budget.
City and niche are not optional extras — they are what the whole exclusivity
model runs on. At minimum the form needs name, city, niche.

Headline becomes `cta.title1/2/3`: *"If your market still has space / for a brand
to lead, / we should talk."*
Submit: `Check availability`. Note: `We answer within 2 working days.`

---

## Strong copy with no home in the current structure

1. **`exclusivity.big1/2/3`** — "one niche. / one city. / one brand." Three
   enormous lines. This is the single most distinctive piece of copy in the deck
   and there is nowhere for it yet. It would work as a full-bleed statement
   section, or as a third curved divider.
2. **`testimonials`** — one featured quote plus five named client quotes
   (DentalNet, AutoSiena, Agro Salso, Hotel Maxim, ThermX, HarmonyGarden). The
   clone has no testimonial section at all.
3. **`systemPage.steps`** — the 8-step system, with real descriptions. Too good
   to leave unused; could become its own section or feed the process bullets.
4. **`webPage.principles`** / **`webPage.process`** — 4 principles + 5 process
   steps about premium web specifically.

## Also present, not yet considered
- **Romanian locale at full parity** (`ro`, lines 299–596). The clone is
  English-only with hardcoded strings. Supporting RO means lifting copy into a
  dictionary and adding a locale switch — a structural change, not a copy swap.
- `data/taken-niches.json` — 5 live entries (Oradea: stomatologie, hotel,
  curatatorie, izolatii termice; Bihor: utilaje agricole) driving a real
  availability check via `src/app/api/apply/route.ts`.

## Tone note
The copy is blunt, specific and anti-fluff ("No dressed-up dashboards", "cut
when they stop earning their budget", "regardless of budget"). The clone's
current voice is theatrical illusionist metaphor. The Epic copy is stronger and
more concrete, but it will change the site's character — the magic-trick framing
(Pledge/Turn/Prestige, "Every great trick…") has no counterpart and should go
rather than be half-kept.

---

# IMPLEMENTED (2026-08-31)

Decisions taken: services cut to 5; "Visit Website" links KEPT (brands approved);
contact form left untouched; testimonials added.

| Area | Result |
|---|---|
| Page title / meta | Epic Digital Hub — growth studio |
| Wordmark | EPIC DIGITAL HUB |
| Nav | Services · Work · Clients · About |
| Nav CTA | Apply |
| Hero h1 | YOUR COMPETITORS CAN'T HIRE US |
| Hero image | real `hero-atmosphere.webp` (gradient placeholder deleted) |
| About eyebrow | One plan / One team / One report / Your category, locked |
| About statement | manifesto title + body, closing on "Epic Digital Hub connects them." |
| About CTAs | Apply for your niche / See the work |
| Stats marquee | the six `receipts.stats` figures |
| Showreel | Epic's own `hero-wake.mp4` |
| Services | 5 of 9: Marketing strategy, Brand & design, Premium websites, Paid ads, Photo-video |
| Work | all 6 verticals, each with its tag and real image; Visit Website kept |
| Dividers | "Strategy becomes real…" / "The order matters…" |
| Process | `forYou.steps` — check category / system preview / you decide |
| Testimonials | NEW section at `#clients` |
| Contact headline | "If your market still has space / for a brand to lead, / we should talk." |
| Footer | real email + "Based in Oradea, Romania" |

## Assets brought over from F:\epicdigitalhub-v2
6 work images, 5 service/about images, `hero-atmosphere.webp`, `hero-wake.mp4`,
and three logo SVGs into `public/icons/` (not yet used — see open items).

## Services chosen, and why
Kept: Marketing strategy, Brand & design, Premium websites, Paid ads,
Photo-video — they trace strategy -> identity -> web -> traffic -> production,
and photo-video is a stated differentiator ("not stock footage", 150+ videos in
the receipts). Dropped: SEO, Social & content, Email & retention, Campaign
planning. All four remain in the dictionary and are one array entry away.

## Testimonials — how it was built
Deliberately assembled from patterns already on the page rather than as a new
one: the `#0F0F0F` panel and `{ ... }` eyebrow marquee from Services, the
featured quote reusing the About statement's gradient-wave reveal, and the
supporting quotes on the same `border-white/15` hairline rows as the Services
accordion. Names take the emerald accent.

`GradientWaveText` gained a `dark` prop for this: on a dark panel the wave has
to settle to the light body colour, since settling to `#1F1F1F` would leave the
text invisible.

## Bug found and fixed during implementation
The first nav mapping gave "System" and "Services" the same `#services` href,
and the list keyed on `href` — React threw "two children with the same key".
Remapped to four real, distinct sections and switched the key to `label`.

## Open items
1. **"Visit Website" links have no URLs.** The copy deck has no client URLs, so
   all six still point at `#`. They need real addresses.
2. **Client names are not on the work cards.** Cards use vertical names
   ("Automotive retail"). The names exist in `testimonials` and
   `taken-niches.json`, and a mapping is inferable (AutoSiena -> Automotive,
   DentalNet -> Dental, Agro Salso -> Agro, Hotel Maxim -> Hotels, ThermX ->
   Construction, HarmonyGarden -> Events) but that is INFERENCE and was not
   applied.
3. **Logos unused.** `epic-mark-inverted.svg`, `epic-lockup-v3.svg`,
   `epic-atom.svg` are in `public/icons/`; the wordmark is still live text
   because it sits inside the `mix-blend-difference` header.
4. **Romanian locale** still not wired — strings remain hardcoded.
5. **`one niche. / one city. / one brand.`** still has no home.
6. Route is still `/clone`.

## Testimonials — motion added (section felt flat)

**On appear:** rows stagger up (y 28 → 0, opacity 0 → 1, 80ms apart,
expo-out), and the featured attribution lands after the wave has swept the
quote.

**On hover:** the row indents 24px, its name goes 70% → 100% emerald, the quote
lifts from `white/60` to `white/95`, and a 2px emerald line sweeps the row's
bottom edge from the left — the same `origin-left scale-x-0 → scale-x-100`
idiom the footer email underline already uses, so the interaction reads as part
of the same site rather than a new pattern.

### Reveal had to move off ScrollTrigger
The first attempt used `gsap.from(...)` with a ScrollTrigger, and **every row
stayed at opacity 0**. This section sits after the sticky work stack and two
pinned dividers, so ScrollTrigger's cached start position for it is stale — the
tween applied its from-state and never played. Rewritten with motion's
`whileInView`, which uses IntersectionObserver and is immune to that. Verified:
all five rows reach opacity 1.

### Note for future verification on this codebase
Tailwind v4 emits the independent `scale` / `translate` / `rotate` CSS
properties, NOT `transform`. Reading `getComputedStyle(el).transform` for a
`scale-x-*` utility returns `"none"` and looks like a broken effect. Check
`.scale` instead. This cost a wrong diagnosis here.

## FIXED — curved-text stayed on screen after the pin ended

User: "the text remains on the screen, which is not correct."

### Cause
`endOffset` was hardcoded to **-150.87**, a value measured off nbnzia.com and
correct only for THAT site's sentence. Our dividers now carry Epic's own,
longer copy, so -150.87 no longer travelled far enough: the text stopped with
~700px still painted on screen, froze there for the rest of the pin, and then
dragged down over the incoming Work section.

### Fix
Derive the end from this string's own length:

    endOffset = -(textPath.getComputedTextLength() / path.getTotalLength()) * 100

which is exactly the point where the trailing glyph passes the start of the
path, whatever the copy says. Now resolves to about -192.8 for divider 1 and
-192.3 for divider 2 — and will stay correct if the copy changes again.

### A margin that had to come back off
First attempt added `- 6` as safety. That overshot: the text cleared ~240px
before the pin ended, reintroducing dead scroll at the tail — the same class of
problem as the earlier lead-in bug, just at the other end. The bare ratio is
right, because the viewport is narrower than the path, so the text leaves SIGHT
slightly before it leaves the path.

### Verified
Text fully gone by ~97% of the pin, and nothing painted at the pin end or
beyond. No overlap with the Work section at any offset through the handoff.

### Measurement note
`getBoundingClientRect()` on a `<text>` with a `textPath` keeps reporting a
~175-207px box after every glyph has left the path. That residual is NOT
visible ink — confirmed by screenshot. Do not treat a non-zero bbox here as
"still on screen".

## Hero + scroll performance

### Scroll jank — `mix-blend-mode` removed from the FIXED header
A blended `position: fixed` element cannot be promoted to a cheap compositor
layer: the browser must re-read and re-blend the backdrop on every scroll
frame while the page moves underneath it. That is the standard cause of exactly
this symptom, and it sat over the largest image on the page.

Replaced with an **IntersectionObserver** watching a thin band under the header.
Sections carry `data-nav-bg="light|dark"` (work cards derive theirs from the
`fg` colour already in the data), and the nav swaps between `#F5F2F2` and
`#1F1F1F`. No per-frame cost, and the colours are now chosen rather than
whatever `difference` happened to produce — which also fixes the off-brand pink
nav over the emerald hero.

The nav CTA gained a `solid` variant (`#1F1F1F` on light) because the blended
white pill disappears against a light backdrop.

**The h1 keeps `mix-blend-difference`** — it scrolls with the page rather than
being fixed, so it does not force a re-blend per frame, and the two-tone read
against the hero image is the effect worth keeping.

Verified: nav resolves to `rgb(31,31,31)` over the cream About section and
`rgb(245,242,242)` over near-black Services.

### Hero headline
- Centred in the viewport (was pinned to the bottom): measured centre 540 in a
  1080 viewport.
- Load animation: each of the two lines rises out of its own clipping mask
  (`y: 115% -> 0`, expo-out, 120ms apart), skipped under `prefers-reduced-motion`.

### Two measurement traps hit here
1. `rootMargin: "-72px 0px -100% 0px"` collapses the observer root to a
   zero-height rect (top 72 > bottom 0) — nothing ever intersects and the nav
   never flips. Use `-92%`.
2. Frame timing CANNOT be measured in this automation environment: rAF is
   throttled to ~1fps, so a scroll benchmark returned identical ~1007ms frames
   with the blend both on and off. CSS transitions are throttled too, which
   made `getComputedStyle(...).color` read stale mid-transition values. The
   className flip is the reliable signal; colour needs a long settle.

### Still open
The hero image `hero-atmosphere.webp` is only **7.4KB** for a full-bleed
100vh/100vw fill — it is visibly blocky when scaled up. It needs a
higher-resolution source.


## REVERTED — header blend put back (negative-space effect)

I removed `mix-blend-mode: difference` from the fixed header as a scroll-jank
fix. That WAS the negative-space effect, and the user wanted it back. Reverted.

Judgement error worth recording: the removal was based on an unverified
hypothesis. Frame timing cannot be measured in this environment (rAF throttled
to ~1fps), so there was no before/after to justify trading away the site's most
distinctive detail. The right order was: restore the effect, then look for
optimisations that do not cost it.

### What was kept from that work
- **Hide/show now animates `transform` instead of `top`.** The source animates
  `top`, but on a blended fixed element that forces layout plus a full re-blend
  on every frame of the transition. A transform stays on the compositor. This is
  the one optimisation available that costs nothing visually.
- Sections still carry `data-nav-bg="light|dark"`. Nothing reads them now, but
  they are the hook if class-based nav colouring is ever needed again.
- `TrickButton` keeps its `solid` variant (unused by the nav now).

### Constraint to remember
The blend MUST be on the fixed element itself. `position: fixed` always creates
a stacking context, so a blended child composites against the header's own
transparent group rather than the page — which is exactly the bug that made the
CTA render flat white earlier in this project.

### Verified after revert
Header inverts against its backdrop: white over the dark hero, near-black over
the cream About panel.

## Parallax — added selectively, not globally

Blanket parallax was rejected. This page already runs 3D card stacking, a
scrubbed curved textPath, the Flip video morph, the gradient wave and several
staggered reveals; layering parallax over all of it would read as busy rather
than smooth, and the user had already reported jank once.

### Where it was applied (all verified moving)
| target | travel | measured translateY |
|---|---|---|
| hero image | 160px | 0 -> 103.7 |
| about statement column | 48px | -14.9 / 7.6 / 24 |
| process card deck | 90px | -33.2 / -2.6 / 28.1 |
| contact headline | 56px | -22.3 / 2.6 / 2.9 |

The hero is the strongest: the image layer is oversized to 130% and offset
-15%, so it can drift 160px without ever exposing an edge, and the headline
deliberately does NOT move — the image sliding under a static headline is what
reads as depth.

### Where it was deliberately NOT applied
- **Work card images — tried, measured, removed.** The cards are
  `position: sticky`; once a card pins, nothing inside it moves relative to the
  viewport, so scroll progress freezes. Measured -15.5px then 0, then 0. Sticky
  and parallax cannot coexist. The cards already have the 3D recede as their
  depth cue.
- **The showreel** — `Flip.fit` owns its transform; a parallax `y` would fight
  it for the same property.
- **The curved dividers** — their content is `position: fixed` while pinned, so
  there is no relative movement to drive anything.
- **The process CARDS** (as opposed to the deck) — GSAP owns those transforms
  for the fan and the inertia tilt. The deck wrapper is parallaxed instead.
- **Services media** — hover-driven, not scroll-driven.

### Implementation note
Built on motion's `useScroll` rather than another ScrollTrigger. This page has
repeatedly hit stale cached positions from GSAP triggers created around pinned
sections (the testimonials reveal had to move off ScrollTrigger for the same
reason); motion's scroll tracking does not have that failure mode.
`prefers-reduced-motion` returns a plain div with no transform.

## Mobile pass — desktop deliberately untouched

All three changes are mobile-only (base styles + a `max-width: 768px` rule);
every desktop value was re-measured afterwards and is unchanged.

### 1. Curved divider text was rendering at NINE pixels
The SVG has a 1516-unit viewBox but shrinks to fit the screen — at 375px it
renders at **scale 0.261**. A declared `9vw` (33.75px) therefore came out as
**9 effective pixels**, which is why the effect had no impact.

There was already a `@media (max-width: 768px) { .curved-textpath-size {...} }`
rule intended to fix this, but the `textPath` carried an inline `9vw` and **no
such class** — the rule had never matched anything.

Added the class and set `font-size: clamp(240px, 78vw, 300px)` so the declared
size compensates for the render scale across the mobile range.

| viewport | effective before | effective after |
|---|---|---|
| 375 | **9px** | **76px** |
| 1920 (desktop) | 190px | 190px (unchanged) |

### 2. Showreel reserved ~550px of empty scroll on mobile
The Flip morph on mobile travelled from 320px to 328px — a 2.5% growth — while
the big box reserved a 548px gap, leaving the video floating in a large empty
band.

Mobile now skips the Flip entirely (`matchMedia("(min-width: 768px)")` guard,
re-evaluated on breakpoint change) and the big box is `hidden md:block`, so it
reserves nothing. The video is a full-width 16:9 element in normal flow.

| | mobile before | mobile after | desktop |
|---|---|---|---|
| big box | rendered | **not rendered** | rendered (unchanged) |
| gap to big box | 548px | **none** | 384px (unchanged) |
| video | 328x185 floating | 328x185 in flow | Flip 320 -> 1408 (unchanged) |

### 3. Hero headline overflowed the viewport
At `13vw` (48.75px) the word "COMPETITORS" was wider than the 343px available
and was cut off at the right edge — which is what made the line-mask reveal
look broken. Base size reduced to `10.5vw` (39.4px) with line-height 1.02;
`md:text-[96px]` untouched.

Verified: widest line 328px against a 375px viewport, `scrollWidth` 360 — no
horizontal scroll. Desktop widest line 1000px at 96px, unchanged.

## CORRECTION — mobile showreel: the animation was removed, not scaled

The previous entry said mobile "skips the Flip entirely" and shows the video as
a static full-width element. That was an over-correction: the complaint was that
the video took up too much of the screen, and the response deleted the animation
rather than sizing it for mobile. The morph is now restored on both breakpoints.

Root cause of the original problem was never the morph itself — it was that the
mobile SMALL box had been left at full width, so there was nothing to grow into
while the layout still reserved the gap for a large one.

| | mobile before | mobile now | desktop |
|---|---|---|---|
| small box | 328 (full width) | **190 (58%)** | 320 (unchanged) |
| big box | hidden | **328 (full width)** | 1408 (unchanged) |
| growth through scrub | none | **227 -> 328 (~1.7x)** | 633 -> 1408 (unchanged) |
| gap small -> big | 548px | **426px** | 384px (unchanged) |

`mt-24` on mobile, `md:mt-[218px]` on desktop. The `matchMedia` guard and its
state were removed — the Flip runs everywhere again.

### Recurring mistake worth noting
Three times in this session a `{/* ... */}` comment was placed directly inside
`return (` before the root element, which is two sibling expressions and a parse
error. In that position the comment must be a plain `//` line ABOVE the
`return`, or moved inside the element.

## THE ACTUAL BUG — showreel breaks on RESIZE, not on mobile

Everything I had been fixing was the wrong target. Reloading at a mobile size
always looked fine, which is why my tests kept passing while the user kept
seeing a video that filled the screen.

`Flip.fit` BAKES a transform at creation time from the two boxes' rects. It does
not track layout. Resize the window — or rotate a phone, or toggle devtools
device mode — and the stale transform persists.

Reproduced: load at 1440, narrow to 533 WITHOUT reloading.

| | width | % of viewport |
|---|---|---|
| at 1440 | 1386px | 96% |
| after narrowing to 533 | **1393px** | **261% wide, 97% tall** |

### Fix
A debounced `resize` / `orientationchange` listener bumps a key in the hook's
deps, which tears the tween down and re-fits against the new geometry.
`gsap.set(scaling, { clearProps: "transform" })` runs before each fit and in
cleanup, so a leftover transform is never folded into the new one, and
`ScrollTrigger.refresh()` follows because the pins and scrubs elsewhere cached
positions against the old layout too.

Verified in both directions:

| | width | % of viewport |
|---|---|---|
| loaded 1440 | 1386px | 96% |
| narrowed to 533, no reload | **486px** | **91% wide, 34% tall** |
| back to 1440 | 1385px | 96% |

### Also fixed: services copy clipped on mobile
The description was `max-w-[50%]` — a desktop measure, since the media occupies
the other half. On mobile the media is hidden, so halving the width made the
copy wrap far more and get cut off mid-sentence by the fixed 112px content
height. Now `max-w-none pl-0` on mobile, `md:max-w-[50%] md:pl-[4.5rem]`
unchanged on desktop.

| viewport | copy height | wrapper | clipped |
|---|---|---|---|
| 375 | 92px | 112px | no |
| 533 | 70px | 112px | no |
| 1920 | 70px | 112px | no |

### Lesson
"Works on mobile" and "works when resized to mobile" are different tests. Any
animation that measures geometry once at mount needs a resize path, and testing
only by reloading at a fixed viewport will never catch it.
