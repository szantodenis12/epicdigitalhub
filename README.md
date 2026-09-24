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
  site.tsx        the home page — one client component, sections divided by banner comments
  content.ts      home copy, EN + RO. `const ro: typeof en` makes a missing key a compile error;
                  also `localePath()`, the one place a URL gets its locale prefix
  routes.ts       every subpage's locale-independent path (no copy — the home page imports it)
  route-params.ts the slugs each dynamic route accepts, read from the copy (server-only)
  logo.tsx        logo geometry (outlined paths), shared by the header and the intro
  shell.tsx       fonts, metadata (`buildMetadata`), JSON-LD, the pre-paint intro gate
  _components/    shared by the home page and every subpage:
    chrome.tsx      header + mobile menu, Lenis, contact/footer, `PageFrame` for subpages
    ui.tsx          TrickButton, LocaleToggle, EyebrowMarquee, Parallax, NavLink
    page-kit.tsx    subpage layout blocks (hero, text section, list row) in the home's type
    context.tsx     copy/locale/path context, reduced-motion hook
  _content/       subpage copy, EN + RO: services, case-studies, articles
  _pages/         subpage components, one per page type, shared by both locales
  (en)/           English root layout + pages      -> /, /services, /case-studies, /articles
  (ro)/           Romanian root layout; pages in ro/ -> /ro, /ro/services, ...
  globals.css     Tailwind v4 theme, intro reveal, marquee keyframes, button hover
  robots.ts       includes 9 AI crawlers alongside the standard rules
  sitemap.ts      every page in both locales, with hreflang alternates
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
animation code — a lot of the numbers in `site.tsx` are measured, not chosen.

## Languages

English is the default and lives at `/`; Romanian at `/ro`. The header carries an
EN / RO toggle (in the menu on mobile, where the logo lockup leaves no room).

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

## Forms and deployment (Vercel)

Three forms post to route handlers in `src/app/api/`:

| Form | Route | What happens |
|---|---|---|
| `/apply` | `api/apply` | niche checked against the taken list, stored, emailed |
| `/audit` | `api/audit` | site crawled, report streamed by Claude (`claude-sonnet-5`), lead stored + emailed |
| footer "Let's talk" | `api/contact` | stored, emailed |

Storage is Upstash Redis and notifications go through Resend (`src/app/_server/`).
Setup, once:

1. Vercel → Marketplace → **Upstash Redis** → connect to this project. It adds
   the `UPSTASH_REDIS_REST_*` (or `KV_REST_API_*`) variables.
2. Resend: create an API key, verify `epicdigitalhub.ro` as a sending domain,
   then set `RESEND_API_KEY`, `LEADS_EMAIL_TO`, `LEADS_EMAIL_FROM`.
3. Set `ANTHROPIC_API_KEY` (from Roland). Without it `/audit` answers
   "generation is paused" instead of failing.

All variables are listed in `.env.local.example`. Locally, with no Redis
variables, submissions land in `./data/*.json` (gitignored).

In Redis: `applications`, `audit-leads`, `contact-leads` are lists of JSON
records, newest first. `taken-niches` is optional — a JSON array of
`{ city, niche, client }` that overrides the seed in
`src/app/_server/taken-niches.json`, so the list can change without a deploy.

`api/audit` sets `maxDuration = 300` (a report takes 60–120 s). Check that the
Vercel plan allows functions that long; if it does not, lower it and the report
may cut off (the page then says the report is partial).

## Licensing

**BDO Grotesk (`public/fonts/`) is commercially licensed and no licence has
been purchased for this project yet.** It is fine for local development; a
licence is required before the site goes to production. Swapping it out is a
five-line change in `layout.tsx`.

Layout and motion patterns were developed by studying
[nbnzia.com](https://www.nbnzia.com) as a front-end exercise. All content,
brand colour, imagery and identity are Epic Digital Hub's own.
