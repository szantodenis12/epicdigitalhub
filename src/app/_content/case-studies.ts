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

export const caseStudySlugs = ["hotel-maxim", "dentalnet", "agro-salso"] as const;

export const caseStudiesContent: Record<Locale, CaseStudiesContent> = {
  ro: {
    kicker: "Studii de caz",
    title: "Ce am construit și ce s-a schimbat.",
    intro:
      "Lucrăm cu un singur brand pe nișă, pe oraș. Acestea sunt trei dintre brandurile cu care construim.",
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
          "Un hotel bun, invizibil în online. I-am construit canalul direct: site corectat, conținut, campanii, rezervări care nu mai depind de platforme.",
        img: "/images/work-hotel.webp",
        intro:
          "Hotel Maxim e un hotel de familie, la câteva minute de mers pe jos de centrul istoric al Oradiei. Oaspeții plecau mulțumiți și reveneau. Online, hotelul aproape că nu exista.",
        sections: [
          {
            title: "Contextul",
            paragraphs: [
              "Hotelul avea restaurant, piscină interioară și săli de evenimente, iar reputația se construise din recomandări. Aproape toate rezervările treceau însă prin platforme, cu comision la fiecare noapte.",
              "Nicio pagină activă de social media, niciun conținut publicat. Site-ul avea linkuri care duceau spre pagini inexistente, inclusiv butonul de rezervare, și promitea facilități care nu mai existau în realitate. Numărul de telefon diferea de la o pagină la alta.",
            ],
          },
          {
            title: "Ce am construit",
            paragraphs: [
              "Am început cu poziționarea și regulile de voce: cum vorbește hotelul, ce promite și ce nu promite. Din ele pornește fiecare text, de la o postare până la răspunsul la o recenzie.",
              "Am rescris toate textele site-ului și am corectat erorile factuale găsite pe parcurs, de la facilități promise greșit până la numărul de telefon. Auditul tehnic a documentat fiecare pagină care dădea eroare, cu soluția, pentru dezvoltator.",
              "Facebook și Instagram au pornit de la zero: un sistem de carusele și story-uri construit pe fotografiile reale ale hotelului, nu pe imagini de stoc, plus postări constante pe profilul de Google și un ghid de răspuns la recenzii pentru recepție.",
              "Campaniile Google au fost structurate pe intențiile reale de căutare: numele hotelului, cazare în oraș, săli de conferințe, căutări din Ungaria. Pentru săli și evenimente am construit pagini de conversie dedicate și o campanie de contact direct către firme de training și agenții de turism din Europa.",
            ],
          },
          {
            title: "Ce s-a schimbat",
            paragraphs: [
              "Hotelul are acum un canal direct care funcționează: telefonul apare corect peste tot, butonul de rezervare duce unde trebuie, iar campaniile aduc apeluri care se pot măsura.",
              // <!-- cifra: de confirmat cu Roland --> (alte cifre: apeluri, rată de răspuns la recenzii, pondere rezervări directe)
              "Conținutul se publică pe un sistem, lună de lună, în aceeași voce. Recenziile primesc răspuns după un ghid scris, iar profilul de Google e administrat constant.",
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
          "Două clinici, două publicuri. Un sistem de conținut pentru fiecare, cu reguli de brand scrise și profiluri de Google puse în ordine.",
        img: "/images/work-dental.webp",
        intro:
          "DentalNet are două clinici în același oraș: una pentru copii, una pentru adulți. Pacienții veneau de zeci de ani din recomandări. Pe Google, clinica era aproape invizibilă.",
        sections: [
          {
            title: "Contextul",
            paragraphs: [
              "Profilul de Google al clinicii de copii era încadrat la o categorie greșită, brandul nu apărea deloc pe căutările importante din oraș, iar un lanț național cumpăra reclame chiar pe numele clinicii.",
              "Peste toate, un cadru strict: medicul nu apare în conținut, iar publicitatea medicală are reguli clare despre ce ai voie să afirmi. Orice sistem de conținut trebuia construit în interiorul acestor limite, nu în ciuda lor.",
            ],
          },
          {
            title: "Ce am construit",
            paragraphs: [
              "Am tratat cele două clinici ca două branduri separate, cu registre proprii: un ton pentru părinți, construit pe prevenție și calm, și un registru adult, sobru, pentru clinica generală. Nimic nu se reciclează dintr-o parte în alta.",
              "Pentru clinica de copii am creat o mascotă și o direcție vizuală proprie. Sistemul de conținut acoperă postări, carusele și materiale tipărite, până la un carnet al pacientului folosit în cabinet.",
              "Am rescris profilurile de Google ca două afaceri separate, cu categoriile corecte, servicii listate și un plan de recenzii. Auditul de vizibilitate a arătat exact unde pierdea clinica și a devenit planul de lucru, cu priorități clare.",
              "Filmările și fotografiile din clinică se fac pe un acord de imagine semnat de pacient, scris de noi, ca fiecare material să fie acoperit legal înainte să fie creativ.",
            ],
          },
          {
            title: "Ce s-a schimbat",
            paragraphs: [
              "Fiecare clinică vorbește acum pe registrul ei, iar conținutul se produce pe un sistem, nu de la o postare la alta. Regulile de brand sunt scrise, deci orice material nou pornește de la aceleași repere.",
              // <!-- cifra: de confirmat cu Roland --> (cifre: recenzii noi, apeluri, pacienți din Google)
              "Profilurile de Google sunt încadrate corect și administrate constant, iar clinica apare pe căutările pe care înainte lipsea cu totul.",
            ],
          },
        ],
      },
      {
        slug: "agro-salso",
        vertical: "Agro / Bihor",
        title: "Agro Salso",
        summary:
          "Campaniile ardeau buget și nimeni nu măsura nimic. Am oprit tot, am reparat baza și am reconstruit pe date verificate.",
        img: "/images/work-agro.webp",
        intro:
          "Agro Salso e un dealer de utilaje agricole din Bihor, cu livrare națională și un portofoliu tehnic serios. Problema nu era produsul. Era tot ce se afla între produs și client.",
        sections: [
          {
            title: "Contextul",
            paragraphs: [
              "Campaniile plătite rulau, dar bugetul se ducea pe căutări irelevante, fără măsurare de conversii. Nimeni nu putea spune care reclamă aduce cereri de ofertă și care doar clicuri.",
              "Site-ul avea prețuri și specificații neuniforme de la o pagină la alta, iar pe alocuri chiar mărci trecute greșit. Într-un domeniu în care clientul cumpără pe date tehnice, fiecare neconcordanță costă încredere.",
            ],
          },
          {
            title: "Ce am construit",
            paragraphs: [
              "Primul pas a fost diagnosticul: am oprit ce ardea buget, am analizat termenii de căutare și am rescris structura campaniilor pe produsele și categoriile care aduc cereri de ofertă, cu liste de cuvinte excluse întreținute săptămânal.",
              "Am instalat măsurarea corect: evenimente de conversie pe formularele reale din site, ca bugetul să fie judecat pe cereri de ofertă, nu pe clicuri.",
              "Paginile de produs au fost rescrise pe o regulă simplă: niciun beneficiu fără caracteristica tehnică ce îl susține. Specificații, compatibilitate cu tractorul, preț și disponibilitate, toate verificate în documentația oficială a producătorilor.",
              "Am construit catalogul și broșura de prețuri, materiale pentru târguri și un sistem simplu de CRM în care cererile de ofertă nu se mai pierd. Ghidul de voce a fixat tonul: competent și precis, cu superlativele tăiate.",
            ],
          },
          {
            title: "Ce s-a schimbat",
            paragraphs: [
              "Bugetul de campanii se duce acum pe căutările care aduc cereri de ofertă, iar fiecare cerere e măsurată și urmărită până la răspuns.",
              // <!-- cifra: de confirmat cu Roland --> (cifre: cost pe cerere de ofertă, cereri pe lună, buget salvat)
              "Site-ul spune același lucru în toate locurile: aceleași prețuri, aceleași specificații, aceleași date de contact. Materialele comerciale, de la pagina de produs la broșură, pornesc din aceleași surse verificate.",
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
      "We work with one brand per niche, per city. These are three of the brands we build with.",
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
          "A good hotel, invisible online. We built its direct channel: corrected website, content, campaigns, bookings that no longer depend on platforms.",
        img: "/images/work-hotel.webp",
        intro:
          "Hotel Maxim is a family-run hotel, a few minutes' walk from Oradea's historic center. Guests left happy and came back. Online, the hotel barely existed.",
        sections: [
          {
            title: "The context",
            paragraphs: [
              "The hotel had a restaurant, an indoor pool and event rooms, and its reputation was built on word of mouth. Yet almost every booking came through platforms, with a commission on every night.",
              "No active social media page, no published content. The website had links leading to pages that did not exist, including the booking button, and promised facilities that were no longer real. The phone number differed from one page to another.",
            ],
          },
          {
            title: "What we built",
            paragraphs: [
              "We started with positioning and voice rules: how the hotel speaks, what it promises and what it does not. Every text starts from them, from a post to a review reply.",
              "We rewrote every page of the website and corrected the factual errors found along the way, from wrongly promised facilities to the phone number. The technical audit documented every broken page, with its fix, for the developer.",
              "Facebook and Instagram started from zero: a carousel and stories system built on the hotel's real photography, not stock images, plus regular posts on the Google profile and a written review-reply guide for the front desk.",
              "Google campaigns were structured around real search intent: the hotel's name, accommodation in the city, conference rooms, searches from Hungary. For the event spaces we built dedicated conversion pages and a direct outreach campaign to training companies and travel agencies across Europe.",
            ],
          },
          {
            title: "What changed",
            paragraphs: [
              "The hotel now has a direct channel that works: the phone number is correct everywhere, the booking button leads where it should, and campaigns bring calls that can be measured.",
              // <!-- cifra: de confirmat cu Roland --> (other numbers: calls, review response rate, direct booking share)
              "Content ships on a system, month after month, in one voice. Reviews get answered from a written guide, and the Google profile is managed consistently.",
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
          "Two clinics, two audiences. A content system for each, with written brand rules and Google profiles set straight.",
        img: "/images/work-dental.webp",
        intro:
          "DentalNet runs two clinics in the same city: one for children, one for adults. Patients had come through referrals for decades. On Google, the clinic was nearly invisible.",
        sections: [
          {
            title: "The context",
            paragraphs: [
              "The children's clinic sat in the wrong Google category, the brand was absent from the searches that matter in its city, and a national chain was buying ads on the clinic's own name.",
              "On top of that, a strict frame: the doctor does not appear in content, and medical advertising has clear rules about what you may claim. Any content system had to be built inside those limits, not around them.",
            ],
          },
          {
            title: "What we built",
            paragraphs: [
              "We treated the two clinics as two separate brands with their own registers: a tone for parents, built on prevention and calm, and a sober adult register for the general clinic. Nothing gets recycled from one side to the other.",
              "For the children's clinic we created a mascot and its own visual direction. The content system covers posts, carousels and printed materials, down to a patient booklet used in the practice itself.",
              "We rewrote the Google profiles as two separate businesses, with correct categories, listed services and a review plan. The visibility audit showed exactly where the clinic was losing ground and became the work plan, with clear priorities.",
              "Filming and photography in the clinic run on a patient-signed image consent form we wrote, so every piece of material is legally covered before it gets creative.",
            ],
          },
          {
            title: "What changed",
            paragraphs: [
              "Each clinic now speaks in its own register, and content is produced on a system rather than post by post. The brand rules are written down, so every new piece starts from the same reference points.",
              // <!-- cifra: de confirmat cu Roland --> (numbers: new reviews, calls, patients from Google)
              "The Google profiles are categorized correctly and managed consistently, and the clinic shows up on searches where it used to be missing entirely.",
            ],
          },
        ],
      },
      {
        slug: "agro-salso",
        vertical: "Agro / Bihor",
        title: "Agro Salso",
        summary:
          "Campaigns burning budget with no measurement. We stopped everything, fixed the foundation and rebuilt on verified data.",
        img: "/images/work-agro.webp",
        intro:
          "Agro Salso is a machinery dealer in Bihor, delivering nationally, with a serious technical portfolio. The problem was not the product. It was everything between the product and the customer.",
        sections: [
          {
            title: "The context",
            paragraphs: [
              "Paid campaigns were running, but budget went to irrelevant searches, with no conversion measurement. Nobody could say which ad brought quote requests and which brought only clicks.",
              "The website carried inconsistent prices and specifications from one page to another, and in places even wrongly attributed brands. In a field where customers buy on technical data, every inconsistency costs trust.",
            ],
          },
          {
            title: "What we built",
            paragraphs: [
              "The first step was the diagnostic: we paused what was burning budget, analyzed the search terms and rebuilt the campaign structure around the products and categories that bring quote requests, with negative keyword lists maintained weekly.",
              "We installed measurement properly: conversion events on the site's real forms, so budget is judged on quote requests, not clicks.",
              "Product pages were rewritten on one simple rule: no benefit without the technical characteristic behind it. Specifications, tractor compatibility, price and availability, all verified against the manufacturers' official documentation.",
              "We built the catalog and price brochure, trade fair materials and a simple CRM where quote requests no longer get lost. The voice guide fixed the tone: competent, precise, no superlatives.",
            ],
          },
          {
            title: "What changed",
            paragraphs: [
              "Campaign budget now goes to the searches that bring quote requests, and every request is measured and followed through to an answer.",
              // <!-- cifra: de confirmat cu Roland --> (numbers: cost per quote request, requests per month, budget saved)
              "The website says the same thing everywhere: same prices, same specifications, same contact details. Commercial materials, from product page to brochure, start from the same verified sources.",
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
