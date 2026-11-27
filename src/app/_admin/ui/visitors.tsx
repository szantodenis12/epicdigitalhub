"use client";

/* ============================================================================
   Secțiunea „Vizitatori": cifrele din Vercel Web Analytics, în panoul nostru.

   Ce e refolosit și ce nu: topurile sunt `CompactList`, antetul e `Panel`,
   cifra e `CountUp` + `Delta`. `StatCard` din panels.tsx și `DailyBars` din
   charts.tsx sunt legate de cele trei formulare (chei, culori, etichete
   „lead-uri"), deci nu se pot folosi pentru vizitatori fără să mintă în
   tooltip sau să fie modificate - de aici cele două bucăți noi de mai jos.
   ========================================================================= */

import { motion } from "motion/react";
import type { VisitorData, VisitorSlice } from "../types";
import { CountUp, Delta, Panel, fmtDay, fmtNum } from "./kit";
import { CompactList, STAGGER, useEnter } from "./panels";

/* Topurile numără vizitatori; `CompactList` așteaptă `{label, value}`. */
const toSlices = (rows: VisitorSlice[]) =>
  rows.map((row) => ({ label: row.label, value: row.visitors }));

export function VisitorsSection({ data, index = 0 }: { data: VisitorData; index?: number }) {
  const enterNote = useEnter(index, "min-w-0");

  /* Două stări de lipsă, două mesaje: „nesetat" se rezolvă de către proprietar,
     „nu răspunde acum" trece singur. Niciuna nu desenează zerouri, care ar
     citi ca „n-a venit nimeni". */
  if (!data.configured || !data.ok) {
    return (
      <motion.div {...enterNote}>
        <Panel id="vizitatori" title="Vizitatori" hint="din Vercel Analytics">
          {!data.configured ? (
            <>
              <p className="max-w-prose text-[0.8125rem] text-secondary">
                Cifrele de trafic nu sunt conectate încă: tokenul Vercel nu este setat.
              </p>
              <p className="mt-2 text-[0.75rem] text-tinted">
                Cât timp lipsește, secțiunea rămâne goală, nu arată zerouri.
              </p>
            </>
          ) : (
            <p className="max-w-prose text-[0.8125rem] text-secondary">
              Nu am putut aduce cifrele de trafic acum. Reîncarcă pagina peste câteva minute.
            </p>
          )}
        </Panel>
      </motion.div>
    );
  }

  return (
    <div id="vizitatori" className="scroll-mt-24 space-y-3 md:space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <VisitorStat
          index={index}
          label="Vizitatori"
          now={data.last30.visitors}
          before={data.prev30.visitors}
        />
        <VisitorStat
          index={index + 1}
          label="Afișări de pagină"
          now={data.last30.pageviews}
          before={data.prev30.pageviews}
        />
      </div>

      <VisitorBars data={data} index={index + 2} />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 xl:grid-cols-4">
        <CompactList
          title="Top pagini"
          hint="vizitatori, 30 zile"
          slices={toSlices(data.topPages)}
          accent="var(--adm-contact)"
          index={index + 3}
        />
        <CompactList
          title="Surse"
          hint="vizitatori, 30 zile"
          slices={toSlices(data.topReferrers)}
          accent="var(--adm-contact)"
          index={index + 4}
        />
        <CompactList
          title="Țări"
          hint="vizitatori, 30 zile"
          slices={toSlices(data.topCountries)}
          accent="var(--adm-contact)"
          index={index + 5}
        />
        <CompactList
          title="Dispozitive"
          hint="vizitatori, 30 zile"
          slices={toSlices(data.devices)}
          accent="var(--adm-contact)"
          index={index + 6}
        />
      </div>
    </div>
  );
}

/** Cardul de sumar: aceeași cutie și aceeași intrare ca la lead-uri. */
function VisitorStat({
  index,
  label,
  now,
  before,
}: {
  index: number;
  label: string;
  now: number;
  before: number;
}) {
  const enter = useEnter(index, "min-w-0 rounded-card border border-line bg-surface p-4 md:p-5");
  return (
    <motion.div {...enter}>
      <h3 className="truncate text-[0.75rem] text-tinted">{label}</h3>
      <p className="mt-3 text-[2rem] leading-none font-medium tracking-[-0.02em] break-all">
        <CountUp value={now} delay={index * STAGGER} />
      </p>
      <div className="mt-2.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="adm-nums text-[0.6875rem] text-secondary">în 30 zile</span>
        <Delta now={now} before={before} />
      </div>
    </motion.div>
  );
}

const PLOT_H = 160;

/* Barele sunt div-uri în flex, nu SVG măsurat: o singură serie, 30 de zile, iar
   lățimea se împarte singură la orice ecran, inclusiv 390px, fără măsurători.
   Axa începe de la zero (bara cea mai înaltă = maximul zilelor), ca în DailyBars. */
function VisitorBars({ data, index }: { data: VisitorData; index: number }) {
  const enter = useEnter(index, "min-w-0");
  const days = data.series;
  const peak = days.reduce((m, d) => Math.max(m, d.visitors), 0);
  const first = days[0];
  const last = days[days.length - 1];

  return (
    <motion.div {...enter}>
      <Panel title="Vizitatori pe zi" hint="ultimele 30 de zile">
        {days.length === 0 ? (
          <p className="text-[0.8125rem] text-tinted">Nimic încă.</p>
        ) : (
          <>
            <div
              role="img"
              aria-label={`Vizitatori pe zi, ultimele 30 de zile, maximum ${fmtNum(peak)}`}
              className="flex items-end gap-[2px] border-b border-line-2 sm:gap-1"
              style={{ height: PLOT_H }}
            >
              {days.map((day, i) => (
                <div
                  key={day.date}
                  className="flex h-full min-w-0 flex-1 items-end"
                  title={`${fmtDay(day.date)}: ${fmtNum(day.visitors)} vizitatori, ${fmtNum(day.pageviews)} afișări`}
                >
                  <motion.div
                    className="adm-grow w-full origin-bottom rounded-t-[3px]"
                    style={{
                      background: "var(--adm-contact)",
                      /* O zi fără trafic rămâne o urmă de 2px, ca în DailyBars. */
                      height: day.visitors > 0 ? `${Math.max(2, (day.visitors / peak) * 100)}%` : 2,
                      opacity: day.visitors > 0 ? 1 : 0.35,
                    }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{
                      duration: 0.45,
                      delay: Math.min(i * 0.006, 0.3),
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="adm-nums mt-2 flex justify-between gap-2 text-[0.625rem] text-tinted">
              <span>{fmtDay(first.date)}</span>
              <span>maxim {fmtNum(peak)} / zi</span>
              <span>{fmtDay(last.date)}</span>
            </div>
          </>
        )}
      </Panel>
    </motion.div>
  );
}
