import { useQuery } from "@tanstack/react-query";
import type { Spell, SpellDetail } from "../types/spell";

async function fetchSpellDetails(spells: Spell[]): Promise<SpellDetail[]> {
  const spellDetailsPromises = spells.map(async (spell: Spell) => {
    const detailRes = await fetch(
      `https://www.dnd5eapi.co/api/2014/spells/${spell.index}`,
    );
    return await detailRes.json();
  });

  return await Promise.all(spellDetailsPromises);
}

export function useSpellDetails(
  spells: Spell[],
  startIndex: number,
  count: number,
) {
  const spellsToFetch = spells.slice(startIndex - count, startIndex);

  const { data: spellDetails = [], isLoading: loading } = useQuery({
    queryKey: ["spellDetails", startIndex, count, spellsToFetch],
    queryFn: () => fetchSpellDetails(spellsToFetch),
    enabled: spells.length > 0,
    staleTime: 24 * 60 * 60 * 1000, // 5 minutes
  });

  return { spellDetails, loading };
}
