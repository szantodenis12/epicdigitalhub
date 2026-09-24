/* ============================================================================
   Email notification for every application and lead, through Resend.

   Plain fetch to Resend's REST endpoint rather than their SDK: it is one POST,
   and it keeps a dependency off the server bundle.

   Env
     RESEND_API_KEY    required to send; without it this is a no-op
     LEADS_EMAIL_TO    where notifications go (comma-separated allowed)
     LEADS_EMAIL_FROM  sender. Must be on a domain verified in Resend, e.g.
                       "Epic Digital Hub <site@epicdigitalhub.ro>". Until the
                       domain is verified, Resend's "onboarding@resend.dev"
                       works but only delivers to the Resend account's own
                       address.
   ========================================================================= */

const FALLBACK_FROM = "Epic Digital Hub <onboarding@resend.dev>";

/**
 * Sends one notification. Returns whether Resend accepted it. Never throws.
 * `fields` render as "Label: value" lines, in order, so the email reads the
 * same as the form did.
 */
export async function notify(subject: string, fields: [label: string, value: string][], replyTo?: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEADS_EMAIL_TO;
  if (!apiKey || !to) {
    if (process.env.VERCEL) console.error("[notify] RESEND_API_KEY / LEADS_EMAIL_TO not set; no email sent");
    return false;
  }

  const text = fields
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.LEADS_EMAIL_FROM || FALLBACK_FROM,
        to: to.split(",").map((s) => s.trim()),
        subject,
        text,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error(`[notify] Resend rejected the email: ${res.status} ${await res.text()}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[notify] sending failed:", err);
    return false;
  }
}
