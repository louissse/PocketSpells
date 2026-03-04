import { useState } from "react";
import type { SpellDetail } from "../types/spell";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SCHOOLS = [
  "Abjuration",
  "Conjuration",
  "Divination",
  "Enchantment",
  "Evocation",
  "Illusion",
  "Necromancy",
  "Transmutation",
];

const DAMAGE_TYPES = [
  "Acid",
  "Bludgeoning",
  "Cold",
  "Fire",
  "Force",
  "Lightning",
  "Necrotic",
  "Piercing",
  "Poison",
  "Psychic",
  "Radiant",
  "Slashing",
  "Thunder",
];

const SAVING_THROWS = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

const AOE_TYPES = ["Sphere", "Cube", "Cone", "Line", "Cylinder"];

const CLASSES = [
  "Bard",
  "Cleric",
  "Druid",
  "Paladin",
  "Ranger",
  "Sorcerer",
  "Warlock",
  "Wizard",
];

type FormData = {
  name: string;
  level: number;
  school: string;
  casting_time: string;
  duration: string;
  range: string;
  concentration: boolean;
  ritual: boolean;
  components: string[];
  material: string;
  desc: string;
  damage_type: string;
  damage_dice: string;
  aoe_type: string;
  aoe_size: string;
  saving_throw: string;
  classes: string[];
};

const EMPTY_FORM: FormData = {
  name: "",
  level: 1,
  school: "Evocation",
  casting_time: "1 action",
  duration: "Instantaneous",
  range: "",
  concentration: false,
  ritual: false,
  components: [],
  material: "",
  desc: "",
  damage_type: "",
  damage_dice: "",
  aoe_type: "",
  aoe_size: "",
  saving_throw: "",
  classes: [],
};

function spellToForm(spell: SpellDetail): FormData {
  return {
    name: spell.name,
    level: spell.level,
    school: spell.school.name,
    casting_time: spell.casting_time,
    duration: spell.duration,
    range: spell.range,
    concentration: spell.concentration,
    ritual: spell.ritual,
    components: spell.components ?? [],
    material: spell.material ?? "",
    desc: spell.desc?.join("\n\n") ?? "",
    damage_type: spell.damage?.damage_type?.name ?? "",
    damage_dice:
      Object.values(spell.damage?.damage_at_slot_level ?? {})[0] ??
      Object.values(spell.damage?.damage_at_character_level ?? {})[0] ??
      "",
    aoe_type: spell.area_of_effect?.type ?? "",
    aoe_size: spell.area_of_effect?.size
      ? String(spell.area_of_effect.size)
      : "",
    saving_throw: spell.dc?.dc_type?.index?.toUpperCase() ?? "",
    classes: spell.classes?.map((c) => c.name) ?? [],
  };
}

interface CustomSpellFormProps {
  initialValues?: SpellDetail;
  onSubmit: (
    data: Omit<SpellDetail, "index" | "url" | "updated_at" | "custom">,
  ) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

const labelClass = "block text-sm font-medium text-gray-700 mb-1";
const sectionClass = "flex flex-col gap-1";

export default function CustomSpellForm({
  initialValues,
  onSubmit,
  onCancel,
  onDelete,
}: CustomSpellFormProps) {
  const [form, setForm] = useState<FormData>(
    initialValues ? spellToForm(initialValues) : EMPTY_FORM,
  );
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function toggleArrayItem(key: "components" | "classes", value: string) {
    setForm((prev) => {
      const arr = prev[key] as string[];
      return {
        ...prev,
        [key]: arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      };
    });
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.casting_time.trim())
      newErrors.casting_time = "Casting time is required";
    if (!form.duration.trim()) newErrors.duration = "Duration is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const schoolIndex = form.school.toLowerCase();

    const spell: Omit<SpellDetail, "index" | "url" | "updated_at" | "custom"> =
      {
        name: form.name.trim(),
        level: form.level,
        school: { index: schoolIndex, name: form.school, url: "" },
        casting_time: form.casting_time.trim(),
        duration: form.duration.trim(),
        range: form.range.trim(),
        concentration: form.concentration,
        ritual: form.ritual,
        components: form.components,
        material: form.material.trim(),
        desc: form.desc.trim() ? form.desc.trim().split("\n\n") : [],
        higher_level: [],
        attack_type: "",
        damage: form.damage_type
          ? {
              damage_type: {
                index: form.damage_type.toLowerCase(),
                name: form.damage_type,
                url: "",
              },
              damage_at_slot_level: form.damage_dice
                ? { custom: form.damage_dice.trim() }
                : {},
              damage_at_character_level: {},
            }
          : (undefined as unknown as SpellDetail["damage"]),
        area_of_effect:
          form.aoe_type && form.aoe_size
            ? { type: form.aoe_type.toLowerCase(), size: Number(form.aoe_size) }
            : (undefined as unknown as SpellDetail["area_of_effect"]),
        dc: form.saving_throw
          ? {
              dc_type: {
                index: form.saving_throw.toLowerCase(),
                name: form.saving_throw,
                url: "",
              },
              dc_success: "none",
              desc: "",
            }
          : (undefined as unknown as SpellDetail["dc"]),
        classes: form.classes.map((c) => ({
          index: c.toLowerCase(),
          name: c,
          url: "",
        })),
        subclasses: [],
      };

    onSubmit(spell);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6 pb-8">
      {/* Name */}
      <div className={sectionClass}>
        <label className={labelClass}>
          Name <span className="text-rose-500">*</span>
        </label>
        <Input
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="Dissonant Whispers"
        />
        {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
      </div>

      {/* Level + School */}
      <div className="grid grid-cols-2 gap-3">
        <div className={sectionClass}>
          <label className={labelClass}>Level</label>
          <Select
            value={String(form.level)}
            onValueChange={(v) => set("level", Number(v))}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Cantrip</SelectItem>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((l) => (
                <SelectItem key={l} value={String(l)}>
                  Level {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className={sectionClass}>
          <label className={labelClass}>School</label>
          <Select value={form.school} onValueChange={(v) => set("school", v)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SCHOOLS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Casting time + Duration */}
      <div className="grid grid-cols-2 gap-3">
        <div className={sectionClass}>
          <label className={labelClass}>
            Casting time <span className="text-rose-500">*</span>
          </label>
          <Input
            value={form.casting_time}
            onChange={(e) => set("casting_time", e.target.value)}
            placeholder="1 action"
          />
          {errors.casting_time && (
            <p className="text-xs text-rose-500">{errors.casting_time}</p>
          )}
        </div>
        <div className={sectionClass}>
          <label className={labelClass}>
            Duration <span className="text-rose-500">*</span>
          </label>
          <Input
            value={form.duration}
            onChange={(e) => set("duration", e.target.value)}
            placeholder="Instantaneous"
          />
          {errors.duration && (
            <p className="text-xs text-rose-500">{errors.duration}</p>
          )}
        </div>
      </div>

      {/* Range */}
      <div className={sectionClass}>
        <label className={labelClass}>Range</label>
        <Input
          value={form.range}
          onChange={(e) => set("range", e.target.value)}
          placeholder="60 feet"
        />
      </div>

      {/* Components */}
      <div className={sectionClass}>
        <label className={labelClass}>Components</label>
        <div className="flex gap-4">
          {["V", "S", "M"].map((c) => (
            <label key={c} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.components.includes(c)}
                onChange={() => toggleArrayItem("components", c)}
                className="accent-rose-500"
              />
              {c}
            </label>
          ))}
        </div>
        {form.components.includes("M") && (
          <Input
            className="mt-2"
            value={form.material}
            onChange={(e) => set("material", e.target.value)}
            placeholder="Material component description..."
          />
        )}
      </div>

      {/* Concentration + Ritual */}
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.concentration}
            onChange={(e) => set("concentration", e.target.checked)}
            className="accent-rose-500"
          />
          Concentration
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.ritual}
            onChange={(e) => set("ritual", e.target.checked)}
            className="accent-rose-500"
          />
          Ritual
        </label>
      </div>

      {/* Description */}
      <div className={sectionClass}>
        <label className={labelClass}>Description</label>
        <Textarea
          className="min-h-24 resize-y"
          value={form.desc}
          onChange={(e) => set("desc", e.target.value)}
          placeholder="Describe the spell effect..."
        />
      </div>

      {/* Damage type + dice */}
      <div className="grid grid-cols-2 gap-3">
        <div className={sectionClass}>
          <label className={labelClass}>Damage type</label>
          <Select
            value={form.damage_type}
            onValueChange={(v) => set("damage_type", v === "none" ? "" : v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="None" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {DAMAGE_TYPES.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {form.damage_type && (
          <div className={sectionClass}>
            <label className={labelClass}>Damage dice</label>
            <Input
              value={form.damage_dice}
              onChange={(e) => set("damage_dice", e.target.value)}
              placeholder="2d8"
            />
          </div>
        )}
      </div>

      {/* Area of effect */}
      <div className="grid grid-cols-2 gap-3">
        <div className={sectionClass}>
          <label className={labelClass}>Area of effect</label>
          <Select
            value={form.aoe_type}
            onValueChange={(v) => set("aoe_type", v === "none" ? "" : v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="None" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {AOE_TYPES.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {form.aoe_type && (
          <div className={sectionClass}>
            <label className={labelClass}>Size (ft)</label>
            <Input
              type="number"
              value={form.aoe_size}
              onChange={(e) => set("aoe_size", e.target.value)}
              placeholder="20"
              min={0}
            />
          </div>
        )}
      </div>

      {/* Saving throw */}
      <div className={sectionClass}>
        <label className={labelClass}>Saving throw</label>
        <Select
          value={form.saving_throw}
          onValueChange={(v) => set("saving_throw", v === "none" ? "" : v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="None" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {SAVING_THROWS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Classes */}
      <div className={sectionClass}>
        <label className={labelClass}>Classes</label>
        <div className="flex flex-wrap gap-3">
          {CLASSES.map((c) => (
            <label key={c} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.classes.includes(c)}
                onChange={() => toggleArrayItem("classes", c)}
                className="accent-rose-500"
              />
              {c}
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-md border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 rounded-md bg-rose-500 py-2 text-sm font-semibold text-white hover:bg-rose-600"
        >
          {initialValues ? "Save changes" : "Add to Pocket"}
        </button>
      </div>

      {/* Delete — only shown when editing */}
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="w-full rounded-md border border-rose-200 py-2 text-sm font-medium text-rose-500 hover:bg-rose-50"
        >
          Delete spell
        </button>
      )}
    </form>
  );
}
