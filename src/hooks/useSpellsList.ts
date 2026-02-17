import { useQuery } from "@tanstack/react-query";
import type { Spell } from "../types/spell";

async function fetchSpells(levelSelect: string[] = []): Promise<Spell[]> {
  let url = "https://www.dnd5eapi.co/api/2014/spells";

  // Make url for level filtering
  if (levelSelect.length > 0) {
    const levelParams = levelSelect.map((level) => `level=${level}`).join("&");
    url += `?${levelParams}`;
  }

  const spellsRes = await fetch(url);
  if (!spellsRes.ok) {
    throw new Error(`Failed to fetch spells: ${spellsRes.statusText}`);
  }

  const spellsJson = await spellsRes.json();
  return spellsJson.results;
}

export function useSpellsList(
  levelSelect: string[] = [],
  //classSelect: string[] = [],
) {
  const { data: allSpells = [], isLoading: loading } = useQuery({
    queryKey: ["spells", levelSelect],
    queryFn: () => fetchSpells(levelSelect),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return { allSpells, loading };
}
