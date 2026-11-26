/* ============================================================================
   Sesiunea panoului de administrare: o singură parolă, un cookie semnat.

   Panoul listează nume, adrese de email și numere de telefon ale unor oameni
   reali, iar restul site-ului nu are deloc autentificare - deci tot ce ține
   poarta închisă e aici, și e scris ca să nu aibă nevoie de nimic altceva
   (bază de date, sesiuni pe server, dependențe noi).

   Cum ține:
     - Parola stă doar în ADMIN_PASSWORD. Nu există valoare implicită: fără
       variabilă, nimeni nu intră. Mai bine un panou inaccesibil decât unul
       deschis cu o parolă ghicită din cod.
     - Cookie-ul NU conține parola, ci `<expirare>.<HMAC-SHA256>` cu parola pe
       post de cheie. Nu se poate fabrica fără parolă, iar dacă e furat nu
       dezvăluie parola. Schimbarea lui ADMIN_PASSWORD invalidează automat
       toate sesiunile, pentru că semnătura se derivă din ea.
     - Verificarea parolei se face prin aceeași derivare: se compară două
       digest-uri hex de 64 de caractere, mereu de aceeași lungime, deci
       comparația pe durată constantă nu scurge nici lungimea parolei, nici cât
       din ea e corect.

   DE CE EXPIRAREA E ÎN INTERIORUL SEMNĂTURII, nu doar în `max-age`-ul
   cookie-ului: `max-age` e o instrucțiune pentru browserul care a primit
   cookie-ul, nu o regulă pe care o aplică serverul. Cine copiază valoarea - de
   pe un laptop lăsat deschis, dintr-un log, de pe o mașină comună - și-o pune
   singur, fără expirare, și intră la nesfârșit. Semnând și momentul expirării,
   serverul refuză singur cookie-ul vechi, oricine l-ar prezenta. Costă două
   rânduri și transformă „cookie furat = acces pe veci" în „acces până la data
   semnată".

   Web Crypto (`crypto.subtle`), nu `node:crypto`, pentru că fișierul e importat
   și din proxy.ts.
   ========================================================================= */

/** Numele cookie-ului de sesiune. Prefixul evită coliziuni cu orice altceva
    de pe domeniu, iar panoul și proxy-ul citesc amândouă de aici. */
export const ADMIN_COOKIE = "edh_admin";

/* Mesajul semnat e fix și public - secretul e cheia, nu mesajul. Versionat:
   dacă vreodată se schimbă forma sesiunii, un mesaj nou invalidează cookie-urile
   vechi fără să fie nevoie de altă parolă. */
const SESSION_MESSAGE = "epic-digital-hub/admin/v2";

/** O săptămână. Suficient ca să nu ceară parola la fiecare deschidere, destul
    de scurt ca un laptop uitat deschis să nu rămână logat luni de zile. */
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

const encoder = new TextEncoder();

async function hmacHex(key: string, message: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Comparație care nu scurge prin timp. Parcurge mereu tot `a`, fără ieșire
 * devreme; `b` mai scurt nu oprește bucla, doar face diferența nenulă.
 * Cheamă-o numai pe digest-uri hex de aceeași lungime - ce compară panoul.
 */
export function constantTimeEqual(a: string, b: string): boolean {
  let diff = a.length ^ b.length;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

/** Semnătura pentru o sesiune care expiră la `exp` (secunde Unix). */
function sign(password: string, exp: number): Promise<string> {
  return hmacHex(password, `${SESSION_MESSAGE}|${exp}`);
}

/**
 * Parola trimisă de formular e bună? Întoarce valoarea de pus în cookie, sau
 * null. Nu primește și nu întoarce niciodată parola mai departe.
 */
export async function issueToken(candidate: string): Promise<string | null> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  /* Parola goală se respinge înainte de HMAC: Web Crypto refuză o cheie de
     lungime zero cu o excepție, iar un POST fără câmp (formularul are
     `required`, dar o cerere fabricată nu) ar da 500 în loc de „greșită".
     Nu scurge nimic - că o parolă goală e greșită se știe oricum. */
  if (!candidate) return null;

  /* Se hash-uiește și candidatul, oricât de scurt sau de lung ar fi, ca să se
     compare două șiruri de lungime fixă: altfel lungimea parolei s-ar citi din
     timpul de răspuns. */
  const given = await hmacHex(candidate, SESSION_MESSAGE);
  const expected = await hmacHex(password, SESSION_MESSAGE);
  if (!constantTimeEqual(given, expected)) return null;

  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  return `${exp}.${await sign(password, exp)}`;
}

/** Cookie-ul primit e o sesiune valabilă și neexpirată? Lipsa cookie-ului,
    lipsa parolei din mediu, o semnătură greșită și o sesiune expirată dau
    toate false - proxy-ul le tratează identic. */
export async function verifySession(cookieValue: string | undefined): Promise<boolean> {
  if (!cookieValue) return false;
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;

  const separator = cookieValue.indexOf(".");
  if (separator < 1) return false;
  const exp = Number(cookieValue.slice(0, separator));
  const digest = cookieValue.slice(separator + 1);
  if (!Number.isSafeInteger(exp) || !digest) return false;

  /* Expirarea se verifică înaintea semnăturii, dar după ce forma a fost
     validată: un cookie expirat nu merită un HMAC. */
  if (exp * 1000 <= Date.now()) return false;

  return constantTimeEqual(digest, await sign(password, exp));
}
