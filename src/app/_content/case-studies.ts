import type { Locale } from "../content";

export type CaseSection = {
  title: string;
  paragraphs: string[];
};

export type CaseStudy = {
  slug: string;
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
};

export type CaseStudiesContent = {
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
  "kgm-chery-oradea",
  "harmony-garden",
  "origins-cafe",
  "thermx",
] as const;

export const caseStudiesContent: Record<Locale, CaseStudiesContent> = {
  ro: {
    kicker: "Studii de caz",
    title: "Ce am construit și ce s-a schimbat.",
    intro:
      "Lucrăm cu un singur brand pe nișă, pe oraș. Acestea sunt șapte dintre brandurile cu care construim.",
    note: "Exclusivitatea funcționează în ambele direcții. Cât lucrăm cu un brand, nu lucrăm cu concurenții lui direcți.",
    detailKicker: "Studiu de caz",
    backLabel: "Toate studiile de caz",
    ctaTitle: "Dacă piața ta mai are loc pentru un brand care să conducă, avem ce discuta.",
    ctaApply: "Verifică dacă nișa ta e liberă",
    ctaAudit: "Începe cu un audit",
    studies: [
      {
        slug: "hotel-maxim",
        vertical: "Ospitalitate / Oradea",
        title: "Hotel Maxim",
        summary:
          "Un hotel cu reputație bună, dar cu o prezență digitală care nu o reflecta. Am reconstruit canalul direct: website, conținut, Google și campanii orientate spre rezervări.",
        img: "/images/work-hotel.webp",
        intro:
          "Hotel Maxim este un hotel de familie situat la câteva minute de centrul istoric al Oradiei. Experiența oaspeților și recomandările construiseră deja reputația hotelului. Online, însă, brandul nu era reprezentat la același nivel.",
        sections: [
          {
            title: "Contextul",
            paragraphs: [
              "O mare parte dintre rezervări veneau prin platforme externe, cu un cost asociat fiecărei rezervări.",
              "În același timp, prezența digitală era fragmentată. Canalele de social media nu erau active, site-ul conținea linkuri nefuncționale, inclusiv în zona de rezervare, iar anumite informații despre facilități și datele de contact nu mai erau actuale.",
              "Problema nu era lipsa unui produs bun. Era lipsa unui sistem digital care să îl susțină.",
            ],
          },
          {
            title: "Ce am construit",
            paragraphs: [
              "Am început cu poziționarea și regulile de comunicare ale brandului: cum vorbește Hotel Maxim, ce promite și cum trebuie să arate aceeași experiență în fiecare punct de contact.",
              "Am rescris conținutul site-ului și am corectat informațiile neactualizate. În paralel, auditul tehnic a identificat paginile și funcționalitățile care necesitau intervenție, cu recomandări clare pentru dezvoltator.",
              "Facebook și Instagram au fost reconstruite în jurul fotografiilor reale ale hotelului, printr-un sistem constant de postări, carusele și stories. Profilul Google a fost integrat în același sistem, împreună cu reguli clare pentru răspunsurile la recenzii.",
              "Campaniile Google au fost reorganizate în jurul intențiilor reale de căutare: brand, cazare în Oradea, săli de conferințe și cerere provenită din Ungaria.",
              "Pentru segmentul corporate și de evenimente am construit pagini dedicate și o direcție separată de comunicare către companii de training și agenții de turism.",
            ],
          },
          {
            title: "Ce s-a schimbat",
            paragraphs: [
              "Hotel Maxim are acum un canal direct coerent, în care site-ul, Google, social media și campaniile funcționează ca un singur sistem.",
              "Datele importante sunt consecvente în toate punctele de contact, rezervarea funcționează corect, iar campaniile pot fi evaluate prin acțiuni măsurabile, nu doar prin trafic.",
              "Conținutul este planificat și publicat constant, în aceeași voce de brand.",
            ],
          },
        ],
        result: "+20% rezervări în 6 luni.",
      },
      {
        slug: "dentalnet",
        vertical: "Medical / Oradea",
        title: "DentalNet",
        summary:
          "Două clinici. Două categorii de pacienți. Două sisteme de comunicare construite separat, sub același standard de brand.",
        img: "/images/work-dental.webp",
        intro:
          "DentalNet are două clinici în Oradea: una dedicată adulților și una copiilor. Reputația fusese construită în timp prin recomandări, însă vizibilitatea digitală nu reflecta poziția clinicilor în piață.",
        sections: [
          {
            title: "Contextul",
            paragraphs: [
              "Profilul Google al clinicii pentru copii era încadrat într-o categorie greșită, iar brandul avea vizibilitate redusă pe căutările locale relevante. În același timp, competitori naționali licitau în Google Ads inclusiv pe numele clinicii.",
              "Comunicarea medicală adăuga un al doilea nivel de complexitate: reguli stricte privind afirmațiile publicitare, utilizarea imaginilor pacienților și modul în care serviciile medicale pot fi prezentate.",
              "Sistemul trebuia să fie eficient fără să compromită rigoarea profesională.",
            ],
          },
          {
            title: "Ce am construit",
            paragraphs: [
              "Am separat comunicarea celor două clinici încă de la nivel de strategie.",
              "Pentru clinica pediatrică am construit un registru bazat pe calm, prevenție și comunicare adresată părinților. Pentru clinica destinată adulților, un registru mai sobru și mai clinic.",
              "Fiecare are propriile reguli vizuale și propriul sistem de conținut.",
              "Pentru clinica de copii am dezvoltat inclusiv o mascotă și o direcție vizuală distinctă, aplicate în social media și în materialele utilizate direct în cabinet.",
              "Profilurile Google au fost restructurate individual, cu categorii corecte, servicii complete și un sistem pentru dezvoltarea recenziilor.",
              "Am construit și cadrul necesar pentru producția foto-video în clinică, inclusiv documentația privind acordul de imagine al pacientului.",
            ],
          },
          {
            title: "Ce s-a schimbat",
            paragraphs: [
              "Cele două clinici comunică acum distinct, dar coerent.",
              "Conținutul nu mai este construit de la o postare la alta, ci pornește dintr-un sistem clar de brand, cu reguli de voce, design și conformitate.",
              "Profilurile Google sunt administrate constant, iar brandul este prezent pe căutări locale unde anterior avea vizibilitate redusă sau inexistentă.",
            ],
          },
        ],
      },
      {
        slug: "agro-salso",
        vertical: "Agro / România",
        title: "Agro Salso",
        summary:
          "Campanii fără măsurare, informații comerciale neuniforme și un site care nu susținea procesul de vânzare. Am reconstruit sistemul în jurul datelor verificabile și al cererilor reale de ofertă.",
        img: "/images/work-agro.webp",
        intro:
          "Agro Salso este un dealer de utilaje agricole din Bihor, cu livrare la nivel național și un portofoliu tehnic extins. Produsul era competitiv. Sistemul digital din jurul lui avea nevoie de restructurare.",
        sections: [
          {
            title: "Contextul",
            paragraphs: [
              "Campaniile plătite generau trafic, dar nu exista o măsurare clară a conversiilor. Bugetul ajungea inclusiv în căutări nerelevante, iar diferența dintre un clic și o cerere reală de ofertă nu putea fi urmărită corect.",
              "În paralel, informațiile din site nu erau complet uniforme: specificații, prețuri și chiar anumite asocieri de brand difereau între pagini.",
              "Într-o categorie în care decizia de cumpărare se bazează pe date tehnice, consistența informației este esențială.",
            ],
          },
          {
            title: "Ce am construit",
            paragraphs: [
              "Am început cu restructurarea campaniilor.",
              "Am analizat termenii reali de căutare, am eliminat traficul nerelevant și am reconstruit campaniile în jurul produselor și categoriilor cu intenție comercială.",
              "Conversiile au fost configurate pe acțiunile relevante din site, astfel încât performanța să fie evaluată în cereri de ofertă, nu doar în clicuri.",
              "Paginile de produs au fost reconstruite după o regulă simplă: fiecare beneficiu trebuie să aibă în spate o specificație tehnică verificabilă.",
              "Caracteristicile, compatibilitatea, prețurile și disponibilitatea pornesc din documentația oficială a producătorilor.",
              "În același sistem au intrat catalogul, lista de prețuri, materialele pentru târguri și CRM-ul utilizat pentru gestionarea cererilor.",
            ],
          },
          {
            title: "Ce s-a schimbat",
            paragraphs: [
              "Campaniile pot fi evaluate acum prin cereri reale de ofertă.",
              "Informațiile comerciale sunt aliniate între website și materialele de vânzare, iar fiecare produs pornește din aceeași sursă tehnică verificată.",
              "Marketingul și procesul comercial folosesc acum aceeași bază de informație.",
            ],
          },
        ],
      },
      {
        slug: "kgm-chery-oradea",
        vertical: "Auto / Oradea",
        title: "KGM & Chery Oradea",
        summary:
          "Două mărci reprezentate de același dealer. Două sisteme de comunicare complet distincte, construite pe informația oficială a importatorilor.",
        img: "/images/work-auto.webp",
        intro:
          "KGM și Chery sunt două mărci internaționale aflate în etape diferite de dezvoltare pe piața din România. Sunt comercializate prin aceeași structură locală, dar au produse, poziționări și publicuri diferite. Rolul nostru este ca diferența dintre ele să rămână evidentă în fiecare punct de comunicare.",
        sections: [
          {
            title: "Contextul",
            paragraphs: [
              "KGM traversa tranziția de la SsangYong către noua identitate de brand, în timp ce Chery intra într-o piață locală în care notorietatea era încă în construcție.",
              "În automotive, comunicarea are o dificultate suplimentară: prețurile, echipările și promoțiile se actualizează frecvent.",
              "În același timp, două mărci administrate din aceeași structură comercială pot ajunge ușor să comunice identic.",
              "Asta am vrut să evităm.",
            ],
          },
          {
            title: "Ce am construit",
            paragraphs: [
              "Am definit două identități de comunicare distincte, fiecare cu propriul registru vizual, propriile formate și propria structură de conținut.",
              "Pentru fiecare marcă există un sistem lunar care acoperă lansări de modele, carusele de gamă, conținut comercial, stories și video.",
              "Regula este strictă: nicio cifră nu pleacă din memorie.",
              "Prețurile, motorizările, dotările și condițiile promoționale sunt verificate în documentația oficială actuală înainte de publicare.",
              "Scripturile video sunt construite pentru un consultant de vânzări, nu pentru un creator de entertainment: o idee clară, informație relevantă și aproximativ 40 de secunde de discurs.",
              "Pentru KGM am construit și comunicarea tranziției de brand, inclusiv explicațiile referitoare la noua identitate și continuitatea produselor și garanțiilor.",
            ],
          },
          {
            title: "Ce s-a schimbat",
            paragraphs: [
              "Ambele mărci comunică acum constant, fără să își piardă identitatea individuală.",
              "Chiar dacă sunt reprezentate de aceeași companie locală, diferențele dintre KGM și Chery se păstrează în imagine, voce și structură de conținut.",
              "Iar informația comercială este actualizată direct din sursele oficiale ale fiecărei mărci.",
            ],
          },
        ],
      },
      {
        slug: "harmony-garden",
        vertical: "Evenimente / Bihor",
        title: "Harmony Garden",
        summary:
          "Un sezon întreg de evenimente construit ca un singur sistem: identități distincte, producție săptămânală și comunicare scrisă direct pentru publicul local.",
        img: "/images/work-events.webp",
        intro:
          "Harmony Garden este un club de vară din Valea lui Mihai, aproape de granița cu Ungaria, adresat unui public predominant maghiar. Într-un business sezonier, fiecare weekend contează.",
        sections: [
          {
            title: "Contextul",
            paragraphs: [
              "Calendarul unui club de vară este comprimat. Evenimentele se succed rapid, iar fiecare are nevoie de propria campanie într-un interval foarte scurt.",
              "În același timp, publicul este local și transfrontalier, iar limba principală de comunicare este maghiara.",
              "O traducere literală din română nu era suficientă. Comunicarea trebuia scrisă direct pentru publicul care urma să o citească.",
            ],
          },
          {
            title: "Ce am construit",
            paragraphs: [
              "Am început cu masterplanul sezonului: ritm editorial, teme și momentele principale de comunicare.",
              "Fiecare eveniment a primit propria identitate vizuală în interiorul sistemului Harmony Garden: flyer, poster, video teaser și formate pentru social media.",
              "Textele sunt construite direct în maghiară, nu traduse ulterior.",
              "Pe lângă promovare, am dezvoltat și o serie de elemente operaționale și comerciale ale sezonului: materiale pentru tombolă, bilete numerotate, abonamente și meniul barului.",
            ],
          },
          {
            title: "Ce s-a schimbat",
            paragraphs: [
              "Harmony Garden a avut o prezență constantă pe durata sezonului, iar fiecare eveniment a intrat în calendar cu propriul set de materiale.",
              "Sistemul este reutilizabil: formatele care funcționează rămân, cele care nu performează sunt eliminate, iar sezonul următor pornește de la o bază deja construită.",
            ],
          },
        ],
      },
      {
        slug: "origins-cafe",
        vertical: "HoReCa / Oradea",
        title: "Origins Coffee & Drinks",
        summary:
          "Mai multe locații, publicuri diferite și un singur sistem de brand. Am conectat conținutul, prezența locală și fidelizarea într-o experiență coerentă.",
        img: "/images/work-cafe.webp",
        intro:
          "Origins Coffee & Drinks are mai multe locații în Oradea, fiecare cu propriul context și propriul profil de client. Comunicarea trebuia să păstreze aceeași identitate, fără să transforme locațiile în copii una după alta.",
        sections: [
          {
            title: "Contextul",
            paragraphs: [
              "În HoReCa, frecvența contează la fel de mult ca prima vizită.",
              "Cu mai multe locații și categorii diferite de clienți, comunicarea generică nu era suficientă. Fiecare mesaj trebuia să pornească de la un produs, o locație sau un moment real.",
              "În paralel, programul de fidelizare avea nevoie de o experiență simplă atât pentru client, cât și pentru echipa din locație.",
            ],
          },
          {
            title: "Ce am construit",
            paragraphs: [
              "Am dezvoltat platforma de fidelizare, cu carduri digitale accesibile direct din telefon și un nivel Gold pentru clienții recurenți.",
              "Pentru fiecare locație am structurat profilurile Google, conținutul și fotografia în jurul contextului local.",
              "Am construit meniuri, materiale de bar, QR-uri și materiale pentru campanii sezoniere și activări locale.",
              "Social media urmează aceeași regulă: conținut relaxat și recognoscibil, dar construit întotdeauna în jurul unui produs sau unei experiențe care există efectiv în locație.",
            ],
          },
          {
            title: "Ce s-a schimbat",
            paragraphs: [
              "Fidelizarea poate fi urmărită și administrată digital.",
              "În același timp, fiecare locație poate comunica pentru publicul ei fără să iasă din identitatea Origins.",
              "Aceleași reguli de brand. Aceeași calitate vizuală. Conținut adaptat fiecărei locații.",
            ],
          },
        ],
      },
      {
        slug: "thermx",
        vertical: "Industrial / România",
        title: "ThermX",
        summary:
          "Un produs tehnic nou are nevoie, înainte de promovare, de o singură versiune corectă a adevărului. Am construit-o, apoi am dezvoltat în jurul ei poziționarea, website-ul și lansarea.",
        img: "/images/work-industrial.webp",
        intro:
          "ThermX este o membrană nanoceramică pentru termoizolație, adresată unei piețe în care încrederea depinde direct de claritatea informației tehnice. Înainte de comunicare, datele trebuiau standardizate.",
        sections: [
          {
            title: "Contextul",
            paragraphs: [
              "Produsul introduce o categorie mai puțin familiară pieței locale: termoizolație aplicată prin pulverizare, în straturi de ordinul milimetrilor.",
              "Publicul este eterogen, de la proprietari de locuințe până la arhitecți și proiectanți, iar nivelul de informație necesar diferă semnificativ.",
              "În plus, datele tehnice existente circulau în mai multe variante și din surse diferite.",
              "Pentru un produs tehnic, o singură neconcordanță poate compromite credibilitatea întregii comunicări.",
            ],
          },
          {
            title: "Ce am construit",
            paragraphs: [
              "Am început prin consolidarea tuturor parametrilor tehnici într-un singur document de referință.",
              "Fiecare cifră utilizată ulterior în comunicare pornește din această sursă.",
              "Pe această bază am construit poziționarea, dosarul tehnic de brand, strategia de marketing pentru 12 luni, strategia SEO, cercetarea de piață și profilurile principalelor categorii de cumpărători.",
              "Am dezvoltat separat și direcția adresată arhitecților și proiectanților.",
              "Lansarea a fost construită integral: structură, prezentare, script și video.",
              "Conținutul a fost adaptat pentru patru canale, de la comunicare educațională B2C până la conținut B2B pe LinkedIn, iar website-ul pornește din aceeași bază tehnică.",
            ],
          },
          {
            title: "Ce s-a schimbat",
            paragraphs: [
              "ThermX comunică acum aceeași informație în fiecare punct de contact.",
              "Datele prezentate de echipa comercială, cele publicate pe website și cele utilizate în conținut provin din aceeași sursă verificată.",
              "Poziționarea, materialele de lansare și comunicarea digitală funcționează ca un singur sistem.",
            ],
          },
        ],
      },
    ],
  },
  en: {
    kicker: "Case studies",
    title: "What we built and what changed.",
    intro:
      "We work with one brand per niche, per city. These are seven of the brands we build with.",
    note: "Exclusivity works both ways. While we work with a brand, we do not work with its direct competitors.",
    detailKicker: "Case study",
    backLabel: "All case studies",
    ctaTitle: "If your market still has room for a brand to lead, we should talk.",
    ctaApply: "Check if your niche is open",
    ctaAudit: "Start with an audit",
    studies: [
      {
        slug: "hotel-maxim",
        vertical: "Hospitality / Oradea",
        title: "Hotel Maxim",
        summary:
          "A strong hotel with an online presence that did not reflect the guest experience. We rebuilt the direct channel: website, content, Google and campaigns designed around bookings.",
        img: "/images/work-hotel.webp",
        intro:
          "Hotel Maxim is a family-run hotel a short walk from Oradea's historic centre. Guest experience and word of mouth had already built a strong reputation. Online, the brand did not reflect it.",
        sections: [
          {
            title: "The context",
            paragraphs: [
              "A large share of bookings came through third-party platforms, with a cost attached to every reservation.",
              "At the same time, the digital presence was fragmented. Social channels were inactive, the website contained broken links, including in the booking journey, and some facility and contact information was outdated.",
              "The issue was not the product. It was the lack of a direct digital system around it.",
            ],
          },
          {
            title: "What we built",
            paragraphs: [
              "We started with positioning and voice rules: how Hotel Maxim speaks, what it promises and how that standard should carry across every touchpoint.",
              "We rewrote the website and corrected outdated information. In parallel, a technical audit identified broken pages and functions, with clear implementation notes for the developer.",
              "Facebook and Instagram were rebuilt around the hotel's real photography, using a repeatable system of posts, carousels and stories. The Google Business Profile was brought into the same system, together with clear rules for review responses.",
              "Google campaigns were restructured around real search intent: brand searches, accommodation in Oradea, conference rooms and demand coming from Hungary.",
              "For the corporate and events segment, we built dedicated landing pages and a separate outreach direction for training companies and travel agencies.",
            ],
          },
          {
            title: "What changed",
            paragraphs: [
              "Hotel Maxim now has a coherent direct channel in which the website, Google, social media and paid campaigns work as one system.",
              "Key information is consistent across touchpoints, the booking journey works as intended and campaigns can be judged on measurable actions rather than traffic alone.",
              "Content is planned and published consistently, in one brand voice.",
            ],
          },
        ],
        result: "+20% bookings in 6 months.",
      },
      {
        slug: "dentalnet",
        vertical: "Medical / Oradea",
        title: "DentalNet",
        summary:
          "Two clinics. Two patient groups. Two communication systems built separately, under one brand standard.",
        img: "/images/work-dental.webp",
        intro:
          "DentalNet operates two clinics in Oradea: one for adults and one for children. Its reputation had been built over years through referrals, but its digital visibility did not reflect its position in the local market.",
        sections: [
          {
            title: "The context",
            paragraphs: [
              "The children's clinic was listed under the wrong Google category, and the brand had limited visibility for relevant local searches. At the same time, national competitors were bidding on the clinic's own name in Google Ads.",
              "Medical communication added another layer of complexity: strict rules around advertising claims, patient imagery and the way services can be presented.",
              "The system had to perform without compromising professional or legal standards.",
            ],
          },
          {
            title: "What we built",
            paragraphs: [
              "We separated the two clinics at strategy level from the start.",
              "For the paediatric clinic, we built a communication register based on calm, prevention and parent-focused information. For the adult clinic, the tone is more restrained and clinical.",
              "Each clinic has its own visual rules and its own content system.",
              "For the children's clinic, we also developed a mascot and a distinct visual direction used across social media and in-clinic materials.",
              "The Google profiles were rebuilt individually, with correct categories, complete services and a structured review plan.",
              "We also created the framework for photo and video production inside the clinics, including patient image-consent documentation.",
            ],
          },
          {
            title: "What changed",
            paragraphs: [
              "The two clinics now communicate differently, but coherently.",
              "Content no longer starts from an isolated post. It starts from a defined brand system with rules for voice, design and compliance.",
              "The Google profiles are managed consistently, and the brand is now visible for local searches where it previously had little or no presence.",
            ],
          },
        ],
      },
      {
        slug: "agro-salso",
        vertical: "Agro / Romania",
        title: "Agro Salso",
        summary:
          "Unmeasured campaigns, inconsistent commercial information and a website that did not support the sales process. We rebuilt the system around verified data and real quote requests.",
        img: "/images/work-agro.webp",
        intro:
          "Agro Salso is an agricultural machinery dealer based in Bihor, delivering nationwide with an extensive technical portfolio. The product was competitive. The digital system around it needed restructuring.",
        sections: [
          {
            title: "The context",
            paragraphs: [
              "Paid campaigns were generating traffic, but conversion measurement was unclear. Budget was reaching irrelevant searches, and the difference between a click and a genuine quote request could not be tracked properly.",
              "At the same time, information across the website was inconsistent: specifications, prices and even some brand associations varied from page to page.",
              "In a category where purchase decisions rely on technical data, consistency is part of credibility.",
            ],
          },
          {
            title: "What we built",
            paragraphs: [
              "We started by restructuring the campaigns.",
              "We analysed real search terms, removed irrelevant traffic and rebuilt the account around products and categories with commercial intent.",
              "Conversions were configured around the actions that matter on the website, so performance could be judged on quote requests rather than clicks alone.",
              "Product pages were rebuilt around one rule: every benefit must be backed by a verifiable technical specification.",
              "Features, compatibility, pricing and availability are taken from official manufacturer documentation.",
              "The same system now covers the catalogue, price materials, trade-fair assets and the CRM used to manage enquiries.",
            ],
          },
          {
            title: "What changed",
            paragraphs: [
              "Campaigns can now be evaluated through real quote requests.",
              "Commercial information is aligned across the website and sales materials, and every product starts from the same verified technical source.",
              "Marketing and sales now work from the same information base.",
            ],
          },
        ],
      },
      {
        slug: "kgm-chery-oradea",
        vertical: "Automotive / Oradea",
        title: "KGM & Chery Oradea",
        summary:
          "Two brands represented by the same dealer. Two completely separate communication systems, built on official importer information.",
        img: "/images/work-auto.webp",
        intro:
          "KGM and Chery are two international automotive brands at different stages of development in the Romanian market. They are represented through the same local business, but they have different products, positioning and audiences. Our job is to keep that distinction clear in every piece of communication.",
        sections: [
          {
            title: "The context",
            paragraphs: [
              "KGM was moving from SsangYong into its new brand identity, while Chery was entering a local market where awareness was still being built.",
              "Automotive communication adds another constraint: prices, equipment and promotional terms change frequently.",
              "At the same time, two brands managed by the same local operation can easily begin to look and sound alike.",
              "That is exactly what the system was designed to prevent.",
            ],
          },
          {
            title: "What we built",
            paragraphs: [
              "We defined two distinct communication identities, each with its own visual register, formats and content structure.",
              "Each brand runs on a monthly content system covering model launches, range carousels, commercial posts, stories and video.",
              "The rule is strict: no figure comes from memory.",
              "Prices, powertrains, equipment and promotional conditions are checked against current official documentation before publication.",
              "Video scripts are written for a sales consultant, not an entertainer: one clear idea, relevant information and around 40 seconds of spoken delivery.",
              "For KGM, we also built the communication around the brand transition, including clear explanations of the new identity and continuity of products and warranties.",
            ],
          },
          {
            title: "What changed",
            paragraphs: [
              "Both brands now communicate consistently without losing their individual identities.",
              "Even though they are represented by the same local company, KGM and Chery remain distinct in visual language, tone and content structure.",
              "Commercial information is updated directly from each brand's official sources.",
            ],
          },
        ],
      },
      {
        slug: "harmony-garden",
        vertical: "Events / Bihor",
        title: "Harmony Garden",
        summary:
          "A full event season built as one system: distinct identities, weekly production and copy written directly for the local audience.",
        img: "/images/work-events.webp",
        intro:
          "Harmony Garden is a summer club in Valea lui Mihai, near the Hungarian border, with a predominantly Hungarian-speaking audience. In a seasonal business, every weekend matters.",
        sections: [
          {
            title: "The context",
            paragraphs: [
              "A summer club works on a compressed calendar. Events follow one another quickly, and each needs its own campaign within a very short window.",
              "At the same time, the audience is local and cross-border, and Hungarian is the main language of communication.",
              "Literal translation from Romanian was not enough. The content had to be written for the audience that would actually read it.",
            ],
          },
          {
            title: "What we built",
            paragraphs: [
              "We started with the season masterplan: editorial rhythm, themes and the key communication moments across the calendar.",
              "Each event received its own visual identity within the Harmony Garden system: flyer, poster, video teaser and social formats.",
              "Copy is written directly in Hungarian rather than translated afterwards.",
              "Beyond promotion, we also developed operational and commercial assets for the season: raffle materials, numbered tickets, season passes and the bar menu.",
            ],
          },
          {
            title: "What changed",
            paragraphs: [
              "Harmony Garden maintained a consistent presence throughout the season, with each event entering the calendar with its own set of materials.",
              "The system is reusable: formats that perform remain, weak ones are removed and the next season starts from an existing framework rather than from zero.",
            ],
          },
        ],
      },
      {
        slug: "origins-cafe",
        vertical: "HoReCa / Oradea",
        title: "Origins Coffee & Drinks",
        summary:
          "Multiple locations, different audiences and one brand system. We connected content, local presence and loyalty into one coherent experience.",
        img: "/images/work-cafe.webp",
        intro:
          "Origins Coffee & Drinks operates several locations in Oradea, each with its own context and customer profile. Communication needed to remain recognisably Origins without turning every location into a copy of the others.",
        sections: [
          {
            title: "The context",
            paragraphs: [
              "In hospitality, frequency matters as much as the first visit.",
              "With multiple locations and different customer groups, generic coffee-shop communication was not enough. Every message needed to start from a real product, place or moment.",
              "At the same time, the loyalty programme needed to be simple for both the customer and the team behind the counter.",
            ],
          },
          {
            title: "What we built",
            paragraphs: [
              "We developed the loyalty platform, with digital cards accessible directly from the customer's phone and a Gold tier for returning customers.",
              "For each location, we structured Google profiles, content and photography around the local context.",
              "We created menus, in-store materials, QR assets and campaign materials for seasonal promotions and local activations.",
              "Social media follows the same rule: relaxed, recognisable content, always built around a product or experience that genuinely exists at that location.",
            ],
          },
          {
            title: "What changed",
            paragraphs: [
              "Loyalty can now be tracked and managed digitally.",
              "At the same time, each location can communicate to its own audience without leaving the Origins brand system.",
              "The same brand rules. The same visual standard. Content adapted to each location.",
            ],
          },
        ],
      },
      {
        slug: "thermx",
        vertical: "Industrial / Romania",
        title: "ThermX",
        summary:
          "A new technical product needs one reliable version of the truth before it needs advertising. We built that foundation first, then the positioning, website and launch around it.",
        img: "/images/work-industrial.webp",
        intro:
          "ThermX is a nanoceramic thermal-insulation membrane for a market where trust depends directly on the clarity of technical information. Before communication could scale, the data had to be standardised.",
        sections: [
          {
            title: "The context",
            paragraphs: [
              "The product introduces a less familiar category to the local market: spray-applied thermal insulation in millimetre-scale layers.",
              "The audience ranges from homeowners to architects and engineers, with very different levels of technical knowledge and different questions.",
              "Technical information was also circulating in multiple versions and from different sources.",
              "For a technical product, one inconsistency can undermine the credibility of the entire communication system.",
            ],
          },
          {
            title: "What we built",
            paragraphs: [
              "We began by consolidating the technical parameters into one reference document.",
              "Every figure used later in communication starts from that source.",
              "On that foundation, we built the positioning, technical brand dossier, 12-month marketing strategy, SEO strategy, market research and core buyer profiles.",
              "We also developed a dedicated direction for architects and engineers.",
              "The product launch was built end to end: structure, presentation, presenter script and video.",
              "Launch content was adapted across four channels, from educational B2C communication to B2B content on LinkedIn, while the website was built from the same verified technical base.",
            ],
          },
          {
            title: "What changed",
            paragraphs: [
              "ThermX now communicates the same information at every touchpoint.",
              "The data used by the sales team, the website and the content system all comes from the same verified source.",
              "Positioning, launch materials and digital communication now operate as one system.",
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
  "kgm-chery-oradea": [
    {
      src: "/images/cases/kgm-chery-oradea-1.webp",
      alt: {
        ro: "Postare Chery Oradea — gama Tiggo pe dimensiuni, lungimi și ampatamente",
        en: "Chery Oradea social post — the Tiggo range by size, lengths and wheelbases",
      },
    },
    {
      src: "/images/cases/kgm-chery-oradea-2.webp",
      alt: {
        ro: "Postare Chery Oradea — Tiggo 7 HEV, preț de listă septembrie",
        en: "Chery Oradea social post — Tiggo 7 HEV, September list price",
      },
    },
    {
      src: "/images/cases/kgm-chery-oradea-3.webp",
      alt: {
        ro: "Carusel KGM Oradea — istoria brandului, experiență în SUV-uri și 4×4",
        en: "KGM Oradea carousel — brand history, SUV and 4×4 heritage",
      },
    },
    {
      src: "/images/cases/kgm-chery-oradea-4.webp",
      alt: {
        ro: "Carusel KGM Oradea — Actyon, echipările Style și Executiv",
        en: "KGM Oradea carousel — Actyon, Style and Executiv trims",
      },
    },
  ],
  "harmony-garden": [
    {
      src: "/images/cases/harmony-garden-1.webp",
      alt: {
        ro: "Flyer Harmony Garden — Season Closing, închiderea sezonului",
        en: "Harmony Garden flyer — Season Closing event",
      },
    },
    {
      src: "/images/cases/harmony-garden-2.webp",
      alt: {
        ro: "Flyer Harmony Garden — Tinder Party, identitatea vizuală a grădinii",
        en: "Harmony Garden flyer — Tinder Party, the garden's visual identity",
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
  ro: "Vezi site-ul live",
  en: "Visit the live site",
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
      domain: "Carnetul ZEN · DentalNet Kids",
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
      domain: "Catalog utilaje & prețuri 2026",
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
      cta: { ro: "Deschide platforma", en: "Open the platform" },
    },
  ],
  thermx: [
    {
      url: "https://nanorevolution.ro",
      domain: "nanorevolution.ro",
      shot: "/images/cases/site-thermx.webp",
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
      title: { ro: "Reel — camere și piscină", en: "Reel — rooms and pool" },
    },
    {
      src: "/videos/cases/hotel-maxim-2.mp4",
      poster: "/videos/cases/hotel-maxim-2.jpg",
      title: { ro: "Reel — giveaway 8 Martie", en: "Reel — March 8 giveaway" },
    },
  ],
  dentalnet: [
    {
      src: "/videos/cases/dentalnet-1.mp4",
      poster: "/videos/cases/dentalnet-1.jpg",
      title: { ro: "Spot DentalNet Kids", en: "DentalNet Kids commercial" },
    },
  ],
  "agro-salso": [
    {
      src: "/videos/cases/agro-salso-1.mp4",
      poster: "/videos/cases/agro-salso-1.jpg",
      title: { ro: "Reel — grubere în lucru", en: "Reel — cultivators at work" },
    },
    {
      src: "/videos/cases/agro-salso-2.mp4",
      poster: "/videos/cases/agro-salso-2.jpg",
      title: { ro: "Reel — Dexwal KBO", en: "Reel — Dexwal KBO" },
    },
  ],
  "kgm-chery-oradea": [
    {
      src: "/videos/cases/kgm-chery-oradea-1.mp4",
      poster: "/videos/cases/kgm-chery-oradea-1.jpg",
      title: { ro: "Reel KGM — Rexton", en: "KGM reel — Rexton" },
    },
    {
      src: "/videos/cases/kgm-chery-oradea-2.mp4",
      poster: "/videos/cases/kgm-chery-oradea-2.jpg",
      title: { ro: "Reel Chery — Tiggo 9", en: "Chery reel — Tiggo 9" },
    },
  ],
  "harmony-garden": [
    {
      src: "/videos/cases/harmony-garden-1.mp4",
      poster: "/videos/cases/harmony-garden-1.jpg",
      title: { ro: "Aftermovie — Colour Garden", en: "Aftermovie — Colour Garden" },
    },
    {
      src: "/videos/cases/harmony-garden-2.mp4",
      poster: "/videos/cases/harmony-garden-2.jpg",
      title: { ro: "Reel — Future Disco", en: "Reel — Future Disco" },
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
      title: { ro: "Reel — vară / iarnă", en: "Reel — summer / winter" },
    },
  ],
};

/** Stat tiles per case — only facts already stated in the case copy or confirmed publicly. No invented numbers. */
export type CaseStat = { value: string; label: Record<Locale, string>; source?: Record<Locale, string> };

export const caseStats: Record<string, CaseStat[]> = {
  "hotel-maxim": [
    {
      value: "+20%",
      label: { ro: "rezervări în 6 luni", en: "bookings in 6 months" },
      source: { ro: "cifră confirmată de client", en: "figure confirmed by the client" },
    },
    {
      value: "4",
      label: { ro: "canale administrate lunar", en: "channels managed monthly" },
      source: { ro: "site, social media, profil Google, Google Ads", en: "site, social media, Google profile, Google Ads" },
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
      label: { ro: "clinici, două registre separate", en: "clinics, two separate registers" },
      source: { ro: "Kids și clinica generală", en: "Kids and the general clinic" },
    },
    {
      value: "2",
      label: { ro: "profiluri Google rescrise separat", en: "Google profiles rebuilt separately" },
      source: { ro: "categorii și servicii corectate", en: "categories and services corrected" },
    },
    {
      value: "1",
      label: { ro: "mascotă și sistem vizual propriu", en: "mascot and its own visual system" },
      source: { ro: "direcția vizuală a clinicii Kids", en: "the Kids clinic's visual direction" },
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
  "kgm-chery-oradea": [
    {
      value: "2",
      label: { ro: "mărci, zero reciclare între ele", en: "brands, zero recycling between them" },
      source: { ro: "KGM și Chery, registre separate", en: "KGM and Chery, separate registers" },
    },
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
      label: { ro: "locații pe un singur sistem", en: "locations on one system" },
      source: { ro: "ERA, Rogerius, Orășelul și Palatul Copiilor", en: "ERA, Rogerius, Orășelul and Palatul Copiilor" },
    },
    {
      value: "1",
      label: { ro: "platformă proprie de fidelizare", en: "loyalty platform of its own" },
      source: { ro: "app.originscafe.ro, construită de noi", en: "app.originscafe.ro, built by us" },
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
      label: { ro: "sursă de adevăr pentru datele tehnice", en: "source of truth for technical data" },
      source: { ro: "toate materialele pornesc din ea", en: "every asset starts from it" },
    },
    {
      value: "4",
      label: { ro: "canale acoperite la lansare", en: "channels covered at launch" },
      source: { ro: "Facebook, Instagram, LinkedIn și site", en: "Facebook, Instagram, LinkedIn and the site" },
    },
    {
      value: "12",
      label: { ro: "luni de strategie de marketing", en: "months of marketing strategy" },
      source: { ro: "strategie de marketing și SEO", en: "marketing and SEO strategy" },
    },
  ],
};

/** FAQ per case — rendered on the page and lifted into FAQPage JSON-LD (GEO). */
export type CaseFaq = { q: string; a: string };

export const caseFaqTitle: Record<Locale, string> = {
  ro: "Întrebări frecvente",
  en: "Frequently asked questions",
};

export const caseFaqs: Record<Locale, Record<string, CaseFaq[]>> = {
  ro: {
    "hotel-maxim": [
      {
        q: "Ce face Epic Digital Hub pentru Hotel Maxim?",
        a: "Gestionăm ecosistemul digital al hotelului: website și copy, SEO, social media, profilul Google, comunicarea cu oaspeții și campaniile pentru cazare, restaurant, evenimente și segmentul corporate.",
      },
      {
        q: "Lucrați și cu alte hoteluri din Oradea?",
        a: "Nu. Lucrăm cu un singur brand din aceeași categorie, în același oraș. Cât timp colaborăm cu Hotel Maxim, nu lucrăm cu un hotel concurent din Oradea.",
      },
      {
        q: "Ce rezultat public poate fi atribuit colaborării?",
        a: "Rezultatul confirmat public este o creștere de 20% a rezervărilor în primele șase luni.",
      },
    ],
    dentalnet: [
      {
        q: "Ce face Epic Digital Hub pentru DentalNet?",
        a: "Am construit sistemele de comunicare și regulile de brand pentru cele două clinici DentalNet, de la social media și prezentarea medicilor până la materiale tipărite și optimizarea profilurilor Google.",
      },
      {
        q: "Lucrați și cu alte clinici stomatologice din Oradea?",
        a: "Nu. În Oradea, categoria este rezervată DentalNet pe durata colaborării.",
      },
      {
        q: "Cum abordați regulile de publicitate medicală?",
        a: "Fiecare material este construit în limitele cadrului legal și profesional aplicabil. Filmările și fotografiile cu pacienți sunt realizate numai în baza documentației corespunzătoare privind utilizarea imaginii.",
      },
    ],
    "agro-salso": [
      {
        q: "Ce face Epic Digital Hub pentru Agro Salso?",
        a: "Am restructurat campaniile Google și Meta, am configurat măsurarea conversiilor și am reconstruit comunicarea produselor pe baza specificațiilor oficiale. Sistemul include website, materiale comerciale și suport pentru procesul de gestionare a cererilor.",
      },
      {
        q: "Lucrați și cu alți dealeri de utilaje agricole?",
        a: "Nu lucrăm simultan cu dealeri concurenți din aceeași categorie și aceeași piață.",
      },
      {
        q: "De unde provin specificațiile tehnice publicate?",
        a: "Din documentația oficială a producătorilor din portofoliu. Specificațiile, compatibilitățile și prețurile sunt verificate înainte de publicare.",
      },
    ],
    "kgm-chery-oradea": [
      {
        q: "Ce face Epic Digital Hub pentru KGM Oradea și Chery Oradea?",
        a: "Construim și coordonăm sistemele lunare de comunicare pentru cele două mărci: lansări, carusele, conținut comercial, stories și scripturi video.",
      },
      {
        q: "De unde provin prețurile și specificațiile publicate?",
        a: "Din documentația și listele comerciale oficiale curente ale importatorilor. Promoțiile sunt publicate numai împreună cu perioada de valabilitate confirmată.",
      },
      {
        q: "Lucrați și cu alți dealeri auto din Oradea?",
        a: "Nu lucrăm simultan cu un dealer concurent direct din aceeași categorie locală.",
      },
    ],
    "harmony-garden": [
      {
        q: "Ce face Epic Digital Hub pentru Harmony Garden?",
        a: "Construim comunicarea sezonului: masterplan, identitatea evenimentelor, materiale grafice, reels, teasere și mecanici comerciale.",
      },
      {
        q: "În ce limbă este creat conținutul?",
        a: "În principal în maghiară. Conținutul este scris direct pentru publicul Harmony Garden, nu tradus mecanic din română.",
      },
      {
        q: "Lucrați și cu alte cluburi din aceeași zonă?",
        a: "Nu lucrăm simultan cu un brand concurent direct din aceeași categorie și aceeași piață.",
      },
    ],
    "origins-cafe": [
      {
        q: "Ce face Epic Digital Hub pentru Origins Coffee & Drinks?",
        a: "Am construit sistemul de fidelizare și lucrăm la ecosistemul de comunicare al brandului: profiluri Google, materiale pentru locații, meniuri și social media.",
      },
      {
        q: "Cum funcționează cardul de fidelitate?",
        a: "Clientul are cardul direct în telefon, iar interacțiunile sunt înregistrate digital la fiecare vizită eligibilă. Clienții recurenți pot ajunge la nivelul Gold.",
      },
      {
        q: "Lucrați și cu alte cafenele din Oradea?",
        a: "Nu. Pe durata colaborării cu Origins, nu lucrăm cu o cafenea concurentă din Oradea.",
      },
    ],
    thermx: [
      {
        q: "Ce a construit Epic Digital Hub pentru ThermX?",
        a: "Am consolidat baza de date tehnice și am construit poziționarea, strategia de marketing, strategia SEO, website-ul și sistemul complet de lansare al produsului.",
      },
      {
        q: "Ce este ThermX?",
        a: "ThermX este o membrană nanoceramică termoizolantă produsă de Nano Revolution și aplicată prin pulverizare în strat de ordinul milimetrilor, destinată izolării termice a clădirilor.",
      },
      {
        q: "Cum comunicați un produs atât de tehnic?",
        a: "Pornind de la o singură sursă de date. Nicio informație tehnică nu intră în comunicare înainte să fie verificată și documentată.",
      },
    ],
  },
  en: {
    "hotel-maxim": [
      {
        q: "What does Epic Digital Hub do for Hotel Maxim?",
        a: "We manage the hotel's digital ecosystem: website copy, SEO, social media, Google Business Profile, guest-facing communication and campaigns for rooms, restaurant, events and the corporate segment.",
      },
      {
        q: "Do you work with other hotels in Oradea?",
        a: "No. We work with one brand per category, per city. While Hotel Maxim is an active client, we do not work with a competing hotel in Oradea.",
      },
      {
        q: "What public result can be attributed to the collaboration?",
        a: "The confirmed public result is a 20% increase in bookings within the first six months.",
      },
    ],
    dentalnet: [
      {
        q: "What does Epic Digital Hub do for DentalNet?",
        a: "We built the communication systems and brand rules for both DentalNet clinics, from social media and doctor presentation formats to printed materials and Google profile optimisation.",
      },
      {
        q: "Do you work with other dental clinics in Oradea?",
        a: "No. In Oradea, the category is reserved for DentalNet for the duration of the engagement.",
      },
      {
        q: "How do you approach medical advertising rules?",
        a: "Every piece is created within the applicable legal and professional framework. Patient photography and filming are produced only with the appropriate image-consent documentation.",
      },
    ],
    "agro-salso": [
      {
        q: "What does Epic Digital Hub do for Agro Salso?",
        a: "We restructured the Google and Meta campaigns, implemented conversion measurement and rebuilt product communication around official manufacturer specifications. The system includes the website, commercial materials and support for enquiry management.",
      },
      {
        q: "Do you work with other agricultural machinery dealers?",
        a: "We do not work simultaneously with direct competitors in the same category and market.",
      },
      {
        q: "Where do the published technical specifications come from?",
        a: "From the official documentation of the manufacturers in the portfolio. Specifications, compatibility and pricing are verified before publication.",
      },
    ],
    "kgm-chery-oradea": [
      {
        q: "What does Epic Digital Hub do for KGM Oradea and Chery Oradea?",
        a: "We build and operate the monthly communication systems for both brands: launches, carousels, commercial content, stories and video scripts.",
      },
      {
        q: "Where do the published prices and specifications come from?",
        a: "From current official importer documentation and commercial lists. Promotions are published only with a confirmed validity period.",
      },
      {
        q: "Do you work with other car dealers in Oradea?",
        a: "We do not work simultaneously with a direct local competitor in the same category.",
      },
    ],
    "harmony-garden": [
      {
        q: "What does Epic Digital Hub do for Harmony Garden?",
        a: "We build the season's communication system: masterplan, event identities, graphic materials, reels, teasers and commercial mechanics.",
      },
      {
        q: "What language is the content created in?",
        a: "Primarily Hungarian. The copy is written directly for the Harmony Garden audience rather than mechanically translated from Romanian.",
      },
      {
        q: "Do you work with other clubs in the same area?",
        a: "We do not work simultaneously with a direct competitor in the same category and market.",
      },
    ],
    "origins-cafe": [
      {
        q: "What does Epic Digital Hub do for Origins Coffee & Drinks?",
        a: "We built the loyalty system and work across the brand's communication ecosystem: Google profiles, in-store materials, menus and social media.",
      },
      {
        q: "How does the loyalty card work?",
        a: "The customer keeps the card on their phone, and eligible interactions are recorded digitally with each visit. Returning customers can progress to the Gold tier.",
      },
      {
        q: "Do you work with other coffee shops in Oradea?",
        a: "No. While Origins is an active client, we do not work with a competing coffee shop in Oradea.",
      },
    ],
    thermx: [
      {
        q: "What did Epic Digital Hub build for ThermX?",
        a: "We consolidated the technical data and built the positioning, marketing strategy, SEO strategy, website and full product-launch system.",
      },
      {
        q: "What is ThermX?",
        a: "ThermX is a nanoceramic thermal-insulation membrane produced by Nano Revolution and spray-applied in a millimetre-scale layer for the thermal insulation of buildings.",
      },
      {
        q: "How do you communicate such a technical product?",
        a: "By starting from one source of truth. No technical claim enters communication before it has been verified and documented.",
      },
    ],
  },
};
