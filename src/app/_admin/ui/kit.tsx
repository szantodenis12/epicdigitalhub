"use client";

/* ============================================================================
   Piesele mici din care e făcut panoul: cardul, pastila, contorul care urcă,
   variația față de perioada dinainte, celula de email.

   Separate de secțiunile mari pentru același motiv pentru care _components/ui.tsx
   e separat de site.tsx: un card al panoului trebuie să fie ACELAȘI card în
   toate cele șase locuri unde apare, nu șase care seamănă.

   Tot ce ține de mișcare se uită la `usePrefersReducedMotion` - hook-ul
   site-ului, nu unul nou: e un `useSyncExternalStore` cu instantaneu de server
   `false`, deci randarea pe server e mereu "cu mișcare", iar React re-randează
   singur cu valoarea reală imediat după hidratare. Asta e și motivul pentru
   care starea inițială a contoarelor e 0 și pe server: altfel markup-ul de pe
   server și prima randare din browser ar diferi.
   ========================================================================= */

import { useEffect, useRef, useState } from "react";
import { animate } from "motion/react";
import { LEAD_LABEL, type LeadKind } from "../types";

/* ============================================================================
   CULORI ȘI FORMATE
   ========================================================================= */

/** Culoarea fiecărui formular, prin variabilele din admin.css, ca aceeași
    componentă să se schimbe singură între teme fără o a doua hartă. */
export const KIND_COLOR: Record<LeadKind, string> = {
  contact: "var(--adm-contact)",
  audit: "var(--adm-audit)",
  apply: "var(--adm-apply)",
};

/* Ordinea în care cele trei serii se suprapun în grafice, și singura folosită
   în tot panoul. Nu e alfabetică și nu e cea din tip: ambră-albastru-verde pune
   perechile cele mai depărtate una lângă alta (vezi comentariul paletei din
   admin.css), iar o stivă în care două segmente vecine seamănă e o stivă pe
   care nimeni nu o poate citi. */
export const KIND_ORDER: LeadKind[] = ["contact", "audit", "apply"];

const nf = new Intl.NumberFormat("ro-RO");
/** Numere cu separatorul de mii românesc. */
export const fmtNum = (n: number) => nf.format(n);

const rtf = new Intl.RelativeTimeFormat("ro", { numeric: "auto" });
/** "acum 3 ore", "ieri". Pragurile sunt cele pe care le-ar spune un om:
    sub un minut nimeni nu zice "acum 40 de secunde". */
export function fmtRelative(iso: string, now = Date.now()): string {
  const at = Date.parse(iso);
  if (Number.isNaN(at)) return "—";
  const sec = Math.round((at - now) / 1000);
  const abs = Math.abs(sec);
  if (abs < 60) return "acum";
  if (abs < 3600) return rtf.format(Math.round(sec / 60), "minute");
  if (abs < 86_400) return rtf.format(Math.round(sec / 3600), "hour");
  if (abs < 2_592_000) return rtf.format(Math.round(sec / 86_400), "day");
  return rtf.format(Math.round(sec / 2_592_000), "month");
}

const dtf = new Intl.DateTimeFormat("ro-RO", {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Bucharest",
});
/** Data completă, pe ceasul din Oradea - același fus pe care data.ts împarte
    zilele, altfel tabelul și graficul ar pune același lead în zile diferite. */
export function fmtStamp(iso: string): string {
  const at = Date.parse(iso);
  return Number.isNaN(at) ? "—" : dtf.format(at);
}

/** Eticheta scurtă a unei zile din serie: "14 nov". */
const dayLabel = new Intl.DateTimeFormat("ro-RO", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});
export const fmtDay = (isoDate: string) => dayLabel.format(Date.parse(`${isoDate}T12:00:00Z`));

/* ============================================================================
   CARDUL
   ========================================================================= */

/**
 * Panoul-cutie: suprafață, margine, radius. Totul în panou stă în unul.
 *
 * `title` și `right` sunt antetul, nu doi copii oarecare, pentru că fiecare
 * panou din referință are exact asta: un titlu la stânga și un control sau o
 * cifră la dreapta, pe aceeași linie de bază.
 */
export function Panel({
  title,
  hint,
  right,
  children,
  className = "",
  bodyClassName = "",
  id,
}: {
  title?: string;
  hint?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      /* `scroll-mt` pentru că navigația din bara laterală sare la aceste
         secțiuni, iar bara de sus e lipicioasă: fără margine de derulare,
         titlul ar ajunge sub ea. */
      className={`flex scroll-mt-24 flex-col rounded-card border border-line bg-surface ${className}`}
    >
      {(title || right) && (
        <header className="flex items-start justify-between gap-4 border-b border-line px-4 py-3.5 md:px-5">
          <div className="min-w-0">
            {title && (
              <h2 className="truncate text-[0.8125rem] font-medium tracking-[-0.01em]">{title}</h2>
            )}
            {hint && <p className="mt-0.5 truncate text-[0.6875rem] text-tinted">{hint}</p>}
          </div>
          {right && <div className="shrink-0">{right}</div>}
        </header>
      )}
      <div className={`flex-1 p-4 md:p-5 ${bodyClassName}`}>{children}</div>
    </section>
  );
}

/* ============================================================================
   PASTILA
   ========================================================================= */

/**
 * Eticheta colorată a unui formular. Culoarea e în chenar și în punct, nu în
 * umplere: trei pastile pline, pe un rând de activitate, ar fi trei pete de
 * culoare mai tari decât orice altceva de pe ecran - iar panoul are deja trei
 * serii colorate în grafice.
 *
 * Punctul NU e singurul purtător al informației: lângă el scrie numele
 * formularului. O pastilă care s-ar deosebi doar prin culoare nu s-ar deosebi
 * deloc pentru cine nu distinge nuanțele.
 */
export function KindPill({ kind, className = "" }: { kind: LeadKind; className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[0.6875rem] leading-5 whitespace-nowrap ${className}`}
      style={{ borderColor: KIND_COLOR[kind], color: KIND_COLOR[kind] }}
    >
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: KIND_COLOR[kind] }}
      />
      {LEAD_LABEL[kind]}
    </span>
  );
}

/* ============================================================================
   CONTORUL
   ========================================================================= */

/**
 * Numărul care urcă de la zero la valoarea lui.
 *
 * Scrie direct în `textContent`, nu prin `setState`: la 60 de cadre pe secundă
 * și patru carduri pe ecran, un `setState` per cadru ar re-randa de patru ori
 * subarborele cardului pentru o singură cifră. Tween-ul e `animate` din motion
 * (același pachet ca restul mișcării), nu un `requestAnimationFrame` scris de
 * mână, ca să asculte de aceeași clasă de ease ca toate celelalte.
 *
 * Valoarea finală e scrisă și în markup-ul randat pe server (`children` lipsă,
 * `defaultValue`), deci dacă JS nu rulează deloc cifra e corectă, nu zero.
 */
export function CountUp({
  value,
  duration = 0.75,
  delay = 0,
  className = "",
}: {
  value: number;
  duration?: number;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    /* Preferința e citită AICI, din media query, nu din
       `usePrefersReducedMotion`. Efectul rulează doar în browser, deci
       citirea e sigură și, mai important, e disponibilă din primul efect -
       pe când hook-ul (un `useSyncExternalStore` cu instantaneu de server
       `false`) ajunge la valoarea adevărată abia după ce contorul ar fi
       pornit deja de la zero. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.textContent = fmtNum(value);
      return;
    }
    const controls = animate(0, value, {
      duration,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        node.textContent = fmtNum(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [value, duration, delay]);

  /* `suppressHydrationWarning`: efectul de mai sus schimbă textul imediat după
     hidratare, iar React compară DOM-ul cu ce-a trimis serverul. */
  return (
    <span ref={ref} className={`adm-nums ${className}`} suppressHydrationWarning>
      {fmtNum(value)}
    </span>
  );
}

/* ============================================================================
   VARIAȚIA
   ========================================================================= */

/**
 * Cât s-a schimbat față de cele 30 de zile dinainte.
 *
 * Trei cazuri, nu unul: cu bază zero procentul ar fi infinit (orice lead nou
 * ar da "+∞%"), iar cu ambele zero nu s-a schimbat nimic și nu e nici creștere,
 * nici scădere. Se arată atunci cifra absolută, care e singurul lucru adevărat
 * care se poate spune.
 *
 * Direcția e scrisă și cu o săgeată și cu semn, nu doar cu verde și portocaliu.
 */
export function Delta({ now, before }: { now: number; before: number }) {
  const diff = now - before;
  const dir = diff === 0 ? "flat" : diff > 0 ? "up" : "down";
  const color =
    dir === "flat" ? "var(--text-tinted)" : dir === "up" ? "var(--adm-up)" : "var(--adm-down)";
  const pct = before > 0 ? Math.round((diff / before) * 100) : null;

  return (
    <span
      className="adm-nums inline-flex items-center gap-1 text-[0.6875rem] leading-5 whitespace-nowrap"
      style={{ color }}
      title={`${fmtNum(now)} în ultimele 30 de zile, ${fmtNum(before)} în cele 30 dinainte`}
    >
      <span aria-hidden>{dir === "flat" ? "→" : dir === "up" ? "↑" : "↓"}</span>
      {pct === null
        ? `${diff > 0 ? "+" : ""}${fmtNum(diff)}`
        : `${diff > 0 ? "+" : ""}${fmtNum(pct)}%`}
      <span className="text-tinted">vs. 30 zile</span>
    </span>
  );
}

/* ============================================================================
   EMAILUL
   ========================================================================= */

/**
 * Adresa, plus un buton care o pune în clipboard.
 *
 * Asta e coloana pentru care se deschide panoul, deci adresa e și link `mailto`
 * (un clic = un email) și text de copiat (un clic = adresa în clipboard), nu
 * una sau alta. Confirmarea e pe buton, în loc de pe adresă, ca textul să nu
 * se schimbe sub cursor și să nu mute coloana.
 *
 * `/api/apply` nu cere email (vezi _admin/data.ts), deci la aplicații câmpul e
 * gol - și se arată gol, cu o liniuță, nu ca un buton care nu copiază nimic.
 */
export function EmailCell({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 1400);
    return () => window.clearTimeout(t);
  }, [copied]);

  if (!email) return <span className="text-tinted">—</span>;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      /* Fără permisiune pe clipboard (sau pe http) rămâne link-ul mailto și
         selecția manuală; un mesaj de eroare aici nu ajută pe nimeni. */
    }
  };

  return (
    <span className="group/mail inline-flex max-w-full items-center gap-1.5">
      <a
        href={`mailto:${email}`}
        title={email}
        className="truncate underline decoration-line-2 underline-offset-2 transition-colors hover:decoration-[var(--accent)]"
      >
        {email}
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copiază ${email}`}
        /* Vizibil mereu, doar estompat: ascuns pana la hover, butonul exista
           doar pentru cine stie deja ca exista - iar copierea adresei e exact
           lucrul pentru care se deschide tabelul. */
        className="shrink-0 rounded-sm border border-line px-1.5 py-0.5 text-[0.625rem] text-tinted opacity-55 transition-[opacity,color,border-color] group-hover/mail:opacity-100 hover:border-line-2 hover:text-foreground focus-visible:opacity-100"
        style={copied ? { color: "var(--accent)", borderColor: "var(--accent)" } : undefined}
      >
        {copied ? "copiat" : "copiază"}
      </button>
    </span>
  );
}

/* ============================================================================
   RÂNDUL DE LISTĂ COMPACTĂ
   ========================================================================= */

/**
 * Un rând din topurile mici: etichetă, o bară proporțională dedesubt, cifra la
 * dreapta.
 *
 * Bara e un fundal, nu un grafic separat: la opt rânduri și patru liste, opt
 * grafice cu axe ar fi mai multă cromă decât date. Lățimea e raportată la
 * MAXIMUL listei, nu la total - raportul la total face ca o listă cu multe
 * categorii mici să arate ca patru linii aproape invizibile.
 */
export function ListRow({
  label,
  value,
  max,
  accent = "var(--border-secondary)",
}: {
  label: string;
  value: number;
  max: number;
  accent?: string;
}) {
  const pct = max > 0 ? Math.max(2, Math.round((value / max) * 100)) : 0;
  return (
    <li className="relative flex items-center justify-between gap-3 py-1.5">
      <span
        aria-hidden
        className="absolute inset-y-0.5 left-0 rounded-sm opacity-[0.22]"
        style={{ width: `${pct}%`, background: accent }}
      />
      <span className="relative min-w-0 truncate text-[0.8125rem] text-secondary" title={label}>
        {label}
      </span>
      <span className="adm-nums relative shrink-0 text-[0.8125rem] tabular-nums">
        {fmtNum(value)}
      </span>
    </li>
  );
}
