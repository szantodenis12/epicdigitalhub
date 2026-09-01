# nbnzia.com preloader — teardown (2026-09-01)

Measured live with a rAF sampler injected via `addInitScript` before navigation
(polling from the Playwright side is far too coarse to see it - the whole
animation is driven by GSAP on children, and round-trip latency was ~170ms).

Frames: .tasks/clone-nbnzia/screenshots/loader/ld-<ms>.png

## Structure

```
.willem-loader                     full-screen flex, transparent bg
  .willem__h1                      "nbnzia"
    .willem__h1-start              "nbn"   <- slides LEFT  0.05em
      .willem__letter x3           n, b, n <- individually masked + staggered
    .willem-loader__box            width:110vw, sits BETWEEN the two halves
      .willem-loader__box-inner
        .willem__growing-image     width:100vw height:100dvh, transform-scaled
          .willem__growing-image-wrap
            img (Webflow CDN, srcset, sizes=100vw)
          .willem__cover-image
          .willem__cover-image-extra x3    <- cross-fading slideshow
    .willem__h1-end                "zia"   <- slides RIGHT 0.05em
```

The trick: the image box is a *flex sibling between the two halves of the
wordmark*, so it reads as a glyph inside the logotype. Growing it to 100vw x
100dvh pushes the letters off-screen and it becomes the hero.

## Timeline (1440x900, warm cache)

| t (ms) | beat |
|-------|------|
| 0-223 | loader in DOM but `visibility: hidden` (waiting on fonts/images) |
| 223 | becomes visible; `body { overflow: hidden }` - scroll locked |
| 211-1224 | letters rise from `translateY(+214px)` behind a mask, staggered ~20-30ms (home at 1165 / 1186 / 1224) |
| 1838 | halves split apart: "nbn" x-10px, "zia" x+10px (0.05em each) |
| ~2000-4300 | image slot cross-fades through several photos |
| 4311 | growing-image starts expanding out of the slot |
| 5534 | fills viewport (100vw x 100dvh) |
| 5867 | scroll released - page live |

**Total ~5.9s.** Replays in full on every visit: sessionStorage and
localStorage are both empty, and a reload locked scroll for another ~5.7s.

## Notes for adapting it

- 5.9s is a portfolio's budget, not a lead-gen site's. The full-screen image
  becomes the LCP element, so a loader this long directly inflates LCP.
- The letters-rise + split + grow structure is the part worth taking; the
  duration is not.
- EDH already has the GSAP Flip machinery (useShowreelFlip) that does exactly
  this kind of box-to-box morph, so the grow step is not new work.

---

## What was built (2026-09-01)

`Preloader` in src/app/page.tsx, plus a pre-paint gate in layout.tsx and the
`.intro-overlay` rules in globals.css.

Adapted, not copied:
- **Taken:** the structure. The image slot is a sibling BETWEEN the two halves
  of the logotype, so it reads as a glyph inside the mark before growing to
  fill the screen. EDH's lockup already had the seam - the rule between mark
  and wordmark - so the slot opens where the logo's own divider sits.
- **Not taken:** the 5.9s duration and the replay-every-visit behaviour. Ours
  runs ~2.2s, once per session.

### Gating

The pre-paint inline script in layout.tsx stamps `data-intro="play"` on <html>
and CSS keeps `.intro-overlay { display: none }` unless it is present. Hidden
by default, not shown-then-hidden - so a JS failure, a repeat visit or
`prefers-reduced-motion` can never leave a full-screen overlay with no timeline
to dismiss it. <html> needs `suppressHydrationWarning`: the script legitimately
adds an attribute the server markup lacks.

### Three bugs worth remembering

1. **The overlay must LEAVE the DOM.** At opacity 0 it looks finished but is
   still fixed, inset-0, z-index 100000, `pointer-events: auto` - it silently
   swallows every click on the page. The component returns null when done.

2. **GSAP cannot read a percentage transform back.** The markup carries an
   inline `translateY(115%)` to avoid a flash before the timeline is built, but
   getComputedStyle resolves that to a matrix, so GSAP reads `y: 110.4px,
   yPercent: 0`. Tweening yPercent to 0 is then a no-op and both halves stay
   clipped inside their masks for the whole intro. Fix: re-declare the start
   through `gsap.set({ yPercent: 115, y: 0 })` so GSAP owns the value.

3. **`animate={undefined}` strands motion elements.** usePrefersReducedMotion
   returns false in the server snapshot, so hydration renders once with the
   hidden initial state applied. If `animate` is then undefined, motion has no
   target and leaves the inline style where it is - the hero headline and the
   whole nav stayed invisible for reduced-motion users. Fix: `initial={false}`
   plus explicit final values, so reduced motion means "no animation", not
   "no content".

### Handoff

The picture is ONE fixed full-viewport layer; the slot is only a clip window
onto it, driven per-frame from the spacer's rect by a gsap.ticker callback.
Growing an <img> inside the slot instead would re-crop and rescale it every
frame, so the final frame would not match the hero underneath. Because it is
the hero image at hero scale throughout, the crossfade is invisible.

The `x` correction on the row matters: the mark and wordmark are different
widths (~247 vs ~471), so the slot's centre sits (markW - wordW) / 2 off the
viewport centre. Without it the full-screen frame lands visibly off and the
handoff jumps.

---

## Smoothing pass (2026-09-01)

### Reviewing the intro

`?intro=1` replays it on every load; `?intro=0` skips it. Neither overrides
`prefers-reduced-motion`. Without a param it stays once-per-session.

### The entrance was stuttering, and it was not the animation

Frame timing across the whole load (rAF deltas, 1440x900):

| window | frames | dropped >20ms | worst | avg |
|--------|--------|---------------|-------|-----|
| 0-1000ms | 73 | 5 | 257.6ms | 13.7ms |
| 1000-2000 | 144 | 0 | 7.5ms | 6.9ms |
| **2000-2800** | **98** | **2** | **69ms** | 8.1ms |
| 2800+ | - | 0 | 8.4ms | 6.9ms |

The animation ran clean at ~6.9ms. The two dropped frames (69ms at t=2733 and
63ms at t=2796) landed exactly on the handoff, and the cause was `introDone`
being React state: flipping it re-rendered the entire ~2000-line page component
on the precise frame the hero headline and header began moving.

Fix: the reveal no longer depends on a React render at all. `.intro-rise` /
`.intro-fade` in globals.css hold the start state, `<html>.intro-done` releases
them, and per-element stagger comes from an inline `--intro-delay`. The handoff
now only flips a class and starts Lenis - neither renders anything.

**After: zero dropped frames anywhere after 1s.**

The 257ms frame at ~700ms is hydration plus the GSAP/Lenis chunk, before the
timeline starts, and is a dev-server cost.

Also retimed: `onDone` fires at 1.72s, before the cover finishes clearing at
2.28s, so the headline is already in motion as the last of it fades. Firing on
completion made arrival read as two separate events - cover goes, then text
starts - which was most of what felt abrupt.

Reduced motion is now handled purely in CSS and unconditionally (it does not
wait on `.intro-done`), so content can never be left hidden if the intro never
runs.

### Pacing (2026-09-01, second pass)

The load-in read as too quick. Two changes:

1. Durations up ~1.5x and staggers roughly doubled (90-110ms steps -> 200ms).
2. Ease changed from `cubic-bezier(0.16, 1, 0.3, 1)` to the project's existing
   `cubic-bezier(0.22, 1, 0.36, 1)`. The old curve covered most of its distance
   in the first third, so it read as fast regardless of how long the duration
   was - lengthening it alone would only have stretched the slow tail.

All of it is tunable from three custom properties at the top of the intro block
in globals.css:

```css
:root {
  --intro-rise-duration: 1.9s;   /* hero headline lines */
  --intro-fade-duration: 1.35s;  /* header elements */
  --intro-ease: cubic-bezier(0.22, 1, 0.36, 1);
}
```

Per-element stagger stays inline as `--intro-delay` in page.tsx
(headline `0.08 + i * 0.2`s; header 0.1 / 0.3 / 0.5s).

Measured cascade, relative to the handoff (start -> settled, ms):
headline L1 76->1444, logo 103->1055, headline L2 277->1645, links 305->1256,
apply 499->1457. Settle lands ahead of the nominal duration because the ease
has a long tail. Still zero dropped frames.
