import { useState, useEffect, useCallback } from "react";
import type { SpellDetail } from "../types/spell";

const STORAGE_KEY = "custom-spells";

function loadFromStorage(): SpellDetail[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SpellDetail[]) : [];
  } catch {
    return [];
  }
}

export function useCustomSpells() {
  const [customSpells, setCustomSpells] =
    useState<SpellDetail[]>(loadFromStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customSpells));
  }, [customSpells]);

  const addCustomSpell = useCallback(
    (spell: Omit<SpellDetail, "index" | "url" | "updated_at" | "custom">) => {
      const newSpell: SpellDetail = {
        ...spell,
        index: `custom-${Date.now()}`,
        url: "",
        updated_at: new Date().toISOString(),
        custom: true,
      };
      setCustomSpells((prev) => [...prev, newSpell]);
      return newSpell;
    },
    [],
  );

  const updateCustomSpell = useCallback((updated: SpellDetail) => {
    setCustomSpells((prev) =>
      prev.map((s) =>
        s.index === updated.index ? { ...updated, custom: true } : s,
      ),
    );
  }, []);

  const deleteCustomSpell = useCallback((index: string) => {
    setCustomSpells((prev) => prev.filter((s) => s.index !== index));
  }, []);

  return { customSpells, addCustomSpell, updateCustomSpell, deleteCustomSpell };
}
