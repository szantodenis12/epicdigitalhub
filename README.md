# Epic Digital Hub

Marketing site for Epic Digital Hub, a strategy and brand systems studio in
Oradea, Romania. One brand per niche, per city.

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 ·
GSAP · Lenis · motion

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build && npm start   # production build
npx tsc --noEmit             # typecheck
npx eslint src               # lint
```

Animation timings are noticeably tighter in a production build — the dev server
adds hydration cost ahead of the intro. Judge pacing against `npm run build`.

## Layout

```
src/app/
  site.tsx        the entire site — one client component, sections divided by banner comments
  content.ts      all copy, EN + RO. `const ro: typeof en` makes a missing key a compile error
  logo.tsx        logo geometry (outlined paths), shared by the header and the intro
  shell.tsx       fonts, metadata, JSON-LD, the pre-paint intro gate — shared by both locales
  (ro)/           Romanian root layout + page      -> /
  (en)/           English root layout + page       -> /en
  globals.css     Tailwind v4 theme, intro reveal, marquee keyframes
  robots.ts       includes 9 AI crawlers alongside the standard rules
  sitemap.ts      both locales, with hreflang alternates
public/
  brand/          edh-logo.svg (outlined master) + edh-logo-editable.svg (live text)
  fonts/          BDO Grotesk — see Licensing
  llms.txt
.tasks/clone-nbnzia/
  context.md, brand.md, content-mapping.md, seo-geo.md,
  review-notes.md, loader-research.md
```

`.tasks/` is the working record: measured values, what was tried, and why
several obvious-looking approaches were wrong. Read it before changing
animation code — a lot of the numbers in `page.tsx` are measured, not chosen.

## Languages

Romanian is the default and lives at `/`; English at `/en`. The header carries a
RO / EN toggle (in the menu on mobile, where the logo lockup leaves no room).

Copy is in `content.ts` — nothing user-visible is hardcoded in `site.tsx`. Each
locale is a route group with its own root layout, because `<html lang>` must be
correct in the server-rendered markup and one shared layout cannot vary it.
There is deliberately no `src/app/layout.tsx`: Next.js allows only one root
layout, unless each route group brings its own.

## Intro preloader

Plays once per session, ~2.2s. Two query params for reviewing it:

| URL | effect |
|-----|--------|
| `/?intro=1` | replay on every load |
| `/?intro=0` | skip it |

Neither overrides `prefers-reduced-motion`. The decision is made before first
paint by an inline script in `layout.tsx`, so the overlay never flashes on a
repeat visit and can never trap the page if JS fails.

Teardown of the reference implementation and the three bugs found building it:
`.tasks/clone-nbnzia/loader-research.md`.

## Licensing

**BDO Grotesk (`public/fonts/`) is commercially licensed and no licence has
been purchased for this project yet.** It is fine for local development; a
licence is required before the site goes to production. Swapping it out is a
five-line change in `layout.tsx`.

Layout and motion patterns were developed by studying
[nbnzia.com](https://www.nbnzia.com) as a front-end exercise. All content,
brand colour, imagery and identity are Epic Digital Hub's own.
