"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import { COPY, type Copy, type Locale } from "../content";

/* Copy is read through context rather than threaded as props: the sections are
   separate components several levels down, and prop-drilling one dictionary
   through all of them would touch every signature for no benefit. */
const CopyContext = createContext<Copy>(COPY.en);
const LocaleContext = createContext<Locale>("en");
/** The current page's locale-independent path ("" on the home page), per locale,
    so the language toggle can point at the SAME page in the other locale. Un
    singur string nu ajunge: paginile legale au slug diferit în RO ("/privacy"
    vs "/confidentialitate"), iar slug-ul limbii curente nu există în cealaltă. */
export type PagePaths = Record<Locale, string>;
const PathContext = createContext<PagePaths>({ en: "", ro: "" });

export const useCopy = () => useContext(CopyContext);
export const useLocale = () => useContext(LocaleContext);
export const usePagePath = () => useContext(PathContext);

export function SiteProviders({
  locale,
  path = "",
  paths,
  children,
}: {
  locale: Locale;
  path?: string;
  /** Doar pentru paginile cu slug localizat; restul folosesc `path` în ambele limbi. */
  paths?: PagePaths;
  children: React.ReactNode;
}) {
  return (
    <CopyContext.Provider value={COPY[locale]}>
      <LocaleContext.Provider value={locale}>
        <PathContext.Provider value={paths ?? { en: path, ro: path }}>{children}</PathContext.Provider>
      </LocaleContext.Provider>
    </CopyContext.Provider>
  );
}

/* ============================================================================
   HOOKS
   ========================================================================= */

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}
function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function getReducedMotionServerSnapshot() {
  return false;
}
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
}
