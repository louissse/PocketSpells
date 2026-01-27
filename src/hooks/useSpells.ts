import { useState, useEffect } from "react";
import type { Spell, SpellDetail } from "../types/spell";

export function useSpells() {
  const [spells, setSpells] = useState<Spell[]>([]);
  const [spellDetails, setSpellDetails] = useState<SpellDetail[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchSpells() {
    const spellsRes = await fetch("https://www.dnd5eapi.co/api/2014/spells");
    const spellsJson = await spellsRes.json();
    setSpells(spellsJson.results);
    return spellsJson.results;
  }

  async function fetchSpellDetails(i: number, spellsList: Spell[]) {
    setLoading(true);
    const spellsToFetch = spellsList.slice(i - 10, i);
    const spellDetailsPromises = spellsToFetch.map(async (spell: Spell) => {
      const detailRes = await fetch(
        `https://www.dnd5eapi.co/api/2014/spells/${spell.index}`,
      );
      return await detailRes.json();
    });

    const details = await Promise.all(spellDetailsPromises);
    setSpellDetails(details);
    setLoading(false);
  }

  useEffect(() => {
    async function initializeSpells() {
      const spellsList = await fetchSpells();
      await fetchSpellDetails(10, spellsList);
    }
    initializeSpells();
  }, []);

  return {
    spells,
    spellDetails,
    loading,
    fetchSpellDetails,
  };
}
