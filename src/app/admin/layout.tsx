import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import "./admin.css";
import { THEME_ATTR, THEME_SCRIPT, DEFAULT_THEME } from "../_admin/ui/theme-script";

/* ============================================================================
   Rădăcina panoului.

   E un ROOT layout, nu unul imbricat: proiectul nu are src/app/layout.tsx,
   pentru că (en) și (ro) au nevoie fiecare de propriul <html lang>. Orice
   layout fără altul deasupra e o rădăcină, deci acesta trebuie să scrie el
   <html> și <body> - și, bonus, înseamnă că panoul nu moștenește absolut
   nimic din shell-ul site-ului: nici preloaderul, nici Google Tag Manager,
   nici bannerul de cookie-uri, nici schema Organization. Niciunul nu are ce
   căuta pe un ecran intern, iar un panou măsurat de GTM ar polua statisticile
   site-ului cu sesiunile proprietarului.

   Layout-ul NU desenează cadrul panoului (bara laterală, antetul). Îl desenează
   page.tsx, pentru că acest layout învelește și /admin/login - pagina de
   parolă, care e a porții - iar un formular de login într-un cadru cu navigație
   către secțiuni inexistente ar fi absurd. Aici rămâne doar ce e comun
   amândurora: fontul, tema, CSS-ul.
   ========================================================================= */

/* Același BDO Grotesk ca site-ul, din aceleași fișiere, pe aceeași variabilă:
   `--font-grotesk` e ce citesc `body` din globals.css și tokenul `font-sans`
   din @theme. O a doua instanță a `localFont` (în loc de cea din shell.tsx)
   pentru că aceea nu e exportată, iar panoul e un alt arbore de rădăcină -
   next/font deduplichează oricum fișierele servite. */
const grotesk = localFont({
  variable: "--font-grotesk",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
  src: [
    { path: "../../../public/fonts/BDOGrotesk-Light.woff2", weight: "300", style: "normal" },
    { path: "../../../public/fonts/BDOGrotesk-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../../public/fonts/BDOGrotesk-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../../public/fonts/BDOGrotesk-DemiBold.woff2", weight: "600", style: "normal" },
    { path: "../../../public/fonts/BDOGrotesk-Bold.woff2", weight: "700", style: "normal" },
  ],
});

/* `noindex` e pus și de src/proxy.ts, ca antet HTTP, pe tot ce trece prin
   matcher. Se repetă aici ca meta: dacă poarta e vreodată mutată sau
   matcher-ul restrâns, pagina rămâne în afara indexului prin ea însăși. */
export const metadata: Metadata = {
  title: "Panou lead-uri | Epic Digital Hub",
  description: "Panou intern.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ro"
      /* Valoarea implicită e scrisă în markup, nu lăsată pe seama scriptului:
         cu JS blocat panoul rămâne pe tema întunecată, nu pe una fără tokeni.
         Scriptul o înlocuiește înainte de prima pictare dacă e salvată alta. */
      {...{ [THEME_ATTR]: DEFAULT_THEME }}
      className={`${grotesk.variable} h-full antialiased`}
      /* Scriptul de mai jos schimbă atributul înainte ca React să hidrateze,
         deci <html> din browser poartă legitim altă valoare decât cea trimisă
         de server. Exact cazul pentru care există `suppressHydrationWarning`. */
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">{children}</body>
    </html>
  );
}
