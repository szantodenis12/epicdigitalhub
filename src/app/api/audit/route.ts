// Free audit endpoint. POST { name, email, url, locale }.
// Crawls the target site's public pages server-side, then streams a
// Claude-written audit report back as plain text.
//
// From the handoff package, ported to Vercel: the per-IP throttle and the
// lead store moved from process memory and a JSON file to Redis
// (_server/store.ts), and each lead is also emailed. The crawl, the SSRF
// guard, the prompts and the stream are unchanged.

import { after, type NextRequest } from "next/server";
import { lookup } from "dns/promises";
import Anthropic from "@anthropic-ai/sdk";
import { isRateLimited, saveRecord } from "../../_server/store";
import { notify } from "../../_server/notify";

// Generation takes 60-120s; Vercel's function limit must allow it (see the
// deployment notes in README.md).
export const maxDuration = 300;

// ---------------------------------------------------------------------------
// URL validation. Public http(s) hosts only — reject localhost, private and
// link-local ranges (both as IP literals and after DNS resolution).
// ---------------------------------------------------------------------------

function isPrivateIp(addr: string): boolean {
  const ip = addr.startsWith("::ffff:") ? addr.slice(7) : addr;
  if (ip.includes(":")) {
    const low = ip.toLowerCase();
    return (
      low === "::1" ||
      low === "::" ||
      low.startsWith("fc") ||
      low.startsWith("fd") ||
      low.startsWith("fe80")
    );
  }
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return true;
  const [a, b] = parts;
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168)
  );
}

async function assertPublicHost(u: URL): Promise<void> {
  if (u.protocol !== "http:" && u.protocol !== "https:") throw new Error("scheme");
  const host = u.hostname.toLowerCase();
  if (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host.endsWith(".internal") ||
    !host.includes(".")
  ) {
    throw new Error("private-host");
  }
  if (/^[\d.]+$/.test(host) || host.includes(":")) {
    if (isPrivateIp(host)) throw new Error("private-host");
    return;
  }
  const addrs = await lookup(host, { all: true });
  if (addrs.length === 0 || addrs.some((a) => isPrivateIp(a.address))) {
    throw new Error("private-host");
  }
}

function normalizeUrl(raw: string): URL | null {
  let value = raw.trim();
  if (!value) return null;
  if (!/^https?:\/\//i.test(value)) value = `https://${value}`;
  try {
    const u = new URL(value);
    u.hash = "";
    return u;
  } catch {
    return null;
  }
}

// Fetch with a timeout, following redirects manually so every hop is
// re-validated against private hosts.
async function fetchPage(startUrl: URL, timeoutMs: number): Promise<{ finalUrl: URL; html: string } | null> {
  let current = startUrl;
  for (let hop = 0; hop < 5; hop++) {
    await assertPublicHost(current);
    const res = await fetch(current, {
      redirect: "manual",
      signal: AbortSignal.timeout(timeoutMs),
      headers: {
        "User-Agent": "EpicDigitalHubAuditBot/1.0 (+https://epicdigitalhub.ro)",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "ro,en;q=0.8",
      },
    });
    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get("location");
      if (!location) return null;
      current = new URL(location, current);
      continue;
    }
    if (!res.ok) return null;
    const type = res.headers.get("content-type") ?? "";
    if (type && !type.includes("html") && !type.includes("text")) return null;
    const html = await res.text();
    return { finalUrl: current, html: html.slice(0, 800_000) };
  }
  return null;
}

// ---------------------------------------------------------------------------
// HTML extraction — no dependencies, regex based, good enough for an audit
// read of title / meta / headings / visible text / links.
// ---------------------------------------------------------------------------

function decodeEntities(text: string): string {
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/&ndash;/gi, "–")
    .replace(/&mdash;/gi, "—")
    .replace(/&hellip;/gi, "…")
    .replace(/&(rsquo|lsquo);/gi, "'")
    .replace(/&(rdquo|ldquo);/gi, '"')
    .replace(/&(copy|reg|trade|shy|zwnj|zwj);/gi, "")
    .replace(/&#(\d+);/g, (_, n) => {
      const code = Number(n);
      return code > 0 && code < 1_114_112 ? String.fromCodePoint(code) : "";
    })
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => {
      const code = parseInt(n, 16);
      return code > 0 && code < 1_114_112 ? String.fromCodePoint(code) : "";
    });
}

function stripTags(html: string): string {
  return decodeEntities(
    html
      .replace(/<\/(p|div|li|h[1-6]|tr|section|article|header|footer)>/gi, "\n")
      .replace(/<br[^>]*>/gi, "\n")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/[ \t]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

type PageRead = {
  url: string;
  title: string;
  metaDescription: string | null;
  hasViewport: boolean;
  hasForm: boolean;
  phone: string | null;
  h1: string[];
  h2: string[];
  text: string;
  links: { href: string; label: string }[];
};

function extractPage(url: string, rawHtml: string): PageRead {
  const cleaned = rawHtml
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style|noscript|svg|template|iframe)[\s\S]*?<\/\1>/gi, "");

  const titleMatch = cleaned.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const metaMatch =
    cleaned.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i) ??
    cleaned.match(/<meta[^>]+content=["']([^"']*)["'][^>]*name=["']description["']/i);

  const grabHeadings = (tag: "h1" | "h2"): string[] => {
    const out: string[] = [];
    const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "gi");
    let m: RegExpExecArray | null;
    while ((m = re.exec(cleaned)) && out.length < 12) {
      const text = stripTags(m[1]).replace(/\n/g, " ").trim();
      if (text) out.push(text.slice(0, 200));
    }
    return out;
  };

  const links: { href: string; label: string }[] = [];
  const linkRe = /<a\s[^>]*href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let lm: RegExpExecArray | null;
  while ((lm = linkRe.exec(cleaned)) && links.length < 200) {
    const label = stripTags(lm[2]).replace(/\n/g, " ").trim().slice(0, 80);
    links.push({ href: lm[1], label });
  }

  const text = stripTags(cleaned.replace(/<head[\s\S]*?<\/head>/i, ""));
  const phoneMatch = text.match(/(\+?4?0|0)[\s.]?[237]\d{2}[\s.\-]?\d{3}[\s.\-]?\d{3}/);

  return {
    url,
    title: titleMatch ? stripTags(titleMatch[1]).replace(/\n/g, " ").trim() : "",
    metaDescription: metaMatch ? decodeEntities(metaMatch[1]).trim() || null : null,
    hasViewport: /<meta[^>]+name=["']viewport["']/i.test(cleaned),
    hasForm: /<form[\s>]/i.test(cleaned),
    phone: phoneMatch ? phoneMatch[0].trim() : null,
    h1: grabHeadings("h1"),
    h2: grabHeadings("h2"),
    text,
    links,
  };
}

// Pick up to `count` same-origin internal pages that look like contact /
// services / product pages, from the homepage's links.
function pickInternalPages(home: PageRead, origin: URL, count: number): URL[] {
  const interesting =
    /contact|servici|service|produs|product|shop|magazin|ofert|pret|price|despre|about|meniu|menu|rezerv|book|programar/i;
  const picked: URL[] = [];
  const seen = new Set<string>([origin.href]);
  for (const link of home.links) {
    if (picked.length >= count) break;
    let target: URL;
    try {
      target = new URL(link.href, origin);
    } catch {
      continue;
    }
    target.hash = "";
    if (target.origin !== origin.origin) continue;
    if (seen.has(target.href)) continue;
    if (/\.(pdf|jpg|jpeg|png|webp|gif|zip|mp4|xml)$/i.test(target.pathname)) continue;
    if (!interesting.test(`${target.pathname} ${link.label}`)) continue;
    seen.add(target.href);
    picked.push(target);
  }
  return picked;
}

// ---------------------------------------------------------------------------
// Lead storage: Redis + email, after the response has started streaming so
// neither delays the report. Best effort - never fails the request.
// ---------------------------------------------------------------------------

async function saveLead(lead: { name: string; email: string; url: string; locale: string }) {
  await saveRecord("audit-leads", lead);
  await notify(
    `Audit: ${lead.url}`,
    [
      ["Nume", lead.name],
      ["Email", lead.email],
      ["Site", lead.url],
    ],
    lead.email,
  );
}

// ---------------------------------------------------------------------------
// Prompts. The output follows a strict section grammar the client parses:
//   "# " document title, "SITE:" / "DATA:" meta lines, "## " sections,
//   "### NN | TAG | Title" findings, "Miza:" / "Ce facem:" lines.
// ---------------------------------------------------------------------------

function systemPrompt(locale: string): string {
  if (locale === "ro") {
    return `Ești analistul care scrie audituri de prezență online la Epic Digital Hub, o agenție de marketing din Oradea. Scrii un dosar de lucru sec pentru un potențial client care tocmai și-a introdus site-ul. Scrii în română, cu diacritice corecte (ș și ț cu virgulă dedesubt, nu cu sedilă), la persoana a doua singular (tu).

REGULI DE ADEVĂR, cele mai importante:
- Folosești DOAR ce e în textul primit, extras automat din paginile publice ale site-ului. Nimic din altă parte.
- Nu inventezi cifre de trafic, prețuri, specificații, date de firmă, vechime. Niciodată.
- Fiecare constatare arată proba: citează cu ghilimele „" ce scrie efectiv pagina, sau numește exact ce lipsește.
- Ce nu se poate verifica din textul primit nu se afirmă. Spui „pagina nu arată..." în loc să presupui.
- Nu evaluezi ce nu ai văzut: viteză de încărcare, poziții în Google, campanii active, alte pagini.

FORMAT. Respectă-l exact, e citit de o mașină, rând cu rând:
# Audit de prezență online
SITE: (domeniul)
DATA: (data primită, format ZZ.LL.AAAA)

## Metoda
2-3 propoziții: ce pagini au fost citite, când, și limitele: doar pagini publice, citire automată a textului, fără date de trafic sau de campanii.

Apoi exact aceste 4 secțiuni, în ordinea asta:
## Ce vede un om nou în primele secunde
## Drumul până la contact sau comandă
## Încredere
## Ce vede Google

În fiecare secțiune, 2-3 constatări. Numerotarea e continuă pe tot dosarul: 01, 02, 03... Fiecare constatare are exact forma:
### 01 | CRITIC | Titlu scurt și sec
2-4 propoziții cu proba, pe un singur paragraf.
Miza: o singură propoziție, ce pierde afacerea concret.
Ce facem: o singură propoziție, prima mișcare concretă.
Tag-ul e unul din: CRITIC, IMPORTANT, DE OPTIMIZAT.

## Ce facem, în ordine
1. prima mișcare, o propoziție sau două
2. a doua
3. a treia

## Notă
O propoziție: raportul e generat automat de sistemul Epic Digital Hub, pe baza paginilor publice, și e citit de un strateg înainte de orice discuție.

CE NU FACI NICIODATĂ, ca formă:
- Fără scor, fără notă din 100, fără procente de evaluare, fără „nota site-ului".
- Fără verdict în titlu: titlul documentului e fix cel de mai sus.
- Fără tabele, fără emoji, fără bold cu asteriscuri (niciun ** în text), fără alte marcaje decât cele din format.
- Fără linie de pauză — sau – nicăieri: folosește punct, virgulă sau două puncte.

VOCEA, obligatoriu:
- Ton sec, de dosar de lucru. Fapte de pe ecran, nu limbaj de marketing.
- Interzise construcțiile de liniștire cu „fără X": „fără bătăi de cap", „fără griji", „fără efort", „fără compromisuri".
- Interzis tiparul „nu doar X, ci Y" și „mai mult decât un X".
- Interzise cuvintele: experiență, atmosferă, univers, călătorie, poveste, autentic, memorabil, unic, premium, inovator, imersiv, vibrant, captivant, spectaculos, revoluționar, „valoare adăugată", „la următorul nivel", „soluții personalizate", „partener de încredere", „rezultate remarcabile".
- Interzise verbele de agenție: a transforma, a redefini, a reimagina, a valorifica, a eficientiza.
- Interzise titlurile motivaționale de tip „Cifrele vorbesc" sau „Primul pas spre succes".
- Interzise tiparele „unde X întâlnește Y" și „de la idee la execuție".
- Nu folosești cuvântul „ads": spui „campanii".
- Nu recomanzi generic „SEO" sau „rebranding": numești exact ce se schimbă pe ce pagină.
- Propoziții scurte. Substantive concrete. Ce scrie pe ecran, ce lipsește, ce facem.`;
  }

  return `You are the analyst who writes online presence audits at Epic Digital Hub, a marketing agency in Oradea, Romania. You write a dry working dossier for a prospect who just entered their website. Write in English, second person.

TRUTH RULES, the most important ones:
- Use ONLY the text provided below, extracted automatically from the site's public pages. Nothing else.
- Never invent traffic numbers, prices, specs, company facts or history.
- Every finding shows its evidence: quote what the page actually says, or name exactly what is missing.
- What cannot be verified from the provided text is not stated. Say "the page does not show..." instead of guessing.
- Do not judge what you have not seen: load speed, Google rankings, running campaigns, other pages.

FORMAT. Follow it exactly, it is parsed by a machine, line by line:
# Online presence audit
SITE: (the domain)
DATA: (the date provided, DD.MM.YYYY)

## The method
2-3 sentences: which pages were read, when, and the limits: public pages only, automated text read, no traffic or campaign data.

Then exactly these 4 sections, in this order:
## What a new visitor sees in the first seconds
## The path to contact or purchase
## Trust
## What Google sees

In each section, 2-3 findings. Numbering runs across the whole dossier: 01, 02, 03... Each finding has exactly this shape:
### 01 | CRITICAL | Short dry title
2-4 sentences of evidence, one paragraph.
Miza: one sentence, what the business concretely loses.
Ce facem: one sentence, the first concrete move.
The tag is one of: CRITICAL, IMPORTANT, TO IMPROVE.
Keep the literal markers "Miza:" and "Ce facem:" even in English output, they are parsed.

## What we do, in order
1. first move, one or two sentences
2. second
3. third

## Note
One sentence: this report is generated automatically by Epic Digital Hub's system from public pages, and a strategist reads it before any conversation.

NEVER, as form:
- No score, no grade out of 100, no percentages, no site rating.
- No verdict in the title: the document title is fixed above.
- No tables, no emoji, no asterisk bold (no ** anywhere), no markup beyond the format above.
- Banned words and shapes: delve, tapestry, landscape, robust, seamless, leverage, elevate, unlock, unforgettable, game-changing, "not just X, it's Y", "where X meets Y", "take it to the next level".
- Short sentences. Concrete nouns. What is on screen, what is missing, what we do.`;
}

function formatDate(): string {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.${now.getFullYear()}`;
}

function pageDossier(page: PageRead, textCap: number, locale: string): string {
  const missing = locale === "ro" ? "(lipsă)" : "(missing)";
  const yes = locale === "ro" ? "da" : "yes";
  const no = locale === "ro" ? "nu" : "no";
  return [
    `--- PAGE: ${page.url} ---`,
    `TITLE: ${page.title || missing}`,
    `META DESCRIPTION: ${page.metaDescription ?? missing}`,
    `META VIEWPORT: ${page.hasViewport ? yes : no}`,
    `FORM IN CODE: ${page.hasForm ? yes : no}`,
    `PHONE FOUND IN TEXT: ${page.phone ?? missing}`,
    `H1: ${page.h1.join(" | ") || missing}`,
    `H2: ${page.h2.join(" | ") || missing}`,
    `VISIBLE TEXT (truncated):`,
    page.text.slice(0, textCap),
  ].join("\n");
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

const jsonError = (error: string, status: number) =>
  Response.json({ ok: false, error }, { status });

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return jsonError("bad-json", 400);
  }

  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const name = str(body.name);
  const email = str(body.email);
  const rawUrl = str(body.url);
  const locale = str(body.locale) === "en" ? "en" : "ro";

  if (!name || !email || !rawUrl) return jsonError("missing-fields", 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return jsonError("missing-fields", 400);

  const url = normalizeUrl(rawUrl);
  if (!url) return jsonError("invalid-url", 400);

  if (!process.env.ANTHROPIC_API_KEY) return jsonError("missing-api-key", 503);

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (await isRateLimited("audit", ip, 3, 60 * 60)) return jsonError("throttled", 429);

  // The lead counts even if the crawl fails, so it is scheduled before it.
  after(() => saveLead({ name, email, url: url.href, locale }));

  // --- Crawl: homepage, then up to 2 internal pages picked from its links.
  let home: PageRead;
  let finalUrl: URL;
  try {
    let fetched = await fetchPage(url, 10_000);
    if (!fetched && url.protocol === "https:" && !/^https?:\/\//i.test(rawUrl)) {
      // The user gave a bare domain and https failed — try plain http once.
      const httpUrl = new URL(url.href);
      httpUrl.protocol = "http:";
      fetched = await fetchPage(httpUrl, 10_000);
    }
    if (!fetched) return jsonError("unreachable", 422);
    finalUrl = fetched.finalUrl;
    home = extractPage(fetched.finalUrl.href, fetched.html);
  } catch {
    return jsonError("unreachable", 422);
  }

  const subPages: PageRead[] = [];
  for (const target of pickInternalPages(home, finalUrl, 2)) {
    try {
      const fetched = await fetchPage(target, 8_000);
      if (fetched) subPages.push(extractPage(fetched.finalUrl.href, fetched.html));
    } catch {
      // Skip unreadable internal pages; the homepage is enough.
    }
  }

  // Cap total visible text around ~20k chars across all pages.
  const dossier = [
    `SITE: ${finalUrl.hostname}`,
    `DATE: ${formatDate()}`,
    `PAGES READ: ${[home, ...subPages].map((p) => p.url).join(" , ")}`,
    pageDossier(home, 12_000, locale),
    ...subPages.map((p) => pageDossier(p, 4_000, locale)),
  ].join("\n\n");

  // --- Generate: stream the Claude report straight through to the client.
  const client = new Anthropic();
  const stream = client.messages.stream({
    model: "claude-sonnet-5",
    max_tokens: 8_000,
    system: [
      {
        type: "text",
        text: systemPrompt(locale),
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content:
          locale === "ro"
            ? `Scrie auditul pentru site-ul de mai jos, strict pe baza acestor date extrase automat azi, ${formatDate()}:\n\n${dossier}`
            : `Write the audit for the site below, strictly from this automatically extracted data, read today, ${formatDate()}:\n\n${dossier}`,
      },
    ],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal" || final.stop_reason === "max_tokens") {
          controller.enqueue(encoder.encode("\n[STREAM-INCOMPLETE]"));
        }
      } catch (err) {
        console.error("[audit] stream failed:", err);
        controller.enqueue(encoder.encode("\n[STREAM-INCOMPLETE]"));
      }
      controller.close();
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
