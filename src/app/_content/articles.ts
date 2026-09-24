import type { Locale } from "../content";

export type ArticleSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  quote?: string;
};

export type Article = {
  slug: string;
  /** Display date, already formatted per locale */
  date: string;
  category: string;
  title: string;
  dek: string;
  readingTime: string;
  sections: ArticleSection[];
};

export type ArticlesCopy = {
  kicker: string;
  title: string;
  intro: string;
  backLabel: string;
  ctaBody: string;
  ctaAudit: string;
  ctaApply: string;
  articles: Article[];
};

const en: ArticlesCopy = {
  kicker: "Articles",
  title: "The conversations we have with every client, written down.",
  intro:
    "Brand systems, positioning, exclusivity, measurement. The topics that come up in every conversation with a new client, explained once.",
  backLabel: "All articles",
  ctaBody:
    "If you want to know where your brand stands on these points, ask for an audit. We look at the numbers and the channels and give you a straight answer.",
  ctaAudit: "Request an audit",
  ctaApply: "Apply for your city",
  articles: [
    {
      slug: "raportul-lunar-de-marketing",
      date: "3 Sep 2026",
      category: "Measurement",
      title: "What to look at in your monthly marketing report",
      dek: "Reach, likes, impressions: numbers that almost always grow and say almost nothing about the business. A short guide for the owner who gets a colorful PDF every month.",
      readingTime: "5 min read",
      sections: [
        {
          heading: "The decorative numbers",
          paragraphs: [
            "Almost every marketing report opens with the same figures: reach, impressions, followers, likes. They share one property: they almost always go up. If you pay for advertising, impressions rise by definition, because impressions are literally what you are buying. A report that presents this as an achievement is reporting your own budget back to you.",
            "These numbers are not useless. For the people working inside the account they help with diagnosis: which format works, which audience responds. But they are working tools, not conclusions. When they end up on page one of your monthly report, they are usually covering for the absence of the numbers that matter.",
          ],
        },
        {
          heading: "The numbers that describe the business",
          paragraphs: [
            "A report that is useful to an owner answers business questions, not platform questions.",
          ],
          bullets: [
            "How many enquiries came in this month: forms, calls, messages. Counted, not estimated.",
            "What one enquiry cost, per channel.",
            "How many enquiries became clients, and where the rest were lost.",
            "What a new client is worth to you, so you know how much you can afford to pay to bring one in.",
            "What changed versus last month, and the explanation in words, not in percentages.",
          ],
          quote: "A report where everything is green describes the report, not the business.",
        },
        {
          heading: "The questions that make a report useful",
          paragraphs: [
            "A good report is a list of decisions, with the numbers that back them. What we stopped this month and why. What we kept. Where the budget moves next month. If the report proposes no change at all, it is not a report. It is a receipt for your money.",
            "Ask explicitly for the part about what did not work. A campaign stopped in time is a good decision, not a failure to hide. If in twelve months not a single initiative was declared a mistake, you are not looking at a team that never gets it wrong. You are looking at a report written not to disturb anyone.",
            "For these numbers to exist at all, the measurement has to exist behind them: working forms, counted calls, conversion events wired to the site. If your agency says it cannot be measured, it usually means the right things were never installed.",
          ],
        },
        {
          heading: "One month is not a verdict",
          paragraphs: [
            "There are bad months for reasons that have nothing to do with marketing: season, competition, a market holding on to its money. Judge the direction over three or six months, not the verdict over thirty days. The right question is not whether the month was good, but whether things are moving in the direction that was agreed.",
            "Separate what accumulates from what resets. Traffic from paid campaigns stops when the budget stops. But some numbers should climb slowly and steadily if a brand is actually being built: how many people search for you by name, how much cheaper an enquiry is than a year ago, how many clients arrive through referrals. Those are the signs that the monthly budget is leaving something behind.",
            "If your monthly report does not answer the questions in this article, you do not need a different report. You need a different conversation with whoever writes it.",
          ],
        },
      ],
    },
    {
      slug: "un-singur-brand-pe-nisa",
      date: "17 Jun 2026",
      category: "Exclusivity",
      title: "What changes when your agency can't work with your competitors",
      dek: "We work with one brand per niche, in each city. It is not a courtesy. It is a rule that changes how an agency works, and who it really works for.",
      readingTime: "5 min read",
      sections: [
        {
          heading: "The usual agency model",
          paragraphs: [
            "A typical agency works with anyone who pays. That is not an accusation, it is the business model: more clients, more contracts, more predictability. In practice it means three clinics from the same city can sit on the same agency's client list. Or two car dealers. Or two guesthouses ten minutes apart.",
            "Nobody hides this. The opposite: a niche portfolio is a sales argument. We have worked with clinics before, we know what works. Except that \"we know what works\" has a source: the campaigns paid for by the clinic that came before you. What works for you this month becomes pitch material for your competitor next month.",
          ],
        },
        {
          heading: "Incentives beat intentions",
          paragraphs: [
            "No bad faith is required for things to drift this way. The structure is enough. An agency that can sell into your niche again has every reason to turn your account into a repeatable recipe, because recipes are easy to sell. Your strategy becomes a template, because the template brings in the next client.",
            "When the agency cannot take your competitor, the math flips. The only way your account becomes more valuable is for your advantage to grow. There is no second client in your niche to sell your lessons to. The agency's interest and your interest end up being the same thing, through structure, not through promises.",
          ],
          quote: "We don't build the same advantage for two competitors.",
        },
        {
          heading: "What it means for you",
          paragraphs: ["In concrete terms, the rule does four things."],
          bullets: [
            "The strategy built for your category stays yours. It does not get reinterpreted for someone else in the same city.",
            "Your numbers do not educate a competitor. What we learn from your campaigns is applied back to you.",
            "We turn money down while we work together. If a direct competitor calls, the answer is no.",
            "The seat in a niche is either free or taken. That makes the decision less comfortable, and much clearer.",
          ],
        },
        {
          heading: "What to ask any agency, including us",
          paragraphs: ["Three short questions, before any contract."],
          bullets: [
            "Who else in my niche do you work with, in my city or around it?",
            "What happens to my strategy and my materials if we stop?",
            "Who else sees my numbers and the tests paid from my budget?",
          ],
        },
      ],
    },
    {
      slug: "ce-este-un-sistem-de-brand",
      date: "8 Apr 2026",
      category: "Brand systems",
      title: "What a brand system is. And what it is not.",
      dek: "We use the word system a lot, so here it is on paper: what it covers, what it does not, and how to tell whether your brand has one.",
      readingTime: "6 min read",
      sections: [
        {
          heading: "The short definition",
          paragraphs: [
            "A brand system is a set of decisions made once, then applied to everything you communicate. Who you are in the market. Who you compete with. Why anyone would choose you. How you look, how you speak, what job each channel has. These decisions live in writing, and the execution confirms them every day: every post, page and campaign supports the same position.",
            "The second half matters as much as the first. Without execution, the decisions stay a nice document. Without decisions, execution turns into assembly-line output: things get published because it is Tuesday, not because that piece has a job to do.",
          ],
        },
        {
          heading: "What a brand system is not",
          paragraphs: ["It is easier to understand through what it is not."],
          bullets: [
            "It is not a logo with a brand manual. The manual says how you look. It does not say who you are in the market or what message you repeat.",
            "It is not a posting calendar. A calendar fills the month. A position is built by what you repeat, not by how much you publish.",
            "It is not a rebranding campaign. A campaign has a start and an end. The system shows precisely in what stays constant after the campaign is over.",
            "It is not a folder of templates. A template standardizes the form. If the direction is missing, you are standardizing the mess.",
          ],
        },
        {
          heading: "What it is made of",
          paragraphs: ["Six parts, in the order they get built."],
          bullets: [
            "Positioning, in writing. A short document that says what place you hold in the market and why. Every other decision is checked against it.",
            "Identity: color, typography, photography, tone. The way you are recognized before your name is read.",
            "The website, built around one clear action, not as a brochure trying to say everything.",
            "Content, which repeats the position in different forms. Every piece has a job, or it does not go out.",
            "Campaigns, which carry the same promise. The page a person lands on says the same thing as the ad they clicked.",
            "Measurement, tied to enquiries and clients, not to likes.",
          ],
          quote: "Visual identity starts with the logo. It doesn't end there.",
        },
        {
          heading: "How to tell whether you have one",
          paragraphs: [
            "There are a few simple tests. A new person, employee or contractor, can decide from the existing documents what to publish and how, without asking you at every step. Pieces made in different months, placed side by side, look built by the same hand. If you pause one channel for a month, the message does not collapse, because the same message lives in the others.",
            "There is one more sign, harder to measure: your price starts to feel natural. The way a brand looks and communicates shapes how normal the price you ask seems. When everything supports the same position, the price conversation gets shorter.",
            "If these tests fail, the first step is not a new design. The first step is the positioning, put in writing. The rest is built on top of it, not the other way around.",
          ],
        },
      ],
    },
    {
      slug: "marketing-pe-bucati",
      date: "12 Feb 2026",
      category: "Strategy",
      title: "Why marketing bought in pieces doesn't work",
      dek: "One agency for social media, a freelancer for the website, somebody else for the ads. Everyone does their job, and still the brand never comes together. The mechanism is simple, and worth understanding before you sign another contract.",
      readingTime: "6 min read",
      sections: [
        {
          heading: "What it looks like in practice",
          paragraphs: [
            "The situation is the same in almost every city. The posts are made by a social media agency. The website was built by a freelancer two years ago and nobody has touched it since. The ads are run by somebody else, paid a percentage of the budget. The logo comes from an older project, and the copy is written by whoever has time that day.",
            "Each of these people can be good at their part. The problem is not competence. The problem is that nobody answers for the direction. Nobody has decided, in writing, what position the brand wants in the market, who it competes with and why anyone would choose it. In the absence of that decision, every supplier decides alone, for their own piece.",
          ],
        },
        {
          heading: "Every supplier is paid for something else",
          paragraphs: ["Look at what each one is paid for and the rest explains itself."],
          bullets: [
            "The social media agency is judged on likes and reach, so it posts whatever the algorithm favors.",
            "The person running the ads is judged on cost per click, so they push whichever promise performs best this month.",
            "The web freelancer delivered the site, got paid, and moved on to the next project.",
            "Nobody is paid to hold the same position across all of these pieces.",
          ],
          quote: "Everyone does their job well. They just all pull in different directions.",
        },
        {
          heading: "Why the problem never shows up in a report",
          paragraphs: [
            "The tricky part is that every supplier can show you good numbers. Reach is growing, cost per click is fine, the site was delivered on time. Taken piece by piece, everything looks in order. That is why the problem survives for years: there is no report where it becomes visible.",
            "It shows somewhere else. Every campaign starts from zero, because nothing is repeated long enough to stay in people's minds. The budget is spent every month, but nothing accumulates. Two years later you have paid dozens of marketing invoices and you are roughly where you started: clients come from referrals, and the ads work only for as long as you keep paying.",
          ],
        },
        {
          heading: "The one-minute test",
          paragraphs: [
            "Put them side by side: the last post, the last ad, the homepage and the last printed piece. If they look built by the same hand and carry the same message, you have a brand. If each one seems to belong to a different company, you have suppliers.",
            "Your customer runs this test anyway, without calling it a test. They see the ad, open the site, check the Facebook page and draw a conclusion about how seriously to take you. For them there is no social agency, no freelancer, no ads person. For them, it is all the same brand.",
          ],
        },
        {
          heading: "What a system fixes",
          paragraphs: [
            "A system means the big decisions are made once and then applied everywhere. The strategy sets the position you hold. The identity makes it visible. The website turns it into action. Content and campaigns repeat it until people remember you for one specific thing. Every channel has a job, not a life of its own.",
            "You do not have to change everything at once, and we would not recommend it. The order matters more than the speed: first the positioning, in writing. Then you align the channels one by one, starting with the one that brings you clients today. After a few months the pieces start pulling in the same direction, and the marketing budget starts building something that stays.",
          ],
        },
      ],
    },
  ],
};

const ro: ArticlesCopy = {
  kicker: "Articole",
  title: "Discuțiile pe care le avem cu fiecare client, puse în scris.",
  intro:
    "Sisteme de brand, poziționare, exclusivitate, măsurare. Subiectele care apar în fiecare discuție cu un client nou, explicate o singură dată.",
  backLabel: "Toate articolele",
  ctaBody:
    "Dacă vrei să știi cum stă brandul tău la capitolele astea, cere un audit. Ne uităm pe cifre și pe canale și îți răspundem concret.",
  ctaAudit: "Cere un audit",
  ctaApply: "Aplică pentru orașul tău",
  articles: [
    {
      slug: "raportul-lunar-de-marketing",
      date: "03.09.2026",
      category: "Măsurare",
      title: "Ce să urmărești în raportul lunar de marketing",
      dek: "Reach, aprecieri, afișări: cifre care cresc aproape mereu și spun aproape nimic despre afacere. Un ghid scurt pentru proprietarul care primește lunar un PDF colorat.",
      readingTime: "5 min de citit",
      sections: [
        {
          heading: "Cifrele de decor",
          paragraphs: [
            "Aproape orice raport de marketing se deschide cu aceleași cifre: reach, afișări, urmăritori, aprecieri. Au o proprietate comună: cresc aproape întotdeauna. Dacă plătești reclame, afișările cresc prin definiție, pentru că exact asta cumperi. Un raport care prezintă asta ca pe o reușită îți raportează propriul buget înapoi.",
            "Cifrele astea nu sunt inutile. Pentru cine lucrează în cont, ele ajută la diagnostic: ce format prinde, ce audiență răspunde. Dar sunt instrumente de lucru, nu concluzii. Când ajung pe prima pagină a raportului tău lunar, de obicei acoperă lipsa cifrelor care contează.",
          ],
        },
        {
          heading: "Cifrele care descriu afacerea",
          paragraphs: [
            "Un raport util pentru proprietar răspunde la întrebări de business, nu de platformă.",
          ],
          bullets: [
            "Câte solicitări au venit luna asta: formulare, telefoane, mesaje. Numărate, nu estimate.",
            "Cât a costat o solicitare, pe fiecare canal în parte.",
            "Câte solicitări au devenit clienți și unde s-au pierdut celelalte.",
            "Cât valorează un client nou pentru tine, ca să știi cât îți permiți să plătești ca să aduci unul.",
            "Ce s-a schimbat față de luna trecută și care e explicația, cu cuvinte, nu cu procente.",
          ],
          quote: "Un raport în care totul e verde descrie raportul, nu afacerea.",
        },
        {
          heading: "Întrebările care fac raportul util",
          paragraphs: [
            "Un raport bun e o listă de decizii, cu cifrele care le susțin. Ce am oprit luna asta și de ce. Ce am păstrat. Unde mutăm bugetul luna viitoare. Dacă raportul nu propune nicio schimbare, nu e un raport. E o confirmare de primire a banilor.",
            "Cere explicit partea cu ce nu a mers. O campanie oprită la timp e o decizie bună, nu un eșec de ascuns. Dacă în douăsprezece luni nicio inițiativă nu a fost declarată greșită, nu ai în față o echipă care nu greșește niciodată. Ai în față un raport scris ca să nu deranjeze.",
            "Ca să existe cifrele astea în raport, trebuie să existe măsurarea în spatele lor: formulare care funcționează, telefoane numărate, evenimente de conversie legate de site. Dacă agenția spune că nu se poate măsura, de obicei înseamnă că nu s-a instalat ce trebuie.",
          ],
        },
        {
          heading: "O lună nu e un verdict",
          paragraphs: [
            "Există luni proaste din motive care nu țin de marketing: sezon, concurență, o piață care își ține banii. Judecă direcția pe trei sau șase luni, nu verdictul pe treizeci de zile. Întrebarea corectă nu e dacă luna a fost bună, ci dacă lucrurile se mișcă în direcția stabilită.",
            "Separă ce se acumulează de ce se resetează. Traficul din reclame se oprește când oprești bugetul. Dar există cifre care ar trebui să crească încet și constant dacă brandul chiar se construiește: câți oameni te caută pe nume, cât de ieftin ajunge o solicitare față de acum un an, câți clienți vin din recomandări. Alea sunt semnele că bugetul lunar lasă ceva în urmă.",
            "Dacă raportul tău lunar nu răspunde la întrebările din articolul ăsta, nu ai nevoie de alt raport. Ai nevoie de altă discuție cu cine îl scrie.",
          ],
        },
      ],
    },
    {
      slug: "un-singur-brand-pe-nisa",
      date: "17.06.2026",
      category: "Exclusivitate",
      title: "Ce se schimbă când agenția nu poate lucra cu concurenții tăi",
      dek: "Lucrăm cu un singur brand dintr-o nișă, în fiecare oraș. Nu e un gest de politețe. E o regulă care schimbă felul în care lucrează o agenție, și pentru cine lucrează de fapt.",
      readingTime: "5 min de citit",
      sections: [
        {
          heading: "Modelul obișnuit de agenție",
          paragraphs: [
            "O agenție obișnuită lucrează cu oricine plătește. Nu e o acuzație, e modelul de business: mai mulți clienți, mai multe contracte, mai multă predictibilitate. În practică, asta înseamnă că trei clinici din același oraș pot fi pe lista aceleiași agenții. Sau doi dealeri auto. Sau două pensiuni la zece minute una de alta.",
            "Nimeni nu ascunde asta. Din contră, portofoliul pe nișă e argument de vânzare: am mai lucrat cu clinici, știm ce funcționează. Doar că „știm ce funcționează” are o sursă: campaniile plătite de clinica dinaintea ta. Ce funcționează pentru tine luna asta devine material de prezentare pentru concurentul tău luna viitoare.",
          ],
        },
        {
          heading: "Stimulentele bat intențiile",
          paragraphs: [
            "Nu e nevoie de rea-credință ca lucrurile să alunece în direcția asta. E suficientă structura. O agenție care poate vinde din nou în nișa ta are tot interesul să transforme contul tău într-o rețetă repetabilă, pentru că rețeta se vinde ușor. Strategia ta devine template, pentru că template-ul aduce următorul client.",
            "Când agenția nu poate lua concurentul tău, calculul se întoarce. Singurul mod în care contul tău devine mai valoros e ca avantajul tău să crească. Nu există un al doilea client în nișa ta căruia să i se vândă ce am învățat cu tine. Interesul agenției și interesul tău ajung același lucru, prin structură, nu prin promisiuni.",
          ],
          quote: "Nu construim același avantaj pentru doi concurenți.",
        },
        {
          heading: "Ce înseamnă pentru tine",
          paragraphs: ["Concret, regula face patru lucruri."],
          bullets: [
            "Strategia construită pentru categoria ta rămâne a ta. Nu se reinterpretează pentru altcineva din același oraș.",
            "Cifrele tale nu educă un concurent. Ce învățăm din campaniile tale se aplică tot la tine.",
            "Refuzăm bani cât timp lucrăm împreună. Dacă un concurent direct ne caută, răspunsul e nu.",
            "Locul dintr-o nișă e ori liber, ori ocupat. Decizia devine mai puțin comodă, dar mult mai clară.",
          ],
        },
        {
          heading: "Ce să întrebi orice agenție, inclusiv pe noi",
          paragraphs: ["Trei întrebări scurte, înainte de orice contract."],
          bullets: [
            "Cu cine din nișa mea mai lucrați, în orașul meu sau în jurul lui?",
            "Ce se întâmplă cu strategia și cu materialele mele dacă ne oprim?",
            "Cine mai vede cifrele mele și testele plătite din bugetul meu?",
          ],
        },
      ],
    },
    {
      slug: "ce-este-un-sistem-de-brand",
      date: "08.04.2026",
      category: "Sisteme de brand",
      title: "Ce este un sistem de brand. Și ce nu este.",
      dek: "Folosim des cuvântul sistem, așa că îl punem pe hârtie: ce cuprinde, ce nu cuprinde și cum îți dai seama dacă brandul tău are unul.",
      readingTime: "6 min de citit",
      sections: [
        {
          heading: "Definiția scurtă",
          paragraphs: [
            "Un sistem de brand e un set de decizii luate o singură dată, aplicate apoi în tot ce comunici. Cine ești în piață. Cu cine concurezi. De ce te-ar alege cineva pe tine. Cum arăți, cum vorbești, ce rol are fiecare canal. Deciziile astea stau în scris, iar execuția le confirmă zi de zi: fiecare postare, pagină și campanie susține aceeași poziție.",
            "Partea a doua contează la fel de mult ca prima. Fără execuție, deciziile rămân un document frumos. Fără decizii, execuția devine producție pe bandă: se publică pentru că e marți, nu pentru că piesa aia are un rol.",
          ],
        },
        {
          heading: "Ce nu este un sistem de brand",
          paragraphs: ["E mai ușor de înțeles prin ce nu este."],
          bullets: [
            "Nu e un logo cu manual de identitate. Manualul spune cum arăți. Nu spune cine ești în piață și ce mesaj repeți.",
            "Nu e un calendar de postări. Calendarul umple luna. O poziție se construiește prin ce repeți, nu prin cât publici.",
            "Nu e o campanie de rebranding. Campania are început și sfârșit. Sistemul se vede tocmai în ce rămâne constant după ce campania se termină.",
            "Nu e un dosar de template-uri. Template-ul standardizează forma. Dacă direcția lipsește, standardizezi doar dezordinea.",
          ],
        },
        {
          heading: "Din ce e făcut",
          paragraphs: ["Șase piese, în ordinea în care se construiesc."],
          bullets: [
            "Poziționarea, în scris. Un document scurt care spune ce loc ocupi în piață și de ce. Toate celelalte decizii se verifică față de el.",
            "Identitatea: culoare, tipografie, fotografie, ton. Felul în care ești recunoscut înainte să-ți fie citit numele.",
            "Website-ul, construit în jurul unei acțiuni clare, nu ca o broșură care încearcă să spună tot.",
            "Contentul, care repetă poziția în forme diferite. Fiecare piesă are un rol, altfel nu se publică.",
            "Campaniile, care duc mai departe aceeași promisiune. Pagina pe care ajunge omul spune același lucru ca reclama pe care a apăsat.",
            "Măsurarea, legată de solicitări și de clienți, nu de aprecieri.",
          ],
          quote: "Identitatea vizuală începe cu logo-ul. Nu se termină acolo.",
        },
        {
          heading: "Cum îți dai seama că ai unul",
          paragraphs: [
            "Sunt câteva teste simple. Un om nou, angajat sau colaborator, poate decide din documentele existente ce publică și cum, fără să te întrebe pe tine la fiecare pas. Piesele făcute în luni diferite, puse una lângă alta, par construite de aceeași mână. Dacă oprești un canal o lună, mesajul nu se prăbușește, pentru că același mesaj trăiește și în celelalte.",
            "Mai e un semn, mai greu de măsurat: prețul tău începe să pară firesc. Felul în care arată și comunică brandul influențează cât de normal pare prețul pe care îl ceri. Când totul susține aceeași poziție, discuția despre preț se scurtează.",
            "Dacă testele astea pică, primul pas nu e un design nou. Primul pas e poziționarea, pusă în scris. Restul se construiește pe ea, nu invers.",
          ],
        },
      ],
    },
    {
      slug: "marketing-pe-bucati",
      date: "12.02.2026",
      category: "Strategie",
      title: "De ce nu funcționează marketingul cumpărat pe bucăți",
      dek: "O agenție pentru social media, un freelancer pentru website, altcineva pentru reclame. Fiecare își face treaba, și totuși brandul nu se leagă. Mecanismul e simplu și merită înțeles înainte să mai semnezi un contract.",
      readingTime: "6 min de citit",
      sections: [
        {
          heading: "Cum arată în practică",
          paragraphs: [
            "Situația e aceeași în aproape orice oraș. Postările le face o agenție de social media. Website-ul l-a construit un freelancer acum doi ani și de atunci nu s-a mai atins nimeni de el. Reclamele le gestionează altcineva, plătit cu un procent din buget. Logo-ul vine dintr-un proiect mai vechi, iar textele le scrie cine are timp în ziua aia.",
            "Fiecare dintre oamenii ăștia poate fi bun pe bucata lui. Problema nu e competența. Problema e că nimeni nu răspunde de direcție. Nimeni nu a decis, în scris, ce poziție vrea brandul în piață, cu cine concurează și de ce l-ar alege cineva. În lipsa deciziei ăsteia, fiecare furnizor decide singur, pentru bucata lui.",
          ],
        },
        {
          heading: "Fiecare furnizor e plătit pentru altceva",
          paragraphs: ["Uită-te la ce e plătit fiecare și restul se explică singur."],
          bullets: [
            "Agenția de social media e judecată pe aprecieri și pe reach, deci postează ce prinde la algoritm.",
            "Cel care rulează reclamele e judecat pe costul pe clic, deci împinge promisiunea care dă cel mai bine luna asta.",
            "Freelancerul de web a predat site-ul, a fost plătit și a trecut la următorul proiect.",
            "Nimeni nu e plătit să țină aceeași poziție în toate piesele astea.",
          ],
          quote: "Fiecare își face treaba bine. Doar că fiecare merge în altă direcție.",
        },
        {
          heading: "De ce nu se vede problema în niciun raport",
          paragraphs: [
            "Partea complicată e că fiecare furnizor îți poate arăta cifre bune. Reach-ul crește, costul pe clic e în regulă, site-ul a fost predat la timp. Luat bucată cu bucată, totul pare în ordine. De asta problema rezistă ani de zile: nu există un raport în care să devină vizibilă.",
            "Se vede în altă parte. Fiecare campanie pornește de la zero, pentru că nimic nu se repetă suficient cât să rămână în mintea oamenilor. Bugetul se cheltuie în fiecare lună, dar nu se acumulează nimic. După doi ani ai plătit zeci de facturi de marketing și ești cam în același punct: clienții vin din recomandări, iar reclamele merg doar cât timp plătești.",
          ],
        },
        {
          heading: "Testul de un minut",
          paragraphs: [
            "Pune-le una lângă alta: ultima postare, ultima reclamă, homepage-ul și ultimul material tipărit. Dacă par construite de aceeași mână și susțin același mesaj, ai un brand. Dacă fiecare pare să aparțină altei companii, ai doar mai mulți furnizori.",
            "Clientul tău face testul ăsta oricum, fără să-l numească test. Vede reclama, intră pe site, verifică pagina de Facebook și trage o concluzie despre cât de serios ești. Pentru el nu există agenția de social media, freelancerul și omul de la reclame. Pentru el, totul e același brand.",
          ],
        },
        {
          heading: "Ce rezolvă un sistem",
          paragraphs: [
            "Un sistem înseamnă că deciziile mari se iau o singură dată și apoi se aplică peste tot. Strategia stabilește ce poziție ocupi. Identitatea o face vizibilă. Website-ul o transformă în acțiune. Contentul și campaniile o repetă până când oamenii te rețin pentru un lucru anume. Fiecare canal are un rol, nu o viață proprie.",
            "Nu trebuie să schimbi tot dintr-o dată, și nici nu recomandăm asta. Ordinea contează mai mult decât viteza: întâi poziționarea, pusă în scris. Apoi aliniezi canalele unul câte unul, începând cu cel care îți aduce clienți acum. După câteva luni, piesele încep să tragă în aceeași direcție, iar bugetul de marketing începe să construiască ceva care rămâne.",
          ],
        },
      ],
    },
  ],
};

export const articlesContent: Record<Locale, ArticlesCopy> = { en, ro };
