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
    h1: "Un singur plan. Tot ce trebuie ca să-l pui în mișcare.",
    paragraphs: [
      "Reclamele aduc oameni. Conținutul construiește familiaritate. Site-ul îi ajută să decidă. Datele ne arată unde merită să continuăm.",
      "La Epic, toate pleacă de la aceeași strategie. Alegem ce are nevoie brandul tău, stabilim ordinea și ne ocupăm de execuție. Ai o echipă care înțelege întregul business și știe ce rol are fiecare lucru pe care îl face.",
    ],
    ctaPrimary: "Verifică disponibilitatea nișei tale",
    ctaSecondary: "Vezi serviciile",
    start: {
      kicker: "De unde începem",
      heading: "Mai întâi, vedem ce trebuie să se schimbe.",
      paragraphs: [
        "Poate ai trafic, dar prea puține cereri. Poate vinzi bine prin recomandări, însă online nu se vede nivelul businessului. Sau poate investești deja în marketing și încă nu ai o explicație clară pentru rezultate.",
        "Începem de acolo. Ne uităm la ofertă, public, concurență și la traseul unui client până la achiziție. Apoi stabilim ce construim, ce corectăm și ce merită buget acum.",
      ],
    },
    listKicker: "Serviciile",
    steps: {
      kicker: "Cum începem",
      heading: "O discuție concretă, înainte de orice propunere.",
      items: [
        {
          title: "Verificăm nișa.",
          body: "Lucrăm cu un singur brand pe nișă, în fiecare oraș. Verificăm dacă există suprapuneri cu parteneriatele active.",
        },
        {
          title: "Schițăm direcția.",
          body: "Dacă există disponibilitate, conturăm prioritățile, canalele relevante și primele 90 de zile.",
        },
        {
          title: "Decidem împreună.",
          body: "Clarificăm responsabilitățile, livrabilele și bugetul. Începem când planul are sens pentru ambele echipe.",
        },
      ],
    },
    closing: {
      heading: "Spune-ne unde vrei să ajungă businessul tău.",
      line: "Noi venim cu o perspectivă asupra a ceea ce trebuie construit până acolo.",
      cta: "Verifică disponibilitatea nișei tale",
    },
    meta: {
      title: "Servicii de marketing și dezvoltare web | Epic Digital Hub",
      description:
        "Strategie, campanii PPC, SEO și GEO, social media, video, design și dezvoltare web. O echipă, un plan comun. Vezi serviciile Epic Digital Hub.",
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
      name: "Campanii Media PPC",
      hubDescription:
        "Campanii Google și Meta construite în jurul ofertei tale și al unui obiectiv comercial clar. Urmărim ce se întâmplă după click și ajustăm bugetele pe baza rezultatelor.",
      hubLink: "Vezi cum lucrăm cu reclamele",
      hero: {
        h1: "Bugetul tău trebuie să aibă o explicație.",
        paragraphs: [
          "Unde se duce. Ce aduce. Ce schimbăm mai departe.",
          "Construim și gestionăm campanii Google și Meta pornind de la oferta ta, de la oamenii care ar putea cumpăra și de la ce se întâmplă după ce ajung pe site. Fiecare campanie are un obiectiv, un mod de măsurare și un motiv pentru care primește buget.",
        ],
        cta: "Hai să discutăm despre campaniile tale",
      },
      direction: {
        kicker: "Ce urmărim",
        heading: "De la reclamă până la cerere sau comandă.",
        paragraphs: [
          "Un mesaj bun poate aduce vizitatori. Ca investiția să aibă sens, trebuie să funcționeze și pagina pe care ajung, formularul pe care îl completează și modul în care preiei cererea.",
          "Privim tot acest traseu. Dacă problema este în ofertă sau în site, o discutăm înainte să creștem bugetul. Dacă o campanie aduce cereri nepotrivite, schimbăm mesajul, direcționarea sau criteriile după care o evaluăm.",
        ],
      },
      deliverablesTitle: "Ce include colaborarea",
      deliverables: [
        {
          title: "Analiza conturilor și a ofertei.",
          body: "Vedem ce s-a testat, ce a produs rezultate și ce informații lipsesc.",
        },
        {
          title: "Planul de campanii.",
          body: "Stabilim rolul fiecărui canal, publicurile, mesajele și alocarea inițială a bugetului.",
        },
        {
          title: "Texte și direcții creative.",
          body: "Construim variante relevante pentru produs, public și etapa de cumpărare.",
        },
        {
          title: "Configurare și lansare.",
          body: "Organizăm conturile, campaniile și măsurarea conversiilor relevante.",
        },
        {
          title: "Optimizare continuă.",
          body: "Verificăm căutările, excluderile, audiențele și materialele. Ajustăm pe baza datelor acumulate.",
        },
        {
          title: "Raportare explicată.",
          body: "Vezi rezultatele, limitele datelor și deciziile pentru perioada următoare.",
        },
      ],
      how: {
        kicker: "Cum lucrăm",
        heading: "Începem cu ipoteze clare. Continuăm cu ce confirmă datele.",
        paragraphs: [
          "Stabilim ce vrem să aflăm din primele campanii și ce buget putem aloca testării. Urmărim rezultatele suficient cât să avem o bază de decizie, apoi ajustăm mesajele și distribuția investiției. Creșterea bugetului vine împreună cu o justificare comercială.",
        ],
      },
      faq: [
        {
          q: "Cu ce buget ar trebui să începem?",
          a: "Depinde de piață, ofertă, aria geografică și obiectiv. Stabilim separat bugetul plătit platformelor, costul administrării și producția materialelor, în funcție de proiect.",
        },
        {
          q: "Puteți prelua campanii care rulează deja?",
          a: "Da. Începem prin a verifica structura conturilor, istoricul și măsurarea. Păstrăm ceea ce are sens și propunem modificări argumentate.",
        },
        {
          q: "Cum evaluăm rezultatele?",
          a: "În funcție de business: cereri relevante, programări, comenzi sau alte acțiuni comerciale. Atunci când datele sunt disponibile, legăm costul promovării de calitatea cererilor și de vânzările generate.",
        },
      ],
      closing: {
        heading: "Ce ar trebui să aducă următorul tău buget de promovare?",
        line: "Pornim de la această întrebare și construim campaniile în jurul răspunsului.",
        cta: "Discută cu Epic",
      },
      meta: {
        title: "Campanii PPC Google și Meta | Epic Digital Hub",
        description:
          "Campanii Google și Meta cu obiective clare, optimizare continuă și raportare explicată. Conectăm reclamele cu oferta, site-ul și rezultatele comerciale.",
      },
    },
    {
      slug: "seo-geo",
      num: "02",
      name: "SEO și GEO",
      hubDescription:
        "Punem în ordine informația despre businessul tău: în site, în căutări și în sursele din care sistemele AI își construiesc răspunsurile. Conținut clar, structură bună, prezență coerentă.",
      hubLink: "Vezi cum construim vizibilitatea",
      hero: {
        h1: "Când oamenii caută ce faci tu, trebuie să înțeleagă de ce să te aleagă.",
        paragraphs: [
          "Construim o prezență online clară pentru oameni, motoare de căutare și sisteme AI. Punem în ordine site-ul, dezvoltăm conținut relevant și facem informațiile despre businessul tău mai ușor de găsit și de interpretat.",
        ],
        cta: "Hai să discutăm despre vizibilitatea ta",
      },
      direction: {
        kicker: "Direcția",
        heading: "Răspunsuri bune, susținute de un site bine construit.",
        paragraphs: [
          "Pornim de la întrebările pe care le au clienții înainte să cumpere: ce oferi, cui i se potrivește, cum funcționează și de ce ar avea încredere în tine.",
          "SEO urmărește vizibilitatea în rezultatele organice ale motoarelor de căutare. GEO adaugă atenție asupra felului în care informația despre brand poate fi înțeleasă și folosită în răspunsurile generate de AI. Le abordăm împreună, prin aceeași bază: informație utilă, structură accesibilă și afirmații care pot fi susținute.",
        ],
      },
      deliverablesTitle: "Ce lucrăm",
      deliverables: [
        {
          title: "Audit tehnic și de conținut.",
          body: "Identificăm paginile slabe, informațiile lipsă și problemele care îngreunează accesul la conținut.",
        },
        {
          title: "Cercetarea căutărilor.",
          body: "Grupăm subiectele după serviciile tale și după intenția oamenilor care caută.",
        },
        {
          title: "Structura site-ului.",
          body: "Organizăm paginile și legăturile dintre ele, astfel încât fiecare să aibă un rol clar.",
        },
        {
          title: "Pagini de servicii și conținut util.",
          body: "Explicăm concret oferta, procesul, diferențele și întrebările frecvente.",
        },
        {
          title: "Prezență locală.",
          body: "Aliniem informațiile despre locație, servicii și date de contact, acolo unde businessul are relevanță locală.",
        },
        {
          title: "Informații despre brand și date structurate.",
          body: "Facem explicite relațiile dintre companie, servicii și persoanele relevante, unde implementarea permite.",
        },
        {
          title: "Monitorizare.",
          body: "Urmărim vizibilitatea, traficul relevant și acțiunile comerciale pe care le putem măsura.",
        },
      ],
      how: {
        kicker: "Cum stabilim prioritățile",
        heading: "Începem cu paginile care contează pentru business.",
        paragraphs: [
          "Corectăm mai întâi problemele care afectează accesul și înțelegerea site-ului. Dezvoltăm apoi paginile apropiate de decizia de cumpărare și extindem conținutul în funcție de întrebările reale ale publicului.",
        ],
      },
      faq: [
        {
          q: "Puteți garanta prima poziție sau apariția în răspunsurile AI?",
          a: "Nu. Controlăm calitatea implementării și a conținutului. Selecția și ordonarea rezultatelor aparțin platformelor, iar vizibilitatea poate varia.",
        },
        {
          q: "Cât durează până vedem rezultate?",
          a: "Depinde de starea site-ului, concurență și amploarea intervențiilor. Stabilim etape și indicatori de progres după audit, fără să promitem un termen identic pentru orice proiect.",
        },
        {
          q: "Trebuie să publicăm articole în fiecare săptămână?",
          a: "Frecvența vine după priorități. Uneori, rescrierea paginilor de servicii și corectarea structurii sunt primele lucruri de făcut.",
        },
      ],
      closing: {
        heading: "Să vedem cât de clar vorbește internetul despre businessul tău.",
        cta: "Discută cu Epic",
      },
      meta: {
        title: "SEO și GEO pentru brandul tău | Epic Digital Hub",
        description:
          "Optimizare tehnică, conținut și prezență locală pentru un brand mai ușor de găsit și de înțeles în căutări și în experiențele AI.",
      },
    },
    {
      slug: "social-media-management",
      num: "03",
      name: "Social Media Management",
      hubDescription:
        "Dăm conturilor tale o direcție pe care oamenii o pot recunoaște. Mesaje, design și conținut care se leagă de ceea ce vinzi și de felul în care vrei să fii perceput.",
      hubLink: "Vezi cum gestionăm social media",
      hero: {
        h1: "Brandul tău trebuie să se recunoască de la o postare la alta.",
        paragraphs: [
          "În ce spune. În cum arată. În lucrurile pe care alege să le arate.",
          "Gestionăm prezența ta în social media pornind de la poziționare, ofertă și public. Construim o direcție editorială pe care o putem susține în timp, cu materiale relevante și un proces de lucru clar.",
        ],
        cta: "Hai să discutăm despre prezența ta în social media",
      },
      direction: {
        kicker: "Ce construim",
        heading: "Un motiv pentru care oamenii să te urmărească și să revină.",
        paragraphs: [
          "Un potențial client poate ajunge pe profilul tău după o reclamă, o recomandare sau o căutare. În câteva postări, ar trebui să înțeleagă ce faci, cum lucrezi și ce fel de business ești.",
          "Alegem subiectele care construiesc această imagine: produsele și serviciile tale, oamenii din echipă, întrebările clienților, exemplele din activitatea de zi cu zi. Le transformăm într-o comunicare recognoscibilă și legată de obiectivele comerciale.",
        ],
      },
      deliverablesTitle: "Ce include colaborarea",
      deliverables: [
        {
          title: "Auditul conturilor.",
          body: "Verificăm profilurile, conținutul existent și felul în care se prezintă brandul.",
        },
        {
          title: "Direcție editorială.",
          body: "Stabilim temele, tonul, formatele și rolul fiecărui canal.",
        },
        {
          title: "Plan de conținut.",
          body: "Organizăm publicarea în jurul activității businessului, lansărilor și campaniilor.",
        },
        {
          title: "Texte și materiale vizuale.",
          body: "Pregătim postări, carusele și stories conform volumului agreat.",
        },
        {
          title: "Coordonarea conținutului video.",
          body: "Integrăm producția video în plan, cu livrabile stabilite separat în ofertă.",
        },
        {
          title: "Programare și publicare.",
          body: "Ai un flux clar pentru feedback și aprobări.",
        },
        {
          title: "Analiză și ajustări.",
          body: "Evaluăm reacțiile relevante, vizitele, conversațiile și cererile pe care le putem atribui conținutului.",
        },
      ],
      how: {
        kicker: "Cum lucrăm împreună",
        heading: "Noi ținem direcția. Tu aduci accesul la ce se întâmplă în business.",
        paragraphs: [
          "Stabilim o persoană de contact, un ritm de lucru și termene de feedback. Informațiile despre oferte, stocuri, evenimente sau schimbări ajung din timp, ca materialele să fie corecte și publicate când contează.",
        ],
      },
      faq: [
        {
          q: "Câte postări sunt necesare?",
          a: "Stabilim volumul în funcție de canale, resurse și obiective. Propunerea arată exact ce tipuri de materiale producem și cât de des publicăm.",
        },
        {
          q: "Răspundeți și la mesaje sau comentarii?",
          a: "Putem include moderarea în colaborare, cu intervale, tipuri de răspuns și reguli de escaladare stabilite. Întrebările comerciale sau tehnice care cer confirmări ajung la echipa ta.",
        },
        {
          q: "Promovarea plătită este inclusă?",
          a: "Planul de conținut și campaniile plătite sunt coordonate. Administrarea reclamelor și bugetul media sunt definite distinct în ofertă.",
        },
      ],
      closing: {
        heading: "Ce înțelege despre tine cineva care îți vede profilul astăzi?",
        cta: "Hai să construim direcția",
      },
      meta: {
        title: "Social Media Management | Epic Digital Hub",
        description:
          "Strategie editorială, texte, design și publicare pentru conturi social media coerente. Construim o prezență legată de brand și de obiectivele tale.",
      },
    },
    {
      slug: "continut-video",
      num: "04",
      name: "Creare de Conținut Video",
      hubDescription:
        "Filmăm businessul tău, oamenii și produsele lui. Construim materiale pentru social media, reclame și site, pornind de la ce trebuie să înțeleagă clientul.",
      hubLink: "Vezi cum producem conținut video",
      hero: {
        h1: "Arată-le cum e, înainte să ajungă la tine.",
        paragraphs: [
          "Atmosfera din locație. Oamenii cu care vor vorbi. Produsul în utilizare. Detaliile care explică diferența.",
          "Producem conținut video pornind de la businessul tău și de la ce trebuie să vadă clientul ca să facă următorul pas. Filmăm la fața locului și pregătim materialele pentru canalele în care vor fi folosite.",
        ],
        cta: "Hai să discutăm despre următoarea filmare",
      },
      direction: {
        kicker: "De la idee la material",
        heading: "O filmare bună începe cu o întrebare clară.",
        paragraphs: [
          "Ce vrem să înțeleagă omul după ce vede clipul?",
          "Răspunsul decide scenariul, cadrele, ritmul și durata. Un video pentru o reclamă are altă construcție decât prezentarea unei locații sau explicația unui specialist. Planificăm producția în funcție de aceste utilizări.",
        ],
      },
      deliverablesTitle: "Ce putem produce",
      deliverables: [
        {
          title: "Reels și clipuri scurte.",
          body: "Idei concentrate, pregătite pentru consumul pe mobil.",
        },
        {
          title: "Materiale pentru reclame.",
          body: "Variante de început, mesaje și montaj pe care le putem testa în campanii.",
        },
        {
          title: "Prezentări de produse și servicii.",
          body: "Demonstrații și explicații care răspund întrebărilor de dinaintea achiziției.",
        },
        {
          title: "Conținut cu echipa.",
          body: "Interviuri, explicații și intervenții vorbite, pregătite astfel încât oamenii să se simtă firesc în fața camerei.",
        },
        {
          title: "Filmări de locație și atmosferă.",
          body: "Conținut pentru site, social media și promovarea experienței.",
        },
        {
          title: "Conținut de eveniment.",
          body: "Momente relevante și materiale care pot susține comunicarea edițiilor următoare.",
        },
      ],
      how: {
        kicker: "Cum decurge producția",
        heading: "Pregătim înainte. Filmăm organizat. Livrăm pentru utilizări clare.",
        paragraphs: [
          "Stabilim mesajele, lista de cadre, persoanele implicate și logistica. La filmare, urmărim planul și păstrăm loc pentru momentele care apar natural. După montaj, pregătim versiunile, subtitrările și formatele convenite, cu un proces de feedback stabilit de la început.",
        ],
      },
      faq: [
        {
          q: "Trebuie să venim noi cu ideile?",
          a: "Pornim de la informațiile și obiectivele tale, iar noi dezvoltăm conceptele și scenariile. Experiența echipei tale ne ajută să păstrăm explicațiile corecte și credibile.",
        },
        {
          q: "Putem filma mai multe materiale într-o zi?",
          a: "Da, dacă pregătim din timp subiectele, oamenii și locațiile. Numărul final depinde de complexitatea fiecărui material.",
        },
        {
          q: "Sunt incluse materialele brute?",
          a: "Livrabilele, accesul la materialele brute și condițiile de utilizare sunt clarificate în ofertă, înainte de producție.",
        },
      ],
      closing: {
        heading: "Ce merită văzut din businessul tău?",
        line: "Începem cu acel lucru și îi construim forma potrivită.",
        cta: "Planifică un proiect video cu Epic",
      },
      meta: {
        title: "Producție video pentru branduri | Epic Digital Hub",
        description:
          "Reels, reclame, prezentări și filmări de locație. Conținut video construit din activitatea reală a businessului, pentru social media și website.",
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
        h1: "De la primul produs văzut până la comanda confirmată.",
        paragraphs: [
          "Fiecare pas contează.",
          "Construim magazine online în jurul modului în care oamenii caută, compară și cumpără produsele tale. Lucrăm la structură, pagini de produs și procesul de comandă, cu atenție și la ce se întâmplă în business după vânzare.",
        ],
        cta: "Hai să discutăm despre magazinul tău",
      },
      direction: {
        kicker: "Ce construim",
        heading: "Un magazin pe care îl poți folosi și dezvolta.",
        paragraphs: [
          "Clientul trebuie să găsească repede produsul, să înțeleagă ce primește și să vadă clar condițiile de cumpărare. Echipa ta trebuie să poată administra catalogul și comenzile fără ocoluri inutile.",
          "Pornim de la numărul de produse, tipurile de variante, piețele în care vinzi și fluxurile de lucru existente. Alegerea platformei și a funcționalităților vine după aceste clarificări.",
        ],
      },
      deliverablesTitle: "Ce poate include proiectul",
      deliverables: [
        {
          title: "Arhitectura catalogului.",
          body: "Categorii, filtre și navigare construite pentru gama ta de produse.",
        },
        {
          title: "Design și experiență pe mobil.",
          body: "Pagini lizibile și acțiuni ușor de parcurs pe ecrane mici.",
        },
        {
          title: "Pagini de produs.",
          body: "Structură pentru imagini, specificații, variante și informațiile necesare deciziei.",
        },
        {
          title: "Coș și finalizarea comenzii.",
          body: "Pași clari și informații vizibile despre costuri și livrare.",
        },
        {
          title: "Integrări operaționale.",
          body: "Plăți, curierat, facturare, gestiune sau CRM, în funcție de compatibilitate și de scopul agreat.",
        },
        {
          title: "Baza pentru promovare și măsurare.",
          body: "Configurările stabilite pentru indexare, feeduri de produse și evenimente comerciale.",
        },
        {
          title: "Testare și predare.",
          body: "Verificăm scenariile importante de cumpărare și explicăm administrarea magazinului.",
        },
      ],
      how: {
        kicker: "Cum lucrăm",
        heading: "Stabilim de la început ce trebuie să funcționeze la lansare.",
        paragraphs: [
          "Definim funcțiile esențiale și separăm dezvoltările care pot urma. Proiectăm, implementăm și testăm fluxul complet, inclusiv comenzile și integrările din proiect. Ai vizibilitate asupra responsabilităților, materialelor necesare și costurilor recurente ale soluțiilor alese.",
        ],
      },
      faq: [
        {
          q: "Puteți reface un magazin existent?",
          a: "Da. Verificăm datele, platforma, structura adreselor și integrările. Planificăm ce se migrează și cum gestionăm schimbarea.",
        },
        {
          q: "Cine adaugă produsele?",
          a: "Stabilim în ofertă volumul, formatul datelor și responsabilitatea pentru import, imagini și descrieri.",
        },
        {
          q: "Ce se întâmplă după lansare?",
          a: "Definim separat suportul, mentenanța și dezvoltările ulterioare. Magazinul poate continua să fie îmbunătățit pe baza utilizării și a datelor colectate.",
        },
      ],
      closing: {
        heading: "Cum ar trebui să se cumpere de la tine?",
        line: "Hai să proiectăm traseul complet.",
        cta: "Discută proiectul cu Epic",
      },
      meta: {
        title: "Dezvoltare magazine online | Epic Digital Hub",
        description:
          "Magazine online cu structură clară, pagini de produs și un proces simplu de comandă. Design, dezvoltare și integrări adaptate businessului tău.",
      },
    },
    {
      slug: "website-uri-prezentare",
      num: "06",
      name: "Dezvoltare Website-uri de Prezentare",
      hubDescription:
        "Site-uri care arată nivelul businessului tău și îl ajută pe vizitator să înțeleagă rapid de ce să te aleagă. Strategie, text, design și dezvoltare în același proiect.",
      hubLink: "Vezi cum construim website-uri",
      hero: {
        h1: "Site-ul tău vorbește înainte să răspunzi la telefon.",
        paragraphs: [
          "Ar trebui să se ridice la nivelul businessului tău.",
          "Construim website-uri care explică oferta, arată ce te diferențiază și conduc vizitatorul spre o acțiune clară. Textul, designul și dezvoltarea pornesc din aceeași direcție.",
        ],
        cta: "Hai să discutăm despre website-ul tău",
      },
      direction: {
        kicker: "Rolul site-ului",
        heading: "Să le fie clar cine ești și de ce merită să te contacteze.",
        paragraphs: [
          "Când cineva ajunge pe site, vine cu o întrebare, o nevoie sau o comparație în minte. Organizăm paginile în jurul acestor lucruri și construim argumentele în ordinea în care sunt utile.",
          "Designul dă caracter brandului. Fotografiile și video-ul aduc context. Interacțiunile susțin experiența, cu atenție la lizibilitate, viteză și utilizarea pe mobil.",
        ],
      },
      deliverablesTitle: "Ce include proiectul",
      deliverables: [
        {
          title: "Structura și traseele principale.",
          body: "Stabilim paginile și acțiunile relevante pentru fiecare tip de vizitator.",
        },
        {
          title: "Textele.",
          body: "Explicăm serviciile, diferențele și procesul de lucru într-un limbaj potrivit brandului.",
        },
        {
          title: "Direcția vizuală.",
          body: "Construim un design coerent cu poziționarea și materialele existente.",
        },
        {
          title: "Dezvoltarea.",
          body: "Implementăm paginile și interacțiunile, adaptate pentru mobil, tabletă și desktop.",
        },
        {
          title: "Formulare și integrări.",
          body: "Conectăm solicitările cu fluxul de lucru agreat, inclusiv CRM sau programări, unde este cazul.",
        },
        {
          title: "Baza tehnică pentru SEO și măsurare.",
          body: "Pregătim structura, metadatele și evenimentele stabilite în proiect.",
        },
        {
          title: "Verificare și lansare.",
          body: "Testăm navigarea, formularele și afișarea înainte de publicare.",
        },
      ],
      how: {
        kicker: "Cum lucrăm",
        heading: "Clarificăm mesajul înainte să desenăm paginile.",
        paragraphs: [
          "Pornim de la obiective și conținut. Validăm structura, apoi direcția vizuală și implementarea. Fiecare etapă are un livrabil și un moment de feedback, ca proiectul să înainteze cu deciziile importante deja luate.",
        ],
      },
      faq: [
        {
          q: "Trebuie să avem textele și fotografiile pregătite?",
          a: "Putem dezvolta textele pornind de la informațiile tale. Pentru imagini stabilim ce materiale pot fi folosite și dacă este nevoie de producție foto-video.",
        },
        {
          q: "Vom putea actualiza singuri site-ul?",
          a: "Stabilim de la început ce secțiuni trebuie administrate de echipa ta și alegem soluția tehnică în consecință.",
        },
        {
          q: "Puteți păstra domeniul actual?",
          a: "Da. Planificăm mutarea, accesul la infrastructură și redirecționările necesare, în funcție de site-ul existent.",
        },
      ],
      closing: {
        heading: "Businessul a evoluat. Se vede și pe site?",
        cta: "Discută proiectul cu Epic",
      },
      meta: {
        title: "Website-uri de prezentare | Epic Digital Hub",
        description:
          "Website-uri de prezentare construite din strategie, text și design. Pagini clare, experiență atent lucrată și integrare cu obiectivele businessului.",
      },
    },
    {
      slug: "design-grafic",
      num: "07",
      name: "Design Grafic",
      hubDescription:
        "O identitate vizuală care se păstrează de la prima reclamă până la ultima pagină din ofertă. Design pentru campanii, social media, print și materialele de care ai nevoie în vânzare.",
      hubLink: "Vezi cum lucrăm cu designul",
      hero: {
        h1: "Același brand. Oriunde îl întâlnești.",
        paragraphs: [
          "Într-o reclamă, pe o ofertă, într-un showroom sau pe un afiș.",
          "Construim și aplicăm o direcție vizuală recognoscibilă. Fiecare material are un rol clar și aparține aceleiași identități, indiferent de format sau canal.",
        ],
        cta: "Hai să discutăm despre imaginea brandului tău",
      },
      direction: {
        kicker: "Ce aduce direcția vizuală",
        heading: "Decizii care rămân coerente de la un proiect la următorul.",
        paragraphs: [
          "Culorile, tipografia, imaginile și felul în care așezi informația construiesc așteptări despre brand. Când regulile sunt clare, materialele noi pot evolua fără ca identitatea să se schimbe la fiecare campanie.",
          "Pornim de la poziționare și de la utilizările reale. Un brand care comunică prețuri și oferte are alte nevoi decât unul care prezintă servicii tehnice sau experiențe premium.",
        ],
      },
      deliverablesTitle: "Ce putem realiza",
      deliverables: [
        {
          title: "Identitate vizuală.",
          body: "Logo, paletă cromatică, tipografie și reguli de utilizare, în funcție de proiect.",
        },
        {
          title: "Materiale pentru campanii.",
          body: "Concepte vizuale și adaptări pentru formatele de promovare.",
        },
        {
          title: "Design pentru social media.",
          body: "Postări, carusele, stories și modele reutilizabile.",
        },
        {
          title: "Materiale comerciale.",
          body: "Prezentări, oferte, broșuri și fișe de produs.",
        },
        {
          title: "Design pentru print.",
          body: "Afișe, flyere, cărți de vizită și alte materiale pregătite la specificațiile de producție.",
        },
        {
          title: "Ghid vizual.",
          body: "Reguli suficient de clare pentru ca identitatea să poată fi aplicată consecvent.",
        },
      ],
      how: {
        kicker: "Cum lucrăm",
        heading: "Mai întâi stabilim ce trebuie să comunice materialul.",
        paragraphs: [
          "Clarificăm publicul, mesajul, contextul și formatul. Propunem o direcție argumentată, o dezvoltăm prin feedback și pregătim fișierele pentru utilizările convenite. Pentru materiale recurente, construim o bază care face execuția mai coerentă și mai eficientă.",
        ],
      },
      faq: [
        {
          q: "Putem păstra logo-ul actual?",
          a: "Da. Putem lucra în identitatea existentă sau putem propune ajustări acolo unde aplicarea ei creează probleme.",
        },
        {
          q: "Includeți și tiparul?",
          a: "Pregătirea fișierelor și producția fizică sunt lucruri distincte. Stabilim în ofertă dacă proiectul include și coordonarea cu furnizorul de print.",
        },
        {
          q: "Primim fișierele editabile?",
          a: "Formatele finale, fișierele sursă și licențele pentru fonturi sau imagini sunt clarificate înainte de începerea proiectului.",
        },
      ],
      closing: {
        heading: "Pune toate materialele tale unul lângă altul. Se vede același brand?",
        cta: "Construiește direcția vizuală cu Epic",
      },
      meta: {
        title: "Design grafic și identitate vizuală | Epic Digital Hub",
        description:
          "Identitate vizuală, design pentru campanii, social media, print și materiale comerciale. O direcție coerentă în fiecare apariție a brandului.",
      },
    },
    {
      slug: "email-marketing",
      num: "08",
      name: "Email Marketing",
      hubDescription:
        "Continuăm conversația cu oamenii care și-au arătat deja interesul. Campanii și automatizări construite în jurul momentelor în care un mesaj este cu adevărat util.",
      hubLink: "Vezi cum folosim emailul",
      hero: {
        h1: "Ai deja atenția lor. Merită să continui conversația.",
        paragraphs: [
          "Cineva s-a abonat, a cerut o ofertă sau a cumpărat de la tine. Următorul mesaj ar trebui să țină cont de acel moment.",
          "Construim campanii de email și automatizări relevante pentru relația dintre brand și client. Stabilim cui îi scriem, de ce îi scriem și care este următorul pas firesc.",
        ],
        cta: "Hai să discutăm despre email marketing",
      },
      direction: {
        kicker: "Ce construim",
        heading: "Mesaje pe care ai un motiv bun să le trimiți.",
        paragraphs: [
          "O lansare poate interesa un anumit segment. Un client nou poate avea nevoie de explicații. Cineva care a cumpărat deja poate fi pregătit pentru un produs complementar.",
          "Organizăm comunicarea în jurul acestor situații. Păstrăm vocea brandului și pregătim emailuri care se citesc ușor, cu un mesaj principal și o acțiune clară.",
        ],
      },
      deliverablesTitle: "Ce poate include colaborarea",
      deliverables: [
        {
          title: "Analiza bazei de contacte.",
          body: "Verificăm sursele, calitatea datelor și modul în care au fost colectate permisiunile de comunicare.",
        },
        {
          title: "Segmentarea.",
          body: "Grupăm contactele în funcție de informațiile disponibile și de relația lor cu businessul.",
        },
        {
          title: "Planul de campanii.",
          body: "Stabilim temele, ritmul și legătura cu lansările sau ofertele tale.",
        },
        {
          title: "Texte și design.",
          body: "Construim emailuri coerente cu brandul și adaptate pentru mobil.",
        },
        {
          title: "Automatizări.",
          body: "Mesaje de bun venit, după achiziție, de revenire sau pentru coșuri abandonate, unde datele, platforma și permisiunile permit.",
        },
        {
          title: "Testare și analiză.",
          body: "Verificăm afișarea, linkurile și indicatorii relevanți pentru fiecare tip de campanie.",
        },
      ],
      how: {
        kicker: "Cum lucrăm",
        heading: "Începem cu momentele care au un rol clar în relația cu clientul.",
        paragraphs: [
          "Alegem fluxurile prioritare și stabilim declanșatoarele, conținutul și condițiile de oprire. Coordonăm automatizările cu mesajele trimise manual, astfel încât comunicarea să rămână utilă și ușor de urmărit.",
        ],
      },
      faq: [
        {
          q: "Putem începe dacă avem puține contacte?",
          a: "Da. Putem pune în ordine formularele de abonare și mesajele de bun venit, apoi dezvoltăm comunicarea pe măsură ce baza crește.",
        },
        {
          q: "Cât de des trimitem emailuri?",
          a: "În funcție de ce avem de comunicat, de așteptările abonaților și de reacțiile observate. Frecvența trebuie să poată fi susținută cu mesaje relevante.",
        },
        {
          q: "Ce rezultate urmărim?",
          a: "Clickuri, cereri, comenzi și venituri atribuibile, unde măsurarea permite, alături de livrare și dezabonări. Citim indicatorii împreună și ținem cont de limitele lor.",
        },
      ],
      closing: {
        heading: "Ce se întâmplă după primul contact cu brandul tău?",
        line: "Hai să construim continuarea.",
        cta: "Discută cu Epic",
      },
      meta: {
        title: "Email marketing și automatizări | Epic Digital Hub",
        description:
          "Campanii de email și automatizări adaptate relației cu clientul. Segmentare, texte, design și măsurare, conectate cu activitatea businessului tău.",
      },
    },
    {
      slug: "tracking-date",
      num: "09",
      name: "Tracking de Date",
      hubDescription:
        "Configurăm măsurarea acțiunilor care contează pentru business. Vezi de unde vin cererile, unde se pierd oamenii și ce poți decide pe baza datelor disponibile.",
      hubLink: "Vezi cum măsurăm rezultatele",
      hero: {
        h1: "Înainte de următorul buget, ai nevoie de date în care poți avea încredere.",
        paragraphs: [
          "De unde vin cererile. Ce fac oamenii pe site. Unde se opresc. Ce ajunge efectiv la echipa de vânzări.",
          "Configurăm și verificăm măsurarea acțiunilor relevante pentru businessul tău. Construim o bază de analiză care te ajută să iei decizii și îți arată unde informațiile sunt incomplete.",
        ],
        cta: "Hai să verificăm ce măsori",
      },
      direction: {
        kicker: "De ce începem cu definițiile",
        heading: "Ce numești conversie trebuie să însemne ceva pentru business.",
        paragraphs: [
          "Un click pe telefon, un formular trimis și o vânzare sunt etape diferite. Dacă le tratăm la fel, devine greu să înțelegem ce produc campaniile.",
          "Stabilim acțiunile importante și relația dintre ele. Verificăm ce putem măsura în site, ce date există în platformele de promovare și ce informații poate completa echipa ta despre calitatea cererilor.",
        ],
      },
      deliverablesTitle: "Ce include proiectul",
      deliverables: [
        {
          title: "Auditul implementării.",
          body: "Verificăm instrumentele, evenimentele, lipsurile și posibilele dublări.",
        },
        {
          title: "Planul de măsurare.",
          body: "Definim conversiile și indicatorii pe care îi vom folosi în analiză.",
        },
        {
          title: "Configurarea instrumentelor.",
          body: "Implementăm GA4, Google Tag Manager și conexiunile agreate, în funcție de infrastructură.",
        },
        {
          title: "Evenimente relevante.",
          body: "Formulare, solicitări de contact, etape de cumpărare și achiziții, unde sunt aplicabile.",
        },
        {
          title: "Etichetarea campaniilor.",
          body: "Stabilim reguli consecvente pentru identificarea surselor de trafic.",
        },
        {
          title: "Integrarea cu mecanismul de consimțământ.",
          body: "Adaptăm declanșarea instrumentelor la configurarea agreată și la alegerile utilizatorilor.",
        },
        {
          title: "Validare și documentare.",
          body: "Testăm scenariile importante și explicăm ce colectăm, cum interpretăm și ce limite există.",
        },
      ],
      how: {
        kicker: "Cum folosim datele",
        heading: "Fiecare raport trebuie să ajute la o decizie.",
        paragraphs: [
          "Organizăm indicatorii în jurul întrebărilor pe care le ai: ce canal aduce cereri relevante, unde se întrerupe cumpărarea și ce pagină merită îmbunătățită. Când informațiile permit, conectăm analiza cu rezultatele înregistrate în CRM sau în sistemul de comenzi.",
        ],
      },
      faq: [
        {
          q: "Putem măsura absolut toate vizitele și vânzările?",
          a: "Nu. Consimțământul, setările dispozitivelor și felul în care oamenii folosesc mai multe canale limitează vizibilitatea. Explicăm aceste limite în analiză.",
        },
        {
          q: "De ce diferă cifrele dintre platforme?",
          a: "Instrumentele pot folosi reguli și ferestre de atribuire diferite. Verificăm implementarea și stabilim ce sursă folosim pentru fiecare tip de decizie.",
        },
        {
          q: "Putem lega formularele de vânzările finale?",
          a: "În multe proiecte, da, dacă există infrastructura și un proces consecvent de actualizare a cererilor. Fezabilitatea se stabilește după verificarea sistemelor.",
        },
      ],
      closing: {
        heading: "Ce decizie amâni pentru că nu ai date suficient de clare?",
        cta: "Discută măsurarea cu Epic",
      },
      meta: {
        title: "Tracking, GA4 și măsurarea conversiilor | Epic Digital Hub",
        description:
          "Audit și configurare tracking pentru formulare, cereri și achiziții. Date explicate, implementare verificată și indicatori legați de business.",
      },
    },
    {
      slug: "consultanta-marketing",
      num: "10",
      name: "Consultanță",
      hubDescription:
        "Punem ordine în obiective, ofertă, canale și bugete. Pleci cu priorități explicate și un plan pe care echipa ta îl poate pune în lucru.",
      hubLink: "Vezi cum arată consultanța",
      hero: {
        h1: "Să stabilim ce merită făcut acum.",
        paragraphs: [
          "Poate ai o echipă, câțiva furnizori și multe idei. Ceea ce lipsește este ordinea: ce are prioritate, cine răspunde și cum îți dai seama că merge.",
          "Lucrăm cu tine la direcția de marketing a businessului. Analizăm situația, punem întrebările dificile și construim un plan pe care îl poți folosi în deciziile de zi cu zi.",
        ],
        cta: "Hai să discutăm despre direcția ta",
      },
      direction: {
        kicker: "Când are sens",
        heading: "Când trebuie să iei o decizie înainte să mai investești.",
        paragraphs: [
          "Lansezi un brand. Intri pe o piață nouă. Ai crescut și comunicarea a rămas în urmă. Sau investești în mai multe canale, dar nu ai o imagine comună a rezultatelor.",
          "Consultanța începe cu problema concretă. Ne uităm la ce există, discutăm cu oamenii implicați și separăm ce știm din date de ceea ce trebuie încă verificat.",
        ],
      },
      deliverablesTitle: "Ce putem clarifica",
      deliverables: [
        {
          title: "Poziționarea.",
          body: "Pentru cine este oferta ta și ce motive are acel public să te aleagă.",
        },
        {
          title: "Oferta comercială.",
          body: "Cum prezinți produsele și serviciile și unde apar neclarități în decizia de cumpărare.",
        },
        {
          title: "Traseul clientului.",
          body: "Cum trece de la primul contact la cerere, achiziție și revenire.",
        },
        {
          title: "Rolul canalelor.",
          body: "Ce trebuie să facă site-ul, reclamele, conținutul și comunicarea directă.",
        },
        {
          title: "Bugetele și prioritățile.",
          body: "Unde investim acum, ce testăm și ce poate aștepta.",
        },
        {
          title: "Organizarea execuției.",
          body: "Responsabilități, ritm de lucru și informațiile de care echipa are nevoie.",
        },
        {
          title: "Măsurarea.",
          body: "Indicatorii după care evaluăm progresul și momentele în care revizuim planul.",
        },
      ],
      how: {
        kicker: "Cu ce rămâi",
        heading: "O direcție scrisă și pași care pot fi puși în lucru.",
        paragraphs: [
          "În funcție de proiect, livrabilul poate include diagnosticul situației, recomandările de poziționare, rolul canalelor și un plan pentru primele 90 de zile. Fiecare prioritate vine cu motivul pentru care este importantă și cu dependențele de care trebuie să ținem cont.",
        ],
      },
      faq: [
        {
          q: "Putem lucra cu Epic dacă avem deja o echipă internă?",
          a: "Da, în funcție de disponibilitatea nișei. Putem construi direcția împreună cu echipa ta și clarifica felul în care o pune în practică.",
        },
        {
          q: "Trebuie să continuăm și cu implementarea?",
          a: "Nu. Stabilim de la început dacă proiectul este de consultanță, de implementare sau le include pe ambele.",
        },
        {
          q: "Este o singură întâlnire?",
          a: "Formatul depinde de problemă. Poate fi un proiect delimitat sau o colaborare cu întâlniri periodice, analiză și ajustarea priorităților.",
        },
      ],
      closing: {
        heading: "Care este decizia pe care businessul tău trebuie să o ia acum?",
        line: "De acolo începem.",
        cta: "Discută cu Epic",
      },
      meta: {
        title: "Consultanță și strategie de marketing | Epic Digital Hub",
        description:
          "Claritate în poziționare, ofertă, canale și bugete. Consultanță de marketing cu priorități explicate și un plan pe care echipa ta îl poate aplica.",
      },
    },
  ],
};

const en: ServicesCopy = {
  backLabel: "All services",
  faqTitle: "Frequently asked questions",
  applyPrefill: "Service I'm interested in: ",
  hub: {
    kicker: "What we do",
    h1: "One plan. Everything you need to set it in motion.",
    paragraphs: [
      "Ads bring people in. Content builds familiarity. The website helps them decide. The data shows us where it's worth continuing.",
      "At Epic, everything starts from the same strategy. We choose what your brand needs, set the order, and handle the execution. You get a team that understands the whole business and knows what role each piece of work plays.",
    ],
    ctaPrimary: "Check your niche availability",
    ctaSecondary: "See the services",
    start: {
      kicker: "Where we start",
      heading: "First, we look at what needs to change.",
      paragraphs: [
        "Maybe you have traffic but too few enquiries. Maybe you sell well through referrals, but online, the level of your business doesn't show. Or maybe you already invest in marketing and still don't have a clear explanation for the results.",
        "That's where we begin. We look at the offer, the audience, the competition and the path a client takes to a purchase. Then we decide what to build, what to fix and what deserves budget now.",
      ],
    },
    listKicker: "The services",
    steps: {
      kicker: "How we begin",
      heading: "A concrete conversation before any proposal.",
      items: [
        {
          title: "We check the niche.",
          body: "We work with one brand per niche, in each city. We check for overlaps with active partnerships.",
        },
        {
          title: "We sketch the direction.",
          body: "If the niche is available, we outline the priorities, the relevant channels and the first 90 days.",
        },
        {
          title: "We decide together.",
          body: "We clarify responsibilities, deliverables and budget. We start when the plan makes sense for both teams.",
        },
      ],
    },
    closing: {
      heading: "Tell us where you want your business to go.",
      line: "We come with a view of what needs to be built to get there.",
      cta: "Check your niche availability",
    },
    meta: {
      title: "Marketing and web development services | Epic Digital Hub",
      description:
        "Strategy, PPC campaigns, SEO and GEO, social media, video, design and web development. One team, one shared plan. See the Epic Digital Hub services.",
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
      name: "PPC Media Campaigns",
      hubDescription:
        "Google and Meta campaigns built around your offer and a clear commercial objective. We follow what happens after the click and adjust budgets based on results.",
      hubLink: "See how we work with ads",
      hero: {
        h1: "Your budget should have an explanation.",
        paragraphs: [
          "Where it goes. What it brings back. What we change next.",
          "We build and manage Google and Meta campaigns starting from your offer, from the people who might buy, and from what happens after they reach your site. Every campaign has an objective, a way of being measured and a reason it gets budget.",
        ],
        cta: "Let's talk about your campaigns",
      },
      direction: {
        kicker: "What we look at",
        heading: "From the ad to the enquiry or the order.",
        paragraphs: [
          "A good message can bring visitors. For the investment to make sense, the page they land on, the form they fill in and the way you handle the enquiry have to work too.",
          "We look at that whole path. If the problem is in the offer or the site, we discuss it before raising the budget. If a campaign brings the wrong kind of enquiries, we change the message, the targeting or the criteria we judge it by.",
        ],
      },
      deliverablesTitle: "What the collaboration includes",
      deliverables: [
        {
          title: "Account and offer analysis.",
          body: "We see what has been tested, what produced results and what information is missing.",
        },
        {
          title: "The campaign plan.",
          body: "We set the role of each channel, the audiences, the messages and the initial budget allocation.",
        },
        {
          title: "Copy and creative directions.",
          body: "We build variants that fit the product, the audience and the buying stage.",
        },
        {
          title: "Setup and launch.",
          body: "We organize the accounts, the campaigns and the measurement of the conversions that matter.",
        },
        {
          title: "Ongoing optimization.",
          body: "We review search terms, exclusions, audiences and creatives. We adjust based on the data we accumulate.",
        },
        {
          title: "Reporting, explained.",
          body: "You see the results, the limits of the data and the decisions for the next period.",
        },
      ],
      how: {
        kicker: "How we work",
        heading: "We start with clear hypotheses. We continue with what the data confirms.",
        paragraphs: [
          "We decide what we want to learn from the first campaigns and what budget we can allocate to testing. We follow the results long enough to have a basis for decisions, then adjust the messages and the distribution of the investment. Budget increases come with a commercial justification.",
        ],
      },
      faq: [
        {
          q: "What budget should we start with?",
          a: "It depends on the market, the offer, the geographic area and the objective. We set the media budget paid to the platforms, the cost of management and the production of creatives separately, per project.",
        },
        {
          q: "Can you take over campaigns that are already running?",
          a: "Yes. We start by reviewing the account structure, the history and the measurement. We keep what makes sense and propose changes we can argue for.",
        },
        {
          q: "How do we judge the results?",
          a: "By what fits the business: relevant enquiries, bookings, orders or other commercial actions. Where the data is available, we connect the cost of advertising to the quality of the enquiries and the sales they generate.",
        },
      ],
      closing: {
        heading: "What should your next advertising budget bring back?",
        line: "We start from that question and build the campaigns around the answer.",
        cta: "Talk to Epic",
      },
      meta: {
        title: "Google and Meta PPC campaigns | Epic Digital Hub",
        description:
          "Google and Meta campaigns with clear objectives, ongoing optimization and reporting that gets explained. We connect the ads to the offer, the site and the commercial results.",
      },
    },
    {
      slug: "seo-geo",
      num: "02",
      name: "SEO & GEO",
      hubDescription:
        "We put the information about your business in order: on your site, in search, and in the sources AI systems build their answers from. Clear content, good structure, a coherent presence.",
      hubLink: "See how we build visibility",
      hero: {
        h1: "When people search for what you do, they should understand why to choose you.",
        paragraphs: [
          "We build a clear online presence for people, search engines and AI systems. We put the site in order, develop relevant content and make the information about your business easier to find and to interpret.",
        ],
        cta: "Let's talk about your visibility",
      },
      direction: {
        kicker: "The direction",
        heading: "Good answers, backed by a well-built site.",
        paragraphs: [
          "We start from the questions clients have before they buy: what you offer, who it fits, how it works and why they should trust you.",
          "SEO is about visibility in the organic results of search engines. GEO adds attention to how information about the brand can be understood and used in AI-generated answers. We approach them together, through the same base: useful information, accessible structure and claims that can be backed up.",
        ],
      },
      deliverablesTitle: "What we work on",
      deliverables: [
        {
          title: "Technical and content audit.",
          body: "We identify weak pages, missing information and the problems that make content hard to access.",
        },
        {
          title: "Search research.",
          body: "We group topics by your services and by the intent of the people searching.",
        },
        {
          title: "Site structure.",
          body: "We organize the pages and the links between them so each one has a clear role.",
        },
        {
          title: "Service pages and useful content.",
          body: "We explain the offer, the process, the differences and the frequent questions in concrete terms.",
        },
        {
          title: "Local presence.",
          body: "We align the information about location, services and contact details wherever the business has local relevance.",
        },
        {
          title: "Brand information and structured data.",
          body: "We make the relationships between the company, its services and the relevant people explicit, where the implementation allows.",
        },
        {
          title: "Monitoring.",
          body: "We track visibility, relevant traffic and the commercial actions we can measure.",
        },
      ],
      how: {
        kicker: "How we set priorities",
        heading: "We start with the pages that matter for the business.",
        paragraphs: [
          "First we fix the problems that affect access to and understanding of the site. Then we develop the pages closest to the buying decision and extend the content based on the audience's real questions.",
        ],
      },
      faq: [
        {
          q: "Can you guarantee the first position, or appearing in AI answers?",
          a: "No. We control the quality of the implementation and the content. The selection and ordering of results belong to the platforms, and visibility can vary.",
        },
        {
          q: "How long until we see results?",
          a: "It depends on the state of the site, the competition and the scale of the work. We set stages and progress indicators after the audit, without promising the same timeline for every project.",
        },
        {
          q: "Do we have to publish articles every week?",
          a: "Frequency follows priorities. Sometimes, rewriting the service pages and fixing the structure are the first things to do.",
        },
      ],
      closing: {
        heading: "Let's see how clearly the internet talks about your business.",
        cta: "Talk to Epic",
      },
      meta: {
        title: "SEO and GEO for your brand | Epic Digital Hub",
        description:
          "Technical optimization, content and local presence for a brand that is easier to find and to understand, in search and in AI experiences.",
      },
    },
    {
      slug: "social-media-management",
      num: "03",
      name: "Social Media Management",
      hubDescription:
        "We give your accounts a direction people can recognize. Messages, design and content tied to what you sell and to how you want to be perceived.",
      hubLink: "See how we manage social media",
      hero: {
        h1: "Your brand should be recognizable from one post to the next.",
        paragraphs: [
          "In what it says. In how it looks. In the things it chooses to show.",
          "We manage your social media presence starting from positioning, offer and audience. We build an editorial direction we can sustain over time, with relevant materials and a clear working process.",
        ],
        cta: "Let's talk about your social media presence",
      },
      direction: {
        kicker: "What we build",
        heading: "A reason for people to follow you and come back.",
        paragraphs: [
          "A potential client can land on your profile after an ad, a recommendation or a search. Within a few posts, they should understand what you do, how you work and what kind of business you are.",
          "We choose the topics that build that image: your products and services, the people on your team, your clients' questions, examples from the day-to-day work. We turn them into communication that is recognizable and tied to your commercial goals.",
        ],
      },
      deliverablesTitle: "What the collaboration includes",
      deliverables: [
        {
          title: "Account audit.",
          body: "We review the profiles, the existing content and the way the brand presents itself.",
        },
        {
          title: "Editorial direction.",
          body: "We set the themes, the tone, the formats and the role of each channel.",
        },
        {
          title: "Content plan.",
          body: "We organize publishing around the business's activity, launches and campaigns.",
        },
        {
          title: "Copy and visuals.",
          body: "We prepare posts, carousels and stories at the agreed volume.",
        },
        {
          title: "Video content coordination.",
          body: "We integrate video production into the plan, with deliverables set separately in the offer.",
        },
        {
          title: "Scheduling and publishing.",
          body: "You get a clear flow for feedback and approvals.",
        },
        {
          title: "Analysis and adjustments.",
          body: "We evaluate the relevant reactions, the visits, the conversations and the enquiries we can attribute to the content.",
        },
      ],
      how: {
        kicker: "How we work together",
        heading: "We hold the direction. You bring access to what's happening in the business.",
        paragraphs: [
          "We agree on a contact person, a working rhythm and feedback deadlines. Information about offers, stock, events or changes reaches us in time, so the materials are accurate and published when they matter.",
        ],
      },
      faq: [
        {
          q: "How many posts do we need?",
          a: "We set the volume based on channels, resources and objectives. The proposal shows exactly what types of materials we produce and how often we publish.",
        },
        {
          q: "Do you also answer messages and comments?",
          a: "We can include moderation in the collaboration, with agreed time windows, response types and escalation rules. Commercial or technical questions that need confirmation go to your team.",
        },
        {
          q: "Is paid promotion included?",
          a: "The content plan and the paid campaigns are coordinated. Ad management and the media budget are defined separately in the offer.",
        },
      ],
      closing: {
        heading: "What does someone who sees your profile today understand about you?",
        cta: "Let's build the direction",
      },
      meta: {
        title: "Social Media Management | Epic Digital Hub",
        description:
          "Editorial strategy, copy, design and publishing for coherent social media accounts. We build a presence tied to the brand and to your objectives.",
      },
    },
    {
      slug: "continut-video",
      num: "04",
      name: "Video Content Production",
      hubDescription:
        "We film your business, its people and its products. We build materials for social media, ads and the website, starting from what the client needs to understand.",
      hubLink: "See how we produce video",
      hero: {
        h1: "Show them what it's like, before they get to you.",
        paragraphs: [
          "The atmosphere in the location. The people they'll talk to. The product in use. The details that explain the difference.",
          "We produce video content starting from your business and from what the client needs to see to take the next step. We shoot on location and prepare the materials for the channels they'll be used in.",
        ],
        cta: "Let's talk about your next shoot",
      },
      direction: {
        kicker: "From idea to material",
        heading: "A good shoot starts with a clear question.",
        paragraphs: [
          "What do we want the viewer to understand after watching the clip?",
          "The answer decides the script, the shots, the rhythm and the length. A video for an ad is built differently from a location presentation or a specialist's explanation. We plan the production around these uses.",
        ],
      },
      deliverablesTitle: "What we can produce",
      deliverables: [
        {
          title: "Reels and short clips.",
          body: "Concentrated ideas, prepared for mobile consumption.",
        },
        {
          title: "Ad materials.",
          body: "Opening variants, messages and edits we can test in campaigns.",
        },
        {
          title: "Product and service presentations.",
          body: "Demonstrations and explanations that answer the questions people have before buying.",
        },
        {
          title: "Content with your team.",
          body: "Interviews, explanations and spoken pieces, prepared so people feel natural on camera.",
        },
        {
          title: "Location and atmosphere footage.",
          body: "Content for the website, social media and promoting the experience.",
        },
        {
          title: "Event content.",
          body: "Relevant moments and materials that can support the communication of future editions.",
        },
      ],
      how: {
        kicker: "How production works",
        heading: "We prepare in advance. We shoot organized. We deliver for clear uses.",
        paragraphs: [
          "We set the messages, the shot list, the people involved and the logistics. On the shoot, we follow the plan and leave room for the moments that come up naturally. After the edit, we prepare the agreed versions, subtitles and formats, with a feedback process set from the start.",
        ],
      },
      faq: [
        {
          q: "Do we have to come up with the ideas?",
          a: "We start from your information and objectives, and we develop the concepts and scripts. Your team's experience helps us keep the explanations accurate and credible.",
        },
        {
          q: "Can we shoot several materials in one day?",
          a: "Yes, if we prepare the topics, the people and the locations in advance. The final number depends on the complexity of each material.",
        },
        {
          q: "Is the raw footage included?",
          a: "The deliverables, access to raw footage and the terms of use are clarified in the offer, before production.",
        },
      ],
      closing: {
        heading: "What is worth seeing in your business?",
        line: "We start with that and build the right form for it.",
        cta: "Plan a video project with Epic",
      },
      meta: {
        title: "Video production for brands | Epic Digital Hub",
        description:
          "Reels, ads, presentations and location footage. Video content built from the real activity of the business, for social media and the website.",
      },
    },
    {
      slug: "magazine-online",
      num: "05",
      name: "Online Store Development",
      hubDescription:
        "Stores where products are easy to find, information is clear and the order is simple to complete. Ready for promotion and for the operations behind the sale.",
      hubLink: "See how we build online stores",
      hero: {
        h1: "From the first product viewed to the confirmed order.",
        paragraphs: [
          "Every step counts.",
          "We build online stores around the way people search for, compare and buy your products. We work on the structure, the product pages and the ordering process, with attention to what happens in the business after the sale.",
        ],
        cta: "Let's talk about your store",
      },
      direction: {
        kicker: "What we build",
        heading: "A store you can use and grow.",
        paragraphs: [
          "The client has to find the product quickly, understand what they're getting and see the buying terms clearly. Your team has to be able to manage the catalog and the orders without pointless detours.",
          "We start from the number of products, the types of variants, the markets you sell in and the existing workflows. The choice of platform and features comes after these clarifications.",
        ],
      },
      deliverablesTitle: "What the project can include",
      deliverables: [
        {
          title: "Catalog architecture.",
          body: "Categories, filters and navigation built for your product range.",
        },
        {
          title: "Design and mobile experience.",
          body: "Readable pages and actions that are easy to complete on small screens.",
        },
        {
          title: "Product pages.",
          body: "Structure for images, specifications, variants and the information the decision needs.",
        },
        {
          title: "Cart and checkout.",
          body: "Clear steps and visible information about costs and delivery.",
        },
        {
          title: "Operational integrations.",
          body: "Payments, couriers, invoicing, inventory or CRM, depending on compatibility and the agreed scope.",
        },
        {
          title: "The base for promotion and measurement.",
          body: "The agreed setup for indexing, product feeds and commercial events.",
        },
        {
          title: "Testing and handover.",
          body: "We verify the important buying scenarios and explain how to run the store.",
        },
      ],
      how: {
        kicker: "How we work",
        heading: "We establish from the start what has to work at launch.",
        paragraphs: [
          "We define the essential features and separate the developments that can follow. We design, implement and test the complete flow, including the orders and the integrations in the project. You get visibility over responsibilities, the materials needed and the recurring costs of the chosen solutions.",
        ],
      },
      faq: [
        {
          q: "Can you rebuild an existing store?",
          a: "Yes. We review the data, the platform, the URL structure and the integrations. We plan what gets migrated and how we manage the change.",
        },
        {
          q: "Who adds the products?",
          a: "We set in the offer the volume, the data format and the responsibility for the import, the images and the descriptions.",
        },
        {
          q: "What happens after launch?",
          a: "Support, maintenance and further development are defined separately. The store can keep improving based on usage and the data collected.",
        },
      ],
      closing: {
        heading: "How should buying from you work?",
        line: "Let's design the complete path.",
        cta: "Discuss the project with Epic",
      },
      meta: {
        title: "Online store development | Epic Digital Hub",
        description:
          "Online stores with clear structure, product pages and a simple ordering process. Design, development and integrations adapted to your business.",
      },
    },
    {
      slug: "website-uri-prezentare",
      num: "06",
      name: "Company Website Development",
      hubDescription:
        "Websites that show the level of your business and help the visitor quickly understand why to choose you. Strategy, copy, design and development in the same project.",
      hubLink: "See how we build websites",
      hero: {
        h1: "Your website speaks before you answer the phone.",
        paragraphs: [
          "It should live up to the level of your business.",
          "We build websites that explain the offer, show what sets you apart and lead the visitor toward a clear action. The copy, the design and the development start from the same direction.",
        ],
        cta: "Let's talk about your website",
      },
      direction: {
        kicker: "The site's role",
        heading: "Make it clear who you are and why you're worth contacting.",
        paragraphs: [
          "When someone lands on the site, they come with a question, a need or a comparison in mind. We organize the pages around those things and build the arguments in the order they're useful.",
          "The design gives the brand character. Photography and video bring context. The interactions support the experience, with attention to readability, speed and mobile use.",
        ],
      },
      deliverablesTitle: "What the project includes",
      deliverables: [
        {
          title: "Structure and main paths.",
          body: "We set the pages and the relevant actions for each type of visitor.",
        },
        {
          title: "The copy.",
          body: "We explain the services, the differences and the working process in language that fits the brand.",
        },
        {
          title: "Visual direction.",
          body: "We build a design coherent with the positioning and the existing materials.",
        },
        {
          title: "Development.",
          body: "We implement the pages and the interactions, adapted for mobile, tablet and desktop.",
        },
        {
          title: "Forms and integrations.",
          body: "We connect the enquiries with the agreed workflow, including CRM or bookings where needed.",
        },
        {
          title: "The technical base for SEO and measurement.",
          body: "We prepare the structure, the metadata and the events set in the project.",
        },
        {
          title: "Review and launch.",
          body: "We test navigation, forms and rendering before publishing.",
        },
      ],
      how: {
        kicker: "How we work",
        heading: "We clarify the message before we draw the pages.",
        paragraphs: [
          "We start from objectives and content. We validate the structure, then the visual direction and the implementation. Each stage has a deliverable and a feedback moment, so the project moves forward with the important decisions already made.",
        ],
      },
      faq: [
        {
          q: "Do we need to have the copy and photos ready?",
          a: "We can develop the copy starting from your information. For images, we establish what materials can be used and whether photo or video production is needed.",
        },
        {
          q: "Will we be able to update the site ourselves?",
          a: "We establish from the start which sections your team needs to manage and choose the technical solution accordingly.",
        },
        {
          q: "Can you keep our current domain?",
          a: "Yes. We plan the move, the access to the infrastructure and the necessary redirects, depending on the existing site.",
        },
      ],
      closing: {
        heading: "The business has evolved. Does the website show it?",
        cta: "Discuss the project with Epic",
      },
      meta: {
        title: "Company websites | Epic Digital Hub",
        description:
          "Company websites built from strategy, copy and design. Clear pages, a carefully crafted experience and integration with the business's objectives.",
      },
    },
    {
      slug: "design-grafic",
      num: "07",
      name: "Graphic Design",
      hubDescription:
        "A visual identity that holds from the first ad to the last page of a proposal. Design for campaigns, social media, print and the materials you need in sales.",
      hubLink: "See how we work with design",
      hero: {
        h1: "The same brand. Wherever you meet it.",
        paragraphs: [
          "In an ad, on a proposal, in a showroom or on a poster.",
          "We build and apply a recognizable visual direction. Every material has a clear role and belongs to the same identity, whatever the format or channel.",
        ],
        cta: "Let's talk about your brand's image",
      },
      direction: {
        kicker: "What the visual direction brings",
        heading: "Decisions that stay coherent from one project to the next.",
        paragraphs: [
          "The colors, the typography, the images and the way you lay out information build expectations about the brand. When the rules are clear, new materials can evolve without the identity changing with every campaign.",
          "We start from the positioning and the real uses. A brand that communicates prices and offers has different needs from one that presents technical services or premium experiences.",
        ],
      },
      deliverablesTitle: "What we can create",
      deliverables: [
        {
          title: "Visual identity.",
          body: "Logo, color palette, typography and usage rules, depending on the project.",
        },
        {
          title: "Campaign materials.",
          body: "Visual concepts and adaptations for the promotion formats.",
        },
        {
          title: "Social media design.",
          body: "Posts, carousels, stories and reusable templates.",
        },
        {
          title: "Commercial materials.",
          body: "Presentations, proposals, brochures and product sheets.",
        },
        {
          title: "Print design.",
          body: "Posters, flyers, business cards and other materials prepared to production specifications.",
        },
        {
          title: "Visual guide.",
          body: "Rules clear enough for the identity to be applied consistently.",
        },
      ],
      how: {
        kicker: "How we work",
        heading: "First we establish what the material has to communicate.",
        paragraphs: [
          "We clarify the audience, the message, the context and the format. We propose a direction we can argue for, develop it through feedback and prepare the files for the agreed uses. For recurring materials, we build a base that makes execution more coherent and more efficient.",
        ],
      },
      faq: [
        {
          q: "Can we keep our current logo?",
          a: "Yes. We can work within the existing identity or propose adjustments where applying it creates problems.",
        },
        {
          q: "Do you handle printing too?",
          a: "Preparing the files and the physical production are separate things. We establish in the offer whether the project also includes coordinating with the print supplier.",
        },
        {
          q: "Do we get the editable files?",
          a: "The final formats, the source files and the licenses for fonts or images are clarified before the project starts.",
        },
      ],
      closing: {
        heading: "Put all your materials side by side. Is it the same brand?",
        cta: "Build the visual direction with Epic",
      },
      meta: {
        title: "Graphic design and visual identity | Epic Digital Hub",
        description:
          "Visual identity, design for campaigns, social media, print and commercial materials. One coherent direction in every appearance of the brand.",
      },
    },
    {
      slug: "email-marketing",
      num: "08",
      name: "Email Marketing",
      hubDescription:
        "We continue the conversation with the people who have already shown interest. Campaigns and automations built around the moments when a message is genuinely useful.",
      hubLink: "See how we use email",
      hero: {
        h1: "You already have their attention. The conversation deserves to continue.",
        paragraphs: [
          "Someone subscribed, asked for an offer or bought from you. The next message should take that moment into account.",
          "We build email campaigns and automations that are relevant to the relationship between brand and client. We establish who we write to, why we write to them and what the natural next step is.",
        ],
        cta: "Let's talk about email marketing",
      },
      direction: {
        kicker: "What we build",
        heading: "Messages you have a good reason to send.",
        paragraphs: [
          "A launch can interest a certain segment. A new client may need explanations. Someone who has already bought may be ready for a complementary product.",
          "We organize the communication around these situations. We keep the brand's voice and prepare emails that read easily, with one main message and a clear action.",
        ],
      },
      deliverablesTitle: "What the collaboration can include",
      deliverables: [
        {
          title: "Contact base analysis.",
          body: "We review the sources, the quality of the data and the way communication permissions were collected.",
        },
        {
          title: "Segmentation.",
          body: "We group contacts based on the available information and their relationship with the business.",
        },
        {
          title: "The campaign plan.",
          body: "We set the themes, the rhythm and the connection with your launches or offers.",
        },
        {
          title: "Copy and design.",
          body: "We build emails coherent with the brand and adapted for mobile.",
        },
        {
          title: "Automations.",
          body: "Welcome messages, post-purchase, win-back or abandoned cart flows, where the data, the platform and the permissions allow.",
        },
        {
          title: "Testing and analysis.",
          body: "We check the rendering, the links and the indicators relevant to each type of campaign.",
        },
      ],
      how: {
        kicker: "How we work",
        heading: "We start with the moments that have a clear role in the client relationship.",
        paragraphs: [
          "We choose the priority flows and set the triggers, the content and the stop conditions. We coordinate the automations with the manually sent messages, so the communication stays useful and easy to follow.",
        ],
      },
      faq: [
        {
          q: "Can we start if we have few contacts?",
          a: "Yes. We can put the signup forms and the welcome messages in order, then develop the communication as the base grows.",
        },
        {
          q: "How often do we send emails?",
          a: "It depends on what there is to communicate, on the subscribers' expectations and on the reactions we observe. The frequency has to be sustainable with relevant messages.",
        },
        {
          q: "What results do we track?",
          a: "Clicks, enquiries, orders and attributable revenue, where measurement allows, alongside deliverability and unsubscribes. We read the indicators together and keep their limits in mind.",
        },
      ],
      closing: {
        heading: "What happens after the first contact with your brand?",
        line: "Let's build what comes next.",
        cta: "Talk to Epic",
      },
      meta: {
        title: "Email marketing and automations | Epic Digital Hub",
        description:
          "Email campaigns and automations adapted to the client relationship. Segmentation, copy, design and measurement, connected to your business's activity.",
      },
    },
    {
      slug: "tracking-date",
      num: "09",
      name: "Data Tracking",
      hubDescription:
        "We set up the measurement of the actions that matter for the business. See where enquiries come from, where people drop off and what you can decide based on the available data.",
      hubLink: "See how we measure results",
      hero: {
        h1: "Before the next budget, you need data you can trust.",
        paragraphs: [
          "Where the enquiries come from. What people do on the site. Where they stop. What actually reaches the sales team.",
          "We set up and verify the measurement of the actions relevant to your business. We build an analysis base that helps you make decisions and shows you where the information is incomplete.",
        ],
        cta: "Let's check what you're measuring",
      },
      direction: {
        kicker: "Why we start with definitions",
        heading: "What you call a conversion has to mean something for the business.",
        paragraphs: [
          "A click on a phone number, a submitted form and a sale are different stages. If we treat them the same, it becomes hard to understand what the campaigns produce.",
          "We establish the important actions and the relationship between them. We check what we can measure on the site, what data exists in the advertising platforms and what information your team can add about the quality of the enquiries.",
        ],
      },
      deliverablesTitle: "What the project includes",
      deliverables: [
        {
          title: "Implementation audit.",
          body: "We review the tools, the events, the gaps and the possible duplications.",
        },
        {
          title: "The measurement plan.",
          body: "We define the conversions and the indicators we'll use in the analysis.",
        },
        {
          title: "Tool configuration.",
          body: "We implement GA4, Google Tag Manager and the agreed connections, depending on the infrastructure.",
        },
        {
          title: "Relevant events.",
          body: "Forms, contact requests, buying stages and purchases, where applicable.",
        },
        {
          title: "Campaign tagging.",
          body: "We set consistent rules for identifying traffic sources.",
        },
        {
          title: "Consent integration.",
          body: "We adapt how the tools fire to the agreed configuration and to users' choices.",
        },
        {
          title: "Validation and documentation.",
          body: "We test the important scenarios and explain what we collect, how we interpret it and what limits exist.",
        },
      ],
      how: {
        kicker: "How we use the data",
        heading: "Every report should help with a decision.",
        paragraphs: [
          "We organize the indicators around the questions you have: which channel brings relevant enquiries, where the purchase breaks off and which page deserves improvement. When the information allows, we connect the analysis with the results recorded in the CRM or the order system.",
        ],
      },
      faq: [
        {
          q: "Can we measure absolutely every visit and sale?",
          a: "No. Consent, device settings and the way people use several channels limit visibility. We explain these limits in the analysis.",
        },
        {
          q: "Why do the numbers differ between platforms?",
          a: "The tools can use different rules and attribution windows. We verify the implementation and establish which source we use for each type of decision.",
        },
        {
          q: "Can we connect the forms to final sales?",
          a: "In many projects, yes, if the infrastructure exists and there's a consistent process for updating the enquiries. Feasibility is established after reviewing the systems.",
        },
      ],
      closing: {
        heading: "What decision are you postponing because the data isn't clear enough?",
        cta: "Discuss measurement with Epic",
      },
      meta: {
        title: "Tracking, GA4 and conversion measurement | Epic Digital Hub",
        description:
          "Tracking audit and setup for forms, enquiries and purchases. Explained data, verified implementation and indicators tied to the business.",
      },
    },
    {
      slug: "consultanta-marketing",
      num: "10",
      name: "Consulting",
      hubDescription:
        "We put order in objectives, offer, channels and budgets. You leave with priorities explained and a plan your team can put to work.",
      hubLink: "See what consulting looks like",
      hero: {
        h1: "Let's establish what's worth doing now.",
        paragraphs: [
          "Maybe you have a team, a few suppliers and plenty of ideas. What's missing is the order: what takes priority, who is responsible and how you can tell it's working.",
          "We work with you on the marketing direction of the business. We analyze the situation, ask the difficult questions and build a plan you can use in day-to-day decisions.",
        ],
        cta: "Let's talk about your direction",
      },
      direction: {
        kicker: "When it makes sense",
        heading: "When you have to make a decision before investing more.",
        paragraphs: [
          "You're launching a brand. Entering a new market. You've grown and the communication has fallen behind. Or you invest in several channels but don't have a shared picture of the results.",
          "Consulting starts with the concrete problem. We look at what exists, talk to the people involved and separate what we know from data from what still has to be verified.",
        ],
      },
      deliverablesTitle: "What we can clarify",
      deliverables: [
        {
          title: "Positioning.",
          body: "Who your offer is for and what reasons that audience has to choose you.",
        },
        {
          title: "The commercial offer.",
          body: "How you present the products and services and where the buying decision gets unclear.",
        },
        {
          title: "The client's path.",
          body: "How they move from first contact to enquiry, purchase and return.",
        },
        {
          title: "The role of the channels.",
          body: "What the website, the ads, the content and the direct communication each have to do.",
        },
        {
          title: "Budgets and priorities.",
          body: "Where we invest now, what we test and what can wait.",
        },
        {
          title: "Organizing the execution.",
          body: "Responsibilities, working rhythm and the information the team needs.",
        },
        {
          title: "Measurement.",
          body: "The indicators we judge progress by and the moments when we revisit the plan.",
        },
      ],
      how: {
        kicker: "What you leave with",
        heading: "A written direction and steps that can be put to work.",
        paragraphs: [
          "Depending on the project, the deliverable can include a diagnosis of the situation, positioning recommendations, the role of the channels and a plan for the first 90 days. Every priority comes with the reason it matters and the dependencies we have to account for.",
        ],
      },
      faq: [
        {
          q: "Can we work with Epic if we already have an in-house team?",
          a: "Yes, depending on niche availability. We can build the direction together with your team and clarify how they put it into practice.",
        },
        {
          q: "Do we have to continue with the implementation?",
          a: "No. We establish from the start whether the project is consulting, implementation or both.",
        },
        {
          q: "Is it a single meeting?",
          a: "The format depends on the problem. It can be a defined project or a collaboration with periodic meetings, analysis and adjusted priorities.",
        },
      ],
      closing: {
        heading: "What is the decision your business has to make now?",
        line: "That's where we start.",
        cta: "Talk to Epic",
      },
      meta: {
        title: "Marketing consulting and strategy | Epic Digital Hub",
        description:
          "Clarity in positioning, offer, channels and budgets. Marketing consulting with priorities explained and a plan your team can apply.",
      },
    },
  ],
};

export const servicesContent: Record<Locale, ServicesCopy> = { en, ro };
