import type { Locale } from "../content";

export type ServiceDeliverable = {
  title: string;
  body: string;
};

export type ServiceFaqItem = {
  q: string;
  a: string;
};

export type ServiceSection = {
  /** Small label above the statement (doc's section name) */
  kicker: string;
  /** The statement heading (rendered as H2) */
  heading: string;
  paragraphs: string[];
};

export type Service = {
  slug: string;
  /** "01" … "10" */
  num: string;
  /** Service name — label above the H1 and row title on the hub */
  name: string;
  /** Short description shown on the hub list */
  hubDescription: string;
  /** Link line on the hub row */
  hubLink: string;
  hero: {
    h1: string;
    paragraphs: string[];
    cta: string;
  };
  direction: ServiceSection;
  deliverablesTitle: string;
  deliverables: ServiceDeliverable[];
  how: ServiceSection;
  faq: ServiceFaqItem[];
  closing: {
    heading: string;
    line?: string;
    cta: string;
  };
  /** Pending: pages are client components, per-page <head> metadata not wired yet */
  meta: {
    title: string;
    description: string;
  };
};

export type ServicesCopy = {
  backLabel: string;
  faqTitle: string;
  /** Prefix for the apply-form prefill; service name gets appended */
  applyPrefill: string;
  hub: {
    kicker: string;
    h1: string;
    paragraphs: string[];
    ctaPrimary: string;
    ctaSecondary: string;
    start: ServiceSection;
    listKicker: string;
    steps: {
      kicker: string;
      heading: string;
      items: { title: string; body: string }[];
    };
    closing: {
      heading: string;
      line: string;
      cta: string;
    };
    meta: {
      title: string;
      description: string;
    };
  };
  exclusivity: {
    heading: string;
    paragraphs: string[];
    cta: string;
  };
  services: Service[];
};

const ro: ServicesCopy = {
  backLabel: "Toate serviciile",
  faqTitle: "Întrebări frecvente",
  applyPrefill: "Serviciul care mă interesează: ",
  hub: {
    kicker: "Ce facem",
    h1: "O singură strategie. Toate serviciile de care ai nevoie.",
    paragraphs: [
      "Reclamele atrag potențiali clienți. Conținutul le câștigă încrederea. Site-ul îi ajută să ia o decizie. Datele ne arată ce funcționează și unde merită să investim.",
      "La Epic Digital Hub, toate serviciile lucrează în aceeași direcție. Alegem soluțiile potrivite pentru businessul tău, stabilim prioritățile și ne ocupăm de implementare. Lucrezi cu o echipă care înțelege imaginea de ansamblu, nu doar fiecare canal în parte.",
    ],
    ctaPrimary: "Verifică disponibilitatea în domeniul tău",
    ctaSecondary: "Vezi serviciile",
    start: {
      kicker: "De unde începem",
      heading: "Înainte să propunem soluții, vrem să înțelegem problema.",
      paragraphs: [
        "Poate site-ul tău atrage vizitatori, dar prea puțini devin clienți. Poate primești recomandări, însă imaginea businessului tău în online nu reflectă calitatea serviciilor. Sau investești deja în marketing, dar nu știi cât de eficiente sunt campaniile.",
        "Analizăm oferta, publicul, concurența și parcursul clientului, de la primul contact până la achiziție. Pe baza acestor informații, stabilim prioritățile și îți recomandăm investițiile care pot aduce cele mai bune rezultate.",
      ],
    },
    listKicker: "Serviciile",
    steps: {
      kicker: "Cum începem",
      heading: "Înainte de orice ofertă, avem o discuție concretă.",
      items: [
        {
          title: "Analizăm piața și concurența.",
          body:
            "Lucrăm cu un singur brand din fiecare nișă, în fiecare oraș. De aceea, verificăm mai întâi dacă există un parteneriat activ care ar putea crea un conflict de interese.",
        },
        {
          title: "Stabilim direcția.",
          body:
            "Dacă domeniul este disponibil, discutăm despre obiective, priorități, canalele potrivite și planul pentru primele 90 de zile.",
        },
        {
          title: "Decidem împreună ce urmează.",
          body:
            "Stabilim clar ce face fiecare echipă, ce livrăm și ce buget este necesar. Începem colaborarea doar atunci când există o direcție agreată de ambele părți.",
        },
      ],
    },
    closing: {
      heading: "Spune-ne ce vrei să obții pentru businessul tău.",
      line: "Îți spunem ce considerăm că trebuie făcut pentru a ajunge acolo.",
      cta: "Verifică disponibilitatea nișei tale",
    },
    meta: {
      title: "Servicii de marketing și dezvoltare web | Epic Digital Hub",
      description:
        "Strategie de marketing, campanii PPC, SEO și GEO, social media, producție video, design și dezvoltare web. Servicii coordonate de o singură echipă.",
    },
  },
  exclusivity: {
    heading: "Un singur brand pe nișă, în fiecare oraș.",
    paragraphs: [
      "Înainte de orice proiect, verificăm dacă putem lucra împreună. Dacă nișa ta este deja ocupată în orașul tău sau există o suprapunere cu un client activ, îți spunem direct.",
      "Dacă există disponibilitate, discutăm despre business, priorități și cum ar putea arăta colaborarea.",
    ],
    cta: "Verifică disponibilitatea nișei tale",
  },
  services: [
    {
      slug: "campanii-ppc",
      num: "01",
      name: "Campanii PPC",
      hubDescription:
        "Campanii Google și Meta construite în jurul ofertei tale și al unui obiectiv comercial clar. Urmărim ce se întâmplă după click și ajustăm bugetele pe baza rezultatelor.",
      hubLink: "Vezi cum gestionăm campaniile",
      hero: {
        h1: "Fiecare leu investit trebuie să aibă un scop.",
        paragraphs: [
          "Unde investim. Ce rezultate obținem. Ce schimbăm în continuare.",
          "Creăm și administrăm campanii Google Ads și Meta Ads pornind de la oferta ta, publicul căruia te adresezi și obiectivele comerciale. Nu urmărim doar clickuri sau afișări, ci ceea ce se întâmplă după ele.",
          "Fiecare campanie are un obiectiv definit, un buget justificat și indicatori prin care îi evaluăm performanța.",
        ],
        cta: "Discută cu noi despre campaniile tale",
      },
      direction: {
        kicker: "Ce urmărim",
        heading:
          "Nu contează doar câți oameni ajung pe site. Contează ce fac acolo.",
        paragraphs: [
          "O reclamă poate atrage vizitatori, dar rezultatele depind și de ceea ce găsesc după ce dau click: oferta, pagina de destinație, formularul de contact și modul în care sunt preluate solicitările.",
          "Analizăm întregul parcurs. Dacă problema este în ofertă sau pe site, o identificăm înainte să recomandăm creșterea bugetului. Dacă reclamele atrag persoane nepotrivite, ajustăm mesajele, audiențele și criteriile de optimizare.",
        ],
      },
      deliverablesTitle: "Ce include colaborarea",
      deliverables: [
        {
          title: "Analiza conturilor și a ofertei",
          body:
            "Verificăm campaniile anterioare, rezultatele obținute și datele disponibile. Identificăm ce merită păstrat și ce trebuie corectat.",
        },
        {
          title: "Strategia de campanii",
          body:
            "Stabilim canalele potrivite, audiențele, mesajele, obiectivele și distribuția inițială a bugetului.",
        },
        {
          title: "Texte și concepte creative",
          body:
            "Pregătim mesaje și materiale publicitare adaptate produsului, publicului și etapei în care se află potențialul client.",
        },
        {
          title: "Configurare și lansare",
          body:
            "Organizăm conturile și campaniile, configurăm măsurarea conversiilor și pregătim lansarea.",
        },
        {
          title: "Optimizare continuă",
          body:
            "Analizăm termenii de căutare, excluderile, audiențele, reclamele și rezultatele. Ajustăm campaniile pe baza datelor, nu a presupunerilor.",
        },
        {
          title: "Analiză și raportare",
          body:
            "Primești rapoarte clare despre performanță, limitele măsurării și deciziile propuse pentru perioada următoare.",
        },
      ],
      how: {
        kicker: "Testare și optimizare",
        heading: "Testăm cu un scop. Optimizăm pe baza rezultatelor.",
        paragraphs: [
          "Stabilim de la început ce vrem să verificăm și ce buget alocăm testelor. Lăsăm campaniile să acumuleze suficiente date pentru a lua decizii relevante, apoi ajustăm mesajele și distribuția bugetului.",
          "Recomandăm creșterea investiției atunci când rezultatele oferă argumente comerciale pentru această decizie.",
        ],
      },
      faq: [
        {
          q: "Cu ce buget ar trebui să începem?",
          a:
            "Depinde de industrie, concurență, ofertă, zona geografică și obiective. Bugetul de publicitate, administrarea campaniilor și producția materialelor sunt stabilite separat, în funcție de proiect.",
        },
        {
          q: "Puteți prelua campanii care rulează deja?",
          a:
            "Da. Analizăm structura conturilor, istoricul campaniilor și configurarea măsurării. Păstrăm ce funcționează și intervenim acolo unde există motive concrete.",
        },
        {
          q: "Cum evaluăm rezultatele?",
          a:
            "Prin indicatori relevanți pentru business: cereri calificate, programări, comenzi sau alte conversii importante. Acolo unde datele permit, analizăm și legătura dintre costul promovării și vânzările generate.",
        },
      ],
      closing: {
        heading:
          "Ce rezultate ar trebui să îți aducă următorul buget de publicitate?",
        line:
          "Pornim de la obiectivele tale și construim campaniile în jurul lor.",
        cta: "Discută cu Epic",
      },
      meta: {
        title: "Campanii PPC Google Ads și Meta Ads | Epic Digital Hub",
        description:
          "Administrare campanii Google Ads și Meta Ads. Strategie, creație, optimizare și raportare, cu accent pe cereri relevante, vânzări și rezultate măsurabile.",
      },
    },
    {
      slug: "seo-geo",
      num: "02",
      name: "SEO și GEO",
      hubDescription:
        "Punem în ordine informația despre businessul tău: în site, în căutări și în sursele din care sistemele AI își construiesc răspunsurile. Conținut clar, structură bună, prezență coerentă.",
      hubLink: "Vezi cum îți creștem vizibilitatea",
      hero: {
        h1: "Să fii găsit e important. Să fii ales contează și mai mult.",
        paragraphs: [
          "Optimizăm prezența digitală a brandului tău pentru motoarele de căutare și sistemele AI.",
          "Corectăm problemele tehnice, organizăm informațiile și dezvoltăm conținut care răspunde întrebărilor reale ale clienților. Obiectivul este ca businessul tău să fie mai ușor de găsit, de înțeles și de evaluat.",
        ],
        cta: "Hai să discutăm despre vizibilitatea ta online",
      },
      direction: {
        kicker: "Abordarea noastră",
        heading: "Conținut relevant. Structură corectă. Informații credibile.",
        paragraphs: [
          "Înainte să cumpere, oamenii caută informații. Vor să știe ce oferi, cât de potrivite sunt serviciile tale, cum lucrezi și ce te diferențiază.",
          "SEO urmărește îmbunătățirea vizibilității în rezultatele organice ale motoarelor de căutare.",
          "GEO se concentrează pe modul în care informațiile despre un brand pot fi interpretate și utilizate de sistemele de inteligență artificială în răspunsurile generate.",
          "Abordăm aceste două direcții împreună, pornind de la aceleași principii: informații corecte, conținut bine organizat și o structură tehnică accesibilă.",
        ],
      },
      deliverablesTitle: "Ce optimizăm",
      deliverables: [
        {
          title: "Audit tehnic și de conținut",
          body:
            "Identificăm problemele de indexare, paginile care necesită îmbunătățiri, informațiile lipsă și obstacolele tehnice care afectează accesibilitatea conținutului.",
        },
        {
          title: "Cercetarea cuvintelor-cheie și a intențiilor de căutare",
          body:
            "Analizăm ce caută potențialii clienți și organizăm subiectele în funcție de servicii, relevanță și intenția de cumpărare.",
        },
        {
          title: "Arhitectura website-ului",
          body:
            "Organizăm paginile, navigarea și legăturile interne pentru ca informațiile să fie accesibile și ușor de parcurs.",
        },
        {
          title: "Pagini de servicii și conținut informativ",
          body:
            "Dezvoltăm conținut care explică oferta, avantajele, procesul de lucru și răspunde întrebărilor frecvente ale clienților.",
        },
        {
          title: "SEO local",
          body:
            "Optimizăm informațiile despre locații, servicii și datele de contact pentru businessurile care se adresează unei piețe locale.",
        },
        {
          title: "Informații despre brand și date structurate",
          body:
            "Organizăm informațiile despre companie, servicii și persoanele relevante și implementăm date structurate acolo unde sunt aplicabile.",
        },
        {
          title: "Monitorizare și analiză",
          body:
            "Urmărim vizibilitatea organică, traficul relevant și conversiile care pot fi măsurate, pentru a evalua rezultatele optimizărilor.",
        },
      ],
      how: {
        kicker: "Cum stabilim prioritățile",
        heading:
          "Începem cu paginile care pot influența direct rezultatele businessului.",
        paragraphs: [
          "Corectăm mai întâi problemele tehnice care afectează accesul la conținut și indexarea.",
          "Continuăm cu paginile de servicii și produsele importante, apoi dezvoltăm conținut suplimentar în funcție de întrebările publicului și oportunitățile identificate.",
          "Nu publicăm conținut doar pentru a crește numărul de pagini. Fiecare intervenție trebuie să aibă o justificare.",
        ],
      },
      faq: [
        {
          q:
            "Puteți garanta prima poziție în Google sau apariția în răspunsurile AI?",
          a:
            "Nu. Putem controla calitatea optimizărilor și a conținutului, dar afișarea și ordonarea rezultatelor sunt decise de platforme. Nicio agenție nu poate garanta aceste poziții.",
        },
        {
          q: "Cât durează până apar rezultatele?",
          a:
            "Depinde de situația actuală a website-ului, nivelul concurenței și amploarea optimizărilor. După audit, stabilim un plan de lucru și indicatori prin care urmărim progresul.",
        },
        {
          q: "Este necesar să publicăm articole în fiecare săptămână?",
          a:
            "Nu neapărat. În unele cazuri, optimizarea paginilor existente și corectarea problemelor tehnice pot avea prioritate față de publicarea de articole noi.",
        },
      ],
      closing: {
        heading:
          "Cât de ușor îți găsesc clienții businessul atunci când au nevoie de el?",
        cta: "Hai să analizăm vizibilitatea brandului tău",
      },
      meta: {
        title: "Servicii SEO și GEO | Epic Digital Hub",
        description:
          "Optimizare SEO și GEO pentru motoarele de căutare și platformele AI. Audit tehnic, structură, conținut, SEO local și date structurate.",
      },
    },
    {
      slug: "social-media-management",
      num: "03",
      name: "Social Media Management",
      hubDescription:
        "Dăm conturilor tale o direcție pe care oamenii o pot recunoaște. Mesaje, design și conținut care se leagă de ceea ce vinzi și de felul în care vrei să fii perceput.",
      hubLink: "Vezi cum gestionăm comunicarea",
      hero: {
        h1: "Nu ai nevoie doar de postări. Ai nevoie de o direcție.",
        paragraphs: [
          "Ce comunici, cum arată brandul și ce alegi să arăți despre businessul tău trebuie să aibă legătură.",
          "Administrăm conturile de social media pornind de la poziționarea brandului, obiectivele comerciale și publicul căruia te adresezi.",
          "Planificăm conținutul, pregătim materialele și coordonăm publicarea, astfel încât comunicarea să fie consecventă, relevantă și ușor de recunoscut.",
        ],
        cta: "Hai să discutăm despre social media",
      },
      direction: {
        kicker: "Rolul profilului",
        heading:
          "Profilul tău ar trebui să le spună oamenilor de ce să te aleagă.",
        paragraphs: [
          "Cineva poate ajunge pe profilul tău după ce vede o reclamă, primește o recomandare sau caută informații despre business.",
          "Primele postări ar trebui să îi ofere o imagine clară despre ceea ce faci, produsele sau serviciile tale și modul în care lucrezi.",
          "Alegem subiecte relevante din activitatea businessului: produse, servicii, echipă, întrebările clienților, proiecte și momente importante. Le organizăm într-o comunicare consecventă, adaptată fiecărei platforme.",
        ],
      },
      deliverablesTitle: "Ce include colaborarea",
      deliverables: [
        {
          title: "Auditul conturilor",
          body:
            "Analizăm profilurile existente, materialele publicate și modul în care este prezentat brandul.",
        },
        {
          title: "Strategie editorială",
          body:
            "Stabilim direcția comunicării, subiectele principale, tonul, formatele și rolul fiecărei platforme.",
        },
        {
          title: "Calendar de conținut",
          body:
            "Planificăm postările în funcție de activitatea businessului, lansări, campanii și obiectivele stabilite.",
        },
        {
          title: "Copywriting și design",
          body:
            "Realizăm textele și materialele grafice pentru postări, carusele și stories, conform volumului agreat.",
        },
        {
          title: "Coordonarea producției video",
          body:
            "Integrăm materialele video în planul editorial. Producția și livrabilele aferente sunt stabilite separat în ofertă.",
        },
        {
          title: "Programare și publicare",
          body:
            "Organizăm aprobările, programăm conținutul și gestionăm publicarea conform calendarului stabilit.",
        },
        {
          title: "Analiză și optimizare",
          body:
            "Evaluăm interacțiunile relevante, vizitele pe profil, conversațiile și solicitările care pot fi atribuite activității din social media. Ajustăm direcția în funcție de rezultate.",
        },
      ],
      how: {
        kicker: "Cum colaborăm",
        heading:
          "Noi ne ocupăm de comunicare. Tu ne ții conectați la business.",
        paragraphs: [
          "Stabilim de la început persoana de contact, ritmul de lucru și termenele pentru feedback și aprobări.",
          "Avem nevoie să aflăm la timp despre oferte, produse, disponibilitate, evenimente și schimbări importante. Astfel putem crea materiale corecte și le putem publica atunci când sunt relevante.",
        ],
      },
      faq: [
        {
          q: "Câte postări sunt necesare lunar?",
          a:
            "Depinde de platforme, obiective și volumul de conținut disponibil. Stabilim numărul și tipul materialelor în propunerea de colaborare.",
        },
        {
          q: "Răspundeți și la mesaje sau comentarii?",
          a:
            "Putem include moderarea conturilor, cu intervale de disponibilitate și reguli de răspuns stabilite în prealabil. Solicitările comerciale sau tehnice care necesită confirmări sunt direcționate către echipa ta.",
        },
        {
          q: "Promovarea plătită este inclusă?",
          a:
            "Strategia de conținut și campaniile publicitare pot fi coordonate, însă administrarea reclamelor și bugetul media sunt stabilite separat în ofertă.",
        },
      ],
      closing: {
        heading:
          "Ce impresie lasă brandul tău cuiva care îți vizitează astăzi profilul?",
        cta: "Hai să construim o comunicare mai bună",
      },
      meta: {
        title: "Administrare Social Media | Epic Digital Hub",
        description:
          "Strategie și administrare social media pentru branduri. Planificare editorială, copywriting, design, conținut video, publicare și analiză.",
      },
    },
    {
      slug: "continut-video",
      num: "04",
      name: "Producție Video",
      hubDescription:
        "Filmăm businessul tău, oamenii și produsele lui. Construim materiale pentru social media, reclame și site, pornind de la ce trebuie să înțeleagă clientul.",
      hubLink: "Vezi cum realizăm conținutul video",
      hero: {
        h1: "Arată ce oferi. Nu doar spune.",
        paragraphs: [
          "Locația. Echipa. Produsele în utilizare. Detaliile pe care o fotografie sau un text nu le pot explica la fel de bine.",
          "Realizăm conținut video care prezintă businessul tău așa cum este și pune în valoare ceea ce contează pentru clienți.",
          "De la concept și filmare până la montaj și adaptarea pentru platformele pe care va fi publicat, fiecare material este construit pentru o utilizare precisă.",
        ],
        cta: "Hai să discutăm despre următoarea filmare",
      },
      direction: {
        kicker: "De la idee la materialul final",
        heading:
          "Înainte să filmăm, stabilim ce trebuie să transmită videoclipul.",
        paragraphs: [
          "Ce ar trebui să înțeleagă sau să facă un potențial client după ce îl urmărește?",
          "Răspunsul ne ajută să definim scenariul, cadrele, ritmul și durata. O reclamă video are alte cerințe decât prezentarea unei locații sau explicațiile unui specialist. Organizăm producția în funcție de scopul și platforma fiecărui material.",
        ],
      },
      deliverablesTitle: "Ce putem produce",
      deliverables: [
        {
          title: "Reels și videoclipuri scurte",
          body:
            "Conținut dinamic, cu mesaje concise, adaptat platformelor sociale și vizionării pe mobil.",
        },
        {
          title: "Materiale video pentru reclame",
          body:
            "Videoclipuri cu mesaje, începuturi și variante de montaj pregătite pentru testare în campanii publicitare.",
        },
        {
          title: "Prezentări de produse și servicii",
          body:
            "Demonstrații, explicații și prezentări care oferă clienților informațiile necesare înainte de achiziție.",
        },
        {
          title: "Conținut cu membrii echipei",
          body:
            "Interviuri, prezentări și explicații filmate într-un mod natural, fără discursuri rigide sau intervenții artificiale.",
        },
        {
          title: "Filmări de locație și atmosferă",
          body:
            "Materiale care prezintă spațiul, serviciile și experiența oferită, pentru website, social media și campanii.",
        },
        {
          title: "Conținut video pentru evenimente",
          body:
            "Surprindem momentele importante și realizăm materiale care pot fi folosite atât pentru comunicarea evenimentului, cât și pentru promovarea edițiilor viitoare.",
        },
      ],
      how: {
        kicker: "Cum lucrăm",
        heading:
          "Planificăm filmarea. Organizăm producția. Pregătim fiecare material pentru publicare.",
        paragraphs: [
          "Stabilim în avans subiectele, scenariile, cadrele, persoanele implicate și detaliile logistice.",
          "În timpul filmării urmărim planul stabilit, fără să pierdem momentele spontane care merită surprinse.",
          "După montaj, pregătim materialele în formatele convenite, cu subtitrări și adaptări acolo unde sunt necesare. Etapele de feedback și revizie sunt stabilite înainte de producție.",
        ],
      },
      faq: [
        {
          q: "Trebuie să venim noi cu ideile?",
          a:
            "Nu. Ne prezinți businessul și obiectivele, iar noi dezvoltăm conceptele și scenariile. Colaborăm cu echipa ta pentru ca informațiile și mesajele să fie corecte.",
        },
        {
          q: "Putem filma mai multe videoclipuri într-o singură zi?",
          a:
            "Da. Cu o planificare bună putem produce mai multe materiale în aceeași sesiune. Numărul depinde de complexitatea scenariilor, locații și persoanele implicate.",
        },
        {
          q: "Primim și materialele brute?",
          a:
            "Livrabilele finale, accesul la filmările brute și drepturile de utilizare sunt stabilite în ofertă, înainte de începerea producției.",
        },
      ],
      closing: {
        heading: "Ce ar merita să vadă clienții înainte să te aleagă?",
        line: "Hai să le arătăm.",
        cta: "Planifică un proiect video cu Epic",
      },
      meta: {
        title: "Producție video, Reels și reclame | Epic Digital Hub",
        description:
          "Producție video pentru branduri: Reels, reclame, prezentări de produse, interviuri, filmări de locație și evenimente. De la concept la montaj.",
      },
    },
    {
      slug: "magazine-online",
      num: "05",
      name: "Dezvoltare Magazine Online",
      hubDescription:
        "Magazine în care produsele sunt ușor de găsit, informațiile sunt clare și comanda se poate finaliza simplu. Pregătite pentru promovare și pentru operațiunile din spatele vânzării.",
      hubLink: "Vezi cum construim magazine online",
      hero: {
        h1:
          "Un magazin online gândit pentru cei care cumpără. Și pentru cei care îl administrează.",
        paragraphs: [
          "De la primul produs vizualizat până la confirmarea comenzii, fiecare etapă influențează experiența de cumpărare.",
          "Dezvoltăm magazine online adaptate produselor tale, comportamentului clienților și modului în care funcționează businessul. Ne ocupăm de structură, design, funcționalități și procesul de comandă, fără să ignorăm partea de administrare și operațiunile de după vânzare.",
        ],
        cta: "Hai să discutăm despre magazinul tău online",
      },
      direction: {
        kicker: "Abordarea",
        heading: "Ușor de cumpărat. Simplu de administrat.",
        paragraphs: [
          "Clienții trebuie să găsească rapid produsele, să poată compara variantele și să înțeleagă condițiile de livrare și plată. În același timp, echipa ta trebuie să poată gestiona eficient produsele și comenzile.",
          "Analizăm catalogul, tipurile de produse, piețele în care vinzi și procesele existente. Pe baza acestor informații, alegem platforma și funcționalitățile potrivite.",
        ],
      },
      deliverablesTitle: "Ce poate include proiectul",
      deliverables: [
        {
          title: "Organizarea catalogului de produse",
          body:
            "Structurăm categoriile, filtrele și navigarea în funcție de gama de produse și de modul în care clienții caută.",
        },
        {
          title: "Design și optimizare pentru mobil",
          body:
            "Construim pagini clare, adaptate diferitelor dispozitive, cu navigare intuitivă și elemente de interacțiune accesibile.",
        },
        {
          title: "Pagini de produs",
          body:
            "Organizăm fotografiile, descrierile, specificațiile, variantele și informațiile relevante pentru decizia de cumpărare.",
        },
        {
          title: "Coș de cumpărături și finalizarea comenzii",
          body:
            "Simplificăm pașii necesari plasării unei comenzi și afișăm clar costurile, metodele de plată și condițiile de livrare.",
        },
        {
          title: "Integrări cu servicii externe",
          body:
            "Integrăm soluții de plată, curierat, facturare, gestiune sau CRM, în funcție de compatibilitatea platformei și cerințele proiectului.",
        },
        {
          title: "Optimizare pentru promovare și măsurare",
          body:
            "Pregătim elementele tehnice convenite pentru indexarea în motoarele de căutare, feedurile de produse și urmărirea conversiilor.",
        },
        {
          title: "Testare și predare",
          body:
            "Verificăm funcționalitățile esențiale, simulăm procesul de cumpărare și explicăm echipei tale cum să administreze magazinul.",
        },
      ],
      how: {
        kicker: "Cum lucrăm",
        heading:
          "Lansăm cu funcționalitățile de care ai nevoie. Dezvoltăm pe măsură ce businessul crește.",
        paragraphs: [
          "Stabilim de la început ce trebuie să fie funcțional la lansare și ce poate fi adăugat ulterior.",
          "Parcurgem etapele de design, dezvoltare și testare, inclusiv verificarea comenzilor și a integrărilor. Clarificăm responsabilitățile, materialele necesare și eventualele costuri recurente ale soluțiilor alese.",
        ],
      },
      faq: [
        {
          q: "Puteți reface un magazin online existent?",
          a:
            "Da. Analizăm platforma actuală, catalogul, structura URL-urilor și integrările. Stabilim ce date trebuie migrate și planificăm tranziția pentru a limita problemele tehnice și comerciale.",
        },
        {
          q: "Cine se ocupă de adăugarea produselor?",
          a:
            "Stabilim în ofertă cine pregătește și introduce produsele, imaginile și descrierile, în funcție de volumul catalogului și formatul datelor disponibile.",
        },
        {
          q: "Ce se întâmplă după lansare?",
          a:
            "Putem stabili separat servicii de suport, mentenanță și dezvoltare ulterioară. Îmbunătățirile pot fi prioritizate în funcție de utilizarea magazinului și de datele colectate.",
        },
      ],
      closing: {
        heading: "Vrei să vinzi online? Începem cu experiența de cumpărare.",
        line: "Hai să proiectăm traseul complet.",
        cta: "Discută proiectul cu Epic",
      },
      meta: {
        title: "Dezvoltare magazine online | Epic Digital Hub",
        description:
          "Dezvoltăm magazine online cu design personalizat, navigare intuitivă și un proces de comandă simplu. Soluții e-commerce adaptate businessului tău.",
      },
    },
    {
      slug: "website-uri-prezentare",
      num: "06",
      name: "Dezvoltare Website-uri de Prezentare",
      hubDescription:
        "Site-uri care arată nivelul businessului tău și îl ajută pe vizitator să înțeleagă rapid de ce să te aleagă. Strategie, text, design și dezvoltare în același proiect.",
      hubLink: "Vezi cum dezvoltăm website-uri",
      hero: {
        h1: "Site-ul tău trebuie să convingă înainte să vorbești cu clientul.",
        paragraphs: [
          "Pentru mulți clienți, website-ul este primul contact serios cu businessul tău. Ar trebui să reflecte calitatea serviciilor pe care le oferi.",
          "Construim website-uri care prezintă clar oferta, evidențiază avantajele relevante și îi ajută pe vizitatori să facă următorul pas.",
          "Strategia, textele, designul și dezvoltarea sunt gândite împreună, nu tratate ca etape fără legătură.",
        ],
        cta: "Hai să discutăm despre website-ul tău",
      },
      direction: {
        kicker: "Rolul website-ului",
        heading:
          "O experiență bună începe cu informațiile potrivite, în ordinea potrivită.",
        paragraphs: [
          "Când cineva ajunge pe site, caută un răspuns, compară opțiuni sau vrea să afle dacă serviciile tale sunt potrivite pentru el.",
          "Organizăm conținutul pentru a răspunde acestor nevoi, fără informații inutile sau pași complicați.",
          "Designul reflectă personalitatea brandului, fotografiile și videoclipurile completează prezentarea, iar interacțiunile sunt construite pentru o experiență rapidă și intuitivă, inclusiv pe mobil.",
        ],
      },
      deliverablesTitle: "Ce include proiectul",
      deliverables: [
        {
          title: "Structura website-ului",
          body:
            "Stabilim paginile necesare, organizarea informațiilor și parcursul vizitatorilor în funcție de obiectivele businessului.",
        },
        {
          title: "Copywriting",
          body:
            "Scriem texte clare și convingătoare, care explică serviciile, evidențiază diferențele relevante și respectă vocea brandului.",
        },
        {
          title: "Design și experiență de utilizare",
          body:
            "Creăm o direcție vizuală adaptată poziționării brandului, cu atenție la navigare, lizibilitate și modul în care este prezentat conținutul.",
        },
        {
          title: "Dezvoltare web",
          body:
            "Implementăm paginile și funcționalitățile, cu design adaptat pentru desktop, tabletă și mobil.",
        },
        {
          title: "Formulare și integrări",
          body:
            "Configurăm formularele și conexiunile necesare pentru preluarea solicitărilor, programări sau integrarea cu un CRM, în funcție de proiect.",
        },
        {
          title: "Optimizare SEO tehnică și măsurare",
          body:
            "Pregătim structura tehnică, metadatele și configurările de măsurare incluse în proiect, pentru indexare și analiza interacțiunilor relevante.",
        },
        {
          title: "Testare și lansare",
          body:
            "Verificăm navigarea, afișarea pe dispozitive diferite, formularele și funcționalitățile importante înainte de publicare.",
        },
      ],
      how: {
        kicker: "Cum lucrăm",
        heading:
          "Stabilim ce trebuie să spună website-ul înainte să decidem cum va arăta.",
        paragraphs: [
          "Începem cu obiectivele businessului și informațiile pe care trebuie să le comunicăm.",
          "Definim structura, dezvoltăm textele și stabilim direcția vizuală înainte de implementare.",
          "Fiecare etapă are livrabile și momente de feedback stabilite, astfel încât deciziile importante să fie luate la timp, iar proiectul să avanseze organizat.",
        ],
      },
      faq: [
        {
          q: "Trebuie să avem deja textele și fotografiile?",
          a:
            "Nu. Putem redacta textele pe baza informațiilor oferite de tine. Pentru partea vizuală, analizăm materialele existente și stabilim dacă este necesară o sesiune foto-video.",
        },
        {
          q: "Vom putea actualiza singuri website-ul?",
          a:
            "Da, dacă aceasta este una dintre cerințele proiectului. Stabilim de la început ce secțiuni trebuie să poată fi administrate de echipa ta și alegem soluția tehnică potrivită.",
        },
        {
          q: "Putem păstra domeniul actual?",
          a:
            "Da. Analizăm infrastructura existentă și planificăm transferul sau conectarea noului website, inclusiv redirecționările necesare.",
        },
      ],
      closing: {
        heading:
          "Businessul tău a evoluat. Website-ul îl reprezintă la același nivel?",
        cta: "Discută proiectul cu Epic",
      },
      meta: {
        title: "Creare website-uri de prezentare | Epic Digital Hub",
        description:
          "Website-uri de prezentare cu design personalizat, texte bine construite și dezvoltare web adaptată businessului. Strategie, UX, SEO tehnic și integrări.",
      },
    },
    {
      slug: "design-grafic",
      num: "07",
      name: "Design Grafic",
      hubDescription:
        "O identitate vizuală care se păstrează de la prima reclamă până la ultima pagină din ofertă. Design pentru campanii, social media, print și materialele de care ai nevoie în vânzare.",
      hubLink: "Vezi cum lucrăm cu identitatea vizuală",
      hero: {
        h1: "Un brand recognoscibil. În orice format.",
        paragraphs: [
          "Pe un afiș, într-o reclamă, pe o prezentare comercială sau în social media, brandul tău trebuie să poată fi recunoscut.",
          "Creăm identități vizuale și materiale grafice care respectă aceeași direcție, indiferent de format. Punem accent pe claritatea mesajului, calitatea execuției și consecvența identității.",
        ],
        cta: "Hai să discutăm despre imaginea brandului tău",
      },
      direction: {
        kicker: "De ce contează identitatea vizuală",
        heading:
          "Identitatea trebuie să rămână consecventă, nu să fie reinventată la fiecare campanie.",
        paragraphs: [
          "Tipografia, culorile, imaginile și organizarea informației influențează felul în care este perceput un brand.",
          "Când există reguli vizuale bine definite, materialele pot evolua fără să piardă elementele care fac brandul recognoscibil.",
          "Pornim de la poziționarea și nevoile reale ale businessului. Un retailer care comunică frecvent promoții are alte cerințe decât o companie care prezintă servicii tehnice sau un brand premium.",
        ],
      },
      deliverablesTitle: "Ce putem realiza",
      deliverables: [
        {
          title: "Identitate vizuală",
          body:
            "Logo, paletă cromatică, tipografie și reguli de utilizare, adaptate nevoilor și obiectivelor brandului.",
        },
        {
          title: "Materiale pentru campanii",
          body:
            "Concepte grafice și adaptări pentru reclame digitale, campanii de promovare și alte formate publicitare.",
        },
        {
          title: "Design pentru social media",
          body:
            "Postări, carusele, stories și template-uri care asigură consecvența vizuală și eficientizează producția de conținut.",
        },
        {
          title: "Materiale comerciale",
          body:
            "Prezentări, oferte, broșuri, cataloage și fișe de produs, organizate pentru o comunicare clară și profesionistă.",
        },
        {
          title: "Design pentru print",
          body:
            "Afișe, flyere, cărți de vizită și alte materiale pregătite conform cerințelor tehnice de producție.",
        },
        {
          title: "Ghid de identitate vizuală",
          body:
            "Reguli de utilizare pentru logo, culori, fonturi și elemente grafice, astfel încât brandul să fie reprezentat corect în fiecare material.",
        },
      ],
      how: {
        kicker: "Cum lucrăm",
        heading: "Designul începe cu mesajul, nu cu alegerea culorilor.",
        paragraphs: [
          "Înainte de execuție stabilim cui ne adresăm, ce trebuie comunicat, unde va apărea materialul și ce rezultat urmărim.",
          "Propunem o direcție vizuală, o dezvoltăm pe baza feedbackului și pregătim fișierele pentru utilizările stabilite.",
          "Pentru materialele recurente, putem crea un sistem vizual care păstrează coerența și reduce timpul necesar producției.",
        ],
      },
      faq: [
        {
          q: "Putem păstra logo-ul actual?",
          a:
            "Da. Putem lucra cu identitatea existentă sau putem recomanda ajustări punctuale atunci când există probleme de aplicare ori de lizibilitate.",
        },
        {
          q: "Vă ocupați și de tipar?",
          a:
            "Pregătirea graficii pentru tipar și producția fizică sunt servicii diferite. Putem stabili în ofertă și coordonarea cu furnizorul de print.",
        },
        {
          q: "Primim fișierele editabile?",
          a:
            "Formatele de livrare, fișierele sursă și condițiile de licențiere pentru fonturi și imagini sunt stabilite înainte de începerea proiectului.",
        },
      ],
      closing: {
        heading:
          "Dacă ai pune toate materialele brandului tău unul lângă altul, ar arăta ca parte din aceeași identitate?",
        cta: "Construiește identitatea vizuală cu Epic",
      },
      meta: {
        title: "Design grafic și identitate vizuală | Epic Digital Hub",
        description:
          "Identitate vizuală, design pentru social media, campanii, materiale comerciale și print. Design adaptat brandului și tuturor canalelor de comunicare.",
      },
    },
    {
      slug: "email-marketing",
      num: "08",
      name: "Email Marketing",
      hubDescription:
        "Continuăm conversația cu oamenii care și-au arătat deja interesul. Campanii și automatizări construite în jurul momentelor în care un mesaj este cu adevărat util.",
      hubLink: "Vezi cum folosim email marketingul",
      hero: {
        h1: "Primul contact e doar începutul.",
        paragraphs: [
          "Un client s-a abonat la newsletter, a solicitat o ofertă sau a făcut o achiziție. Fiecare situație cere un mesaj diferit.",
          "Creăm campanii de email și automatizări adaptate relației dintre brand și client. Stabilim cui ne adresăm, ce informații sunt relevante și când este potrivit să le trimitem.",
        ],
        cta: "Hai să discutăm despre email marketing",
      },
      direction: {
        kicker: "Abordarea",
        heading: "Emailuri relevante, trimise la momentul potrivit.",
        paragraphs: [
          "Un client nou poate avea nevoie de informații suplimentare. Un abonat poate fi interesat de o lansare. Cineva care a cumpărat deja poate aprecia o recomandare complementară.",
          "Construim comunicarea în funcție de aceste situații, nu doar în jurul unui calendar de trimiteri.",
          "Fiecare email respectă identitatea brandului, transmite un mesaj clar și îi oferă destinatarului un motiv să îl citească.",
        ],
      },
      deliverablesTitle: "Ce poate include colaborarea",
      deliverables: [
        {
          title: "Analiza bazei de contacte",
          body:
            "Verificăm proveniența contactelor, calitatea informațiilor și modul în care au fost obținute acordurile de comunicare.",
        },
        {
          title: "Segmentarea audienței",
          body:
            "Organizăm contactele în categorii relevante, în funcție de datele disponibile, interese și istoricul interacțiunilor cu brandul.",
        },
        {
          title: "Planificarea campaniilor",
          body:
            "Stabilim subiectele, frecvența și calendarul trimiterilor, în acord cu lansările, ofertele și obiectivele comerciale.",
        },
        {
          title: "Copywriting și design",
          body:
            "Scriem și construim emailuri adaptate identității brandului, ușor de parcurs și optimizate pentru dispozitive mobile.",
        },
        {
          title: "Automatizări de email",
          body:
            "Configurăm, unde platforma, datele și permisiunile permit, mesaje de bun venit, comunicări după achiziție, campanii de reactivare și emailuri pentru coșuri abandonate.",
        },
        {
          title: "Testare și analiză",
          body:
            "Verificăm afișarea mesajelor, funcționarea linkurilor și rezultatele campaniilor. Folosim datele disponibile pentru a îmbunătăți comunicările următoare.",
        },
      ],
      how: {
        kicker: "Automatizări",
        heading: "Mesajul potrivit, trimis la momentul potrivit.",
        paragraphs: [
          "Construim automatizări pentru situații concrete: confirmări, mesaje de bun venit, revenirea către clienții interesați sau comunicarea după o achiziție.",
          "Stabilim când se trimite fiecare mesaj, ce informații trebuie să conțină și când comunicarea trebuie să se oprească. Integrăm automatizările în campaniile existente, astfel încât clienții să primească informații utile, într-o ordine logică.",
        ],
      },
      faq: [
        {
          q: "Putem începe dacă avem o bază mică de contacte?",
          a:
            "Da. Putem începe prin organizarea formularelor de abonare și configurarea mesajelor de bun venit. Pe măsură ce baza crește, dezvoltăm și comunicarea.",
        },
        {
          q: "Cât de des ar trebui să trimitem emailuri?",
          a:
            "Depinde de public, de tipul businessului și de informațiile pe care le ai de comunicat. Stabilim frecvența în funcție de relevanța mesajelor și de reacțiile abonaților.",
        },
        {
          q: "Cum măsurăm rezultatele?",
          a:
            "Urmărim clickurile, cererile, comenzile și, unde datele permit, veniturile atribuite campaniilor. Analizăm și rata de livrare, dezabonările și ceilalți indicatori relevanți, ținând cont de limitele măsurării.",
        },
      ],
      closing: {
        heading:
          "Ce se întâmplă după ce cineva devine interesat de brandul tău?",
        line: "Construim comunicarea care urmează.",
        cta: "Discută cu Epic",
      },
      meta: {
        title: "Email marketing și automatizări | Epic Digital Hub",
        description:
          "Campanii de email marketing, newslettere și automatizări. Segmentare, copywriting, design și analiză pentru o comunicare relevantă cu clienții.",
      },
    },
    {
      slug: "tracking-date",
      num: "09",
      name: "Tracking de Date",
      hubDescription:
        "Configurăm măsurarea acțiunilor care contează pentru business. Vezi de unde vin cererile, unde se pierd oamenii și ce poți decide pe baza datelor disponibile.",
      hubLink: "Vezi cum măsurăm performanța",
      hero: {
        h1: "Dacă nu măsori corect, nu poți investi corect.",
        paragraphs: [
          "De unde vin vizitatorii. Ce fac pe site. Unde abandonează. Câte solicitări ajung la echipa de vânzări.",
          "Configurăm și verificăm instrumentele de măsurare pentru a înțelege mai bine rezultatele activităților de marketing.",
          "Urmărim acțiunile relevante pentru business și explicăm inclusiv limitele datelor disponibile, astfel încât deciziile să nu se bazeze pe cifre interpretate greșit.",
        ],
        cta: "Hai să verificăm ce măsori",
      },
      direction: {
        kicker: "De unde începem",
        heading:
          "Un click nu înseamnă o cerere. O cerere nu înseamnă o vânzare.",
        paragraphs: [
          "Fiecare acțiune reprezintă o etapă diferită în parcursul clientului. Dacă toate sunt tratate drept conversii echivalente, rezultatele campaniilor pot deveni înșelătoare.",
          "Stabilim ce acțiuni sunt importante, cum pot fi urmărite și ce informații oferă fiecare platformă.",
          "Acolo unde este posibil, corelăm datele din website și din campaniile publicitare cu informațiile despre cererile și vânzările înregistrate de echipa ta.",
        ],
      },
      deliverablesTitle: "Ce include proiectul",
      deliverables: [
        {
          title: "Auditul implementării existente",
          body:
            "Verificăm instrumentele instalate, evenimentele urmărite, eventualele erori, dublări și informațiile care lipsesc.",
        },
        {
          title: "Planul de măsurare",
          body:
            "Definim conversiile importante și indicatorii prin care vom evalua performanța website-ului și a campaniilor.",
        },
        {
          title: "Configurarea instrumentelor",
          body:
            "Implementăm Google Analytics 4, Google Tag Manager și integrările stabilite, în funcție de infrastructura disponibilă.",
        },
        {
          title: "Urmărirea conversiilor",
          body:
            "Configurăm măsurarea acțiunilor relevante: formulare trimise, solicitări de contact, etape de cumpărare și comenzi finalizate, unde este aplicabil.",
        },
        {
          title: "Etichetarea campaniilor",
          body:
            "Stabilim reguli consecvente de etichetare pentru identificarea surselor de trafic și analiza performanței.",
        },
        {
          title: "Integrarea mecanismului de consimțământ",
          body:
            "Adaptăm funcționarea instrumentelor de tracking la configurația agreată și la opțiunile de consimțământ ale utilizatorilor.",
        },
        {
          title: "Testare și documentare",
          body:
            "Verificăm funcționarea evenimentelor și documentăm configurările, datele colectate și limitele măsurării.",
        },
      ],
      how: {
        kicker: "Cum folosim datele",
        heading: "Datele sunt utile atunci când te ajută să iei decizii.",
        paragraphs: [
          "Nu este suficient să colectăm informații. Trebuie să știm ce întrebări vrem să clarificăm.",
          "Care canal aduce solicitări relevante? Unde abandonează clienții procesul de cumpărare? Ce pagini trebuie îmbunătățite?",
          "Organizăm analiza în jurul acestor întrebări. Atunci când infrastructura permite, corelăm informațiile cu datele din CRM sau din sistemul de comenzi.",
        ],
      },
      faq: [
        {
          q: "Putem măsura toate vizitele și vânzările?",
          a:
            "Nu integral. Consimțământul utilizatorilor, setările dispozitivelor și interacțiunile prin mai multe canale pot limita colectarea și atribuirea datelor. Explicăm aceste limite atunci când analizăm rezultatele.",
        },
        {
          q:
            "De ce diferă rezultatele dintre Google Analytics și platformele de publicitate?",
          a:
            "Platformele pot folosi metode și intervale diferite pentru atribuirea conversiilor. Verificăm dacă măsurarea funcționează corect și stabilim ce surse de date folosim pentru fiecare analiză.",
        },
        {
          q: "Putem urmări dacă o solicitare s-a transformat în vânzare?",
          a:
            "În multe cazuri, da. Depinde de sistemele folosite și de modul în care sunt înregistrate și actualizate solicitările. Verificăm posibilitățile de integrare înainte să propunem o soluție.",
        },
      ],
      closing: {
        heading: "Știi exact ce rezultate obții din bugetul tău de marketing?",
        cta: "Hai să verificăm datele",
      },
      meta: {
        title:
          "Tracking, Google Analytics 4 și măsurarea conversiilor | Epic Digital Hub",
        description:
          "Configurare GA4, Google Tag Manager și tracking de conversii. Audit, implementare, testare și analiză pentru decizii de marketing bazate pe date.",
      },
    },
    {
      slug: "consultanta-marketing",
      num: "10",
      name: "Consultanță",
      hubDescription:
        "Punem ordine în obiective, ofertă, canale și bugete. Pleci cu priorități explicate și un plan pe care echipa ta îl poate pune în lucru.",
      hubLink: "Vezi cum stabilim strategia",
      hero: {
        h1: "Mai întâi stabilim ce merită făcut.",
        paragraphs: [
          "Poate ai deja o echipă de marketing, mai mulți colaboratori și suficiente idei. Ce lipsește este o direcție comună: ce facem mai întâi, cine se ocupă și cum evaluăm rezultatele.",
          "Te ajutăm să iei decizii mai bine fundamentate. Analizăm situația actuală, discutăm deschis despre probleme și stabilim un plan pe care îl poți aplica în activitatea de zi cu zi.",
        ],
        cta: "Hai să discutăm despre strategia ta",
      },
      direction: {
        kicker: "Când ai nevoie de consultanță",
        heading: "Când urmează să investești, e bine să știi exact în ce.",
        paragraphs: [
          "Pregătești lansarea unui brand. Vrei să intri pe o piață nouă. Businessul a crescut, dar comunicarea nu a ținut pasul. Sau investești în mai multe canale fără să ai o imagine clară asupra performanței lor.",
          "Pornim de la situația concretă. Analizăm ce există, discutăm cu persoanele implicate și identificăm informațiile pe care ne putem baza, dar și aspectele care trebuie verificate.",
        ],
      },
      deliverablesTitle: "Ce putem clarifica",
      deliverables: [
        {
          title: "Poziționarea",
          body:
            "Cui te adresezi, cum te diferențiezi și de ce ar trebui clienții să te aleagă.",
        },
        {
          title: "Oferta comercială",
          body:
            "Cum îți prezinți produsele sau serviciile și ce poate împiedica un potențial client să ia o decizie.",
        },
        {
          title: "Parcursul clientului",
          body:
            "Cum ajunge cineva de la primul contact cu brandul la solicitarea unei oferte, achiziție și o eventuală revenire.",
        },
        {
          title: "Rolul canalelor de marketing",
          body:
            "Ce trebuie să obțină website-ul, campaniile plătite, social media și celelalte forme de comunicare.",
        },
        {
          title: "Bugetele și prioritățile",
          body:
            "Unde merită să investești acum, ce trebuie testat și ce poate fi amânat.",
        },
        {
          title: "Organizarea implementării",
          body:
            "Cine răspunde de fiecare activitate, cum se coordonează echipele și ce informații sunt necesare pentru execuție.",
        },
        {
          title: "Măsurarea rezultatelor",
          body:
            "Ce indicatori urmărim, cum evaluăm progresul și când este necesar să ajustăm strategia.",
        },
      ],
      how: {
        kicker: "Ce primești",
        heading: "O strategie clară, pe care echipa ta o poate aplica.",
        paragraphs: [
          "În funcție de proiect, livrăm o analiză a situației actuale, recomandări de poziționare, direcții pentru fiecare canal și un plan de acțiune pentru primele 90 de zile.",
          "Fiecare recomandare este însoțită de o justificare, o prioritate și condițiile necesare pentru implementare.",
        ],
      },
      faq: [
        {
          q: "Putem colabora cu Epic dacă avem deja o echipă internă?",
          a:
            "Da, în funcție de disponibilitatea domeniului. Putem lucra direct cu echipa ta pentru a defini strategia, responsabilitățile și modul de implementare.",
        },
        {
          q: "Suntem obligați să continuăm cu implementarea?",
          a:
            "Nu. Colaborarea poate include doar consultanță, doar implementare sau ambele. Stabilim acest lucru înainte de începerea proiectului.",
        },
        {
          q: "Consultanța presupune o singură întâlnire?",
          a:
            "Depinde de complexitatea proiectului. Poate fi o intervenție punctuală sau o colaborare pe termen mai lung, cu întâlniri periodice, analiză și ajustări.",
        },
      ],
      closing: {
        heading: "Ce decizie importantă trebuie să ia businessul tău acum?",
        line: "De aici putem începe.",
        cta: "Discută cu Epic",
      },
      meta: {
        title: "Consultanță și strategie de marketing | Epic Digital Hub",
        description:
          "Consultanță de marketing pentru poziționare, ofertă, canale, bugete și priorități. Analizăm businessul și stabilim un plan concret de acțiune.",
      },
    },
  ],
};

const en: ServicesCopy = {
  backLabel: "All services",
  faqTitle: "Frequently asked questions",
  applyPrefill: "Service I'm interested in: ",
  hub: {
    kicker: "What We Do",
    h1: "One strategy. Every part working together.",
    paragraphs: [
      "Advertising generates interest. Content builds familiarity. Your website turns consideration into action. Data tells us what's working.",
      "At Epic Digital Hub, strategy comes first. We determine what your business needs, prioritise the work and manage execution across the relevant channels.",
      "One team. A clear direction. No disconnected marketing efforts.",
    ],
    ctaPrimary: "Check your niche availability",
    ctaSecondary: "Explore our services",
    start: {
      kicker: "Where We Start",
      heading: "Before we spend, we look at what's holding you back.",
      paragraphs: [
        "You might be getting traffic but too few enquiries. Your business may have a strong reputation offline but an online presence that doesn't reflect it. Or perhaps you're investing in marketing without knowing what's producing results.",
        "We examine your offer, audience, competitors and customer journey. Then we decide what needs fixing, what deserves investment and what can wait.",
      ],
    },
    listKicker: "Our Services",
    steps: {
      kicker: "How we begin",
      heading: "We establish the fit before the scope.",
      items: [
        {
          title: "We check your niche.",
          body:
            "We work with one brand per niche, per city. Every potential partnership begins with an exclusivity check.",
        },
        {
          title: "We identify the priorities.",
          body:
            "If your niche is available, we assess your priorities, recommend the relevant channels and outline the first 90 days.",
        },
        {
          title: "We agree on the direction.",
          body:
            "We agree on responsibilities, deliverables and budgets before work begins.",
        },
      ],
    },
    closing: {
      heading: "Let's talk about where your business needs to go.",
      line: "We'll help determine what it takes to get there.",
      cta: "Start a conversation",
    },
    meta: {
      title:
        "Marketing, Branding & Web Development Services | Epic Digital Hub",
      description:
        "Strategy, branding, Google and Meta Ads, SEO, GEO, social media, video production and web development. One team coordinating every channel.",
    },
  },
  exclusivity: {
    heading: "One brand per niche, in every city.",
    paragraphs: [
      "Before any project, we check whether we can work together. If your niche is already taken in your city, or there's an overlap with an active client, we tell you directly.",
      "If the niche is available, we talk about your business, your priorities and what the collaboration could look like.",
    ],
    cta: "Check your niche availability",
  },
  services: [
    {
      slug: "campanii-ppc",
      num: "01",
      name: "PPC Advertising",
      hubDescription:
        "Google and Meta campaigns built around commercial objectives.",
      hubLink: "Explore PPC advertising",
      hero: {
        h1: "Every advertising budget needs a reason.",
        paragraphs: [
          "Know where your budget goes, what it produces and what we recommend next.",
          "We plan and manage Google Ads and Meta Ads campaigns around your offer, target customers and commercial objectives.",
          "Every campaign has a defined purpose, measurable actions and an accountable budget.",
        ],
        cta: "Discuss your advertising",
      },
      direction: {
        kicker: "Beyond the Click",
        heading: "Traffic is only useful when it leads somewhere.",
        paragraphs: [
          "An effective ad can bring visitors to your website. But the landing page, offer, enquiry process and follow-up determine whether those visits become business opportunities.",
          "We examine the entire journey.",
          "If your website is losing potential customers, increasing ad spend won't solve the problem. If campaigns attract the wrong enquiries, we adjust the messaging, targeting or optimisation criteria.",
          "The objective isn't more activity. It's better commercial performance.",
        ],
      },
      deliverablesTitle: "What's Included",
      deliverables: [
        {
          title: "Account & Offer Analysis",
          body:
            "We review existing campaigns, historical performance, previous tests and gaps in measurement.",
        },
        {
          title: "Campaign Strategy",
          body:
            "We define channel roles, target audiences, messaging and initial budget allocation.",
        },
        {
          title: "Copy & Creative Direction",
          body:
            "We develop advertising messages and creative variations suited to the product, audience and buying stage.",
        },
        {
          title: "Setup & Launch",
          body:
            "We structure campaigns, configure the relevant accounts and establish conversion measurement.",
        },
        {
          title: "Ongoing Optimisation",
          body:
            "We review search terms, exclusions, audiences, placements and creatives, using performance data to guide changes.",
        },
        {
          title: "Reporting & Recommendations",
          body:
            "We explain the results, identify what the data can and cannot tell us, and recommend the next actions.",
        },
      ],
      how: {
        kicker: "How we work",
        heading: "Test. Measure. Make the next decision.",
        paragraphs: [
          "We begin with defined assumptions and a testing budget.",
          "As campaigns accumulate meaningful data, we refine messaging, targeting and budget allocation. We recommend increasing spend when the commercial evidence supports it.",
        ],
      },
      faq: [
        {
          q: "What budget do we need for Google Ads or Meta Ads?",
          a:
            "It depends on your market, offer, geographic coverage and objectives. We calculate platform advertising spend, campaign management fees and creative production costs separately.",
        },
        {
          q: "Can you take over existing advertising campaigns?",
          a:
            "Yes. We audit the account structure, campaign history and conversion tracking before recommending changes. We retain what's working and address what isn't.",
        },
        {
          q: "How do you measure advertising performance?",
          a:
            "We focus on relevant enquiries, bookings, purchases and other business outcomes. Where tracking allows, we also assess lead quality, acquisition costs and revenue attributed to advertising.",
        },
      ],
      closing: {
        heading: "What should your next advertising budget achieve?",
        line: "That's the question we answer before launching a campaign.",
        cta: "Plan your campaigns",
      },
      meta: {
        title: "Google Ads & Meta Ads Management | Epic Digital Hub",
        description:
          "Google Ads and Meta Ads campaigns with clear objectives, conversion tracking, ongoing optimisation and transparent reporting. Advertising tied to business results.",
      },
    },
    {
      slug: "seo-geo",
      num: "02",
      name: "SEO & GEO",
      hubDescription:
        "Search visibility across Google and AI-powered discovery.",
      hubLink: "Explore SEO & GEO",
      hero: {
        h1: "Be found. Be understood. Be worth choosing.",
        paragraphs: [
          "Being visible is only part of the job. People also need to understand what you offer and why it's relevant to them.",
          "We improve website structure, technical accessibility and content quality to support organic search visibility and make your business information easier for AI-powered systems to interpret.",
        ],
        cta: "Discuss your search visibility",
      },
      direction: {
        kicker: "Search Has Changed. The Fundamentals Still Matter.",
        heading: "Clear information, properly structured.",
        paragraphs: [
          "People search with questions, comparisons and specific needs. Your website should answer them accurately and help them make informed decisions.",
          "SEO improves how your website can be discovered through organic search results.",
          "GEO — Generative Engine Optimisation — focuses on making information about your brand clear, accessible and suitable for interpretation by AI-powered search and answer systems.",
          "Both depend on the same essentials: sound technical structure, useful content and verifiable information.",
        ],
      },
      deliverablesTitle: "What We Work On",
      deliverables: [
        {
          title: "Technical & Content Audit",
          body:
            "We identify technical barriers, weak pages, missing information and content that needs restructuring.",
        },
        {
          title: "Search Research",
          body:
            "We analyse search queries and intent, organising relevant topics around your services and customers' needs.",
        },
        {
          title: "Website Architecture",
          body:
            "We structure pages, navigation and internal links so information is accessible and each page has a defined purpose.",
        },
        {
          title: "Service Pages & Content",
          body:
            "We develop content that explains your services, processes, relevant differences and frequently asked questions.",
        },
        {
          title: "Local SEO",
          body:
            "We align business information, locations, services and contact details across relevant local platforms.",
        },
        {
          title: "Structured Data & Brand Information",
          body:
            "Where technically appropriate, we implement structured data that clarifies relationships between your business, services and relevant professionals.",
        },
        {
          title: "Performance Monitoring",
          body:
            "We track organic visibility, relevant traffic and measurable business actions, using the findings to prioritise improvements.",
        },
      ],
      how: {
        kicker: "How We Prioritise",
        heading: "Start where search meets business value.",
        paragraphs: [
          "We first address technical and structural problems that prevent pages from being accessed or understood.",
          "Then we improve the pages most closely connected to customer decisions, before expanding the content around relevant search demand.",
          "The priority isn't publishing more. It's making the right information easier to find.",
        ],
      },
      faq: [
        {
          q:
            "Can you guarantee first-page Google rankings or inclusion in AI-generated answers?",
          a:
            "No. Search engines and AI platforms determine which sources they display. We can improve the technical quality, clarity and relevance of your content, but rankings and AI citations cannot be guaranteed.",
        },
        {
          q: "How long does SEO take to produce results?",
          a:
            "It depends on your website's current condition, competition, search demand and scope of work. We establish priorities and performance indicators after the initial audit.",
        },
        {
          q: "Do we need to publish new articles every week?",
          a:
            "Not necessarily. Improving service pages, correcting technical issues and strengthening existing content may be more valuable than maintaining a fixed publishing schedule.",
        },
      ],
      closing: {
        heading: "Can people find the right information about your business?",
        line:
          "Let's examine what search engines and AI systems can access today.",
        cta: "Review your SEO & GEO",
      },
      meta: {
        title:
          "SEO & Generative Engine Optimisation Services | Epic Digital Hub",
        description:
          "Technical SEO, content strategy, local search and GEO. Make your business easier to find, understand and evaluate across search engines and AI-powered platforms.",
      },
    },
    {
      slug: "social-media-management",
      num: "03",
      name: "Social Media Management",
      hubDescription:
        "Content planning, creation and management shaped by your brand and audience.",
      hubLink: "Explore social media",
      hero: {
        h1: "Every post should belong to the same brand.",
        paragraphs: [
          "Not just in appearance. In tone, subject matter and what the brand chooses to communicate.",
          "We manage social media accounts around your positioning, audience and commercial priorities.",
          "The result is a consistent editorial direction, supported by content your business can sustain.",
        ],
        cta: "Discuss your social media",
      },
      direction: {
        kicker: "More Than a Publishing Schedule",
        heading: "Give people a reason to pay attention.",
        paragraphs: [
          "Someone might visit your profile after seeing an advertisement, receiving a recommendation or searching for your business.",
          "Your content should quickly establish what you do, what you offer and what kind of experience customers can expect.",
          "We draw on your products, services, people and day-to-day activity to develop content with substance.",
          "The goal isn't to fill a calendar. It's to build a recognisable brand presence that supports the business.",
        ],
      },
      deliverablesTitle: "What's Included",
      deliverables: [
        {
          title: "Account Audit",
          body:
            "We assess your existing profiles, content, brand presentation and areas for improvement.",
        },
        {
          title: "Editorial Strategy",
          body:
            "We define the topics, tone of voice, formats and purpose of each relevant channel.",
        },
        {
          title: "Content Planning",
          body:
            "We organise content around business activity, launches, promotions and communication priorities.",
        },
        {
          title: "Copywriting & Design",
          body:
            "We produce the agreed volume of posts, carousels, stories and supporting visual materials.",
        },
        {
          title: "Video Content Coordination",
          body:
            "We incorporate video into the editorial plan, with production requirements and deliverables agreed separately.",
        },
        {
          title: "Scheduling & Publishing",
          body:
            "We coordinate the content calendar, approvals and publishing process.",
        },
        {
          title: "Performance Analysis",
          body:
            "We evaluate engagement, profile visits, conversations and attributable enquiries, then adjust the direction where needed.",
        },
      ],
      how: {
        kicker: "How We Collaborate",
        heading:
          "We manage the communication. You keep us close to the business.",
        paragraphs: [
          "We establish a contact person, communication schedule and approval process.",
          "Your team provides timely updates on products, availability, offers, events and operational changes.",
          "That access allows us to create accurate content and publish it when it's relevant.",
        ],
      },
      faq: [
        {
          q: "How many social media posts should we publish each month?",
          a:
            "The right volume depends on your objectives, channels and available resources. Our proposal specifies the number, format and frequency of the materials included.",
        },
        {
          q: "Do you respond to comments and private messages?",
          a:
            "Community management can be included, with agreed response times and escalation procedures. Technical or commercial questions requiring confirmation are referred to your team.",
        },
        {
          q: "Does social media management include paid advertising?",
          a:
            "Organic content and paid campaigns are planned together where relevant, but advertising management and media budgets are quoted separately.",
        },
      ],
      closing: {
        heading:
          "What does your social media presence say about your business?",
        line: "Let's make sure it's saying the right things.",
        cta: "Build your social media strategy",
      },
      meta: {
        title: "Social Media Management & Content Strategy | Epic Digital Hub",
        description:
          "Strategic social media management, copywriting, graphic design, content planning and publishing. Consistent communication built around your brand.",
      },
    },
    {
      slug: "continut-video",
      num: "04",
      name: "Video Production",
      hubDescription:
        "Reels, advertising creatives, product videos and on-location production.",
      hubLink: "Explore video production",
      hero: {
        h1: "Some things are better shown.",
        paragraphs: [
          "Your people. Your product. Your space. The details customers want to see before choosing you.",
          "We produce video content that represents the business as it is and communicates what makes it worth considering.",
          "From concept and filming to editing and delivery, each production is planned for its intended audience and platform.",
        ],
        cta: "Plan your next video shoot",
      },
      direction: {
        kicker: "From Concept to Camera",
        heading: "Every video needs a purpose.",
        paragraphs: [
          "What should someone understand, remember or do after watching?",
          "That answer shapes the script, shot selection, pacing and final edit.",
          "An advertising video needs a different structure from a product demonstration. A specialist interview serves a different purpose from a venue presentation.",
          "We plan accordingly.",
        ],
      },
      deliverablesTitle: "What We Produce",
      deliverables: [
        {
          title: "Reels & Short-Form Content",
          body:
            "Focused, engaging videos developed for mobile-first platforms.",
        },
        {
          title: "Video Advertising",
          body:
            "Campaign-ready creatives with alternative openings, messages and edits for testing.",
        },
        {
          title: "Product & Service Videos",
          body:
            "Demonstrations and explanations that help customers understand what they're buying.",
        },
        {
          title: "Team & Expert Content",
          body:
            "Interviews, professional explanations and on-camera presentations that feel natural and credible.",
        },
        {
          title: "Location & Atmosphere Videos",
          body:
            "Footage for websites, social media and campaigns, showing the physical experience behind the brand.",
        },
        {
          title: "Event Coverage",
          body:
            "Video content documenting key moments and supporting promotion for future editions.",
        },
      ],
      how: {
        kicker: "Our Production Process",
        heading: "Planned carefully. Filmed efficiently.",
        paragraphs: [
          "Before filming, we establish the concepts, scripts, shot list, participants and logistics.",
          "During production, we follow a clear schedule while making room for authentic moments.",
          "We then edit and prepare the agreed versions, including subtitles and platform-specific formats where required.",
          "Deliverables and revision stages are agreed before production begins.",
        ],
      },
      faq: [
        {
          q: "Do we need to provide the video ideas?",
          a:
            "No. We develop concepts and scripts based on your objectives and business information. Your team's expertise helps ensure the content is accurate.",
        },
        {
          q: "Can you produce several videos in one filming day?",
          a:
            "Yes. With advance planning, we can organise multiple topics, participants and setups into one shoot. The number of deliverables depends on production complexity.",
        },
        {
          q: "Is raw footage included?",
          a:
            "Raw footage availability, usage rights and final deliverable formats are specified in the project proposal.",
        },
      ],
      closing: {
        heading: "Your business has something worth showing.",
        line: "Let's decide how best to film it.",
        cta: "Start a video project",
      },
      meta: {
        title: "Video Production & Reels for Brands | Epic Digital Hub",
        description:
          "Professional video production for brands. Social media reels, video ads, product presentations, interviews and event coverage.",
      },
    },
    {
      slug: "magazine-online",
      num: "05",
      name: "E-commerce Development",
      hubDescription:
        "Online stores designed around products, customers and the buying process.",
      hubLink: "Explore e-commerce",
      hero: {
        h1: "Make buying from you easier.",
        paragraphs: [
          "From finding the right product to placing an order, every step matters.",
          "We design and develop online stores around how customers browse, compare and buy. We also consider what happens after checkout, so the website fits the way your business operates.",
        ],
        cta: "Discuss your online store",
      },
      direction: {
        kicker: "Built for Customers. Practical for Your Team.",
        heading: "A better shopping experience, front to back.",
        paragraphs: [
          "Customers need to find products easily, understand what they're buying and see delivery costs and conditions before checkout.",
          "Your team needs to manage products, inventory and orders without unnecessary complexity.",
          "We assess your catalogue, product variations, target markets and existing processes before recommending a platform or technical features.",
        ],
      },
      deliverablesTitle: "What's Included",
      deliverables: [
        {
          title: "Catalogue Architecture",
          body:
            "Categories, filters and navigation organised around your product range and customer search behaviour.",
        },
        {
          title: "Responsive Design",
          body:
            "Clear layouts, intuitive navigation and straightforward purchasing on mobile, tablet and desktop.",
        },
        {
          title: "Product Pages",
          body:
            "Structured product information, imagery, specifications and variants that help customers make informed decisions.",
        },
        {
          title: "Cart & Checkout",
          body:
            "An ordering process with clear steps, visible costs and accessible delivery information.",
        },
        {
          title: "Business Integrations",
          body:
            "Payment gateways, courier services, invoicing, inventory systems and CRM integrations, subject to compatibility and project scope.",
        },
        {
          title: "SEO & Measurement Setup",
          body:
            "Technical foundations for search indexing, product feeds and agreed conversion events.",
        },
        {
          title: "Testing & Handover",
          body:
            "We test key purchasing scenarios and provide guidance on managing the store after launch.",
        },
      ],
      how: {
        kicker: "Our Development Process",
        heading: "Define the essentials. Build them properly.",
        paragraphs: [
          "We establish what the store needs at launch and which features can follow later.",
          "Design, development, checkout and integrations are planned and tested as part of the complete purchasing journey.",
          "Responsibilities, content requirements and recurring platform costs are clarified before development begins.",
        ],
      },
      faq: [
        {
          q: "Can you redesign or rebuild an existing online store?",
          a:
            "Yes. We review the existing platform, product data, URL structure and integrations before planning the redesign or migration.",
        },
        {
          q: "Who uploads the products?",
          a:
            "We agree on catalogue size, product data, images, descriptions and import responsibilities before the project begins.",
        },
        {
          q: "What happens after the store goes live?",
          a:
            "Maintenance, technical support and further development are scoped separately. Improvements can be prioritised using customer behaviour and sales data.",
        },
      ],
      closing: {
        heading: "How easy is it to buy from your business?",
        line: "Let's make the entire process work better.",
        cta: "Start an e-commerce project",
      },
      meta: {
        title: "E-commerce Website Development | Epic Digital Hub",
        description:
          "Custom e-commerce development focused on product discovery, mobile shopping, checkout and business integrations. Built around how your customers buy.",
      },
    },
    {
      slug: "website-uri-prezentare",
      num: "06",
      name: "Website Development",
      hubDescription:
        "Business websites that communicate clearly and support enquiries and sales.",
      hubLink: "Explore website development",
      hero: {
        h1: "Your website speaks before you do.",
        paragraphs: [
          "Make sure it represents the business you've built.",
          "We create websites that explain your offer, establish what makes your business relevant and guide visitors towards the next step.",
          "Strategy, copy, design and development are handled as one project, not separate assignments.",
        ],
        cta: "Discuss your website",
      },
      direction: {
        kicker: "Your Most Important First Impression",
        heading: "Give people the information they came for.",
        paragraphs: [
          "Visitors arrive with questions. They're evaluating your services, comparing alternatives or deciding whether to contact you.",
          "We structure the website around those decisions, presenting the right information in the right order.",
          "Design expresses your brand's character. Photography and video provide context. Navigation and interactions make the experience intuitive.",
          "Every element needs to justify its place.",
        ],
      },
      deliverablesTitle: "What's Included",
      deliverables: [
        {
          title: "Website Architecture",
          body:
            "We define the page structure, navigation and relevant user journeys based on your business objectives.",
        },
        {
          title: "Copywriting",
          body:
            "We write clear, brand-specific content that explains your services, differentiators and working process.",
        },
        {
          title: "Art Direction & UI Design",
          body:
            "We develop a visual direction aligned with your positioning, identity and existing brand materials.",
        },
        {
          title: "Responsive Development",
          body:
            "We build the website and its interactions for mobile, tablet and desktop.",
        },
        {
          title: "Forms & Integrations",
          body:
            "We connect enquiries to the agreed workflow, including CRM or booking integrations where required.",
        },
        {
          title: "SEO & Analytics Foundations",
          body:
            "We prepare technical structure, metadata and the tracking events included in the project.",
        },
        {
          title: "Testing & Launch",
          body:
            "We review navigation, responsiveness, forms and key interactions before publication.",
        },
      ],
      how: {
        kicker: "Our Development Process",
        heading: "The message comes before the layout.",
        paragraphs: [
          "We begin with your business objectives and the information visitors need.",
          "From there, we establish the website architecture, develop the copy and define the visual direction.",
          "Design and development follow an agreed sequence, with clear deliverables and review stages.",
          "This keeps the project focused and reduces unnecessary revisions.",
        ],
      },
      faq: [
        {
          q: "Do we need to provide the website text and photography?",
          a:
            "No. We can develop the copy based on information from your business. For photography and video, we assess existing materials and determine whether new production is required.",
        },
        {
          q: "Will we be able to update the website ourselves?",
          a:
            "Yes, where content management is included in the agreed scope. We identify which sections your team needs to manage and select the technical approach accordingly.",
        },
        {
          q: "Can we keep our existing domain name?",
          a:
            "Yes. We plan the transition around your existing domain, hosting setup and any necessary redirects.",
        },
      ],
      closing: {
        heading: "Your business has moved forward. Has your website kept up?",
        cta: "Start your website project",
      },
      meta: {
        title: "Business Website Design & Development | Epic Digital Hub",
        description:
          "Business websites built around strategy, copywriting, design and development. Clear messaging, responsive experiences and conversion-focused structure.",
      },
    },
    {
      slug: "design-grafic",
      num: "07",
      name: "Graphic Design",
      hubDescription:
        "Brand identities, campaign visuals and commercial materials.",
      hubLink: "Explore graphic design",
      hero: {
        h1: "One brand. A consistent impression.",
        paragraphs: [
          "An advertisement. A presentation. A showroom display. A printed brochure.",
          "Different formats, but the same brand behind them.",
          "We develop visual identities and design systems that make your communication recognisable across every relevant channel.",
        ],
        cta: "Discuss your brand design",
      },
      direction: {
        kicker: "Design That Holds Together",
        heading: "Consistency comes from decisions, not repetition.",
        paragraphs: [
          "Typography, colour, imagery and layout all influence how people perceive your business.",
          "Clear visual standards allow campaigns and materials to evolve without losing the brand's identity.",
          "We base our design decisions on positioning, audience and practical requirements.",
          "A technical company needs to communicate differently from a hospitality brand. A promotional campaign has different demands from a corporate presentation.",
          "The design has to serve the message.",
        ],
      },
      deliverablesTitle: "What We Design",
      deliverables: [
        {
          title: "Visual Identity",
          body:
            "Logo design, colour systems, typography and usage standards, according to project scope.",
        },
        {
          title: "Campaign Creative",
          body:
            "Visual concepts and adaptations for digital advertising and promotional campaigns.",
        },
        {
          title: "Social Media Design",
          body: "Posts, carousels, stories and reusable templates.",
        },
        {
          title: "Commercial Materials",
          body:
            "Presentations, proposals, brochures, product sheets and sales materials.",
        },
        {
          title: "Print Design",
          body:
            "Posters, flyers, business cards and other artwork prepared to production specifications.",
        },
        {
          title: "Brand Guidelines",
          body:
            "Practical design rules that help maintain a consistent identity across teams and channels.",
        },
      ],
      how: {
        kicker: "How We Work",
        heading: "First, the message. Then the design.",
        paragraphs: [
          "We establish the audience, purpose, content and format before developing the visual direction.",
          "After review and refinement, we prepare the agreed files for their intended applications.",
          "For recurring needs, we create reusable design structures that support consistency and efficient production.",
        ],
      },
      faq: [
        {
          q: "Can we keep our existing logo?",
          a:
            "Yes. We can work within your current visual identity and recommend adjustments where needed.",
        },
        {
          q: "Do you also handle printing?",
          a:
            "Print-ready design and physical production are separate services. If required, we can include coordination with printing suppliers in the project scope.",
        },
        {
          q: "Will we receive editable design files?",
          a:
            "Final formats, source file delivery and any applicable font or image licences are defined in the proposal before work begins.",
        },
      ],
      closing: {
        heading:
          "Put every brand asset side by side. Does it all look like the same business?",
        cta: "Build your visual identity",
      },
      meta: {
        title: "Graphic Design & Visual Identity | Epic Digital Hub",
        description:
          "Graphic design for brands, advertising campaigns, social media and print. Visual identities and marketing materials designed to work together.",
      },
    },
    {
      slug: "email-marketing",
      num: "08",
      name: "Email Marketing",
      hubDescription:
        "Campaigns and automated communication built around customer behaviour.",
      hubLink: "Explore email marketing",
      hero: {
        h1: "The first interaction shouldn't be the last.",
        paragraphs: [
          "Someone subscribes, requests a quote or makes a purchase. What happens next should reflect that interaction.",
          "We develop email campaigns and automated communication based on customer behaviour, business objectives and the relationship you've already established.",
          "Every message needs a relevant audience, a clear purpose and a reason to be sent.",
        ],
        cta: "Discuss email marketing",
      },
      direction: {
        kicker: "Communication Worth Opening",
        heading: "Send emails people have a reason to read.",
        paragraphs: [
          "A product launch won't interest everyone. New customers may need guidance. Existing customers may benefit from a related offer.",
          "We organise email communication around these differences.",
          "The writing stays consistent with your brand. The design works across devices. Each email focuses on a clear message and an appropriate next action.",
        ],
      },
      deliverablesTitle: "What's Included",
      deliverables: [
        {
          title: "Contact Database Analysis",
          body:
            "We review where your contacts come from, the available customer information and how marketing consent was collected.",
        },
        {
          title: "Audience Segmentation",
          body:
            "We organise contacts according to relevant characteristics, customer history and available behavioural data.",
        },
        {
          title: "Campaign Planning",
          body:
            "We establish topics, frequency and timing in relation to product launches, promotions and customer needs.",
        },
        {
          title: "Copywriting & Design",
          body:
            "We create branded email content, structured for readability and optimised for mobile devices.",
        },
        {
          title: "Automated Email Sequences",
          body:
            "Welcome emails, post-purchase communication, re-engagement campaigns and abandoned cart reminders, where the platform, data and permissions allow.",
        },
        {
          title: "Testing & Analysis",
          body:
            "We check email rendering, links and campaign performance, then use the findings to improve future communication.",
        },
      ],
      how: {
        kicker: "How We Build Automations",
        heading: "The right message starts with the right trigger.",
        paragraphs: [
          "We identify the customer interactions that justify automated communication.",
          "For each sequence, we define its trigger, message, timing and stopping conditions.",
          "Automated emails are coordinated with regular campaigns to avoid unnecessary overlap and repetitive messaging.",
        ],
      },
      faq: [
        {
          q: "Can we start email marketing with a small contact list?",
          a:
            "Yes. We can begin with subscription forms, contact management and welcome emails, then expand the communication as your audience grows.",
        },
        {
          q: "How often should we send marketing emails?",
          a:
            "Frequency depends on your audience, the relevance of your content and subscriber engagement. We recommend a schedule supported by genuine reasons to communicate, rather than sending emails simply to maintain volume.",
        },
        {
          q: "How do you measure email marketing performance?",
          a:
            "We assess deliverability, clicks, enquiries, purchases and attributable revenue where tracking allows. Unsubscribe rates and other engagement signals also help us evaluate relevance.",
        },
      ],
      closing: {
        heading: "What happens after someone first engages with your brand?",
        line: "We build the communication that follows.",
        cta: "Plan your email marketing",
      },
      meta: {
        title: "Email Marketing & Automation Services | Epic Digital Hub",
        description:
          "Email marketing campaigns, segmentation and automated customer journeys. Relevant messages, considered timing and measurable results.",
      },
    },
    {
      slug: "tracking-date",
      num: "09",
      name: "Analytics & Tracking",
      hubDescription:
        "Conversion tracking and reporting that connect marketing activity to business outcomes.",
      hubLink: "Explore analytics",
      hero: {
        h1: "Better decisions start with better data.",
        paragraphs: [
          "Where do your enquiries come from? Which pages influence decisions? Where do potential customers leave? What happens after someone submits a form?",
          "We implement and verify tracking that helps answer these questions, while making the limitations of the available data clear.",
        ],
        cta: "Audit your tracking",
      },
      direction: {
        kicker: "Measure What Matters",
        heading: "Not every conversion has the same value.",
        paragraphs: [
          "A phone-number click, a submitted enquiry and a completed purchase represent different stages of the customer journey.",
          "Treating them as equivalent can distort your understanding of performance.",
          "We define the actions that matter, establish how they're measured and assess which data can be connected to real commercial outcomes.",
        ],
      },
      deliverablesTitle: "What's Included",
      deliverables: [
        {
          title: "Tracking Audit",
          body:
            "We review existing analytics tools, events, missing data and potential duplicate measurements.",
        },
        {
          title: "Measurement Strategy",
          body:
            "We define meaningful conversions, performance indicators and the reporting structure.",
        },
        {
          title: "Tool Configuration",
          body:
            "We configure Google Analytics 4, Google Tag Manager and relevant integrations, according to your technical infrastructure.",
        },
        {
          title: "Conversion Events",
          body:
            "We implement tracking for relevant actions such as form submissions, contact requests, checkout stages and purchases.",
        },
        {
          title: "Campaign Tagging",
          body:
            "We establish consistent traffic-source identification and campaign tracking conventions.",
        },
        {
          title: "Consent Integration",
          body:
            "We configure tracking behaviour in relation to the implemented consent system and users' choices.",
        },
        {
          title: "Testing & Documentation",
          body:
            "We validate key tracking scenarios and document what is measured, how it works and where limitations remain.",
        },
      ],
      how: {
        kicker: "From Reporting to Decisions",
        heading: "Data is useful when it changes what you do next.",
        paragraphs: [
          "We organise reporting around practical business questions.",
          "Which channels generate relevant enquiries? Where do customers abandon the buying process? Which pages need improvement?",
          "Where the systems allow, we connect website and advertising data with information from your CRM or order management platform.",
        ],
      },
      faq: [
        {
          q: "Can we track every visitor and every sale?",
          a:
            "No. Consent preferences, device settings, tracking restrictions and multi-channel customer journeys limit measurement. We explain these limitations rather than presenting estimates as exact figures.",
        },
        {
          q:
            "Why do Google Analytics and advertising platforms report different numbers?",
          a:
            "Platforms may use different attribution models, conversion definitions and reporting windows. We verify the implementation and establish which data source is appropriate for each decision.",
        },
        {
          q: "Can we connect website enquiries to completed sales?",
          a:
            "In many cases, yes. It depends on your CRM, website infrastructure and how consistently enquiries are managed. We assess feasibility before implementation.",
        },
      ],
      closing: {
        heading: "Which decisions are you making without reliable data?",
        line: "Let's improve the information behind them.",
        cta: "Discuss analytics & tracking",
      },
      meta: {
        title:
          "GA4, Google Tag Manager & Conversion Tracking | Epic Digital Hub",
        description:
          "GA4 setup, Google Tag Manager, conversion tracking and analytics audits. Reliable measurement for enquiries, purchases and marketing decisions.",
      },
    },
    {
      slug: "consultanta-marketing",
      num: "10",
      name: "Marketing Consulting",
      hubDescription:
        "Positioning, planning and commercial priorities backed by research and analysis.",
      hubLink: "Explore consulting",
      hero: {
        h1: "Know what matters. Then decide what comes next.",
        paragraphs: [
          "You may already have a marketing team, external suppliers and plenty of ideas. What you need is a clear set of priorities: what comes first, who handles it and how you'll measure progress.",
          "We assess your business, challenge assumptions and turn the findings into a practical marketing plan.",
        ],
        cta: "Discuss your marketing strategy",
      },
      direction: {
        kicker: "When Consulting Makes Sense",
        heading: "Before the next major decision.",
        paragraphs: [
          "You're launching a brand, entering a new market or reconsidering your positioning. Your business has grown, but its marketing hasn't kept pace. Or you're investing across several channels without a reliable view of performance.",
          "We begin with the specific decision you're facing.",
          "We examine existing information, speak with the relevant people and distinguish established facts from assumptions that still need testing.",
        ],
      },
      deliverablesTitle: "What We Can Clarify",
      deliverables: [
        {
          title: "Brand Positioning",
          body:
            "Who you're targeting, what sets your offer apart and why customers should choose you.",
        },
        {
          title: "Commercial Offer",
          body:
            "How your products or services are presented, priced and understood throughout the buying process.",
        },
        {
          title: "Customer Journey",
          body:
            "The steps customers take from initial interest to enquiry, purchase and repeat business.",
        },
        {
          title: "Channel Strategy",
          body:
            "The role of your website, advertising, content and direct communication.",
        },
        {
          title: "Budgets & Priorities",
          body: "Where to invest, what to test and which activities can wait.",
        },
        {
          title: "Execution Planning",
          body:
            "Responsibilities, timelines, workflows and the information required by everyone involved.",
        },
        {
          title: "Performance Measurement",
          body:
            "The indicators that matter, how to interpret them and when to reassess the strategy.",
        },
      ],
      how: {
        kicker: "What You Receive",
        heading: "A strategy you can actually use.",
        paragraphs: [
          "Depending on the scope, the project may include a marketing assessment, positioning recommendations, channel priorities and a 90-day action plan.",
          "Recommendations are supported by clear reasoning, with responsibilities and dependencies identified before implementation.",
        ],
      },
      faq: [
        {
          q:
            "Can we work with Epic Digital Hub if we already have an internal marketing team?",
          a:
            "Yes, subject to niche availability. We can develop the strategy alongside your team and establish how recommendations will be implemented.",
        },
        {
          q: "Do we have to hire Epic Digital Hub for implementation?",
          a:
            "No. Consulting can be a standalone project or part of a broader partnership. We agree on the scope before starting.",
        },
        {
          q: "Is consulting a one-time meeting or an ongoing service?",
          a:
            "Both formats are possible. Depending on your needs, we can work on a defined strategic project or provide ongoing guidance through scheduled reviews and planning sessions.",
        },
      ],
      closing: {
        heading: "What's the next important decision for your business?",
        line: "Let's make it an informed one.",
        cta: "Book a strategy discussion",
      },
      meta: {
        title: "Marketing Strategy & Consulting | Epic Digital Hub",
        description:
          "Marketing consulting for businesses that need clearer positioning, stronger offers, better budget decisions and an actionable strategy.",
      },
    },
  ],
};

export const servicesContent: Record<Locale, ServicesCopy> = { en, ro };
