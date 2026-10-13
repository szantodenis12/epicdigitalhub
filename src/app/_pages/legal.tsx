/* ============================================================================
   The legal pages: /privacy, /cookies, /terms and their Romanian twins.
   Copy: _content/legal/*.md, the lawyer-reviewed texts, kept verbatim.
   ========================================================================= */

import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { type Locale } from "../content";
import { buildMetadata } from "../shell";
import { LEGAL_PATHS, type LegalKey, legalPath } from "../routes";
import { PageFrame } from "../_components/chrome";
import { CONTAINER, GRID, PageHero, TEXT_COLS } from "../_components/page-kit";

const FILES: Record<LegalKey, Record<Locale, string>> = {
  privacy: { en: "PRIVACY_POLICY_EN.md", ro: "POLITICA_CONFIDENTIALITATE_RO.md" },
  cookies: { en: "COOKIE_POLICY_EN.md", ro: "POLITICA_COOKIES_RO.md" },
  terms: { en: "TERMS_EN.md", ro: "TERMENI_SI_CONDITII_RO.md" },
};

const KICKER: Record<Locale, string> = { en: "Legal", ro: "Juridic" };

/** The markdown is read with fs at BUILD time: these pages are statically
    generated, so `next build` does the read and the files never need to exist
    at runtime. This breaks if a legal page is ever made dynamic (cookies(),
    headers(), `dynamic = "force-dynamic"`, ...) on a host that does not ship
    src/app/_content. Keep them static. */
function loadLegal(locale: Locale, key: LegalKey) {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "src/app/_content/legal", FILES[key][locale]),
    "utf8",
  );
  const lines = raw.replace(/^﻿/, "").split(/\r?\n/);
  const h1 = lines.findIndex((l) => /^# /.test(l));
  const title = lines[h1].replace(/^# /, "").trim();
  // "**Last updated:** 12.10.2026" -> "Last updated: 12.10.2026"
  const updatedLine = lines.find((l) => /^\*\*(Last updated|Ultima actualizare):\*\*/.test(l));
  const updated = updatedLine?.replace(/\*\*/g, "").trim() ?? "";
  // Front matter for the implementer, not page copy: the H1 (it is the page
  // title), the updated line (shown in the header) and the route line.
  const body = lines
    .filter((l, i) => i !== h1 && l !== updatedLine && !/^\*\*(Site route|Route on the site|Rută pe site):\*\*/.test(l))
    .join("\n");
  const description = body.split(/\n\s*\n/).find((p) => p.trim() && !p.startsWith("#"))?.replace(/\s+/g, " ").trim() ?? title;
  return { title, updated, body, description };
}

// The first paragraph is the policy's opening, often one long sentence. Search
// snippets cap near 160 characters, so keep whole sentences and, failing that,
// cut at the last comma instead of leaving a dangling "..." mid-clause.
function fitDescription(text: string, max = 160) {
  if (text.length <= max) return text;
  const sentences = text.split(/(?<=[.!?])\s+/);
  let out = "";
  for (const s of sentences) {
    const next = out ? `${out} ${s}` : s;
    if (next.length > max) break;
    out = next;
  }
  if (out) return out;
  const cut = text.slice(0, max);
  const comma = cut.lastIndexOf(",");
  return `${(comma > 80 ? cut.slice(0, comma) : cut.slice(0, cut.lastIndexOf(" "))).trimEnd()}.`;
}

export function legalMetadata(locale: Locale, key: LegalKey) {
  const { title, description } = loadLegal(locale, key);
  return buildMetadata(locale, {
    path: LEGAL_PATHS[key][locale],
    paths: LEGAL_PATHS[key],
    title,
    description: fitDescription(description),
  });
}

const components: Components = {
  h2: ({ children }) => (
    <h2 className="mt-16 text-[26px] leading-[1.2] font-medium tracking-[-0.02em] first:mt-0 md:text-[34px]">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-10 text-[20px] leading-[1.3] font-medium tracking-[-0.01em] md:text-[24px]">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="mt-5 max-w-[44em] text-base leading-[1.6] text-[#1F1F1F]/80 md:text-lg">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mt-5 max-w-[44em] list-disc space-y-2 pl-6 text-base leading-[1.6] text-[#1F1F1F]/80 marker:text-[#1FDB93] md:text-lg">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-5 max-w-[44em] list-decimal space-y-2 pl-6 text-base leading-[1.6] text-[#1F1F1F]/80 md:text-lg">{children}</ol>
  ),
  a: ({ href = "", children }) =>
    href.startsWith("/") ? (
      <Link href={href} className="underline underline-offset-4 hover:text-[#1F1F1F]">{children}</Link>
    ) : (
      <a href={href} className="underline underline-offset-4 hover:text-[#1F1F1F]" {...(/^https?:/.test(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{children}</a>
    ),
  strong: ({ children }) => <strong className="font-medium text-[#1F1F1F]">{children}</strong>,
  code: ({ children }) => <code className="rounded bg-[#1F1F1F]/[0.06] px-1 py-0.5 text-[0.9em] break-words">{children}</code>,
  hr: () => <hr className="my-12 border-[#1F1F1F]/15" />,
  blockquote: ({ children }) => <blockquote className="mt-5 max-w-[44em] border-l-2 border-[#1FDB93] pl-5">{children}</blockquote>,
  /* The scroll lives on the table's own wrapper, so a wide table pans inside
     the column and the page itself never scrolls sideways. */
  table: ({ children }) => (
    <div className="mt-6 overflow-x-auto border border-[#1F1F1F]/15" tabIndex={0}>
      <table className="w-full min-w-[40rem] border-collapse text-left text-sm leading-[1.5] md:text-base">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b border-[#1F1F1F]/15 bg-[#1F1F1F]/[0.04] px-4 py-3 align-bottom text-xs font-medium tracking-[0.02em] uppercase">{children}</th>
  ),
  td: ({ children }) => (
    <td className="border-t border-[#1F1F1F]/10 px-4 py-3 align-top text-[#1F1F1F]/80">{children}</td>
  ),
};

export function LegalPage({ locale, legalKey }: { locale: Locale; legalKey: LegalKey }) {
  const { title, updated, body } = loadLegal(locale, legalKey);
  return (
    <PageFrame locale={locale} path={legalPath(locale, legalKey)}>
      <PageHero label={KICKER[locale]} title={title}>
        <p className="text-sm text-[#1F1F1F]/70">{updated}</p>
      </PageHero>
      <article className="bg-[#F5F2F2] pb-24">
        <div className={`${CONTAINER} ${GRID} border-t border-[#1F1F1F]/15 pt-10`}>
          <div className={`${TEXT_COLS} min-w-0`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
              {body}
            </ReactMarkdown>
          </div>
        </div>
      </article>
    </PageFrame>
  );
}
