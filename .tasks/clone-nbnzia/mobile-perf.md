# Mobile scroll performance (2026-09-01)

Reported: on a real phone the deployed site "staggers, lags, blocks the
scroll". Desktop was fine.

## Getting the harness right first

Two false negatives before any real measurement:

1. **`deviceScaleFactor: 1`.** Real phones render at DPR 3, so the compositor
   handles 1170x2532 px, not 390x844 - nine times the pixels. At DPR 1 the page
   profiled at 14ms average and looked healthy. At DPR 3 + 6x CPU throttle the
   same page was 24ms average with 14% of frames over 32ms.

2. **CDP device metrics do not emulate `pointer: coarse`.** A media-query guard
   tested under `Emulation.setDeviceMetricsOverride` silently never matched. A
   real `browser.newContext({ isMobile: true, hasTouch: true })` is required.

Also worth stating plainly: `window.scrollBy` inside rAF is main-thread
synchronised, so it cannot reproduce input blocking or compositor stalls. It
measures render cost only. The address-bar problem below was found by reading
code, not by the profiler.

## What it actually was

An A/B across suspects, DPR 3 + 6x throttle, hero region, p95 / % frames >32ms:

| variant | p95 | slow |
|---------|-----|------|
| baseline | 40.0ms | 14% |
| no header `mix-blend-mode` | 42.1ms | 14% |
| no blend anywhere | 41.7ms | 12% |
| **no `will-change`** | **30.1ms** | **3%** |
| no 3D contexts | 32.5ms | 5% |

`mix-blend-mode` was the obvious suspect and was **not** the problem - removing
it changed nothing. The cost was `will-change`.

## Fixes

**1. `will-change`: 26 permanently promoted layers -> 3 (peak 5).**
- `will-change: height` / `min-height` on the services accordion (10 elements):
  removed outright. Neither is a compositable property, so the hint cannot buy
  compositing and only forces a layer. Pure cost.
- Accordion media (5): now `isActive ? "transform" : "auto"` - one layer at a
  time instead of five held permanently.
- Process cards (3): moved to `hover:[will-change:transform]`. The tilt is
  pointer-driven, so on touch it was a promoted layer for an effect that can
  never fire.
- Work cards (6): the class is gone; the tilt's own ScrollTrigger sets it via
  `onToggle` while that card is scrubbing. Six FULL-SCREEN 3D layers held
  promoted for the whole page is ~1170x2532px of compositor memory each at
  DPR 3.

**2. Lenis is desktop-only.** It smooths WHEEL input; with the default
`syncTouch: false` it does not affect touch scrolling at all, so on a phone it
changed nothing visible while running a rAF loop every frame and pushing a
ScrollTrigger.update through the main thread on every scroll event. The nav's
existing native-scroll fallback (previously reduced-motion only) now covers
touch as well.

**3. The address-bar resize storm - the "blocks the scroll" symptom.**
On a phone, scrolling hides and shows the address bar, firing `resize` with a
changed HEIGHT repeatedly during one ordinary gesture. Every one of those bumped
`resizeKey`, which tore down the showreel Flip, re-fitted it, and called
`ScrollTrigger.refresh()` - a synchronous re-measure of six work cards, two
pinned dividers, the showreel, services and the process cards, mid-gesture.

The resize listener now compares WIDTH and ignores height-only events;
`orientationchange` still forces a re-fit. Plus
`ScrollTrigger.config({ ignoreMobileResize: true })`.

This one was invisible to the profiler - desktop never moves its address bar.

**Regression guard:** width changes MUST still re-fit, or the earlier bug
returns (Flip.fit bakes a static transform; a 1440->533 narrow left the video
1393px wide, 261% of the viewport). Verified: 7 simulated address-bar height
changes leave the video at 208px/53%, while a real 390->720 width change
re-fits to 399px/55%.

## Result

Full-page scroll, real touch context, DPR 3, 6x CPU throttle:

| | before | after |
|--|--------|-------|
| avg frame | 24.1ms | 17.6ms |
| p95 | 40.0ms | 25.7ms |
| frames >32ms | 14% | 2% |
| promoted layers | 26 | 3 |

Desktop verified unchanged: Lenis running, header and hero `mix-blend-mode:
difference` intact, all six work cards still 3D.
