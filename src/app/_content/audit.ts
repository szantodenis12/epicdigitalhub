// Copy for the free audit page (/audit), EN + RO. From the handoff package.
// The generated report itself is always Romanian (a product decision - see
// api/audit/route.ts); only the page around it follows the locale.

const en = {
  kicker: "Free audit",
  title: "What a new customer sees on your website.",
  intro:
    "Enter your website address and our system reads it and writes a report here, on this page, in a few minutes. Automated and free. A strategist reads every report after that.",

  what: {
    kicker: "What we check",
    items: [
      {
        t: "The first seconds",
        d: "What a first-time visitor understands from the first screen: what you sell, for whom, and what they are supposed to do next.",
      },
      {
        t: "The path to contact or purchase",
        d: "How many steps it takes to reach a phone number, a form or a cart, and where that path breaks.",
      },
      {
        t: "Trust",
        d: "Contact details, prices, signs that a real company answers behind the site.",
      },
      {
        t: "What Google sees",
        d: "Titles, descriptions, page structure. What a search engine actually reads from your site.",
      },
    ],
  },

  form: {
    kicker: "Get the report",
    fields: {
      name: "Your name",
      email: "Email",
      url: "Website address (e.g. yourcompany.com)",
    },
    submit: "Generate the report",
    note: "The report is written here, on this page, in Romanian. It takes a few minutes.",
  },

  states: {
    reading: "Reading your website…",
    writing: "Writing the report…",
    done: "Report complete.",
    stopped: "Generation stopped before the end. The report above is partial.",
    errors: {
      "missing-fields": "Fill in all three fields and try again.",
      "invalid-url": "That does not look like a website address. Check it and try again.",
      unreachable: "We could not open that website. Check the address and try again.",
      throttled: "You already generated 3 reports in the last hour. Come back later.",
      "missing-api-key": "Report generation is paused right now. Try again later.",
      generic: "Something went wrong. Try again in a moment.",
    },
  },

  report: {
    kicker: "Your report",
  },

  closing: {
    kicker: "After the report",
    body: "The report is written automatically by our system, from your site's public pages. A strategist reads every report and can walk through it with you in 30 minutes.",
    cta: "Talk to a strategist",
  },
};

const ro: typeof en = {
  kicker: "Audit gratuit",
  title: "Ce vede un client nou pe site-ul tău.",
  intro:
    "Pui adresa site-ului, sistemul nostru îl citește și scrie un raport aici, pe pagină, în câteva minute. Automat și gratuit. Un strateg citește apoi fiecare raport.",

  what: {
    kicker: "Ce verificăm",
    items: [
      {
        t: "Primele secunde",
        d: "Ce înțelege un om nou din primul ecran: ce vinzi, pentru cine și ce are de făcut mai departe.",
      },
      {
        t: "Drumul până la contact sau comandă",
        d: "Câți pași sunt până la telefon, formular sau coș și unde se rupe drumul.",
      },
      {
        t: "Încredere",
        d: "Date de contact, prețuri, semne că în spatele site-ului răspunde o firmă reală.",
      },
      {
        t: "Ce vede Google",
        d: "Titluri, descrieri, structura paginilor. Ce citește efectiv un motor de căutare din site-ul tău.",
      },
    ],
  },

  form: {
    kicker: "Cere raportul",
    fields: {
      name: "Numele tău",
      email: "Email",
      url: "Adresa site-ului (ex. firmata.ro)",
    },
    submit: "Generează raportul",
    note: "Raportul se scrie aici, pe pagină. Durează câteva minute.",
  },

  states: {
    reading: "Citim site-ul tău…",
    writing: "Se scrie raportul…",
    done: "Raport complet.",
    stopped: "Generarea s-a oprit înainte de final. Raportul de mai sus e parțial.",
    errors: {
      "missing-fields": "Completează toate cele trei câmpuri și mai încearcă o dată.",
      "invalid-url": "Adresa nu arată a site. Verifică și mai încearcă.",
      unreachable: "Nu am putut deschide site-ul. Verifică adresa și mai încearcă.",
      throttled: "Ai generat deja 3 rapoarte în ultima oră. Revino mai târziu.",
      "missing-api-key": "Generarea e oprită momentan. Mai încearcă mai târziu.",
      generic: "Ceva n-a mers. Mai încearcă peste un minut.",
    },
  },

  report: {
    kicker: "Raportul tău",
  },

  closing: {
    kicker: "După raport",
    body: "Raportul e scris automat de sistemul nostru, pe baza paginilor publice ale site-ului. Un strateg citește fiecare raport și îl poate parcurge cu tine în 30 de minute.",
    cta: "Vorbește cu un strateg",
  },
};

export const auditContent = { en, ro };
export type AuditDictionary = typeof en;
export type AuditErrorCode = keyof typeof en.states.errors;
