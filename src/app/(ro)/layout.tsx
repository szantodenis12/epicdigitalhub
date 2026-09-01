import type { Metadata } from "next";
import { Shell, buildMetadata } from "../shell";

/* Romanian is the default locale and is served from `/` with no prefix.
   This route group exists solely to give it its own <html lang="ro">. */
export const metadata: Metadata = buildMetadata("ro");

export default function RoLayout({ children }: { children: React.ReactNode }) {
  return <Shell locale="ro">{children}</Shell>;
}
