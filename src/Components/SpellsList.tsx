import { useState } from "react";
import { useSpells } from "../hooks/useSpells";

export default function SpellsList() {
  const { spells, spellDetails, loading, fetchSpellDetails } = useSpells();
  const [index, setIndex] = useState(10);

  async function handleNext() {
    if (index < spells.length) {
      const newIndex = index + 10;
      setIndex(newIndex);
      await fetchSpellDetails(newIndex, spells);
    }
  }

  async function handlePrevious() {
    if (index > 10) {
      const newIndex = index - 10;
      setIndex(newIndex);
      await fetchSpellDetails(newIndex, spells);
    }
  }

  return (
    <div className="min-h-84">
      {!loading ? (
        <div>
          <h2>
            Spells {index - 9} - {Math.min(index, spells.length)}
          </h2>
          <div>
            <button
              type="button"
              onClick={handlePrevious}
              disabled={index <= 10}
            >
              Previous 10
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={index >= spells.length}
            >
              Next 10
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
