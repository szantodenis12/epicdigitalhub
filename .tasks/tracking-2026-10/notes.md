# Tracking, consent and the legal pages (13 Oct 2026)

Source: `PACHET_TRACKING_2026-10`, the handoff of 12.10.2026 — point 04 of the
optimisation document. Container `GTM-TPN89TBF`, already configured on Epic's
side with GA4 (`G-GZLFNZCQ32`) and the Meta Pixel (`1791988975263032`) as tags
inside it.

## The shape of it

Only three things went into the code, which is the whole point of the handoff:
the container, the consent state, and the lead events. GA4 and the Pixel are
tags in GTM, so what is measured can change without a deploy. Verified that
neither `gtag/js?id=G-`, nor `fbq`, nor `connect.facebook.net` appears anywhere
in `src/`.

| Piece | Where |
|---|---|
| dataLayer + consent helpers | `src/app/analytics.ts` |
| Consent Mode v2 default | `src/app/_components/consent.tsx` (server, inline script) |
| The banner | `src/app/_components/cookie-banner.tsx` (client) |
| Container | `shell.tsx`, `<GoogleTagManager gtmId="GTM-TPN89TBF" />` |
| Legal band | `src/app/_components/footer-legal.tsx`, at the foot of `ContactFooter` |
| Six legal pages | `_pages/legal.tsx` + `_content/legal/*.md` + six route files |

## Things that had to be got right, with the measurement

**The consent default must run before the container.** It is an inline
synchronous script, last in `<head>`. A tag that fires before any default is
set reads "no signal", which Google treats as permission rather than refusal.
Measured in the live HTML: `id="consent-default"` appears once, inside
`<head>`, and the first `GTM-TPN89TBF` reference above it is a
`<link rel="preload">` — a fetch, not an execution. `@next/third-parties` runs
the container with `afterInteractive`, so gtm.js executes after hydration,
long after the default is in place. The dataLayer confirms it: the first
consent entry is `default` with all four signals `denied` and
`wait_for_update: 500`.

**Accept and decline are the same button.** The handoff's one styling rule.
They are rendered from one array with one class string, so they cannot drift
apart; a test asserts `buttons[0].className === buttons[1].className`.

**The banner waits for the preloader.** A first visit to the home page runs the
intro behind `intro-lock` on `<html>`; a consent dialog sliding over it would
spoil the one thing the hero is for. The banner observes `<html>` for
`intro-done` and only then appears.

**Lead events fire on the server's answer, not on the click.** Measured, in
order:

- `/apply` — after the response, on BOTH answers. A visitor whose niche is
  already taken still applied, and the waiting list is what the report
  measures. Carries `niche` and `budget`.
- `/audit` — at the point the stream starts, not at `done`. Someone who closes
  the tab half way through still submitted; counting at `done` would undercount
  by however many do that.
- the footer enquiry — after `res.ok`.

No personal data goes into the dataLayer. Observed event, live:
`{event: "lead_submit", form_name: "enquiry", page_language: "ro", event_id: "e9b80b39-…"}`.

## A bug worth recording

The legal links first shipped as `/confidentialitate`, `/cookies`, `/termeni` —
all 404. `LEGAL_PATHS` holds the locale-INDEPENDENT slug, exactly like every
other route in this site, and the `/ro` prefix is added by `localePath` at the
point of use. The banner and the footer band were using the bare value. Caught
by reading the rendered `href`s rather than the code.

## Localised slugs, a first for this site

`privacy`/`confidentialitate` and `terms`/`termeni` are the only routes whose
slug differs per locale — a legal page is looked for by its Romanian name.
`content.ts` said as much in a comment ("if they are ever localised, this is
the one place"), so:

- `routes.ts` gained `LEGAL_PATHS`, `legalPath()` and `LegalKey`;
- `buildMetadata` gained an optional `paths: Record<Locale, string>`, because
  alternates built from a single `path` would point the hreflang pair at a URL
  that does not exist;
- `sitemap.ts` builds the legal group from `LEGAL_PATHS` separately, since the
  shared-path code cannot express it.

Verified in the sitemap: 66 URLs, the six legal pages at priority 0.3, each
with a complete `en` / `ro` / `x-default` group pointing at the right slugs.

## The legal texts are the markdown, rendered

The six documents are copied unchanged into `_content/legal/` and rendered with
`react-markdown` + `remark-gfm`. Nothing was retyped into a data structure,
because the handoff requires the texts integrally and a transcription of 850
lines of legal copy is a transcription with mistakes in it. Heading counts were
checked per page against the source (`##`: 14/14, 8/8, 13/13 per document) and
the last paragraph of each is present.

They are read with `fs.readFileSync` in a server component, which works because
every page here is statically generated — the read happens during `next build`.
**It would break if a legal page were ever made dynamic.** The build confirms
all six prerender: `○ /privacy`, `/cookies`, `/terms`, `/ro/confidentialitate`,
`/ro/cookies`, `/ro/termeni`, 76 static pages, exit 0.

Tables scroll inside their own box, not the page: measured at 390px, every
table's wrapper overflows while `document.scrollWidth === 390`.

The ANPC SAL pictogram is the official file, saved to `public/legal/anpc-sal.png`
rather than hotlinked, at its native 201x50, served `unoptimized` so it is not
re-encoded or recoloured. anpc.ro answers 403 to a plain `curl`; it needs a
browser user agent. The SOL pictogram is deliberately absent — that platform
closed and ANPC dropped it in 2026.

## Open, and blocking publication

**`[DE CONFIRMAT]` is filled in** (13 Oct). The handoff asked us to name the
service that receives or stores form submissions so Epic could write the
wording; the answer came out of the code, and rather than publish a page with a
visible placeholder in a table, the row became two rows naming the services and
their role:

| Upstash (SUA) — baza de date Redis, regiunea Frankfurt | stocarea solicitărilor trimise prin formulare | datele din formulare |
| Resend (SUA) | trimiterea notificărilor prin email la primirea unei solicitări | datele din formulare |

Deliberately NOT written: the companies' exact legal entity names and the
transfer basis. Those belong in whoever signs the policy, from each provider's
DPA, and guessing "X, Inc." in a legal document is not a thing to do. The
facts behind the rows:

- **Upstash Redis** — `@upstash/redis` in `_server/store.ts`, via
  `UPSTASH_REDIS_REST_URL` / `KV_REST_API_URL`. Every submission is stored
  there.
- **Resend** — `_server/notify.ts` posts to `api.resend.com` with
  `RESEND_API_KEY`, sending the notification to `LEADS_EMAIL_TO`.
- Hosting is **Vercel**.

**Vercel Analytics is still installed.** Section 6 of the handoff says not to
run it alongside GA4, to avoid measuring twice. It was added on 9 Oct at
Denis's explicit request, so it has not been removed on a document's word
alone — his call, and a one-line removal in `shell.tsx` whenever he says.
