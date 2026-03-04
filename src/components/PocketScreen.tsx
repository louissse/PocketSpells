import { useState, useMemo } from "react";
import { BookMarked } from "lucide-react";
import Fuse from "fuse.js";
import type { SpellDetail } from "../types/spell";
import SpellCard from "./SpellCard";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface PocketScreenProps {
  pocketedSpells: SpellDetail[];
  isInPocket: (index: string) => boolean;
  onTogglePocket: (spell: SpellDetail) => void;
}

function levelLabel(level: number) {
  if (level === 0) return "Cantrip";
  if (level === 1) return "1st";
  if (level === 2) return "2nd";
  if (level === 3) return "3rd";
  return `${level}th`;
}

export default function PocketScreen({
  pocketedSpells,
  isInPocket,
  onTogglePocket,
}: PocketScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [levelSelect, setLevelSelect] = useState<string[]>([]);

  // Sort by level ascending — always
  const sorted = useMemo(
    () => [...pocketedSpells].sort((a, b) => a.level - b.level),
    [pocketedSpells],
  );

  // Derive available levels from pocketed spells
  const availableLevels = useMemo(
    () => [...new Set(sorted.map((s) => s.level))],
    [sorted],
  );

  // Fuse instance over sorted spells
  const fuse = useMemo(() => {
    if (!sorted.length) return null;
    return new Fuse(sorted, { keys: ["name"], threshold: 0.3 });
  }, [sorted]);

  // Filtering pipeline: level → search
  const filteredSpells = useMemo(() => {
    let result = sorted;

    if (levelSelect.length > 0) {
      result = result.filter((s) => levelSelect.includes(String(s.level)));
    }

    if (searchQuery.trim() && fuse) {
      // Re-run fuse over the level-filtered set
      const scopedFuse = new Fuse(result, { keys: ["name"], threshold: 0.3 });
      result = scopedFuse.search(searchQuery).map((r) => r.item);
    }

    return result;
  }, [sorted, levelSelect, searchQuery, fuse]);

  function clearFilters() {
    setSearchQuery("");
    setLevelSelect([]);
  }

  // Empty pocket
  if (pocketedSpells.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
        <BookMarked className="text-muted-foreground/40 h-12 w-12" />
        <h2 className="text-foreground text-lg font-semibold">Your Pocket</h2>
        <p className="text-muted-foreground max-w-xs text-sm">
          Spells you pocket will appear here so you can access them quickly.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col items-start gap-4">
        {/* Search */}
        <div className="w-full">
          <input
            type="text"
            placeholder="Search spells by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Dynamic level filter */}
        {availableLevels.length > 1 && (
          <>
            <p className="text-right">Filters:</p>
            <ToggleGroup
              type="multiple"
              variant="outline"
              value={levelSelect}
              onValueChange={setLevelSelect}
              className="flex flex-wrap justify-start"
              size="sm"
              spacing={2}
            >
              {availableLevels.map((level) => (
                <ToggleGroupItem key={level} value={String(level)}>
                  {levelLabel(level)}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </>
        )}
      </div>

      {/* Spell list or no-match state */}
      <div className="py-6">
        {filteredSpells.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <p className="text-muted-foreground text-sm">
              No spells match your filters.
            </p>
            <button
              onClick={clearFilters}
              className="text-sm font-medium text-rose-500 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {filteredSpells.map((spell) => (
              <li key={spell.index}>
                <SpellCard
                  {...spell}
                  isInPocket={isInPocket(spell.index)}
                  onTogglePocket={onTogglePocket}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
