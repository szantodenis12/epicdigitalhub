"use client";

/* ============================================================================
   Tabelul de lead-uri. Ăsta e motivul pentru care panoul există.

   Restul paginii răspunde la "cum merge"; tabelul răspunde la "pe cine sun
   acum". De asta are cea mai multă grijă: sortare, filtru pe formular, căutare
   liberă, un singur clic pentru copierea adresei, și o variantă pe carduri sub
   `md`, unde cinci coloane nu mai înseamnă nimic.

   Un singur tabel pentru trei formulare, nu trei: coloanele comune (când, de
   unde, cine, email) sunt aceleași, iar singura care diferă e ultima. Trei
   tabele ar fi însemnat trei filtre și trei sortări care nu se văd una pe alta
   - exact ce face amestecul util.
   ========================================================================= */

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { LEAD_LABEL, type Lead, type LeadKind } from "../types";
import { EmailCell, KindPill, Panel, fmtNum, fmtStamp } from "./kit";
import { useEnter } from "./panels";

type SortKey = "date" | "name" | "kind";
type SortDir = "asc" | "desc";

const KIND_FILTERS: ({ value: "all" } | { value: LeadKind })[] = [
  { value: "all" },
  { value: "contact" },
  { value: "audit" },
  { value: "apply" },
];

const FILTER_LABEL: Record<"all" | LeadKind, string> = {
  all: "Toate",
  contact: LEAD_LABEL.contact,
  audit: LEAD_LABEL.audit,
  apply: "Aplicații",
};

/* ---------------------------------------------------------------------------
   Coloana "detalii": ce are de spus fiecare formular.

   Întoarce o LISTĂ de perechi, nu un șir lipit: pe desktop intră una lângă
   alta cu etichete mici, pe telefon se desfac pe rânduri, iar eticheta
   ("oraș", "buget") trebuie să rămână lipită de valoarea ei în ambele cazuri.
   ------------------------------------------------------------------------ */
function details(lead: Lead): { label: string; value: string; href?: string }[] {
  switch (lead.kind) {
    case "audit":
      return lead.url
        ? [{ label: "site", value: lead.url.replace(/^https?:\/\//, ""), href: lead.url }]
        : [];
    case "apply":
      return [
        { label: "business", value: lead.business ?? "" },
        { label: "oraș", value: lead.city ?? "" },
        { label: "nișă", value: lead.niche ?? "" },
        { label: "buget", value: lead.budget ?? "" },
        lead.website
          ? {
              label: "site",
              value: lead.website.replace(/^https?:\/\//, ""),
              href: lead.website.startsWith("http") ? lead.website : `https://${lead.website}`,
            }
          : { label: "", value: "" },
      ].filter((d) => d.value);
    default:
      return lead.page ? [{ label: "pagină", value: lead.page }] : [];
  }
}

/** Tot ce se caută într-un lead, într-un singur șir. Construit o dată per
    lead, nu la fiecare tastă pe fiecare câmp. */
function haystack(lead: Lead): string {
  return [
    lead.name,
    lead.email,
    lead.phone,
    lead.page,
    lead.url,
    lead.business,
    lead.city,
    lead.niche,
    lead.budget,
    lead.goal,
    lead.website,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function LeadsTable({ leads, index = 0 }: { leads: Lead[]; index?: number }) {
  const enter = useEnter(index, "min-w-0");
  const searchId = useId();

  const [kind, setKind] = useState<"all" | LeadKind>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("date");
  const [dir, setDir] = useState<SortDir>("desc");
  const [open, setOpen] = useState<Lead | null>(null);
  /* Elementul care a deschis sertarul, ținut ca focusul să se întoarcă exact
     pe rândul de unde s-a plecat - altfel tastatura ar reîncepe de sus. */
  const trigger = useRef<HTMLElement | null>(null);

  const openLead = (lead: Lead, el: HTMLElement) => {
    trigger.current = el;
    setOpen(lead);
  };
  const close = () => {
    setOpen(null);
    const el = trigger.current;
    if (el?.isConnected) el.focus();
  };
  /* Rândul întreg e țintă de clic, dar conține deja linkuri și butoane
     (mailto, copiază, site): un clic pe ele nu trebuie să deschidă și sertarul. */
  const rowProps = (lead: Lead) => ({
    tabIndex: 0,
    "aria-haspopup": "dialog" as const,
    "aria-label": `Deschide ${lead.name || lead.email || "lead"}`,
    onClick: (e: React.MouseEvent<HTMLElement>) => {
      if ((e.target as HTMLElement).closest("a,button")) return;
      openLead(lead, e.currentTarget);
    },
    onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
      if (e.target !== e.currentTarget) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLead(lead, e.currentTarget);
      }
    },
  });

  const indexed = useMemo(
    () => leads.map((lead) => ({ lead, text: haystack(lead) })),
    [leads],
  );

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = indexed
      .filter((row) => (kind === "all" ? true : row.lead.kind === kind))
      .filter((row) => (needle ? row.text.includes(needle) : true))
      .map((row) => row.lead);

    const sign = dir === "asc" ? 1 : -1;
    return filtered.sort((a, b) => {
      if (sort === "name") return sign * a.name.localeCompare(b.name, "ro");
      if (sort === "kind") {
        return (
          sign * LEAD_LABEL[a.kind].localeCompare(LEAD_LABEL[b.kind], "ro") ||
          b.createdAt.localeCompare(a.createdAt)
        );
      }
      /* Datele vin toate din `new Date().toISOString()`, deci ordinea
         lexicografică E ordinea cronologică - fără Date.parse per comparație. */
      return sign * a.createdAt.localeCompare(b.createdAt);
    });
  }, [indexed, kind, query, sort, dir]);

  /* Un clic pe un cap de coloană nouă sortează DESCRESCĂTOR la data și
     CRESCĂTOR la text: nimeni nu vrea cele mai vechi lead-uri primele, și
     nimeni nu vrea numele de la Z la A. Al doilea clic inversează. */
  const toggle = (key: SortKey) => {
    if (key === sort) {
      setDir((d) => (d === "asc" ? "desc" : "asc"));
      return;
    }
    setSort(key);
    setDir(key === "date" ? "desc" : "asc");
  };

  return (
    <motion.div {...enter}>
      <Panel
        id="lead-uri"
        title="Lead-uri recente"
        hint={
          rows.length === leads.length
            ? `${fmtNum(leads.length)} înregistrări`
            : `${fmtNum(rows.length)} din ${fmtNum(leads.length)}`
        }
        bodyClassName="p-0 md:p-0"
        right={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <label className="sr-only" htmlFor={searchId}>
              Caută în lead-uri
            </label>
            <input
              id={searchId}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="caută nume, email, oraș…"
              className="h-7 w-full min-w-0 rounded-full border border-line bg-background px-3 text-[0.75rem] placeholder:text-tinted sm:w-56"
            />
            <div
              role="group"
              aria-label="Filtrează pe formular"
              className="flex items-center rounded-full border border-line bg-background p-0.5"
            >
              {KIND_FILTERS.map(({ value }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setKind(value)}
                  aria-pressed={kind === value}
                  className={`h-6 rounded-full px-2.5 text-[0.6875rem] transition-colors ${
                    kind === value
                      ? "bg-raised text-foreground"
                      : "text-tinted hover:text-secondary"
                  }`}
                >
                  {FILTER_LABEL[value]}
                </button>
              ))}
            </div>
          </div>
        }
      >
        {rows.length === 0 ? (
          <p className="p-5 text-[0.8125rem] text-tinted">
            {leads.length === 0
              ? "Niciun lead stocat încă."
              : "Nimic nu se potrivește cu filtrul."}
          </p>
        ) : (
          <>
            {/* DESKTOP. `max-h` + `overflow-auto` în loc de paginare: 50 de
                rânduri se derulează mai repede decât se apasă "pagina
                următoare", iar antetul rămâne lipit (vezi .adm-sticky-head). */}
            <div className="hidden max-h-[33rem] overflow-auto md:block">
              <table className="w-full border-collapse text-left">
                <thead className="adm-sticky-head text-[0.6875rem] tracking-[0.04em] text-tinted uppercase">
                  <tr className="border-b border-line">
                    <Th width="9.5rem" sorted={sort === "date" ? dir : null} onClick={() => toggle("date")}>
                      Data
                    </Th>
                    <Th width="7rem" sorted={sort === "kind" ? dir : null} onClick={() => toggle("kind")}>
                      Formular
                    </Th>
                    <Th width="10rem" sorted={sort === "name" ? dir : null} onClick={() => toggle("name")}>
                      Nume
                    </Th>
                    <Th width="17rem">Email</Th>
                    <Th>Detalii</Th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((lead) => (
                    <tr
                      key={lead.id || `${lead.kind}-${lead.createdAt}-${lead.name}`}
                      {...rowProps(lead)}
                      className="cursor-pointer border-b border-line/70 transition-colors last:border-0 hover:bg-raised focus-visible:bg-raised"
                    >
                      <td className="adm-nums px-4 py-2.5 align-top text-[0.75rem] whitespace-nowrap text-secondary md:px-5">
                        <time dateTime={lead.createdAt}>{fmtStamp(lead.createdAt)}</time>
                      </td>
                      <td className="px-2 py-2.5 align-top">
                        <KindPill kind={lead.kind} />
                      </td>
                      <td className="max-w-0 px-2 py-2.5 align-top text-[0.8125rem]">
                        <span className="block truncate" title={lead.name}>
                          {lead.name || "—"}
                        </span>
                      </td>
                      <td className="max-w-0 px-2 py-2.5 align-top text-[0.8125rem]">
                        <EmailCell email={lead.email} />
                        {lead.phone && (
                          <a
                            href={`tel:${lead.phone}`}
                            className="adm-nums mt-0.5 block truncate text-[0.75rem] text-secondary underline decoration-line-2 underline-offset-2 hover:decoration-[var(--accent)]"
                          >
                            {lead.phone}
                          </a>
                        )}
                      </td>
                      <td className="px-2 py-2.5 pr-4 align-top md:pr-5">
                        <Details lead={lead} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* TELEFON. Carduri, nu un tabel care se derulează orizontal: cinci
                coloane pe 390px înseamnă ori text de 8px, ori o coloană
                vizibilă din cinci. */}
            <ul className="divide-y divide-line md:hidden">
              {rows.map((lead) => (
                <li
                  key={lead.id || `${lead.kind}-${lead.createdAt}-${lead.name}`}
                  {...rowProps(lead)}
                  className="cursor-pointer px-4 py-3 focus-visible:bg-raised"
                >
                  <div className="flex items-center justify-between gap-2">
                    <KindPill kind={lead.kind} />
                    <time
                      dateTime={lead.createdAt}
                      className="adm-nums text-[0.6875rem] whitespace-nowrap text-tinted"
                    >
                      {fmtStamp(lead.createdAt)}
                    </time>
                  </div>
                  <p className="mt-2 truncate text-[0.875rem]">{lead.name || "—"}</p>
                  <p className="mt-0.5 text-[0.8125rem]">
                    <EmailCell email={lead.email} />
                  </p>
                  {lead.phone && (
                    <p className="adm-nums mt-0.5 text-[0.8125rem] text-secondary">
                      <a href={`tel:${lead.phone}`} className="underline decoration-line-2 underline-offset-2">
                        {lead.phone}
                      </a>
                    </p>
                  )}
                  <div className="mt-1.5">
                    <Details lead={lead} />
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </Panel>
      <AnimatePresence>{open && <LeadDrawer lead={open} onClose={close} />}</AnimatePresence>
    </motion.div>
  );
}

/** Cap de coloană. Sortabil doar dacă primește `onClick`; `aria-sort` e pus
    pentru ca o tehnologie de asistare să anunțe sortarea, nu doar săgeata. */
function Th({
  children,
  width,
  sorted,
  onClick,
}: {
  children: React.ReactNode;
  width?: string;
  sorted?: SortDir | null;
  onClick?: () => void;
}) {
  return (
    <th
      scope="col"
      style={width ? { width } : undefined}
      aria-sort={sorted ? (sorted === "asc" ? "ascending" : "descending") : undefined}
      className="px-2 py-2.5 font-normal first:pl-4 last:pr-4 md:first:pl-5 md:last:pr-5"
    >
      {onClick ? (
        <button
          type="button"
          onClick={onClick}
          className="inline-flex items-center gap-1 uppercase transition-colors hover:text-foreground"
          style={sorted ? { color: "var(--foreground)" } : undefined}
        >
          {children}
          {/* Săgeata există mereu, estompată când coloana nu e cea activă: așa
              se vede CARE coloane se pot sorta fără să treci cu mouse-ul
              peste fiecare. */}
          <span aria-hidden className={sorted ? "opacity-100" : "opacity-30"}>
            {sorted === "asc" ? "↑" : "↓"}
          </span>
        </button>
      ) : (
        children
      )}
    </th>
  );
}

function Details({ lead }: { lead: Lead }) {
  const items = details(lead);
  if (items.length === 0 && lead.status !== "niche-taken") {
    return <span className="text-[0.8125rem] text-tinted">—</span>;
  }
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[0.8125rem]">
      {lead.status === "niche-taken" && (
        <span
          className="rounded-full border px-2 py-0.5 text-[0.625rem] whitespace-nowrap"
          style={{ borderColor: "var(--adm-down)", color: "var(--adm-down)" }}
        >
          nișă ocupată
        </span>
      )}
      {items.map((item) => (
        <span key={item.label} className="inline-flex max-w-full items-baseline gap-1">
          <span className="text-[0.625rem] whitespace-nowrap text-tinted">{item.label}</span>
          {item.href ? (
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer noopener"
              className="truncate underline decoration-line-2 underline-offset-2 hover:decoration-[var(--accent)]"
              title={item.value}
            >
              {item.value}
            </a>
          ) : (
            <span className="truncate" title={item.value}>
              {item.value}
            </span>
          )}
        </span>
      ))}
    </div>
  );
}

const stampFull = new Intl.DateTimeFormat("ro-RO", {
  dateStyle: "long",
  timeStyle: "medium",
  timeZone: "Europe/Bucharest",
});

const extUrl = (v: string) => (v.startsWith("http") ? v : `https://${v}`);

/** Sertarul cu tot ce a trimis persoana. Există pentru `goal`: tabelul îl
    căuta, dar nu-l arăta nicăieri, deci mesajul real nu se putea citi. */
function LeadDrawer({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const titleId = useId();
  const panel = useRef<HTMLElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();
  /* `onClose` ținut într-un ref: dacă ar fi dependență, orice re-randare a
     tabelului ar rula efectul din nou și ar fura focusul înapoi pe buton. */
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  /* Focusul intră pe butonul de închidere: e singurul element sigur prezent
     la orice lead. Escape stă pe document, nu pe un element, ca să meargă
     oriunde ar fi focusul în sertar. */
  useEffect(() => {
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeRef.current();
        return;
      }
      /* Cu aria-modal, Tab nu trebuie să scape în pagina de dedesubt. */
      if (e.key !== "Tab" || !panel.current) return;
      const f = panel.current.querySelectorAll<HTMLElement>("a[href],button");
      if (f.length === 0) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const link = "underline decoration-line-2 underline-offset-2 hover:decoration-[var(--accent)]";
  const t = Date.parse(lead.createdAt);
  const fields: { label: string; node: React.ReactNode }[] = [
    { label: "nume", node: lead.name },
    {
      label: "email",
      node: lead.email && (
        <a href={`mailto:${lead.email}`} className={link}>
          {lead.email}
        </a>
      ),
    },
    {
      label: "telefon",
      node: lead.phone && (
        <a href={`tel:${lead.phone}`} className={link}>
          {lead.phone}
        </a>
      ),
    },
    { label: "business", node: lead.business },
    { label: "oraș", node: lead.city },
    { label: "nișă", node: lead.niche },
    { label: "buget", node: lead.budget },
    {
      label: "website",
      node: lead.website && (
        <a href={extUrl(lead.website)} target="_blank" rel="noreferrer noopener" className={`${link} break-all`}>
          {lead.website}
        </a>
      ),
    },
    {
      label: "site analizat",
      node: lead.url && (
        <a href={extUrl(lead.url)} target="_blank" rel="noreferrer noopener" className={`${link} break-all`}>
          {lead.url}
        </a>
      ),
    },
    { label: "pagină", node: lead.page },
    { label: "limbă", node: lead.locale },
    /* Doar nișa ocupată merită un rând. Celălalt status, „received", e
       valoarea internă a cazului normal: în engleză, și fără nimic de spus
       cuiva care tocmai a deschis lead-ul. */
    {
      label: "status",
      node:
        lead.status === "niche-taken" ? (
          <span style={{ color: "var(--adm-down)" }}>nișă ocupată</span>
        ) : null,
    },
  ];

  return (
    <>
      <motion.div
        aria-hidden
        className="fixed inset-0 z-40 bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduce ? 0 : 0.2 }}
        onClick={onClose}
      />
      <motion.aside
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-line bg-background shadow-2xl"
        initial={reduce ? { opacity: 0 } : { x: "100%" }}
        animate={reduce ? { opacity: 1 } : { x: 0 }}
        exit={reduce ? { opacity: 0 } : { x: "100%" }}
        transition={{ duration: reduce ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <header className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div className="min-w-0">
            <KindPill kind={lead.kind} />
            <h2 id={titleId} className="mt-2 text-[1rem] break-words">
              {lead.name || lead.email || "Lead"}
            </h2>
            <time dateTime={lead.createdAt} className="adm-nums mt-0.5 block text-[0.75rem] text-tinted">
              {Number.isNaN(t) ? lead.createdAt : stampFull.format(t)}
            </time>
          </div>
          <button
            ref={closeBtn}
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full border border-line px-3 py-1 text-[0.75rem] text-secondary transition-colors hover:text-foreground"
          >
            Închide
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-4 text-[0.875rem]">
          {/* Mesajul primul și întreg, cu rândurile păstrate: pentru el s-a
              făcut sertarul. Contact și audit nu au `goal`, deci golul nu e o
              eroare - se spune explicit, în loc să dispară secțiunea. */}
          <h3 className="text-[0.625rem] tracking-[0.04em] text-tinted uppercase">Mesaj / obiectiv</h3>
          {lead.goal ? (
            <p className="mt-1.5 break-words whitespace-pre-wrap">{lead.goal}</p>
          ) : (
            <p className="mt-1.5 text-tinted">Nu a scris niciun mesaj.</p>
          )}
          <dl className="mt-5 space-y-3 border-t border-line pt-4">
            {fields
              .filter((f) => f.node)
              .map((f) => (
                <div key={f.label}>
                  <dt className="text-[0.625rem] tracking-[0.04em] text-tinted uppercase">{f.label}</dt>
                  <dd className="mt-0.5 break-words">{f.node}</dd>
                </div>
              ))}
          </dl>
        </div>
      </motion.aside>
    </>
  );
}
