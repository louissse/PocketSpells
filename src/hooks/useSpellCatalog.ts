import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import Fuse from "fuse.js";
import type { Spell, SpellDetail } from "../types/spell";

type UseSpellCatalogOptions = {
  levels?: string[];
  className?: string | null;
  searchQuery?: string;
  pageSize?: number;
};

async function fetchSpells(
  levels: string[] = [],
  className: string | null = null,
): Promise<Spell[]> {
  let url = "https://www.dnd5eapi.co/api/2014/spells";

  if (className) {
    url = `https://www.dnd5eapi.co/api/2014/classes/${className}/spells`;
  } else if (levels.length > 0) {
    const levelParams = levels.map((level) => `level=${level}`).join("&");
    url += `?${levelParams}`;
  }

  const spellsRes = await fetch(url);
  if (!spellsRes.ok) {
    throw new Error(`Failed to fetch spells: ${spellsRes.statusText}`);
  }

  const spellsJson = await spellsRes.json();
  let spells = spellsJson.results as Spell[];

  if (className && levels.length > 0) {
    spells = spells.filter((spell) => levels.includes(spell.level.toString()));
  }

  return spells;
}

async function fetchSpellDetails(spells: Spell[]): Promise<SpellDetail[]> {
  if (spells.length === 0) return [];

  const spellDetailsPromises = spells.map(async (spell) => {
    const detailRes = await fetch(
      `https://www.dnd5eapi.co/api/2014/spells/${spell.index}`,
    );
    if (!detailRes.ok) {
      throw new Error(`Failed to fetch spell details: ${detailRes.statusText}`);
    }
    return (await detailRes.json()) as SpellDetail;
  });

  return await Promise.all(spellDetailsPromises);
}

export function useSpellCatalog({
  levels = [],
  className = null,
  searchQuery = "",
  pageSize = 20,
}: UseSpellCatalogOptions) {
  const {
    data: allSpells = [],
    isLoading: spellsLoading,
    isError: isSpellsError,
    error: spellsError,
  } = useQuery({
    queryKey: ["spells", levels, className],
    queryFn: () => fetchSpells(levels, className),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const fuse = useMemo(() => {
    if (!allSpells.length) return null;

    return new Fuse(allSpells, {
      keys: ["name"],
      threshold: 0.3,
      includeScore: true,
    });
  }, [allSpells]);

  const filteredSpells = useMemo(() => {
    if (!searchQuery.trim()) return allSpells;
    if (!fuse) return [];

    return fuse.search(searchQuery).map((result) => result.item);
  }, [allSpells, fuse, searchQuery]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: detailsLoading,
    isError: isDetailsError,
    error: detailsError,
  } = useInfiniteQuery({
    queryKey: ["infiniteSpellDetails", filteredSpells, pageSize],
    queryFn: async ({ pageParam }) => {
      const startIndex = pageParam * pageSize;
      const endIndex = startIndex + pageSize;
      const spellsToFetch = filteredSpells.slice(startIndex, endIndex);

      return await fetchSpellDetails(spellsToFetch);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.length < pageSize) return undefined;

      const totalFetched = (lastPageParam + 1) * pageSize;
      if (totalFetched >= filteredSpells.length) return undefined;

      return lastPageParam + 1;
    },
    enabled: filteredSpells.length > 0,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  return {
    spellDetails: data?.pages.flat() ?? [],
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    loading: spellsLoading || detailsLoading,
    isError: isSpellsError || isDetailsError,
    error: spellsError ?? detailsError,
  };
}
