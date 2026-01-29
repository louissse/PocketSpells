import { useState } from "react";
import { useSpellsList } from "../hooks/useSpellsList";
import { useSpellDetails } from "../hooks/useSpellDetails";

const spellsToLoad = 20;

export default function SpellsList() {
  const { spells, loading: spellsLoading } = useSpellsList();
  const [index, setIndex] = useState(spellsToLoad);
  const { spellDetails, loading: detailsLoading } = useSpellDetails(
    spells,
    index,
    spellsToLoad,
  );

  function handleNext() {
    if (index < spells.length) {
      setIndex(index + spellsToLoad);
    }
  }

  function handlePrevious() {
    if (index > spellsToLoad) {
      setIndex(index - spellsToLoad);
    }
  }

  const loading = spellsLoading || detailsLoading;

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
