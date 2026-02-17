import { useInfiniteQuery } from "@tanstack/react-query";
import type { Spell, SpellDetail } from "../types/spell";

async function fetchSpellDetails(spells: Spell[]): Promise<SpellDetail[]> {
  if (spells.length === 0) return [];

  const spellDetailsPromises = spells.map(async (spell: Spell) => {
    const detailRes = await fetch(
      `https://www.dnd5eapi.co/api/2014/spells/${spell.index}`,
    );
    return await detailRes.json();
  });

  return await Promise.all(spellDetailsPromises);
}

export function useInfiniteSpellDetails(
  allSpells: Spell[],
  pageSize: number = 20,
) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["infiniteSpellDetails", allSpells],
    queryFn: async ({ pageParam }) => {
      const startIndex = pageParam * pageSize;
      const endIndex = startIndex + pageSize;
      const spellsToFetch = allSpells.slice(startIndex, endIndex);

      return await fetchSpellDetails(spellsToFetch);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      // If last page was less than pageSize, we've reached the end
      if (lastPage.length < pageSize) return undefined;

      // Check if we have more spells to fetch
      const totalFetched = (lastPageParam + 1) * pageSize;
      if (totalFetched >= allSpells.length) return undefined;

      return lastPageParam + 1;
    },
    enabled: allSpells.length > 0,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 30 * 60 * 1000, // Keep cached data for 30 minutes
  });

  // Flatten all pages into a single array
  const spellDetails = data?.pages.flat() ?? [];

  return {
    spellDetails,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  };
}
