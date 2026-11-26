"use client";

/* ============================================================================
   Comutatorul de temă.

   Nu ține tema în state React și nu o dă mai departe prin context: singura
   sursă de adevăr e atributul de pe <html>, pus de scriptul pre-pictare și
   citit de CSS. State-ul de aici e doar ce scrie pe buton, iar el se
   inițializează din același atribut.

   Un segment cu două butoane, nu un întrerupător: la un întrerupător nu se
   vede niciodată care e starea curentă fără să înveți convenția, iar panoul e
   folosit de o singură persoană care nu are chef să o învețe.
   ========================================================================= */

import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import {
  DEFAULT_THEME,
  THEME_ATTR,
  THEME_COOKIE,
  THEME_COOKIE_MAX_AGE,
  THEME_KEY,
  type AdminTheme,
} from "./theme-script";

/* `useLayoutEffect` avertizează când e randat pe server, iar componenta asta
   ESTE randată pe server (e un client component dintr-o pagină SSR). Varianta
   izomorfă e tiparul obișnuit și singurul care rulează înainte de pictare în
   browser fără să scrie în consolă pe server. */
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function readTheme(): AdminTheme {
  if (typeof document === "undefined") return DEFAULT_THEME;
  return document.documentElement.getAttribute(THEME_ATTR) === "light" ? "light" : "dark";
}

export function ThemeToggle() {
  /* Inițializat pe valoarea implicită și pe server și la prima randare din
     browser: altfel markup-ul trimis de server ar diferi de prima randare
     hidratată. Valoarea reală intră în efectul de mai jos, înainte de pictare. */
  const [theme, setTheme] = useState<AdminTheme>(DEFAULT_THEME);

  useIsoLayoutEffect(() => {
    /* Două treburi într-un singur efect, pentru că sunt aceeași treabă.

       Prima: sincronizează butonul cu atributul pus de scriptul pre-pictare.

       A doua: pune atributul ÎNAPOI. În dev, remontarea din Strict Mode
       resetează <html> la atributele care vin din JSX și șterge exact atributul
       pe care scriptul l-a scris - panoul s-ar deschide pe întuneric chiar
       dacă e salvată tema deschisă. În producție e o scriere inutilă și
       inofensivă. (Documentat în ghidul Next "Preventing Flash".) */
    const current = readTheme();
    setTheme(current);
    document.documentElement.setAttribute(THEME_ATTR, current);
  }, []);

  const apply = useCallback((next: AdminTheme) => {
    document.documentElement.setAttribute(THEME_ATTR, next);
    setTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* localStorage blocat: rămâne cookie-ul, care e scris oricum mai jos. */
    }
    /* `SameSite=Lax`, fără `Secure`: trebuie să funcționeze și pe
       http://localhost în dev. Nu e un cookie de sesiune și nu conține nimic
       personal - doar "dark" sau "light". */
    document.cookie = `${THEME_COOKIE}=${next}; path=/admin; max-age=${THEME_COOKIE_MAX_AGE}; SameSite=Lax`;
  }, []);

  return (
    <div
      role="group"
      aria-label="Tema panoului"
      /* Sina e mai INCHISA decat cardul si pastila activa mai deschisa, in
         ambele teme: o selectie care se "ridica" se citeste la fel si pe
         negru, si pe hartie. Invers - pastila mai inchisa decat sina - mergea
         pe intuneric si arata ca un buton apasat pe deschis. */
      className="inline-flex items-center rounded-full border border-line bg-background p-0.5"
    >
      {(
        [
          ["dark", "Întunecat", <MoonIcon key="m" />],
          ["light", "Deschis", <SunIcon key="s" />],
        ] as const
      ).map(([value, label, icon]) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => apply(value)}
            aria-pressed={active}
            title={label}
            className={`flex h-7 w-8 items-center justify-center rounded-full transition-colors duration-200 ${
              active
                ? "bg-raised text-foreground"
                : "text-tinted hover:text-secondary"
            }`}
          >
            {icon}
            <span className="sr-only">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* Iconițele sunt desenate aici, în `currentColor` și pe o grilă de 16, ca
   restul panoului: proiectul nu are bibliotecă de iconițe și nu e cazul să
   intre una pentru două forme. */
function MoonIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className="h-3.5 w-3.5">
      <path
        d="M13.2 10.1A5.6 5.6 0 0 1 6 2.9a5.7 5.7 0 1 0 7.2 7.2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className="h-3.5 w-3.5">
      <circle cx="8" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <g stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
        <path d="M8 1.4v1.6M8 13v1.6M1.4 8h1.6M13 8h1.6M3.3 3.3l1.1 1.1M11.6 11.6l1.1 1.1M12.7 3.3l-1.1 1.1M4.4 11.6l-1.1 1.1" />
      </g>
    </svg>
  );
}
