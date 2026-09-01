# Review notes — clone of nbnzia.com

Verified by build + lint + rendered-DOM inspection. **No visual diff was run** —
Playwright MCP is not configured in this session and the four `website-*`
sub-agents the skill expects are not registered, so the screenshot/QA loop
described in the skill did not execute. Findings below come from reading the
source CSS/DOM against the clone, not from pixel comparison.

## Verified
- `npm run build` — compiles, TypeScript clean, static prerender OK
- `npx eslint src --max-warnings=0` — clean
- Dev server returns HTTP 200; all nine sections present in rendered HTML
- Design tokens (colors, type scale, radii, spacing) taken from the source's
  own Webflow CSS custom properties, not eyeballed

## Known deltas from the source

### Intentional (identity)
| Item | Source | Clone |
|---|---|---|
| Wordmark | SVG logo | `Sparkle` glyph + "Prestige" |
| Portrait | photograph | gradient placeholder |
| Case studies | 5 real clients + their copy | 5 generic projects |
| Case screenshots | real site captures | gradient placeholders |
| Email | two real addresses | `hello@example.com` |
| Socials | real profile links | inert `#top` links |
| Copyright | real name | "Your Studio" |

### Technical
1. **Font** — RESOLVED. The real *BDO Grotesk* woff2 files were recovered from
   the Webflow CDN (5 weights) and are wired up via `next/font/local`.
   Note: BDO Grotesk is commercially licensed — fine locally, needs a licence
   to ship.
2. **Heading reveals** — source uses GSAP **SplitText** for per-character/line
   staggering. Clone uses `motion` line-masking (`overflow-hidden` + `y: 110%`).
   Visually similar at line level; not per-character.
3. **Services accordion** — source's `mwg035` component expands row height on
   hover and animates the media with GSAP. Clone changes heading color and
   shows a cursor-tracked preview; rows do not change height.
4. **Marquee** — source runs a GSAP horizontal loop with velocity-linked
   direction on scroll. Clone uses a CSS keyframe loop at constant speed.
5. **Process section** — source draws the section label on an SVG `textPath`
   curve (`.mwg032`, `font-size: 9vw`). Clone uses a straight heading.
6. **Cursor preview position** — updates from React state on `mousemove`.
   Fine in practice, but the source's GSAP `quickTo` easing is smoother; swap
   to a `useMotionValue` + `useSpring` pair if you want that trailing feel.
7. **Contact form** — inert (`preventDefault`). Source posts to a Webflow form
   handler and swaps in a success message.
8. **Emoji/3D decorative assets** — source scatters 3D emoji PNGs; omitted.

## Suggested next steps
- Drop real imagery into `/public` and replace `<Placeholder />` with
  `next/image`.
- If you want per-character heading reveals, add `gsap` + `SplitText` (SplitText
  is free as of GSAP 3.13) rather than approximating with `motion`.
- Wire the contact form to a route handler or a form service.
