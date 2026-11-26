"use server";

/* Acțiunea formularului de login.

   Fără stare pe client: la date greșite redirecționează înapoi cu ?eroare=1,
   la date bune Supabase pune cookie-urile de sesiune și ducem în panou. Așa
   pagina de login rămâne componentă de server, fără JavaScript, și funcționează
   și dacă bundle-ul nu s-a încărcat. */

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { isRateLimited } from "../../_server/store";
import { authClient, authConfigured, findAllowedProfile } from "../../_admin/auth";

export async function login(formData: FormData) {
  const e = formData.get("email");
  const p = formData.get("password");
  const email = typeof e === "string" ? e.trim().toLowerCase() : "";
  const password = typeof p === "string" ? p : "";

  /* Parolele sunt acum personale, dar tot se pot ghici la nesfârșit dacă se
     știe adresa (iar adresele echipei nu sunt secrete). Limita rămâne per IP:
     10 încercări la 10 minute - nimeni nu greșește de zece ori. */
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (await isRateLimited("admin-login", ip, 10, 10 * 60)) {
    redirect("/admin/login?eroare=prea-multe");
  }

  /* Același mesaj pentru orice eșec - parolă greșită, cont inexistent, cont
     inactiv, mediu nesetat: cine încearcă nu trebuie să afle care din ele. */
  if (!authConfigured() || !email || !password) {
    redirect("/admin/login?eroare=1");
  }

  const store = await cookies();
  const supabase = authClient({
    getAll: () => store.getAll(),
    setAll: (list) => list.forEach(({ name, value, options }) => store.set(name, value, options)),
  });

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    redirect("/admin/login?eroare=1");
  }

  /* Cont valid dar nu membru activ: sesiunea tocmai creată se închide pe loc,
     ca să nu rămână un cookie valid pe care proxy-ul oricum l-ar respinge. */
  if (!(await findAllowedProfile(data.user.id))) {
    await supabase.auth.signOut({ scope: "local" });
    redirect("/admin/login?eroare=1");
  }

  redirect("/admin");
}
