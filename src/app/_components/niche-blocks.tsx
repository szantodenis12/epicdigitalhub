"use client";

/* ============================================================================
   /niches — the rule device and the availability board.

   Ported from the handoff, which was drawn for a dark surface with `bg-ink`,
   `text-bone`, `display` and `label-mono`. None of that exists here, so the
   mechanics came over and the surface is this site's: cream #F5F2F2, #1F1F1F
   copy, square corners, 1px hairlines, emerald as a sweep or an accent.

   What the handoff did not have is more than one city. The board is now
   per-city: the switcher drives the counters, the index and the ledger, and
   `defaultCity` is only the initial value rather than the whole dataset.
   ========================================================================= */

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "./gsap";
import { usePrefersReducedMotion } from "./context";
import { nn } from "./format";
import { roCities } from "../_content/ro-cities";
import {
  DEFAULT_CITY_ID,
  boardFor,
  defaultCity,
  type CityBoard,
  type Industry,
  type Niche,
  type NicheStatus,
  type NichesCopy,
} from "../_content/niches";
import { type Locale } from "../content";

const STATUSES = ["ocupat", "in_discutie", "liber"] as const;

/** Diacritic-insensitive matcher, so "curatatorie" finds "Curățătorie". */
const fold = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

const openCount = (ind: Industry) => ind.niches.filter((n) => n.status === "liber").length;

/** Cities grouped by county, for the <optgroup>s. Built once at module load:
    the list never changes at runtime. */
const COUNTIES: [string, typeof roCities][] = Object.entries(
  roCities.reduce<Record<string, typeof roCities>>((acc, c) => {
    (acc[c.county] ??= []).push(c);
    return acc;
  }, {})
).sort(([a], [b]) => a.localeCompare(b, "ro"));

const countBy = (board: CityBoard) => {
  const totals: Record<NicheStatus, number> = { ocupat: 0, in_discutie: 0, liber: 0 };
  board.industries.forEach((ind) => ind.niches.forEach((n) => (totals[n.status] += 1)));
  return totals;
};

/* The taken segment is hatched rather than solid: on a cream page a flat grey
   bar reads as "disabled", and the hatch reads as "spoken for". */
const HATCH = "repeating-linear-gradient(-23.6deg, transparent 0 7px, rgba(31,31,31,0.5) 7px 8px)";

const SEGMENT: Record<NicheStatus, string> = {
  ocupat: "bg-[#1F1F1F]/15",
  in_discutie: "bg-[#E2B736]",
  liber: "bg-[#1FDB93]",
};

const DOT: Record<NicheStatus, string> = {
  ocupat: "bg-[#1F1F1F]/40",
  in_discutie: "bg-[#E2B736]",
  liber: "bg-[#1FDB93]",
};

/* ----------------------------------------------------------------------------
   THE RULE DEVICE — industry struck out, its niches listed underneath

   Cycles three real examples from the selected city. The strike is the whole
   argument: the industry line gets crossed, the niches under it do not.
   ------------------------------------------------------------------------- */

const EXAMPLE_IDS = ["horeca", "medical", "auto"];

export function NicheRule({
  board,
  locale,
  kicker,
  industryOpen,
  status,
}: {
  board: CityBoard;
  locale: Locale;
  kicker: string;
  industryOpen: string;
  status: { ocupat: string; liber: string };
}) {
  const reduceMotion = usePrefersReducedMotion();
  const [idx, setIdx] = useState(0);

  const examples = useMemo(
    () =>
      EXAMPLE_IDS.map((id) => {
        const industry = board.industries.find((i) => i.id === id);
        if (!industry) return null;
        const taken = industry.niches.filter((n) => n.status === "ocupat");
        const rest = industry.niches.filter((n) => n.status !== "ocupat");
        return { industry, niches: [...taken, ...rest].slice(0, 5) };
      }).filter((e): e is { industry: Industry; niches: Niche[] } => e !== null),
    [board]
  );

  // A city change can shorten the example list, so never hold a stale index.
  const current = examples[idx % examples.length];

  /* Under reduced motion the panel is static and does not cycle — a device
     that rewrites itself every three seconds is the thing that preference is
     asking us not to do. */
  useEffect(() => {
    if (reduceMotion || examples.length < 2) return;
    const id = window.setTimeout(() => setIdx((i) => (i + 1) % examples.length), 4200);
    return () => window.clearTimeout(id);
  }, [idx, reduceMotion, examples.length]);

  if (!current) return null;

  return (
    <div className="border border-[#1F1F1F]/15 bg-white/60 p-6 md:p-8">
      <p className="text-[11px] tracking-[0.02em] text-[#1F1F1F]/50 uppercase">
        {kicker} · {board.city}
      </p>

      <div className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <span
          key={`${board.id}-${current.industry.id}`}
          className="relative inline-block text-[26px] font-medium tracking-[-0.02em] md:text-[32px]"
        >
          {current.industry.label[locale]}
          <span
            aria-hidden
            className={`absolute top-[0.58em] left-0 h-[2px] w-full origin-left bg-[#1FDB93] ${
              reduceMotion ? "" : "animate-[niche-strike_520ms_cubic-bezier(0.22,1,0.36,1)_320ms_both]"
            }`}
          />
        </span>
        <span className="text-[11px] tracking-[0.02em] text-[#1F1F1F]/50 uppercase">
          {industryOpen}
        </span>
      </div>

      <ul className="mt-6 border-t border-[#1F1F1F]/15">
        {current.niches.map((n, i) => {
          const taken = n.status === "ocupat";
          return (
            <li
              key={`${board.id}-${n.id}`}
              style={reduceMotion ? undefined : { animationDelay: `${600 + i * 90}ms` }}
              className={`flex items-center justify-between gap-4 border-b border-[#1F1F1F]/15 py-3 ${
                reduceMotion ? "" : "animate-[niche-row_480ms_cubic-bezier(0.22,1,0.36,1)_both]"
              }`}
            >
              <span className={`text-sm md:text-base ${taken ? "text-[#1F1F1F]" : "text-[#1F1F1F]/70"}`}>
                {n.label[locale]}
              </span>
              <span
                className={`flex shrink-0 items-center gap-2 text-[11px] tracking-[0.02em] uppercase ${
                  taken ? "text-[#1F1F1F]/60" : "text-[#21976A]"
                }`}
              >
                <span aria-hidden className={`inline-block size-1.5 rounded-full ${taken ? DOT.ocupat : DOT.liber}`} />
                {taken ? `${status.ocupat} · ${n.brand}` : status.liber}
              </span>
            </li>
          );
        })}
      </ul>

      <div aria-hidden className="mt-6 flex gap-2">
        {examples.map((e, i) => (
          <span
            key={e.industry.id}
            className={`h-px w-8 transition-colors duration-500 ${
              i === idx % examples.length ? "bg-[#1FDB93]" : "bg-[#1F1F1F]/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------
   THE BOARD — city switcher, availability bar, search, index, ledger
   ------------------------------------------------------------------------- */

export function NicheBoard({
  d,
  locale,
  applyHref,
  exampleKicker,
  industryOpen,
  showRule = false,
}: {
  d: NichesCopy["checker"];
  locale: Locale;
  applyHref: string;
  exampleKicker?: string;
  industryOpen?: string;
  showRule?: boolean;
}) {
  const reduceMotion = usePrefersReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const citySelectId = useId();
  const counties = COUNTIES;
  const [cityId, setCityId] = useState(DEFAULT_CITY_ID);
  const [industryId, setIndustryId] = useState(defaultCity.industries[0].id);
  const [query, setQuery] = useState("");

  const board = useMemo(() => boardFor(cityId), [cityId]);
  const totals = useMemo(() => countBy(board), [board]);
  const entries = useMemo(
    () => board.industries.flatMap((industry) => industry.niches.map((niche) => ({ niche, industry }))),
    [board]
  );

  const searching = query.trim().length > 0;

  const visible = useMemo(() => {
    if (searching) {
      const q = fold(query.trim());
      return entries.filter(
        (e) => fold(e.niche.label.en).includes(q) || fold(e.niche.label.ro).includes(q)
      );
    }
    const active = board.industries.find((i) => i.id === industryId) ?? board.industries[0];
    return active.niches.map((niche) => ({ niche, industry: active }));
  }, [searching, query, entries, board, industryId]);

  /* The counters count up once, and they re-run on a city change because the
     numbers themselves change. The markup already holds the final value, so
     reduced motion and a JS failure both simply keep it. */
  useEffect(() => {
    if (reduceMotion) return;
    const nodes = root.current?.querySelectorAll<HTMLElement>("[data-count]");
    if (!nodes?.length) return;
    const tweens = Array.from(nodes).map((node) => {
      const target = Number(node.dataset.count);
      const counter = { v: 0 };
      node.textContent = "00";
      return gsap.to(counter, {
        v: target,
        duration: 1.2,
        ease: "power3.out",
        onUpdate: () => {
          node.textContent = String(Math.round(counter.v)).padStart(2, "0");
        },
      });
    });
    return () => {
      tweens.forEach((t) => t.kill());
      // Hand back the true number, never a half-counted one.
      nodes.forEach((n) => (n.textContent = String(n.dataset.count).padStart(2, "0")));
    };
  }, [reduceMotion, cityId]);

  const onCity = (id: string) => setCityId(id);

  return (
    <div ref={root}>
      {/* CITY PICKER — a native <select>, grouped by county.

          320 cities is past the point where a row of buttons works: it wrapped
          to three lines at nine of them. Native is the right call rather than
          a custom combobox — it gets the phone's own wheel picker, type-ahead
          on a keyboard, and screen-reader support that costs nothing to
          maintain. Only the box around it is styled; the arrow is drawn here
          because `appearance-none` removes the platform one. */}
      <div className="border-t border-[#1F1F1F]/15 pt-8">
        <label
          htmlFor={citySelectId}
          className="text-[11px] tracking-[0.02em] text-[#1F1F1F]/50 uppercase"
        >
          {d.cityLabel}
        </label>
        <div className="relative mt-3 max-w-[22rem]">
          <select
            id={citySelectId}
            value={cityId}
            onChange={(e) => onCity(e.target.value)}
            className="w-full cursor-pointer appearance-none border border-[#1F1F1F]/20 bg-white/60 py-4 pr-12 pl-4 text-lg font-medium tracking-[-0.01em] transition-colors duration-300 hover:border-[#21976A] focus:border-[#1FDB93] focus:outline-none"
          >
            {counties.map(([county, list]) => (
              <optgroup key={county} label={county}>
                {list.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.city}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <span
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[#21976A]"
          >
            ↓
          </span>
        </div>
        <p className="mt-4 text-sm text-[#1F1F1F]/55">
          {board.city}, {board.county} · {d.updated} {board.updated}
        </p>
      </div>

      {showRule && exampleKicker && industryOpen && (
        <div className="mt-10 md:hidden">
          <NicheRule
            board={board}
            locale={locale}
            kicker={exampleKicker}
            industryOpen={industryOpen}
            status={{ ocupat: d.statusLabel.ocupat, liber: d.statusLabel.liber }}
          />
        </div>
      )}

      {/* THE MARKET AT A GLANCE — one bar, three segments, from the data */}
      <div className="mt-12">
        <div className="flex h-3 w-full gap-px md:h-4">
          {STATUSES.map((s) => (
            <div
              key={s}
              className={`${SEGMENT[s]} ${reduceMotion ? "" : "origin-left animate-[niche-bar_900ms_cubic-bezier(0.22,1,0.36,1)_both]"}`}
              style={{
                width: `${(totals[s] / entries.length) * 100}%`,
                minWidth: "2.5rem",
                ...(s === "ocupat" ? { backgroundImage: HATCH } : {}),
              }}
            />
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-x-12 gap-y-4">
          {STATUSES.map((s) => (
            <div key={s} className="flex items-baseline gap-3">
              <span
                data-count={totals[s]}
                className={`text-[32px] leading-none font-medium tracking-[-0.02em] md:text-[44px] ${
                  s === "liber" ? "text-[#21976A]" : "text-[#1F1F1F]"
                }`}
              >
                {String(totals[s]).padStart(2, "0")}
              </span>
              <span className="flex items-center gap-2 text-[11px] tracking-[0.02em] text-[#1F1F1F]/60 uppercase">
                <span aria-hidden className={`inline-block size-1.5 rounded-full ${DOT[s]}`} />
                {d.counters[s]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SEARCH — cuts across every industry in the selected city */}
      <div className="relative mt-12 border-b border-[#1F1F1F]/20 transition-colors duration-300 focus-within:border-[#1FDB93]">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={d.searchPlaceholder}
          aria-label={d.searchPlaceholder}
          className="w-full bg-transparent py-5 pr-20 text-lg tracking-[-0.01em] caret-[#21976A] placeholder:text-[#1F1F1F]/40 focus:outline-none md:py-6 md:text-2xl"
        />
        {searching && (
          <span
            aria-live="polite"
            className="absolute right-0 bottom-6 text-[11px] tracking-[0.02em] text-[#1F1F1F]/50 uppercase md:bottom-8"
          >
            {String(visible.length).padStart(2, "0")}/{entries.length}
          </span>
        )}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-10">
        {/* INDUSTRY INDEX — a table of contents, dimmed while searching */}
        <aside
          className={`transition-opacity duration-500 lg:col-span-4 lg:sticky lg:top-28 lg:self-start ${
            searching ? "pointer-events-none opacity-40" : ""
          }`}
        >
          <ul>
            {board.industries.map((ind, i) => {
              const active = !searching && ind.id === industryId;
              return (
                <li key={ind.id}>
                  <button
                    type="button"
                    onClick={() => setIndustryId(ind.id)}
                    aria-pressed={active}
                    tabIndex={searching ? -1 : undefined}
                    className="group flex w-full cursor-pointer items-baseline justify-between gap-4 border-b border-[#1F1F1F]/15 py-4 text-left"
                  >
                    <span className="flex items-baseline gap-4">
                      <span
                        className={`text-[11px] tracking-[0.02em] uppercase transition-colors duration-300 ${
                          active ? "text-[#21976A]" : "text-[#1F1F1F]/40"
                        }`}
                      >
                        {nn(i)}
                      </span>
                      {/* A transform, not padding: indenting with padding
                          re-wraps the label mid-transition. */}
                      <span
                        className={`text-base font-medium tracking-[-0.01em] transition-[color,transform] duration-300 md:text-lg ${
                          active
                            ? "translate-x-1 text-[#1F1F1F]"
                            : "text-[#1F1F1F]/65 group-hover:translate-x-1 group-hover:text-[#1F1F1F]"
                        }`}
                      >
                        {ind.label[locale]}
                      </span>
                    </span>
                    <span
                      className={`shrink-0 text-[11px] tracking-[0.02em] uppercase transition-colors duration-300 ${
                        active ? "text-[#21976A]" : "text-[#1F1F1F]/40"
                      }`}
                    >
                      {openCount(ind)}/{ind.niches.length}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="mt-5 text-[11px] tracking-[0.02em] text-[#1F1F1F]/40 uppercase">
            {d.openOfTotal}
          </p>
        </aside>

        {/* THE LEDGER */}
        <div className="lg:col-span-8">
          {searching && visible.length === 0 && (
            <p className="border-b border-[#1F1F1F]/15 py-10 text-lg text-[#1F1F1F]/70">
              {d.searchEmpty}
            </p>
          )}

          <ul className="border-t border-[#1F1F1F]/15">
            {visible.map(({ niche, industry }) => {
              const name = niche.label[locale];
              const industryName = industry.label[locale];

              if (niche.status === "liber") {
                return (
                  <li key={`${board.id}-${niche.id}`}>
                    <Link
                      href={applyHref}
                      className="group grid grid-cols-[1fr_auto] items-center gap-4 border-b border-[#1F1F1F]/15 py-5 md:py-6"
                    >
                      <div>
                        {searching && (
                          <span className="mb-1 block text-[11px] tracking-[0.02em] text-[#1F1F1F]/45 uppercase">
                            {industryName}
                          </span>
                        )}
                        <h3 className="text-[22px] font-medium tracking-[-0.01em] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2 md:text-[30px]">
                          {name}
                        </h3>
                      </div>
                      <div className="flex shrink-0 items-center gap-6">
                        <span className="hidden text-[11px] tracking-[0.02em] text-[#21976A] uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:block">
                          {d.reserve} <span aria-hidden>→</span>
                        </span>
                        <span className="flex items-center gap-2 text-[11px] tracking-[0.02em] text-[#21976A] uppercase">
                          <span aria-hidden className="inline-block size-1.5 rounded-full bg-[#1FDB93]" />
                          {d.statusLabel.liber}
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              }

              const inTalks = niche.status === "in_discutie";
              return (
                <li
                  key={`${board.id}-${niche.id}`}
                  className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-[#1F1F1F]/15 py-5 md:py-6"
                >
                  <div>
                    {searching && (
                      <span className="mb-1 block text-[11px] tracking-[0.02em] text-[#1F1F1F]/45 uppercase">
                        {industryName}
                      </span>
                    )}
                    <h3
                      className={`text-[22px] font-medium tracking-[-0.01em] md:text-[30px] ${
                        inTalks
                          ? "text-[#1F1F1F]/70"
                          : "text-[#1F1F1F]/45 line-through decoration-[#1F1F1F]/35 decoration-[1.5px]"
                      }`}
                    >
                      {name}
                    </h3>
                  </div>
                  <div className="flex shrink-0 items-center gap-6">
                    {niche.brand && (
                      <span className="hidden text-[11px] tracking-[0.02em] text-[#1F1F1F]/70 uppercase sm:block">
                        {niche.brand}
                      </span>
                    )}
                    {niche.note && (
                      <span className="hidden text-[11px] tracking-[0.02em] text-[#1F1F1F]/50 uppercase sm:block">
                        {niche.note[locale]}
                      </span>
                    )}
                    <span
                      className={`flex items-center gap-2 text-[11px] tracking-[0.02em] uppercase ${
                        inTalks ? "text-[#1F1F1F]/70" : "text-[#1F1F1F]/50"
                      }`}
                    >
                      {inTalks && (
                        <span aria-hidden className="inline-block size-1.5 rounded-full bg-[#E2B736]" />
                      )}
                      {inTalks ? d.statusLabel.in_discutie : d.statusLabel.ocupat}
                    </span>
                  </div>
                </li>
              );
            })}

            {/* the niche that is not on the list yet */}
            <li>
              <Link
                href={applyHref}
                className="group grid grid-cols-[1fr_auto] items-center gap-4 border-b border-[#1F1F1F]/15 py-5 md:py-6"
              >
                <h3 className="text-[22px] font-medium tracking-[-0.01em] text-[#1F1F1F]/55 transition-colors duration-500 group-hover:text-[#1F1F1F] md:text-[30px]">
                  {d.notListed}
                </h3>
                <span className="shrink-0 text-[11px] tracking-[0.02em] text-[#21976A] uppercase">
                  {d.notListedCta} <span aria-hidden>→</span>
                </span>
              </Link>
            </li>
          </ul>

          <p className="mt-8 max-w-[62ch] text-sm leading-relaxed text-[#1F1F1F]/60">
            {d.namesNote}
          </p>
        </div>
      </div>
    </div>
  );
}
