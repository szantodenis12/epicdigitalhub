/* ============================================================================
   Poarta panoului de administrare. (Next 16 a redenumit middleware în proxy;
   un singur fișier per proiect, la același nivel cu app/.)

   Matcher-ul atinge DOAR /admin și ce e sub el. Restul site-ului e public și o
   greșeală aici l-ar opri în întregime - un panou incomod e infinit mai ieftin
   decât epicdigitalhub.ro căzut, deci nimic "deștept" pe celelalte rute.

   Verificarea e optimistă, în sensul din documentația Next: citește cookie-ul
   și redirecționează. Nu atinge baza de date și nu face I/O, doar un HMAC.
   ========================================================================= */

import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, verifySession } from "./app/_admin/auth";

const LOGIN_PATH = "/admin/login";

/* next.config.ts pune noindex doar pe alias-urile *.vercel.app, iar fișierul
   acela nu se atinge; panoul însă nu are ce căuta în index pe NICIUN domeniu,
   așa că antetul se adaugă aici, pe tot ce trece prin matcher - inclusiv pe
   redirectul spre login și pe pagina de login. */
function sealed(response: NextResponse): NextResponse {
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /* Login-ul trebuie să rămână accesibil, altfel redirectul ar trimite la o
     pagină care se redirecționează la ea însăși. Acțiunea de server a
     formularului e un POST pe aceeași rută, deci trece tot pe aici. */
  if (pathname === LOGIN_PATH || pathname.startsWith(`${LOGIN_PATH}/`)) {
    return sealed(NextResponse.next());
  }

  if (await verifySession(request.cookies.get(ADMIN_COOKIE)?.value)) {
    return sealed(NextResponse.next());
  }

  /* Fără cookie, cu cookie greșit sau fără ADMIN_PASSWORD în mediu: același
     răspuns. Varianta "lipsește parola din mediu, deci las pe toți să intre"
     e exact felul în care un panou cu date personale ajunge public.
     `search` se golește: nu ducem parametrii cererii respinse în bara de
     adresă a login-ului. */
  const login = request.nextUrl.clone();
  login.pathname = LOGIN_PATH;
  login.search = "";
  return sealed(NextResponse.redirect(login));
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
