/* ============================================================================
   Evenimentul Lead trimis către Meta de pe SERVER (Conversions API).

   De ce există: pixelul din browser pierde vizitatorii cu ad blocker și o parte
   din cei de pe iOS. Aceiași oameni completează formularul și ajung în baza
   noastră, dar Meta nu-i vede, deci campaniile optimizează pe o realitate
   incompletă. Serverul îi vede pe toți.

   DEDUPLICAREA E TOT ROSTUL. Același lead pleacă de două ori - o dată din
   browser prin GTM, o dată de aici - iar Meta le unește DOAR dacă poartă
   același `event_id` și același `event_name`. De aceea `eventId` nu se
   generează aici: vine din browser, din formular, și e trimis odată cu
   cererea. Dacă l-am genera pe server, ar fi alt id și fiecare lead s-ar
   număra de două ori - adică exact invers decât ce vrem.

   Datele personale pleacă numai hash-uite (SHA-256, litere mici, fără spații),
   cum cere Meta, și numai dacă vizitatorul a acceptat cookie-urile de
   marketing. Fără token în mediu, funcția nu face nimic și spune asta în log -
   ca la Resend: aplicația merge, doar că nu trimite.
   ========================================================================= */

import "server-only";

/** ID-ul setului de date (pixelul). Public - apare oricum în pagină. */
const PIXEL_ID = process.env.META_PIXEL_ID ?? "1791988975263032";
/* v21.0 e retrasă de Meta pe 21 ianuarie 2027 (după aceea apelurile pică);
   versiunea curentă e v26.0. META_GRAPH_VERSION permite mutarea fără deploy de cod. */
const GRAPH_VERSION = process.env.META_GRAPH_VERSION || "v26.0";

export type MetaLeadInput = {
  /** Același id pe care browserul îl pune în dataLayer. Fără el nu trimitem. */
  eventId: string;
  /** Adresa paginii de pe care s-a trimis formularul. */
  sourceUrl: string;
  email?: string;
  phone?: string;
  /** Cookie-urile pixelului, citite din cerere. */
  fbp?: string;
  fbc?: string;
  ip?: string;
  userAgent?: string;
};

const enc = new TextEncoder();

/** SHA-256 hex, cum cere Meta pentru câmpurile de identificare. */
async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", enc.encode(value));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/* Normalizarea cerută de Meta: altfel același om hash-uit din două locuri dă
   două valori diferite și potrivirea nu se mai face. */
const normalizeEmail = (v: string) => v.trim().toLowerCase();

/** Telefonul se trimite doar cu cifre, cu prefix de țară. Numerele românești
    scrise local („0740…") devin „40740…"; ce începe deja cu + se păstrează. */
function normalizePhone(v: string): string {
  const digits = v.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits.slice(1);
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.startsWith("0")) return `40${digits.slice(1)}`;
  return digits;
}

/**
 * Trimite evenimentul. Nu aruncă niciodată și nu întârzie răspunsul către
 * vizitator mai mult decât trebuie - apelantul o cheamă după ce a salvat.
 * Întoarce false și când nu e configurată, și când a eșuat.
 */
export async function sendLeadToMeta(input: MetaLeadInput): Promise<boolean> {
  const token = process.env.META_CAPI_TOKEN;
  if (!token) return false;
  if (!input.eventId) {
    console.error("[meta] lead fără event_id, nu trimit: s-ar număra de două ori");
    return false;
  }

  const user_data: Record<string, string[] | string> = {};
  if (input.email) user_data.em = [await sha256(normalizeEmail(input.email))];
  if (input.phone) {
    const phone = normalizePhone(input.phone);
    if (phone.length >= 8) user_data.ph = [await sha256(phone)];
  }
  if (input.ip) user_data.client_ip_address = input.ip;
  if (input.userAgent) user_data.client_user_agent = input.userAgent;
  if (input.fbp) user_data.fbp = input.fbp;
  if (input.fbc) user_data.fbc = input.fbc;

  /* Fără niciun identificator, evenimentul nu poate fi atribuit nimănui, iar
     Meta îl numără ca trafic anonim. Mai bine nu-l trimitem deloc. */
  if (!user_data.em && !user_data.ph && !user_data.fbp && !user_data.fbc) {
    return false;
  }

  /* DOAR pentru testare (Events Manager -> Test events): se șterge din mediu
     după verificare, altfel evenimentele reale rămân marcate ca test. */
  const testEventCode = process.env.META_TEST_EVENT_CODE;

  const payload = {
    ...(testEventCode ? { test_event_code: testEventCode } : {}),
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        action_source: "website",
        event_source_url: input.sourceUrl,
        user_data,
      },
    ],
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!res.ok) {
      console.error(`[meta] ${res.status}: ${(await res.text()).slice(0, 300)}`);
      return false;
    }
    return true;
  } catch (e) {
    console.error("[meta] trimiterea a eșuat:", e instanceof Error ? e.message : e);
    return false;
  }
}

/** Datele pe care le știe doar cererea: cookie-urile pixelului, IP-ul, agentul. */
export function metaContextFrom(req: Request): Pick<MetaLeadInput, "fbp" | "fbc" | "ip" | "userAgent"> {
  const cookie = req.headers.get("cookie") ?? "";
  const pick = (name: string) => cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))?.[1];
  return {
    fbp: pick("_fbp"),
    fbc: pick("_fbc"),
    ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined,
    userAgent: req.headers.get("user-agent") || undefined,
  };
}
