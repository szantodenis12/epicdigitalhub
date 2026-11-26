"use client";

/* ============================================================================
   Secțiunile care nu sunt nici grafic, nici tabel: rândul de carduri, fluxul
   de activitate, panoul RO/EN + nișe ocupate, topurile compacte.

   Toate intră la montare cu același decalaj, din același `STAGGER`: patru
   carduri care apar la 60ms unul de altul se citesc ca un rând care sosește;
   patru carduri cu durate alese separat se citesc ca patru componente
   diferite care s-au întâmplat să fie puse lângă.
   ========================================================================= */

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { usePrefersReducedMotion } from "../../_components/context";
import { LEAD_LABEL, type Lead, type LeadKind, type Slice, type Totals } from "../types";
import {
  CountUp,
  Delta,
  KIND_COLOR,
  KindPill,
  ListRow,
  Panel,
  fmtNum,
  fmtRelative,
  fmtStamp,
} from "./kit";

/** Pasul decalajului de intrare, în secunde. Un singur număr pentru tot panoul. */
export const STAGGER = 0.06;

/**
 * Intrarea standard: 10px de jos și o estompare, pe curba site-ului.
 *
 * Întoarce și `className="adm-enter"`, care nu e decor: sub
 * `prefers-reduced-motion` admin.css pironește clasa asta în starea finală cu
 * `!important`, iar ăla e singurul mecanism care prinde la timp. Hook-ul de
 * mai jos ajunge la valoarea corectă abia într-un efect pasiv, adică după ce
 * `motion` și-a pornit deja tween-ul - util pentru navigările din client și
 * pentru a nu porni o animație degeaba, dar prea târziu pentru primul ecran.
 *
 * Deci: clasa e plasa de siguranță, hook-ul e economia. Amândouă, nu una.
 */
export function useEnter(index = 0, className = "") {
  const reduceMotion = usePrefersReducedMotion();
  return {
    initial: reduceMotion ? (false as const) : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.42, delay: index * STAGGER, ease: [0.22, 1, 0.36, 1] as const },
    className: `adm-enter ${className}`.trim(),
  };
}

/* ============================================================================
   RÂNDUL DE CARDURI
   ========================================================================= */

/* Iconițele. Desenate pe grilă de 16, în `currentColor`, ca cele din
   theme.tsx: fără bibliotecă pentru patru forme. */
const ICONS: Record<"all" | LeadKind, React.ReactNode> = {
  all: (
    <path
      d="M2 4.5h12M2 8h12M2 11.5h8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  ),
  contact: (
    <>
      <rect x="2" y="3.5" width="12" height="9" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <path d="m2.8 4.6 5.2 3.6 5.2-3.6" fill="none" stroke="currentColor" strokeWidth="1.3" />
    </>
  ),
  audit: (
    <>
      <circle cx="7" cy="7" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <path d="m10.2 10.2 3.3 3.3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </>
  ),
  apply: (
    <>
      <path d="M4 2.5h8v11l-4-2.4-4 2.4z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M6 6h4" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </>
  ),
};

type StatKey = "all" | LeadKind;

const STAT_LABEL: Record<StatKey, string> = {
  all: "Total lead-uri",
  contact: `Formular ${LEAD_LABEL.contact}`,
  audit: `Formular ${LEAD_LABEL.audit}`,
  apply: "Aplicații",
};

/**
 * Cele patru cifre de sus: totalul și câte unul per formular.
 *
 * Cifra MARE e totalul de la început, nu cea pe 30 de zile: la prima privire
 * întrebarea e "cât am strâns", nu "cât luna asta". Luna și variația ei stau
 * dedesubt, pe un rând, ca în referință.
 */
export function StatCards({
  totals,
  last30,
  prev30,
}: {
  totals: Totals;
  last30: Totals;
  prev30: Totals;
}) {
  const keys: StatKey[] = ["all", "contact", "audit", "apply"];
  return (
    /* Doua coloane deja pe telefon: patru carduri pe toata latimea insemnau
       un ecran intreg de derulat inainte de primul grafic, iar cifra incape
       lejer la 180px. */
    <div id="sumar" className="grid scroll-mt-24 grid-cols-2 gap-3 xl:grid-cols-4">
      {keys.map((key, i) => (
        <StatCard
          key={key}
          index={i}
          label={STAT_LABEL[key]}
          icon={ICONS[key]}
          tone={key === "all" ? "var(--text-tinted)" : KIND_COLOR[key]}
          total={totals[key]}
          now={last30[key]}
          before={prev30[key]}
        />
      ))}
    </div>
  );
}

/** Intrarea unui card de sumar: aceeași ca restul, cu cutia cardului în ea. */
function useEnterCard(index: number) {
  return useEnter(index, "rounded-card border border-line bg-surface p-4 md:p-5");
}

function StatCard({
  index,
  label,
  icon,
  tone,
  total,
  now,
  before,
}: {
  index: number;
  label: string;
  icon: React.ReactNode;
  tone: string;
  total: number;
  now: number;
  before: number;
}) {
  return (
    <motion.div {...useEnterCard(index)}>
      <div className="flex items-center gap-2.5">
        {/* Iconița stă într-o casetă cu chenar în culoarea formularului și cu
            fundalul suprafeței ridicate - nu umplută cu culoarea. La patru
            carduri, patru pătrate pline ar fi primul lucru pe care îl vezi pe
            ecran, iar primul lucru trebuie să fie cifra. */}
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border bg-raised"
          style={{ borderColor: tone, color: tone }}
        >
          <svg viewBox="0 0 16 16" aria-hidden className="h-3.5 w-3.5">
            {icon}
          </svg>
        </span>
        <h3 className="truncate text-[0.75rem] text-tinted">{label}</h3>
      </div>

      {/* `tabular-nums` + `break-all` pe recipient: cifra crește pe măsură ce
          urcă contorul, iar un total de șase cifre pe un card de 240px trebuie
          să rămână în card, nu să-l împingă. */}
      <p className="mt-3 text-[2rem] leading-none font-medium tracking-[-0.02em] break-all">
        <CountUp value={total} delay={index * STAGGER} />
      </p>

      <div className="mt-2.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="adm-nums text-[0.6875rem] text-secondary">
          {fmtNum(now)} în 30 zile
        </span>
        <Delta now={now} before={before} />
      </div>
    </motion.div>
  );
}

/* ============================================================================
   FLUXUL DE ACTIVITATE
   ========================================================================= */

/** Ce scrie pe rândul de activitate, pe lângă nume: lucrul cel mai util din
    formularul din care a venit lead-ul. */
function activityDetail(lead: Lead): string {
  if (lead.kind === "audit") return lead.url || "fără adresă";
  if (lead.kind === "apply") {
    return [lead.business, lead.city].filter(Boolean).join(" · ") || "aplicație";
  }
  return lead.page || "contact";
}

/**
 * Ora de referință pentru timpii relativi: una singură pentru toate rândurile,
 * reîmprospătată din minut în minut.
 *
 * Una singură pentru că altfel două rânduri din aceeași secundă pot cădea de
 * părți diferite ale unui prag și se citesc "acum" și "acum 1 minut".
 * Reîmprospătată pentru că panoul stă deschis pe un ecran toată ziua, iar
 * "acum 2 minute" lângă un lead de acum trei ore e mai rău decât nimic.
 *
 * `useState` cu inițializator leneș, nu `Date.now()` în corpul componentei: o
 * citire de ceas în randare e impură și se vede - la o re-randare provocată de
 * cu totul altceva, toate orele de pe ecran s-ar schimba.
 */
function useNow(intervalMs = 60_000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return now;
}

export function ActivityFeed({ leads, index = 0 }: { leads: Lead[]; index?: number }) {
  const enter = useEnter(index, "h-full min-w-0");
  const now = useNow();
  const shown = leads.slice(0, 8);

  return (
    /* `h-full` pe INVELIS, nu doar pe Panel: elementul de grila e divul de
       aici, iar un Panel cu h-full intr-un invelis care nu se intinde se
       intinde pana la inaltimea invelisului, adica a continutului lui. */
    <motion.div {...enter}>
      <Panel
        id="activitate"
        title="Activitate recentă"
        hint="cele mai noi opt"
        className="h-full"
        bodyClassName="p-0 md:p-0"
      >
        {shown.length === 0 ? (
          <p className="p-5 text-[0.8125rem] text-tinted">Niciun lead încă.</p>
        ) : (
          <ul className="divide-y divide-line">
            {shown.map((lead) => (
              <li
                key={lead.id || `${lead.kind}-${lead.createdAt}`}
                className="flex items-center gap-3 px-4 py-2.5 md:px-5"
              >
                <KindPill kind={lead.kind} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[0.8125rem]">
                    {lead.name || "—"}
                    {lead.status === "niche-taken" && (
                      <span
                        className="ml-2 text-[0.625rem] whitespace-nowrap"
                        style={{ color: "var(--adm-down)" }}
                      >
                        nișă ocupată
                      </span>
                    )}
                  </span>
                  <span className="block truncate text-[0.6875rem] text-tinted">
                    {activityDetail(lead)}
                  </span>
                </span>
                {/* `<time>` cu `dateTime`: textul e relativ și se poate
                    schimba, valoarea citibilă de o mașină nu. `suppress...`
                    pentru că ora de pe server și cea din browser pot cădea de
                    o parte și de alta a unui prag. */}
                <time
                  dateTime={lead.createdAt}
                  title={fmtStamp(lead.createdAt)}
                  className="shrink-0 text-[0.6875rem] whitespace-nowrap text-tinted"
                  suppressHydrationWarning
                >
                  {fmtRelative(lead.createdAt, now)}
                </time>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </motion.div>
  );
}

/* ============================================================================
   LIMBĂ + NIȘE OCUPATE
   ========================================================================= */

const LOCALE_LABEL: Record<string, string> = { ro: "Română", en: "Engleză" };

/**
 * Panoul mic: din ce limbă vin lead-urile și câte aplicații au fost respinse
 * pentru nișă ocupată.
 *
 * Cele două stau împreună pentru că răspund la aceeași întrebare - "cine a
 * ajuns aici și ce i s-a răspuns" - și pentru că niciuna nu are singură
 * destul conținut pentru un panou.
 */
export function SplitPanel({
  byLocale,
  nicheTaken,
  applyTotal,
  index = 0,
}: {
  byLocale: Slice[];
  nicheTaken: number;
  applyTotal: number;
  index?: number;
}) {
  const enter = useEnter(index, "h-full min-w-0");
  const sum = byLocale.reduce((s, item) => s + item.value, 0);
  const takenPct = applyTotal > 0 ? Math.round((nicheTaken / applyTotal) * 100) : 0;

  return (
    <motion.div {...enter}>
      <Panel id="public" title="Limbă și nișe" className="h-full">
        {/* O singură bară împărțită, nu două procente alăturate: raportul
            dintre cele două limbi e tot ce contează aici, iar o bară îl arată
            fără să fie nevoie de citit. */}
        {sum === 0 ? (
          <p className="text-[0.8125rem] text-tinted">Încă nimic de împărțit.</p>
        ) : (
          <>
            <div className="flex h-2 w-full gap-0.5 overflow-hidden rounded-full">
              {byLocale.map((slice, i) => (
                <span
                  key={slice.label}
                  style={{
                    width: `${(slice.value / sum) * 100}%`,
                    /* Prima limbă în accent, a doua estompată: nu sunt două
                       categorii de pus în comparație, e un raport. */
                    background: i === 0 ? "var(--accent)" : "var(--border-secondary)",
                  }}
                />
              ))}
            </div>
            <ul className="mt-3 space-y-1.5">
              {byLocale.map((slice, i) => (
                <li key={slice.label} className="flex items-center gap-2 text-[0.8125rem]">
                  <span
                    aria-hidden
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{
                      background: i === 0 ? "var(--accent)" : "var(--border-secondary)",
                    }}
                  />
                  <span className="flex-1 truncate">
                    {LOCALE_LABEL[slice.label] ?? (slice.label || "necunoscută")}
                  </span>
                  <span className="adm-nums">{fmtNum(slice.value)}</span>
                  <span className="adm-nums w-10 text-right text-[0.75rem] text-tinted">
                    {Math.round((slice.value / sum) * 100)}%
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="mt-4 border-t border-line pt-4">
          <p className="text-[0.75rem] text-tinted">Aplicații respinse (nișă ocupată)</p>
          <p className="mt-1.5 flex items-baseline gap-2">
            <span
              className="text-[1.5rem] leading-none font-medium"
              style={{ color: nicheTaken > 0 ? "var(--adm-down)" : "var(--text-tinted)" }}
            >
              <CountUp value={nicheTaken} />
            </span>
            {applyTotal > 0 && (
              <span className="adm-nums text-[0.6875rem] text-tinted">
                din {fmtNum(applyTotal)} · {takenPct}%
              </span>
            )}
          </p>
        </div>
      </Panel>
    </motion.div>
  );
}

/* ============================================================================
   TOPURILE COMPACTE
   ========================================================================= */

export function CompactList({
  id,
  title,
  hint,
  slices,
  accent,
  index = 0,
}: {
  id?: string;
  title: string;
  hint?: string;
  slices: Slice[];
  accent?: string;
  index?: number;
}) {
  const enter = useEnter(index, "h-full min-w-0");
  const max = slices.reduce((m, s) => Math.max(m, s.value), 0);
  return (
    <motion.div {...enter}>
      <Panel id={id} title={title} hint={hint} className="h-full">
        {slices.length === 0 ? (
          <p className="text-[0.8125rem] text-tinted">Nimic încă.</p>
        ) : (
          <ul>
            {slices.map((slice) => (
              <ListRow
                key={slice.label}
                label={slice.label}
                value={slice.value}
                max={max}
                accent={accent}
              />
            ))}
          </ul>
        )}
      </Panel>
    </motion.div>
  );
}
