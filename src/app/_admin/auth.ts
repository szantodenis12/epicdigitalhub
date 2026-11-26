/* ============================================================================
   Autentificarea panoului de administrare: conturi Supabase Auth, nu o parolă
   comună.

   DE CE: panoul listează numele și adresele de email ale unor oameni reali.
   O singură parolă partajată nu spune cine a intrat, nu se poate revoca pentru
   un singur om și o dată scursă (s-a întâmplat) obligă pe toată lumea să
   schimbe. Echipa are deja conturi în proiectul Supabase în care stau și
   lead-urile - aceleași ca pe team.epicdigitalhub.ro - deci intrarea se face cu
   ele: fiecare cu parola lui, dezactivabil individual.

   Doi pași, ambii obligatorii:
     1. SESIUNEA: cookie-urile Supabase (@supabase/ssr) se verifică cu
        `auth.getUser()`, care întreabă serverul Auth. Nu `getSession()`: acela
        citește doar cookie-ul și nu dovedește nimic despre un cookie fabricat.
     2. APARTENENȚA: un cont Supabase valid nu e destul. Trebuie să existe un
        rând în `profiles` cu `active = true`. Altfel oricine ar avea un cont
        în același proiect (alt produs, un client) ar intra aici. Căutarea se
        face cu cheia service-role, pentru ca rezultatul să nu depindă de
        politicile RLS de pe `profiles`; cheia rămâne pe server.

   Cheia publică (anon) singură ajunge la `signInWithPassword`; service-role
   nu iese niciodată din procesul serverului.
   ========================================================================= */

import { createServerClient, type CookieMethodsServer } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type AdminUser = { id: string; email: string; role: string };

/** Nu există client Supabase în browser, deci cookie-urile de sesiune se
    închid pentru `document.cookie`. */
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

/** Fără URL sau cheie publică panoul e inaccesibil, nu deschis. */
export function authConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

/** Clientul de auth, legat de cookie-urile cererii curente. `cookies` vine de
    la apelant (proxy, acțiune, rută) pentru că fiecare are altă sursă. */
export function authClient(cookies: CookieMethodsServer): SupabaseClient {
  return createServerClient(
    process.env.SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    { cookies, cookieOptions: COOKIE_OPTIONS },
  );
}

/* ----------------------------------------------------------------------------
   REGULA DE ACCES - singurul loc. Acum: orice profil ACTIV intră, admin sau
   membru. Ca să restrângi la admini, înlocuiește cu
   `profile.active === true && profile.role === "admin"`.
   -------------------------------------------------------------------------- */
function isAllowed(profile: { active: boolean; role: string }): boolean {
  return profile.active === true;
}

/** Profilul utilizatorului dacă are voie în panou, altfel null (fără rând,
    inactiv, rol nepermis, eroare de rețea - toate la fel: refuzat). */
export async function findAllowedProfile(
  userId: string,
): Promise<{ email: string; role: string } | null> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await db
    .from("profiles")
    .select("email, role, active")
    .eq("id", userId)
    .maybeSingle();
  if (error || !data || !isAllowed(data)) return null;
  return { email: data.email, role: data.role };
}

/** Sesiunea din cookie-uri + apartenența. Întoarce utilizatorul sau null. */
export async function getAdminUser(supabase: SupabaseClient): Promise<AdminUser | null> {
  if (!authConfigured()) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  const profile = await findAllowedProfile(data.user.id);
  if (!profile) return null;
  return { id: data.user.id, email: profile.email, role: profile.role };
}
