"use server";

/* Acțiunea formularului de login.

   Fără stare pe client: la parolă greșită redirecționează înapoi cu ?eroare=1,
   la parolă bună pune cookie-ul și duce în panou. Așa pagina de login rămâne
   componentă de server, fără JavaScript, și funcționează și dacă bundle-ul nu
   s-a încărcat. */

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { isRateLimited } from "../../_server/store";
import { ADMIN_COOKIE, SESSION_MAX_AGE, issueToken } from "../../_admin/auth";

export async function login(formData: FormData) {
  const submitted = formData.get("password");
  const password = typeof submitted === "string" ? submitted : "";

  /* O singură parolă partajată se poate încerca la nesfârșit, iar aici nu e
     niciun utilizator de blocat - deci limita e per IP. 10 încercări la 10
     minute: nimeni nu greșește de zece ori, iar un script nu ajunge nicăieri. */
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (await isRateLimited("admin-login", ip, 10, 10 * 60)) {
    redirect("/admin/login?eroare=prea-multe");
  }

  const token = await issueToken(password);
  if (!token) {
    /* Același mesaj și când parola e greșită și când ADMIN_PASSWORD lipsește
       din mediu: cine încearcă să intre nu trebuie să afle care din două e. */
    redirect("/admin/login?eroare=1");
  }

  (await cookies()).set({
    name: ADMIN_COOKIE,
    value: token,
    httpOnly: true, // niciun motiv să fie citibil din JavaScript
    secure: true, // pe localhost Chrome tratează http://localhost ca sigur
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  redirect("/admin");
}
