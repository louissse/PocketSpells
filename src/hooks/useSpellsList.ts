import { useState, useEffect } from "react";
import type { Spell } from "../types/spell";

export function useSpellsList(
  levelSelect: string[] = [],
  //classSelect: string[] = [],
) {
  const [spells, setSpells] = useState<Spell[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSpells() {
      setLoading(true);

      let url = "https://www.dnd5eapi.co/api/2014/spells";
      //make url for level
      if (levelSelect.length > 0) {
        const levelParams = levelSelect
          .map((level) => `level=${level}`)
          .join("&");
        url += `?${levelParams}`;
      }

      const spellsRes = await fetch(url);
      const spellsJson = await spellsRes.json();
      setSpells(spellsJson.results);
      setLoading(false);
    }
    fetchSpells();
  }, [levelSelect]);

  return { spells, loading };
}
