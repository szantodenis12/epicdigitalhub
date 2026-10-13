/* ---------------------------------------------------------------------------
   Consent: the default state, and the banner that changes it.

   From the tracking handoff of 12.10.2026, adapted to this site's type and
   palette — the handoff's own version is deliberately unstyled and says so.
   The one thing its styling REQUIRES is that accept and decline carry the same
   visual weight, so neither is nudged; they are the same button here, and the
   only difference between them is the word.
   ------------------------------------------------------------------------ */

import { localePath } from "../content";
import { LEGAL_PATHS } from "../routes";

/* ----------------------------------------------------------------------------
   DEFAULT STATE — a plain inline script, in <head>, BEFORE the container

   It has to run before GTM, synchronously, and before React: Consent Mode's
   default has to be in place by the time any tag could fire, or a tag reads
   "no signal" and behaves as though consent had been given. That is why this
   is `dangerouslySetInnerHTML` and not an effect.

   It also re-applies a saved choice immediately, so a returning visitor who
   accepted once is not measured as denied for the first few hundred ms.
   ------------------------------------------------------------------------- */

const CONSENT_SCRIPT = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500
});
gtag('set', 'ads_data_redaction', true);
try {
  var c = localStorage.getItem('edh-consent-v1');
  if (c === 'granted') {
    gtag('consent', 'update', {
      ad_storage: 'granted', ad_user_data: 'granted',
      ad_personalization: 'granted', analytics_storage: 'granted'
    });
  }
} catch (e) {}
`;

export function ConsentDefault() {
  return <script id="consent-default" dangerouslySetInnerHTML={{ __html: CONSENT_SCRIPT }} />;
}

/* ----------------------------------------------------------------------------
   THE BANNER
   ------------------------------------------------------------------------- */

export const CONSENT_COPY = {
  ro: {
    text: "Folosim cookie-uri pentru statistici și pentru măsurarea campaniilor. Le activăm doar cu acordul tău.",
    accept: "Accept",
    reject: "Refuz",
    policy: "Politica de confidențialitate",
    /* `localePath`, not the bare path: LEGAL_PATHS holds the
       locale-INDEPENDENT slug, exactly like every other route in the site,
       and the /ro prefix is added here. Without it the banner linked to
       /confidentialitate, which is a 404. */
    href: localePath("ro", LEGAL_PATHS.privacy.ro),
    label: "Consimțământ cookie-uri",
  },
  en: {
    text: "We use cookies for analytics and to measure our campaigns. They are only switched on if you agree.",
    accept: "Accept",
    reject: "Decline",
    policy: "Privacy policy",
    href: localePath("en", LEGAL_PATHS.privacy.en),
    label: "Cookie consent",
  },
} as const;
