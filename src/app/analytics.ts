/* ---------------------------------------------------------------------------
   Tracking: the dataLayer, and consent.

   From the tracking handoff of 12.10.2026. The shape of what is pushed is
   fixed by the GTM container (GTM-TPN89TBF), which is already configured on
   Epic's side — `lead_submit` with `form_name`, and `consent_granted` — so the
   event names and field names here are a contract, not a choice.

   What is deliberately NOT here: GA4 (G-GZLFNZCQ32) and the Meta Pixel
   (1791988975263032). Both are configured as tags INSIDE the container, so
   they can be changed without a deploy. Nothing in this repo should load
   `gtag/js?id=G-...` or `fbq` directly.

   No personal data goes into the dataLayer — no name, email, phone or the
   visitor's own website. The lead events carry the form's name and, for the
   application, the niche and budget, because those are the two fields the
   reports are built on and neither identifies anybody.
   ------------------------------------------------------------------------ */

export type LeadForm = "audit" | "apply" | "enquiry";

type DataLayerEvent = Record<string, unknown>;

/* Cast rather than `declare global`: `@next/third-parties` already augments
   `Window` with `dataLayer?: Object[]`, and a second declaration of the same
   member has to match it exactly - modifiers and type - or the build fails on
   TS2687/TS2717. Keeping the shape local sidesteps the collision and survives
   the day the GTM component is swapped for something else. */
type TrackingWindow = Window & {
  dataLayer?: DataLayerEvent[];
  gtag?: (...args: unknown[]) => void;
};

const tw = () => window as unknown as TrackingWindow;

function push(event: DataLayerEvent) {
  if (typeof window === "undefined") return;
  const w = tw();
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push(event);
}

/** Romanian lives under /ro, English at the root — the same rule as content.ts. */
function pageLanguage(): "ro" | "en" {
  return window.location.pathname.startsWith("/ro") ? "ro" : "en";
}

/** `crypto.randomUUID` needs a secure context; a plain random id is a fine
    fallback, since this only has to be unique enough for Meta to deduplicate a
    browser event against the same event arriving over the Conversions API. */
function eventId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }
}

/**
 * Call this ONLY after the server has accepted the submission — not on the
 * button click, and not when the fields validate. A lead counted on click is a
 * lead that did not happen.
 */
export function trackLead(form: LeadForm, details?: { niche?: string; budget?: string }) {
  push({
    event: "lead_submit",
    form_name: form,
    page_language: pageLanguage(),
    event_id: eventId(),
    ...details,
  });
}

/* ---------------------------------------------------------------------------
   Consent Mode v2
   ------------------------------------------------------------------------ */

export const CONSENT_KEY = "edh-consent-v1";
export type ConsentChoice = "granted" | "denied";

export function applyConsent(choice: ConsentChoice) {
  tw().gtag?.("consent", "update", {
    ad_storage: choice,
    ad_user_data: choice,
    ad_personalization: choice,
    analytics_storage: choice,
  });
  /* The container fires the Meta Pixel's PageView off this, because the pixel
     must not load at all until advertising storage is granted. */
  if (choice === "granted") push({ event: "consent_granted" });
}

export function saveConsent(choice: ConsentChoice) {
  try {
    localStorage.setItem(CONSENT_KEY, choice);
  } catch {
    /* private mode, or storage blocked: the choice applies to this page view
       and the banner asks again next time, which is the safe way round. */
  }
  applyConsent(choice);
}

export function readConsent(): ConsentChoice | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

/** The footer's "Cookie settings" link: GDPR requires consent be withdrawable,
    so the banner has to be reachable again after the first choice. */
export const COOKIE_SETTINGS_EVENT = "edh:open-cookie-settings";

export function openCookieSettings() {
  window.dispatchEvent(new Event(COOKIE_SETTINGS_EVENT));
}
