import { useState } from "react";
import { useSpellsList } from "../hooks/useSpellsList";
import { useSpellDetails } from "../hooks/useSpellDetails";
import SpellCard from "./SpellCard";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const spellsToLoad = 20;

export default function SpellsList() {
  const [index, setIndex] = useState(spellsToLoad);
  const [levelSelect, setLevelSelect] = useState([]);
  const [classSelect, setClassSelect] = useState([]);
  const { spells, loading: spellsLoading } = useSpellsList(
    levelSelect,
    classSelect,
  );
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
    <div className="min-h-84 p-6">
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
          <div className="flex flex-col items-center">
            <ToggleGroup
              type="multiple"
              variant="outline"
              value={levelSelect}
              onValueChange={setLevelSelect}
              className="flex flex-wrap justify-center"
              size="s"
              spacing={2}
            >
              <ToggleGroupItem value="0">Cantrip</ToggleGroupItem>
              <ToggleGroupItem value="1">1st</ToggleGroupItem>
              <ToggleGroupItem value="2">2nd</ToggleGroupItem>
              <ToggleGroupItem value="3">3rd</ToggleGroupItem>
              <ToggleGroupItem value="4">4th</ToggleGroupItem>
              <ToggleGroupItem value="5">5th</ToggleGroupItem>
              <ToggleGroupItem value="6">6th</ToggleGroupItem>
              <ToggleGroupItem value="7">7th</ToggleGroupItem>
              <ToggleGroupItem value="8">8th</ToggleGroupItem>
              <ToggleGroupItem value="9">9th</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <ul className="flex flex-col gap-2 py-6">
            {spellDetails.map((spell) => (
              <li key={spell.index}>
                <SpellCard {...spell} />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading spells ...</p>
      )}
    </div>
  );
}
