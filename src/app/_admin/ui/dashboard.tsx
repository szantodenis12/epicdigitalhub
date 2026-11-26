"use client";

/* ============================================================================
   Panoul, asamblat.

   Ordinea de pe ecran e ordinea întrebărilor, nu a datelor:

     1. cât am strâns, și crește?        patru carduri
     2. cum arată în timp?               barele pe zi, cu 7 / 30 / 90
     3. din ce vine?                     inelul pe formular
     4. ce s-a întâmplat ultima oră?     fluxul de activitate
     5. cine sunt oamenii?               limbă, nișe ocupate, topuri
     6. pe cine sun?                     tabelul

   Grilă de 12 coloane de la `xl` în sus (8+4 la grafice, 8+4 la activitate),
   două coloane la `md`, una pe telefon. 12 și nu 3x4 pentru că raportul 2:1
   dintre bare și inel e esența layout-ului din referință, iar pe o grilă de 3
   nu se poate scrie.

   Starea trăiește aici, nu în componente: intervalul graficului e singura
   stare pe care o împart mai multe panouri (barele îl desenează, antetul lui
   îl schimbă), iar filtrele tabelului sunt strict ale tabelului și stau la el.
   ========================================================================= */

import { useState } from "react";
import { motion } from "motion/react";
import { LEAD_LABEL, type AdminData, type LeadKind, type Slice } from "../types";
import { DailyBars, KindDonut, RANGES, type Range } from "./charts";
import { ActivityFeed, CompactList, SplitPanel, StatCards, useEnter } from "./panels";
import { KIND_COLOR, KIND_ORDER, Panel, fmtNum } from "./kit";
import { LeadsTable } from "./leads-table";

export function Dashboard({ data }: { data: AdminData }) {
  const [range, setRange] = useState<Range>(30);

  /* Intrările celor două panouri mari sunt citite aici, nu inline în JSX:
     `useEnter` e un hook, iar un hook chemat în mijlocul arborelui e o invitație
     la o randare condiționată care-i schimbă ordinea. */
  const enterBars = useEnter(4, "min-w-0 xl:col-span-8");
  const enterDonut = useEnter(5, "min-w-0 xl:col-span-4");

  /* Feliile inelului se construiesc din totaluri, cu eticheta = felul
     lead-ului: legenda traduce în română prin LEAD_LABEL, iar culoarea se
     caută după aceeași cheie. O felie cu valoare zero e scoasă - un arc de
     lungime zero nu se vede, dar ocupă un rând în legendă și un procent "0%"
     pe care nimeni nu l-a cerut. */
  const donutSlices: Slice[] = KIND_ORDER.map((kind: LeadKind) => ({
    label: kind,
    value: data.totals[kind],
  })).filter((slice) => slice.value > 0);

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-3 md:space-y-4">
      {!data.storageOk && <StorageMissing />}

      <StatCards totals={data.totals} last30={data.last30} prev30={data.prev30} />

      <div className="grid grid-cols-1 gap-3 md:gap-4 xl:grid-cols-12">
        <motion.div {...enterBars}>
          <Panel
            id="evolutie"
            title="Lead-uri pe zi"
            hint={`ultimele ${range} de zile, pe formular`}
            className="h-full"
            right={<RangeToggle range={range} onChange={setRange} />}
          >
            <DailyBars series={data.series} range={range} />
            {/* Legenda stă SUB grafic, nu în antet: antetul are deja
                comutatorul de interval, iar trei pastile lângă el ar fi fost
                șase controale pe un rând din care două nu se apasă. */}
            <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-3">
              {KIND_ORDER.map((kind) => (
                <li key={kind} className="flex items-center gap-2 text-[0.75rem]">
                  <span
                    aria-hidden
                    className="h-2.5 w-2.5 rounded-[3px]"
                    style={{ background: KIND_COLOR[kind] }}
                  />
                  <span className="text-secondary">{LEAD_LABEL[kind]}</span>
                  <span className="adm-nums text-tinted">
                    {fmtNum(
                      data.series.slice(-range).reduce((s, point) => s + point[kind], 0),
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        </motion.div>

        <motion.div {...enterDonut}>
          <Panel
            id="distributie"
            title="Din ce formular"
            hint="de la început"
            className="h-full"
            bodyClassName="p-4 md:p-5 flex items-center"
          >
            <KindDonut slices={donutSlices} total={data.totals.all} />
          </Panel>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:gap-4 xl:grid-cols-12">
        <div className="min-w-0 xl:col-span-8">
          <ActivityFeed leads={data.recent} index={6} />
        </div>
        <div className="min-w-0 xl:col-span-4">
          <SplitPanel
            byLocale={data.byLocale}
            nicheTaken={data.nicheTaken}
            applyTotal={data.totals.apply}
            index={7}
          />
        </div>
      </div>

      {/* `scroll-mt` pe înveliș, nu pe primul card: ancora din nav duce la
          rândul de topuri, nu la lista de nișe. */}
      <div
        id="topuri"
        className="grid scroll-mt-24 grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 xl:grid-cols-4"
      >
        <CompactList
          title="Top nișe"
          hint="din aplicații"
          slices={data.topNiches}
          accent="var(--adm-apply)"
          index={8}
        />
        <CompactList
          title="Top orașe"
          hint="din aplicații"
          slices={data.topCities}
          accent="var(--adm-apply)"
          index={9}
        />
        <CompactList
          title="Bugete"
          hint="din aplicații"
          slices={data.budgets}
          accent="var(--adm-contact)"
          index={10}
        />
        <CompactList
          title="Domenii auditate"
          hint="din formularul de audit"
          slices={data.topAuditDomains}
          accent="var(--adm-audit)"
          index={11}
        />
      </div>

      <LeadsTable leads={data.recent} index={12} />
    </div>
  );
}

function RangeToggle({
  range,
  onChange,
}: {
  range: Range;
  onChange: (next: Range) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Intervalul graficului"
      className="flex items-center rounded-full border border-line bg-background p-0.5"
    >
      {RANGES.map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          aria-pressed={range === value}
          className={`adm-nums h-6 rounded-full px-2.5 text-[0.6875rem] transition-colors ${
            range === value ? "bg-raised text-foreground" : "text-tinted hover:text-secondary"
          }`}
        >
          {value} z
        </button>
      ))}
    </div>
  );
}

/**
 * Ce se arată când `storageOk` e false.
 *
 * Nu e un banner peste un panou cu zerouri: zerourile ar fi o minciună
 * ("n-au venit lead-uri") acolo unde adevărul e altul ("nu am de unde citi").
 * Panoul se desenează oricum dedesubt, pentru că forma lui e utilă chiar gol -
 * dar primul lucru de pe ecran spune ce lipsește și ce anume se pune ca să
 * meargă.
 */
function StorageMissing() {
  return (
    <div
      className="rounded-card border p-4 md:p-5"
      style={{ borderColor: "var(--adm-down)", background: "var(--surface)" }}
      role="alert"
    >
      <h2 className="text-[0.875rem] font-medium" style={{ color: "var(--adm-down)" }}>
        Stocarea nu e configurată
      </h2>
      <p className="mt-1.5 max-w-prose text-[0.8125rem] text-secondary">
        Panoul nu poate citi nicio listă de lead-uri, nici din baza de date, nici din fișierele locale.
        Cifrele de mai jos sunt zero pentru că nu există sursă, <strong>nu</strong> pentru că nu au
        venit lead-uri.
      </p>
      <p className="mt-2 text-[0.75rem] text-tinted">
        Se rezolvă cu <code className="text-foreground">SUPABASE_URL</code> și{" "}
        <code className="text-foreground">SUPABASE_SERVICE_ROLE_KEY</code> (din Vercel). Local, fără ele, formularele scriu în <code className="text-foreground">./data</code>.
      </p>
    </div>
  );
}
