import { useState, useRef, useEffect } from "react";
import { useSpellCatalog } from "../hooks/useSpellCatalog";
import SpellCard, { SpellCardSkeleton } from "./SpellCard";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SpellDetail } from "../types/spell";

interface SpellCatalogScreenProps {
  isInPocket: (index: string) => boolean;
  onTogglePocket: (spell: SpellDetail) => void;
}

export default function SpellCatalogScreen({
  isInPocket,
  onTogglePocket,
}: SpellCatalogScreenProps) {
  const [levelSelect, setLevelSelect] = useState<string[]>([]);
  const [classSelect, setClassSelect] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    spellDetails,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    loading,
    isError,
    error,
  } = useSpellCatalog({
    levels: levelSelect,
    className: classSelect,
    searchQuery,
  });

  const loadMoreRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    const loadMoreElement = loadMoreRef.current;
    if (!loadMoreElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px", // Start loading 100px before element is visible
      },
    );

    observer.observe(loadMoreElement);

    return () => {
      observer.unobserve(loadMoreElement);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isError) {
    return (
      <div className="min-h-84 p-6">
        <div>Error loading spells: {error?.message}</div>
      </div>
    );
  }

  return (
    <div className="min-h-84 p-6">
      <div className="flex flex-col items-center gap-4">
        {/* Search Input */}
        <div className="w-full max-w-md">
          <input
            type="text"
            placeholder="Search spells by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        {/* Class Filter */}
        <div className="w-full max-w-md">
          <Select
            value={classSelect || "all"}
            onValueChange={(value) =>
              setClassSelect(value === "all" ? null : value)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              <SelectItem value="bard">Bard</SelectItem>
              <SelectItem value="cleric">Cleric</SelectItem>
              <SelectItem value="druid">Druid</SelectItem>
              <SelectItem value="paladin">Paladin</SelectItem>
              <SelectItem value="ranger">Ranger</SelectItem>
              <SelectItem value="sorcerer">Sorcerer</SelectItem>
              <SelectItem value="warlock">Warlock</SelectItem>
              <SelectItem value="wizard">Wizard</SelectItem>
            </SelectContent>
          </Select>
        </div>{" "}
        <p className="self-start text-right">Filters:</p>
        {/* Level Filter */}
        <ToggleGroup
          type="multiple"
          variant="outline"
          value={levelSelect}
          onValueChange={setLevelSelect}
          className="flex flex-wrap justify-start"
          size="sm"
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
      <div className="py-6">
        <div>
          <ul className="flex flex-col gap-2">
            {/* Show actual spell cards */}
            {spellDetails.map((spell) => (
              <li key={spell.index}>
                <SpellCard
                  {...spell}
                  selectedClass={classSelect}
                  isInPocket={isInPocket(spell.index)}
                  onTogglePocket={onTogglePocket}
                />
              </li>
            ))}

            {/* Show skeleton loaders when loading more or initial load */}
            {(loading || isFetchingNextPage) &&
              Array.from({ length: 7 }).map((_, index) => (
                <li key={`skeleton-${index}`}>
                  <SpellCardSkeleton />
                </li>
              ))}
          </ul>

          {/* Invisible trigger element for infinite scroll */}
          <div
            ref={loadMoreRef}
            className="flex h-10 items-center justify-center"
          >
            {!hasNextPage && spellDetails.length > 0 && !loading && (
              <div className="text-center text-gray-500">
                All spells loaded!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
