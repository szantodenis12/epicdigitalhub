"use client";

/* ============================================================================
   Cadrul panoului: bara laterală, bara de sus, sertarul de pe telefon.

   Structura e cea din referința "Prodex": navigație grupată la stânga, blocul
   de utilizator în josul ei, antet subțire deasupra conținutului. Ce NU e
   preluat e aspectul - fără mov deschis, fără umbre moi, fără card alb pe gri:
   suprafețele, liniile și tipografia sunt ale site-ului.

   Navigația nu e decorativă. Panoul e o singură pagină (toate datele vin
   dintr-un singur `getAdminData`, deci a le împărți pe rute ar însemna să se
   citească de patru ori aceeași bază), așa că elementele de nav sunt ancore
   către secțiuni, iar cel activ e dat de ce se vede pe ecran - nu de ruta
   curentă, care nu se schimbă niciodată.
   ========================================================================= */

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogoMark } from "../../logo";
import { ThemeToggle } from "./theme";

/* Secțiunile, grupate ca în referință. `id`-urile sunt cele puse pe panouri în
   panels.tsx / charts.tsx / leads-table.tsx - dacă unul se schimbă acolo,
   ancora de aici duce în gol, deci sunt în aceeași ordine ca pe pagină. */
const NAV: { group: string; items: { id: string; label: string }[] }[] = [
  {
    group: "Privire de ansamblu",
    items: [
      { id: "sumar", label: "Sumar" },
      { id: "evolutie", label: "Evoluție" },
      { id: "distributie", label: "Distribuție" },
    ],
  },
  {
    group: "Lead-uri",
    items: [
      { id: "activitate", label: "Activitate" },
      { id: "public", label: "Limbă și nișe" },
      { id: "topuri", label: "Topuri" },
      { id: "lead-uri", label: "Tabel complet" },
    ],
  },
];

const SECTION_IDS = NAV.flatMap((g) => g.items.map((i) => i.id));

/**
 * Care secțiune se vede acum.
 *
 * `IntersectionObserver`, nu un ascultător de `scroll`: un ascultător ar rula
 * la fiecare cadru al derulării și ar chema `getBoundingClientRect` pe șapte
 * secțiuni de fiecare dată. `rootMargin` taie din partea de sus exact cât ține
 * bara lipicioasă, și din cea de jos atât cât să nu fie trei secțiuni
 * "vizibile" simultan - altfel elementul activ ar sări înainte și înapoi.
 */
function useActiveSection() {
  const [active, setActive] = useState(SECTION_IDS[0]);
  useEffect(() => {
    const nodes = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (n): n is HTMLElement => !!n,
    );
    if (!nodes.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        /* Cea mai de SUS dintre cele care intersectează. Fără asta, când două
           panouri sunt pe ecran, câștigă ultimul care a raportat - adică
           ordinea evenimentelor, nu ordinea paginii. */
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-72px 0px -55% 0px", threshold: 0 },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
  return active;
}

export function AdminShell({
  storageOk,
  children,
}: {
  storageOk: boolean;
  children: React.ReactNode;
}) {
  const [drawer, setDrawer] = useState(false);
  const active = useActiveSection();

  /* Sertarul se închide la Escape și când se lărgește ecranul peste `lg`,
     unde bara laterală e oricum fixă: altfel o rotire de telefon lasă un
     sertar deschis peste o bară laterală care s-a întors singură. */
  useEffect(() => {
    if (!drawer) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawer(false);
    };
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setDrawer(false);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onChange);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onChange);
    };
  }, [drawer]);

  return (
    <div className="flex min-h-screen">
      {/* BARA LATERALĂ, desktop. `sticky` + `h-screen`, nu `fixed`: așa rămâne
          în fluxul grilei și conținutul nu are nevoie de un `margin-left`
          egal cu lățimea ei, care e felul în care o bară fixă se dezlipește de
          layout la prima schimbare de lățime. */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-line bg-surface lg:flex">
        <SidebarContent active={active} onNavigate={() => {}} />
      </aside>

      {/* SERTARUL, telefon. Randat mereu, tradus în afara ecranului când e
          închis, ca deschiderea să fie o tranziție și nu o montare. */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${drawer ? "" : "pointer-events-none"}`}
        aria-hidden={!drawer}
      >
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
            drawer ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setDrawer(false)}
        />
        <aside
          className={`absolute inset-y-0 left-0 flex w-64 max-w-[82vw] flex-col border-r border-line bg-surface transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            drawer ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SidebarContent active={active} onNavigate={() => setDrawer(false)} />
        </aside>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* BARA DE SUS. Lipicioasă, cu fundal opac: pe sub ea trec carduri, iar
            un antet translucid peste un card ar arăta două texte suprapuse. */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-background px-4 md:px-6">
          <button
            type="button"
            onClick={() => setDrawer(true)}
            aria-label="Deschide navigația"
            aria-expanded={drawer}
            className="-ml-1 flex h-9 w-9 items-center justify-center rounded-md text-secondary transition-colors hover:text-foreground lg:hidden"
          >
            <svg viewBox="0 0 16 16" aria-hidden className="h-4 w-4">
              <path
                d="M2 4h12M2 8h12M2 12h12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[0.875rem] font-medium tracking-[-0.01em]">
              Lead-uri
            </h1>
          </div>

          <StorageBadge ok={storageOk} />
          <ThemeToggle />
        </header>

        <main className="min-w-0 flex-1 px-4 py-4 md:px-6 md:py-6">{children}</main>
      </div>
    </div>
  );
}

function SidebarContent({
  active,
  onNavigate,
}: {
  active: string;
  onNavigate: () => void;
}) {
  /* Cine e conectat; vezi blocul de utilizator mai jos. */
  const [who, setWho] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  useEffect(() => {
    fetch("/admin/logout/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((u: { email: string; role: string } | null) => {
        if (u) {
          setWho(u.email);
          setRole(u.role);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-line px-5">
        <LogoMark className="h-4 w-auto" title="Epic Digital Hub" />
        <span className="text-[0.625rem] tracking-[0.12em] text-tinted uppercase">panou</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {NAV.map((group) => (
          <div key={group.group} className="mb-5 last:mb-0">
            <p className="px-2 pb-1.5 text-[0.625rem] tracking-[0.1em] text-tinted uppercase">
              {group.group}
            </p>
            <ul>
              {group.items.map((item) => {
                const isActive = active === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={onNavigate}
                      aria-current={isActive ? "true" : undefined}
                      className={`relative flex items-center rounded-md py-1.5 pr-2 pl-3 text-[0.8125rem] transition-colors duration-200 ${
                        isActive
                          ? "bg-raised text-foreground"
                          : "text-secondary hover:bg-raised hover:text-foreground"
                      }`}
                    >
                      {/* Marcajul elementului activ e o RIGLĂ în accent, nu un
                          fond în accent: accentul e evidențiere, nu umplere -
                          aceeași regulă pe care o ține și comutatorul de limbă
                          al site-ului. */}
                      <span
                        aria-hidden
                        className="absolute top-1.5 bottom-1.5 left-0 w-0.5 rounded-full transition-opacity duration-200"
                        style={{
                          background: "var(--accent)",
                          opacity: isActive ? 1 : 0,
                        }}
                      />
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* BLOCUL DE UTILIZATOR, în josul barei, ca în referință.
          Identitatea vine de la /admin/logout/me (pagina nu e a bării, deci nu
          o primim ca prop); până răspunde, bara arată un placeholder. "Ieși"
          duce la /admin/logout, care închide sesiunea Supabase. */}
      <div className="shrink-0 border-t border-line p-3">
        <div className="flex items-center gap-2.5 rounded-md px-2 py-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line-2 text-[0.6875rem] font-medium">
            {(who ?? "EDH").slice(0, 2).toUpperCase()}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[0.75rem]" title={who ?? undefined}>
              {who ?? "Epic Digital Hub"}
            </span>
            <span className="block truncate text-[0.625rem] text-tinted">
              {role === "admin" ? "administrator" : role ? "membru" : " "}
            </span>
          </span>
        </div>
        <div className="mt-1 flex items-center gap-1 px-2">
          {/* `Link`, nu `<a>`: amândouă duc la o pagină a aplicației. Trecerea
              între două layout-uri de rădăcină e oricum o încărcare completă -
              Next o face singur - dar `Link` e cel care știe asta. */}
          <Link
            href="/"
            className="text-[0.6875rem] text-tinted transition-colors hover:text-foreground"
          >
            Vezi site-ul
          </Link>
          <span aria-hidden className="text-tinted opacity-40">
            ·
          </span>
          <Link
            href="/admin/logout"
            className="text-[0.6875rem] text-tinted transition-colors hover:text-foreground"
          >
            Ieși
          </Link>
        </div>
      </div>
    </>
  );
}

/** Starea stocării, în bara de sus. Verde discret când e în regulă, pastilă
    de avertizare când nu - panoul desenează zerouri numai dacă sunt zerouri
    adevărate, iar diferența se citește de aici. */
function StorageBadge({ ok }: { ok: boolean }) {
  return (
    <span
      className="hidden items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.625rem] whitespace-nowrap sm:inline-flex"
      style={{
        borderColor: ok ? "var(--border-main)" : "var(--adm-down)",
        color: ok ? "var(--text-tinted)" : "var(--adm-down)",
      }}
      title={
        ok
          ? "Lead-urile se citesc din stocare."
          : "Nici baza de date, nici fișierele locale nu răspund: panoul nu are de unde citi."
      }
    >
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: ok ? "var(--accent)" : "var(--adm-down)" }}
      />
      {ok ? "stocare activă" : "fără stocare"}
    </span>
  );
}
