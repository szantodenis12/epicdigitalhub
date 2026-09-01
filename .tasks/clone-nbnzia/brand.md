# Brand palette — emerald

Base accent supplied by the user: **#1FDB93** = `hsl(157, 75%, 49%)`.
Everything below is derived from that hue so the set stays coherent.

| Role | Hex | Derivation | Used for |
|---|---|---|---|
| Accent | `#1FDB93` | given | CTA button, gradient-wave crest, STEP labels, contact spotlight, `--accent` |
| Accent deep | `#21976A` | hsl(157, 64%, 36%) | button hover border, muted accent states |
| Pale mint | `#D2F9EA` | hsl(157, 75%, 90%) | Lumino work card |
| Emerald dark | `#10412F` | hsl(157, 60%, 16%) | mobile off-canvas panel |
| Warm orange | `#DB641F` | complementary partner | JACK3D work card |
| Gold | `#E2B736` | triade partner | Almore work card |

Hero sky gradient (was gold `#fdf3cf -> #caa24f`):
`#E9FCF4 -> #C5F7E4 -> #8BEEC8 -> #52E0AA` (hsl 157 at L 95/87/74/60).
Silhouette darks retuned from warm brown to `#16302A -> #0C1A17`, with
`#0F211D` for the inner shape.

## Unchanged, deliberately
Per the user's instruction, black/white text and backgrounds were left alone:
`#1F1F1F` (body text), `#F5F2F2` / `#F5F2F3` (page bg), `#0F0F0F` (services bg),
`#FFFFFF`, `#F1F1F1`, `#5F5F5F`, and the shadow rgba.

## Contrast audit (WCAG, computed)
| Work card | bg | text | ratio |
|---|---|---|---|
| CTO Bees | `#1FDB93` | `#1F1F1F` | 9.11 pass |
| Manana | `#1F1F1F` | `#F5F2F2` | 14.81 pass |
| Lumino | `#D2F9EA` | `#1F1F1F` | 14.50 pass |
| JACK3D | `#DB641F` | `#1F1F1F` | **4.59 pass** |
| Almore | `#E2B736` | `#1F1F1F` | 8.68 pass |

JACK3D originally kept white text after recolouring, which measured **3.59** and
failed AA for the 14px body copy. Switched to `#1F1F1F` (4.59) rather than
altering the palette colour.

## KNOWN CONSEQUENCE — blend-mode nav over the emerald sky
The nav and hero headline use `mix-blend-mode: difference`. Its output is the
mathematical inverse of whatever is behind it, so changing the sky changes them:

| sky | nav/headline renders as |
|---|---|
| old gold | navy / pale blue-white |
| new mint | **very dark maroon / pale pink** |

Legibility is fine (measured ~12.9:1 over the sky, ~9.5:1 over the silhouette),
but the resulting tones are pink-family — the literal inverse of green — which
reads off-brand against an emerald identity.

Options if that is unwanted:
1. Drop `difference` on the header and set a solid colour (loses the
   per-section chameleon recolouring).
2. Keep `difference` only over the dark silhouette and switch to a solid colour
   over the sky.
3. Warm the sky back toward gold, which is the complementary partner to emerald
   and restores the navy nav.

## CONTRAST WARNING — emerald on white process cards

The process-card checklists render the brand emerald on a WHITE card at 11px.
Measured against `#FFFFFF`:

| colour | ratio | verdict |
|---|---|---|
| `#1FDB93` emerald | **1.81:1** | fails badly (AA needs 4.5) |
| `#21976A` deep emerald | **3.68:1** | still fails for small text |
| `#1049CC` old blue (removed) | 7.38:1 | passed, but off-palette |
| `#1F1F1F` body dark | 16.48:1 | passes |

The alternating second colour used to be `#1049CC` — the old JACK3D blue left
over from the clone, not part of the Epic palette. It has been replaced with
`#21976A` so the alternation stays on-brand, but BOTH emeralds are low-contrast
at this size on white and the accessibility problem is unresolved.

Options, in order of preference:
1. Set the items to `#1F1F1F` (16.48:1) and keep emerald for the STEP label
   only — the accent still reads, the copy becomes legible.
2. Darken the second tone well past `#21976A` — around `hsl(157, 64%, 24%)`
   reaches ~4.5:1.
3. Accept it as decorative. Only defensible if the checklist is not load-bearing
   information, which here it is.

Not changed unilaterally: it alters the section's look, so it is the user's call.

## Header logo

The text wordmark was replaced with the mark from `edh-logo.svg`, inlined as
SVG with `fill="currentColor"`.

**Inlined, not `<img>`, on purpose.** The header carries
`mix-blend-mode: difference`. An `<img>` or a `background-image` would blend as
an opaque rectangle; inline SVG inheriting `currentColor` blends as a
silhouette, exactly like the text it replaced. Verified inverting correctly:
white over the dark hero, near-black over the cream About panel.

### Only the mark was used — two reasons

1. **The supplied SVG uses live `<text>`, not outlined paths.** Its wordmark is
   `font-family="Unbounded"` and its tagline `font-family="Space Grotesk"`.
   Neither font is loaded in this project, so both fell back to a **serif** —
   rendered and confirmed visually. The mark is paths and renders correctly.
2. **The tagline cannot work at header scale anyway.** "CREATIVE STUDIO" is
   `font-size="33.5"` in a 300-unit-tall viewBox; at a 24px header logo that is
   **~2.7px tall**. Illegible regardless of which font loads.

The wordmark is therefore set as HTML text in the site's own BDO Grotesk, which
also keeps it selectable, translatable and crisp at any zoom. `aria-label` on
the link carries the accessible name; the SVG is `aria-hidden`. The wordmark is
`hidden sm:inline` so narrow phones show the mark alone.

### To use the exact lockup instead
Either supply a version with the text converted to outlines (the normal way to
ship a logo), or add Unbounded + Space Grotesk to the project — two extra font
families loaded for one element, and the tagline would still be too small to
read in the header.

## Logo (2026-09-01)

The supplied `edh-logo.svg` carried the wordmark as a live `<text>` in Unbounded
400 and the tagline in Space Grotesk 500. An SVG only *names* a font, it does not
embed it — so the file rendered correctly on the machine that made it (both
fonts installed) and fell back to a serif everywhere else. Confirmed by
rendering it in a browser without the fonts available.

Fix: the text was converted to outlines from the same TTFs
(`%LOCALAPPDATA%/Microsoft/Windows/Fonts/Unbounded-Regular.ttf`,
`SpaceGrotesk-Medium.ttf`) and verified side by side against a font-rendered
reference — letterforms and tracking match, widths within ~1%.

- `public/brand/edh-logo.svg` — outlined master, full lockup. Safe anywhere.
- `public/brand/edh-logo-editable.svg` — the original with live text. Keep this
  as the editable source; outlining is one-way.

The header inlines the whole lockup as paths, tagline included, at h-9 /
md:h-11 (36px / 44px tall, 234px / 286px wide). The crop is set by the divider
rule (y 45..255), which is taller than both the mark (70..230) and the tagline
(202..226) - so including the tagline costs no extra height, it was simply
omitted at first. `fill="currentColor"` is load-bearing — it is what lets the header's `mix-blend-mode: difference` treat
the logo as a silhouette. An `<img>` or `background-image` would blend as an
opaque rectangle and kill the negative-space effect.

Sizing note: the tagline is 33.5 units in a 210-unit crop, so it lands at
about 7px at desktop size and 6px on mobile. That is small but legible, and it
is the proportion the brand lockup itself specifies - do not scale the tagline
independently to "fix" it, that breaks the lockup.

Still open: the mark's paths were traced by hand from the source SVG's own
geometry, so they are exact; if the brand ever revises the mark, re-trace rather
than edit the inlined `d` attributes.

### Header centring

Enlarging the logo broke the nav's centring, because `justify-between` only
puts a middle child on centre when the two outer children are the same width.
With a 286px logo and a 172px Apply/menu block the links sat (286-172)/2 = 57px
right of centre — it was always slightly off, the bigger logo just made it
obvious.

Fix: the `<ul>` is taken out of the flex flow and pinned with
`absolute left-1/2 -translate-x-1/2` on a `relative` nav. Centring is now
independent of what sits either side of it. Verified at 0.0px offset.

The nav links + Apply also moved from `md` to `lg`. At 768-1023 the three
blocks need 773px of content in 689px of available width, so they collided.
The hamburger (and its overlay) now covers that range too. Do not move it back
to `md` without shrinking the logo below ~194px wide.

Measuring note: compare against `document.documentElement.clientWidth`, not
`window.innerWidth` — the latter includes the scrollbar and reports a phantom
~7px offset on a centred element.

### Marquee separators (2026-09-01)

Replaced the source's clover/club ornament with the play device from EDH's own
E-D-H mark (`LogoGlyph` in logo.tsx, path index 6, cropped to its ink at
viewBox "634 77 106 130").

Only the simplest element of the mark is used: the full lockup, or even the
E-D-H device, turns to mush at a 12px separator.

While doing it: `HeartGlyph` and `SeparatorGlyph` were byte-identical - same
path data, two components - so `EyebrowMarquee`'s `glyph="heart" | "separator"`
prop selected between two things that rendered the same pixels. Both components
and the prop are gone.

Sized `h-3 w-auto` (eyebrow) / `h-3.5 w-auto` (stats) rather than a square
`h-3.5 w-3.5`: the glyph is taller than it is wide (106x130), so a square box
letterboxed it.

Kept on `currentColor` deliberately - it inherits black on the cream strips and
white on the #0F0F0F ones, and stays consistent with the marquee text. Emerald
was considered and rejected: #1FDB93 on #F5F2F2 is 1.81:1, which looks washed
out at 12px even though contrast rules do not bind decorative marks.
