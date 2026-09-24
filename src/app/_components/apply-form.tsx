"use client";

/* ============================================================================
   The /apply form. Logic from the handoff package's apply page (the niche
   check, the ?service= prefill, the received / taken / error states); the
   fields and button are the footer contact form's, so it reads as the same
   site: `h-16 bg-white/5` fields on the dark panel, the cream button with ↵.
   ========================================================================= */

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Locale } from "../content";
import type { applyContent } from "../_content/apply";

type ApplyCopy = (typeof applyContent)["en"];
type Phase = "idle" | "sending" | "received" | "niche-taken" | "error";

export const FIELD =
  "h-16 w-full border-0 bg-white/5 px-5 text-sm text-[#F5F2F2] placeholder:text-white/40 focus:bg-white/10 focus:outline-none";
export const SUBMIT =
  "flex h-16 w-full items-center justify-between gap-4 bg-[#F5F2F2] px-6 text-sm font-medium text-[#1F1F1F] transition-opacity disabled:cursor-wait disabled:opacity-60 md:w-72";

type Props = {
  copy: ApplyCopy;
  locale: Locale;
  /** slug -> service name, to prefill the goal from ?service= */
  serviceNames: Record<string, string>;
  /** "Service I'm interested in: " */
  prefillPrefix: string;
};

export function ApplyForm(props: Props) {
  /* useSearchParams needs a Suspense boundary to keep the page static; the
     fallback is the same form without the prefill. */
  return (
    <Suspense fallback={<Form {...props} serviceSlug={null} />}>
      <FormWithParams {...props} />
    </Suspense>
  );
}

function FormWithParams(props: Props) {
  return <Form {...props} serviceSlug={useSearchParams().get("service")} />;
}

function Form({
  copy: d,
  locale,
  serviceNames,
  prefillPrefix,
  serviceSlug,
}: Props & { serviceSlug: string | null }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [form, setForm] = useState({
    name: "",
    business: "",
    city: "",
    niche: "",
    website: "",
    goal: "",
    budget: "",
  });

  // Prefill the goal when arriving from a service page, without overwriting
  // anything the visitor typed themselves.
  const lastPrefill = useRef("");
  useEffect(() => {
    const name = serviceSlug ? serviceNames[serviceSlug] : undefined;
    if (!name) return;
    const prefill = `${prefillPrefix}${name}`;
    setForm((f) => (f.goal === "" || f.goal === lastPrefill.current ? { ...f, goal: prefill } : f));
    lastPrefill.current = prefill;
  }, [serviceSlug, serviceNames, prefillPrefix]);

  const set =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhase("sending");
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, locale }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setPhase("error");
        return;
      }
      setPhase(data.status === "niche-taken" ? "niche-taken" : "received");
    } catch {
      setPhase("error");
    }
  };

  if (phase === "received" || phase === "niche-taken") {
    const taken = phase === "niche-taken";
    const body = taken
      ? d.states.takenBody.replace("{niche}", form.niche).replace("{city}", form.city)
      : d.states.receivedBody;
    return (
      <div role="status" className="max-w-[62ch]">
        <p className={`text-sm tracking-[0.15em] uppercase ${taken ? "text-white/50" : "text-[#1FDB93]"}`}>
          {taken ? "—" : "✓"}
        </p>
        <h2 className="mt-6 text-[26px] leading-[1.3333] font-medium tracking-[-0.01em] md:text-[36px]">
          {taken ? d.states.takenTitle : d.states.receivedTitle}
        </h2>
        <p className="mt-6 text-base leading-relaxed text-white/70">{body}</p>
      </div>
    );
  }

  const field = (k: keyof typeof form, label: string, required = false) => (
    <input
      name={k}
      required={required}
      aria-label={label}
      placeholder={label}
      value={form[k]}
      onChange={set(k)}
      className={FIELD}
    />
  );

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <div className="grid gap-3 md:grid-cols-2">
        {field("name", d.fields.name, true)}
        {field("business", d.fields.business, true)}
        {field("city", d.fields.city, true)}
        {field("niche", d.fields.niche, true)}
        {field("website", d.fields.website)}
        {field("budget", d.fields.budget)}
      </div>
      <textarea
        name="goal"
        aria-label={d.fields.goal}
        placeholder={d.fields.goal}
        value={form.goal}
        onChange={set("goal")}
        rows={4}
        className={`${FIELD} h-auto resize-none py-5`}
      />

      {phase === "error" && (
        <p role="alert" className="mt-5 text-sm leading-relaxed text-white/80">
          <span className="block text-base font-medium text-[#F5F2F2]">{d.states.errorTitle}</span>
          {d.states.errorBody}
        </p>
      )}

      <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
        <button type="submit" disabled={phase === "sending"} className={SUBMIT}>
          <span aria-live="polite">
            {phase === "sending" ? d.states.checking : phase === "error" ? d.states.retry : d.submit}
          </span>
          <span aria-hidden>↵</span>
        </button>
        <p className="text-xs tracking-[0.1em] text-white/40 uppercase">{d.note}</p>
      </div>
    </form>
  );
}
