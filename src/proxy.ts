/* ============================================================================
   Poarta panoului de administrare. (Next 16 a redenumit middleware în proxy;
   un singur fișier per proiect, la același nivel cu app/.)

   Matcher-ul atinge DOAR /admin și ce e sub el. Restul site-ului e public și o
   greșeală aici l-ar opri în întregime - un panou incomod e infinit mai ieftin
   decât epicdigitalhub.ro căzut, deci nimic "deștept" pe celelalte rute.

   Sesiunea e una Supabase Auth și are și apartenență (profil activ) - vezi
   _admin/auth.ts. Costul: câteva cereri către Supabase la fiecare încărcare de
   /admin. Acceptabil pentru un panou cu patru utilizatori; în schimb un
   cont dezactivat pierde accesul imediat, nu când expiră un cookie.
   ========================================================================= */

import { NextResponse, type NextRequest } from "next/server";
import { authClient, getAdminUser } from "./app/_admin/auth";

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

  /* Cookie-urile reîmprospătate (token nou după expirarea celui vechi) se
     scriu și pe cerere, ca pagina să vadă sesiunea nouă, și pe răspuns, ca
     browserul să o păstreze. */
  let response = NextResponse.next({ request });
  const supabase = authClient({
    getAll: () => request.cookies.getAll(),
    setAll: (list, headers) => {
      list.forEach(({ name, value }) => request.cookies.set(name, value));
      response = NextResponse.next({ request });
      list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      Object.entries(headers ?? {}).forEach(([k, v]) => response.headers.set(k, v));
    },
  });

  if (await getAdminUser(supabase)) {
    return sealed(response);
  }

  /* Fără sesiune, cu sesiune expirată, cont fără profil activ sau cu Supabase
     nesetat în mediu: același răspuns. Varianta "nu pot verifica, deci las să
     intre" e exact felul în care un panou cu date personale ajunge public.
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
