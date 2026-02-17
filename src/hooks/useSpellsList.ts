import { useQuery } from "@tanstack/react-query";
import type { Spell } from "../types/spell";

async function fetchSpells(
  levelSelect: string[] = [],
  classSelect: string | null = null,
): Promise<Spell[]> {
  let url = "https://www.dnd5eapi.co/api/2014/spells";

  // If class is selected, get spells for that class
  if (classSelect) {
    url = `https://www.dnd5eapi.co/api/2014/classes/${classSelect}/spells`;
  } else if (levelSelect.length > 0) {
    // Only apply level filtering to URL if no class is selected
    const levelParams = levelSelect.map((level) => `level=${level}`).join("&");
    url += `?${levelParams}`;
  }

  const spellsRes = await fetch(url);
  if (!spellsRes.ok) {
    throw new Error(`Failed to fetch spells: ${spellsRes.statusText}`);
  }

  const spellsJson = await spellsRes.json();
  let spells = spellsJson.results;

  // If class is selected and levels are specified, filter client-side
  if (classSelect && levelSelect.length > 0) {
    spells = spells.filter((spell: Spell) =>
      levelSelect.includes(spell.level.toString()),
    );
  }

  return spells;
}

export function useSpellsList(
  levelSelect: string[] = [],
  classSelect: string | null = null,
) {
  const { data: allSpells = [], isLoading: loading } = useQuery({
    queryKey: ["spells", levelSelect, classSelect],
    queryFn: () => fetchSpells(levelSelect, classSelect),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return { allSpells, loading };
}
