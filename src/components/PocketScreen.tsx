import { useState, useMemo } from "react";
import { BookMarked, Plus } from "lucide-react";
import Fuse from "fuse.js";
import type { SpellDetail } from "../types/spell";
import SpellCard from "./SpellCard";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import CustomSpellForm from "./CustomSpellForm";

interface PocketScreenProps {
  pocketedSpells: SpellDetail[];
  isInPocket: (index: string) => boolean;
  onTogglePocket: (spell: SpellDetail) => void;
  customSpells: SpellDetail[];
  onAddCustomSpell: (
    spell: Omit<SpellDetail, "index" | "url" | "updated_at" | "custom">,
  ) => SpellDetail;
  onUpdateCustomSpell: (spell: SpellDetail) => void;
  onDeleteCustomSpell: (index: string) => void;
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
  customSpells,
  onAddCustomSpell,
  onUpdateCustomSpell,
  onDeleteCustomSpell,
}: PocketScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [levelSelect, setLevelSelect] = useState<string[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingSpell, setEditingSpell] = useState<SpellDetail | undefined>(
    undefined,
  );

  // Merge pocketed API spells + custom spells, sort by level
  const allSpells = useMemo(() => {
    const merged = [...pocketedSpells, ...customSpells];
    return merged.sort((a, b) => a.level - b.level);
  }, [pocketedSpells, customSpells]);

  // Derive available levels from merged list
  const availableLevels = useMemo(
    () => [...new Set(allSpells.map((s) => s.level))],
    [allSpells],
  );

  // Filtering pipeline: level → search
  const filteredSpells = useMemo(() => {
    let result = allSpells;

    if (levelSelect.length > 0) {
      result = result.filter((s) => levelSelect.includes(String(s.level)));
    }

    if (searchQuery.trim()) {
      const scopedFuse = new Fuse(result, { keys: ["name"], threshold: 0.3 });
      result = scopedFuse.search(searchQuery).map((r) => r.item);
    }

    return result;
  }, [allSpells, levelSelect, searchQuery]);

  function clearFilters() {
    setSearchQuery("");
    setLevelSelect([]);
  }

  function openAdd() {
    setEditingSpell(undefined);
    setSheetOpen(true);
  }

  function openEdit(spell: SpellDetail) {
    setEditingSpell(spell);
    setSheetOpen(true);
  }

  function handleFormSubmit(
    data: Omit<SpellDetail, "index" | "url" | "updated_at" | "custom">,
  ) {
    if (editingSpell) {
      onUpdateCustomSpell({ ...editingSpell, ...data });
    } else {
      onAddCustomSpell(data);
    }
    setSheetOpen(false);
    setEditingSpell(undefined);
  }

  // Empty pocket (no API spells pocketed and no custom spells)
  if (allSpells.length === 0) {
    return (
      <>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent
            side="bottom"
            className="max-h-[92dvh] overflow-y-auto rounded-t-xl"
          >
            <SheetHeader>
              <SheetTitle>
                {editingSpell
                  ? "Edit spell"
                  : "Add a custom spell to your pocket"}
              </SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <CustomSpellForm
                initialValues={editingSpell}
                onSubmit={handleFormSubmit}
                onCancel={() => setSheetOpen(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
          <BookMarked className="text-muted-foreground/40 h-12 w-12" />
          <h2 className="text-foreground text-lg font-semibold">Your Pocket</h2>
          <p className="text-muted-foreground max-w-xs text-sm">
            Spells you pocket will appear here so you can access them quickly.
          </p>
          <button
            onClick={openAdd}
            className="mt-2 flex items-center gap-2 rounded-md bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-600"
          >
            <Plus className="h-4 w-4" />
            Add a custom spell to your pocket
          </button>
        </div>
      </>
    );
  }

  return (
    <>
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
              {/* Add custom spell button at top of list */}
              <li>
                <button
                  onClick={openAdd}
                  className="text-muted-foreground flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-gray-300 py-3 text-sm font-medium transition-colors hover:border-rose-400 hover:text-rose-500"
                >
                  <Plus className="h-4 w-4" />
                  Add a custom spell to your pocket
                </button>
              </li>
              {filteredSpells.map((spell) => (
                <li key={spell.index}>
                  <SpellCard
                    {...spell}
                    isInPocket={isInPocket(spell.index)}
                    onTogglePocket={spell.custom ? undefined : onTogglePocket}
                    onEdit={spell.custom ? () => openEdit(spell) : undefined}
                    onDelete={
                      spell.custom
                        ? () => onDeleteCustomSpell(spell.index)
                        : undefined
                    }
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[92dvh] overflow-y-auto rounded-t-xl"
        >
          <SheetHeader>
            <SheetTitle>
              {editingSpell
                ? "Edit spell"
                : "Add a custom spell to your pocket"}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <CustomSpellForm
              initialValues={editingSpell}
              onSubmit={handleFormSubmit}
              onCancel={() => setSheetOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
