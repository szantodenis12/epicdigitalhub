import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE } from "../../_admin/auth";

/* Ieșirea din cont.

   Până acum „Ieși" ducea doar la /admin/login, fără să atingă cookie-ul - iar
   proxy-ul, găsind o sesiune validă, te trimitea înapoi în panou. Arăta ca un
   buton stricat și, mai rău, lăsa sesiunea vie pe un calculator de pe care
   credeai că ai ieșit.

   GET, nu POST, ca să rămână un simplu link în bara laterală. Riscul obișnuit
   al unui logout pe GET - cineva te poate deconecta cu o imagine ascunsă - e
   aici doar o supărare: nu se pierde nimic și te reloghezi cu parola. */
export function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/admin/login", request.url));
  response.cookies.set({ name: ADMIN_COOKIE, value: "", path: "/", maxAge: 0 });
  return response;
}
