import { NextResponse, type NextRequest } from "next/server";
import { authClient, authConfigured } from "../../_admin/auth";

/* Ieșirea din cont.

   Închide sesiunea la Supabase (`signOut`), nu doar șterge cookie-urile din
   browser: un refresh token copiat înainte nu mai poate fi folosit. Cookie-urile
   locale se șterg tot, prin `setAll`, ca proxy-ul să nu mai găsească nimic.

   GET, nu POST, ca să rămână un simplu link în bara laterală. Riscul obișnuit
   al unui logout pe GET - cineva te poate deconecta cu o imagine ascunsă - e
   aici doar o supărare: nu se pierde nimic și te reloghezi. */
export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/admin/login", request.url));
  /* Fără config nu există sesiune de închis, iar clientul n-ar putea fi creat. */
  if (authConfigured()) {
    const supabase = authClient({
      getAll: () => request.cookies.getAll(),
      setAll: (list) =>
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options)),
    });
    /* scope local: închide doar sesiunea aceasta. Implicitul (global) ar
       deconecta omul și de pe team.epicdigitalhub.ro, același cont. */
    await supabase.auth.signOut({ scope: "local" });
  }
  return response;
}
