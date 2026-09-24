"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import { COPY, type Copy, type Locale } from "../content";

/* Copy is read through context rather than threaded as props: the sections are
   separate components several levels down, and prop-drilling one dictionary
   through all of them would touch every signature for no benefit. */
const CopyContext = createContext<Copy>(COPY.en);
const LocaleContext = createContext<Locale>("en");
/** The current page's locale-independent path ("" on the home page), so the
    language toggle can point at the SAME page in the other locale. */
const PathContext = createContext("");

export const useCopy = () => useContext(CopyContext);
export const useLocale = () => useContext(LocaleContext);
export const usePagePath = () => useContext(PathContext);

export function SiteProviders({
  locale,
  path = "",
  children,
}: {
  locale: Locale;
  path?: string;
  children: React.ReactNode;
}) {
  return (
    <CopyContext.Provider value={COPY[locale]}>
      <LocaleContext.Provider value={locale}>
        <PathContext.Provider value={path}>{children}</PathContext.Provider>
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
