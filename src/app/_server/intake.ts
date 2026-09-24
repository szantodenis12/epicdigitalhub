/* Niche availability check for /apply, from the handoff package's
   src/lib/intake.ts - same matching, reading the list from the store. */

import { getTakenNiches, type TakenNiche } from "./store";

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics so "Oradea" == "oradea"
    .toLowerCase()
    .trim();
}

/** A seat conflicts when the same city AND an overlapping niche are already
    taken. Loose containment match, so "stomatologie" hits "clinica
    stomatologie" and vice versa. */
export async function findConflict(city: string, niche: string): Promise<TakenNiche | null> {
  const c = normalize(city);
  const n = normalize(niche);
  if (!c || !n) return null;

  const taken = await getTakenNiches();
  return (
    taken.find((t) => {
      const tc = normalize(t.city);
      const tn = normalize(t.niche);
      const sameCity = tc === c || tc.includes(c) || c.includes(tc);
      const sameNiche = tn === n || tn.includes(n) || n.includes(tn);
      return sameCity && sameNiche;
    }) ?? null
  );
}
