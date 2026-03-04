import { useState, useEffect, useCallback } from "react";
import type { SpellDetail } from "../types/spell";

const STORAGE_KEY = "pocket";

function loadFromStorage(): SpellDetail[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SpellDetail[]) : [];
  } catch {
    return [];
  }
}

export function usePocket() {
  const [pocketedSpells, setPocketedSpells] =
    useState<SpellDetail[]>(loadFromStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pocketedSpells));
  }, [pocketedSpells]);

  const togglePocket = useCallback((spell: SpellDetail) => {
    setPocketedSpells((prev) => {
      const exists = prev.some((s) => s.index === spell.index);
      return exists
        ? prev.filter((s) => s.index !== spell.index)
        : [...prev, spell];
    });
  }, []);

  const isInPocket = useCallback(
    (index: string) => pocketedSpells.some((s) => s.index === index),
    [pocketedSpells],
  );

  return { pocketedSpells, togglePocket, isInPocket };
}
