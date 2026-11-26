/* POST /api/contact - the name + email form in the footer of every page.

   Until now that form only flashed "sent" and threw the details away. It
   now stores and emails them like an application. */

import { after, type NextRequest } from "next/server";
import { isRateLimited, saveRecord } from "../../_server/store";
import { notify } from "../../_server/notify";
import { metaContextFrom, sendLeadToMeta } from "../../_server/meta-capi";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "bad-json" }, { status: 400 });
  }

  const str = (v: unknown) => (typeof v === "string" ? v.trim().slice(0, 300) : "");
  const name = str(body.name);
  const email = str(body.email);
  const page = str(body.page);
  const locale = str(body.locale) === "ro" ? "ro" : "en";

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ ok: false, error: "missing-fields" }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (await isRateLimited("contact", ip, 10, 60 * 60)) {
    return Response.json({ ok: false, error: "throttled" }, { status: 429 });
  }

  const stored = await saveRecord("contact-leads", { name, email, page, locale });
  const emailed = await notify(
    `Contact: ${name}`,
    [
      ["Nume", name],
      ["Email", email],
      ["Pagina", page],
      ["Limba", locale],
    ],
    email,
  );

  if (!stored && !emailed) {
    return Response.json({ ok: false, error: "not-saved" }, { status: 500 });
  }

  /* Meta primește Lead-ul doar cu acordul pentru marketing și cu același
     eventId ca în browser (deduplicare). În after(), ca să nu întârzie
     răspunsul; formularul nu cere telefon, deci pleacă doar emailul. */
  const eventId = typeof body.eventId === "string" ? body.eventId.trim().slice(0, 100) : "";
  if (body.consent === true && eventId) {
    const meta = metaContextFrom(req);
    const sourceUrl = new URL(page || "/", req.nextUrl.origin).href;
    after(() => sendLeadToMeta({ eventId, sourceUrl, email, ...meta }));
  }
  return Response.json({ ok: true });
}
