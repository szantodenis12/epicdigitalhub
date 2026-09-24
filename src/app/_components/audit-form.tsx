"use client";

/* ============================================================================
   The /audit form and the live report.

   From the handoff package's audit page: the request, the streamed read, and
   the line-grammar parser are unchanged. The styling is this site's: the
   form is the footer contact form on its dark panel, and the report is laid
   out on cream with the home page's `[ 01 ]` indices, hairlines and the
   emerald accent - a working dossier, not a dashboard (no scores, no bars).

   Renders two sibling sections - the form panel, then the report once one
   exists - because they share one piece of state.
   ========================================================================= */

import { useState } from "react";
import type { auditContent, AuditErrorCode } from "../_content/audit";
import { EyebrowMarquee } from "./ui";
import { FIELD, SUBMIT } from "./apply-form";

type AuditCopy = (typeof auditContent)["en"];
type Phase = "idle" | "reading" | "writing" | "done" | "stopped" | "error";

// ---------------------------------------------------------------------------
// Report parser. The API streams plain text in a strict grammar:
//   "# " document title · "SITE:" / "DATA:" meta lines · "## " sections ·
//   "### NN | TAG | Title" findings · "Miza:" / "Ce facem:" finding lines ·
//   "1." steps in the priority list. Re-parsed on every chunk — the text is
// small, and this keeps partial trailing lines rendering naturally.
// ---------------------------------------------------------------------------

type FindingLine = { kind: "body" | "miza" | "fix"; text: string };
type Block =
  | { kind: "doctitle"; text: string }
  | { kind: "section"; text: string }
  | { kind: "finding"; num: string; tag: string; title: string; lines: FindingLine[] }
  | { kind: "step"; num: string; text: string }
  | { kind: "para"; text: string };

type Parsed = { blocks: Block[]; site: string; date: string };

function parseReport(raw: string): Parsed {
  const blocks: Block[] = [];
  let site = "";
  let date = "";
  let current: Extract<Block, { kind: "finding" }> | null = null;

  for (const line of raw.split("\n")) {
    const l = line.trim();
    if (!l) continue;

    if (l.startsWith("### ")) {
      const parts = l.slice(4).split("|").map((s) => s.trim());
      current = {
        kind: "finding",
        num: parts[0] ?? "",
        tag: parts[1] ?? "",
        title: parts.slice(2).join(" | "),
        lines: [],
      };
      blocks.push(current);
      continue;
    }
    if (l.startsWith("## ")) {
      current = null;
      blocks.push({ kind: "section", text: l.slice(3).trim() });
      continue;
    }
    if (l.startsWith("# ")) {
      current = null;
      blocks.push({ kind: "doctitle", text: l.slice(2).trim() });
      continue;
    }
    if (/^SITE:/i.test(l)) {
      site = l.replace(/^SITE:\s*/i, "");
      continue;
    }
    if (/^(DATA|DATE):/i.test(l)) {
      date = l.replace(/^(DATA|DATE):\s*/i, "");
      continue;
    }
    const miza = l.match(/^(Miza|Stakes):\s*(.*)$/i);
    if (miza && current) {
      current.lines.push({ kind: "miza", text: miza[2] });
      continue;
    }
    const fix = l.match(/^(Ce facem|What we do):\s*(.*)$/i);
    if (fix && current) {
      current.lines.push({ kind: "fix", text: fix[2] });
      continue;
    }
    const step = l.match(/^(\d+)[.)]\s+(.*)$/);
    if (step && !current) {
      blocks.push({ kind: "step", num: step[1], text: step[2] });
      continue;
    }
    if (current) {
      current.lines.push({ kind: "body", text: l });
    } else {
      blocks.push({ kind: "para", text: l });
    }
  }

  return { blocks, site, date };
}

// ---------------------------------------------------------------------------
// Report rendering
// ---------------------------------------------------------------------------

// Report labels stay Romanian — the generated report itself is always Romanian.
const MIZA_LABEL = "Miza:";
const FIX_LABEL = "Ce facem";

function ReportView({ parsed }: { parsed: Parsed }) {
  return (
    <div>
      {parsed.blocks.map((block, i) => {
        if (block.kind === "doctitle") {
          return (
            <div key={i}>
              <h2 className="text-[26px] leading-[1.3333] font-medium tracking-[-0.01em] md:text-[36px]">
                {block.text}
              </h2>
              {(parsed.site || parsed.date) && (
                <p className="mt-4 text-xs tracking-[0.15em] text-[#21976A] uppercase">
                  {[parsed.site, parsed.date].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>
          );
        }
        if (block.kind === "section") {
          return (
            <p
              key={i}
              className="mt-16 border-t border-[#1F1F1F]/15 pt-6 text-[11px] tracking-[0.02em] text-[#1F1F1F]/70 uppercase"
            >
              {block.text}
            </p>
          );
        }
        if (block.kind === "finding") {
          return (
            <article key={i} className="mt-10">
              <div className="flex items-baseline gap-4">
                <span className="text-sm text-[#1F1F1F]/50">[ {block.num} ]</span>
                {block.tag && (
                  <span className="border border-[#1F1F1F]/40 px-2 py-1 text-[10px] tracking-[0.15em] uppercase">
                    {block.tag}
                  </span>
                )}
              </div>
              <h3 className="mt-3 text-[20px] font-medium tracking-[-0.01em] md:text-[26px]">{block.title}</h3>
              {block.lines.map((line, j) => {
                if (line.kind === "miza") {
                  return (
                    <p key={j} className="mt-4 leading-relaxed">
                      <strong className="font-medium">{MIZA_LABEL}</strong> {line.text}
                    </p>
                  );
                }
                if (line.kind === "fix") {
                  return (
                    <div key={j} className="mt-4 border-l-2 border-[#1FDB93] bg-[#1FDB93]/10 px-5 py-4">
                      <p className="mb-2 text-[11px] tracking-[0.15em] text-[#21976A] uppercase">{FIX_LABEL}</p>
                      <p className="leading-relaxed">{line.text}</p>
                    </div>
                  );
                }
                return (
                  <p key={j} className="mt-4 leading-relaxed text-[#1F1F1F]/80">
                    {line.text}
                  </p>
                );
              })}
            </article>
          );
        }
        if (block.kind === "step") {
          return (
            <div key={i} className="mt-6 flex gap-5 border-t border-[#1F1F1F]/15 pt-6">
              <span className="shrink-0 text-sm text-[#21976A]">[ {block.num.padStart(2, "0")} ]</span>
              <p className="leading-relaxed text-[#1F1F1F]/85">{block.text}</p>
            </div>
          );
        }
        return (
          <p key={i} className="mt-5 leading-relaxed text-[#1F1F1F]/80">
            {block.text}
          </p>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Form + report
// ---------------------------------------------------------------------------

export function AuditForm({ copy: d }: { copy: AuditCopy }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<AuditErrorCode>("generic");
  const [raw, setRaw] = useState("");
  const [form, setForm] = useState({ name: "", email: "", url: "" });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const mapError = (code: unknown): AuditErrorCode =>
    typeof code === "string" && code in d.states.errors ? (code as AuditErrorCode) : "generic";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phase === "reading" || phase === "writing") return;
    setPhase("reading");
    setRaw("");
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // The report is a deliverable for Romanian businesses — always
        // generated in Romanian, independent of the page's language.
        body: JSON.stringify({ ...form, locale: "ro" }),
      });
      const type = res.headers.get("content-type") ?? "";
      if (!res.ok || type.includes("application/json") || !res.body) {
        const data = await res.json().catch(() => null);
        setError(mapError(data?.error));
        setPhase("error");
        return;
      }

      setPhase("writing");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setRaw(acc.replace("[STREAM-INCOMPLETE]", ""));
      }
      acc += decoder.decode();
      const stopped = acc.includes("[STREAM-INCOMPLETE]");
      setRaw(acc.replace("[STREAM-INCOMPLETE]", "").trimEnd());
      setPhase(stopped ? "stopped" : "done");
    } catch {
      setError("generic");
      setPhase("error");
    }
  };

  const parsed = raw ? parseReport(raw) : null;
  const busy = phase === "reading" || phase === "writing";

  return (
    <>
      <section data-nav-bg="dark" className="bg-[#0F0F0F] py-24 text-[#F5F2F2]">
        <div className="mx-auto max-w-[1440px] px-4">
          <EyebrowMarquee label={d.form.kicker} />
          <form onSubmit={submit} className="mt-16 flex flex-col gap-3">
            <div className="grid gap-3 md:grid-cols-2">
              <input
                required
                name="name"
                autoComplete="name"
                aria-label={d.form.fields.name}
                placeholder={d.form.fields.name}
                value={form.name}
                onChange={set("name")}
                className={FIELD}
              />
              <input
                required
                type="email"
                name="email"
                autoComplete="email"
                aria-label={d.form.fields.email}
                placeholder={d.form.fields.email}
                value={form.email}
                onChange={set("email")}
                className={FIELD}
              />
            </div>
            <input
              required
              name="url"
              inputMode="url"
              aria-label={d.form.fields.url}
              placeholder={d.form.fields.url}
              value={form.url}
              onChange={set("url")}
              className={FIELD}
            />

            {phase === "error" && (
              <p role="alert" className="mt-5 text-sm leading-relaxed text-white/80">
                {d.states.errors[error]}
              </p>
            )}

            <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
              <button type="submit" disabled={busy} className={SUBMIT}>
                <span aria-live="polite">
                  {phase === "reading"
                    ? d.states.reading
                    : phase === "writing"
                      ? d.states.writing
                      : d.form.submit}
                </span>
                <span aria-hidden>↵</span>
              </button>
              <p className="text-xs tracking-[0.1em] text-white/40 uppercase">{d.form.note}</p>
            </div>
          </form>
        </div>
      </section>

      {(parsed || busy) && (
        <section aria-live="polite" className="bg-[#F5F2F2] py-24 text-[#1F1F1F]">
          <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-x-1 gap-y-10 px-4 md:grid-cols-8">
            <p className="text-[11px] tracking-[0.02em] text-[#1F1F1F]/70 uppercase md:col-span-3">
              {d.report.kicker}
            </p>
            <div className="md:col-span-5 md:col-start-4">
              {parsed && <ReportView parsed={parsed} />}
              {busy && (
                <div className="mt-8 flex items-center gap-4">
                  <span className="inline-block h-5 w-2.5 animate-pulse bg-[#1FDB93]" />
                  {phase === "reading" && (
                    <span className="text-xs tracking-[0.1em] text-[#1F1F1F]/50 uppercase">
                      {d.states.reading}
                    </span>
                  )}
                </div>
              )}
              {phase === "stopped" && (
                <p className="mt-12 text-xs tracking-[0.1em] text-[#1F1F1F]/50 uppercase">
                  {d.states.stopped}
                </p>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
