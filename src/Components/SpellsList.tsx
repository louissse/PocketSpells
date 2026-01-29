import { useState } from "react";
import { useSpells } from "../hooks/useSpells";

const spellsToLoad = 20;

export default function SpellsList() {
  const { spells, spellDetails, loading, fetchSpellDetails } =
    useSpells(spellsToLoad);
  const [index, setIndex] = useState(spellsToLoad);

  async function handleNext() {
    if (index < spells.length) {
      const newIndex = index + spellsToLoad;
      setIndex(newIndex);
      await fetchSpellDetails(newIndex, spells);
    }
  }

  async function handlePrevious() {
    if (index > spellsToLoad) {
      const newIndex = index - spellsToLoad;
      setIndex(newIndex);
      await fetchSpellDetails(newIndex, spells);
    }
  }

  return (
    <div className="min-h-84">
      {!loading ? (
        <div>
          <h2>
            Spells {index - (spellsToLoad - 1)} -{" "}
            {Math.min(index, spells.length)}
          </h2>
          <div>
            <button
              type="button"
              onClick={handlePrevious}
              disabled={index <= spellsToLoad}
            >
              Previous {spellsToLoad}
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={index >= spells.length}
            >
              Next {spellsToLoad}
            </button>
          </div>
          <ul className="">
            {spellDetails.map((spell) => (
              <li key={spell.index}>{spell.name}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading spells ...</p>
      )}
    </div>
  );
}
