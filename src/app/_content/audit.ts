// Copy for the free audit page (/audit), EN + RO. From the handoff package.
// The generated report itself is always Romanian (a product decision - see
// api/audit/route.ts); only the page around it follows the locale.

const en = {
  meta: { title: "Free Website Audit | Epic Digital Hub", description: "Get a free, automated website audit covering first impressions, navigation, trust signals and basic SEO. Enter your URL and receive your report in minutes." },
  kicker: "Free audit",
  title: "See your website through your customers' eyes.",
  intro:
    "You know your business. But does someone visiting your website for the first time understand it just as clearly? Enter your website address and get a free assessment of what visitors see, how easily they can find what they need and what might be stopping them from taking the next step.",

  what: {
    kicker: "What we look at",
    items: [
      {
        t: "First impressions",
        d: "What does someone understand within the first few seconds? We look at how clearly your homepage communicates what you offer, who it's for and what visitors should do next.",
      },
      {
        t: "The path to conversion",
        d: "How easy is it to take action? We review the journey from landing on your website to contacting your business, submitting an enquiry or completing a purchase. We identify unnecessary steps and potential points of friction.",
      },
      {
        t: "Trust and credibility",
        d: "Does your website give people enough confidence to choose you? We assess visible contact information, business details, pricing where relevant and other elements that help visitors determine whether they can trust your company.",
      },
      {
        t: "Search visibility",
        d: "Can search engines understand your website? We examine basic SEO elements, including page titles, meta descriptions, headings and content structure, to identify issues that could affect how your pages are understood by search engines.",
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
    submit: "Generate My Free Report",
    note: "Your report is generated automatically in Romanian and displayed on this page. It usually takes a few minutes.",
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
    kicker: "What happens next?",
    body: "Your report is generated from publicly accessible information on your website. Every report is subsequently reviewed by a member of our strategy team. If you'd like to discuss the findings, you can book a 30-minute conversation to go through the key points and potential next steps. No obligation to work with us.",
    cta: "Talk to a Strategist",
  },
};

const ro: typeof en = {
  meta: { title: "Audit gratuit pentru website | Epic Digital Hub", description: "Află cum este perceput website-ul tău de un potențial client. Primești gratuit, în câteva minute, un raport automat cu observații despre claritatea mesajului, experiența de navigare, credibilitate și SEO." },
  kicker: "Audit gratuit",
  title: "Cum arată website-ul tău prin ochii unui client nou?",
  intro:
    "Analizăm ce înțelege un vizitator atunci când intră pentru prima dată pe website-ul tău, cât de ușor găsește informațiile importante și ce îl poate împiedica să te contacteze sau să cumpere.",

  what: {
    kicker: "Ce analizăm",
    items: [
      {
        t: "Prima impresie",
        d: "Cât de repede înțelege un vizitator ce oferi, cui te adresezi și care este următorul pas.",
      },
      {
        t: "Experiența de navigare",
        d: "Cât de simplu ajunge un potențial client de la prima pagină la formularul de contact, apel telefonic sau finalizarea unei comenzi. Identificăm pașii inutili și punctele în care poate abandona procesul.",
      },
      {
        t: "Credibilitatea",
        d: "Verificăm dacă website-ul oferă suficiente informații pentru a inspira încredere: date de contact, informații despre companie, prețuri și alte elemente relevante pentru decizia de cumpărare.",
      },
      {
        t: "Vizibilitatea în Google",
        d: "Analizăm elementele de bază ale optimizării SEO: titluri, meta descrieri și structura paginilor, pentru a identifica eventualele probleme care pot afecta indexarea și vizibilitatea în rezultatele căutării.",
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
    submit: "Generează raportul gratuit",
    note: "Raportul va apărea direct pe această pagină, în câteva minute.",
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
    kicker: "Ce urmează după audit?",
    body: "Raportul este generat automat, pe baza informațiilor publice disponibile pe website-ul tău. Ulterior, un strateg din echipa noastră analizează rezultatele și poate discuta cu tine, într-o sesiune de 30 de minute, principalele observații și oportunități de îmbunătățire.",
    cta: "Discută cu un strateg",
  },
};

export const auditContent = { en, ro };
export type AuditDictionary = typeof en;
export type AuditErrorCode = keyof typeof en.states.errors;
