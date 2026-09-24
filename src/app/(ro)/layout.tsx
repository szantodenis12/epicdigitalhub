import type { Metadata } from "next";
import { Shell, buildMetadata } from "../shell";

/* Romanian lives at /ro. A SEPARATE root layout, not a nested one: `<html lang>`
   has to be right in the server-rendered markup, and a nested layout cannot
   re-render <html>. Next.js allows one root layout per route group.

   The documented trade-off is that navigating between the two groups is a full
   page load rather than a client transition. For a language switch that is
   correct anyway - the whole document, including `lang`, has to change. */
export const metadata: Metadata = buildMetadata("ro");

export default function RoLayout({ children }: { children: React.ReactNode }) {
  return <Shell locale="ro">{children}</Shell>;
}
