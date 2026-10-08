# QA Review — 2026-08-28 (full sweep, real-input retest)

## Overall Status: NEEDS_WORK  — SUPERSEDED, see banner below

> **STATUS UPDATE (2026-08-29).** Both Critical issues in this report were
> fixed AFTER it was written; re-verified on the running dev server today:
>
> 1. **Nav blend** — FIXED. Cause: `position:fixed` + `z-index` were on the
>    `<header>` while `mix-blend-mode` was on the child `<nav>`, so the wrapper
>    formed a stacking context that isolated the child's blend from the page
>    backdrop. The source carries all three on ONE element. Moved the blend onto
>    the header and set the nav text to white (white is what `difference`
>    inverts correctly: white-over-gold → navy, white-over-black → white,
>    white-over-cream → near-black). Verified: CTA renders navy over the gold
>    hero, near-black over cream, cyan over the orange work card.
> 2. **Nav hide/show stuck** — FIXED. The report's root-cause analysis was
>    correct (`getVelocity()` divides by a module-level `_time2` shared across
>    all ScrollTriggers, starved under a ~16ms cadence). Dropped ScrollTrigger
>    for this entirely and drove it off Lenis's per-instance `direction`.
>    Verified with real `page.mouse.wheel` at 16ms ticks: down → `top:-100px`,
>    up → `top:16px`.
>
> Everything below this banner is the original report, kept as the record of
> how both bugs were found. Fixes applied since are appended at the END of this
> file.

This supersedes the previous partial review-notes.md. Full section-by-section
sweep completed at 1920x1080 / 1024x768 / 375x812, plus the Priority-1 nav
investigation using **real, trusted Playwright input** (`page.mouse.wheel`,
not synthetic `WheelEvent` dispatch). Two Critical bugs found, both in the
nav mechanism — neither is what the brief described, but both are real and
reproducible. Everything else checked (section order, services accordion,
work cards, both curved dividers, process fan math, showreel Flip morph,
contact spotlight, mobile hamburger, images) came back correct or
better-than-expected.

---

## Critical Issues (2 found)

### 1. Nav — the mix-blend-difference "chameleon" effect does not render for content inside `<header>`

**Issue:** The already-fixed notes claimed "double blend — confirmed correct,
two-tone renders right." That was only ever verified for the H1 (which is
*not* inside the fixed header). Retested this session with the header's own
content and it's broken: everything inside `<header>` that has an **opaque
fill** stays flat, un-blended, always-white. Text-only content inside the
header (nav links, wordmark) *looks* like it's blending correctly, but that's
a false read — `#1F1F1F` is dark regardless of whether the blend math ran,
so you can't tell by eye. The button is the only element with a fill color
maximally different from its "blended" answer, and it exposes the bug
cleanly.

**Expected** (verified via `getComputedStyle` math + the source's own
screenshots, `section-hero.png` and `section-about-cta-buttons.png`):
`.btn` is `background:white; mix-blend-mode:difference`, nested inside
`.willen-nav` (also `difference`). The visible color is
`difference(white, backdrop)`, so it changes per section:
- over the gold hero (`~rgb(250,225,150)`) → **dark navy**, computed
  `|255-250|,|255-220|,|255-140|` ≈ `rgb(5,35,115)` — this is exactly the
  dark-blue box visible in `section-hero.png`.
- over the cream page bg (`#F5F2F2` ≈ `rgb(245,242,242)`) → **near-black**,
  confirmed by `section-about-cta-buttons.png` (both "Let's talk" and "See
  the work" render as solid near-black boxes there).
- over a dark maroon mid-scroll panel → **cyan**, confirmed by
  `section-services-rest-true.png` (nav wordmark/links/button all render
  light cyan there).

**Actual:** In the clone, `a.btn` inside `<header>` renders **flat white
with black text, in every one of these same three backdrop conditions** —
confirmed by direct screenshot at the same scroll positions:
- over the gold hero: flat white (`clone-hero-desktop.png`,
  `clone-tablet-hero.png`) — expected dark navy.
- over the near-black services background: flat white
  (`clone-nav-over-services2.png`) — expected near-white too here, so this
  one is inconclusive by itself, but combined with the other two it's not.
- over the gold/cream About area: flat white
  (`clone-nav-over-about-cream.png`) — expected near-black/navy.

**Control test (proves the CSS/engine both work fine elsewhere on this
exact page):** the "See the work" button in `#about` — same `variant="base"`
component, same `mix-blend-difference` class, but *not* inside the fixed
header — renders **correctly** as a solid near-black box in
`clone-tablet-about.png`. The H1 also blends correctly (dark over the sky,
light over the silhouette, confirmed in both `clone-hero-desktop.png` and
`clone-mobile-hero.png`). `getComputedStyle` on `header`/`nav`/`btn` shows
`mix-blend-mode: difference` correctly applied, no `isolation`, no
`transform`, no stray stacking-context breaker on any ancestor — the CSS is
present and correct, but the browser isn't compositing it against the true
page backdrop for anything inside the `position:fixed; z-index:99999`
header.

**Likely direction for a fix (not confirmed, just where I'd look next):**
this smells like a compositing-layer issue specific to `position:fixed`
elements with a very high `z-index` — Chromium sometimes promotes such
elements to their own GPU layer, and `mix-blend-mode` needs the blended
element and its backdrop in the same paint/stacking group to work. Since the
source site does this exact construction successfully, the fix is probably
something narrower (DOM order, an intervening wrapper, or a
`transform`/`will-change` nudge) rather than "blend-mode can't work on fixed
nav" — but I did not find the exact trigger in the time available.

**Fix:** Reproduce minimally (a bare `position:fixed` white div with
`mix-blend-mode:difference` over a colored backdrop) and bisect what in the
header's actual ancestor chain (Next.js root layout wrappers included)
breaks it, since the header's own computed styles look clean in isolation.

---

### 2. Nav hide/show on scroll — not inverted, but unreliable/stuck under real continuous scrolling

**Issue:** Retested per your instruction with real Playwright input
(`page.mouse.wheel`, `page.mouse.move`, real waits — not synthetic
`WheelEvent`). Verdict: **your synthetic-event caveat was right, it was an
artifact** — the code is not inverted, and under one specific real-input
pattern it works exactly as specified. But under a *different*, more
realistic real-input pattern, it doesn't react at all. This is a genuine,
newly-found bug, just not the one described in the brief.

**Test A — slow, discrete ticks (`wheel(0,300)` + 150ms wait, 8x), real
mouse.wheel:**
```
start:                              scrollY=0    top=16px   (visible)
after scrolling DOWN ~2400px:       scrollY=2399 top=-100px (hidden)  ✓ correct
after scrolling UP ~2400px:         scrollY=1    top=16px   (visible) ✓ correct
```
Guard also verified correct: scrolling to y=80 (within the 120px guard)
keeps `top:16px`; continuing past y=120 while still moving down flips to
`top:-100px` at y=479. This pattern **works exactly as specified.**

**Test B — continuous realistic cadence (`wheel(0,40)` every 16ms, i.e. a
normal trackpad/mouse-wheel gesture speed), scrolling DOWN from y=0:**
```
i0:  y=40   top=16   i15: y=640  top=16   i30: y=1240 top=16   i45: y=1840 top=16
i5:  y=240  top=16   i20: y=840  top=16   i35: y=1440 top=16   i50: y=2040 top=16
i10: y=440  top=16   i25: y=1040 top=16   i40: y=1640 top=16   i55: y=2240 top=16
```
**Never hides**, all the way to y=2240, despite continuous fast downward
scrolling well past the 120px guard.

**Test C — same continuous cadence, scrolling UP** from an already-hidden
state (reached via Test A's method, `y=2399, top=-100`):
```
y=2360 top=-100   y=1960 top=-100   y=1560 top=-100   y=1160 top=-100
y=2160 top=-100   y=1760 top=-100   y=1360 top=-100   y=960  top=-100
```
**Never shows**, all the way from y=2399 down to y=960, despite continuous
fast upward scrolling.

**Conclusion:** the mechanism is not inverted — it's **direction-agnostic
stuck** under any continuous/realistic scroll cadence, only working when
scroll events are artificially spaced ~150ms apart (a cadence no real user
input produces; real trackpads/wheels fire every ~16ms). This explains why
your five previous attempts all looked "inverted" under synthetic dispatch:
if the nav happened to load already in one state, continuous synthetic
scrolling in either direction would leave it stuck in that same state,
which reads as "backwards" for whichever direction you tested against.

**Root cause (found, not just hypothesized):** `self.getVelocity()`
(`node_modules/gsap/ScrollTrigger.js:1616`) is
`(scrollFunc() - scroll2) / (_getTime() - _time2) * 1000`, where `_time2` is
a **module-level global** (`ScrollTrigger.js:23`), shared across every
ScrollTrigger instance on the page, refreshed only when
`recordVelocity = time - _time1 >= 50` is true inside the *shared*
`_updateAll` loop (`ScrollTrigger.js:583,596`). This page runs **many**
concurrent ScrollTriggers (2x `CurvedDivider` pins, the `Showreel` Flip
scrub, the `ProcessCards` reveal, plus this nav trigger) all calling
`.update()` off the same Lenis-driven `gsap.ticker`. Under continuous
scrolling, the shared `_time1`/`_time2` bookkeeping gets updated by whichever
trigger's update happens to land on a given tick, and the nav trigger's own
`getVelocity()` ends up dividing by a stale/mismatched time delta, driving
the computed velocity toward ~0 — permanently under your `Math.abs(v) < 60`
gate — so `setNavHidden` never fires again until the gesture stops long
enough for a clean 50ms+ gap (exactly Test A's condition).

**Fix — stop routing this through GSAP ScrollTrigger's shared velocity
state.** Lenis already computes a reliable, per-instance,
not-globally-shared `direction` (`1`/`-1`) every raf frame
(`node_modules/lenis/dist/lenis.mjs:665,834`,
`this.direction = Math.sign(this.animatedScroll - lastScroll)`), and its
`scroll` event payload **is** the Lenis instance itself
(`lenis.mjs:319,649`: `this.emitter.emit("scroll", this)`), so
`e.direction` is available directly with no extra wiring:
```js
lenis.on("scroll", (e) => {
  if (e.scroll <= 120) { setNavHidden(false); return; }
  if (e.direction === 1) setNavHidden(true);
  else if (e.direction === -1) setNavHidden(false);
});
```
This sidesteps the shared-global-state contention entirely and should be
reliable under any scroll cadence.

---

## Major Issues (1 found)

### 3. React console error on load: dependency array size change

**Issue:** `browser_console_messages` (level: error) shows, once per load:
```
The final argument passed to %s changed size between renders.
The order and size of this array must remain constant.
Previous: %s
Incoming: %s
useEffect [] [false] @ node_modules_next_dist_1e8vcs8._.js:1052
```
i.e. some `useEffect` is called first with a `[]` dependency array and then
with `[false]` on a later render — a real React error (not a warning). I
checked every `useEffect` call site in `page.tsx` by hand (lines 402, 485,
634, 825, 848) and all five use a stable single-element array (`[reduceMotion]`
or `[text, reduceMotion]|`) — none of the app's own effects should do this.
The likely source is the `useSyncExternalStore`-based
`usePrefersReducedMotion` hook interacting with React's internal shim, or a
Next.js dev-mode/Fast-Refresh reconciliation artifact — I could not pin down
the exact call site in the time available, and I did not verify whether this
also occurs in a production build.

**Fix:** worth a `React.useEffect` audit specifically around
`usePrefersReducedMotion`'s `useSyncExternalStore` call and a check against
a production build before dismissing this as dev-only noise.

Also present, almost certainly unrelated/environmental: repeated
`WebSocket connection to 'ws://localhost:3000/_next/hmr?...' failed:
net::ERR_CONNECTION_REFUSED` — consistent with the dev server having been
restarted under an already-open tab; not a code defect.

---

## Minor Issues (1 found)

### 4. `body`/work-card-2 background off by 1 in the blue channel
`rgb(245,242,242)` in the clone vs. source's `rgb(245,242,243)` for
`#F5F2F2`. Imperceptible, carried over from the previous review pass,
unchanged.

---

## What's Working Well

Confirmed this session, with numbers:

- **Section order & presence** — nav, hero, about (bio/CTA/marquee/showreel),
  services, curved divider 1, work (5 cards), curved divider 2, process,
  contact/footer. Both curved-text dividers present and correctly placed:
  divider 1 spans scrollY 3789.6→8109.6 (exactly 4320px, and its end lines
  up pixel-exact with Work's start at 8109.6); divider 2 spans
  13509.6→17829.6, starting pixel-exact at Work's end (5 cards × 1080px
  = 13509.6). Page height 19511px, in the right ballpark of the ~20,000px
  estimate.
- **Services accordion** — row heights measured 96/96/244/96/96 (one row
  open at a time, hover-driven), exact match to the source's 96px collapsed
  / 244px expanded spec.
- **Work cards** — all 5 colors verified via `getComputedStyle`:
  `#FFCD71`/`#1F1F1F`, `#1F1F1F`/`#F5F2F2`(off by 1, see Minor #4),
  `#FAE7D5`/`#1F1F1F`, `#1049CC`/white, `#7A6E5B`/white — all correct. All 5
  images load correctly once actually scrolled into view (naturalWidth/
  Height nonzero); my first pass flagged work-3/4 as 0×0 but that was my own
  test artifact (scrolled too fast for the lazy-load IntersectionObserver) —
  confirmed fine on a deliberate re-check.
- **Curved-divider scrub** — sampled `startOffset` during a real scroll:
  214.9% → 160.9% → 107.0% → 53.0% → -1.0% → -55.0% → -109.0% → -163.0% over
  8 even wheel ticks — perfectly linear, monotonic, no jumps.
- **Process card fan** — computed `transform` matrices match the spec
  exactly: card 0 `matrix(0.996195,-0.0871557,0.0871557,0.996195,-300,45)`
  (=rotate(-5deg) translate(-300,45)), card 1 identity, card 2 the mirror —
  `cos(5°)=0.9962, sin(5°)=0.0872` bang on.
- **Showreel Flip morph** — sampled through a real scroll:
  320×180 → 432×243 → 768×432 → 1104×621 → 1408×792, then holds. Every
  intermediate size is exactly 16:9 (1.778) — smooth, monotonic, no
  aspect-ratio distortion, no jump.
- **Contact spotlight** — `--xpercent` custom property verified updating
  live off real mouse movement (moved to 20% of the wrapper's width →
  property read back `19.99%`).
- **Button corner-arc hover** (non-nav button, `#about` "Let's talk") —
  re-verified with a clean real hover: `.btn-arrow-top` →
  `matrix(0,1,-1,0,155.2,0)` (rotate(90deg) + translateX(155.2px = 9.7rem)),
  `.btn-arrow-bottom` → the mirror at -155.2px. Exact match to spec.
- **Mobile hamburger overlay** — `#1B372E` dark green confirmed, correct
  nav links, clip-path reveal animation runs.
- **No image 404s** — full network log reviewed after scrolling the entire
  19,511px page; every image/video/font request resolved 200/206/304, zero
  4xx/5xx.
- **Responsive** — spot-checked hero and about-CTA at 1024×768: layout
  reflows correctly (single-column-friendly nav, buttons stack), text wraps
  sensibly, h1 line breaks reflow correctly (still no space after "parts.").

## Not fully verified
- Production-build behavior (everything above was tested against `next dev`,
  per the task setup) — the console error in Major #3 in particular should
  be re-checked against a prod build.
- Full pixel-for-pixel color sampling (I used computed-style/math
  cross-checks against the reference screenshots rather than raw pixel
  extraction from PNGs, which wasn't available as a tool this session).
- Tablet/mobile coverage was a spot-check (hero + about + hamburger), not
  the full section-by-section sweep done at desktop.

---

# Post-review fixes applied (orchestrator)

## FIXED — Critical: nav hide/show was frozen, not inverted

Root cause (found by QA): `ScrollTrigger.getVelocity()` computes against a
**module-level** timestamp (`_time2` in `node_modules/gsap/ScrollTrigger.js`)
shared by every ScrollTrigger on the page and refreshed only every >=50ms.
This page runs five concurrent triggers (2 curved dividers, showreel Flip,
process-card reveal, nav), so under a continuous ~16ms scroll cadence the nav
trigger's velocity reading starves toward zero and never clears the
`Math.abs(v) < 60` gate — the nav froze in whatever state it loaded in.

My earlier synthetic-`WheelEvent` tests spaced ticks ~150ms apart, which is
why they appeared to work-but-inverted rather than showing the real freeze.

Fix: dropped ScrollTrigger for this entirely and drove it off Lenis's own
per-instance `direction` (1 = down, -1 = up) from the scroll event payload.
No shared global state, no contention.

Verified with REAL `page.mouse.wheel` at a 16ms cadence:

| Step | scrollY | header `top` |
|---|---|---|
| rest | 0 | 16px |
| scroll down | 4000 | -100px |
| scroll up | 2000 | 16px |
| scroll down | 5000 | -100px |
| scroll up to top | 0 | 16px |

## FIXED — Critical: mix-blend-difference broken inside <header>

The "Let's talk" CTA rendered flat white against every backdrop.

Cause: the clone split `position: fixed` + `z-index` onto a wrapper `<header>`
and put `mix-blend-mode` on the child `<nav>`. The wrapper therefore formed a
stacking context that ISOLATED the child's blend from the page backdrop, so
the nav blended only against its own group. The source carries fixed,
z-index AND mix-blend-mode on ONE element (`.willen-nav`).

Fix: moved `mix-blend-difference` onto the `<header>` itself, alongside
`fixed` and `z-[99999]`, and removed it from the child `<nav>`.

Second half of the same bug: nav text was `#1F1F1F`. Under `difference` the
text must be **white** to inverta correctly:
- white over gold (247,220,140) -> (8,35,115) navy
- white over near-black -> white
- white over cream (245,242,242) -> near-black

Changed the wordmark, nav links and hamburger to `text-white`. Verified
visually against the hero (navy) and the work/services backdrops (near-black,
with cyan where letters cross the orange card) — matches the source's
chameleon behaviour.

## Still open
- Hero portrait remains a gradient placeholder; real `hero-portrait.avif` is
  downloaded and available. Awaiting the user's decision.
- Minor items from the QA sweep above are not yet addressed.

## FIXED — Major: work cards had no stacking/recede animation (user-reported)

The clone rendered the five case studies as five plain full-height divs that
simply scrolled past one another. The source stacks them.

Source mechanism (measured live):
- `.section-case` — overflow hidden, height 5400 (5 x 1080)
- five `.case-slide` children, each 1080
- each slide's `.case-content-wrapper` is GSAP-**pinned** for exactly one
  viewport height (its pin-spacer measures 2160 = 2 x 1080)
- while pinned, the inner `.case-content` is scrubbed DOWN in scale so the card
  recedes into the background as the next slide rides over it
- the wrapper behind it is `#F5F2F3`, which is what shows at the edges as the
  card shrinks

Measured scale curve over one card's pin:

| progress | source scale |
|---|---|
| 0.00–0.25 | 1.0 (holds) |
| 0.48 | 0.9979 |
| 0.72 | 0.9888 |
| 1.00 (unpin) | 0.9667 |

Hold-then-accelerate — approximately `power3.in`.

Implementation: native `position: sticky` for the pinning rather than a GSAP
pin. Same visual result, cheaper, and it avoids adding five more *pinned*
ScrollTriggers to a page that already contends over GSAP's shared update state
(the exact contention that froze the nav — see above). One scrubbed
`power3.in` tween per card drives the scale; the last card never recedes
because nothing covers it.

Verified in-browser — card 0 pinned at y=0 while card 1 rides up:

| offset into card | clone scale |
|---|---|
| 0 | 1.0 |
| 300 | 0.9998 |
| 600 | 0.9968 |
| 900 | 0.9839 |
| 1080 | 0.9667 (exact match to source endpoint) |

## CORRECTION — work-card recede was far too weak, and the last card was wrong

Two errors in the first implementation of the stacked work cards, both
user-reported and both confirmed against the source.

### 1. Scale endpoint was wrong (0.9667 -> 0.70)

My original measurement was truncated. GSAP's `scrub` EASES toward its target,
so sampling shortly after a scroll jump reads a LAGGING value, not the settled
one. I recorded those lagging values as endpoints. Re-measured with a 2500ms
settle at each sample point:

| progress | source scale (settled) |
|---|---|
| 0.00 | 1.0 |
| 0.25 | 0.9964 |
| 0.50 | 0.9837 |
| 0.75 | 0.9374 |
| 1.00 | 0.8815 |
| (final resting) | **~0.6994** |

So the card recedes to ~70%, not ~97%. The animation also runs longer than one
viewport height — roughly 1.5 viewports — which is why it keeps shrinking after
its own slide has passed.

Now: `scale: 1 -> 0.7`, `power2.in`, over `+=150%`.

### 2. The LAST card animates too — it fades, it does not just sit there

I had explicitly skipped the last card on the reasoning that nothing covers it.
Wrong: because nothing covers it, the source instead FADES it out — this is the
only card where the opacity change is visible.

| offset | source scale | source opacity |
|---|---|---|
| 4320 | 1.0 | 1.0 |
| 5400 | 0.918 | 0.796 |
| 5940 | 0.864 | 0.546 |
| 6480 | 0.800 | 0.308 |
| 7000 | 0.769 | 0.207 |

Now: the last card gets the same scale tween over `+=200%` plus an opacity
tween `1 -> 0.15` (`power1.in`), and an extra `100svh` cream spacer was added
inside `#work` so it has room to recede and dissolve IN PLACE rather than
scrolling away.

Verified in the clone:

| point | source | clone |
|---|---|---|
| card 1 @ half | 0.984 | 0.989 |
| card 1 final | 0.699 | 0.700 |
| card 5 @ ~5900 | 0.864 / op 0.546 | 0.883 / op **0.545** |

### Lesson for future measurement
Never read a scrubbed GSAP value without letting it settle. Short waits after a
programmatic scroll report the tween mid-flight and will understate every
endpoint on this page.

## CORRECTION 2 — the recede is a 3D TILT, not a flat scale

User reported the movement still looked too small, and that the last card
should vanish completely. Both correct. Root cause of the first: I had only
ever extracted `scaleX` (matrix element [0]) from the source's transform and
ignored every other component.

Decomposing the full `matrix3d` properly:

    matrix3d(0.699536, 0.0254886, 0, 0,
            -0.0195254, 0.535876, 0.449951, 0, ...)

    scaleY = sqrt(0.535876^2 + 0.449951^2) = 0.6997   (uniform scale ~0.70)
    rotateX = atan2(0.449951, 0.535876)     = 40 deg
    rotateZ = atan2(0.0254886, 0.699536)    = 2 deg

So the card hinges ~40 degrees away from the viewer while scaling to 0.70 —
its rendered height collapses 1080 -> 634px. Reading `scaleX` alone showed
only the 0.70 and completely missed the tilt, which is most of the movement.

Supporting values from the source:
- `.case-content-wrapper` has `perspective: 4762.5px` on a 1905px viewport = **250vw**
- `.case-content` is `transform-style: preserve-3d`
- `transform-origin: 952.5px 108px` = **center 10%** — it pivots near its TOP edge,
  so it hinges backwards rather than shrinking toward its middle

Implemented: `scale 1 -> 0.7`, `rotateX 0 -> 40deg`, `rotateZ 0 -> 2deg`,
`power2.in`, with `[perspective:250vw]` on the sticky wrapper and
`[transform-origin:center_10%] [transform-style:preserve-3d]` on the card.
Overflow left visible so the tilted card is not clipped.

Last card opacity now goes to **0** (was 0.15) so it disappears completely
instead of leaving a ghost.

Verified in the clone at full progress:

| | source | clone |
|---|---|---|
| scale | 0.6995 | 0.700 |
| rotateX | 40.0 deg | 40.0 deg |
| rotateZ | ~2 deg | 2.0 deg |
| rendered height | 634px | **631px** |
| last card opacity | fades out | 0 |

### Second lesson
Decompose the WHOLE matrix. `matrix3d` element [0] is only scaleX; the tilt
lived in elements [5] and [6] and was invisible to the way I was reading it.

## FIXED — Major: curved dividers double-counted their scroll (user-reported)

User reported a very long empty scroll before the curved "PROCESS" words
appeared, on BOTH dividers.

Root cause: the `CurvedDivider` outer wrapper had a hardcoded
`height: 4320` AND GSAP's `pin` added its own pin-spacer on top of that.
GSAP's spacer already equals (element height 1080 + pin distance 3240) = 4320,
which is exactly what the source's spacer measures — so the explicit height was
pure duplication. Each divider consumed roughly **7560px instead of 4320px**,
and the surplus was dead space after the text had finished animating.

Fix: removed the explicit height; the pin-spacer now creates the distance on
its own, matching the source.

Second issue found while verifying: the SVG used
`transform: translate(0, -10%)`. The source CSS is
`translate(0, -100%) scale(1.1)`, but the source's container is not vertically
centred the way the clone's flex container is, so a literal -100% put the arc
~200px too high. Settled on -30%, which lands it at the same on-screen y as the
original.

| | source | clone (before) | clone (after) |
|---|---|---|---|
| scroll consumed per divider | 4320px | ~7560px | **4320px** |
| font-size | 171.45px | 172.8px | 172.8px |
| arc y position | 280px | ~75px (after -100% fix) | **285px** |
| total page height | 20804px | — | 20591px |

Roughly 6500px of dead scroll removed across the two dividers.

## FIXED — blank scroll before the curved text appeared (user-reported, 2nd pass)

After removing the duplicated pin height, the user still hit a long white
stretch before the text showed. Two further causes, both real:

### 1. The SVG was stretched to full container width
The source's SVG renders at its **intrinsic viewBox width (1516px)** and is then
scaled 1.1 -> **1668px** inside a 1905px viewport. The clone had
`className="w-full"`, stretching it to 1905 -> **2096px**. The path therefore
ran past the right edge of the screen, parking the text off-view for the first
slice of the pin.

Fixed to `w-[1516px] max-w-full`. Verified: svg width 1668 and
`path.getTotalLength()` 2967 — both now exactly equal the source.

### 2. The startOffset formula started the text off the path
Old: `startOffset = 100 + (textWidth / pathLen) * 100` ~= **184%** — entirely
off the path. Replaced with measured constants.

The source's nominal range is 82.7% -> -150.87%, but at 82.7% the glyphs are
still off the right edge; the source never really rests there because its scrub
races through the first slice. Set the clone's start to **63%**, which is where
the source visibly enters ("EVERY" already large on the right), and kept the
measured **-150.87%** end.

| | source | clone (before) | clone (after) |
|---|---|---|---|
| svg width | 1668px | 2096px | **1668px** |
| path length | 2967 | (stretched) | **2967** |
| start offset | 82.7% nominal | ~184% | 63% |
| end offset | -150.87% | -84% | -150.87% |
| first pinned frame | "EVER" visible | blank | **"EVERY" visible** |

### Note on the 63% deviation
This is a deliberate deviation from the source's literal start value, not a
match. The source's own first frames are near-empty too; 63% reproduces its
*visible* entry point rather than its nominal one, which is what the user
actually asked for. Raise it back toward 82.7 for literal fidelity at the cost
of a blank lead-in.

## ADDED — About statement: right-column placement + gradient wave reveal

User reported the statement was in the wrong place and, more importantly, was
missing its scroll reveal entirely.

### Layout
Source `.article-wrapper` is an **8-column grid** (172.5px columns, 4px gap).
The statement sits at `grid-column: 4 / 9` — the right five columns — with the
eyebrow list in the first three. The clone had an ad-hoc
`grid-cols-[18%_1fr]`.

| | source | clone (after) |
|---|---|---|
| text x | 778px | **778px** |
| text width | 879px | **879px** |
| font-size | 36px | 36px |
| line-height | 48px | 48px |
| weight | 500 | 500 |

### The reveal — `data-gradient-wave-text`
Not a typing effect and not a plain fade. The source splits the block into
words, each word holding one `<div>` per character, and scrubs a COLOUR WAVE
across them:

    rgba(255,255,255,0.2)   invisible against the cream background
    -> rgb(247,65,49)       orange crest
    -> rgb(31,31,31)        settled body colour

Because it is scrubbed rather than triggered, scrolling back up reverses it —
which is exactly the behaviour the user described.

Implemented as `GradientWaveText`: per-character spans, a GSAP keyframe tween
(faint -> orange -> dark) staggered left-to-right, `scrub: true`.

**Tuning note that mattered:** with `duration` at its default the per-character
transition was SHORTER than the stagger step, so only ONE character was ever
mid-transition and the orange crest was invisible — it just looked like a hard
faint/dark boundary. Setting `duration: 8` against `stagger.each: 0.5` gives a
band of ~16 characters in transition at once, which is what reads as a wave.

Verified sweeping left to right:

| scroll offset | faint | in wave | dark |
|---|---|---|---|
| -1000 | 129 | 0 | 0 |
| -700 | 86 | 16 | 27 |
| -500 | 46 | 16 | 67 |
| -300 | 7 | 16 | 106 |

### Known deviation
The source keeps both sentences inside ONE `h3`, so a single wave crosses the
whole block. The clone uses two `GradientWaveText` paragraphs, each with its
own trigger, so each sentence gets its own crest. Visually very close; unify
into one instance if a single continuous sweep is wanted.

## FIXED — showreel started centred instead of left-aligned (user-reported)

The Flip geometry (320x180 -> 1408x792) was already correct, but BOTH boxes
were centred with `mx-auto`, so the video had no lateral travel — it just grew
in place.

Source measurements (1920 viewport, `.u-container` at x=225, w=1440):

| | x | width | height |
|---|---|---|---|
| `.scaling-element__small-box` | **241** | 320 | 180 |
| `.scaling-element__big-box` | **241** | 1408 | 792 |

Both are anchored to the container's LEFT inner edge. The big box also carries
`margin-top: 384px`. Because the big box fills the container, the video's
CENTRE travels from ~401 to ~953 (screen centre) as it expands — that is the
"comes to the centre" the user described. It is not a translate; it is
left-anchored growth.

Fix: dropped `mx-auto` from the small box, dropped it from the big box, added
`mt-96` (384px).

Verified against the source at every scroll offset where the source's own
scroll actually took effect:

| offset | source width | clone width |
|---|---|---|
| +400 | 1383 | **1383** |
| +900 | 1408 | **1408** |
| +1400 | 1408 | **1408** |

Clone at rest: x=249, w=320. Mid-expansion: x=249, w=1258. Left edge holds,
width grows, centre converges on screen centre.

(The source's -400 and 0 samples are unusable — its scroll did not take, both
reporting an unchanged y=1580.)

## Earlier in this pass — About statement wave, second iteration
- The two paragraphs now share ONE timeline/trigger, so the wave runs
  continuously from the first character to the last instead of both sentences
  revealing at once. `querySelectorAll` document order does the sequencing.
- Smoothness: the band was ~16 characters, which reads as a moving edge. The
  source has most of the block in transition at once. `duration` 8 -> 60
  against the same 0.5 stagger (~120 chars in flight), ease `power1.inOut`,
  and `scrub: true` -> `scrub: 0.6` for inertia.
- Bug introduced and fixed in the same pass: the word separator sat INSIDE each
  `inline-block` word wrapper, where trailing whitespace collapses — every word
  ran together ("Webflowdeveloperwith7+"). Moved it between the word spans via
  `Fragment`.

## FIXED — showreel started in the wrong place in the document (user-reported)

The small box was rendering AFTER the stats marquee. In the source it sits
BETWEEN the about statement and the marquee, and the video then expands OVER
the marquee rather than pushing it around.

Source document order (by document Y):

| element | y |
|---|---|
| about statement | 1176 |
| **small box** | **1580** |
| marquee | 1952 |
| big box | 2144 |

The overlay is what makes it "come above everything else": `.scaling-video`
is `position: absolute` with **`z-index: 55`**, so as the Flip grows it passes
over the marquee strip.

Fix:
- `Showreel` now takes `children` and renders them between the two boxes; the
  marquee JSX moved inside the `<Showreel>` call. This keeps both box refs in
  one component so the Flip still has its start and end targets.
- Video wrapper z-index raised from `z-10` to **`z-[55]`** to match the source.

Verified order in the clone: statement 1176 -> small box 1712 -> marquee 1892
-> big box 2346. Small box renders at x=249, w=320 in the left column (the
area the user circled), and mid-expansion the video measures 1130px wide and
fully covers the marquee.

## FIXED — showreel small box now bottom-aligns with the About CTAs

User: "the bottom part of the video needs to be on the same line to these
buttons when starting the animation."

Source measurement confirms it exactly — the small box and the CTA row share a
grid row and end on the same baseline:

| | top | bottom |
|---|---|---|
| about CTAs | 1704 | **1760** |
| small box | 1580 | **1760** |

The box is 180 tall in the left columns, the buttons 56 tall in the right; both
are bottom-aligned, which is why the taller box starts higher.

Previously the clone rendered the small box in its own section BELOW the about
section, so it could never line up.

### Refactor required
The Flip's two targets now live in different parts of the tree — the small box
inside the About grid, the big box after the marquee. `Showreel` was therefore
split into:
- `useShowreelFlip({ scalingRef, bigRef, videoRef }, reduceMotion)` — the GSAP
  effect, with the refs owned by the page
- `ShowreelSmall` — the 320x180 box, rendered in the About grid's left columns
  with `self-end`
- `ShowreelBig` — the 1408x792 target after the marquee

The About grid gained a second row: `ShowreelSmall` at `md:col-span-3` and the
CTA row at `md:col-start-4 md:col-span-5`, both `self-end`.

Verified in the clone:

| | top | bottom |
|---|---|---|
| small box | 1632 | **1812** |
| CTAs | 1756 | **1812** |

Document order still correct: small box 1632 -> marquee 1908 -> big box 2362.

## FIXED — statement -> CTA gap tightened to the source's 192px

| | statement bottom | CTA top | gap |
|---|---|---|---|
| source | 1512 | 1704 | **192px** |
| clone (before) | 1496 | 1756 | 260px |
| clone (after) | 1496 | 1688 | **192px** |

Because both cells in that grid row are `self-end`, the row's HEIGHT is what
sets this gap, and the row height was being driven by the video box's top
margin:

    gap = rowGap(40) + (videoHeight 180 + mt - ctaHeight 56)

At `mt-24` (96px) that gives 260. Solving for the source's 192 gives mt = 28px,
so `md:mt-24` -> `md:mt-7`.

Changing it moves the video and the buttons together, so the bottom alignment
is preserved — verified `bottomsMatch: true`, both ending at y=1744.

## FIXED — showreel Flip scrub range was 42% too long

User report: the video "is not going in the centre of the screen" while scrolling
down. The centring was in fact correct; the TIMING was wrong — the expansion ran
over too long a scroll distance.

Cause: the source's `.scaling-element__big-box` has `margin: 384px 0 0`, and that
384px is the TOTAL span from the small box's bottom to the big box's top (the
marquee sits inside it). The clone applied `mt-96` (384px) ON TOP of the About
section's `pb-24` (96px) and the marquee's own height (70px), compounding the gap
to ~550-618px. Since the ScrollTrigger runs `small centre -> big centre`, that gap
directly sets the scrub length.

Fix (applied by the `website-cloner` agent): `mt-96` -> `mt-[218px]`
(218 = 384 - 96 - 70) in `ShowreelBig`.

Independently re-verified at 1920x1080 with 3000ms settle per sample:

| | source | clone |
|---|---|---|
| small box bottom | 1760 | 1744 |
| big box top | 2144 | 2128 |
| **gap** | **384** | **384** |
| CTA bottom (must equal small bottom) | 1760 | 1744 |

Width progression, offsets relative to each site's own trigger start:

| offset | source | clone |
|---|---|---|
| -200 | 320 | 320 |
| 0 | 320 | 320 |
| +300 | 673 | 695 |
| +600 | 1047 | 1070 |
| +870 | 1387 | 1408 |

At completion the clone measures top 144 / bottom 936 in a 1080 viewport —
centreY 540, exactly the viewport centre.

### Correction to an earlier entry in this file
The offset table I used to diagnose this ("clone already 793px wide at offset 0
while the source held 320") was WRONG — it was taken with ~1500ms settles, and
GSAP's scrub had not finished easing. Under 3000ms settles BOTH sites hold 320px
through the trigger start and then grow together. The geometry bug (618 vs 384)
was real and the fix is correct, but the supporting measurement was contaminated
by exactly the unsettled-scrub pitfall documented earlier in these notes. The
cloner agent caught this and pushed back rather than accepting the brief — the
right call.

## FIXED — services accordion was laggy/jagged

User report: the services section "feels super laggy and jagged".

### What was wrong
The clone mounted and unmounted BOTH the description and the row's `<img>` on
every hover, via two `AnimatePresence` blocks. Moving the pointer across the
list therefore triggered, per row change: React reconciliation, DOM insertion
and removal, and an image decode — all layered on top of a `min-height`
transition that already forces layout on the row and everything below it.

### What the source actually does (measured live)
Nothing mounts or unmounts. Structure is two-level:

| element | behaviour |
|---|---|
| `.mwg035-li` (row) | `height` 96px <-> 244px, `overflow: hidden`, **`will-change: min-height`** |
| `.accordion-content` | `overflow: hidden`, **height animates 0 -> 112px** |
| `.accordion-content_text` | opacity 0 -> 1 only |
| `.mwg035-medias` | ONE absolutely-positioned stack holding ALL media, moved with `transform` |

The inner `.accordion-content` collapse is the part I had missed: it is what
keeps a collapsed row at exactly 96px while its copy stays in the DOM.

### Changes made
1. Removed both `AnimatePresence` blocks. Description and images are now
   permanently mounted; only opacity/transform/height animate.
2. Replaced the five per-row `<img>` elements with a single absolutely
   positioned media stack (all five `next/image` mounted once), moved with
   `translateY(active * 96 + 52)` and crossfaded by opacity — mirroring
   `.mwg035-medias`.
3. Added the inner `.accordion-content` wrapper (height 0 -> 112, overflow
   hidden) so collapsed rows stay at exactly 96px.
4. Added `will-change` on the animated properties, matching the source.

### Verified
- DOM node count identical before and after hovering across rows (74 -> 74) —
  no reconciliation churn.
- Images mounted: constant 5, never remounted.
- Row heights now exactly **244 active / 96 collapsed**, matching the source
  (they had regressed to 147/125 at the intermediate step, when the copy was
  mounted but the inner collapse was not yet in place).
- Media stack aligns with the open row; verified visually on row 05.
- Build and ESLint clean (`<img>` -> `next/image` to clear the lint warning).

### Remaining inherent cost
The row height and the content height are still layout-animated properties —
that is what the source does too, so it is not removable without deviating.
The removed work was the mount/unmount churn and the repeated image decodes,
which is where the stutter was coming from.

## ADDED — services media now slides in on hover (matching the source)

User: "the images in this section should animate too when hovering over
sections, just like on the original."

### What the source does (measured live)
Not an opacity crossfade. Each row has its OWN media box and the image slides
vertically inside it:

| element | value |
|---|---|
| `.mwg035-medias` | 348.95 x 196, `position: absolute`, **`overflow: hidden`**, one PER ROW |
| `.mwg035-media` inactive | `translateY(196)` — its own full height, parked below the clip box |
| `.mwg035-media` active | `translateY(0)` — slid up into view |
| CSS `transition-duration` | **0s** on both — the tween is GSAP-driven, not CSS |

Sampled mid-hover the source shows intermediate values (79.56, 6.44, 5.82),
confirming a smooth eased tween rather than a snap.

### Implemented
Replaced the single sliding media stack (my earlier approximation) with the
source's per-row construction: each row now holds its own
`overflow: hidden` 350x196 box, vertically centred, containing one permanently
mounted `next/image` that transitions `translateY(100%) -> translateY(0)`.

Because the source drives this with GSAP at `transition-duration: 0s`, there is
no CSS duration to copy; used `700ms cubic-bezier(0.22,1,0.36,1)` (expo-out) as
an approximation of the observed tween shape. This is an approximation, not a
measured match — flagged here deliberately.

### Verified
| row state | clone transform | source transform |
|---|---|---|
| active | `translateY(0)` | `translateY(0)` |
| inactive | `translateY(196)` | `translateY(196)` |

Box `overflow: hidden`, height 196 — matches. Rows still 244 active / 96
collapsed. No mount/unmount churn: all five images stay in the DOM.

## FIXED — curved-text dividers: text sat statically in view instead of animating in

User: "the text should not be in view when scrolling down at first, but appear
as you scroll down with the same effect." Applies to BOTH dividers (same
component).

### Cause
The pin and the text scrub were driven by a SINGLE ScrollTrigger at
`start: "top top"`. So while the section scrolled into view, progress was 0 and
the text was frozen at its start offset — visibly parked on screen doing
nothing — then snapped into motion the instant the pin engaged.

Measured on the source, offsets relative to its pin top:

| offset | source | clone (before) |
|---|---|---|
| -300 | 82.70% | 63% frozen |
| -100 | **74.91%** (already moving) | 63% frozen |
| 0 (pin engages) | 67.70% | 63% frozen |
| +150 | 56.89% | 53.10% |

The source's text animation clearly begins BEFORE the pin.

### Fix
Split into two ScrollTriggers:
- **pin** — unchanged: `start: "top top"`, `end: "+=3240"`. It has to stay at
  "top top", otherwise the section freezes before it fills the screen.
- **text scrub** — its own trigger at `start: "top 25%"`, `end: "+=3240 + 25vh"`,
  so the text is already travelling as the section approaches.

Also restored `startOffset` to the source's measured **82.7%** (it had been
lowered to 63 as a workaround for the frozen-text symptom). With the lead-in
trigger in place, 82.7 now parks the text just off the right edge and it
animates INTO view during the approach — which is the behaviour the user
wanted, and removes the reason the workaround existed.

### Verified
| offset | source | clone (after) |
|---|---|---|
| -300 | 82.70% | 82.70% |
| -100 | 74.91% | 71.39% |
| 0 | 67.70% | 64.73% |
| +150 | 56.89% | 54.75% |

Visual check 200px before the pin: only the leading edge of the first glyph is
entering from the right — no static text.

### Note on an earlier entry
This supersedes the `startOffset = 63` workaround documented earlier in this
file. That entry correctly identified dead scroll as the symptom but treated it
by moving the start point, when the real cause was the missing lead-in trigger.

## FIXED — process cards flew out of view on hover

User: "this section is broken on hover (when hovering over a card, it goes out
of view and gets messy)."

### Cause
The card's resting pose was computed TWO different ways:

| where | expression | y for outer cards |
|---|---|---|
| initial `gsap.set` | `FAN.lift * dist * dist` | **45px** (correct) |
| inertia bounds, onComplete, handleLeave | `dist * FAN.lift * dist * FAN.lift` | **2025px** |

The second is `dist^2 * lift^2` instead of `lift * dist^2` — 45x too far. So the
moment a card was hovered, the inertia bounds were centred ~2000px below the
deck and both return tweens sent it there, throwing the card off screen. With
three cards each doing this at different offsets, the result was the "messy"
state reported.

### Fix
Extracted a single `restPose(i)` helper and used it in all four places (initial
set, inertia rotation/x/y bounds, the onComplete return tween, and the
mouse-leave return tween), so the rest position can no longer drift between
code paths.

### Verified
Swept the pointer across the full width of the deck, then moved away:

| card | tx | ty | on screen |
|---|---|---|---|
| 0 | -300 | 45 | yes |
| 1 | 0 | 0 | yes |
| 2 | 300 | 45 | yes |

Identical before the sweep, immediately after it, and after the pointer left —
cards settle back to the fan every time. Build and ESLint clean.

## OPEN — process card checklist colours look wrong
Not reported by the user, noticed while fixing the above: the checklist items
inside each process card alternate red / blue per line ("DISCOVERY CALL" red,
"PROJECT BRIEF" blue, "SITEMAP" red...). This looks unintentional. I could not
locate the equivalent nodes in the source's DOM to confirm what colour they
should be, so it is left as-is rather than guessed at.

## FIXED — marquees looped frantically / displayed jagged

User: "the marquees are broken (they look frantically and are jagged when it
comes to how they are displayed)."

Three separate defects, all in the same construction.

### 1. The two halves were not identical, so the loop jumped
`.marquee-track` animates `translateX(0) -> translateX(-50%)`, which only loops
seamlessly if the track is exactly two equal halves.

- **Eyebrow marquee** rendered 8 items with a flex `gap`. A `gap` puts one extra
  space BETWEEN the halves that is inside neither of them, so -50% landed one
  gap off and the seam jumped every cycle.
- **Stats marquee** rendered `[...MARQUEE_A, ...MARQUEE_B]` as the two halves —
  but A and B genuinely differ on the source (117+ vs 50+), so the halves were
  not even the same content.

Fix: render two identical halves explicitly, and move the spacing onto each
item as a margin instead of a flex `gap` on the track. For the stats strip the
FULL A+B sequence is now repeated twice.

Verified across all 7 tracks on the page:

| track | half widths | equal |
|---|---|---|
| stats | 2337 / 2337 | yes |
| eyebrows (x6) | 2702-2857 matched pairs | yes |

### 2. Each half was narrower than the viewport
At 6 repeats an eyebrow half measured ~1013px against a 1920px viewport, so
partway through the cycle the track ran out of content on the right and left a
blank gap. Raised to 16 repeats (~2700px per half); all tracks now report
`coversViewport: true`.

### 3. The braces broke the row
`{` and `}` were flex siblings of a `w-max` track, so the track pushed them out
of the row and then slid across them — this produced the stray bracket and the
clipped text at the left edge in the user's screenshot. They are now absolutely
positioned on the container's edges, above the track.

Build and ESLint clean.

## Curved divider text size — mobile (2026-09-01)

Symptom: on a phone only a fragment of the sentence was ever on screen
("SEE THE", cut mid-glyph), so a 54-character line could not be read. Both
dividers, not just one.

Cause: the SVG's intrinsic viewBox is 1516 wide and it is capped by
`max-w-full`, so BELOW 1516px the whole graphic scales down in proportion to
the viewport. A `vw` font size therefore shrinks TWICE over that range - once
because the viewport is narrower, again because the graphic is scaled - i.e.
quadratically.

That is the same trap in both directions:
- original `9vw` -> ~9 effective px at 375 (invisible)
- the earlier mobile fix `clamp(240px, 78vw, 300px)` corrected the size but
  kept the quadratic curve and overshot: the text ran 3.35x LONGER than the
  path it sits on, leaving ~8 characters on screen.

Fix: a FIXED px below 1516 makes the effective size scale linearly with the
viewport, holding the visible character count constant. `136px` is `9vw`
evaluated at exactly 1516, so the two rules meet continuously at the
breakpoint.

```css
.curved-textpath-size { font-size: 136px; }
@media (min-width: 1516px) { .curved-textpath-size { font-size: 9vw; } }
```

The inline `style={{ fontSize: "9vw" }}` on the textPath had to go - it
outranked the class. The old `!important` override lived in the `<style>` block
inside page.tsx, not globals.css; both are now gone and sizing lives in one
place.

Measured characters visible across the range - constant, which is the point:

| viewport | 360 | 390 | 430 | 768 | 1024 | 1440 | 1920 |
|----------|-----|-----|-----|-----|------|------|------|
| chars    |16.5 |16.5 |16.5 |16.5 | 16.5 | 16.5 | 16.3 |

Text-to-path ratio 3.35 -> 1.52. No JS change needed: `endOffset` is already
derived from `getComputedTextLength()`, so the travel distance re-derived
itself.

## Work card entrance reveal (2026-09-01)

Measured off the source's `.case-content`, captured in its pre-reveal state and
again mid-transition:

| element | from | to |
|---------|------|-----|
| `.case-content_image-warpper` | `clip-path: inset(0% 0% 100%)` | `inset(0%)` |
| `.case-content_image` | `translateY(-72.075px)` (= -12% of 601) | `0` |
| `.case-text` x2, copy, link | `translateY(50px)`, `opacity 0` | `0`, resting opacity |

The image is not a fade and not a slide: the wrapper unclips downward while the
picture counter-moves down into place. The counter-move is what stops it
reading as a slide - without it the image visibly travels.

The counter-move can never expose a gap at the bottom edge: at progress p the
frame is open to p*H while the image covers to H*(1 - 0.12*(1-p)), and
1 - 0.12 + 0.12p >= p for all p <= 1.

Source timings: elements settle at 9511 / 9657 / 9803 / 9949ms - an even ~145ms
stagger, ~1.06s end to end, with the image finishing alongside the last text.
One-shot, NOT scrubbed: the recording shows it playing on its own timeline
while the scroll position sat still. Ours triggers at `start: "top 75%"` with
`once: true`.

### The bug worth remembering

The tag and body carry Tailwind `opacity-60` / `opacity-90`, so a blanket tween
to `opacity: 1` would animate those muted paragraphs to full strength. Reading
the resting value back with `getComputedStyle` looks like the fix and is not:
React double-invokes effects in dev, so the second pass reads the ALREADY
HIDDEN element and gets `"0"` - and `parseFloat("0") || 1` is **1**, because 0
is falsy. Both paragraphs silently settled fully opaque.

Resting opacity is now DECLARED per element as `data-reveal-opacity`, which
cannot drift out from under the animation. Cleanup also `clearProps: "all"` on
everything the reveal writes, so a re-run never reads the hidden state as the
resting one.

Verified settled state on every path: `["1","1","0.6","0.9","1"]` - desktop,
mobile, and reduced motion (which skips the reveal entirely and leaves
`clip-path: none`).

## Hero background loop (2026-09-02)

Source: `F:\epicdigitalhub-v2\hero_loop_v2_raw.mp4` — 1920x1080, 24fps, 25.08s,
7.3 Mbps, no audio, 21.9 MB. A montage: opens black-and-white in an interior
with blown-out windows, moves through brand-emerald scenes, ends on a dark
emerald doorway.

### It did not loop

First and last frame are nothing alike, so `loop` alone produced a hard cut.
Fixed by cross-dissolving the tail into the head, which also shortens the clip
by the fade length:

```
[0:v]trim=0:1,setpts=PTS-STARTPTS[head];
[0:v]trim=1:24.084,setpts=PTS-STARTPTS[mid];
[0:v]trim=24.084:25.084,setpts=PTS-STARTPTS[tail];
[tail][head]blend=all_expr='A*(1-T/1)+B*(T/1)'[bl];
[mid][bl]concat=n=2:v=1:a=0
```

Loop seam, measured as PSNR between first and last frame:
**7.0 dB before -> 29.7 dB after.**

### Encoding

| file | size | for |
|------|------|-----|
| hero-loop.mp4 | 1920x1080, 2.8 MB | desktop |
| hero-loop-mobile.mp4 | 1280x720, 1.1 MB | <=900px |
| hero-poster.webp | 77 KB | poster + preloader + LCP |
| og-hero.webp | 52 KB | 1200x630 share card |

H.264 main/yuv420p, CRF 31/32, `+faststart`. `media` on `<source>` inside
`<video>` is not reliably honoured, so the file is chosen with matchMedia and
assigned to `v.src`; `preload="none"` and no `<source>` in markup means a phone
never starts fetching the 2.8 MB cut before that choice is made.

### The headline had to lose its blend

`mix-blend-mode: difference` only reads over a backdrop that is decisively dark
or bright. This montage sits in the middle. Measured against the brightest
pixel in the headline band, after the scrims:

| scene | blend `difference` | solid white |
|-------|--------------------|-------------|
| 4 of 5 | 1.15 - 1.17 | 4.27 - 4.30 |
| darkest | 4.37 | 8.91 |

WCAG AA wants 3.0 for large text, so the blend was effectively invisible. The
h1 is now solid white. **The header still blends** — it is a thin strip with a
heavier scrim above it and reads correctly there.

### Scrims

Two non-interactive full-bleed layers below the headline in paint order: a
vertical black gradient (strongest behind the nav, again through the headline
band, and at the bottom behind the entity paragraph) and a 25% emerald wash
that stops the black-and-white opening reading as monochrome.

### Playback gating

Two ref gates, no React state, so neither re-renders the page:
- the intro must have finished — otherwise the loop advances behind the
  preloader and the handoff jumps (the preloader grows the SAME poster frame
  the video is paused on, which is what makes it invisible);
- the hero must be on screen — an IntersectionObserver pauses it otherwise, so
  nothing decodes while the rest of this long page scrolls.

`prefers-reduced-motion` gets the poster and no <video> element at all.

### Measurement note

Within one run, video present vs hidden measured 35.6 vs 34.2 ms average in the
hero and 22.1 vs 22.0 elsewhere — the video's marginal cost is small. Absolute
numbers this session ran higher than the mobile-perf session for reasons not
attributable to this change (machine load); variants that should be neutral or
better measured worse, which is the signature of noise. Do not read the
absolute figures here against those in mobile-perf.md.

## Showreel video replaced (2026-09-02)

Source: `EDH_MANIFEST_REEL_2026-09_v18.mp4` — 1080x1920, 24fps, 50s, 13.5 MB,
with an AAC track.

### It is a portrait file with a landscape picture inside it

The container is 9:16 but the actual picture is letterboxed 16:9 within it:
656px of black top and bottom. Dropped in as-is with `object-cover`, the 16:9
showreel box would have shown a narrow horizontal slice of a portrait frame and
cut the on-screen type in half.

`cropdetect` across the clip agreed on the band every time past t=12:

```
crop=1080:608:0:656      # 1080/608 = 1.776, i.e. 16:9
```

Stored already cropped, so `object-cover` fills the box with essentially no
crop: measured box aspect 1.775 small / 1.777 grown against a native 1.776.

### Encoding

| | |
|--|--|
| output | 1080x608, CRF 27, H.264 main/yuv420p, +faststart, **4.8 MB** |
| audio | stripped — autoplay requires muted and there is no unmute control |
| poster | reel-poster.webp, 9 KB |

CRF 27 rather than 30: the reel has small on-screen type that goes mushy at
higher CRF.

Replaces `hero-wake.mp4` (8.7 MB for 10s), so the page is lighter despite the
clip being five times longer. `about-showreel-720p.mp4` (10.8 MB) was
unreferenced and is gone too.

### Loading

`preload="none"` and no `autoPlay`; an IntersectionObserver starts it when the
box scrolls into view and pauses it when it leaves — same treatment as the hero
loop. Verified: on page load only the hero loop is fetched, and the 4.8 MB reel
is not requested until the visitor reaches it, on both desktop and mobile.

### Known limit

The picture is only 1080px wide, so at the grown state it is upscaled on a
1440px+ viewport and will look slightly soft. That is the resolution the source
has; a landscape master at 1920+ would be sharper.

## Work section rebuilt — two offset columns (2026-09-30)

User: the run of full-screen vertical cards ate too much scroll; wanted the
domains as pictures with parallax, "un fel de carusel", offset rather than in a
straight line, vertically.

### What went

Six `position: sticky` slides of `100svh`, each scrubbing the source's 3D
recede (scale 1 -> 0.7, rotateX 40deg, rotateZ 2deg) over 150% of its own
height, plus a `100svh` tail for the last card to dissolve into. Seven
viewports for six cards.

The recede could not be kept: it needs a full viewport per card to read, which
IS the scroll being cut. Everything else was kept — brand colour per vertical,
the full copy, and the clip-path entrance.

### What replaced it

Two columns in normal flow. The right one starts at `md:mt-[20vh]`, cards carry
uneven widths (88-100%) and horizontal nudges (-20..+34px), and each picture
drifts +/-44px inside its frame on `useScroll`. No pin anywhere.

| | before | after |
|--|--------|-------|
| section height @1440x900 | 6300px (7 x 100svh) | **2655px** |
| section height @390x844 | 5908px | **3511px** |
| ScrollTriggers on the page | 5 from this section | **0** |
| horizontal page scroll | none | none |

First attempt was a pinned horizontal carousel (the answer to the first
question asked); it built and measured fine at ~2 viewports but read wrong, and
the user redirected to a vertical arrangement. Only the second is in the tree.

### THE BUG WORTH REMEMBERING — clip-path blinds IntersectionObserver

Both motion attempts at the entrance reveal failed with the pictures never
appearing, first as `whileInView={{ clipPath }}`, then as a CSS transition
gated by `useInView`. The tween was never the problem.

Chromium counts a target's OWN clip-path when it computes intersection. An
element hidden by `inset(0% 0% 100%)` therefore reports `isIntersecting: false,
ratio: 0` while sitting whole in the middle of the viewport — measured with a
bare observer in the page: rect top 148, height 440, viewport 900, ratio 0. The
reveal waits to see an element that the clip is hiding, so it never fires.

This is why the effect worked under GSAP and broke on the way to motion:
ScrollTrigger reads scroll offsets, `whileInView`/`useInView` read an observer.

Fix: the observed element is an outer wrapper that is never clipped; the clip
lives on a layer inside it. `useScroll` can share the outer ref — it measures
rects, not visibility.

### Reduced motion, again

`{ initial: false }` alone left TWELVE elements across the six cards at opacity
0 for reduced-motion visitors — measured, not theorised. The server snapshot
has `reduceMotion` false, so the hidden state ships inline, and a motion
element handed no target keeps the inline style it already has. It needs
`initial: false` AND an explicit resting `animate`, which is the same lesson
already recorded for the hero headline and the nav.

Verified after the fix: 0 hidden elements, all six pictures decoded, no
clip-path left on any frame.

### Verified
`npx tsc --noEmit` clean, `npx eslint src --max-warnings=0` clean,
`npm run build` compiles. Checked at 1440x900 and 390x844, plus a
`reducedMotion: "reduce"` context.

## Curved divider 2 removed (2026-09-30)

User's call, pointing at "THE ORDER MATTERS" on screen. The divider between the
testimonials and Process is gone; the one before Work stays.

It cost 4320px of pinned scroll on its own — 1080px of pinned section plus
3240px of scrub — to carry one sentence, and the page had two of them.

| | before | after |
|--|--------|-------|
| page height @1440x900 | 17715px | **13575px** |
| curved textPaths on the page | 2 | **1** |

Combined with the Work rebuild earlier today the home page went from roughly
21400px to 13575px, about 36% shorter, with no section's content dropped.

`copy.dividers.beforeProcess` stays in content.ts in both locales, and
`CurvedDivider` is still imported for divider 1, so restoring it is one JSX
block. The `idSuffix="b"` it used to pass is what kept the two SVG path ids
unique — a restored copy needs it back.

Verified: testimonials hand straight over to the cream Process section with its
`{ PROCESS }` eyebrow and the fanned cards, no gap and no leftover pin-spacer;
tsc, eslint and build clean.

## Reviews section + footer, mobile and hover (2026-10-07)

User: the reviews "pe mobil nici nu apar cum trebuie, pe desktop cand dai hover
se comporta haotic", the footer email should be contact@epicdigitalhub.ro, and
the mobile footer "e horror".

### The hover chaos was a reflow, not an animation

The row carried `transition-[padding] md:hover:pl-6`. Padding narrows the
row's content box, so for the whole 500ms the quote re-wrapped while it moved —
on the longer quotes a line jumped to the next row and back, and because the
row's own height changed under the pointer the hover could drop and re-fire.

The indent is now `md:group-hover:translate-x-1.5` on the two columns. A
transform moves pixels and touches no layout. Measured before, mid-transition
(250ms, where the old one re-wrapped) and after: row heights, quote widths and
line counts all identical, and the row returns to rest when the pointer leaves.

Measuring note, again: Tailwind v4 emits the independent `translate` property,
so `getComputedStyle(el).transform` reads `none` on a `translate-x-*` utility
and looks like the hover is dead. Read `.translate` — it is `6px` on hover.
This is the second time this file records that trap.

### Mobile reviews: the wave never finished on screen

The featured quote sat half white, half emerald for its entire visible life,
which is what "nici nu apar cum trebuie" was.

`GradientWaveText` ended its scrub at `bottom 40%` — measured against a
desktop block of three or four lines. The same Romanian quote runs SEVEN lines
on a 390px phone, so the end point only arrived once the block's bottom had
climbed to 40% of the viewport, by which time its top was above the fold. The
sweep was always mid-flight while the quote was readable.

Now breakpoint-dependent through `gsap.matchMedia`: `bottom 40%` from md up,
`bottom 85%` below it. Traced on a 390x844 phone — faint through -900/-700/-500,
sweeping at -300 (18 faint / 82 settled / 57 mid-crest), fully settled at -100
with the quote at 355..598 in the viewport. The effect is intact, it just
completes while you can still see it. Cleanup clears the inline colour so a
breakpoint change cannot leave a block stranded mid-sweep.

### Footer on mobile: `flex-1` in a column

The two inputs were `flex-1 h-16` inside a `flex-col` form. In a column,
`flex: 1 1 0%` sets the HEIGHT basis and beat `h-16`, collapsing both fields to
their content height — about 18px — while the submit button kept its 64px. Two
hairlines under one tall white block. Now `w-full md:flex-1`, so the flex
behaviour only applies in the row direction: all three measure 64x358 on a
phone.

Also: `mt-24` -> `mt-16 md:mt-24` on the follow/write grid, and the section
`pb-10` -> `pb-24 md:pb-10` because the floating back-to-top badge was sitting
on top of the "Oradea, România" line.

### Email

`hello.epicdigitalhub@gmail.com` -> `contact@epicdigitalhub.ro`, in the footer,
the Organization JSON-LD in shell.tsx and public/llms.txt — one address
everywhere, since a schema that disagrees with the page is a signal nobody
wants to send. It also no longer overflows: the old address ran 18px past the
right edge of a 390px screen at 28px, and the new one is set at 22px below
`sm` so a 360px phone holds it too. Measured right edge 281px of 390.

Verified: tsc, eslint, build clean; no horizontal scroll at 390px.

### Reminder that cost a build

A `{/* ... */}` comment placed directly inside `return (` is two sibling
expressions and a parse error. Hit it again in chrome.tsx. Above the `return`,
as a `//` line, or inside the element.

## Process cards — the section the mobile/hover report was actually about (2026-10-07)

The previous entry fixed the reviews, which is not what the user meant. The
screenshot that followed was the PROCESS deck: one card off the left edge, one
running past the right, both rotated, overlapping each other.

### Mobile: the fan was applied at every width

`restPose` spreads the cards 300px either side of centre, and it ran in a plain
effect. On a phone, where the deck is a `flex-col` of full-width cards, that
put card one at x -306 and card three at x 294 — one off the left edge, one
306px past the right. It never showed up as horizontal page scroll because the
cards were clipped rather than scrollable, which is why earlier passes missed
it. The source fans them only in its `min-width: 992px` branch.

Everything now lives in `gsap.matchMedia("(min-width: 768px)")`: the fan, the
elastic entrance and the pointer handlers. Below md the cards carry no
transform at all, and cleanup clears the transform so crossing the breakpoint
cannot leave one behind. Measured at 390px: all three at left 16 / right 374,
transform `none`, no overlap.

The pointer handlers also moved from React props to listeners inside that
media context — `onMouseMove` as a prop ships to a phone that can never fire
it.

### Desktop: the hover was an inertia flick, and it stacked

Two causes, both real:

- the bounds were plus or minus 320px of travel and 55 degrees, so a quick
  movement threw a card across its neighbours and elastically snapped it back;
- every `mousemove` started a FRESH inertia tween whose `onComplete` queued its
  own return tween. A second of movement left dozens of competing tweens on one
  card, each with a different destination. That is the chaos.

Replaced with `gsap.quickTo`, which reuses one tween per property, so nothing
can stack. The pose is bounded by construction: 4 degrees and 10px around the
resting fan plus a 10px lift — a card leaning toward the cursor rather than
being thrown by it. Verified with a fast zig-zag sweep: the card lands at x 9,
y -12, rot 3.5 and returns to exactly x 0, y 0, rot 0 on leave.

`InertiaPlugin` was used nowhere else, so its import and registration are gone.

### Also found: the fan was double-spaced on desktop

The cards sat side by side in the flex row at 340px centres AND the fan pushed
them another 300px apart, so the centres ended up 640px apart: the outer cards
ran off both edges of a 1440 viewport (measured left -112, right 1508) and the
overlapping hand-of-cards look was gone entirely.

`md:-mx-[170px]` — half a card's width — makes the three occupy no width in
the row and share one centre, so the fan alone does the spreading. Now 228 /
550 / 828 at 1440, overlapping as intended.

### Mobile card height

`h-[520px]` is what keeps three fanned cards identical on desktop. Stacked on a
phone nothing has to match, and the fixed height left 50-220px of empty card
under the copy depending on locale. Now `md:h-[520px]` with the height auto
below that, plus `gap-10` so the checklist does not sit against the body copy.
Measured: every card 40px taller than its content, nothing clipped, at 390 and
360px in both locales.

## Client reviews replaced (2026-10-07)

`EPIC_Digital_Hub_Reviewuri_RO_EN.pdf`, two pages: seven clients, each with a
Romanian and an English version. Replaces the whole testimonials block in
content.ts, both locales — the featured DentalNet quote and all six rows.

The attributions are unchanged (DentalNet, AutoSiena, Agro Salso, Hotel Maxim,
Origins Coffee & Drinks, ThermX, Harmony Garden), so the section's shape is the
same; only the words are new. They run roughly twice as long as the old ones:
210-362 characters against 100-200.

Extracted with pypdf and repaired for the same two artifacts the FAQ PDF had —
fi/fl ligature characters and a curly apostrophe, both normalised.

### What the longer featured quote does to the wave

Worth checking, because the mobile end point of `GradientWaveText` was
calibrated against a seven-line block: the Romanian featured quote is now 316
characters, 267 of them in the wave. Measured on a 390x844 phone — faint at
-200, fully settled (267/267) by the time the section reaches the top of the
viewport, with the quote at 255..671, i.e. completely visible. Desktop still
scrubs mid-sweep as it should.

### Flagged

The PDF's own footer says these are proposals awaiting each client's approval
before publication: "Propuneri de formulare pentru validare de către clienți
înainte de publicare." They are live on the site now because the user asked
for them, but they are quotes attributed to named businesses, so they need that
sign-off.

Verified at 1440x900 and 390x844, both locales: six rows plus the featured
quote, correct names and order, no horizontal scroll. tsc, eslint and build
clean.

## Services accordion images replaced (2026-10-07)

`poze servicii EDH/EDH_SITE_SERVICES_2026-10`: five images, one per row, each
with a web `.webp` and a `-full.png` master.

| row | file |
|---|---|
| Marketing strategy | service-strategy.webp |
| Brand & design | service-brand.webp |
| Premium websites | service-web.webp |
| Paid ads | service-ads.webp |
| Photo-video | service-video.webp |

The delivered webps are **1400x784, i.e. 16:9 — the accordion's media box is
350x196, the same ratio**, so they fill it with no crop at all. The set they
replace was 3:2 (1600x1067) borrowed from the About section, which the box was
cutting on both sides; that is why the old photo-video frame read as a dark
silhouette.

The five `-full.png` masters (1916x821, about 9MB together) were left out of
the repo: `next/image` never serves them, so they would be pure git weight.
They stay in the handoff folder if a different crop is ever needed.

The five images this replaced — about-strategy, about-design, hero-laptop,
exclusivity-door, about-production — were referenced from nothing else in the
tree (checked across src and public, not only the obvious files), so they are
deleted rather than left behind. Git history still has them.

Verified by hovering every row at 1440x900: each serves its own file, the
image reports 16:9 against a 350x196 box, and there are no 4xx. Note for next
time: Next's image optimiser caches by request URL, so `.next/dev/cache/images`
has to go when a file is replaced in place — the same trap the work photos hit.

## Hero: the mark over the loop, and an Apply that migrates (2026-10-07)

User's brief, with a reference board: the EDH mark as an overlay with the clip
running behind it, the header's Apply moved under the headline while you are at
the top and back to the header on scroll, an arrival animation and something
subtle afterwards.

### The mark is a HOLE, not a silhouette

First attempt followed the board literally: the mark drawn as a near-black
shape over the clip. On the board that works because the photo behind it is
bright. This loop is dark, so a dark shape on it had nothing to read against —
rendered, all you saw was the thin emerald rim, a wireframe.

Inverted instead. One dark rect covers the hero and the mark is cut out of it
with an SVG mask, so the footage plays at full brightness inside the shape and
dimmed outside. A brightness step alone still read weakly on the darkest
frames, so a second masked rect washes the inside with #1FDB93 at 16%: the
footage is visibly GREEN inside the mark and plain outside it, which is what
the board actually does. The cut edge carries an emerald rim, because without
it the boundary is only a brightness change.

### Two framings, not one

A single 1440x900 viewBox with `preserveAspectRatio="slice"` crops hard on a
portrait screen: at 390x844 it showed only the middle bars of the E, which read
as green stripes. The phone gets its own viewBox and placement, with the whole
mark visible and sat below the copy.

### The headline needed its band back

With the mark lit, the brightest pixel inside the headline's own box measured
rgb(59,181,134) — white on that is 2.58:1, under AA's 3.0 for large text.
Measured properly, too: the first pass sampled anti-aliased glyph edges as
"background" and reported a nonsense 1.31, so the copy is hidden before
sampling now.

Fixed with the left vignette the board also has — over the mark, under the copy,
desktop only, since on a phone the mark is below the text. Plus the mark pushed
right (x 508 -> 600, scale 1.52 -> 1.5). Now 4.49:1 at worst across six moments
of the loop, against the 4.27-8.91 the hero measured before any of this.

### The Apply swap is a class, not state

`past-hero` on <html>, toggled by a passive scroll listener at 140px — past the
nav's own 120px guard so the two do not fight over the same pixels. Both buttons
are in the markup and CSS decides which is live; flipping React state here would
re-render the whole page component, which this project has already measured
dropped frames from.

Two specificity traps on the way, both from `:root.intro-done .intro-fade`
(0,3,0), which the hero button carries for its arrival:

- `html.past-hero .hero-apply` is (0,2,1) and lost, so the button never faded
  out — measured opacity 1 with pointer-events none, i.e. an invisible button
  sitting over the page. Now `:root.past-hero`.
- the same rule's 1.35s transition was what the fade ran on, which reads as lag
  against a scroll. Overridden to 450ms at equal specificity.

On screens below lg the header has a hamburger and no Apply at all, so there is
nothing to migrate to: the hero's own button stays put there.

### Motion

Arrival on `:root.intro-done` (opacity + 1.07 scale, 1.8s, 500ms after the
intro hands over), then a 26s breathe of 2.5% scale and a few pixels, with the
rim pulsing on its own 19s so the two never peak together. The mark also
parallaxes -70px against the video's +160, so the layers separate as you leave
the hero. All of it off under `prefers-reduced-motion`, mark still visible.

### Verified

tsc, eslint, build clean. At 1440x900 and 390x844: the swap works both
directions (hero 1/header 0 at top, hero 0/header 1 past 140px, and back), the
breathe measurably moves (scale 1.003 -> 1.0097 over 5s), the headline is the
topmost element at its own coordinates, no console errors, no horizontal
scroll.

Note: the user suggested driving this with the Playwright MCP server. It is
registered for this project but not loaded into this session, so the same
engine was driven directly through `playwright-core` from the scratchpad —
screenshots, computed styles and pixel sampling all the same.

### Hero, second pass — what the first commit got wrong (2026-10-07)

The commit above shipped a version the user rejected on sight, and the
rejection was specific: "mi-ai impins tot logo-ul mai la dreapta, apar liniile
alea desenate, nu e crisp". All three were fair.

**The emerald rim was the "drawn lines".** Stroking the cut edge turned the
shape into a wireframe drawing. Gone entirely — there is no stroke anywhere in
the hero now.

**Crispness came from moving the layers OUT of the SVG.** The knockout was an
`<svg>` with masked rects; a `mix-blend-mode: screen` rect inside it does
nothing, because an SVG root isolates its own group and there is no video in
that group to blend with. So the mark is now two plain divs above the video
with CSS masks built from the mark's own path data as a data URI:

  .hero-mark-dim   near-black over the hero with the mark excluded
                   (two mask images, `mask-composite: exclude`)
  .hero-mark-tint  the accent at 22% inside the mark on `screen`, which
                   LIGHTENS the footage rather than glazing it

That is what makes it read on a dark frame: in the reference the inside is
brighter AND greener than the outside, not just greener. 0.32 was too much —
the shape went flat and the footage inside stopped showing through.

**Size and position.** 116vw starting at 16vw cut off the H bar and the play
device. Now 80vw from 15vw, so the mark ends at 95vw and the whole thing is on
screen, which is what the user asked for.

**Headline, on the user's instruction.** One line per written line with
`whitespace-nowrap` and a `vw` size, so the longest line — Romanian's "nu pot
lucra cu noi." at 20 characters — never breaks into three. The first word of
the second line takes the accent: "CAN'T" in English, "NU" in Romanian. Tied
to the first word rather than a character index, because the negation is the
point of the sentence in both languages. Weight 400 -> 500, which is a real
BDO Grotesk cut (all five weights ship as files, verified with
`document.fonts.check` so the browser is not synthesising it).

**The entity paragraph moved up** from the bottom of the hero to the row beside
Apply, behind a hairline rule, as on the board. It is deliberately NOT inside
the `hero-apply` wrapper: that wrapper animates to `opacity: 0` on scroll, and
this is the SEO/GEO brief's entity paragraph — copy that fades to nothing on
scroll is the pattern that reads as hidden text. Measured after the change:
button 0, paragraph 1.

**Contrast, re-measured on the final treatment:** 4.1:1 worst case across six
moments of the loop at 1440x900, 17.5:1 at 390x844. AA wants 3.0 for large
text.

### Hero, third pass: bigger mark, an arrival that follows the intro, mobile first (2026-10-08)

Four notes from the user: the mark should be bigger so the copy sits inside it;
the arrival clashed with the preloader ("avem si animatia aia de loading la
prima vizita, si trebuie sa dam cumva un alt efect care sa se completeze cu
asta"); the text animation could be more interesting; and mobile needed to be
the stronger version, since that is where the traffic is.

**Arrival, rewritten to chain instead of repeat.** The intro already does one
big gesture — the lockup's seam opens and the poster grows to fill the screen.
The hero was then fading and scaling the mark in, which is a second opening in
a row. Now the hero does what the intro cannot: it switches the brand on. The
dim settles first (900ms), then the accent sweeps the inside of the mark left
to right (1.5s), like current reaching the end of a sign. Traced on the real
page: words in place by 2.2s, dim 2.2-2.6s, tint 2.6-4.2s.

**Text.** Per WORD now rather than per line, each word rising out of its own
mask on a 55ms stagger — a line rising as one block is the move every site
makes. The accent word then lights up: a white word rises, and the emerald
wipes across it from 3.4s to 4.2s, in step with the tint on the mark, so the
sentence and the logo switch on together. Two stacked copies of the word,
because a colour cannot be clipped on its own.

**Mark.** 80vw -> 96vw from 4vw across, so the headline sits inside the E and
the D instead of beside them, with the H bar and the play device still on
screen.

**Mobile.** Headline left-aligned at 12.5vw (48.75px at 390), the row under it
left-aligned too, and the mark at 112vw across the lower third instead of a
small badge under the copy.

Two measurements drove the mobile numbers:
- at 128vw bled off the left edge, the only thing on screen was the inside of
  the D — the whole viewport went green with no shape in it. 112vw keeps the
  whole E-D-H.
- with the mark that big, the entity paragraph measured 2.27:1 over it, against
  AA's 4.5 for body text. Fixed with a top-down scrim (the phone's equivalent
  of the desktop's left vignette), the mark dropped to 84%, and the paragraph
  at white/80 on mobile instead of white/60. Now 7.83:1, with the headline at
  19.5:1 and desktop at 4.11:1.

**A mistake worth recording.** Rewriting the arrival block by text replacement
also deleted the two layers' `mask-image`/`mask-size`/`mask-composite`
declarations. The failure mode is quiet: both layers become plain coloured
rectangles, so the dim covers the whole hero and the tint washes it green —
there is no error, no console warning, just a flat green screen with no shape
anywhere. `getComputedStyle(...).maskImage === "none"` is what identified it.

## The layout's width — one token (8 Oct 2026)

Brief: less dead space left and right, the menu bar included, the hero copy
further left, "fara sa stricam cum arata site-ul".

The site had `max-w-[1440px]` written out 14 times across five files — the nav,
the footer, the home sections, the subpage container, the audit form, the
service device. All 14 now read `max-w-[var(--site-max)]`, declared once in
globals.css at **1680px**. Widening the site is one number from here.

At 1440 and below nothing moved at all: the cap only binds above it. At 1920
the gutters drop from 240px to 120px a side, and the hero headline starts at
160px instead of 280 — which is the "mai la stanga" in the brief, without
touching the hero's own padding.

**The paragraphs had to be held back.** The reading column is columns 4-8 of
the 8-column grid, so it widened with the container: 879px -> 1029px, which ran
body copy out to 99 characters a line. The frame should widen; the measure
should not. Body copy now carries `max-w-[40em]` (the 22px intro) and
`max-w-[44em]` (the 20px body), and the home testimonial quote `max-w-[62em]` —
each one the em equivalent of the 880px it already read at, so every paragraph
measures exactly what it did before. In em rather than px so they follow the
step down to 18px on a phone, where they are wider than the screen and do
nothing. Measured after: 77-85 characters everywhere, unchanged.

**The showreel's big box was the one thing that broke.** `max-w-[1408px]` —
the old container's inner width, hard-coded from the source site — left the
reel 240px short of the container's right edge once the layout widened. Now
plain `w-full` at 16:9. `Flip.fit` reads live rects, so the morph needed no
other change; the big box is simply bigger, and the scale factor rides along.

Also retuned: the two `sizes` hints that named 1440px breakpoints, so the
optimizer still serves an image big enough for the wider boxes.

**A dev-server trap.** `max-w-[62em]` was in the markup and absent from the
emitted CSS — `getComputedStyle(...).maxWidth` read `none` while the class sat
right there on the element. The same utility added to page-kit.tsx in the same
minute did apply. Turbopack had not re-run the Tailwind scan for site.tsx;
touching globals.css rebuilt it. Worth knowing before hunting for a specificity
bug that isn't there: check the stylesheet actually contains the utility.

## The Apply handoff, and two versions that were wrong (8 Oct 2026)

Three attempts, and the third is the one in the code. Recording all three
because the two rejected ones were both built correctly and still wrong, which
is the useful part.

**1. The cross-fade (rejected).** The hero's button dropped 12px and faded out;
the header's faded in from 8px ABOVE. The two halves moved in opposite
directions, so nothing tied them together - it read as two unrelated buttons
blinking at each other across 1400px. It was also a handoff nobody could see:
the threshold was 140px and the nav hides past 120px, so the arriving button
faded in behind a header already on its way out.

**2. The flight (built, verified, rejected).** The hero's button physically
travelled into the header's slot, scrubbed over the first 120px of scroll: live
rects every frame, a bent arc from staggered per-axis easing, a 5% scale dip at
mid-flight, a single-frame handoff with no overlap (two white pills under
`mix-blend-mode: difference` composite to black, so a cross-fade at the end
flashes dark). Measured path at 1920: 160,580 -> 387,364 -> 1057,126 ->
1590,16 against a slot at 1596,16, landing within 6px before the final snap.

It worked exactly as designed and was the wrong thing to build. Denis: "nu imi
place animatia, e aiurea, nu se potriveste." He is right - every other move on
this site is short, quiet and eased, and a 1400px sweep across the hero belongs
to a louder site than this one. Deleted rather than toned down: the scrub, the
rAF loop and the inline styles were all in service of a gesture that should not
be there.

**3. What is in the code.** The small version of the same idea. The swap fires
at **70px**, while both slots are still on screen and the nav is still shown -
that threshold is the single most important number here. The leaving button
exits UPWARD (-0.6rem, scale 0.97, 220ms) and the arriving one enters FROM
BELOW (+0.5rem -> 0, 260ms after a 90ms beat). Same direction, short, eased,
staggered: the eye joins them up without anything having to travel. Measured:
past-hero flips at y=73 with the nav still shown, and the exchange is finished
by y=110.

One trap on the way out: the leaving state sets three properties now
(`opacity`, `translate`, `scale`), and the `max-width: 1023px` override that
keeps the hero's button in place on a phone answered only two - which left the
button sitting at 97% for the rest of the visit. An override has to answer
every property the state it is overriding sets.

## The curved divider on a phone (8 Oct 2026)

The SVG is `w-[1516px] max-w-full`, so on a 390px screen the whole 1516-unit
viewBox is squeezed into the width - a uniform 0.257 scale, which rendered the
136px type at 38px. Against a full-height pinned section that left one thin
line of text in the middle of an otherwise empty screen: the divider that fills
15% of the viewport's height on a desktop filled 4.5% here.

Two numbers fixed it, both in globals.css behind `max-width: 767px`:

- **font-size 340** (from 136), which lands at ~96px rendered - the same 15% of
  viewport height the desktop gets. The trade is fewer characters on screen at
  once, ~6 instead of ~14, so the sentence reads as it sweeps. The sweep also
  gets faster for free: the travel is derived from the string's measured length,
  so longer text covers more ground over the same 3240px pin, which takes dead
  scroll out of the section rather than adding it.
- **translate(0, -10%)** instead of -30%. The lift is a percentage of the
  element's own 300px box, so -30% raised the arc 90px and left the ink at
  y~350 on an 844px screen with everything under it blank. Note this centres
  the INK, not the box - the glyphs sit above the path, so the two are
  different things by about 40px. Measured after: ink centre 409 against a
  viewport centre of 422 at 390x844, and 355/370 at 360x740.

The transform had to move out of the element's `style` prop to get here: an
inline style cannot be put behind a media query. Same reason the font size was
already in CSS.

Desktop is untouched - verified at 768 and 1440 that the font is still 136 and
the ink still lands where it did.

### The pin's length is now derived, not fixed

Bigger type made the next problem obvious: the sentence crawled, and the
section ran out of scroll with it still mid-screen. 3240px of pin was a
constant copied from the source, but the thing it has to cover is not - the
travel is the sentence's length in the current font size at the current render
scale. On a 1440 desktop that is 7271px of text movement; on a phone at 340px
against a 0.26 render scale it is 3879px. Same pin, so the phone moved the text
at half the desktop's speed.

So the pin is derived from one constant that actually describes the feel:
**2.24 CSS px of text per px of scroll**, which is the source's own ratio
(7271 / 3240). Measured results:

| | pin distance | before |
|---|---|---|
| desktop 1440 | 3244px | 3240px |
| phone, EN copy | 1732px | 3240px |
| phone, RO copy | 1482px | 3240px |

Desktop comes out at the number it was hardcoded to, which is the check that
the formula describes the existing design rather than replacing it. The phone
gets the desktop's speed and gives back ~1500px of scroll. RO is shorter than
EN because the sentence is shorter - which is the point of deriving it.

Two supporting fixes:

- **Measure after the webfont, but build before it.** `getComputedTextLength`
  against a fallback face returns a different advance, and at 340px that error
  is hundreds of user units - enough on its own to strand the sentence
  mid-screen. But waiting for the font before the first build means the
  pin-spacer appears late, which is what broke scrolling (below). So it builds
  immediately on whatever metrics exist and rebuilds once on `fonts.ready`.
- **A width-only resize key.** The pin length is now a measured value, so a
  rotation has to rebuild it. Width only, because a phone fires `resize`
  continuously as its address bar hides.

### `getComputedTextLength` lies about where the glyphs are

Worth recording because it cost a wrong fix. Checking whether the sentence
fully leaves the screen, `getBoundingClientRect()` on the `<textPath>`
reported the identical box (`-63..26`) at both ends of the sweep - it does not
track the glyphs along the path. That read as "26px of the last letter is still
on screen", and I added a tail clearance to push it off. The clearance was
unnecessary: counting dark pixels in the arc's band shows the screen is empty
from ~97% of the pin on a phone and ~95% on a desktop, with or without it. The
clearance came back out. For this kind of question, count pixels.

### The wheel stopped partway down the page

Reported mid-session: natural scrolling stopped before the bottom, while
dragging the native scrollbar still worked. That asymmetry is the whole
diagnosis - only the wheel goes through Lenis, and Lenis caches the scroll
limit.

Nothing linked a ScrollTrigger refresh back to `lenis.resize()`. GSAP changes
the document's height behind Lenis's back: a pinned trigger inserts its
pin-spacer the moment it is CREATED, and this page creates them late - Lenis is
a dynamic import, the divider now waits on a webfont, the showreel's Flip
re-fits on resize. Whichever lands after Lenis's first measurement leaves its
limit short by however much height appeared, and the wheel refuses to go past
it.

Fixed where it belongs, in the Lenis setup: `ScrollTrigger.addEventListener
("refresh", () => lenis.resize())`, plus one `lenis.resize()` at startup. That
covers every late layout change on the page, not just this one. The divider
also now builds its pin on the first frame rather than on `fonts.ready`, so the
height is there from the start.

Not reproduced locally: wheel-scrolling to the bottom in Edge through Playwright
reached the limit exactly, in all three of cold-intro, scroll-immediately and
`?intro=0`. The mechanism is certain from the code and the symptom, but the
confirmation has to come from the machine that showed it.
