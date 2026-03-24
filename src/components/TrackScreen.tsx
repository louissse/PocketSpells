import { useState, useEffect } from "react";
import { Circle, Pencil, Save } from "lucide-react";
import { Input } from "@/components/ui/input";

type SpellSlots = {
  [key: number]: { total: number; used: boolean[] };
};

const STORAGE_KEY = "spell-slots";

function loadFromStorage(): SpellSlots {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SpellSlots) : getDefaultSpellSlots();
  } catch {
    return getDefaultSpellSlots();
  }
}

function getDefaultSpellSlots(): SpellSlots {
  return {
    1: { total: 4, used: [false, false, false, false] },
    2: { total: 2, used: [false, false] },
    3: { total: 0, used: [] },
    4: { total: 0, used: [] },
    5: { total: 0, used: [] },
    6: { total: 0, used: [] },
    7: { total: 0, used: [] },
    8: { total: 0, used: [] },
    9: { total: 0, used: [] },
  };
}

export default function TrackScreen() {
  const [spellSlots, setSpellSlots] = useState<SpellSlots>(loadFromStorage);
  const [editing, setEditing] = useState(false);

  // Save to localStorage whenever spellSlots changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(spellSlots));
  }, [spellSlots]);

  const toggleSlot = (level: number, slotIndex: number) => {
    setSpellSlots((prev) => ({
      ...prev,
      [level]: {
        ...prev[level],
        used: prev[level].used.map((isUsed, i) =>
          i === slotIndex ? !isUsed : isUsed,
        ),
      },
    }));
  };

  const updateTotal = (level: number, newTotal: number) => {
    // Ensure newTotal is not negative
    const validTotal = Math.max(0, newTotal);

    setSpellSlots((prev) => {
      const currentUsed = prev[level].used;
      let newUsed: boolean[];

      if (validTotal > currentUsed.length) {
        // Adding slots - add false values for new slots
        newUsed = [
          ...currentUsed,
          ...Array(validTotal - currentUsed.length).fill(false),
        ];
      } else {
        // Removing slots - keep only the first validTotal slots
        newUsed = currentUsed.slice(0, validTotal);
      }

      return {
        ...prev,
        [level]: {
          total: validTotal,
          used: newUsed,
        },
      };
    });
  };

  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <h1 className="text-left text-2xl font-bold">
        Spell slots{" "}
        <button
          onClick={() => setEditing(!editing)}
          className="text-muted-foreground transition-colors hover:text-violet-500"
          aria-label="Edit spell"
        >
          {editing ? (
            <Save className="h-5 w-5 text-rose-500" />
          ) : (
            <Pencil className="h-5 w-5" />
          )}
        </button>
      </h1>
      <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2">
        {Object.entries(spellSlots).map(([level, { total, used }]) => (
          <>
            {!editing && total === 0 ? null : (
              <div key={`label-${level}`} className="text-lg font-medium">
                Level {level}:
              </div>
            )}
            {editing ? (
              <div className="justify-self-start" key={`input-${level}`}>
                <Input
                  type="number"
                  min="0"
                  max="20"
                  value={total === 0 ? "" : total}
                  onChange={(e) =>
                    updateTotal(+level, parseInt(e.target.value) || 0)
                  }
                  className="w-20"
                />
              </div>
            ) : (
              <div key={`slots-${level}`} className="flex gap-2">
                {Array.from({ length: total }, (_, i) => (
                  <Circle
                    key={i}
                    className={`cursor-pointer ${
                      used[i] ? "fill-rose-500 text-rose-600" : "text-slate-400"
                    }`}
                    onClick={() => toggleSlot(+level, i)}
                  />
                ))}
              </div>
            )}
          </>
        ))}
      </div>
    </div>
  );
}
