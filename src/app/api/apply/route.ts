/* POST /api/apply - the "check your niche" application.

   From the handoff package's route: validate, check the niche against the
   taken list, store, answer with "received" or "niche-taken". Ported to
   Vercel: storage is Redis (see _server/store.ts) and every application is
   also emailed. The visitor gets an error only if it could be neither stored
   nor emailed - otherwise nobody would ever see it. */

import type { NextRequest } from "next/server";
import { findConflict } from "../../_server/intake";
import { isRateLimited, saveRecord } from "../../_server/store";
import { notify } from "../../_server/notify";

const REQUIRED = ["name", "business", "city", "niche"] as const;
const MAX_LEN = 2_000;

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "bad-json" }, { status: 400 });
  }

  const str = (v: unknown) => (typeof v === "string" ? v.trim().slice(0, MAX_LEN) : "");

  for (const field of REQUIRED) {
    if (!str(body[field])) {
      return Response.json({ ok: false, error: "missing-fields", field }, { status: 400 });
    }
  }

  // A human applies once or twice; this only stops a script filling the list.
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (await isRateLimited("apply", ip, 10, 60 * 60)) {
    return Response.json({ ok: false, error: "throttled" }, { status: 429 });
  }

  const input = {
    name: str(body.name),
    business: str(body.business),
    city: str(body.city),
    niche: str(body.niche),
    website: str(body.website),
    goal: str(body.goal),
    budget: str(body.budget),
    locale: str(body.locale) === "ro" ? "ro" : "en",
  };

  const conflict = await findConflict(input.city, input.niche);
  const status = conflict ? "niche-taken" : "received";

  const stored = await saveRecord("applications", { ...input, status });
  const emailed = await notify(
    `${conflict ? "[Nișă ocupată] " : ""}Aplicație: ${input.business} (${input.niche}, ${input.city})`,
    [
      ["Status", conflict ? `nișă ocupată (${conflict.client})` : "nișă liberă"],
      ["Nume", input.name],
      ["Business", input.business],
      ["Oraș", input.city],
      ["Nișă", input.niche],
      ["Website", input.website],
      ["Obiectiv", input.goal],
      ["Buget", input.budget],
      ["Limba", input.locale],
    ],
  );

  if (!stored && !emailed) {
    return Response.json({ ok: false, error: "not-saved" }, { status: 500 });
  }

  // The taken client's name is internal; only the category goes back.
  return Response.json({
    ok: true,
    status,
    conflict: conflict ? { city: conflict.city, niche: conflict.niche } : null,
  });
}
