import { useState, useRef, useEffect, useMemo } from "react";
import { useSpellsList } from "../hooks/useSpellsList";
import { useInfiniteSpellDetails } from "../hooks/useSpellDetails";
import SpellCard from "./SpellCard";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Fuse from "fuse.js";

export default function SpellsList() {
  const [levelSelect, setLevelSelect] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { allSpells, loading: spellsLoading } = useSpellsList(levelSelect);

  // Configure Fuse.js for searching spell names only
  const fuse = useMemo(() => {
    if (!allSpells.length) return null;

    return new Fuse(allSpells, {
      keys: ["name"], // Only search in spell names
      threshold: 0.3, // Adjust for fuzzy matching sensitivity
      includeScore: true,
    });
  }, [allSpells]);

  // Filter spells based on search query
  const filteredSpells = useMemo(() => {
    if (!searchQuery.trim()) return allSpells;
    if (!fuse) return [];

    const results = fuse.search(searchQuery);
    return results.map((result) => result.item);
  }, [allSpells, fuse, searchQuery]);

  const {
    spellDetails,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: detailsLoading,
    isError,
    error,
  } = useInfiniteSpellDetails(filteredSpells);

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

  const loading = spellsLoading || detailsLoading;

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

        {/* Level Filter */}
        <ToggleGroup
          type="multiple"
          variant="outline"
          value={levelSelect}
          onValueChange={setLevelSelect}
          className="flex flex-wrap justify-center"
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
        {!loading ? (
          <div>
            <ul className="flex flex-col gap-2">
              {spellDetails.map((spell) => (
                <li key={spell.index}>
                  <SpellCard {...spell} />
                </li>
              ))}
            </ul>

            {/* Invisible trigger element for infinite scroll */}
            <div
              ref={loadMoreRef}
              className="flex h-10 items-center justify-center"
            >
              {isFetchingNextPage && (
                <div className="text-center">Loading more spells...</div>
              )}
              {!hasNextPage && spellDetails.length > 0 && (
                <div className="text-center text-gray-500">
                  All spells loaded!
                </div>
              )}
            </div>
          </div>
        ) : (
          <p>Loading spells ...</p>
        )}
      </div>
    </div>
  );
}
