import type { Metadata } from "next";
/* Importat aici, nu moștenit: /admin e în afara celor două route group-uri cu
   layout rădăcină, iar login-ul trebuie să arate ca site-ul chiar dacă
   layout-ul panoului încă nu există sau nu aduce stilurile. Bundler-ul
   deduplică importul dacă îl face și layout-ul. */
import "../../globals.css";
import { login } from "./actions";

/* Pagina de login a panoului. Intenționat sobră: un câmp, un buton, paleta
   întunecată a site-ului și nimic altceva. Nu e o pagină de marketing, iar
   partea desenată a panoului se face în altă parte - aici singura cerință e
   să nu scoată nimic în față până nu e cineva înăuntru.

   `robots` ca plasă de siguranță peste antetul X-Robots-Tag din proxy.ts: nici
   un crawler n-ar ajunge la ea oricum, dar un panou nu are ce căuta în index. */
export const metadata: Metadata = {
  title: "Autentificare | Panou",
  robots: { index: false, follow: false },
};

const MESAJE: Record<string, string> = {
  "1": "Parolă greșită.",
  "prea-multe": "Prea multe încercări. Mai încearcă în câteva minute.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ eroare?: string }>;
}) {
  const { eroare } = await searchParams;
  const mesaj = eroare ? (MESAJE[eroare] ?? MESAJE["1"]) : null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16 text-foreground">
      <div className="w-full max-w-sm">
        <p className="text-xs tracking-[0.2em] text-tinted uppercase">Epic Digital Hub</p>
        <h1 className="mt-3 text-2xl font-medium">Panou intern</h1>
        <p className="mt-2 text-sm text-secondary">
          Pagina conține date de contact ale unor oameni reali. Intrarea cere parola.
        </p>

        <form action={login} className="mt-8 flex flex-col gap-3">
          <label htmlFor="password" className="text-sm text-secondary">
            Parolă
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            autoFocus
            className="rounded-xl border border-line-2 bg-surface px-4 py-3 text-base text-foreground outline-none focus:border-accent"
          />
          <button
            type="submit"
            className="mt-2 rounded-xl bg-accent px-4 py-3 text-base font-medium text-background transition-opacity hover:opacity-90"
          >
            Intră
          </button>
        </form>

        {/* aria-live: mesajul apare după un drum dus-întors pe server, deci
            cititoarele de ecran trebuie anunțate că s-a schimbat ceva. */}
        <p aria-live="polite" className="mt-4 min-h-5 text-sm text-secondary">
          {mesaj}
        </p>
      </div>
    </main>
  );
}
