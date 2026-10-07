/* ---------------------------------------------------------------------------
   Site copy, EN + RO.

   Romanian is not a translation made here — it is lifted from the project's own
   bilingual copy deck (`F:\epicdigitalhub-v2\src\lib\dictionaries.ts`, which
   carries full EN/RO parity) and mapped onto this site's sections using the
   same mapping recorded in .tasks/clone-nbnzia/content-mapping.md. Where this
   site's structure has no counterpart in the deck (the two curved dividers, the
   contact form), the RO wording is composed from the deck's own phrasing so the
   voice stays consistent.

   English is the DEFAULT locale and lives at `/`; Romanian lives at `/ro`.
   The audience is Oradea and Bihor.
   ------------------------------------------------------------------------ */

export const LOCALES = ["en", "ro"] as const;
export type Locale = (typeof LOCALES)[number];

/** URL prefix per locale. English is served from the root, Romanian from /ro. */
const LOCALE_PREFIX: Record<Locale, string> = { en: "", ro: "/ro" };

/** A page's URL in one locale. `path` is the locale-independent part —
    "" for the home page, "/services/seo-geo" for a subpage — so the same page
    in the other language is always `localePath(other, path)`. Slugs are shared
    between the locales; if they are ever localised, this is the one place. */
export const localePath = (locale: Locale, path = "") =>
  `${LOCALE_PREFIX[locale]}${path}` || "/";

/** The home page of a locale. */
export const localeHref = (locale: Locale) => localePath(locale);

/** The label shown on the toggle is the language it switches TO. */
export const otherLocale = (locale: Locale): Locale => (locale === "ro" ? "en" : "ro");

const en = {
  htmlLang: "en",
  /** Shown on the language toggle for the OTHER locale. */
  switchLabel: "EN",
  switchTitle: "Switch to Romanian",

  nav: {
    home: "Epic Digital Hub, creative studio — home",
    /** `#anchor` = a section of the home page; `/path` = a page, localised
        by the header (see navHref in _components/chrome.tsx). */
    links: [
      { label: "Services", href: "/services" },
      { label: "Work", href: "/case-studies" },
      { label: "Articles", href: "/articles" },
      { label: "About", href: "#about" },
    ],
    apply: "Apply",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },

  hero: {
    line1: "Your competitors",
    line2: "can’t hire us",
    entity:
      "Epic Digital Hub is a strategy and brand systems studio in Oradea, Romania, working with a single brand per niche, per city.",
  },

  about: {
    list: ["One plan.", "One team.", "One report.", "Your category, locked."],
    paragraphs: [
      "Most marketing fails because it is the same everywhere. The ads chase clicks. The website tries to explain everything. The visuals change every month. The content fills a calendar, but does not build memory.",
      "Every touchpoint becomes a disconnected moment competing for attention on its own. Epic Digital Hub connects them.",
    ],
    ctaPrimary: "Apply for your niche",
    ctaSecondary: "See the work",
  },

  marquee: [
    "6500+ hours worked inside client systems",
    "40+ strategies & campaign plans written",
    "1200+ pieces of content shipped",
    "150+ videos filmed & edited",
    "500+ graphics & designs delivered",
    "7 verticals operated",
  ],

  eyebrow: {
    clients: "Clients",
    whatWeDo: "What we do",
    process: "Process",
    letsTalk: "Let's talk",
  },

  dividers: {
    beforeWork: "Strategy becomes real when you can see the difference.",
    beforeProcess: "The order matters. Every leu builds on the one before it.",
  },

  testimonials: {
    title: "In their words.",
    featured: {
      // No quotation marks inside the strings - the markup adds them.
      quote:
        "We run two clinics, with different audiences, in a field where you can't just claim anything. They understood the rules from day one, and since then the content ships consistently without us chasing it.",
      name: "DentalNet, Oradea",
    },
    items: [
      {
        quote:
          "They filmed our cars in the showroom and made ads that bring people in for a test drive, not just likes.",
        name: "AutoSiena, Oradea",
      },
      {
        quote:
          "We had campaigns burning money for nothing. They looked at the numbers seriously and cut what wasn't working. Now I know where every leu goes.",
        name: "Agro Salso, Bihor",
      },
      {
        quote:
          "The reels they made for the hotel look like the big places abroad. Guests message us saying that's where they found us.",
        name: "Hotel Maxim, Oradea",
      },
      {
        quote:
          "The loyalty card now lives in our customers' phones, and at the till it takes two seconds. And nothing shows up online that isn't actually on the menu.",
        name: "Origins Coffee & Drinks, Oradea",
      },
      {
        quote:
          "They took complicated technical material and made it clear even for a client outside the field.",
        name: "ThermX",
      },
      {
        quote:
          "The event posters and clips gave us a look nobody around here has.",
        name: "Harmony Garden",
      },
    ],
  },

  work: {
    /** external, for the cards whose client has a public site */
    visit: "Visit website",
    /** internal, for the cards whose story is the case study itself */
    caseStudy: "See the case study",
    items: [
      {
        name: "Automotive retail",
        tag: "Auto / Oradea",
        body: "Full system: launch campaigns, reels, showroom content, paid social.",
      },
      {
        name: "Dental clinics",
        tag: "Medical / Oradea",
        body: "Content system, brand rules, patient-facing campaigns for two clinics.",
      },
      {
        name: "Agro Salso",
        tag: "Agro machinery / Romania",
        body: "Digital sales system built around a website with a full machinery catalogue, a CRM for handling enquiries, commercial automations, and Google and Meta campaigns.",
      },
      {
        name: "Hotel Maxim",
        tag: "Hospitality / Oradea",
        body: "Presentation website, a CRM that centralises enquiries, automations, photo-video production, and campaigns for bookings, events and the corporate segment.",
      },
      {
        name: "Events & nightlife",
        tag: "Events / Bihor",
        body: "Event identities, posters, video teasers, full-season promotion.",
      },
      {
        name: "Origins Coffee & Drinks",
        tag: "HoReCa / Oradea",
        body: "One brand system across several locations, local presence per venue, and a loyalty platform with digital cards that live in the customer's phone.",
      },
    ],
  },

  /** Link at the foot of each open services row, to that service's page. */
  serviceLink: "See the service",

  services: [
    {
      title: "Marketing strategy",
      body: "Positioning, offer, channels, budget. The plan the rest of the system executes, written down and defended with data.",
    },
    {
      title: "Brand & design",
      body: "Identity, guidelines, and every asset your channels need to look like one brand, from business card to billboard.",
    },
    {
      title: "Premium websites",
      body: "Cinematic, parallax, interactive. Sites that position you before the first call, without sacrificing speed or SEO.",
    },
    {
      title: "Paid ads",
      body: "Meta and Google campaigns, run weekly, cut when they stop earning their budget. Search term mining, negative keywords, honest reporting.",
    },
    {
      title: "Photo-video",
      body: "Shoots at your location, edited for ads, social and web. Your business on camera, not stock footage.",
    },
  ],

  process: {
    stepLabel: "STEP",
    items: [
      {
        title: "We check your category",
        body: "City + niche. If it is taken, we tell you straight away. If there is any overlap with an existing client, the answer is no, regardless of budget.",
        items: ["City + niche", "Active engagements checked", "Straight answer in 2 working days"],
      },
      {
        title: "You get a system preview",
        body: "A short, concrete outline of what the Epic system would look like for your brand: channels, priorities, first 90 days.",
        items: [
          "Diagnostic & positioning",
          "Strategy & customer journey",
          "Channels and priorities",
          "First 90 days",
        ],
      },
      {
        title: "You decide",
        body: "If it makes sense for both sides, we start. If not, you keep the preview. No chasing, no pressure calls.",
        items: ["No chasing", "No pressure calls", "You keep the preview"],
      },
    ],
  },

  contact: {
    headingLead: "If your market still has space for a brand to lead,",
    headingAccent: "we should talk.",
    namePlaceholder: "Name",
    emailPlaceholder: "Email",
    submit: "Submit",
    submitted: "Sent — thanks!",
    sending: "Sending…",
    failed: "Didn't go through. Try again.",
    follow: "Follow",
    write: "Write",
    footerLine: "Epic Digital Hub — strategy, execution, operation.",
    footerBased: "Based in Oradea, Romania",
  },

  meta: {
    title: "Epic Digital Hub | Creative Studio",
    template: "%s | Epic Digital Hub",
    description:
      "One brand per niche, per city. Strategy, design, web, ads and production for a single brand in your category. Based in Oradea, Romania.",
    ogDescription:
      "One brand per niche, per city. We build and operate the full digital system behind a brand.",
    twitterDescription: "One brand per niche, per city.",
    ogLocale: "en_US",
    schemaDescription:
      "Growth studio in Oradea. Strategy, identity, website, content, ads and photo-video for one brand per niche, per city.",
  },
};

/** `typeof en` keeps the two locales structurally identical - a missing or
    misspelled Romanian key is a compile error, not a silent English fallback. */
const ro: typeof en = {
  htmlLang: "ro",
  switchLabel: "RO",
  switchTitle: "Comută pe engleză",

  nav: {
    home: "Epic Digital Hub, studio de strategie și brand — acasă",
    links: [
      { label: "Servicii", href: "/services" },
      { label: "Proiecte", href: "/case-studies" },
      { label: "Articole", href: "/articles" },
      { label: "Despre noi", href: "#about" },
    ],
    apply: "Aplică",
    openMenu: "Deschide meniul",
    closeMenu: "Închide meniul",
  },

  hero: {
    // Split across the design's two masked lines, as in every locale.
    line1: "Concurenții tăi",
    line2: "nu pot lucra cu noi.",
    entity:
      "Epic Digital Hub este un studio de strategie și sisteme de brand din Oradea. În fiecare oraș, colaborăm cu un singur brand din fiecare nișă.",
  },

  about: {
    list: [
      "Un singur plan.",
      "O singură echipă.",
      "Un singur raport.",
      "Iar categoria ta rămâne exclusivă.",
    ],
    /* The supplied copy runs to four short paragraphs; this block is built for
       two, so they are joined in pairs rather than adding rows to the layout.
       The wording itself is unchanged. */
    paragraphs: [
      "Prea mult marketing arată la fel și funcționează fără o direcție comună. Reclamele urmăresc clickuri. Site-ul încearcă să spună totul. Direcția vizuală se schimbă de la o lună la alta. Conținutul umple un calendar, dar nu construiește recunoaștere.",
      "Fiecare punct de contact ajunge să funcționeze izolat și să concureze singur pentru atenție. Epic Digital Hub le transformă într-un sistem coerent.",
    ],
    ctaPrimary: "Aplică pentru categoria ta",
    ctaSecondary: "Vezi proiectele",
  },

  marquee: [
    "Peste 6.500 de ore investite în sistemele clienților noștri",
    "Peste 40 de strategii și planuri de campanie dezvoltate",
    "Peste 1.200 de materiale de conținut livrate",
    "Peste 150 de materiale video filmate și editate",
    "Peste 500 de materiale de grafică și design realizate",
    "7 domenii în care avem experiență",
  ],

  eyebrow: {
    clients: "Clienți",
    whatWeDo: "Ce facem",
    process: "Proces",
    letsTalk: "Hai să vorbim",
  },

  dividers: {
    beforeWork: "Strategia devine reală când se vede diferența.",
    beforeProcess: "Ordinea contează. Fiecare leu se așază peste cel dinainte.",
  },

  testimonials: {
    title: "În cuvintele lor.",
    featured: {
      // No quotation marks inside the strings - the markup adds them.
      quote:
        "Avem două clinici, publicuri diferite și un domeniu în care nu ai voie să afirmi orice. Au înțeles regulile din prima, iar de atunci conținutul iese constant, fără să alergăm noi după el.",
      name: "DentalNet, Oradea",
    },
    items: [
      {
        quote:
          "Ne-au filmat mașinile în showroom și au scos reclame care aduc oameni la test drive, nu doar like-uri.",
        name: "AutoSiena, Oradea",
      },
      {
        quote:
          "Aveam campanii care ardeau bani degeaba. S-au uitat serios la cifre și au oprit ce nu funcționa. Acum știu pe ce se duce fiecare leu.",
        name: "Agro Salso, Bihor",
      },
      {
        quote:
          "Reels-urile făcute pentru hotel arată ca la locațiile mari din afară. Ne scriu clienți că de acolo ne-au găsit.",
        name: "Hotel Maxim, Oradea",
      },
      {
        quote:
          "Cardul de fidelitate e acum în telefonul clienților, iar la casă totul durează două secunde. Și nu apare nimic în online ce nu există în meniu.",
        name: "Origins Coffee & Drinks, Oradea",
      },
      {
        quote:
          "Au luat un material tehnic complicat și l-au făcut clar și pentru un client din afara domeniului.",
        name: "ThermX",
      },
      {
        quote:
          "Afișele și clipurile de eveniment ne-au dat un look pe care nu îl are nimeni în zonă.",
        name: "Harmony Garden",
      },
    ],
  },

  work: {
    visit: "Vezi site-ul",
    caseStudy: "Vezi studiul de caz",
    items: [
      {
        name: "Retail auto",
        tag: "Auto · Oradea",
        body: "Sistem complet de comunicare: campanii de lansare, reels, conținut realizat în showroom și campanii paid social.",
      },
      {
        name: "Clinici dentare",
        tag: "Medical · Oradea",
        body: "Strategie de conținut, reguli de brand și campanii de informare și atragere a pacienților.",
      },
      {
        name: "Agro Salso",
        tag: "Utilaje agricole · România",
        body: "Sistem digital de vânzare construit în jurul unui website cu catalog extins de utilaje, CRM pentru gestionarea solicitărilor, automatizări comerciale și campanii Google și Meta.",
      },
      {
        name: "Hotel Maxim",
        tag: "Ospitalitate · Oradea",
        body: "Website de prezentare, sistem CRM pentru centralizarea solicitărilor, automatizări, producție foto-video și campanii dedicate rezervărilor, evenimentelor și segmentului corporate.",
      },
      {
        name: "Evenimente și nightlife",
        tag: "Evenimente · Bihor",
        body: "Identități vizuale de eveniment, afișe, teasere video și campanii de promovare pentru întregul sezon.",
      },
      {
        name: "Origins Coffee & Drinks",
        tag: "HoReCa · Oradea",
        body: "Un singur sistem de brand pentru mai multe locații, prezență locală pentru fiecare dintre ele și o platformă de fidelizare cu carduri digitale direct în telefonul clientului.",
      },
    ],
  },

  /** Link at the foot of each open services row, to that service's page. */
  serviceLink: "Vezi serviciul",

  services: [
    {
      title: "Strategie de marketing",
      body: "Poziționare, ofertă, canale și buget. Stabilim, în scris și pe baza datelor, direcția pe care o urmează întregul sistem de marketing.",
    },
    {
      title: "Identitate de brand și design",
      body: "Construim identitatea, regulile vizuale și materialele necesare fiecărui canal — de la cartea de vizită până la campaniile digitale și materialele outdoor.",
    },
    {
      title: "Website-uri și sisteme digitale",
      body: "Construim website-uri premium, pagini de campanie și infrastructura digitală din spatele lor: sisteme CRM, formulare inteligente, automatizări, integrări și sisteme de urmărire a solicitărilor. Totul este gândit să funcționeze împreună, fără compromisuri în privința designului, vitezei sau optimizării SEO.",
    },
    {
      title: "Campanii plătite",
      body: "Gestionăm campanii Meta și Google, analizate și optimizate săptămânal. Oprim ceea ce nu mai justifică investiția și urmărim atent termenii de căutare, cuvintele-cheie negative și distribuirea bugetului. Raportarea rămâne clară și transparentă.",
    },
    {
      title: "Producție foto-video",
      body: "Filmăm în locația ta și adaptăm materialele pentru reclame, social media și website. Punem afacerea ta reală în prim-plan — nu imagini de stoc.",
    },
  ],

  process: {
    stepLabel: "PASUL",
    items: [
      {
        title: "Verificăm disponibilitatea categoriei tale.",
        body: "Analizăm orașul și nișa în care activezi. Dacă există orice suprapunere cu un client actual, îți spunem direct. Indiferent de buget, nu lucrăm cu branduri concurente.",
        items: [
          "Oraș și nișă",
          "Colaborări active verificate",
          "Răspuns în maximum două zile lucrătoare",
        ],
      },
      {
        title: "Primești schița sistemului.",
        body: "Îți prezentăm un plan scurt și concret despre cum ar putea arăta sistemul Epic pentru brandul tău: poziționare, parcursul clientului, canalele prioritare și direcția pentru primele 90 de zile.",
        items: [
          "Diagnostic și poziționare",
          "Strategie și parcursul clientului",
          "Canale prioritare",
          "Primele 90 de zile",
        ],
      },
      {
        title: "Tu decizi.",
        body: "Dacă există compatibilitate de ambele părți, începem colaborarea. Dacă nu, schița rămâne la tine. Fără insistențe și fără apeluri de presiune.",
        items: ["Fără insistențe", "Fără presiune", "Schița rămâne la tine"],
      },
    ],
  },

  contact: {
    headingLead:
      "Dacă în piața ta mai este loc pentru un brand care să devină reperul categoriei,",
    headingAccent: "hai să vorbim.",
    namePlaceholder: "Nume",
    emailPlaceholder: "Adresă de e-mail",
    submit: "Trimite",
    submitted: "Trimis — mulțumim!",
    sending: "Se trimite…",
    failed: "Nu a mers. Mai încearcă.",
    follow: "Urmărește-ne",
    write: "Scrie-ne",
    footerLine: "Epic Digital Hub — strategie, execuție și optimizare.",
    footerBased: "Oradea, România.",
  },

  meta: {
    title: "Epic Digital Hub | Studio de strategie și brand",
    template: "%s | Epic Digital Hub",
    description:
      "Lucrăm cu un singur brand din fiecare nișă, în fiecare oraș. Strategie, identitate, website, conținut, reclame și producție foto-video.",
    ogDescription:
      "Un singur brand din fiecare nișă, în fiecare oraș. Construim și gestionăm întregul sistem digital din spatele brandului tău.",
    twitterDescription: "Un singur brand din fiecare nișă, în fiecare oraș.",
    ogLocale: "ro_RO",
    schemaDescription:
      "Epic Digital Hub este un studio de strategie și creștere din Oradea. Construim sisteme complete de brand — de la strategie și identitate până la website, conținut, campanii și producție foto-video.",
  },
};

export const COPY = { en, ro };
export type Copy = typeof en;
