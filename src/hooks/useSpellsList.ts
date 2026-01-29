import { useState, useEffect } from "react";
import type { Spell } from "../types/spell";

export function useSpellsList() {
  const [spells, setSpells] = useState<Spell[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSpells() {
      const spellsRes = await fetch("https://www.dnd5eapi.co/api/2014/spells");
      const spellsJson = await spellsRes.json();
      setSpells(spellsJson.results);
      setLoading(false);
    }
    fetchSpells();
  }, []);

  return { spells, loading };
}
