# Clone context — nbnzia.com

Source: http://nbnzia.com/ (redirects to https://www.nbnzia.com)
Platform: **Webflow** + GSAP 3.15 (ScrollTrigger, SplitText, Flip, InertiaPlugin) + Lenis 1.2.3 smooth scroll + jQuery 3.5.1
Stylesheet analysed: `nbnzia-main.webflow.shared.72101dd3d.css` (168 KB)

## ⚠️ SUPERSEDED — do not use the table below

The "Colors" table that used to sit here was derived by statically reading
Webflow's CSS custom properties and picked up a dark-mode *variable mode*,
producing a wrong claim that the whole site is black-bg/white-text with one
orange accent. It is **not**. The real palette is per-section and was
re-measured on 2026-08-28 via `getComputedStyle()` on the live DOM (see
"Per-section palette (verified)" below). The design-token values themselves
(`--_color---border-main: #1c1c1c` etc.) were not wrong as raw values — they
exist and are real Webflow variables — the error was assuming they paint the
whole page. They're now folded into the correct per-section breakdown.

## Per-section palette (verified via getComputedStyle, 2026-08-28)

Base page background (`body`): `rgb(245, 242, 243)` = **#F5F2F2** (warm
off-white/cream). This is the resting canvas color that shows through
anywhere a section doesn't paint its own background — About, the CTA-button
strip, and the Work section's outer wrapper all sit on this.

| Section | Element | Background | Text/heading color | Notes |
|---|---|---|---|---|
| Nav (bar) | `.willen-nav`, links, buttons | transparent | `#1F1F1F` (`rgb(31,31,31)`) | `mix-blend-mode: difference` — see Mechanism 2. Apparent color is whatever `difference(#1F1F1F, background-under-nav)` produces, changes continuously as you scroll/as the photo passes underneath. |
| Nav (mobile hamburger panel) | `.bold-nav-full__tile` | `#1B372E` (`rgb(27,55,46)`, dark green) | white | Off-canvas full-screen mobile menu overlay, not visible on desktop. Previously mis-flagged as a mystery color; this is its actual, narrow purpose. |
| Hero | `.willem-header` wrapper | transparent (image shows through) | `#FFFFFF` base, `mix-blend-mode: difference` | H1 headline — see Mechanism 1. The apparent navy/white two-tone is the blend result against the duotone hero photo, not two separate colors. |
| About (bio/eyebrow) | `#about` (`.c-section`) | `#F5F2F2` (page bg) | body text near-black; About h3 letters at rest `rgba(255,255,255,0.2)` before their reveal wave (see Mechanism-adjacent note below) | |
| About CTA row | `.c-section.inner` | `#F5F2F2` (page bg) | "Let's talk" → solid `#EB381C` bg / white text, `mix-blend-mode: normal` (button variant `w-variant-f3f7f30a`). "See the work" → base button variant: bg `#FFFFFF`, text `#000`, `mix-blend-mode: difference` — against the cream `#F5F2F2` page bg this differences out to **near-black** (`~rgb(10,13,12)`), which is exactly why the screenshot shows it as a "solid black" button. It is not a separately-styled black button. | |
| Marquee / showreel wrapper | `.resource-wrapper` | transparent (page bg shows through until the video fills it) | — | |
| Services | `#services` (`.mwg035`) | `#0F0F0F` (`rgb(15,15,15)`, near-black) | `#F5F2F2` (`rgb(245,242,243)`) | Eyebrow icon is a heart-shaped SVG path (`fill: currentColor`), not literally a suit glyph. |
| Curved-text dividers (both) | `.mwg032` | transparent (page bg) | `currentColor` → inherits page default, renders near-black on `#F5F2F2` | |
| Work — card 1 CTO Bees | `.case-content` | `#FFCD71` (`rgb(255,205,113)`) | `#1F1F1F` | |
| Work — card 2 Manana Films | `.case-content.grey` | `#1F1F1F` (`rgb(31,31,31)`, near-black) | `#F5F2F2`-ish light text | |
| Work — card 3 Lumino | `.case-content.beige` | `#FAE7D5` (`rgb(250,231,213)`) | `#1F1F1F` | |
| Work — card 4 JACK3D | `.case-content.blue` | `#1049CC` (`rgb(16,73,204)`) | white | |
| Work — card 5 Almore Capital | `.case-content.green` | `#7A6E5B` (`rgb(122,110,91)`, olive) | white | |
| Process (fanned cards) | `.mwg043-card` | white | `#1F1F1F` body, **orange `#EB381C`** for the "STEP 0N" eyebrow (`.text-color-orange`) | |
| Contact / Footer | `.mwg044` inside `main.demo-main` (bg itself transparent, painted by a shared dark wrapper) | dark (matches the `#0F0F0F`-family near-black used elsewhere) | Eyebrow ("{ Let's Talk }") default text; headline paragraphs (`READY FOR / YOUR / PRESTIGE / MOMENT?`) computed color **`rgb(241,241,241)` = `#F1F1F1`**, `background-image: none` | **"PRESTIGE" is NOT gradient/orange-highlighted** in the resting/computed state — that claim in the old notes is wrong, see correction note below. Footer secondary text `#5F5F5F`. |

### Design-token CSS custom properties (real values, confirmed via getComputedStyle, not just static CSS read)
| Token | Value |
|---|---|
| `--_color---white` | `white` |
| `--_color---black` / `--_color---text-dark` | `#000` |
| `--_color---accent-1` | `#8eb4d9` (used as the hover fill/border for outline-style buttons) |
| `--_color---orange` | `#eb381c` |
| `--_color---border-main` | `#1c1c1c` |
| `--_general---border-size--1` | `1px` |
| `--_general---button--font-size` | `.75rem` |
| `--_general---button--line-height` | `1.66667` |
| `--_general---button--letter-spacing` | `0em` |

### Correction: process-card "script font" claim is wrong
The task brief and the old screenshot-derived notes both describe the
process step cards ("The Pledge" / "The Turn" / "The Prestige") as using "a
distinct cursive/script display font." **Verified false.** `getComputedStyle()`
on `.mwg043-card h3.u-h3` returns `font-family: Bdogrotesk, Arial,
sans-serif` — identical to every other heading on the page. The full
stylesheet was fetched and searched for every `@font-face` and
`font-family` declaration; only the 5 BDO Grotesk weights exist, no
Google Fonts `<link>`, no Typekit, no second `@font-face`. A fresh
screenshot taken at the live section (`process-live-check.png`, captured
this session) confirms it's plain BDO Grotesk — the cursive/script
*impression* in the original screenshot comes purely from the card's
rotation transform (see Mechanism 7: cards sit at −5°/0°/+5° at rest, plus
an elastic overshoot from 40° on scroll-in) combined with BDO Grotesk's
soft/rounded terminals, which reads as "handwriting" at a glance when
tilted. **No second font needs to be sourced or downloaded**; the existing
5-weight BDO Grotesk family (already in `public/fonts/`) is correct and
complete for the whole site.

Accent palette also present but barely used on the homepage:
`#8eb4d9 #9bc59d #7bad8b #a98dc3 #959082 #eebfcb #d47595 #b0985b #ffaefe #bda7f6`

## Typography (measured via getComputedStyle, 2026-08-28)
- Family: `Bdogrotesk, Arial, sans-serif` for everything, including the process
  cards (see correction note above) — real woff2 files recovered to
  `public/fonts/` (Light 300 / Regular 400 / Medium 500 / DemiBold 600 /
  Bold 700). Commercially licensed.

| Element | Selector | Desktop (1920px) | Mobile (375px) | Weight | Transform |
|---|---|---|---|---|---|
| H1 (hero headline) | `.mwg046-sentence` | 96px / line-height 96px / letter-spacing −2.88px (−0.03em) | 37.02px / 37.02px lh / −1.11px ls | 400 | uppercase (fluid — confirms `clamp()`/`vw`, not a fixed media-query step) |
| H3 (About bio, Process card titles) | `.u-h3` | 36px / lh 48px / ls −0.36px | 33.32px / lh 44.42px / ls −0.33px | 500 | none |
| Contact/Footer big line (`READY FOR`/`PRESTIGE`/etc.) | `.mwg044-line p` | 128px (8rem) / lh 0.9 / ls −0.05em | 33.32px / lh 29.98px / ls −1.67px | 500 | uppercase. Responsive steps hard-coded in CSS: ≤991px → 4.25rem, ≤767px → 3rem, ≤479px → 2.25rem |
| Services accordion row heading | `.accordion_heading` | 36px / lh ~48px / ls −0.36px | 22.21px / lh 29.61px / ls −0.22px | 500 | none |
| Services accordion sub-label `[ 01 ]` | `.accordion-sub` | 16px / lh 16px | — | 400 | none |
| Services accordion description | `.accordion-content_text` | 16px / lh 24px | — | 500 | none |
| Eyebrow (`{ WHAT I DO }` etc.) | `.u-copy-xxxs-2` | 10px / lh 16px / ls −0.1px | — | 400 | uppercase |
| Nav link | `.willem-nav__link` | 12px / lh 15.6px | — | 400 | none |
| Button label | `.btn-size` / `.button-text` | 12px (`.75rem`) / lh 1.66667 / ls 0em | — | 400 | none |
| Curved-text divider (`textPath`) | `.mwg032 textPath` | `font-size: 9vw` | `font-size: 40vw` (media ≤768px) | inherits | uppercase (`text-transform: uppercase` in the section's own `<style>`) |

## Spacing & radius (measured)
- Container: `.u-container` → `max-width: 1440px`, `padding: 0 16px` (desktop), `padding: 0 22.21px` at 375px viewport (fluid).
- Section padding: `#about` → `96px 0`; `.c-section.inner` (CTA row) → `96px 0`.
- `#services .u-container` inner padding: `0 16px`.
- `#work` and `#process` sections: `0` padding, fully edge-to-edge (each work card and process wrapper handles its own internal spacing).
- Services accordion row height: collapsed `96px` min-height, expanded (default-open row 1, and on hover) `244px` min-height.
- gap scale (from Webflow utility classes seen in use): 0.25 / 0.5 / 1 / 1.5 / 2 / 2.5rem
- radius: buttons `0.13rem` (≈2px, computed `2.08px`); form/other components 0.5rem (8px), 1rem (16px), 2rem (32px) where used elsewhere in the CSS.
- border widths: 1px (`--_general---border-size--1`), 2px, 3px seen elsewhere in the shared CSS.

## Component details

### "Let's talk" / "See the work" button — corner-bracket construction (verified)
The button (`.btn > .btn-size` + `.arrow-wrap`) has two tiny (`viewBox="0 0 8
8"`) SVG quarter-arc paths pinned at opposite corners:
```html
<div class="arrow-wrap">
  <svg viewBox="0 0 8 8" class="arrow-bottom">
    <path d="M8 8L0 8L0 7.33C4.05 7.33 7.33 4.05 7.33 0L8 0Z" fill="currentColor"/>
  </svg>
  <svg viewBox="0 0 8 8" class="arrow-top">
    <path d="M0 0H8V0.67C3.95 0.67 0.67 3.95 0.67 8H0V0Z" fill="currentColor"/>
  </svg>
</div>
```
`arrow-bottom` sits at the bottom-left corner, `arrow-top` at the top-right —
together they read as two small curved brackets at opposite corners of the
button (the "corner-bracket detail"). CSS (scoped `<style>` shipped inline
next to the button):
```css
.btn .arrow-top, .btn .arrow-bottom { transition: transform 0.45s ease; }
@media (min-width: 992px) {
  .btn:hover .arrow-bottom { transform: translateX(-9.7rem) rotate(90deg); }
  .btn:hover .arrow-top    { transform: translateX(9.7rem) rotate(90deg); }
}
```
On hover the two brackets swing outward (±9.7rem) while rotating 90°, over
0.45s ease.

Full base button CSS (from the shared stylesheet):
```css
.btn {
  z-index: 1; border-style: solid; border-width: var(--_general---border-size--1);
  background-color: var(--_color---white); height: 3.5rem; color: var(--_color---black);
  text-transform: none; cursor: pointer; mix-blend-mode: difference;
  border-color: rgba(142, 180, 217, 0); border-radius: 0.13rem; transition: 0.3s;
}
.btn:hover .button-text { transform: translateY(-100%); } /* the label flip, see Mechanism 5 */
```
Two named variants exist in the Webflow "variant" system:
- **base** (`.btn` alone) → white bg / black text / `mix-blend-mode: difference` (nav, "See the work"). Its apparent on-page color is always `difference(white, whatever is behind it)`.
- **orange** (`.btn.w-variant-f3f7f30a-...`) → solid `background-color: #eb381c`, `color: white`, `mix-blend-mode: normal`, `border-color: black` at rest, `border-color: var(--_color---accent-1)` (`#8eb4d9`) on hover. Used for the About-section "Let's talk" CTA.

### Form / contact
- `.mwg044-form_input`: computed `background-color: transparent`, `border: 0`, `border-radius: 0` — the visible boxed appearance in the screenshot comes from a parent wrapper, not the input itself.
- `.mwg044-form_button` ("Submit"): `background-color: rgb(245,242,243)` (#F5F2F2), `color: rgb(31,31,31)` (#1F1F1F).
- `.mwg044-footer_top-email` has an animated underline: `::after` is a `0.25rem`-tall bar, `transform: scaleX(0)` at rest (`transform-origin: 100% 50%`), animates to `scaleX(1)` from `transform-origin: 0% 50%` on hover, `transition: transform 0.3s ease`.

### Marquee (About CTA strip)
Structure: `.c-marquee-horizontal_wrap > _layout > _track (display:flex) > _cms_wrap > _cms_list > _cms_item(_text + _icon)`.
Item text list, in DOM order (list is duplicated back-to-back for the seamless loop):
`7+ years in Webflow` · `Certified Webflow Partner` · `Clients in 15+ countries` · `10 years as a pro illusionist` · `117+ projects delivered` *(first copy)*, then the same four plus **`50+ projects delivered`** on the second copy — the live site's two copies actually disagree on the 5th stat's number (117+ vs 50+), a genuine content quirk on the source, not an extraction error.
Separator glyph: **one single fixed SVG icon**, identical `<path>` on every item (a stylised interlocking-loop glyph, not a heart and not a rotating set of card suits — corrects the old note that guessed "cycles through card-suit symbols"). Saved to `public/icons/marquee-separator-glyph.svg`.

## Mechanisms (verified from live DOM/CSS/JS, not guessed)

### 1. Hero headline two-tone color → `mix-blend-mode: difference`
`.mwg046-sentence` (the H1) computes to `color: rgb(255,255,255)` with
`mix-blend-mode: difference`. There is no background-clip, no gradient, no
duplicated masked layer — it's a single white text layer blended against
the duotone hero photo beneath it, so it reads dark over the light sky and
light over the dark silhouette purely from the blend math.

### 2. Nav per-section recoloring → same trick, not a ScrollTrigger class swap
`.willen-nav` and every nav link/button (`.nav-anim`, `.willem-nav__links`,
`.btn.nav-anim`) all compute `mix-blend-mode: difference` with a fixed base
color of `rgb(31,31,31)` (`#1F1F1F`). There is no scroll-triggered class
toggle recoloring the nav — the apparent navy/cyan/black variation per
section is entirely `difference(#1F1F1F, whatever pixel is currently behind
the nav)`, which naturally varies as the photo, near-black services
section, and colored work cards scroll underneath it. (Separately, the
`.bold-nav-full__tile` dark-green `#1B372E` some earlier notes flagged is
just the mobile hamburger overlay panel's background — unrelated to desktop
nav recoloring.)

### 3. Pinned scroll sequence (hero → trust list → CTA → marquee → showreel video)
The hero itself (`.willem-header`) is **not pinned** — `position: relative`,
fixed `height: 1080px` (1 viewport), scrolls normally. What's actually
pinned/scrubbed is the showreel video, via GSAP **Flip**, inside
`.resource-wrapper` (total height 1452px = `scaling-element-header` 180px +
`scaling-element-video` 1272px), which sits after `#about` (528px) → CTA row
`.c-section.inner` (248px) → an intermediate `.c-section` (223px) →
`.resource-wrapper`. Combined with the 1080px hero, that's ≈3531px of total
scroll through the sequence, in the right ballpark of the "~3000px" estimate.

The video-scaling mechanism (from the section's own inline script):
```js
gsap.registerPlugin(ScrollTrigger, Flip);
var wrapperElements = document.querySelectorAll("[data-flip-element='wrapper']"); // 2 of them: small header box, big video box
var targetEl = document.querySelector("[data-flip-element='target']"); // the actual <video>
var tl = gsap.timeline({
  scrollTrigger: {
    trigger: wrapperElements[0],
    start: "center center",
    endTrigger: wrapperElements[wrapperElements.length - 1],
    end: "center center",
    scrub: 0.25
  }
});
tl.add(Flip.fit(targetEl, wrapperElements[1], { duration: offset, ease: "none" }));
```
i.e. the `<video>` element is Flip-morphed (position + size) from a small
box embedded in the normal content flow to a full-bleed big box, scrubbed
1:1-ish (`scrub: 0.25`, slightly smoothed) with scroll distance = the pixel
gap between the two boxes' centers. A custom floating video-control pill
(`.sv-bar`: play/pause, scrub track, timestamp) and a cursor-following mute
button (`.sv-sound`, fixed position, recentered on the pointer) overlay the
video — both are bespoke, not native `<video controls>`.
The exact hero-exit/About-reveal cross-fade tween itself lives in the
compiled `webflow.a0aa6ca1....js` bundle rather than an inline `w-embed`
script, so its precise easing wasn't extracted — treat it as a scroll-linked
opacity/transform reveal on the About content, not a full pin of the hero.

### 4. Services hover accordion (`mwg035`)
Row markup: `.mwg035-li > .accordion-item-wrapper (.accordion-sub "[ 01 ]" +
.accordion_heading h3) + .accordion-content (.accordion-content_text) +
.mwg035-medias (img, tracks cursor)`. Collapsed row `min-height: 96px`;
expanded (row 1 is default-open, or whichever row is hovered) `min-height:
244px`. Only one row open at a time (accordion). Each row has its own unique
preview image (5 real files, downloaded — see Assets).

### 5. Duplicate stacked text nodes → vertical label-flip hover
Every nav link, both CTA buttons, and "Visit Website" render their label
**twice** as sibling nodes (e.g. `<div class="button-text">Let's talk</div>
<div class="button-text">Let's talk</div>`, or for nav links, two
`.willem-nav__line` spans with per-character split spans). The hover CSS is
simply:
```css
.btn:hover .button-text { transform: translateY(-100%); }
```
Parent container clips overflow, so the top copy slides up out of the
clipped box on hover while the identical second copy is already sitting
directly below it, ready to occupy the same slot — the classic clip +
translateY label-flip. No timing/easing was declared beyond the button's
general `transition: 0.3s` on `.btn`.

### 6. Curved-text dividers (`.mwg032`, textPath, SVG)
Exact CSS:
```css
.mwg032 svg { width: 100%; height: auto; overflow: visible; transform: translate(0, -100%) scale(1.1); }
.mwg032 textPath { fill: currentColor; font-size: 9vw; text-transform: uppercase; }
@media (max-width: 768px) { .mwg032 textPath { font-size: 40vw; } }
```
Exact SVG (path/curve is identical for both dividers, only the sentence text differs):
```html
<svg width="1516" height="300" viewBox="0 -208 1516 300" overflow="visible">
  <path d="M -700 252 C -470 200 -230 145 0 92.0674 C 528.5 -28.9327 977.5 -32.4328 1516.5 92.0674 C 1745 145 1980 200 2216 252" id="mwg032-path-…"/>
  <text><textPath startOffset="…%" href="#mwg032-path-…">Every trick leaves evidence. Here is what remains.</textPath></text>
  <!-- second instance: "Behind the illusion there are three acts." -->
</svg>
```
Pinned scroll-scrub (from the section's inline script): `pinHeight` total is
**4320px**, of which **3240px** is the actual pinned/scrubbed distance
(`pinHeight.offsetHeight − window.innerHeight`). The animation scrubs the
`textPath`'s `startOffset` attribute linearly (`ease: 'none'`, `scrub: true`)
from just past the path's visible end (text starts off-screen right) to just
before the visible start minus the text's own measured width (text ends
off-screen left) — i.e., the sentence travels leftward along the curve as
you scroll, 1:1 with scroll position, computed via `path.getTotalLength()`
and a `<canvas>` `measureText()` of the actual rendered text width so it
works for any string length.
```js
gsap.to(textPath, {
  attr: { startOffset: endOffset + '%' },
  ease: 'none',
  scrollTrigger: { trigger: pinHeight, start: 'top top', end: '+=' + scrollDistance, pin: container, scrub: true }
});
```

### 7. Process step cards — fan layout + physics hover (`mwg043`)
Exact fan math (from the section's own inline script, `min-width: 992px`
branch):
```js
const angle = 5;    // degrees of rotation per card, relative to center
const spread = 300; // px of x-offset per card, relative to center
const lift = 45;    // px of y-offset, per dist^2 (so outer cards sit lower)
// 3 cards, center index = 1 → dist = index - 1
// card 0: rotation -5deg, x -300px, y 45px
// card 1: rotation  0deg, x    0px, y   0px
// card 2: rotation  5deg, x  300px, y 45px
gsap.set(cardWrappers[i], { rotation: angle*dist, x: spread*dist, y: lift*dist**2 });
```
Reveal-in tween on scroll: `gsap.from(cardWrappers, { rotation: 40, stagger:
0.07, ease: 'elastic.out(1, 0.75)', duration: 1.5, scrollTrigger: { trigger:
root, start: 'top 20%', toggleActions: 'play none none none' } })` — cards
fly in from a shared 40° rotation with a 0.07s stagger and an elastic
overshoot, 1.5s duration.
Bonus (undocumented in the task brief but real): on desktop, each card also
has a **mouse-driven inertia/momentum tilt** on `mouseenter`+`mousemove`
using GSAP `InertiaPlugin` — cursor velocity is converted into a torque
(`offsetX*velY − offsetY*velX`) that's applied as a rotation/x/y "flick"
with `resistance: 130`, clamped to ±320px / ±55deg, decaying back to the
fan's resting transform.

### Correction: "PRESTIGE" gradient claim
`.mwg044-line p` (the paragraphs "READY FOR" / "YOUR" / "PRESTIGE" /
"MOMENT?") compute to a flat `color: rgb(241,241,241)` with
`background-image: none` — there is no gradient, mask, or orange highlight
on "PRESTIGE" in its resting state. What *does* use orange is a separate,
genuinely interesting mechanism: a full duplicate copy of the whole
contact/footer block (`.mwg044-duplicate`) is layered on top, clipped to a
small circle that follows the cursor:
```css
.mwg044-duplicate {
  --xpercent: 50%; --ypercent: 50%;
  -webkit-mask-image: radial-gradient(circle at var(--xpercent) var(--ypercent), #000 20%, transparent 25%);
}
.mwg044-duplicate .mwg044-header p, .mwg044-duplicate .mwg044-footer p { color: var(--_color---orange); }
```
i.e. a cursor-tracked "torch" reveals an orange-tinted duplicate of the
**eyebrow labels** ("{ Let's Talk }", footer nav) wherever the mouse hovers
over the section — not a static gradient on the headline word.

## Section order
1. Nav — logo, About / Services / Work / Process, "Let's talk" CTA
2. Hero — h1 "Every great trick has three parts. Your website is the Prestige."
3. Marquee — stats strip, GSAP horizontal loop, card-suit separators
4. About — large statement + portrait + stat grid
5. Services — `{ WHAT I DO }`, 5-row hover accordion (`mwg035`) with media preview that tracks the cursor
6. Work — 5 case studies, image + description + "Visit Website ↗"
7. Process — `{ Process }`, SVG textPath curve; 3 acts: The Pledge / The Turn / The Prestige, each with a checklist
8. Contact — "READY FOR YOUR PRESTIGE MOMENT?" + Name/Email form
9. Footer — Follow / Write columns, socials, copyright

## Notable interactions
- Lenis smooth scroll site-wide
- GSAP SplitText character/line reveals on headings
- `mwg035` services accordion: rows expand on hover, image preview follows pointer
- Horizontal marquee loop on the stats strip
- ScrollTrigger-driven reveals on work cards and process steps

## Assets — downloaded (2026-08-28)

All real files pulled from the live site and saved into `public/`. Largest
`srcset` candidate used where one existed.

### Fonts — `public/fonts/` (already present, unchanged, do not redownload)
`BDOGrotesk-Light.woff2` (300) · `BDOGrotesk-Regular.woff2` (400) ·
`BDOGrotesk-Medium.woff2` (500) · `BDOGrotesk-DemiBold.woff2` (600) ·
`BDOGrotesk-Bold.woff2` (700). This is the **only** font family on the whole
site, including the process cards — see correction note above. Commercially
licensed (BDO Grotesk), so flagging plainly: you need a license to ship this
outside of a clone/study context.

### Images — `public/images/`
| File | Source | Used for |
|---|---|---|
| `hero-portrait.avif` | `Hero.avif` | Hero background photo; also reused as one of the two Contact-section inline circular photos (the `.mwg044-duplicate` spotlight copy) |
| `about-portrait-alt-jpeg.jpeg` | `20A501A7-...jpeg` | The *actual* Contact-headline inline circular photo ("READY FOR [photo] YOUR") in the primary (non-duplicate) contact block |
| `hero-sequence-image-1.webp` / `-2.avif` / `-3.avif` | `image.webp`, `IMG_9732-p-2000.avif`, `IMG_9674 1.avif` | The other 3 stacked images in `.willem__growing-image-wrap` (classes `is--1/2/3`) behind the hero, part of the pinned image-cycle sequence alongside the main hero photo |
| `service-1-webflow-development.avif` … `service-5-copywriting.avif` | per-row Webflow filenames | The 5 services-accordion hover thumbnails, in row order (Webflow Dev / UX Design / Motion & Animation / Marketing Strategy / Copywriting) |
| `work-1-ctobees.png` | `Frame 51.png` | Work card 1 image (unusual PNG filename vs. the others, but confirmed correct via DOM query) |
| `work-2-mananafilms.avif` … `work-5-almorecapital.avif` | `case-2.avif` … `case-5.avif` | Work cards 2–5 images |

### Videos — `public/videos/`
| File | Notes |
|---|---|
| `about-showreel-720p.mp4` | The real About-section showreel. Source is **Mux-hosted HLS** (`stream.mux.com/....m3u8`), not a static file — the page plays it via `hls.js` into a `<video>` with a `blob:` src, so there is no plain downloadable URL. Reconstructed by fetching the 1280×720 rendition's fragmented-MP4 init segment + all 11 `.m4s` media segments from the signed manifest and concatenating them (`cat init.m4s seg_0.m4s … seg_10.m4s`), which produces a standards-valid fMP4 (`ftyp iso6 ... dashhls`). **Video track only** — the muxed stream has a separate audio track, but the site always plays the element `muted`, so audio was skipped as unnecessary for the clone. If a future re-extraction needs it: fetch `https://stream.mux.com/B84fOG5lDZVLe2L02EvODUr01fJ7Fy00UjfWU1JM8dIrI8.m3u8`, note the segment URLs are signed and time-limited (`expires=` query param), so grab them close to when you'll actually download. |

### Icons/SVG — `public/icons/`
| File | Source | Notes |
|---|---|---|
| `nav-logo.svg` | `nav-logo.svg` | The "NBNZIA" wordmark logo |
| `heart-glyph.svg` / `heart-glyph-alt.svg` | `Union.svg` / `Union (1).svg` | Two near-identical heart-shaped glyph files Webflow exported for the `{ Process }` eyebrow icon in the two curved-text dividers; the Services `{ WHAT I DO }` eyebrow uses the *same shape* but inlined as raw `<svg><path>`, not one of these files |
| `marquee-separator-glyph.svg` | inlined path, saved by hand | The single fixed separator icon in the About stats marquee (see Component details above — it does **not** cycle through card suits) |
| `social-webflow.svg` / `social-instagram.svg` / `social-linkedin.svg` | inlined paths, saved by hand | Footer "Follow" column icons |
| `emoji-fire.png` / `emoji-love.avif` / `emoji-shame.avif` / `emoji-thumbsup.avif` | `1fa84.png`, `icon-3d-*.avif` | 3D emoji PNGs used by the hidden "Emoji Rain" easter-egg button in the footer/contact area (a click-triggered animation raining 3D emoji up the screen — decorative Easter egg, low priority for the clone) |
| `favicon.png` | `Favicon.png` | Site favicon |

## Identity substitutions made in the clone
The source is the personal portfolio of a real named individual. Layout, type,
color, spacing and motion are reproduced faithfully; the following should be
replaced with placeholders and marked `PLACEHOLDER` in the clone's source:
- personal name, logo wordmark (`nav-logo.svg`), portrait photographs (`hero-portrait.avif`, `about-portrait-alt-jpeg.jpeg`, `hero-sequence-image-*`)
- email addresses and social handles (footer `HEY@NBNZIA.COM`, `webflow.com/@eugenenebenzia`, `instagram.com/nbnzia`, `linkedin.com/in/yevhenii-nebenzia-...`)
- real client names, logos and their case-study copy/URLs (CTO Bees, Manana Films, Lumino, JACK3D, Almore Capital)
- the showreel video (`about-showreel-720p.mp4`) shows the real person's face/workspace

All of the above **were downloaded as real files** this session (unlike an
earlier draft of this note, which predates the asset pass and incorrectly
implied nothing had been fetched) — the substitution decision is about what
the *cloner* should swap for placeholders when building the page, not about
what got extracted.

## Screenshot inventory (screenshots/)

Captured live from https://www.nbnzia.com/ via Playwright, desktop viewport 1920x1080
unless noted. Page was scrolled top-to-bottom-to-top once before every capture batch
so lazy images decoded and every GSAP ScrollTrigger fired at least once.

| File | Shows |
|---|---|
| full-page-desktop.png | Full-page stitch at 1920x1080. Unreliable, see caveat below. |
| full-page-tablet.png | Full-page stitch at 1024x768. Same caveat likely applies. |
| full-page-mobile.png | Full-page stitch at 375x812. Same caveat likely applies. |
| component-nav-default.png | Top nav bar at rest: wordmark "NBNZIA", 4 links (About/Services/Work/Process), "Let's talk" pill button. Cropped from the hero shot (110px strip). |
| component-nav-hover.png | Nav with "Work" link hovered. No visible static-frame difference from default, see Animations. |
| component-button-primary-hover.png | "Let's talk" nav CTA hovered. No visible static-frame color change captured, see Animations note on nav recolor. |
| component-button-secondary-hover.png | "See the work" outline/dark button hovered, in context with "Let's talk" beside it. |
| component-button-submit-hover.png | Contact form "Submit" button (white, dark text) hovered, full contact section for context. |
| component-form-field-focus.png | Name field focused (border/background lightens slightly), full contact section for context. |
| component-work-card-hover.png | CTO Bees work-card link hovered. Also shows the nav recoloring to navy-on-warm-bg, see Animations. |
| section-hero.png | Full hero viewport: nav + "Every great trick has three parts. Your website is the Prestige." over a duotone (pale-yellow/cream) portrait photo of a silhouetted figure. |
| section-hero-to-about-reveal-transition.png | Mid-scroll (y~500) capture showing the hero pinned/fading while the About bio heading scroll-reveals underneath at partial opacity, evidence of the scroll-linked cross-fade. |
| section-about-statement.png | About: left column (narrow, ~18% width) eyebrow list "CERTIFIED WEBFLOW PARTNER. / 7+ YEARS. / CUSTOM EVERYTHING. / MAKE SITES THAT PERFORM." stacked one per line; right column (~55% width) large bio heading, two paragraphs. |
| section-about-cta-buttons.png | "Let's talk" (solid red-orange #eb381c) and "See the work" (solid black) buttons side by side, each with small corner-bracket accents top-left/bottom-right. |
| section-about-cta-marquee.png | Buttons + the horizontal stats marquee strip + top portion of the orange showreel-video card ("THERE ISN'T ONE. JUST PROCESS." collage frame). |
| section-about-video-bottom.png | Bottom portion of the About showreel video (monitor-on-desk scene, orange practical lighting, native video controls: play/pause, scrubber, timestamp, fullscreen, mute) plus the stats marquee repeating below it. |
| section-services-rest.png | Services list scrolled into view with row 1 already expanded (default-open, not a real hover), see section-services-rest-true.png for genuine rest. |
| section-services-rest-true.png | True rest state: all 5 rows collapsed to a single heading line each, no description/thumbnail visible. |
| section-services-hover-row3.png | Row "[03] Motion & Animation" hovered/expanded: description paragraph + a workspace-monitor thumbnail slide in from the right; other rows stay collapsed. Nav recolors cyan-on-black here. |
| section-services-hover-row5.png | Row "[05] Copywriting" hovered/expanded with a different thumbnail image; confirms each row has a unique preview image. |
| section-curved-transition-1-pre-work.png | Giant curved/arced headline "...TRICK LEAVES EVIDE[NCE]..." (SVG textPath, ~9vw type) between Services and Work, with a "{ PROCESS (suit) PROCESS }" eyebrow row above it (despite sitting before Work, not before the Process section, see note below). |
| section-work-1-ctobees.png | Work card 1/5, "CTO BEES (01)", yellow full-bleed background. |
| section-work-2-mananafilms.png | Work card 2/5, "MANANA FILMS (02)", near-black background. |
| section-work-3-lumino.png | Work card 3/5, "LUMINO (03)", pale peach background. |
| section-work-4-jack3d.png | Work card 4/5, "JACK3D (04)", saturated blue background. |
| section-work-5-almorecapital.png | Work card 5/5, "ALMORE CAPITAL (05)", olive/khaki background. |
| section-curved-transition-2-pre-process.png | Second curved-text divider, "{ PROCESS (suit) PROCESS }" + "BEHIND THE ILLUSION THERE ARE THREE ACTS", between Work and the actual Process steps. |
| section-process-steps.png | Three fanned, drop-shadowed "playing cards" (Step 01 Pledge / 02 Turn / 03 Prestige), each rotated a few degrees like a hand of cards; heading in a distinct script/display font unlike the rest of the site; alternating red/blue checklist items at the bottom of each card. |
| section-contact.png | "READY FOR YOUR PRESTIGE MOMENT?" headline with an inline circular photo swapped into the sentence ("FOR [photo] YOUR"), Name/Email/Submit form row. |
| section-footer.png | Bottom of page: contact heading + form + Follow (3 social icons) / Write (email) columns + copyright row, all fitting in one viewport. |

### Full-page screenshot caveat (important)

full-page-desktop/tablet/mobile.png were produced by Playwright's fullPage
capture, which resizes the viewport to the full document height in one shot.
On this site that breaks GSAP ScrollTrigger's pinned sections: the resize
happens after ScrollTrigger has already computed pin start/end offsets
against the original 1080px-tall viewport, so pin-spacers and pinned
elements render at the wrong offsets. The resulting image shows the
hero/about/services sequence appearing twice and the two giant curved-text
sections and the process/contact/footer area compressed or missing. Do not
use the full-page files as a layout reference, use the individual
section-*.png files instead, which were captured as normal (non-resizing)
viewport screenshots after scrolling programmatically to each position and
are visually confirmed correct.

## Section-by-section notes for the cloner

Nav: fixed/sticky header, full-bleed row: logo left, 4-link menu, CTA button
pinned right. Nav recolors per section it overlaps (see Animations).

Hero: single full-viewport (100vh) block. Heading is huge, ~4 lines, sits
over the bottom half of the portrait image. No visible CTA in the hero
itself; CTAs appear only after scrolling into the About block.

About: this is NOT a simple stacked section; hero, trust-badge list, CTA
buttons, stats marquee and a big autoplaying showreel video are all part of
one continuous pinned/scroll-driven sequence roughly 3000px of scroll tall.
Layout when settled: left column ~18% width (4-line eyebrow list, small
caps ~12px), right column ~55% width (bio heading ~32-40px, two paragraphs
separated by a blank line). Below that, two pill buttons (~150x50px) side
by side, then the stats marquee (full-bleed, one line, 5 items separated by
alternating card-suit glyphs, looping horizontally, duplicated item list
back-to-back for a seamless loop), then the showreel video (full-bleed
width, tall, aspect ratio far from 16:9, closer to 1.5:1 landscape but very
tall/cropped-in because it's meant to be scroll-scaled).

Services: dark (near-black) full-bleed section. Eyebrow row "{ WHAT I DO }"
centered, small, letter-spaced. Below it a 5-row accordion, each row a
heading-only line at rest, divided by 1px hairlines full-width. On hover:
the row's heading stays, a description paragraph (max-width ~50% of row)
fades/slides in below it, and a small rectangular thumbnail image
(~350x140px, different per row) slides in pinned to the right edge,
vertically centered on the row. Only one row is expanded at a time
(accordion, not multi-open). Row height clearly grows when expanded (from
~85px collapsed to ~230px expanded), confirms it's a real height animation,
not just an overlay.

Work: 5 full-bleed, full-viewport-tall (~1080px each at 1920 width) cards,
each a different flat background color (yellow, near-black, peach, blue,
olive, no shared palette logic, one strong color per client). Two columns
inside each: left ~45% width holds the client name (large, ~48px) + index
"(0N)" at the far right of the same row, then a description paragraph
(max-width ~40% of card) below with generous gap, then "VISIT WEBSITE" with
an arrow glyph pinned near the bottom of the left column. Right column
~45% width, right-aligned, holds a single image (a silhouetted person
looking at a monitor showing the client site) at roughly 4:3 aspect ratio,
vertically centered. Cards are edge-to-edge with no visible gap/radius
between them (each is its own full section).

Process (curved-text dividers): two nearly-identical decorative sections
(~4300px of scroll each) that both read "{ PROCESS PROCESS }" as a small
eyebrow with a card-suit glyph between the two words, then a huge (~9vw)
headline set on a curved SVG textPath that arcs across the viewport. First
one's headline is "Every trick leaves evidence. Here is what remains." and
sits between Services and Work; second is "Behind the illusion there are
three acts." and sits between Work and the actual process-steps section.
These are almost certainly a pinned scroll-scrub of the curve's
arc/scale, not static, worth animating in the clone as a scroll-scrubbed
arc even though a static screenshot can only show one frame.

Process (steps): light background, 3 white "playing cards" laid out
horizontally, each rotated a few degrees (alternating tilt, like a fanned
hand of cards, thematically ties to the "illusionist" copy), with drop
shadow and rounded corners. Card content: "STEP 0N" eyebrow in orange, step
name in a distinct cursive/script display font (different from the site's
primary sans, worth sourcing a second display face), body paragraph, then a
checklist of short tags at the bottom in small caps, colors alternating
orange/blue per line.

Contact: dark section, "{ LET'S TALK LET'S TALK }" eyebrow with a heart
glyph between the words, then a 2-line headline "READY FOR YOUR / PRESTIGE
MOMENT?" in white with the word "PRESTIGE" gradient-highlighted orange and
a small circular inline photo embedded mid-sentence between "FOR" and
"YOUR". Below: a 3-column form row (Name input / Email input / Submit
button), inputs are dark transparent boxes with placeholder text, Submit is
a white pill with a return-arrow icon.

Footer: embedded in the same dark wrapper as Contact (no visible section
break). Two columns: "Follow" (3 circular icon buttons, Webflow, Instagram,
LinkedIn) and "Write" (large "HEY@NBNZIA.COM" mailto link). Copyright row
below, small, muted gray, left "yevhenii nebenzia, 2026" right "ALL RIGHTS
RESERVED".

## Animations observed

- Lenis smooth scroll site-wide, all scroll is eased/inertial.
- Hero to About cross-fade: as you scroll past the hero, the hero heading
  appears to stay pinned while the About content (trust list + bio heading)
  fades in underneath at rising opacity, captured mid-transition in
  section-hero-to-about-reveal-transition.png.
- Stats marquee: continuous horizontal GSAP loop, item list duplicated
  back-to-back for a seamless wrap; separator glyph cycles through
  card-suit symbols between items, not a single fixed glyph.
- Showreel video: real autoplaying, muted video element (not a canvas/gif),
  with custom controls (play/pause, scrubber, timestamp, fullscreen, mute);
  content shows an edited montage (graphic collage frame, then desk/monitor
  live-action frame) so its "content" changes purely from video playback,
  independent of scroll.
- Services accordion: on row hover, row height animates open (~85px to
  ~230px, clearly eased, likely 0.4-0.6s), description text and a per-row
  thumbnail image both animate in (fade + slight slide from the right for
  the thumbnail). Collapses back when hover moves to another row. Only one
  row open at a time.
- Nav recolor per section: the nav's text/logo/button colors swap
  depending on the background it currently sits above, navy-on-cream over
  the yellow hero, cyan-on-black over the Services section, navy-on-warm
  over the yellow/orange Work cards. This is almost certainly a
  ScrollTrigger-driven class swap or CSS variable flip keyed to section
  boundaries, not a single fixed nav theme.
- Nav link / button label hover: DOM shows every nav link, both CTA
  buttons and the work-card "Visit Website" label duplicated as two
  identical stacked text nodes (e.g. two "About" spans, two "Let's talk"
  spans). This is the classic vertical text-flip hover (old label slides up
  out of a clipped box, identical new label slides up into place), static
  screenshots before/after hover look identical because the two copies are
  identical text, but the effect should be implemented as a clip +
  translateY hover transition, not assumed absent just because the
  screenshots match.
- Curved-text dividers: large SVG textPath headline, arced. Not confirmed
  scroll-scrubbed vs. simple reveal from a single static capture, but the
  section's very tall scroll-height (~4300px for a headline that's only
  ~150px of visual content) strongly implies a pinned scroll-scrub of curve
  rotation/scale/opacity, treat as scroll-scrubbed in the clone.
- Work cards: hovering a card did not show an obvious static-frame change
  (no dramatic scale visible comparing hover vs non-hover captures at the
  same scroll position); likely a subtle brightness/scale tween too small
  to confirm from stills, or the "Visit Website" label-flip only.
- Process step cards: static fan/rotation layout at rest; not confirmed
  whether the tilt animates in on scroll or is a fixed CSS transform, given
  the site's overall GSAP-heavy approach, a staggered rotate-and-fade-in on
  scroll into view is a reasonable assumption for the clone.
- Contact headline: "PRESTIGE" is rendered with an orange gradient/mask
  over otherwise-white type, and a small circular photo sits inline
  mid-text, both likely animate in with the SplitText-driven heading
  reveals used elsewhere on the page (per the site's declared GSAP
  SplitText usage).

## Capture gaps / honesty notes

- Automatic fullPage screenshots are unreliable on this site (GSAP
  ScrollTrigger pin offsets break when Playwright resizes the viewport for
  the stitch), see caveat above. Section-by-section captures should be
  treated as the source of truth for layout.
- Footer social-icon hover state could not be captured: a duplicate
  overlay container (a likely second stacked copy of the footer used for a
  marquee/parallax trick) intercepted pointer events and blocked a stable
  hover on the Instagram icon.
- Nav link/button hover states show no visible static-frame difference,
  documented above as a text-flip animation rather than a color change; if
  there is also a color/underline change it happens too fast/subtly to
  confirm from a still frame.
- Did not capture tablet/mobile section-level or hover-state screenshots
  (only full-page, which itself has the fullPage caveat above), task spec
  only required full-page at those two viewports plus desktop-width section
  captures, so this is expected, not a gap.
