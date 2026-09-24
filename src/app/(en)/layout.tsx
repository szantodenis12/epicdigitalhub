import type { Metadata } from "next";
import { Shell, buildMetadata } from "../shell";

/* English is the default locale and is served from `/` with no prefix.
   This route group exists solely to give it its own <html lang="en">. */
export const metadata: Metadata = buildMetadata("en");

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return <Shell locale="en">{children}</Shell>;
}
