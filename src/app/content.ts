/* ---------------------------------------------------------------------------
   Site copy, EN + RO.

   Romanian is not a translation made here — it is lifted from the project's own
   bilingual copy deck (`F:\epicdigitalhub-v2\src\lib\dictionaries.ts`, which
   carries full EN/RO parity) and mapped onto this site's sections using the
   same mapping recorded in .tasks/clone-nbnzia/content-mapping.md. Where this
   site's structure has no counterpart in the deck (the two curved dividers, the
   contact form), the RO wording is composed from the deck's own phrasing so the
   voice stays consistent.

   Romanian is the DEFAULT locale and lives at `/`; English lives at `/en`.
   The audience is Oradea and Bihor.
   ------------------------------------------------------------------------ */

export const LOCALES = ["ro", "en"] as const;
export type Locale = (typeof LOCALES)[number];

/** Romanian is served from the root, English from a prefixed path. */
export const localeHref = (locale: Locale) => (locale === "ro" ? "/" : "/en");

/** The label shown on the toggle is the language it switches TO. */
export const otherLocale = (locale: Locale): Locale => (locale === "ro" ? "en" : "ro");

const en = {
  htmlLang: "en",
  /** Shown on the language toggle for the OTHER locale. */
  switchLabel: "EN",
  switchTitle: "Switch to Romanian",

  nav: {
    home: "Epic Digital Hub, creative studio — home",
    links: [
      { label: "Services", href: "#services" },
      { label: "Work", href: "#work" },
      { label: "Clients", href: "#clients" },
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
      quote:
        "Before, I had three different people for posts, ads and the website. Now it's one team that knows everything going on, and things move much faster.",
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
          "They took complicated technical material and made it clear even for a client outside the field.",
        name: "ThermX",
      },
      {
        quote: "The event posters and clips gave us a look nobody around here has.",
        name: "HarmonyGarden",
      },
    ],
  },

  work: {
    visit: "Visit website",
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
        name: "Agro machinery",
        tag: "Agro / Bihor",
        body: "E-commerce catalog, Google + Meta ads, dealer positioning.",
      },
      {
        name: "Hotels & hospitality",
        tag: "Hospitality / Oradea",
        body: "Brand reels, booking campaigns, B2B partner outreach.",
      },
      {
        name: "Events & nightlife",
        tag: "Events / Bihor",
        body: "Event identities, posters, video teasers, full-season promotion.",
      },
      {
        name: "Construction systems",
        tag: "Industrial / RO",
        body: "Technical positioning, presentation site, field video production.",
      },
    ],
  },

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
    home: "Epic Digital Hub, studio creativ — acasă",
    links: [
      { label: "Servicii", href: "#services" },
      { label: "Proiecte", href: "#work" },
      { label: "Clienți", href: "#clients" },
      { label: "Despre", href: "#about" },
    ],
    apply: "Aplică",
    openMenu: "Deschide meniul",
    closeMenu: "Închide meniul",
  },

  hero: {
    line1: "Concurenții tăi",
    line2: "nu ne pot angaja",
    entity:
      "Epic Digital Hub este un studio de strategie și sisteme de brand din Oradea, România, care lucrează cu un singur brand pe nișă, pe oraș.",
  },

  about: {
    list: ["Un singur plan.", "O singură echipă.", "Un singur raport.", "Categoria ta, blocată."],
    paragraphs: [
      "Majoritatea marketingului eșuează pentru că arată la fel peste tot. Reclamele aleargă după clickuri. Site-ul încearcă să explice tot. Vizualurile se schimbă în fiecare lună. Conținutul umple un calendar, dar nu construiește memorie.",
      "Fiecare punct de contact devine un moment deconectat care se luptă singur pentru atenție. Epic Digital Hub le leagă.",
    ],
    ctaPrimary: "Aplică pentru nișa ta",
    ctaSecondary: "Vezi proiectele",
  },

  marquee: [
    "6500+ ore lucrate în sistemele clienților",
    "40+ strategii și planuri de campanie scrise",
    "1200+ materiale de conținut livrate",
    "150+ video filmate și editate",
    "500+ grafici și materiale de design",
    "7 verticale în care lucrăm",
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
      quote:
        "Înainte lucram cu trei oameni diferiți pentru postări, reclame și site. Acum e o echipă care știe tot ce se întâmplă și mișcă lucrurile mult mai repede.",
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
          "Au luat un material tehnic complicat și l-au făcut clar și pentru un client din afara domeniului.",
        name: "ThermX",
      },
      {
        quote: "Afișele și clipurile de eveniment ne-au dat un look pe care nu îl are nimeni în zonă.",
        name: "HarmonyGarden",
      },
    ],
  },

  work: {
    visit: "Vezi site-ul",
    items: [
      {
        name: "Auto retail",
        tag: "Auto / Oradea",
        body: "Sistem complet: campanii de lansare, reels, conținut de showroom, paid social.",
      },
      {
        name: "Clinici dentare",
        tag: "Medical / Oradea",
        body: "Sistem de conținut, reguli de brand, campanii pentru pacienți, pentru două clinici.",
      },
      {
        name: "Utilaje agricole",
        tag: "Agro / Bihor",
        body: "Catalog e-commerce, reclame Google + Meta, poziționare de dealer.",
      },
      {
        name: "Hoteluri și ospitalitate",
        tag: "Ospitalitate / Oradea",
        body: "Reels de brand, campanii de rezervări, parteneriate B2B.",
      },
      {
        name: "Evenimente și nightlife",
        tag: "Evenimente / Bihor",
        body: "Identități de eveniment, afișe, teasere video, promovare pe tot sezonul.",
      },
      {
        name: "Sisteme de construcții",
        tag: "Industrial / RO",
        body: "Poziționare tehnică, site de prezentare, producție video pe teren.",
      },
    ],
  },

  services: [
    {
      title: "Strategie de marketing",
      body: "Poziționare, ofertă, canale, buget. Planul pe care restul sistemului îl execută, scris negru pe alb și susținut cu date.",
    },
    {
      title: "Brand și design",
      body: "Identitate, reguli de brand și toate materialele de care au nevoie canalele tale, de la carte de vizită la banner.",
    },
    {
      title: "Site-uri premium",
      body: "Cinematice, cu parallax, interactive. Site-uri care te poziționează înainte de primul apel, fără să sacrifice viteza sau SEO.",
    },
    {
      title: "Reclame plătite",
      body: "Campanii Meta și Google, verificate săptămânal, oprite când nu-și mai merită bugetul. Analiză de termeni de căutare, cuvinte negative, raportare onestă.",
    },
    {
      title: "Foto-video",
      body: "Filmări la tine în locație, editate pentru reclame, social și web. Business-ul tău în fața camerei, nu filmări de stock.",
    },
  ],

  process: {
    stepLabel: "PASUL",
    items: [
      {
        title: "Verificăm categoria ta",
        body: "Oraș + nișă. Dacă e ocupată, îți spunem din prima. Dacă există orice suprapunere cu un client existent, răspunsul e nu, indiferent de buget.",
        items: ["Oraș + nișă", "Colaborări active verificate", "Răspuns clar în 2 zile lucrătoare"],
      },
      {
        title: "Primești o schiță de sistem",
        body: "Un plan scurt și concret: cum ar arăta sistemul Epic pentru brandul tău, canale, priorități, primele 90 de zile.",
        items: [
          "Diagnostic și poziționare",
          "Strategie și drumul clientului",
          "Canale și priorități",
          "Primele 90 de zile",
        ],
      },
      {
        title: "Tu decizi",
        body: "Dacă totul se leagă pentru ambele părți, începem. Dacă nu, schița rămâne la tine. Fără insistențe, fără telefoane de presiune.",
        items: ["Fără insistențe", "Fără telefoane de presiune", "Schița rămâne la tine"],
      },
    ],
  },

  contact: {
    headingLead: "Dacă în piața ta mai e loc pentru un brand care conduce,",
    headingAccent: "hai să vorbim.",
    namePlaceholder: "Nume",
    emailPlaceholder: "Email",
    submit: "Trimite",
    submitted: "Trimis — mulțumim!",
    follow: "Urmărește",
    write: "Scrie-ne",
    footerLine: "Epic Digital Hub — strategie, execuție, operare.",
    footerBased: "Din Oradea, România",
  },

  meta: {
    // The brand lockup itself reads "Epic Digital Hub / CREATIVE STUDIO", so
    // the name stays as-is in both locales; only the prose is translated.
    title: "Epic Digital Hub | Creative Studio",
    template: "%s | Epic Digital Hub",
    description:
      "Un singur brand pe nișă, pe oraș. Strategie, design, web, reclame și producție pentru un singur brand din categoria ta. Din Oradea, România.",
    ogDescription:
      "Un singur brand pe nișă, pe oraș. Construim și operăm tot sistemul digital din spatele unui brand.",
    twitterDescription: "Un singur brand pe nișă, pe oraș.",
    ogLocale: "ro_RO",
    schemaDescription:
      "Studio de creștere din Oradea. Strategie, identitate, website, conținut, reclame și foto-video pentru un singur brand pe nișă, pe oraș.",
  },
};

export const COPY = { en, ro };
export type Copy = typeof en;
