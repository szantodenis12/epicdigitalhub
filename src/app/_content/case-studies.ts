import type { Locale } from "../content";

export type CaseSection = {
  title: string;
  paragraphs: string[];
};

export type CaseStudy = {
  slug: string;
  /** SEO title (already ends in the site suffix) + meta description, from the copy deck */
  meta?: { title: string; description: string };
  /** rendered with .label-mono */
  vertical: string;
  title: string;
  summary: string;
  img: string;
  intro: string;
  /** exactly three: context → what we built → what changed */
  sections: CaseSection[];
  /** the single confirmed public number — hotel study only */
  result?: string;
  /** not published yet: kept out of the listing and the sitemap, rendered noindex */
  draft?: boolean;
};

export type CaseStudiesContent = {
  /** SEO title (already ends in the site suffix) + meta description, from the copy deck */
  meta?: { title: string; description: string };
  kicker: string;
  title: string;
  intro: string;
  note: string;
  detailKicker: string;
  backLabel: string;
  ctaTitle: string;
  ctaApply: string;
  ctaAudit: string;
  studies: CaseStudy[];
};

export const caseStudySlugs = [
  "hotel-maxim",
  "dentalnet",
  "agro-salso",
  "kgm-oradea",
  "chery-oradea",
  "jeep-oradea",
  "harmony-garden",
  "origins-cafe",
  "thermx",
] as const;

/* Nothing is held back right now. The deck marks Jeep Oradea an internal draft
   until its first materials are delivered; Denis asked for it published anyway,
   so it sits in the list above. The machinery stays: put a slug in here and the
   page keeps its route but drops out of the listing and the sitemap and renders
   noindex. */
export const draftCaseStudySlugs = [] as const;

export const caseStudiesContent: Record<Locale, CaseStudiesContent> = {
  ro: {
    meta: { title: "Studii de caz | Epic Digital Hub", description: "Proiecte de marketing, branding și digital dezvoltate de Epic Digital Hub. Lucrăm cu un singur brand din fiecare nișă, în fiecare oraș." },
    kicker: "Studii de caz",
    title: "Proiectele noastre. Rezultatele lor.",
    intro:
      "Lucrăm cu un singur brand pe nișă, pe oraș. Acestea sunt opt dintre brandurile cu care construim.",
    note: "Un singur brand din fiecare nișă, în fiecare oraș. Cât timp colaborăm, concurenții tăi direcți nu pot lucra cu noi.",
    detailKicker: "Studiu de caz",
    backLabel: "Toate studiile de caz",
    ctaTitle: "Dacă piața ta mai are loc pentru un brand care să conducă, avem ce discuta.",
    ctaApply: "Verifică dacă nișa ta e liberă",
    ctaAudit: "Începe cu un audit",
    studies: [
      {
        slug: "hotel-maxim",
        meta: { title: "Hotel Maxim | Epic Digital Hub", description: "Website reconstruit integral, strategie digitală, SEO, social media și Google Ads pentru Hotel Maxim Oradea. Rezultat: cu 20% mai multe rezervări în șase luni." },
        vertical: "Ospitalitate / Oradea",
        title: "Hotel Maxim",
        summary:
          "Am reconstruit complet website-ul și am reorganizat comunicarea digitală a hotelului, de la social media și profilul Google până la campaniile de promovare. Rezultatul: cu 20% mai multe rezervări în șase luni.",
        img: "/images/work-hotel.webp",
        intro:
          "Hotel Maxim este un hotel de familie, situat la câteva minute de centrul istoric al Oradiei. Avea deja o reputație bună, construită prin experiența oaspeților și recomandările acestora. Prezența online nu reflecta însă calitatea serviciilor oferite.",
        sections: [
          {
            title: "De unde am pornit",
            paragraphs: [
              "O parte importantă a rezervărilor venea prin platforme externe, care percepeau comisioane pentru fiecare rezervare.",
              "În același timp, prezența digitală a hotelului avea mai multe probleme. Conturile de social media erau inactive, website-ul conținea linkuri nefuncționale, inclusiv în zona de rezervări, iar unele informații despre facilități și datele de contact nu mai erau actualizate.",
              "Hotelul oferea servicii apreciate de oaspeți, dar canalele online nu îl reprezentau corespunzător și nu susțineau suficient rezervările directe.",
            ],
          },
          {
            title: "Ce am făcut",
            paragraphs: [
              "Am început prin definirea poziționării și a regulilor de comunicare ale hotelului, astfel încât prezentarea acestuia să fie consecventă pe toate canalele.",
              "Am reconstruit complet website-ul Hotel Maxim, de la structura paginilor și design până la conținut și experiența de navigare. Am reorganizat prezentarea camerelor, facilităților și serviciilor, am actualizat informațiile și am simplificat accesul la rezervări.",
              "Am reluat comunicarea pe Facebook și Instagram, folosind fotografii reale ale hotelului și un calendar constant de postări, carusele și stories.",
              "Am optimizat profilul Google Business, am actualizat informațiile și am stabilit reguli pentru administrarea recenziilor.",
              "Campaniile Google Ads au fost reorganizate în funcție de căutările relevante pentru hotel: cazare în Oradea, restaurant, săli de conferințe și solicitări provenite din Ungaria.",
              "Pentru segmentul corporate și organizarea de evenimente, am creat pagini dedicate și mesaje adaptate companiilor de training și agențiilor de turism.",
            ],
          },
          {
            title: "Rezultatul",
            paragraphs: [
              "Hotel Maxim are acum un website complet refăcut, cu informații actualizate, o structură mai clară și un proces de rezervare funcțional.",
              "Social media, profilul Google și campaniile plătite sunt administrate în aceeași direcție, iar comunicarea hotelului este constantă pe toate canalele.",
              "Campaniile pot fi evaluate în funcție de acțiunile utilizatorilor, nu doar de traficul generat.",
            ],
          },
        ],
        result: "În primele șase luni, Hotel Maxim a înregistrat o creștere de 20% a rezervărilor, rezultat confirmat de client.",
      },
      {
        slug: "dentalnet",
        meta: { title: "DentalNet | Epic Digital Hub", description: "Strategie de brand, social media, identitate vizuală și optimizare Google pentru DentalNet și DentalNet Kids, două clinici stomatologice din Oradea." },
        vertical: "Medical / Oradea",
        title: "DentalNet",
        summary:
          "Două clinici stomatologice, două categorii de pacienți. Am dezvoltat direcții distincte de comunicare, identități vizuale adaptate și o prezență online care respectă rigorile domeniului medical.",
        img: "/images/work-dental.webp",
        intro:
          "DentalNet are două clinici stomatologice în Oradea: una dedicată adulților și una copiilor. Ambele și-au construit reputația în timp, în principal prin recomandările pacienților. Comunicarea digitală avea însă nevoie de o direcție mai clară, adaptată fiecărei categorii de pacienți.",
        sections: [
          {
            title: "De unde am pornit",
            paragraphs: [
              "Cele două clinici se adresau unor publicuri diferite, dar comunicarea nu evidenția suficient această diferență.",
              "În cazul clinicii pediatrice, profilul Google era încadrat într-o categorie incorectă, ceea ce limita vizibilitatea pentru căutările locale relevante.",
              "În paralel, competitori naționali difuzau campanii Google Ads inclusiv pentru căutări după numele clinicii.",
              "Domeniul medical impunea și cerințe specifice privind publicitatea, prezentarea serviciilor și utilizarea imaginilor pacienților.",
              "Aveam nevoie de o comunicare adaptată fiecărei clinici, care să respecte atât identitatea brandului, cât și normele profesionale.",
            ],
          },
          {
            title: "Ce am făcut",
            paragraphs: [
              "Am construit două direcții de comunicare distincte, pornind de la profilul pacienților fiecărei clinici.",
              "Pentru DentalNet Kids, am dezvoltat un stil vizual și editorial prietenos, cu accent pe prevenție, încredere și informații utile pentru părinți.",
              "Pentru clinica destinată adulților, am ales un stil mai sobru, concentrat pe profesionalismul echipei, specializările medicilor și prezentarea clară a serviciilor.",
              "Am stabilit reguli vizuale și editoriale separate, astfel încât fiecare clinică să aibă o identitate ușor de recunoscut.",
              "Pentru DentalNet Kids, am creat și o mascotă originală, integrată în materialele de comunicare, în social media și în materialele utilizate în cabinet.",
              "Am reorganizat profilurile Google ale ambelor clinici, corectând categoriile, completând lista serviciilor și stabilind un proces constant de administrare a recenziilor.",
              "Am definit regulile pentru producția foto-video în clinică, inclusiv documentele necesare pentru obținerea acordului pacienților privind utilizarea imaginii.",
            ],
          },
          {
            title: "Rezultatul",
            paragraphs: [
              "DentalNet și DentalNet Kids comunică acum distinct, fiecare într-un stil adaptat pacienților săi.",
              "Prezentările medicilor, materialele informative, postările și elementele vizuale respectă aceleași reguli în cadrul fiecărui brand.",
              "Profilurile Google sunt administrate constant, iar clinicile au o vizibilitate mai bună în căutările locale relevante.",
              "Comunicarea este mai consecventă, mai bine organizată și respectă cerințele specifice domeniului medical.",
            ],
          },
        ],
      },
      {
        slug: "agro-salso",
        meta: { title: "Agro Salso | Epic Digital Hub", description: "Reconstrucție completă de website, catalog de utilaje agricole, Google Ads, Meta Ads și măsurarea conversiilor pentru Agro Salso, dealer cu acoperire națională." },
        vertical: "Utilaje agricole / România",
        title: "Agro Salso",
        summary:
          "Am refăcut integral website-ul, am reorganizat catalogul de utilaje și am restructurat campaniile Google și Meta Ads. Am pus accent pe informații tehnice corecte și pe generarea cererilor de ofertă.",
        img: "/images/work-agro.webp",
        intro:
          "Agro Salso este un dealer de utilaje agricole din Bihor, cu livrări în toată România și un portofoliu extins de echipamente. Produsele erau competitive, dar website-ul, campaniile și materialele comerciale aveau nevoie de o reorganizare completă.",
        sections: [
          {
            title: "De unde am pornit",
            paragraphs: [
              "Campaniile plătite generau trafic, dar nu exista o măsurare suficient de clară a solicitărilor primite prin website.",
              "O parte din buget era consumată de căutări fără relevanță comercială, iar performanța era dificil de evaluat dincolo de numărul de clicuri.",
              "Website-ul avea nevoie de o structură nouă, capabilă să prezinte corect un portofoliu extins de utilaje și să faciliteze solicitarea ofertelor.",
              "În plus, informațiile comerciale nu erau întotdeauna consecvente. Specificațiile, prețurile și unele asocieri de brand diferau între pagini și materiale.",
              "Pentru un cumpărător de utilaje agricole, aceste detalii contează. O specificație incorectă sau o informație incompletă poate influența direct decizia de achiziție.",
            ],
          },
          {
            title: "Ce am făcut",
            paragraphs: [
              "Am reconstruit complet website-ul Agro Salso, de la arhitectura paginilor și design până la catalogul de produse și formularele de solicitare a ofertelor.",
              "Am reorganizat prezentarea utilajelor pe categorii și am refăcut paginile de produs pentru ca informațiile importante să fie ușor de găsit, înțeles și comparat.",
              "Am rescris descrierile folosind documentația tehnică oficială a producătorilor. Caracteristicile, compatibilitățile și beneficiile comerciale sunt prezentate fără exagerări și fără afirmații care nu pot fi verificate.",
              "Am corelat informațiile din website cu listele de prețuri și documentele furnizorilor, pentru a elimina diferențele dintre materialele comerciale.",
              "În paralel, am restructurat campaniile Google și Meta Ads. Am analizat termenii de căutare, am exclus traficul nerelevant și am reorganizat promovarea în jurul produselor și categoriilor cu potențial comercial.",
              "Am configurat măsurarea conversiilor pentru formularele și acțiunile relevante din website, astfel încât să putem evalua campaniile în funcție de cererile de ofertă generate.",
              "Am aplicat aceleași reguli de prezentare în cataloage, liste de prețuri și materialele pregătite pentru târguri și expoziții.",
              "Am inclus și CRM-ul în organizarea procesului comercial, pentru o gestionare mai clară a solicitărilor.",
            ],
          },
          {
            title: "Rezultatul",
            paragraphs: [
              "Agro Salso are acum un website complet refăcut, cu un catalog de utilaje organizat, pagini de produs documentate și un proces mai clar de solicitare a ofertelor.",
              "Campaniile Google și Meta Ads sunt structurate în jurul obiectivelor comerciale, iar conversiile pot fi urmărite prin acțiunile relevante ale utilizatorilor.",
              "Informațiile tehnice și comerciale sunt consecvente între website, cataloage și materialele de vânzare.",
              "Echipa comercială lucrează cu aceeași bază de informații utilizată în promovare, iar solicitările primite pot fi gestionate mai organizat.",
              "Un website construit pentru vânzare, campanii care pot fi evaluate corect și informații comerciale pe care clienții se pot baza.",
            ],
          },
        ],
      },
      {
        slug: "kgm-oradea",
        meta: { title: "KGM Oradea | Epic Digital Hub", description: "Strategie de comunicare și marketing automotive pentru KGM Oradea. Conținut social media, prezentări de modele, campanii comerciale și producție video." },
        vertical: "Automotive / Oradea",
        title: "KGM Oradea",
        summary:
          "Am construit comunicarea locală a brandului în perioada tranziției de la SsangYong la KGM. Prezentăm fiecare model prin conținut bazat pe specificațiile și informațiile oficiale ale importatorului.",
        /* The Actyon itself, cut out of the trim carousel and padded back to 4:3
           by stretching the studio backdrop's own edge rows. The shared
           automotive photo is a Chery and cannot front a KGM page, and the
           carousel as a whole is a social graphic, not a hero. */
        img: "/images/work-kgm.webp",
        intro:
          "Pentru KGM Oradea, am construit o direcție de comunicare care pune în valoare modelele, tehnologia și dotările disponibile. Fiecare material este realizat pe baza informațiilor oficiale, cu accent pe ceea ce contează pentru un potențial cumpărător.",
        sections: [
          {
            title: "Contextul",
            paragraphs: [
              "Într-o piață auto în care cumpărătorii compară atent prețurile, echipările și caracteristicile tehnice, comunicarea trebuie să ofere informații clare și actualizate.",
              "Gama KGM include modele cu caracteristici și utilizări diferite, de la SUV-uri pentru familie până la vehicule 4×4 și pick-up-uri.",
              "Provocarea era să prezentăm fiecare model într-un mod relevant, fără mesaje generice și fără să pierdem din vedere diferențele tehnice și comerciale.",
            ],
          },
          {
            title: "Ce am construit",
            paragraphs: [
              "Am dezvoltat o direcție vizuală și editorială proprie pentru KGM Oradea, cu formate recognoscibile și o comunicare centrată pe produs.",
              "Am organizat producția lunară de conținut pentru lansări, prezentări de modele, carusele informative, oferte comerciale, stories și reels.",
              "Scenariile video sunt concepute pentru consultanții de vânzări, cu un limbaj natural, explicații concise și informații utile. Fiecare clip tratează un subiect concret, într-un format de aproximativ 40 de secunde.",
              "Pentru comunicarea comercială, verificăm prețurile, motorizările, echipările, dotările și condițiile promoționale în documentația oficială KGM România înainte de publicare.",
            ],
          },
          {
            title: "Ce s-a schimbat",
            paragraphs: [
              "KGM Oradea are acum o comunicare constantă, cu o identitate vizuală coerentă și materiale adaptate fiecărui model.",
              "Informațiile tehnice și comerciale sunt prezentate clar, iar conținutul îi ajută pe potențialii cumpărători să înțeleagă diferențele dintre modele și echipări înainte de a ajunge în showroom.",
            ],
          },
        ],
      },
      {
        slug: "chery-oradea",
        meta: { title: "Chery Oradea | Epic Digital Hub", description: "Marketing și comunicare automotive pentru Chery Oradea. Lansări de modele, social media, reels și conținut comercial bazat pe specificații și oferte oficiale." },
        vertical: "Automotive / Oradea",
        title: "Chery Oradea",
        summary:
          "Am dezvoltat comunicarea locală a unui brand auto nou pe piață, cu prezentări de modele, materiale video și campanii construite în jurul informațiilor tehnice și ofertelor oficiale.",
        img: "/images/work-auto.webp",
        intro:
          "Chery a intrat pe piața din Oradea cu o gamă de SUV-uri și tehnologii hibride încă puțin cunoscute publicului local. Am construit o comunicare care prezintă modelele, explică tehnologia și oferă cumpărătorilor informațiile necesare pentru a compara versiunile disponibile.",
        sections: [
          {
            title: "Contextul",
            paragraphs: [
              "Pentru o marcă nouă pe piață, notorietatea nu este suficientă. Cumpărătorii vor să știe cât costă un model, ce dotări include, cum funcționează sistemul hibrid și ce avantaje oferă în utilizarea de zi cu zi.",
              "Gama Tiggo include modelele 4, 7, 8 și 9, cu motorizări și echipări diferite.",
              "Comunicarea trebuia să facă aceste diferențe ușor de înțeles, fără formulări generale sau promisiuni comerciale nejustificate.",
            ],
          },
          {
            title: "Ce am construit",
            paragraphs: [
              "Am dezvoltat o identitate de comunicare pentru Chery Oradea, cu un stil vizual consecvent și conținut construit în jurul produselor.",
              "Fiecare material pornește de la un model, o motorizare și o echipare concretă. Prezentăm dotările, caracteristicile tehnice și avantajele relevante pentru cumpărător, fără să amestecăm specificațiile unor versiuni diferite.",
              "Producția lunară include lansări, carusele informative, prezentări de gamă, conținut comercial, stories și reels.",
              "Am dezvoltat și materiale video dedicate tehnologiilor hibride, explicând diferențele dintre motorizări și modul în care acestea funcționează.",
              "Prețurile și ofertele sunt verificate în listele oficiale Chery România, iar condițiile promoționale sunt comunicate numai după confirmarea perioadei de valabilitate.",
            ],
          },
          {
            title: "Ce s-a schimbat",
            paragraphs: [
              "Chery Oradea are acum o prezență digitală constantă și o comunicare adaptată unei mărci aflate în proces de consolidare pe piața locală.",
              "Fiecare material răspunde unei întrebări relevante pentru cumpărător: cât costă, ce dotări primește, care sunt diferențele dintre versiuni și ce tehnologie utilizează.",
              "Modelele sunt prezentate prin informații concrete, într-un format accesibil și ușor de urmărit.",
            ],
          },
        ],
      },
      {
        slug: "jeep-oradea",
        meta: { title: "Jeep Oradea | Epic Digital Hub", description: "Strategie de comunicare și marketing automotive pentru Jeep Oradea. Prezentări de modele, conținut social media, materiale comerciale și producție video." },
        vertical: "Automotive / Oradea",
        title: "Jeep Oradea",
        summary:
          "Jeep este un brand auto cu o identitate bine definită și o istorie recunoscută în segmentul SUV-urilor și al vehiculelor 4×4. Comunicarea locală trebuie să pună în valoare această identitate, dar și să ofere informații concrete despre modelele și ofertele disponibile în showroom.",
        img: "/images/work-jeep.webp",
        intro:
          "Jeep este un brand auto cu o identitate bine definită și o istorie recunoscută în segmentul SUV-urilor și al vehiculelor 4×4. Comunicarea locală trebuie să pună în valoare această identitate, dar și să ofere informații concrete despre modelele și ofertele disponibile în showroom.",
        sections: [
          {
            title: "Contextul",
            paragraphs: [
              "Pentru un brand deja cunoscut, interesul cumpărătorilor se concentrează asupra modelelor disponibile, motorizărilor, echipărilor și prețurilor.",
              "Comunicarea trebuie să răspundă acestor întrebări, păstrând caracterul distinctiv al mărcii.",
              "Fiecare model are propriile caracteristici și se adresează unor nevoi diferite, iar materialele trebuie să prezinte aceste diferențe clar și corect.",
            ],
          },
          {
            title: "Ce construim",
            paragraphs: [
              "Dezvoltăm o direcție vizuală și editorială proprie pentru Jeep Oradea, adaptată identității mărcii și publicului local.",
              "Planificăm conținut pentru lansări, prezentări de modele, carusele informative, oferte comerciale, stories și materiale video.",
              "Scenariile vor fi construite în jurul caracteristicilor relevante pentru cumpărători, cu explicații clare despre motorizări, echipări și dotări.",
              "Prețurile și condițiile comerciale vor fi verificate în documentația oficială a importatorului înainte de publicare.",
            ],
          },
          {
            title: "Rezultatele proiectului",
            paragraphs: [
              "Secțiune de completat după livrarea și publicarea primelor materiale. Nu se comunică rezultate înainte ca acestea să poată fi documentate.",
            ],
          },
        ],
      },
      {
        slug: "harmony-garden",
        meta: { title: "Harmony Garden | Epic Digital Hub", description: "Strategie de comunicare, branding de eveniment, design grafic și producție de conținut pentru Harmony Garden, un club de vară din Bihor." },
        vertical: "Evenimente / Bihor",
        title: "Harmony Garden",
        summary:
          "Am coordonat comunicarea unui sezon de evenimente, cu identități vizuale distincte, conținut produs săptămânal și mesaje adaptate publicului local.",
        img: "/images/work-events.webp",
        intro:
          "Harmony Garden este un club de vară din Valea lui Mihai, aproape de granița cu Ungaria, cu un public predominant maghiar. Am coordonat comunicarea întregului sezon, de la identitatea fiecărui eveniment până la materialele de promovare și conținutul publicat săptămânal.",
        sections: [
          {
            title: "Contextul",
            paragraphs: [
              "Pentru un club sezonier, timpul de promovare este limitat. Evenimentele se succed aproape în fiecare weekend, iar fiecare trebuie să atragă atenția fără să se confunde cu celelalte.",
              "Publicul Harmony Garden este format în principal din vorbitori de maghiară, atât din zonă, cât și din localitățile apropiate de graniță.",
              "Comunicarea trebuia să respecte limba, expresiile și particularitățile publicului, nu să reproducă traduceri din română.",
            ],
          },
          {
            title: "Ce am făcut",
            paragraphs: [
              "Am început prin planificarea sezonului, stabilind calendarul evenimentelor, ritmul publicării și principalele momente de promovare.",
              "Am creat identități vizuale distincte pentru fiecare eveniment, păstrând legătura cu brandul Harmony Garden. Producția a inclus afișe, flyere, teasere video și materiale adaptate pentru social media.",
              "Textele au fost redactate direct în maghiară, cu formulări naturale și un ton potrivit publicului.",
              "Pe lângă promovarea digitală, am realizat materiale pentru organizarea evenimentelor: bilete numerotate, abonamente, materiale pentru tombole și meniul barului.",
              "Am coordonat producția săptămânală de conținut, astfel încât fiecare eveniment să aibă materialele necesare la timp.",
            ],
          },
          {
            title: "Rezultatul",
            paragraphs: [
              "Harmony Garden a avut o comunicare constantă pe durata sezonului, cu o identitate clară pentru fiecare eveniment.",
              "Planificarea a permis pregătirea materialelor în avans și adaptarea promovării în funcție de calendar.",
              "Formatele vizuale și procesul de producție pot fi reutilizate și îmbunătățite pentru sezoanele următoare.",
            ],
          },
        ],
      },
      {
        slug: "origins-cafe",
        meta: { title: "Origins Coffee & Drinks | Epic Digital Hub", description: "Marketing pentru cafenele, comunicare de brand și dezvoltarea unei platforme digitale de fidelizare pentru Origins Coffee & Drinks din Oradea." },
        vertical: "HoReCa / Oradea",
        title: "Origins Coffee & Drinks",
        summary:
          "Am organizat comunicarea pentru mai multe locații, păstrând o identitate comună. Proiectul include conținutul digital, prezența locală și dezvoltarea programului de fidelizare.",
        img: "/images/work-cafe.webp",
        intro:
          "Origins Coffee & Drinks are patru locații în Oradea, fiecare cu un public și un ritm propriu. Am construit o comunicare comună pentru întregul brand, adaptată fiecărei locații, și am dezvoltat o platformă digitală de fidelizare pentru clienți.",
        sections: [
          {
            title: "Contextul",
            paragraphs: [
              "Pentru o cafenea, relația cu clientul nu se încheie după prima vizită. Contează cât de des revine și experiența pe care o are de fiecare dată.",
              "Cu patru locații și categorii diferite de clienți, Origins avea nevoie de o comunicare recognoscibilă, dar suficient de flexibilă pentru specificul fiecărei cafenele.",
              "În același timp, programul de fidelizare trebuia să fie ușor de folosit atât de clienți, cât și de personalul din locații.",
            ],
          },
          {
            title: "Ce am făcut",
            paragraphs: [
              "Am dezvoltat platforma digitală de fidelizare Origins, prin care clienții își pot accesa cardurile direct de pe telefon.",
              "Sistemul permite înregistrarea digitală a interacțiunilor eligibile și include un nivel Gold pentru clienții fideli.",
              "Am organizat comunicarea online pentru toate cele patru locații, păstrând aceleași reguli vizuale și editoriale.",
              "Am optimizat individual profilurile Google, cu informații relevante pentru fiecare cafenea.",
              "Pentru social media, am construit o direcție bazată pe fotografii și filmări reale, realizate în locații. Conținutul prezintă produsele, oamenii și atmosfera Origins, fără imagini generice.",
              "Am realizat și meniuri, materiale pentru bar, coduri QR și materiale grafice pentru campanii sezoniere și activări locale.",
            ],
          },
          {
            title: "Rezultatul",
            paragraphs: [
              "Origins are acum o comunicare consecventă în toate cele patru locații, fără să piardă particularitățile fiecăreia.",
              "Platforma de fidelizare permite administrarea digitală a programului, iar clienții își pot folosi cardurile direct de pe telefon.",
              "Profilurile Google, social media și materialele din locații respectă aceeași identitate vizuală.",
              "Un brand recognoscibil în fiecare locație, cu o comunicare adaptată publicului și un program de fidelizare dezvoltat special pentru Origins.",
            ],
          },
        ],
      },
      {
        slug: "thermx",
        meta: { title: "ThermX | Epic Digital Hub", description: "Strategie de brand, dezvoltare website, SEO și campanie de lansare pentru ThermX, o membrană nanoceramică destinată termoizolației clădirilor." },
        vertical: "Industrial / România",
        title: "ThermX",
        summary:
          "Am construit poziționarea și comunicarea de lansare pentru un produs tehnic nou. Am pornit de la documentația produsului și am dezvoltat website-ul și materialele de prezentare.",
        img: "/images/work-industrial.webp",
        intro:
          "ThermX este o membrană nanoceramică pentru termoizolația clădirilor, aplicată prin pulverizare. Am construit strategia de marketing și comunicarea de lansare pornind de la documentația tehnică, astfel încât informațiile despre produs să fie clare, corecte și consecvente.",
        sections: [
          {
            title: "Contextul",
            paragraphs: [
              "ThermX introduce pe piața locală o tehnologie de termoizolație mai puțin familiară publicului, bazată pe aplicarea unei membrane nanoceramice în straturi de ordinul milimetrilor.",
              "Produsul se adresează unor categorii diferite de clienți, de la proprietari de locuințe până la arhitecți și proiectanți. Fiecare are nevoie de un alt nivel de detaliu tehnic.",
              "În plus, informațiile existente despre produs proveneau din mai multe surse și nu erau întotdeauna prezentate uniform.",
              "Înainte de promovare, era necesară verificarea și organizarea datelor tehnice.",
            ],
          },
          {
            title: "Ce am făcut",
            paragraphs: [
              "Am început prin centralizarea parametrilor tehnici într-un singur document de referință. Acesta stă la baza specificațiilor și afirmațiilor utilizate în materialele de comunicare.",
              "Pornind de la această documentație, am definit poziționarea ThermX și am construit strategia de marketing pentru 12 luni.",
              "Am realizat cercetarea de piață, am analizat principalele categorii de cumpărători și am stabilit direcții de comunicare adaptate fiecăreia.",
              "Am dezvoltat strategia SEO și conținutul website-ului, organizând informațiile tehnice într-o structură accesibilă.",
              "Pentru arhitecți și proiectanți, am pregătit o direcție separată de comunicare, cu accent pe informațiile necesare evaluării produsului.",
              "Am coordonat realizarea materialelor de lansare, de la structură și prezentare până la scenariu și producție video.",
              "Comunicarea a fost adaptată pentru Facebook, Instagram și LinkedIn, cu materiale educaționale pentru publicul larg și conținut tehnic destinat profesioniștilor.",
            ],
          },
          {
            title: "Rezultatul",
            paragraphs: [
              "ThermX are acum o poziționare definită, o strategie de marketing documentată și o comunicare adaptată principalelor categorii de cumpărători.",
              "Website-ul, materialele comerciale și conținutul digital folosesc aceleași informații tehnice verificate.",
              "Echipa comercială și canalele de promovare pot prezenta produsul consecvent, fără diferențe între specificațiile publicate.",
              "O comunicare tehnică documentată, de la poziționare și website până la materialele de lansare.",
            ],
          },
        ],
      },
    ],
  },
  en: {
    meta: { title: "Case Studies | Epic Digital Hub", description: "Selected work across hospitality, healthcare, automotive, agriculture and more. One marketing team. One brand per niche, per city." },
    kicker: "Case Studies",
    title: "The work speaks for itself.",
    intro:
      "We work with one brand per niche, per city. These are eight of the brands we build with.",
    note: "One industry. One city. One client. We don't represent competing brands in the same local market.",
    detailKicker: "Case Study",
    backLabel: "All case studies",
    ctaTitle: "If your market still has room for a brand to lead, we should talk.",
    ctaApply: "Check if your niche is open",
    ctaAudit: "Start with an audit",
    studies: [
      {
        slug: "hotel-maxim",
        meta: { title: "Hotel Maxim — Hospitality Marketing Case Study | Epic Digital Hub", description: "How Epic Digital Hub rebuilt Hotel Maxim's digital presence in Oradea, connecting its website, Google Ads, SEO and social media. Bookings increased by 20% in six months." },
        vertical: "Hospitality / Oradea",
        title: "Hotel Maxim",
        summary:
          "A well-established hotel whose digital presence fell short of its reputation. We rebuilt its direct booking channels through website improvements, content, Google optimisation and targeted advertising.",
        img: "/images/work-hotel.webp",
        intro:
          "Hotel Maxim is a family-run hotel within walking distance of Oradea's historic centre. Years of guest recommendations had earned it a strong reputation. Its online presence, however, told a different story.",
        sections: [
          {
            title: "The Challenge",
            paragraphs: [
              "A significant share of reservations came through third-party booking platforms, each taking a commission.",
              "Meanwhile, the hotel's own digital channels were underperforming. Social media activity had stalled. The website contained broken links, including within the booking process, while essential information about facilities and contact details was outdated.",
              "The hotel had earned its reputation. Its digital presence needed to match it.",
            ],
          },
          {
            title: "Our Approach",
            paragraphs: [
              "We began by defining Hotel Maxim's positioning, tone of voice and communication standards.",
              "We rewrote the website copy, corrected outdated information and conducted a technical audit. Broken pages and booking functions were documented, with specific recommendations for the developer.",
              "Facebook and Instagram were rebuilt around authentic hotel photography, supported by a consistent publishing schedule of posts, carousels and stories.",
              "We optimised the Google Business Profile and established clear guidelines for responding to guest reviews.",
              "Google Ads campaigns were restructured around searches with booking intent, including branded searches, accommodation in Oradea, conference facilities and demand from Hungarian travellers.",
              "For corporate bookings and events, we developed dedicated landing pages and an outreach strategy targeting training companies and travel agencies.",
            ],
          },
          {
            title: "The Outcome",
            paragraphs: [
              "Hotel Maxim now has a coordinated digital presence, with its website, Google channels, social media and advertising working towards the same commercial objectives.",
              "Information is accurate across platforms. The booking process is clearer. Campaign performance is measured through meaningful actions, not just website traffic.",
              "Content is published consistently, with a recognisable brand voice.",
            ],
          },
        ],
        result: "Bookings increased by 20% in the first six months.",
      },
      {
        slug: "dentalnet",
        meta: { title: "DentalNet — Dental Clinic Branding & Marketing | Epic Digital Hub", description: "Branding and digital marketing for DentalNet's two clinics in Oradea. Distinct visual identities, social media, local SEO and compliant medical communication." },
        vertical: "Healthcare / Oradea",
        title: "DentalNet",
        summary:
          "Two dental clinics. Different patients, different communication needs. We developed distinct visual identities and content systems, guided by the same professional standards.",
        img: "/images/work-dental.webp",
        intro:
          "DentalNet operates two dental clinics in Oradea: one serving adults and one dedicated to children. Years of patient referrals had established its reputation, but its digital visibility had yet to reflect its standing in the local market.",
        sections: [
          {
            title: "The Challenge",
            paragraphs: [
              "DentalNet Kids was listed under an incorrect Google Business category, limiting its visibility in relevant local searches. National competitors were also advertising against the DentalNet brand name.",
              "Marketing healthcare services requires particular attention to medical accuracy, professional regulations, patient privacy and consent.",
              "For DentalNet and DentalNet Kids, we developed distinct visual and communication approaches suited to their respective audiences, while respecting the professional standards that apply to healthcare providers.",
            ],
          },
          {
            title: "Our Approach",
            paragraphs: [
              "We treated the two clinics as distinct audiences from the outset.",
              "For DentalNet Kids, we developed a reassuring, approachable communication style focused on prevention, education and the concerns of parents.",
              "For the adult clinic, we established a more restrained visual and editorial direction, with clear, clinically appropriate information.",
              "Each clinic received its own content structure and design guidelines.",
              "For DentalNet Kids, we also created an original mascot and visual identity elements used across digital content and printed materials.",
              "We rebuilt both Google Business Profiles independently, correcting categories, updating services and establishing a structured approach to patient reviews.",
              "We also developed guidelines for in-clinic photography and video production, including the documentation required for patient image consent.",
            ],
          },
          {
            title: "The Outcome",
            paragraphs: [
              "The two clinics now have distinct, consistent identities, each appropriate to its patients.",
              "Content follows established editorial, visual and professional standards rather than being developed post by post.",
              "Both Google Business Profiles are managed consistently, and DentalNet has gained visibility in local searches where it previously had limited or no presence.",
              "Two audiences. Two identities. One consistent standard of care in communication.",
            ],
          },
        ],
      },
      {
        slug: "agro-salso",
        meta: { title: "Agro Salso — Agricultural Machinery Marketing | Epic Digital Hub", description: "Website, product content, Google Ads and Meta Ads for Agro Salso. A measurable marketing system built around verified machinery specifications and quote requests." },
        vertical: "Agricultural Machinery / Romania",
        title: "Agro Salso",
        summary:
          "Advertising without reliable conversion tracking. Inconsistent product information. A website disconnected from sales. We rebuilt the marketing infrastructure around verified specifications, qualified enquiries and measurable actions.",
        img: "/images/work-agro.webp",
        intro:
          "Based in Bihor, Agro Salso supplies agricultural machinery across Romania. Its extensive product range was commercially competitive, but the website, advertising and sales materials lacked the consistency needed to support purchasing decisions.",
        sections: [
          {
            title: "The Challenge",
            paragraphs: [
              "Advertising campaigns were driving visitors to the website, but conversion tracking was insufficient. Irrelevant searches consumed budget, and genuine quote requests could not be reliably distinguished from ordinary clicks.",
              "Product information was also inconsistent. Technical specifications, prices and manufacturer references varied between pages and sales materials.",
              "For agricultural machinery buyers, those details are essential. A purchasing decision depends on accurate specifications, compatibility and price.",
            ],
          },
          {
            title: "Our Approach",
            paragraphs: [
              "We began with the advertising accounts.",
              "Search terms were reviewed, irrelevant traffic excluded and campaigns restructured around machinery categories and products with clear commercial intent.",
              "We configured conversion tracking for actual website enquiries, giving the team a more reliable way to evaluate campaign performance.",
              "Next, we rebuilt product communication around official manufacturer documentation.",
              "Specifications, compatibility, prices and availability were checked against verified sources before publication. Product benefits were expressed through technical facts, without unsupported superlatives.",
              "We extended the same standards across the machinery catalogue, price lists, trade-show materials and CRM enquiry management.",
              "The result is a consistent information base shared by marketing and sales.",
            ],
          },
          {
            title: "The Outcome",
            paragraphs: [
              "Campaigns can now be evaluated against genuine quote requests rather than clicks alone.",
              "The website and commercial materials use consistent, verified product information.",
              "Sales enquiries can be managed with clearer attribution and a more reliable product reference.",
              "Marketing and sales now work from the same facts.",
            ],
          },
        ],
      },
      {
        slug: "kgm-oradea",
        meta: { title: "KGM Oradea — Automotive Marketing Case Study | Epic Digital Hub", description: "Automotive marketing for KGM Oradea. Brand communication, social media, model launches and video content built around verified specifications and official pricing." },
        vertical: "Automotive / Oradea",
        title: "KGM Oradea",
        summary:
          "Managing the transition from SsangYong to KGM in the local market. Clear brand communication, consistent monthly content and product information sourced directly from the official importer.",
        /* The Actyon itself, cut out of the trim carousel and padded back to 4:3
           by stretching the studio backdrop's own edge rows. The shared
           automotive photo is a Chery and cannot front a KGM page, and the
           carousel as a whole is a social graphic, not a hero. */
        img: "/images/work-kgm.webp",
        intro:
          "For KGM Oradea, we developed a consistent digital communication approach built around the vehicles themselves. Distinctive visuals, clear product explanations and commercial content that gives buyers the information they need.",
        sections: [
          {
            title: "The Context",
            paragraphs: [
              "KGM's range covers different vehicle categories, engine options and equipment levels. Communicating these differences accurately is essential, particularly when customers are comparing models, features and prices.",
              "Commercial information also changes frequently. Pricing, availability and promotional conditions need to remain current across every published format.",
              "The objective was to establish a recognisable local presence while making the model range easier to understand and evaluate.",
            ],
          },
          {
            title: "What We Built",
            paragraphs: [
              "We developed a dedicated visual and editorial direction for KGM Oradea, with consistent layouts, recognisable content formats and a straightforward tone.",
              "The monthly communication plan covers model launches, range presentations, vehicle comparisons, promotional posts, carousels, stories and video.",
              "Video scripts are developed for sales consultants presenting directly to camera. Each video covers one topic, uses verified product information and runs for approximately 40 seconds.",
              "Before publication, we check pricing, powertrain specifications, equipment details and promotional terms against the latest official documentation from KGM România.",
              "This process helps the dealership maintain a consistent publishing schedule while ensuring that customers receive accurate, up-to-date information.",
            ],
          },
          {
            title: "The Outcome",
            paragraphs: [
              "KGM Oradea now has a regular publishing schedule and a cohesive visual presence across its digital channels.",
              "Vehicle information is presented by model and configuration, making it easier for prospective buyers to compare specifications, equipment and available offers.",
              "Commercial content follows current official documentation, keeping published information aligned with the dealership's offers.",
            ],
          },
        ],
      },
      {
        slug: "chery-oradea",
        meta: { title: "Chery Oradea — Automotive Marketing & Content Production | Epic Digital Hub", description: "Automotive marketing for Chery Oradea. Model launches, social media, hybrid technology videos and product-specific content based on verified specifications and official prices." },
        vertical: "Automotive / Oradea",
        title: "Chery Oradea",
        summary:
          "Introducing a new automotive brand to the local market. Model-specific content built around verified specifications, powertrains, equipment and official pricing.",
        img: "/images/work-auto.webp",
        intro:
          "Introducing Chery to the local market meant making an unfamiliar automotive brand easier to understand. We developed content that answers practical buying questions, from hybrid technology and equipment to model differences and pricing.",
        sections: [
          {
            title: "The Context",
            paragraphs: [
              "Chery entered Oradea with a range of Tiggo SUVs and limited brand recognition among local buyers.",
              "Customers needed answers to straightforward questions. What does each model offer? How do the hybrid systems work? Which features are included? What does a particular configuration cost?",
              "The Tiggo range includes four models, with different powertrains and equipment levels. Broad promotional messaging could not communicate these distinctions accurately.",
              "The priority was to build familiarity through useful, specific product information.",
            ],
          },
          {
            title: "What We Built",
            paragraphs: [
              "We created a dedicated visual and editorial direction for Chery Oradea, combining clear product presentation with an accessible, informative tone.",
              "Content is developed around exact vehicle configurations: Tiggo 4, Tiggo 7, Tiggo 8 and Tiggo 9, with the relevant petrol, hybrid or plug-in hybrid powertrains and equipment levels.",
              "The monthly publishing plan includes model launches, vehicle comparisons, promotional posts, carousels, stories and reels.",
              "Video content explains hybrid technology, vehicle features and practical differences between models without unnecessary jargon.",
              "Prices, specifications and promotional offers are checked against current official Chery România documentation before publication. Every time-sensitive offer includes a confirmed validity period.",
            ],
          },
          {
            title: "The Outcome",
            paragraphs: [
              "Chery Oradea now has a consistent digital presence that introduces the brand while giving prospective buyers practical information about its vehicles.",
              "Each piece of content addresses a specific model, feature, configuration or commercial offer.",
              "Buyers can better understand the available range, compare equipment and identify the vehicles relevant to their needs before contacting the dealership.",
            ],
          },
        ],
      },
      {
        slug: "jeep-oradea",
        meta: { title: "Jeep Oradea — Automotive Marketing Case Study | Epic Digital Hub", description: "Automotive marketing for Jeep Oradea. Dedicated brand communication, model-specific content, vehicle campaigns and video production based on official product information." },
        vertical: "Automotive / Oradea",
        title: "Jeep Oradea",
        summary:
          "Jeep has a distinctive identity built around capability, versatility and a long-standing off-road heritage. Our communication approach focuses on translating those qualities into clear, relevant information about the vehicles available to local buyers.",
        img: "/images/work-jeep.webp",
        intro:
          "Jeep has a distinctive identity built around capability, versatility and a long-standing off-road heritage. Our communication approach focuses on translating those qualities into clear, relevant information about the vehicles available to local buyers.",
        sections: [
          {
            title: "The Context",
            paragraphs: [
              "Jeep is a well-established automotive name, with strong brand recognition and clearly defined customer expectations.",
              "For prospective buyers, the important questions concern the vehicles themselves: model differences, equipment, powertrains, practical capabilities and current prices.",
              "The communication needs to preserve the brand's character while providing accurate information that supports real purchasing decisions.",
            ],
          },
          {
            title: "What We're Building",
            paragraphs: [
              "We are developing a dedicated visual and editorial approach for Jeep Oradea, aligned with the brand's identity and product positioning.",
              "The planned monthly communication includes model launches, vehicle presentations, equipment comparisons, promotional posts, social media carousels, stories and video.",
              "Each execution will focus on specific models and configurations, explaining their relevant features, capabilities and available equipment.",
              "Prices, technical specifications and promotional conditions will be checked against current official importer documentation before publication.",
              "The emphasis is on recognisable brand communication supported by accurate, useful product information.",
            ],
          },
          {
            title: "The Outcome",
            paragraphs: [
              "This section will be completed after the first content batch has been delivered. Results and completed work will be documented before publication.",
            ],
          },
        ],
      },
      {
        slug: "harmony-garden",
        meta: { title: "Harmony Garden | Event Marketing & Creative Production | Epic Digital Hub", description: "A full season of event marketing for Harmony Garden. Creative direction, event identities, video production and Hungarian-language content." },
        vertical: "Events / Bihor",
        title: "Harmony Garden",
        summary:
          "An entire event season, managed from concept to execution. Individual event identities, weekly creative production and communication tailored to the local audience.",
        img: "/images/work-events.webp",
        intro:
          "Harmony Garden is a summer club in Valea lui Mihai, near the Hungarian border, serving a predominantly Hungarian-speaking audience. With a packed seasonal calendar, every weekend needs its own reason to attend.",
        sections: [
          {
            title: "The Challenge",
            paragraphs: [
              "A summer club has little room for delays. Events follow one another quickly, leaving a narrow window to build interest and drive attendance.",
              "Harmony Garden also speaks to a predominantly Hungarian audience, including visitors from across the border. Communication needed to feel local, not like Romanian copy translated into Hungarian.",
              "Each event needed its own identity, while the season had to remain recognisably Harmony Garden.",
            ],
          },
          {
            title: "Our Approach",
            paragraphs: [
              "We developed the season's communication plan, defining event themes, content schedules and key promotional moments.",
              "Every event received a distinct visual direction, supported by flyers, posters, social media content, reels and video teasers.",
              "All primary copy was written directly in Hungarian, with attention to local language and cultural context.",
              "Our work extended beyond promotion to include raffle materials, numbered tickets, season passes and bar menus.",
            ],
          },
          {
            title: "The Outcome",
            paragraphs: [
              "Harmony Garden followed a structured communication schedule throughout the season, with dedicated promotional materials for each event.",
              "We developed individual visual identities that reflected the character of each party while maintaining a consistent connection to Harmony Garden.",
              "The creative assets and communication formats developed during the project can also be reused and adapted for future editions.",
            ],
          },
        ],
      },
      {
        slug: "origins-cafe",
        meta: { title: "Origins Coffee & Drinks | Hospitality Marketing & Loyalty | Epic Digital Hub", description: "Brand communication, local marketing and a custom digital loyalty platform for Origins Coffee & Drinks across four locations in Oradea." },
        vertical: "Hospitality / Oradea",
        title: "Origins Coffee & Drinks",
        summary:
          "Multiple locations. Different customer groups. One recognisable brand. We aligned content, local visibility and customer loyalty across the brand's physical and digital presence.",
        img: "/images/work-cafe.webp",
        intro:
          "Four locations across Oradea, each with its own audience and daily rhythm. Our role was to keep Origins recognisable everywhere, while giving each location the communication it needed.",
        sections: [
          {
            title: "The Challenge",
            paragraphs: [
              "For a coffee shop, attracting a first-time visitor is only part of the job. Giving customers a reason to return matters just as much.",
              "Origins operates across four locations with different audiences and surroundings. Each needed relevant content without fragmenting the brand.",
              "The loyalty programme also needed to be straightforward: easy for customers to use and practical for staff to manage.",
            ],
          },
          {
            title: "Our Approach",
            paragraphs: [
              "We developed a dedicated digital loyalty platform, allowing customers to access their cards directly from their phones and progress to a Gold tier.",
              "We organised Google Business Profiles and location-specific content, using original photography to represent the products, spaces and people behind Origins.",
              "Our work also covered menus, in-store materials, QR codes and campaign assets for seasonal promotions and local activations.",
              "On social media, we established a relaxed, recognisable voice, grounded in what customers can actually find and experience at each location.",
            ],
          },
          {
            title: "The Outcome",
            paragraphs: [
              "Origins now has a dedicated digital platform for managing customer loyalty.",
              "All four locations follow the same brand standards, with content and communication adapted to their individual audiences.",
              "From Google listings and social media to printed menus and in-store materials, customers encounter a consistent Origins identity.",
            ],
          },
        ],
      },
      {
        slug: "thermx",
        meta: { title: "ThermX | Product Positioning, Website & Launch | Epic Digital Hub", description: "Technical brand positioning, market research, SEO, website development and a complete product launch strategy for ThermX by Nano Revolution." },
        vertical: "Industrial / Romania",
        title: "ThermX",
        summary:
          "Bringing a technical product to market starts with getting the facts right. We established a reliable information base before developing the positioning, website and launch communication.",
        img: "/images/work-industrial.webp",
        intro:
          "ThermX is a nanoceramic thermal-insulation membrane developed by Nano Revolution. Bringing a technical product to market required more than a convincing presentation. Every claim needed a reliable source, and every audience needed information it could understand.",
        sections: [
          {
            title: "The Challenge",
            paragraphs: [
              "ThermX introduces a less familiar approach to building insulation: a spray-applied nanoceramic membrane used in millimetre-scale layers.",
              "Its potential audiences range from homeowners to architects and engineers, each with different expectations and levels of technical expertise.",
              "Product specifications were also available from multiple sources, with inconsistencies between them.",
              "Before developing the marketing, we needed to establish a reliable technical foundation. Unclear or conflicting specifications would undermine the credibility of the product itself.",
            ],
          },
          {
            title: "Our Approach",
            paragraphs: [
              "We began by consolidating the technical specifications into a single reference document, establishing a consistent source for all subsequent communication.",
              "We then developed the product positioning, technical brand dossier, market research, buyer profiles, 12-month marketing strategy and SEO strategy.",
              "A separate communication direction was created for architects and engineers, addressing their specific technical requirements.",
              "We planned and produced the product launch, including its structure, presentation, presenter script and video content.",
              "The website and launch campaigns were developed using the same technical reference, with content adapted for Facebook, Instagram and LinkedIn.",
            ],
          },
          {
            title: "The Outcome",
            paragraphs: [
              "ThermX now has a consistent technical and marketing foundation across its website, sales materials and digital communication.",
              "Product information is aligned, while messaging is adapted to the needs of homeowners and industry professionals.",
              "The launch established a clear position for ThermX, supported by a structured marketing plan for the following 12 months.",
            ],
          },
        ],
      },
    ],
  },
};

export function getCaseStudy(locale: Locale, slug: string): CaseStudy | undefined {
  return caseStudiesContent[locale].studies.find((s) => s.slug === slug);
}

/** Work samples per case — real deliverables from the client folders, shown as a gallery on the detail page. */
export type CaseGalleryItem = { src: string; alt: Record<Locale, string> };

export const caseGalleryTitle: Record<Locale, string> = {
  ro: "Din lucrările noastre",
  en: "Selected work",
};

export const caseGalleries: Record<string, CaseGalleryItem[]> = {
  "hotel-maxim": [
    {
      src: "/images/cases/hotel-maxim-1.webp",
      alt: {
        ro: "Postare Hotel Maxim — sala de conferințe, pregătită pentru întâlniri",
        en: "Hotel Maxim social post — the conference room, set for meetings",
      },
    },
    {
      src: "/images/cases/hotel-maxim-2.webp",
      alt: {
        ro: "Postare Hotel Maxim — rezervări, dormitor seara, telefon și adresă",
        en: "Hotel Maxim social post — bookings, bedroom at night, phone and address",
      },
    },
  ],
  dentalnet: [
    {
      src: "/images/cases/dentalnet-1.webp",
      alt: {
        ro: "Postare educativă DentalNet Kids — până când poate folosi suzeta, mascota clinicii",
        en: "DentalNet Kids educational post — how long the pacifier is OK, the clinic mascot",
      },
    },
    {
      src: "/images/cases/dentalnet-2.webp",
      alt: {
        ro: "Carusel DentalNet Kids — echipa clinicii, medicul ortodont explicat pentru părinți",
        en: "DentalNet Kids carousel — the clinic team, the orthodontist explained for parents",
      },
    },
  ],
  "agro-salso": [
    {
      src: "/images/cases/agro-salso-1.webp",
      alt: {
        ro: "Card de produs Agro Salso — Terradisc Greu Cadru Fix, specificații și garanție",
        en: "Agro Salso product card — Terradisc Greu fixed frame, specs and warranty",
      },
    },
    {
      src: "/images/cases/agro-salso-2.webp",
      alt: {
        ro: "Postare Agro Salso — comentarii reale de la fermieri, de pe Facebook",
        en: "Agro Salso social post — real farmer comments from Facebook",
      },
    },
  ],
  "kgm-oradea": [
    {
      src: "/images/cases/kgm-oradea-1.webp",
      alt: {
        ro: "Carusel KGM Oradea — istoria brandului, experiență în SUV-uri și 4×4",
        en: "KGM Oradea carousel — brand history, SUV and 4×4 heritage",
      },
    },
    {
      src: "/images/cases/kgm-oradea-2.webp",
      alt: {
        ro: "Carusel KGM Oradea — Actyon, echipările Style și Executiv",
        en: "KGM Oradea carousel — Actyon, Style and Executiv trims",
      },
    },
  ],
  "chery-oradea": [
    {
      src: "/images/cases/chery-oradea-1.webp",
      alt: {
        ro: "Postare Chery Oradea — gama Tiggo pe dimensiuni, lungimi și ampatamente",
        en: "Chery Oradea social post — the Tiggo range by size, lengths and wheelbases",
      },
    },
    {
      src: "/images/cases/chery-oradea-2.webp",
      alt: {
        ro: "Postare Chery Oradea — Tiggo 7 HEV, preț de listă septembrie",
        en: "Chery Oradea social post — Tiggo 7 HEV, September list price",
      },
    },
  ],
  "harmony-garden": [
    {
      src: "/images/cases/harmony-garden-1.webp",
      alt: {
        ro: "Flyer Harmony Garden — Koosz Milán, 6 iunie, alături de Acca, Chris și Peetlook",
        en: "Harmony Garden flyer — Koosz Milán, 6 June, with Acca, Chris and Peetlook",
      },
    },
    {
      src: "/images/cases/harmony-garden-2.webp",
      alt: {
        ro: "Flyer Harmony Garden — Breda Bia, 4 iulie, alături de Acca și Chris",
        en: "Harmony Garden flyer — Breda Bia, 4 July, with Acca and Chris",
      },
    },
  ],
  "origins-cafe": [
    {
      src: "/images/cases/origins-cafe-1.webp",
      alt: {
        ro: "Afiș Origins Cafe — Piadina Weekend, ofertă piadina și cafea",
        en: "Origins Cafe poster — Piadina Weekend, piadina and coffee offer",
      },
    },
    {
      src: "/images/cases/origins-cafe-2.webp",
      alt: {
        ro: "Meniul de cafea Origins — design tipografic, prețuri pe sortimente",
        en: "Origins coffee menu — typographic design, prices per drink",
      },
    },
  ],
  thermx: [
    {
      src: "/images/cases/thermx-1.webp",
      alt: {
        ro: "Postare thermX — punți termice, membrană nanoceramică aplicată prin pulverizare",
        en: "thermX social post — thermal bridges, spray-applied nanoceramic membrane",
      },
    },
    {
      src: "/images/cases/thermx-2.webp",
      alt: {
        ro: "Postare thermX — performanță termică și durabilitate, date tehnice",
        en: "thermX social post — thermal performance and durability, technical data",
      },
    },
  ],
};

/** Live site per case — screenshot card + outbound button. Only clients with a verified live site. */
export type CaseSite = {
  url: string;
  domain: string;
  shot: string;
  /** overrides caseSiteCta when the card is not a plain website link */
  cta?: Record<Locale, string>;
};

export const caseSiteCta: Record<Locale, string> = {
  ro: "Vezi site-ul",
  en: "Visit the live website",
};

export const caseSites: Record<string, CaseSite[]> = {
  "hotel-maxim": [
    {
      url: "https://www.hotel-maxim.ro",
      domain: "hotel-maxim.ro",
      shot: "/images/cases/site-hotel-maxim.webp",
    },
  ],
  // DentalNet: nu site-ul clinicii — carnetul ZEN, răsfoibil ca broșură (ca la Agro Salso)
  dentalnet: [
    {
      url: "/carnet-zen/index.html",
      domain: "Carnetul ZEN — DentalNet Kids",
      shot: "/images/cases/site-dentalnet.webp",
      cta: { ro: "Răsfoiește carnetul", en: "Flip through the booklet" },
    },
  ],
  "agro-salso": [
    {
      url: "https://agrosalso.ro",
      domain: "agrosalso.ro",
      shot: "/images/cases/site-agro-salso.webp",
    },
    {
      url: "/brosura-agro/index.html",
      domain: "Utilaje agricole și prețuri 2026",
      shot: "/images/cases/brosura-agro.webp",
      cta: { ro: "Răsfoiește catalogul", en: "Flip through the catalogue" },
    },
  ],
  // Origins: doar platforma de fidelizare (lucrarea noastră), nu site-ul de prezentare
  "origins-cafe": [
    {
      url: "https://app.originscafe.ro",
      domain: "app.originscafe.ro",
      shot: "/images/cases/site-origins-cafe.webp",
      cta: { ro: "Deschide platforma", en: "Open the Origins loyalty platform" },
    },
  ],
  thermx: [
    {
      url: "https://nanorevolution.ro",
      domain: "nanorevolution.ro",
      shot: "/images/cases/site-thermx.webp",
      cta: { ro: "Vezi site-ul", en: "Visit Nano Revolution" },
    },
  ],
};

/** Reels per case — files live in public/video/cases/. To swap or add one:
 *  drop <slug>-N.mp4 (+ <slug>-N.jpg poster) in that folder and add a row here. */
export type CaseVideo = { src: string; poster: string; title: Record<Locale, string> };

export const caseVideoTitle: Record<Locale, string> = {
  ro: "Reels & video",
  en: "Reels & video",
};

export const caseVideoSoundHint: Record<Locale, string> = {
  ro: "Clic pentru sunet",
  en: "Click for sound",
};

export const caseVideos: Record<string, CaseVideo[]> = {
  "hotel-maxim": [
    {
      src: "/videos/cases/hotel-maxim-1.mp4",
      poster: "/videos/cases/hotel-maxim-1.jpg",
      title: { ro: "Prezentare — Camere și restaurant", en: "Video tour: Rooms & Restaurant" },
    },
    {
      src: "/videos/cases/hotel-maxim-2.mp4",
      poster: "/videos/cases/hotel-maxim-2.jpg",
      title: { ro: "Reel — Bucătăria restaurantului", en: "Reel: Inside the Restaurant Kitchen" },
    },
  ],
  dentalnet: [
    {
      src: "/videos/cases/dentalnet-1.mp4",
      poster: "/videos/cases/dentalnet-1.jpg",
      title: { ro: "Prezentare video — Clinica DentalNet", en: "Video tour: Inside DentalNet" },
    },
  ],
  "agro-salso": [
    {
      src: "/videos/cases/agro-salso-1.mp4",
      poster: "/videos/cases/agro-salso-1.jpg",
      title: { ro: "Reel — Grubere în lucru", en: "Reel: Cultivators in Action" },
    },
    {
      src: "/videos/cases/agro-salso-2.mp4",
      poster: "/videos/cases/agro-salso-2.jpg",
      title: { ro: "Reel — Dexwal KBO", en: "Reel: Dexwal KBO" },
    },
  ],
  "kgm-oradea": [
    {
      src: "/videos/cases/kgm-oradea-1.mp4",
      poster: "/videos/cases/kgm-oradea-1.jpg",
      title: { ro: "Reel: KGM Rexton", en: "Reel: KGM Rexton" },
    },
  ],
  "chery-oradea": [
    {
      /* The clip is a consultant answering the "chinezească?" objection in
         the showroom, with burned-in subtitles. */
      src: "/videos/cases/chery-oradea-1.mp4",
      poster: "/videos/cases/chery-oradea-1.jpg",
      title: {
        ro: "Reel: „Chinezească?”",
        en: "Reel: Addressing the Question About Chinese Cars",
      },
    },
    {
      src: "/videos/cases/chery-oradea-2.mp4",
      poster: "/videos/cases/chery-oradea-2.jpg",
      title: { ro: "Reel: Tiggo 8 CSH", en: "Reel: Chery Tiggo 8 CSH" },
    },
  ],
  "jeep-oradea": [
    {
      /* 91 seconds, which is why this file is 14.4MB where the other reels are
         3.5-5MB: per second of footage it sits on the same ladder (720x1280,
         CRF 34 against their 30 - off-road footage, all motion and foliage,
         compresses far worse than a showroom). `preload="none"` on the card
         means none of it moves until someone taps it. */
      src: "/videos/cases/jeep-oradea-1.mp4",
      poster: "/videos/cases/jeep-oradea-1.jpg",
      title: { ro: "Reel — Jeep Compass, off-road", en: "Video: Reel — Jeep Compass off-road" },
    },
  ],
  "harmony-garden": [
    {
      src: "/videos/cases/harmony-garden-1.mp4",
      poster: "/videos/cases/harmony-garden-1.jpg",
      title: { ro: "Aftermovie — Colour Garden", en: "Video: Aftermovie — Colour Garden" },
    },
    {
      /* Replaced at the client's request with the venue reel. It carries no
         event name on screen - it runs from the bar opening to the crowd
         under the lights - so the title describes what it shows rather than
         keeping the deck's "Future Disco" label, which no longer matches the
         file. */
      src: "/videos/cases/harmony-garden-2.mp4",
      poster: "/videos/cases/harmony-garden-2.jpg",
      title: { ro: "Reel — o seară în Harmony Garden", en: "Video: Reel — a night at Harmony Garden" },
    },
  ],
  "origins-cafe": [
    {
      src: "/videos/cases/origins-cafe-1.mp4",
      poster: "/videos/cases/origins-cafe-1.jpg",
      title: { ro: "Reel — Origins Circle", en: "Reel — Origins Circle" },
    },
    {
      src: "/videos/cases/origins-cafe-2.mp4",
      poster: "/videos/cases/origins-cafe-2.jpg",
      title: { ro: "Reel — Palatul Copiilor", en: "Reel — Palatul Copiilor" },
    },
  ],
  thermx: [
    {
      src: "/videos/cases/thermx-1.mp4",
      poster: "/videos/cases/thermx-1.jpg",
      title: { ro: "Reel — Vară / Iarnă", en: "Video: Reel — Summer / Winter" },
    },
  ],
};

/** Stat tiles per case — only facts already stated in the case copy or confirmed publicly. No invented numbers. */
export type CaseStat = { value: string; label: Record<Locale, string>; source?: Record<Locale, string> };

export const caseStats: Record<string, CaseStat[]> = {
  "hotel-maxim": [
    {
      value: "+20%",
      label: { ro: "Rezervări în 6 luni", en: "Bookings in six months" },
      source: { ro: "Creștere confirmată de client", en: "client-confirmed result" },
    },
    {
      value: "4",
      label: { ro: "Canale digitale", en: "Channels managed" },
      source: { ro: "Website, social media, profil Google, Google Ads", en: "website, social media, Google Business Profile and Google Ads" },
    },
    {
      value: "100%",
      label: { ro: "din textele site-ului, rescrise", en: "of the site copy rewritten" },
      source: { ro: "după auditul tehnic al site-ului", en: "following the technical site audit" },
    },
  ],
  dentalnet: [
    {
      value: "2",
      label: { ro: "clinici, două registre separate", en: "Distinct communication systems" },
      source: { ro: "Kids și clinica generală", en: "DentalNet & DentalNet Kids" },
    },
    {
      value: "2",
      label: { ro: "profiluri Google rescrise separat", en: "Google Business Profiles" },
      source: { ro: "categorii și servicii corectate", en: "categories and services corrected" },
    },
    {
      value: "1",
      label: { ro: "mascotă și sistem vizual propriu", en: "Custom mascot" },
      source: { ro: "direcția vizuală a clinicii Kids", en: "developed for DentalNet Kids" },
    },
  ],
  "agro-salso": [
    {
      value: "100%",
      label: { ro: "cereri de ofertă măsurate", en: "quote requests measured" },
      source: { ro: "evenimente pe formularele reale din site", en: "events on the site's real forms" },
    },
    {
      value: "1",
      label: { ro: "sursă pentru prețuri și specificații", en: "source for prices and specs" },
      source: { ro: "listele oficiale ale furnizorilor", en: "the suppliers' official lists" },
    },
    {
      value: "0",
      label: { ro: "superlative rămase în copy", en: "superlatives left in the copy" },
      source: { ro: "regulă din ghidul de voce", en: "a brand-voice rule" },
    },
  ],
  "kgm-oradea": [
    {
      value: "40s",
      label: { ro: "un script, o idee, un monolog", en: "one script, one idea, spoken" },
      source: { ro: "formatul fix al scripturilor video", en: "the fixed video script format" },
    },
    {
      value: "100%",
      label: { ro: "prețuri verificate în lista importatorului", en: "prices verified against the importer list" },
      source: { ro: "lista oficială curentă, înainte de publicare", en: "the current official list, before publishing" },
    },
  ],
  "chery-oradea": [
    {
      value: "40s",
      label: { ro: "un script, o idee, un monolog", en: "one script, one idea, spoken" },
      source: { ro: "formatul fix al scripturilor video", en: "the fixed video script format" },
    },
    {
      value: "100%",
      label: { ro: "prețuri verificate în lista importatorului", en: "prices verified against the importer list" },
      source: { ro: "lista oficială curentă, înainte de publicare", en: "the current official list, before publishing" },
    },
  ],
  "harmony-garden": [
    {
      value: "0",
      label: { ro: "weekenduri sărite într-un sezon", en: "weekends skipped in a season" },
      source: { ro: "calendar săptămânal, tot sezonul", en: "a weekly calendar, all season long" },
    },
    {
      value: "HU",
      label: { ro: "scris direct în maghiară, nu tradus", en: "written directly in Hungarian, not translated" },
      source: { ro: "limba publicului, cu numele locale corecte", en: "the audience's language, correct local names" },
    },
    {
      value: "1",
      label: { ro: "lume vizuală, fiecare eveniment cu identitatea lui", en: "visual world, each event with its own identity" },
      source: { ro: "flyer, poster și teaser per eveniment", en: "flyer, poster and teaser per event" },
    },
  ],
  "origins-cafe": [
    {
      value: "4",
      label: { ro: "locații", en: "locations" },
      source: { ro: "ERA, Rogerius, Orășelul Copiilor și Palatul Copiilor.", en: "ERA, Rogerius, Orășelul and Palatul Copiilor" },
    },
    {
      value: "1",
      label: { ro: "platformă proprie de fidelizare", en: "Custom loyalty platform" },
      source: { ro: "Dezvoltată de Epic Digital Hub.", en: "Developed by Epic Digital Hub" },
    },
    {
      value: "0",
      label: { ro: "imagini de stoc în conținut", en: "stock images in the content" },
      source: { ro: "doar fotografii reale din cafenele", en: "real photos from the cafés only" },
    },
  ],
  thermx: [
    {
      value: "1",
      label: { ro: "document tehnic de referință", en: "technical reference" },
      source: { ro: "Baza tuturor informațiilor publicate.", en: "Consistent product data across all materials" },
    },
    {
      value: "4",
      label: { ro: "canale digitale", en: "communication channels" },
      source: { ro: "Website, Facebook, Instagram și LinkedIn.", en: "Website, Facebook, Instagram and LinkedIn" },
    },
    {
      value: "12",
      label: { ro: "luni", en: "month strategy" },
      source: { ro: "Strategie de marketing și direcție SEO.", en: "Marketing plan and SEO strategy" },
    },
  ],
};

/** FAQ per case — rendered on the page and lifted into FAQPage JSON-LD (GEO). */
export type CaseFaq = { q: string; a: string };

export const caseFaqTitle: Record<Locale, string> = {
  ro: "Întrebări frecvente",
  en: "Frequently Asked Questions",
};

/* Seven per study, both locales, from FAQ_CASE_STUDIES_2026-10.pdf (07.10.2026)
   — the final published set, replacing the three per study the first handoff
   carried. The last question in every set is the exclusivity one, which is the
   whole pitch and belongs at the end of the page rather than buried.

   These same strings feed the FAQPage JSON-LD in _pages/case-studies.tsx. One
   source for both, so the markup can never claim an answer the page does not
   show. */
export const caseFaqs: Record<Locale, Record<string, CaseFaq[]>> = {
  ro: {
    "hotel-maxim": [
      {
        q: "Ce servicii de marketing gestionează Epic Digital Hub pentru Hotel Maxim?",
        a: "Am reconstruit integral website-ul și gestionăm conținutul digital, SEO, social media, profilul Google Business și campaniile Google Ads. Comunicarea acoperă cazarea, restaurantul, evenimentele și serviciile corporate.",
      },
      {
        q: "Cum construiți strategia de marketing pentru un hotel din Oradea?",
        a: "Analizăm modul în care potențialii oaspeți caută și aleg un hotel, apoi organizăm comunicarea în jurul acestor comportamente. Website-ul, Google, social media și campaniile sunt coordonate pentru a crește vizibilitatea și a facilita rezervările directe.",
      },
      {
        q: "De ce este important un website bine construit pentru un hotel?",
        a: "Website-ul este principalul canal propriu prin care hotelul își prezintă camerele, serviciile și ofertele. O structură clară, informațiile actualizate și accesul simplu la rezervări pot reduce dependența de platformele externe.",
      },
      {
        q: "Ce rol are SEO în promovarea Hotel Maxim?",
        a: "Optimizarea SEO ajută website-ul să fie mai ușor de găsit pentru căutări relevante, precum cazare în Oradea sau hotel cu sală de conferințe. SEO completează prezența în Google Business Profile și campaniile Google Ads.",
      },
      {
        q: "De ce administrați și profilul Google Business al hotelului?",
        a: "Pentru că este unul dintre primele locuri în care potențialii oaspeți verifică locația, fotografiile, facilitățile și recenziile. Informațiile trebuie să fie corecte și actualizate permanent.",
      },
      {
        q: "Ce rezultate a obținut Hotel Maxim în urma colaborării?",
        a: "Hotelul a înregistrat o creștere de 20% a rezervărilor în primele șase luni, potrivit datelor confirmate de client. În aceeași perioadă, website-ul a fost reconstruit integral, iar comunicarea și campaniile au fost reorganizate.",
      },
      {
        q: "Colaborați și cu alte hoteluri din Oradea?",
        a: "Nu. Oferim exclusivitate în categoria hotelurilor din Oradea pe durata colaborării cu Hotel Maxim.",
      },
    ],
    dentalnet: [
      {
        q: "Ce servicii de marketing gestionează Epic Digital Hub pentru DentalNet?",
        a: "Gestionăm strategia de comunicare, identitatea vizuală, conținutul social media, prezentarea medicilor, materialele tipărite și optimizarea profilurilor Google pentru cele două clinici.",
      },
      {
        q: "Cum abordați marketingul unei clinici stomatologice?",
        a: "Pornim de la serviciile oferite, specializările echipei și nevoile pacienților. Construim o comunicare clară, profesionistă și adaptată publicului, respectând normele de publicitate medicală.",
      },
      {
        q: "Cum prezentați medicii unei clinici stomatologice?",
        a: "Prin fotografii și conținut care explică specializarea, experiența și activitatea fiecărui medic. Informațiile trebuie să fie utile pacienților și să reflecte corect pregătirea profesională a echipei.",
      },
      {
        q: "De ce este importantă optimizarea Google Business pentru o clinică stomatologică?",
        a: "Un profil Google configurat corect ajută pacienții să găsească serviciile, locația, programul și datele de contact ale clinicii. Categoriile relevante și informațiile actualizate contribuie la vizibilitatea locală.",
      },
      {
        q: "Ce reguli trebuie respectate în publicitatea medicală?",
        a: "Materialele trebuie să respecte legislația și normele profesionale aplicabile. Afirmațiile despre tratamente trebuie să fie corecte, iar utilizarea fotografiilor sau filmărilor cu pacienți necesită acordurile corespunzătoare.",
      },
      {
        q: "Marketingul unei clinici include și materialele utilizate în cabinet?",
        a: "Da. Comunicarea nu se limitează la mediul online. Pentru DentalNet Kids am creat inclusiv materiale vizuale și educative utilizate în clinică, păstrând aceeași identitate de brand.",
      },
      {
        q: "Colaborați și cu alte clinici stomatologice din Oradea?",
        a: "Nu. Pe durata colaborării cu DentalNet, nu preluăm proiecte pentru clinici stomatologice concurente din Oradea.",
      },
    ],
    "agro-salso": [
      {
        q: "Ce servicii de marketing gestionează Epic Digital Hub pentru Agro Salso?",
        a: "Am reconstruit integral website-ul și catalogul de produse, am reorganizat campaniile Google și Meta Ads și am configurat măsurarea conversiilor. Ne ocupăm și de conținutul tehnic, materialele comerciale și organizarea comunicării produselor.",
      },
      {
        q: "De ce a fost necesară refacerea completă a website-ului Agro Salso?",
        a: "Pentru că portofoliul extins de utilaje avea nevoie de o structură mai clară, informații tehnice consecvente și un proces simplu de solicitare a ofertelor. Noul website reunește prezentarea produselor și funcționalitățile comerciale într-o structură unitară.",
      },
      {
        q: "Cum promovați online utilajele agricole?",
        a: "Construim comunicarea în jurul specificațiilor tehnice, aplicațiilor practice și informațiilor comerciale relevante. Combinăm website-ul, Google Ads, Meta Ads și materialele de produs pentru a atrage potențiali cumpărători și a genera solicitări de ofertă.",
      },
      {
        q: "Cum prezentați produsele cu multe specificații tehnice?",
        a: "Pornim de la documentația oficială a producătorilor și selectăm informațiile importante pentru cumpărător. Organizăm specificațiile într-un format clar, fără să modificăm valorile sau sensul datelor tehnice.",
      },
      {
        q: "De unde provin specificațiile și prețurile utilajelor?",
        a: "Din documentația și listele oficiale ale producătorilor și furnizorilor. Verificăm specificațiile, compatibilitățile și informațiile comerciale înainte de publicare.",
      },
      {
        q: "Cum măsurați rezultatele campaniilor Google și Meta Ads?",
        a: "Configurăm conversii pentru acțiunile relevante din website, în special formularele de solicitare a ofertelor. Astfel, putem analiza nu doar traficul și clicurile, ci și cererile generate prin campanii.",
      },
      {
        q: "Colaborați și cu alți dealeri de utilaje agricole?",
        a: "Nu lucrăm simultan cu dealeri care concurează direct în aceeași categorie de produse și pe aceeași piață. Exclusivitatea face parte din modul nostru de colaborare.",
      },
    ],
    "kgm-oradea": [
      {
        q: "Ce servicii de marketing gestionează Epic Digital Hub pentru KGM Oradea?",
        a: "Ne ocupăm de strategia de comunicare, conținutul social media, prezentările de modele, materialele comerciale și scenariile video. Producția include postări, carusele, stories și reels, organizate într-un calendar lunar.",
      },
      {
        q: "Cum construiți comunicarea unui dealer auto?",
        a: "Pornim de la gama de modele, publicul căruia i se adresează și informațiile relevante pentru cumpărători. Fiecare material are un subiect clar și prezintă caracteristici, dotări sau avantaje care pot fi verificate.",
      },
      {
        q: "De unde provin prețurile și specificațiile publicate?",
        a: "Folosim documentația și listele oficiale KGM România. Prețurile, motorizările, echipările și ofertele sunt verificate înainte de publicare, iar promoțiile sunt comunicate împreună cu perioada de valabilitate.",
      },
      {
        q: "Cum realizați scenariile video pentru KGM Oradea?",
        a: "Scriem scenarii concise, adaptate consultanților de vânzări care prezintă modelele în fața camerei. Fiecare video explică un subiect concret, folosind informații tehnice și comerciale relevante, într-un limbaj firesc.",
      },
      {
        q: "Lucrați și cu dealeri auto concurenți din Oradea?",
        a: "Nu. Respectăm exclusivitatea comercială și nu colaborăm simultan cu dealeri care concurează direct pe aceeași piață.",
      },
    ],
    "chery-oradea": [
      {
        q: "Ce servicii de marketing gestionează Epic Digital Hub pentru Chery Oradea?",
        a: "Gestionăm strategia de comunicare, conținutul social media, prezentările de modele, materialele comerciale și scenariile video. Producția lunară include postări, carusele, stories și reels.",
      },
      {
        q: "Cum promovați o marcă auto nouă pe piața locală?",
        a: "Construim conținut care răspunde întrebărilor cumpărătorilor despre modele, prețuri, dotări și tehnologii. Explicăm informațiile esențiale într-un limbaj accesibil, fără să presupunem că publicul cunoaște deja marca.",
      },
      {
        q: "Cum verificați prețurile și specificațiile publicate?",
        a: "Folosim documentația și listele oficiale Chery România. Verificăm fiecare model, motorizare, echipare și ofertă înainte de publicare, inclusiv condițiile și perioada de valabilitate a promoțiilor.",
      },
      {
        q: "Ce înseamnă conținut construit pentru un model și o echipare exactă?",
        a: "Fiecare material prezintă o versiune concretă, de exemplu Tiggo 7 HEV în echiparea Luxury, cu dotările și caracteristicile corespunzătoare. Astfel, cumpărătorii primesc informații utile pentru comparații, fără confuzii între versiuni.",
      },
      {
        q: "Lucrați și cu dealeri auto concurenți din Oradea?",
        a: "Nu colaborăm simultan cu dealeri auto care concurează direct pe aceeași piață. Exclusivitatea comercială face parte din modul nostru de lucru.",
      },
    ],
    "harmony-garden": [
      {
        q: "Ce servicii gestionează Epic Digital Hub pentru Harmony Garden?",
        a: "Ne ocupăm de strategia de comunicare a sezonului, identitatea vizuală a evenimentelor, design grafic, texte publicitare, reels, teasere video și materiale comerciale.",
      },
      {
        q: "Cum construiți comunicarea unui eveniment?",
        a: "Pornim de la concept, public și obiective. Stabilim direcția vizuală, mesajele principale și calendarul de promovare, apoi adaptăm materialele pentru fiecare canal.",
      },
      {
        q: "De ce are fiecare eveniment o identitate vizuală proprie?",
        a: "Pentru ca publicul să recunoască imediat evenimentul și să îl diferențieze de celelalte din calendar. Identitatea individuală trebuie să rămână compatibilă cu imaginea clubului.",
      },
      {
        q: "Ce materiale realizați pentru promovarea evenimentelor?",
        a: "Afișe, flyere, materiale pentru social media, reels, teasere și conținut comercial. În funcție de eveniment, pregătim și materiale tipărite, bilete sau elemente necesare organizării.",
      },
      {
        q: "În ce limbă comunicați pentru Harmony Garden?",
        a: "În principal în maghiară, limba publicului căruia i se adresează clubul. Textele sunt redactate direct în această limbă, nu traduse literal din română.",
      },
      {
        q: "De ce este importantă adaptarea comunicării la limba publicului?",
        a: "Pentru că o formulare naturală într-o limbă poate suna artificial în alta. Adaptăm vocabularul, tonul și mesajele pentru ca publicul să le înțeleagă și să le perceapă firesc.",
      },
      {
        q: "Lucrați și cu alte cluburi concurente din aceeași zonă?",
        a: "Nu. Pe durata colaborării, nu preluăm proiecte pentru cluburi care concurează direct cu Harmony Garden pe aceeași piață.",
      },
    ],
    "origins-cafe": [
      {
        q: "Ce servicii de marketing gestionează Epic Digital Hub pentru Origins Coffee & Drinks?",
        a: "Gestionăm strategia de comunicare, conținutul social media, profilurile Google, meniurile și materialele grafice pentru locații. Am dezvoltat și platforma digitală de fidelizare a brandului.",
      },
      {
        q: "Cum funcționează programul de fidelizare Origins?",
        a: "Clienții își păstrează cardul digital pe telefon, iar interacțiunile eligibile sunt înregistrate în platformă. Programul include și un nivel Gold destinat clienților recurenți.",
      },
      {
        q: "De ce este important un program de fidelizare pentru o cafenea?",
        a: "Pentru că încurajează vizitele repetate și permite dezvoltarea unei relații directe cu clienții. Un sistem digital simplifică administrarea programului și utilizarea beneficiilor.",
      },
      {
        q: "Cum gestionați comunicarea unui brand cu mai multe locații?",
        a: "Stabilim reguli comune de identitate vizuală și ton, apoi adaptăm conținutul la produsele, publicul și particularitățile fiecărei locații. Brandul rămâne recognoscibil, fără ca toate cafenelele să comunice identic.",
      },
      {
        q: "De ce sunt importante profilurile Google pentru cafenele?",
        a: "Pentru că ajută clienții să găsească locația, programul, datele de contact și recenziile. Fiecare cafenea are nevoie de informații corecte și actualizate în profilul propriu.",
      },
      {
        q: "Marketingul unei cafenele înseamnă doar social media?",
        a: "Nu. Pentru Origins, comunicarea include social media, profiluri Google, meniuri, materiale tipărite, identitate vizuală și platforma de fidelizare. Toate contribuie la experiența clientului.",
      },
      {
        q: "Colaborați și cu alte cafenele din Oradea?",
        a: "Nu. Pe durata colaborării cu Origins Coffee & Drinks, nu preluăm proiecte pentru cafenele concurente din Oradea.",
      },
    ],
    thermx: [
      {
        q: "Ce este ThermX?",
        a: "ThermX este o membrană nanoceramică termoizolantă produsă de Nano Revolution, destinată izolării termice a clădirilor. Produsul se aplică prin pulverizare, într-un strat de ordinul milimetrilor.",
      },
      {
        q: "Cum se aplică ThermX?",
        a: "Conform documentației utilizate în proiect, ThermX se aplică prin pulverizare, formând un strat subțire de membrană nanoceramică.",
      },
      {
        q: "Pentru ce este utilizat ThermX?",
        a: "ThermX este destinat termoizolației clădirilor și este prezentat ca o soluție tehnică bazată pe o membrană nanoceramică aplicată prin pulverizare.",
      },
      {
        q: "Cum construiți strategia de marketing pentru un produs tehnic?",
        a: "Începem cu verificarea documentației și înțelegerea produsului. Analizăm piața și categoriile de cumpărători, apoi definim poziționarea, mesajele, structura website-ului și canalele de promovare.",
      },
      {
        q: "Cum verificați informațiile tehnice înainte de publicare?",
        a: "Folosim un document centralizat, construit pe baza datelor tehnice disponibile și verificate. Specificațiile și afirmațiile publicitare sunt confruntate cu această documentație înainte de a fi incluse în materiale.",
      },
      {
        q: "De ce este importantă consecvența informațiilor tehnice?",
        a: "Pentru că diferențele dintre website, broșuri și prezentările comerciale pot crea confuzie și pot afecta încrederea cumpărătorilor. Toate materialele trebuie să pornească de la aceleași specificații verificate.",
      },
      {
        q: "Ce servicii a oferit Epic Digital Hub pentru ThermX?",
        a: "Am organizat documentația tehnică de referință și am dezvoltat poziționarea brandului, cercetarea de piață, strategia de marketing pentru 12 luni, strategia SEO, website-ul și materialele de lansare, inclusiv conținutul video și comunicarea pentru social media.",
      },
    ],
  },
  en: {
    "hotel-maxim": [
      {
        q: "What marketing services does Epic Digital Hub provide for Hotel Maxim?",
        a: "We coordinate website copy, SEO, social media, Google Business Profile management and Google Ads. Our work covers accommodation, the restaurant, events, corporate bookings and guest communication.",
      },
      {
        q: "How do you develop a hotel marketing strategy in Oradea?",
        a: "We start with how guests find and evaluate accommodation. Search visibility, website experience, booking functionality and relevant offers need to work together. For Hotel Maxim, we manage these elements as a coordinated strategy.",
      },
      {
        q: "Why is SEO important for hotels?",
        a: "Hotel SEO helps potential guests find relevant accommodation, facilities and services through organic search. It supports direct bookings by making the hotel's own website easier to find when travellers are comparing options.",
      },
      {
        q: "Why is Google Business Profile important for a hotel?",
        a: "Travellers use Google Search and Maps to check locations, facilities, contact details and guest reviews. An accurate, actively managed profile helps guests make informed booking decisions.",
      },
      {
        q: "Does hotel marketing extend beyond room bookings?",
        a: "Yes. Hotel Maxim also promotes its restaurant, conference facilities, events and corporate services. Each audience requires relevant messages and offers.",
      },
      {
        q: "What measurable results has Hotel Maxim achieved?",
        a: "Hotel Maxim recorded a 20% increase in bookings during the first six months of the collaboration, as confirmed by the client.",
      },
      {
        q: "Does Epic Digital Hub work with other hotels in Oradea?",
        a: "No. We represent one brand per niche, per city. While working with Hotel Maxim, we do not accept competing hotel clients in Oradea.",
      },
    ],
    dentalnet: [
      {
        q: "What marketing services does Epic Digital Hub provide for DentalNet?",
        a: "We developed separate branding and communication systems for DentalNet and DentalNet Kids. Our work includes social media content, doctor presentations, printed materials, Google Business Profile optimisation and visual identity guidelines.",
      },
      {
        q: "What makes dental clinic marketing different?",
        a: "Medical information must be accurate, understandable and compliant with professional regulations. Effective dental marketing communicates services and expertise clearly without exaggerated claims or misleading promises.",
      },
      {
        q: "How should a dental clinic introduce its medical team?",
        a: "Through consistent profiles that explain each dentist's qualifications, specialisation and clinical role. At DentalNet, these presentations follow shared editorial and visual guidelines.",
      },
      {
        q: "Why is local SEO important for dental clinics in Oradea?",
        a: "Patients often search for dental services by treatment and location. Accurate Google Business Profiles, relevant service information and consistent business details help clinics appear in appropriate local searches.",
      },
      {
        q: "What restrictions apply to medical advertising?",
        a: "Healthcare advertising must comply with applicable legislation and professional standards. Claims must be accurate, and identifiable patient photography or video requires appropriate consent documentation.",
      },
      {
        q: "Is social media enough for a dental clinic?",
        a: "No. DentalNet's communication also includes visual identity, doctor profiles, patient information, printed materials and Google Business Profile optimisation. These elements need to remain consistent across every patient touchpoint.",
      },
      {
        q: "Does Epic Digital Hub work with other dental clinics in Oradea?",
        a: "No. DentalNet holds category exclusivity in Oradea for the duration of our collaboration.",
      },
    ],
    "agro-salso": [
      {
        q: "What marketing services does Epic Digital Hub provide for Agro Salso?",
        a: "We restructured Google Ads and Meta Ads campaigns, implemented conversion tracking and rebuilt product content using official manufacturer specifications. Our work also covers website communication, commercial materials and the enquiry-management process.",
      },
      {
        q: "How do you market agricultural machinery online?",
        a: "By connecting buyers with the technical and commercial information they need. Search campaigns, product pages, specifications and sales materials must present accurate, consistent information and make enquiries straightforward.",
      },
      {
        q: "How do you communicate complex machinery specifications?",
        a: "We work from official technical documentation, prioritising the details relevant to each buyer and communication format. Specifications are simplified for clarity, never altered for promotional effect.",
      },
      {
        q: "How do you verify agricultural machinery specifications?",
        a: "We use official manufacturer documentation to check technical characteristics, compatibility and published commercial information. Product details are verified before publication.",
      },
      {
        q: "How do Google Ads and Meta Ads support agricultural machinery sales?",
        a: "Google Ads can reach buyers actively searching for machinery and equipment. Meta Ads can introduce products to relevant audiences and generate enquiries. For Agro Salso, both platforms are managed with conversion measurement in place.",
      },
      {
        q: "Why is the website central to agricultural machinery marketing?",
        a: "Buyers need to compare equipment, review specifications and request quotations. Agro Salso's website connects product information with advertising, commercial materials and the sales enquiry process.",
      },
      {
        q: "Does Epic Digital Hub work with competing agricultural machinery dealers?",
        a: "No. We do not represent direct competitors within the same market during an active collaboration.",
      },
    ],
    "kgm-oradea": [
      {
        q: "What marketing services does Epic Digital Hub provide for KGM Oradea?",
        a: "We develop the dealership's monthly digital communication, including model launches, social media content, promotional campaigns, vehicle presentations, carousels, stories and video scripts.",
      },
      {
        q: "How do you approach automotive marketing for KGM Oradea?",
        a: "We focus on the information buyers need when comparing vehicles: specifications, equipment, performance, pricing and available offers. This information is presented through consistent visual formats and clear, model-specific messaging.",
      },
      {
        q: "How do you verify vehicle prices and specifications?",
        a: "We use current official KGM România documentation. Prices, powertrains, equipment and promotional conditions are checked before publication, with confirmed validity dates for time-sensitive offers.",
      },
      {
        q: "How are KGM Oradea's videos developed?",
        a: "Each video focuses on one model, feature or buying question. Scripts are written for dealership sales consultants, using straightforward language and verified information, with approximately 40 seconds of spoken content.",
      },
      {
        q: "Does Epic Digital Hub work with competing dealerships in Oradea?",
        a: "No. We do not represent direct competitors within the same local market during an active collaboration.",
      },
    ],
    "chery-oradea": [
      {
        q: "What marketing services does Epic Digital Hub provide for Chery Oradea?",
        a: "We develop monthly digital content for Chery Oradea, including model launches, social media campaigns, vehicle comparisons, promotional posts, stories and reels. Every execution is based on verified information for the featured model and configuration.",
      },
      {
        q: "How do you introduce a new automotive brand to the market?",
        a: "We begin with the questions potential buyers are asking. Brand background, vehicle specifications, hybrid technology, equipment and pricing are explained through accessible, product-specific content.",
      },
      {
        q: "Where do Chery Oradea's published prices and offers come from?",
        a: "All prices and promotional conditions are verified against current official Chery România documentation. Technical specifications are checked for the exact model, powertrain and trim featured.",
      },
      {
        q: "Why do you develop content for individual models and trim levels?",
        a: "Because equipment, performance and prices differ between configurations. Presenting the exact version, such as a Tiggo 7 HEV Luxury, allows buyers to evaluate the features and pricing relevant to their purchase.",
      },
      {
        q: "Does Epic Digital Hub work with competing dealerships in Oradea?",
        a: "No. We maintain category exclusivity and do not work with direct competitors in the same local market during an active engagement.",
      },
    ],
    "harmony-garden": [
      {
        q: "What does Epic Digital Hub manage for Harmony Garden?",
        a: "We manage the season's marketing communication, from campaign planning and event identities to graphic design, social media content, reels, video teasers and promotional materials.",
      },
      {
        q: "How do you develop a marketing campaign for an event?",
        a: "We start with the event concept, target audience and commercial objective. From there, we develop the visual identity, messaging and promotional assets needed for the campaign.",
      },
      {
        q: "Why does each event need its own visual identity?",
        a: "A distinct identity helps audiences recognise individual events and understand what makes each one different, while maintaining a clear connection to the venue.",
      },
      {
        q: "What content do you produce for event promotion?",
        a: "For Harmony Garden, we produce posters, flyers, social media graphics, reels, video teasers and supporting promotional materials, coordinated around the event calendar.",
      },
      {
        q: "What language is Harmony Garden's content written in?",
        a: "Primarily Hungarian. We write the copy directly for its local and cross-border audience rather than translating Romanian content word for word.",
      },
      {
        q: "Why is locally written copy better than direct translation?",
        a: "Because language carries cultural context. Natural phrasing, familiar expressions and the right tone make communication more relevant to the people it addresses.",
      },
      {
        q: "Does Epic Digital Hub work with competing clubs in the same area?",
        a: "No. We work with one brand per niche, per city. We don't take on direct local competitors while an existing partnership is active.",
      },
    ],
    "origins-cafe": [
      {
        q: "What marketing services does Epic Digital Hub provide for Origins Coffee & Drinks?",
        a: "We developed the digital loyalty platform and manage key areas of the brand's communication, including social media, Google Business Profiles, menus, photography and in-store marketing materials.",
      },
      {
        q: "How does the Origins digital loyalty programme work?",
        a: "Customers keep their loyalty cards on their phones. Eligible visits are recorded digitally, and returning customers can progress to the Gold tier.",
      },
      {
        q: "Why is a loyalty programme important for coffee shops?",
        a: "Coffee shops depend heavily on repeat visits. A digital loyalty programme makes returning customers easier to recognise and gives the business a structured way to manage rewards.",
      },
      {
        q: "Why are Google Business Profiles important for multi-location cafés?",
        a: "Each location needs accurate information, relevant photography and a clear local presence. Well-maintained profiles help customers find the right café and understand what to expect before visiting.",
      },
      {
        q: "Is social media enough to market a coffee shop?",
        a: "No. Social media is one part of the customer experience. For Origins, we also work on local search visibility, loyalty, menus, photography and communication inside the cafés.",
      },
      {
        q: "How do you maintain brand consistency across several locations?",
        a: "We establish shared standards for visual identity, copy and photography, then adapt the content to the products, audience and context of each location.",
      },
      {
        q: "Does Epic Digital Hub work with other coffee shops in Oradea?",
        a: "No. Origins is our exclusive coffee shop partner in Oradea. We don't work with competing brands in the same local market.",
      },
    ],
    thermx: [
      {
        q: "What is ThermX?",
        a: "ThermX is a nanoceramic thermal-insulation membrane produced by Nano Revolution. It is designed for building insulation and applied by spraying in a millimetre-scale layer.",
      },
      {
        q: "How is ThermX applied?",
        a: "ThermX is spray-applied to building surfaces in a thin, millimetre-scale layer, according to the product's technical specifications.",
      },
      {
        q: "What is ThermX used for?",
        a: "ThermX is intended for the thermal insulation of buildings. Its positioning centres on nanoceramic membrane technology and its specific application method.",
      },
      {
        q: "How do you market a highly technical product?",
        a: "We start by establishing accurate product information, identifying the audiences and understanding their buying criteria. We then develop the positioning, website, SEO content and campaigns around that foundation.",
      },
      {
        q: "How do you verify technical claims before publishing them?",
        a: "For ThermX, we consolidated the product specifications into a documented technical reference. Claims are checked against that source before being used in marketing or sales materials.",
      },
      {
        q: "Why is a single technical reference important?",
        a: "It prevents conflicting specifications from appearing across the website, sales presentations and advertising. Customers and industry professionals receive consistent information, regardless of where they encounter the product.",
      },
      {
        q: "What did Epic Digital Hub deliver for ThermX?",
        a: "We developed the technical reference document, product positioning, brand dossier, market research, buyer profiles, 12-month marketing strategy, SEO strategy, website and product launch, including presentations, scripts, video and campaign content.",
      },
    ],
  },
};
