"use client";

/* ============================================================================
   Cele două grafice, desenate ca SVG, de mână.

   Nicio bibliotecă de grafice, intenționat: un grafic cu bare și un inel sunt
   dreptunghiuri și un arc, iar cea mai mică bibliotecă serioasă aduce între
   40 și 150 KB de JS pentru două forme pe care panoul oricum le vrea exact în
   culorile și la densitatea lui.

   Un singur lucru contează mai mult decât aspectul: un grafic nu are voie să
   mintă. De asta:
     - axa începe de la ZERO, mereu, iar maximul e rotunjit în sus la o cifră
       "rotundă" - o axă care începe de la 3 face dintr-o creștere de 10% un
       munte;
     - zilele fără lead-uri sunt desenate (ca gol), nu sărite - data.ts le
       trimite tocmai pentru asta, iar o serie care sare zilele goale arată un
       flux constant acolo unde a fost o pauză de-o săptămână;
     - lățimea barei vine din lățimea măsurată a panoului, nu dintr-un viewBox
       întins - un viewBox cu `preserveAspectRatio="none"` ar fi scalat
       orizontal și golurile dintre bare, deci densitatea desenată nu ar mai fi
       cea calculată.
   ========================================================================= */

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { animate, motion } from "motion/react";
import { usePrefersReducedMotion } from "../../_components/context";
import { LEAD_LABEL, type LeadKind, type SeriesPoint, type Slice } from "../types";
import { CountUp, KIND_COLOR, KIND_ORDER, fmtDay, fmtNum } from "./kit";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Lățimea reală a unui element, în px.
 *
 * Valoarea de start nu e 0, ci o lățime plauzibilă: la 0 primul randat (cel de
 * pe server, și cel de la hidratare) n-ar desena nimic, iar graficul ar apărea
 * printr-un salt de layout. Măsurarea se face în `useLayoutEffect`, deci
 * înainte de pictare, și corecția nu se vede.
 */
function useMeasuredWidth(fallback: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(fallback);
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => setWidth(el.clientWidth || fallback);
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [fallback]);
  return [ref, width] as const;
}

/** Maximul axei: următoarea valoare "rotundă" (1, 2, 5 x 10^n) peste vârf.
    Minim 4, ca o zi cu un singur lead să nu umple tot graficul. */
function niceMax(peak: number): number {
  if (peak <= 4) return 4;
  const pow = 10 ** Math.floor(Math.log10(peak));
  for (const step of [1, 2, 2.5, 5, 10]) {
    const candidate = step * pow;
    if (candidate >= peak) return Math.ceil(candidate);
  }
  return Math.ceil(10 * pow);
}

/** Un dreptunghi cu colțurile de SUS rotunjite, pentru segmentul care încheie
    stiva. `rx` pe un <rect> le rotunjește pe toate patru, iar o bară cu baza
    rotunjită pare să plutească deasupra axei. */
function topRounded(x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.max(0, Math.min(r, w / 2, h));
  return `M${x} ${y + h}V${y + rr}a${rr} ${rr} 0 0 1 ${rr} ${-rr}h${w - 2 * rr}a${rr} ${rr} 0 0 1 ${rr} ${rr}V${y + h}Z`;
}

/* ============================================================================
   BARE: lead-uri pe zi, cele trei formulare în stivă
   ========================================================================= */

export const RANGES = [7, 30, 90] as const;
export type Range = (typeof RANGES)[number];

const PLOT_H = 208;
/* Loc pentru eticheta de sub bară. Nu e padding pe SVG: etichetele sunt HTML
   (vezi mai jos), deci aici e doar înălțimea zonei desenate. */
const BASELINE = PLOT_H;

export function DailyBars({ series, range }: { series: SeriesPoint[]; range: Range }) {
  const reduceMotion = usePrefersReducedMotion();
  const [wrapRef, width] = useMeasuredWidth(760);
  const [hover, setHover] = useState<number | null>(null);

  const days = useMemo(() => series.slice(-range), [series, range]);

  const peak = useMemo(
    () => days.reduce((m, d) => Math.max(m, d.contact + d.audit + d.apply), 0),
    [days],
  );
  const max = niceMax(peak);

  /* Lățimea unei bare. Golul se strânge odată cu numărul de zile: la 90 de
     zile un gol de 3px ar lăsa bare de 5px, iar la 7 zile bare de 100px
     lipite ar fi un bloc. */
  const slot = days.length > 0 ? width / days.length : width;
  const gap = days.length > 60 ? 1.5 : days.length > 30 ? 2.5 : days.length > 14 ? 6 : 14;
  const barW = Math.max(2, slot - gap);

  /* Fiecare a câta zi primește etichetă. La 90 de zile toate 90 nu încap, iar
     suprapuse nu se citește niciuna. */
  const labelEvery = Math.max(1, Math.ceil(days.length / Math.max(4, Math.floor(width / 92))));

  const ticks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="flex gap-3">
      {/* Axa Y e HTML, nu <text> în SVG: textul din SVG s-ar scala cu desenul
          și ar ajunge la 9px pe un panou îngust. Aliniată pe aceleași
          procente ca liniile grilei. */}
      <div
        className="relative w-7 shrink-0 text-right text-[0.625rem] text-tinted"
        style={{ height: PLOT_H }}
        aria-hidden
      >
        {ticks.map((t) => (
          <span
            key={t}
            className="adm-nums absolute right-0 -translate-y-1/2 tabular-nums"
            style={{ top: `${(1 - t) * 100}%` }}
          >
            {fmtNum(Math.round(max * t))}
          </span>
        ))}
      </div>

      <div className="relative min-w-0 flex-1" ref={wrapRef}>
        <svg
          width={width}
          height={PLOT_H}
          viewBox={`0 0 ${width} ${PLOT_H}`}
          role="img"
          aria-label={`Lead-uri pe zi, ultimele ${range} de zile, pe formular`}
          className="block overflow-visible"
        >
          {/* Grila. `non-scaling-stroke` nu e strict necesar la dimensiuni în
              px reali, dar ține linia la exact 1px și pe ecrane cu raport
              fracționar, unde altfel apare când 1px, când 2. */}
          {ticks.map((t) => (
            <line
              key={t}
              x1={0}
              x2={width}
              y1={BASELINE - t * PLOT_H}
              y2={BASELINE - t * PLOT_H}
              stroke={t === 0 ? "var(--border-secondary)" : "var(--adm-grid)"}
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
          ))}

          {days.map((day, i) => {
            const x = i * slot + (slot - barW) / 2;
            const total = day.contact + day.audit + day.apply;
            let cursor = BASELINE;

            return (
              <g key={day.date}>
                {/* Canelura: urma coloanei. E și suprafața de hover, deci
                    acoperă tot slotul, nu doar bara - la 90 de zile bara are
                    7px și nimeni nu nimerește 7px cu mouse-ul. */}
                <rect
                  x={i * slot}
                  y={0}
                  width={slot}
                  height={PLOT_H}
                  fill={hover === i ? "var(--adm-track)" : "transparent"}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover((h) => (h === i ? null : h))}
                />
                {/* Grupul care crește. O animație per zi, nu per segment: trei
                    segmente care cresc independent se despart unul de altul
                    în aer. `transform-box: view-box` ca originea să fie în
                    coordonatele desenului, nu în caseta de redare. */}
                <motion.g
                  initial={reduceMotion ? false : { scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{
                    duration: 0.45,
                    /* Decalaj plafonat: la 90 de zile un stagger "corect" de
                       20ms ar ține intrarea 1.8s, ceea ce pe un instrument
                       deschis de douăzeci de ori pe zi e o eternitate. */
                    delay: Math.min(i * 0.006, 0.3),
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{
                    transformBox: "view-box",
                    transformOrigin: `${x + barW / 2}px ${BASELINE}px`,
                  }}
                  /* `adm-grow`: sub mișcare redusă, admin.css pironește
                     transformul grupului pe identitate cu `!important`, deci
                     bara e la înălțimea ei finală din primul cadru, orice ar
                     crede tween-ul care rulează pe sub. */
                  className="adm-grow pointer-events-none"
                >
                  {KIND_ORDER.map((kind) => {
                    const value = day[kind];
                    if (!value) return null;
                    const h = (value / max) * PLOT_H;
                    /* Golul de 2px dintre segmente, dar numai dacă segmentul
                       are din ce să-l scoată: la o zi cu un lead, un gol
                       scăzut din 6px ar lăsa o dungă. */
                    const drawn = h > 5 ? h - 2 : h;
                    const y = cursor - h;
                    cursor = y;
                    const isTop = !hasKindAbove(day, kind);
                    return isTop ? (
                      <path
                        key={kind}
                        d={topRounded(x, y, barW, drawn, Math.min(3, barW / 2))}
                        fill={KIND_COLOR[kind]}
                        opacity={hover === null || hover === i ? 1 : 0.42}
                      />
                    ) : (
                      <rect
                        key={kind}
                        x={x}
                        y={y}
                        width={barW}
                        height={drawn}
                        fill={KIND_COLOR[kind]}
                        opacity={hover === null || hover === i ? 1 : 0.42}
                      />
                    );
                  })}
                  {/* O zi fără lead-uri: o urmă de 2px pe axă, ca să se vadă
                      că ziua există și a fost zero, nu că lipsește din date. */}
                  {total === 0 && (
                    <rect
                      x={x}
                      y={BASELINE - 2}
                      width={barW}
                      height={2}
                      fill="var(--border-main)"
                    />
                  )}
                </motion.g>
              </g>
            );
          })}
        </svg>

        {/* Etichetele de pe axa X, HTML, din același motiv ca cele de pe Y. */}
        <div className="relative mt-2 h-4" aria-hidden>
          {days.map((day, i) =>
            i % labelEvery === 0 ? (
              <span
                key={day.date}
                className="absolute top-0 -translate-x-1/2 text-[0.625rem] whitespace-nowrap text-tinted"
                style={{ left: i * slot + slot / 2 }}
              >
                {fmtDay(day.date)}
              </span>
            ) : null,
          )}
        </div>

        {hover !== null && days[hover] && (
          <BarTooltip day={days[hover]} x={hover * slot + slot / 2} width={width} />
        )}
      </div>
    </div>
  );
}

/** Mai e vreun formular cu valoare DEASUPRA celui dat, în ordinea stivei?
    Răspunde la o întrebare de desen, nu de date: colțul rotunjit merge pe
    segmentul care încheie bara, iar acela nu e mereu ultimul din ordine. */
function hasKindAbove(day: SeriesPoint, kind: LeadKind): boolean {
  const from = KIND_ORDER.indexOf(kind) + 1;
  return KIND_ORDER.slice(from).some((k) => day[k] > 0);
}

/** Ce s-a întâmplat în ziua de sub cursor. Poziționat cu `transform`, nu cu
    `left` calculat prin scăderi: așa se poate prinde de marginea panoului
    când ziua e prima sau ultima, fără două ramuri de aritmetică. */
function BarTooltip({ day, x, width }: { day: SeriesPoint; x: number; width: number }) {
  const total = day.contact + day.audit + day.apply;
  /* Lipit de marginea cea mai apropiată când ar ieși din panou. */
  const clamped = Math.min(Math.max(x, 72), Math.max(72, width - 72));
  return (
    <div
      className="pointer-events-none absolute -top-2 z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-line-2 bg-raised px-3 py-2 text-[0.6875rem] shadow-lg shadow-black/30"
      style={{ left: clamped }}
      role="status"
    >
      <p className="mb-1 font-medium whitespace-nowrap">
        {fmtDay(day.date)} · <span className="adm-nums">{fmtNum(total)}</span>{" "}
        {total === 1 ? "lead" : "lead-uri"}
      </p>
      <ul className="space-y-0.5">
        {KIND_ORDER.map((kind) => (
          <li key={kind} className="flex items-center gap-2 whitespace-nowrap">
            <span
              aria-hidden
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: KIND_COLOR[kind] }}
            />
            <span className="text-tinted">{LEAD_LABEL[kind]}</span>
            <span className="adm-nums ml-auto">{fmtNum(day[kind])}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ============================================================================
   INEL: cât din total vine din fiecare formular
   ========================================================================= */

const DONUT_BOX = 184;
const DONUT_R = 74;
const DONUT_STROKE = 16;
const CIRC = 2 * Math.PI * DONUT_R;

type Arc = Slice & { len: number; start: number; pct: number };

/**
 * Feliile, traduse în lungimi de arc și poziții de start.
 *
 * Funcție la nivel de modul, nu o buclă în randare: acumulatorul care adună
 * offset-ul e o variabilă care se rescrie, iar o variabilă care se rescrie în
 * corpul unei componente e exact ce interzice `react-hooks/immutability` - pe
 * bună dreptate, pentru că la o re-randare întreruptă ar putea fi citită pe
 * jumătate actualizată.
 *
 * `gap` e golul dintre felii, în lungime de arc, și e zero la o singură
 * felie: altfel ar tăia un inel întreg fără să despartă nimic.
 */
function buildArcs(slices: Slice[], sum: number): Arc[] {
  const gap = slices.length > 1 ? 3 : 0;
  const arcs: Arc[] = [];
  let offset = 0;
  for (const slice of slices) {
    const len = sum > 0 ? (slice.value / sum) * CIRC : 0;
    arcs.push({ ...slice, len: Math.max(0, len - gap), start: offset, pct: 0 });
    offset += len;
  }
  return withPercents(arcs, sum);
}

/**
 * Procentele legendei, rotunjite ca SUMA lor sa fie 100.
 *
 * Rotunjite fiecare pe cont propriu, 106/382, 201/382 si 75/382 dau 28, 53 si
 * 20 - adica 101%, scris sub un inel care e vizibil intreg. Metoda celui mai
 * mare rest imparte intregii prin taiere si da unitatile ramase feliilor cu
 * cea mai mare parte zecimala, deci totalul e exact 100 si fiecare procent e
 * la cel mult o unitate de valoarea lui reala.
 */
function withPercents(arcs: Arc[], sum: number): Arc[] {
  if (sum <= 0) return arcs;
  const exact = arcs.map((arc) => (arc.value / sum) * 100);
  const floors = exact.map(Math.floor);
  let left = 100 - floors.reduce((a, b) => a + b, 0);
  const order = exact
    .map((value, i) => ({ i, rest: value - floors[i] }))
    .sort((a, b) => b.rest - a.rest);
  const pct = [...floors];
  for (const { i } of order) {
    if (left <= 0) break;
    pct[i] += 1;
    left -= 1;
  }
  return arcs.map((arc, i) => ({ ...arc, pct: pct[i] }));
}

/**
 * O felie, cu trasarea ei.
 *
 * Starea de REPAUS e cea finală (`strokeDashoffset` ca atribut), nu cea
 * ascunsă: așa arcul e întreg în markup-ul de pe server, cu JS blocat și sub
 * `prefers-reduced-motion`. Animația e pornită imperativ, dintr-un efect care
 * citește el însuși media query-ul - `stroke-dashoffset` nu e nici transform,
 * nici opacitate, deci nu poate fi pironit din CSS așa cum sunt celelalte
 * intrări, iar hook-ul de preferință află prea târziu (vezi admin.css).
 *
 * Efectul duce arcul înapoi la lungime zero și îl desenează la loc. Saltul
 * ăla nu se vede: panoul din jur e încă la opacitate 0, pentru că intrarea lui
 * abia începe.
 */
function DonutArc({
  arc,
  delay,
  wide,
  dim,
}: {
  arc: Arc;
  delay: number;
  wide: boolean;
  dim: boolean;
}) {
  const ref = useRef<SVGCircleElement>(null);

  useIsoLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    /* Un offset NEGATIV deplasează începutul arcului în sensul desenării, deci
       felia pornește exact unde s-a terminat cea dinainte. De la "lungime
       zero" (-start - len) la poziția ei: arcul crește dinspre începutul lui. */
    const controls = animate(
      node,
      { strokeDashoffset: [-arc.start - arc.len, -arc.start] },
      { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
    );
    return () => controls.stop();
  }, [arc.start, arc.len, delay]);

  return (
    <circle
      ref={ref}
      cx={DONUT_BOX / 2}
      cy={DONUT_BOX / 2}
      r={DONUT_R}
      fill="none"
      stroke={KIND_COLOR[arc.label as LeadKind] ?? "var(--accent)"}
      strokeWidth={wide ? DONUT_STROKE + 4 : DONUT_STROKE}
      strokeLinecap="butt"
      strokeDasharray={`${arc.len} ${CIRC}`}
      strokeDashoffset={-arc.start}
      opacity={dim ? 0.4 : 1}
      style={{ transition: "stroke-width 160ms ease, opacity 160ms ease" }}
    />
  );
}

export function KindDonut({ slices, total }: { slices: Slice[]; total: number }) {
  const [hover, setHover] = useState<string | null>(null);

  /* Unghiurile se calculează pe TOTALUL feliilor, nu pe `total`: dacă vreodată
     cele două nu coincid (o felie filtrată, o rotunjire), inelul trebuie să
     rămână închis - un inel cu o breșă arată ca o felie lipsă. Cifra din
     mijloc rămâne `total`, care e adevărul despre cât e tot. */
  const sum = slices.reduce((s, item) => s + item.value, 0);

  const arcs = buildArcs(slices, sum);

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-6">
      <div className="relative shrink-0" style={{ width: DONUT_BOX, height: DONUT_BOX }}>
        <svg
          viewBox={`0 0 ${DONUT_BOX} ${DONUT_BOX}`}
          width={DONUT_BOX}
          height={DONUT_BOX}
          role="img"
          aria-label="Împărțirea lead-urilor pe formular"
          /* Rotit cu -90 de grade ca prima felie să înceapă la ora 12, de unde
             o citește oricine, nu la ora 3, de unde pornește un arc SVG. */
          className="-rotate-90"
        >
          <circle
            cx={DONUT_BOX / 2}
            cy={DONUT_BOX / 2}
            r={DONUT_R}
            fill="none"
            stroke="var(--adm-grid)"
            strokeWidth={DONUT_STROKE}
          />
          {arcs.map((arc, i) => (
            <DonutArc
              key={arc.label}
              arc={arc}
              delay={0.1 + i * 0.09}
              wide={hover === arc.label}
              dim={hover !== null && hover !== arc.label}
            />
          ))}
        </svg>
        {/* Totalul, în centru. Nu e <text> în SVG pentru că SVG-ul e rotit:
            textul s-ar roti cu el. */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <CountUp value={total} className="text-[1.75rem] leading-none font-medium" />
          <span className="mt-1 text-[0.625rem] tracking-[0.1em] text-tinted uppercase">
            total
          </span>
        </div>
      </div>

      {/* Legenda cu valoare și procent, ca în referință. Procentul e calculat
          pe `sum`, nu pe `total`, din același motiv ca unghiurile - altfel
          procentele desenate și cele scrise ar putea să nu dea 100 împreună. */}
      <ul className="w-full min-w-0 space-y-1">
        {arcs.map((arc) => {
          const kind = arc.label as LeadKind;
          return (
            <li key={arc.label}>
              <button
                type="button"
                onMouseEnter={() => setHover(arc.label)}
                onMouseLeave={() => setHover((h) => (h === arc.label ? null : h))}
                onFocus={() => setHover(arc.label)}
                onBlur={() => setHover((h) => (h === arc.label ? null : h))}
                className="flex w-full items-center gap-2.5 rounded-md px-1.5 py-1.5 text-left transition-colors hover:bg-raised"
              >
                <span
                  aria-hidden
                  className="h-2.5 w-2.5 shrink-0 rounded-[3px]"
                  style={{ background: KIND_COLOR[kind] ?? "var(--accent)" }}
                />
                <span className="min-w-0 flex-1 truncate text-[0.8125rem]">
                  {LEAD_LABEL[kind] ?? arc.label}
                </span>
                <span className="adm-nums shrink-0 text-[0.8125rem]">{fmtNum(arc.value)}</span>
                <span className="adm-nums w-11 shrink-0 text-right text-[0.75rem] text-tinted">
                  {/* O felie reala care s-ar rotunji la zero scrie "<1%", nu
                      "0%": zero inseamna "nimic", iar aici e "putin". */}
                  {arc.pct === 0 && arc.value > 0 ? "<1%" : `${arc.pct}%`}
                </span>
              </button>
            </li>
          );
        })}
        {arcs.length === 0 && <li className="text-[0.8125rem] text-tinted">Niciun lead încă.</li>}
      </ul>
    </div>
  );
}
