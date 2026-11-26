import { getAdminData } from "../_admin/data";
import { buildFixtureAdminData } from "../_admin/ui/fixture";
import { Dashboard } from "../_admin/ui/dashboard";
import { AdminShell } from "../_admin/ui/shell";

/* ============================================================================
   /admin - pagina. Componentă de server: citește o dată, dă totul mai departe
   ca props, iar tot ce e interactiv (filtre, sortare, temă, grafice) e în
   componentele client de sub ea.

   De ce `force-dynamic`: fără el, o pagină care nu atinge niciun API dinamic e
   prerandată la build, iar panoul ar arăta lead-urile de la ultimul deploy
   pentru totdeauna. E exact tipul de greșeală care nu se vede - cifrele arată
   plauzibil, doar că sunt de luna trecută.

   Poarta (src/proxy.ts) e cea care decide dacă se ajunge aici; pagina nu
   verifică nimic a doua oară și nu are voie să fie accesibilă dacă poarta cade:
   dacă vreodată matcher-ul din proxy se schimbă, aici trebuie adăugată
   verificarea, nu presupus că e făcută.
   ========================================================================= */

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  /* FIXTURA, numai în dezvoltare și numai cerută explicit cu ?demo=1.
     `process.env.NODE_ENV` e înlocuit la build, deci în producție condiția e
     constant falsă și bundler-ul taie ramura cu tot cu fixtura.
     ────────────────────────────────────────────────────────────────────────
     ASTA E SINGURA LINIE DE SCHIMBAT ca să dispară complet datele inventate:
     șterge `demo` de aici și fișierul _admin/ui/fixture.ts. */
  const demo = process.env.NODE_ENV !== "production" && params.demo === "1";

  const data = demo ? buildFixtureAdminData() : await getAdminData();

  return (
    <AdminShell storageOk={data.storageOk}>
      <Dashboard data={data} />
    </AdminShell>
  );
}
