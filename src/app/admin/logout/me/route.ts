import { NextResponse, type NextRequest } from "next/server";
import { authClient, getAdminUser } from "../../../_admin/auth";

/* Cine e conectat - pentru blocul de utilizator din bara laterală.

   Bara e componentă de client, iar pagina /admin nu e a acestui cod, deci bara
   nu primește utilizatorul ca prop; îl cere aici. Stă sub /admin, deci trece
   prin proxy ca orice altceva, dar verifică și singură, ca să nu depindă de
   matcher. */
export async function GET(request: NextRequest) {
  const user = await getAdminUser(
    authClient({ getAll: () => request.cookies.getAll(), setAll: () => {} }),
  );
  if (!user) return new NextResponse(null, { status: 401 });
  return NextResponse.json(
    { email: user.email, role: user.role },
    { headers: { "Cache-Control": "no-store" } },
  );
}
