/* Copy for /apply, EN + RO. From the handoff package (src/lib/dictionaries.ts,
   `applyPage`), moved here so it sits with the rest of the subpage copy. */

const en = {
  meta: { title: "Work With Us | Epic Digital Hub", description: "We work with one brand per niche, per city. Tell us about your business and we'll check whether we can work together." },
  kicker: "Apply",
  title: "Good partnerships start with the right fit.",
  intro:
    "We work with one brand per niche, per city. Before discussing your project, we'll check whether your market is available and whether we're the right team for your business. Tell us a little about what you do and what you're looking to achieve. We'll take it from there.",
  fields: {
    name: "Your name",
    business: "Business name",
    city: "City",
    niche: "Industry / niche",
    website: "Website (if any)",
    goal: "Where do you want to go?",
    budget: "Monthly marketing budget (estimate)",
  },
  submit: "Check Availability",
  note: "We'll get back to you within two business days.",
  states: {
    checking: "Checking your category…",
    receivedTitle: "Your category is open.",
    receivedBody:
      "We got your application. Expect a straight answer within 2 working days.",
    takenTitle: "This category is already taken.",
    takenBody:
      "Someone already runs {niche} in {city} with us. We logged your details. If the seat opens up, you are first in line.",
    errorTitle: "Something went wrong.",
    errorBody: "The application did not go through. Try again in a moment.",
    retry: "Try again",
  },
};

const ro: typeof en = {
  meta: { title: "Aplică pentru colaborare | Epic Digital Hub", description: "Lucrăm cu un singur brand din fiecare nișă, în fiecare oraș. Verifică dacă putem colabora și primește un răspuns în maximum două zile lucrătoare." },
  kicker: "Aplică",
  title: "Mai putem colabora cu un brand din nișa ta?",
  intro: "Un singur brand pe nișă, pe oraș. Spune-ne unde joci și răspundem cu un da sau un nu clar.",
  fields: {
    name: "Numele tău",
    business: "Numele business-ului",
    city: "Orașul",
    niche: "Industria / nișa",
    website: "Website (dacă există)",
    goal: "Unde vrei să ajungi?",
    budget: "Buget lunar de marketing (estimare)",
  },
  submit: "Verifică disponibilitatea",
  note: "Îți răspundem în maximum două zile lucrătoare.",
  states: {
    checking: "Verificăm categoria ta…",
    receivedTitle: "Categoria ta e liberă.",
    receivedBody:
      "Am primit aplicația ta. Primești un răspuns clar în 2 zile lucrătoare.",
    takenTitle: "Categoria asta e deja ocupată.",
    takenBody:
      "Lucrăm deja pe {niche} în {city} cu alt brand. Ți-am salvat datele. Dacă se eliberează locul, ești primul pe listă.",
    errorTitle: "Ceva n-a mers.",
    errorBody: "Aplicația nu a trecut. Mai încearcă o dată.",
    retry: "Încearcă din nou",
  },
};

export const applyContent = { en, ro };
