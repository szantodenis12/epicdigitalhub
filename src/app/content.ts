/* ---------------------------------------------------------------------------
   Site copy, EN + RO.

   The source of truth is the client's own copy deck, IMPLEMENTARE_COPY_V2 of
   8 October 2026 — section 01 (HOME), RO at its lines 46-315 and EN at
   3051-3302. The deck's rule is that its text goes in verbatim, diacritics
   included, so nothing here is rewritten or re-translated on this side.

   Two consequences of that worth knowing before editing:

   - The Romanian home page keeps the ENGLISH headline. The deck states it
     twice ("Versiunea în română, cu headline-ul principal în engleză", and
     again as the visible H1), so `hero.line1/line2` are the same string in
     both locales.
   - Where the deck gives more paragraphs than a block renders, the paragraphs
     are JOINED in the deck's own order, never cut. The About statement is the
     case to watch: the deck gives a heading and four paragraphs, this block
     renders a list of display-size paragraphs, so it holds the heading and two
     joined pairs.

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
      { label: "Niches", href: "/niches" },
      { label: "Insights", href: "/articles" },
      { label: "About", href: "#about" },
    ],
    apply: "Let’s Talk",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },

  hero: {
    line1: "Your competitors",
    line2: "can’t hire us.",
    /** The deck's hero paragraph. It replaced an entity sentence written for
        SEO/GEO, which named the city in the first indexable line — see the
        implementation notes; the city now appears first in the About block. */
    entity:
      "We work with one brand per niche, per city. Strategy, branding, websites, content and advertising, all managed by one team.",
  },

  about: {
    list: ["One strategy.", "One team.", "Measurable results.", "Exclusivity in your industry."],
    paragraphs: [
      "Marketing shouldn’t work in pieces.",
      "A website, a few campaigns and a steady flow of social media posts don’t automatically add up to a marketing strategy. What matters is what your brand communicates, who it speaks to and how every interaction contributes to the bigger picture.",
      "At Epic Digital Hub, we take responsibility for that bigger picture. We set the direction, create the work and coordinate the marketing, making sure every element has a clear purpose. We don’t treat your website, content and advertising as unrelated projects.",
    ],
    /* Labels follow the buttons' destinations: the first goes to /apply, the
       second to the work section. The deck's own CTA for this block, "How We
       Work", has no button here — there is no process anchor in this row. */
    ctaPrimary: "Check Availability",
    ctaSecondary: "Explore All Work",
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
    process: "How We Work",
    letsTalk: "Talk to Us",
  },

  dividers: {
    beforeWork: "Strategy becomes real when you can see the difference.",
    beforeProcess: "The order matters. Every leu builds on the one before it.",
  },

  testimonials: {
    title: "From the people we work with.",
    featured: {
      // No quotation marks inside the strings - the markup adds them.
      quote:
        "We run two clinics with different audiences, and communication in healthcare requires particular attention. EDH understood that from day one. Our content is well organised, the information is accurate, and we trust the way our clinics are represented.",
      name: "DentalNet, Oradea",
    },
    items: [
      {
        quote:
          "They know how to present cars at their best without overdoing it. The videos feel natural, our social media stays consistent, and every model gets the attention it deserves. We appreciate their commitment and attention to detail on every shoot.",
        name: "AutoSiena, Oradea",
      },
      {
        quote:
          "They created a website that presents our machinery range clearly and makes information easy to find. They also take care of our printed materials and online campaigns. It’s good to work with a team that understands our industry and genuinely gets involved.",
        name: "Agro Salso, Bihor",
      },
      {
        quote:
          "Our new website presents the hotel exactly as we wanted and gives guests the information they need. EDH also manages our Google campaigns, which bring in customers. What matters most to us is being visible when people are looking for accommodation in Oradea.",
        name: "Hotel Maxim, Oradea",
      },
      {
        quote:
          "They’ve helped us create a more consistent experience, from social media to our loyalty programme. The digital cards are easy to use for both our customers and our team. They understand what Origins stands for, and that shows in their work.",
        name: "Origins Coffee & Drinks, Oradea",
      },
      {
        quote:
          "Our product involves a lot of technical information, and we needed to make it easier for customers to understand. EDH took the time to learn how the product works, identify what matters to our customers and communicate its benefits clearly.",
        name: "ThermX",
      },
      {
        quote:
          "They captured the atmosphere of our event in a visual identity that genuinely feels like us. From posters and video to social media, everything follows the same creative direction. We especially appreciate their attention to detail and all the work that goes on behind the scenes.",
        name: "Harmony Garden",
      },
    ],
  },

  work: {
    /** external, for the cards whose client has a public site */
    visit: "Visit website",
    /** internal, for the cards whose story is the case study itself */
    caseStudy: "See the case study",
    /* ORDER IS LOAD-BEARING: `WORK_VISUALS` in site.tsx pairs each index with
       an image, a brand colour and a case-study slug. The deck lists the same
       six projects in a different order; the copy is matched by project, not
       by position, so the pairing survives. */
    items: [
      {
        name: "Automotive Retail",
        tag: "Automotive · Oradea",
        body: "Vehicle launch campaigns, photo and video production, social media content and digital advertising for automotive brands and dealerships.",
      },
      {
        name: "Dental Clinics",
        tag: "Healthcare · Oradea",
        body: "Brand communication for two dental clinics serving adults and children. From brand identity and doctor profiles to patient information and promotional campaigns.",
      },
      {
        name: "Agro Salso",
        tag: "Agricultural Machinery · Romania",
        body: "A website featuring a comprehensive machinery catalogue, CRM for managing enquiries, commercial automations and Google and Meta campaigns focused on lead generation.",
      },
      {
        name: "Hotel Maxim",
        tag: "Hospitality · Oradea",
        body: "A presentation website, photo and video production, CRM and enquiry management automations, alongside targeted campaigns for accommodation, events and corporate bookings.",
      },
      {
        name: "Events & Nightlife",
        tag: "Events · Bihor",
        body: "Event branding, visual identities, posters, video teasers, social media content and seasonal promotional campaigns.",
      },
      {
        name: "Origins Coffee & Drinks",
        tag: "Hospitality · Oradea",
        body: "Consistent brand communication across multiple locations, local marketing campaigns and a digital loyalty programme with cards customers can access directly from their phones.",
      },
    ],
  },

  /** Link at the foot of each open services row, to that service's page. */
  serviceLink: "See the service",

  services: [
    {
      title: "Marketing Strategy",
      body: "We study your business, market and audience to define your priorities, channels and communication strategy.",
    },
    {
      title: "Branding & Design",
      body: "Visual identities, digital and print materials, creative campaigns and a consistent brand presence across every channel.",
    },
    {
      title: "Web Design & Development",
      body: "Business websites, digital platforms and custom solutions designed around your business and customer needs.",
    },
    {
      title: "Digital Advertising",
      body: "Google and Meta campaigns, from strategy and creative development to execution, monitoring and optimisation.",
    },
    {
      title: "Photo & Video Production",
      body: "Commercial photography, reels, product presentations and video content tailored to your brand and the platforms where it appears.",
    },
  ],

  process: {
    stepLabel: "STEP",
    items: [
      {
        title: "We check availability.",
        body: "We work with one brand per niche, per city. Before taking on a project, we check for any potential conflicts with our existing clients.",
        items: ["City & industry", "Existing client review", "Response within two business days"],
      },
      {
        title: "We get to know your business.",
        body: "We discuss your goals, review your current marketing and identify where we can make a difference. You’ll receive an initial outline of our recommended approach, including key services, priorities and a direction for the first 90 days.",
        items: ["Initial assessment", "Positioning", "Strategy & channels", "First 90 days"],
      },
      {
        title: "We decide if it’s a good fit.",
        body: "If our approach aligns with your needs and we believe we can do meaningful work together, we agree on the details and get started. If not, the initial assessment and recommendations are yours to keep.",
        items: ["No obligation", "No pressure", "A mutual decision"],
      },
    ],
  },

  contact: {
    headingLead: "Let’s see what we can build",
    headingAccent: "together.",
    body: "Tell us a little about your business. We’ll check availability in your industry and get back to you within two business days.",
    namePlaceholder: "Name",
    emailPlaceholder: "Email",
    submit: "Send Enquiry",
    submitted: "Sent — thanks!",
    sending: "Sending…",
    failed: "Didn't go through. Try again.",
    follow: "Follow Us",
    write: "Get in Touch",
    footerLine: "Epic Digital Hub — strategy, execution, operation.",
    footerBased: "Based in Oradea, Romania",
  },

  meta: {
    title: "Epic Digital Hub | Marketing, Branding & Web Design Studio",
    template: "%s | Epic Digital Hub",
    description:
      "Epic Digital Hub is a marketing studio based in Oradea, Romania. Strategy, branding, websites, content, Google and Meta Ads, and photo-video production.",
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
      { label: "Domenii", href: "/niches" },
      { label: "Articole", href: "/articles" },
      { label: "Despre noi", href: "#about" },
    ],
    apply: "Hai să discutăm",
    openMenu: "Deschide meniul",
    closeMenu: "Închide meniul",
  },

  hero: {
    /* English on purpose, in both locales: the deck keeps the main headline in
       English on the Romanian page. */
    line1: "Your competitors",
    line2: "can’t hire us.",
    entity:
      "Lucrăm cu un singur brand din fiecare nișă, în fiecare oraș. Strategie, branding, website-uri, conținut și publicitate, coordonate de aceeași echipă.",
  },

  about: {
    list: [
      "O singură strategie.",
      "O singură echipă.",
      "Rezultate măsurabile.",
      "Exclusivitate în nișa ta.",
    ],
    paragraphs: [
      "Marketingul nu ar trebui să funcționeze pe bucăți.",
      "Un website, câteva campanii și postări constante nu înseamnă automat o strategie de marketing. Contează ce comunică brandul, cui se adresează și cum se leagă toate punctele de contact cu publicul.",
      "La Epic Digital Hub, ne ocupăm de imaginea de ansamblu. Stabilim direcția, dezvoltăm materialele necesare și coordonăm promovarea, astfel încât fiecare componentă să aibă un rol clar. Nu tratăm website-ul, conținutul și publicitatea ca proiecte fără legătură între ele.",
    ],
    ctaPrimary: "Verifică disponibilitatea",
    ctaSecondary: "Vezi toate proiectele",
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
    process: "Cum lucrăm",
    letsTalk: "Contactează-ne",
  },

  dividers: {
    beforeWork: "Strategia devine reală când se vede diferența.",
    beforeProcess: "Ordinea contează. Fiecare leu se așază peste cel dinainte.",
  },

  testimonials: {
    title: "Din perspectiva clienților noștri.",
    featured: {
      // No quotation marks inside the strings - the markup adds them.
      quote:
        "Avem două clinici, cu publicuri diferite, iar comunicarea în domeniul medical necesită multă atenție. Echipa EDH a înțeles acest lucru de la început. Conținutul este bine organizat, informațiile sunt corecte, iar noi avem încredere în felul în care suntem reprezentați.",
      name: "DentalNet, Oradea",
    },
    items: [
      {
        quote:
          "Știu să pună în valoare mașinile fără să exagereze. Materialele video sunt naturale, comunicarea este constantă, iar fiecare model este prezentat într-un mod potrivit. Apreciem implicarea lor și atenția acordată fiecărei filmări.",
        name: "AutoSiena, Oradea",
      },
      {
        quote:
          "Ne-au realizat un website pe care gama de utilaje este prezentată clar, iar informațiile sunt ușor de găsit. Se ocupă și de materialele tipărite și de campaniile online. Avem alături o echipă implicată, care a înțeles specificul activității noastre.",
        name: "Agro Salso, Bihor",
      },
      {
        quote:
          "Noul website prezintă hotelul așa cum ne dorim și le oferă oaspeților informațiile de care au nevoie. Echipa EDH gestionează și campaniile Google, prin care atragem clienți. Pentru noi, contează să fim vizibili atunci când oamenii caută cazare în Oradea.",
        name: "Hotel Maxim, Oradea",
      },
      {
        quote:
          "Ne-au ajutat să avem o comunicare mai consecventă, de la social media până la programul de fidelizare. Cardurile digitale sunt ușor de folosit, atât pentru clienți, cât și pentru echipa noastră. Au înțeles ce reprezintă Origins și s-au implicat în fiecare etapă.",
        name: "Origins Coffee & Drinks, Oradea",
      },
      {
        quote:
          "Avem un produs cu multe detalii tehnice, iar provocarea era să le explicăm într-un mod accesibil, fără să pierdem informațiile importante. Echipa EDH a acordat timp înțelegerii produsului și a găsit o formulă de comunicare potrivită.",
        name: "ThermX",
      },
      {
        quote:
          "Au reușit să transpună atmosfera evenimentului într-o identitate vizuală care ne reprezintă. Afișele, materialele video și comunicarea din social media au aceeași direcție. Am apreciat mai ales atenția la detalii și implicarea din spatele fiecărui eveniment.",
        name: "Harmony Garden",
      },
    ],
  },

  work: {
    visit: "Vezi site-ul",
    caseStudy: "Vezi studiul de caz",
    items: [
      {
        name: "Dealeri auto",
        tag: "Auto · Oradea",
        body: "Campanii de lansare pentru modele noi, producție foto-video, administrarea comunicării pe social media și promovare digitală pentru branduri auto și showroomuri.",
      },
      {
        name: "Clinici stomatologice",
        tag: "Medical · Oradea",
        body: "Strategie și comunicare pentru două clinici stomatologice, dedicate adulților și copiilor. Proiectele includ identitate vizuală, prezentarea echipelor medicale, materiale informative și campanii adresate pacienților.",
      },
      {
        name: "Agro Salso",
        tag: "Utilaje agricole · România",
        body: "Dezvoltarea unui website cu un catalog complet de utilaje, implementarea unui CRM pentru gestionarea solicitărilor, automatizări comerciale și campanii Google Ads și Meta Ads pentru generarea de potențiali clienți.",
      },
      {
        name: "Hotel Maxim",
        tag: "HoReCa · Oradea",
        body: "Website de prezentare, producție foto-video, CRM și automatizări pentru gestionarea solicitărilor, alături de campanii dedicate cazării, evenimentelor și segmentului corporate.",
      },
      {
        name: "Evenimente",
        tag: "Evenimente · Bihor",
        body: "Concepte și identități vizuale pentru evenimente, afișe, materiale video de promovare, conținut pentru social media și campanii digitale desfășurate pe parcursul sezonului.",
      },
      {
        name: "Origins Coffee & Drinks",
        tag: "HoReCa · Oradea",
        body: "Identitate și comunicare consecventă pentru mai multe locații, promovare locală și un program de fidelizare cu carduri digitale accesibile direct de pe telefon.",
      },
    ],
  },

  /** Link at the foot of each open services row, to that service's page. */
  serviceLink: "Vezi serviciul",

  services: [
    {
      title: "Strategie de marketing",
      body: "Analizăm afacerea, piața și publicul. Stabilim prioritățile, canalele și direcția de comunicare.",
    },
    {
      title: "Branding & design",
      body: "Identitate vizuală, materiale digitale și tipărite, campanii creative și o imagine consecventă pe toate canalele.",
    },
    {
      title: "Web design & development",
      body: "Website-uri de prezentare, platforme și soluții digitale, dezvoltate în jurul nevoilor afacerii și ale clienților.",
    },
    {
      title: "Publicitate digitală",
      body: "Campanii Google și Meta, de la strategie și creație până la implementare, monitorizare și optimizare.",
    },
    {
      title: "Producție foto-video",
      body: "Fotografie comercială, reels, prezentări de produs și conținut video realizat pentru brand și canalele pe care comunică.",
    },
  ],

  process: {
    stepLabel: "PASUL",
    items: [
      {
        title: "Verificăm disponibilitatea",
        body: "Lucrăm cu un singur brand din fiecare nișă, în fiecare oraș. De aceea, verificăm dacă există deja o colaborare care ar putea crea un conflict de interese.",
        items: [
          "Oraș și nișă",
          "Verificarea colaborărilor existente",
          "Răspuns în două zile lucrătoare",
        ],
      },
      {
        title: "Analizăm afacerea și oportunitățile",
        body: "Discutăm despre obiectivele tale, analizăm comunicarea actuală și identificăm unde putem aduce valoare. Îți prezentăm o primă propunere de abordare, cu serviciile recomandate, prioritățile și direcțiile pentru primele 90 de zile.",
        items: [
          "Analiză inițială",
          "Poziționare",
          "Strategie și canale",
          "Plan pentru primele 90 de zile",
        ],
      },
      {
        title: "Stabilim dacă mergem mai departe",
        body: "Îți prezentăm propunerea, explicăm ce presupune colaborarea și discutăm detaliile. Dacă suntem de acord asupra obiectivelor și modului de lucru, începem proiectul. Dacă alegi să nu continui, analiza și recomandările prezentate rămân la tine.",
        items: ["Fără insistențe", "Fără presiune", "Decizie comună"],
      },
    ],
  },

  contact: {
    headingLead: "Hai să vedem ce putem construi",
    headingAccent: "împreună.",
    body: "Spune-ne câteva lucruri despre afacerea ta. Verificăm disponibilitatea nișei și revenim cu un răspuns în cel mult două zile lucrătoare.",
    namePlaceholder: "Nume",
    emailPlaceholder: "Adresă de e-mail",
    submit: "Trimite solicitarea",
    submitted: "Trimis — mulțumim!",
    sending: "Se trimite…",
    failed: "Nu a mers. Mai încearcă.",
    follow: "Urmărește-ne",
    write: "Scrie-ne",
    footerLine: "Epic Digital Hub — strategie, execuție și optimizare.",
    footerBased: "Oradea, România.",
  },

  meta: {
    title: "Epic Digital Hub | Agenție de marketing, branding și web design",
    template: "%s | Epic Digital Hub",
    description:
      "Epic Digital Hub este o agenție de marketing din Oradea, specializată în strategie, branding, web design, social media, Google Ads, Meta Ads și producție foto-video.",
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
