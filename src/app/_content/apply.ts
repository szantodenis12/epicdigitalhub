/* Copy for /apply, EN + RO. From the handoff package (src/lib/dictionaries.ts,
   `applyPage`), moved here so it sits with the rest of the subpage copy. */

const en = {
  kicker: "Apply",
  title: "If your category is still available, let us talk.",
  intro: "One brand per niche, per city. Tell us where you play and we will answer with a straight yes or no.",
  fields: {
    name: "Your name",
    business: "Business name",
    city: "City",
    niche: "Industry / niche",
    website: "Website (if any)",
    goal: "Where do you want to go?",
    budget: "Monthly marketing budget (estimate)",
  },
  submit: "Check availability",
  note: "We answer within 2 working days.",
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
  kicker: "Aplică",
  title: "Dacă în categoria ta mai e loc, hai să vorbim.",
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
  note: "Răspundem în 2 zile lucrătoare.",
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
